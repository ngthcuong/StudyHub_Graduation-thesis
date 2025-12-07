from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from typing import Optional, List, Any
import statistics # Thư viện toán học tiêu chuẩn

# Import các module nội bộ
from .schemas import GradeRequest, GradeResponse, PersonalizedPlan
from .grader import grade_locally
from .gemini_client import call_gemini_analysis
from .material_mapper import get_materials_from_database

app = FastAPI(title="AI Grader Service")

def calculate_trend_metrics(history: List[Any], current_score_percent: float):
    """
    Hàm Python thuần để tính toán xu hướng học tập.
    Thay thế việc để Gemini tự đoán số liệu.
    """
    # 1. Thu thập dãy điểm số (Lịch sử + Hiện tại)
    scores = []
    
    # Lấy điểm từ lịch sử (xử lý cả Pydantic model và dict)
    for h in history:
        val = None
        if hasattr(h, 'score_percentage'): # Pydantic object
            val = h.score_percentage
        elif isinstance(h, dict): # Dict
            val = h.get('score_percentage')
            
        if val is not None:
            scores.append(float(val))
            
    # Thêm điểm bài hiện tại vào cuối danh sách
    scores.append(current_score_percent)

    n = len(scores)
    
    # Mặc định nếu không đủ dữ liệu
    if n < 2:
        return {
            "past_tests": 0,
            "accuracy_growth_rate": 0.0,
            "consistency_index": 1.0, # 1 bài thì coi như ổn định tuyệt đối
            "scores_trajectory": scores
        }

    # 2. Tính Tốc độ Tăng trưởng (Growth Rate)
    # Công thức: (Điểm mới nhất - Điểm cũ nhất) / Tổng số bài
    # Dương là tăng, Âm là giảm
    growth_rate = (scores[-1] - scores[0]) / n

    # 3. Tính Độ ổn định (Consistency Index) dựa trên Độ lệch chuẩn (Stdev)
    # Độ lệch chuẩn càng thấp -> Phong độ càng ổn định
    try:
        stdev = statistics.stdev(scores)
        # Chuẩn hóa: Giả sử độ lệch > 25% là rất mất ổn định (Index = 0)
        # Index chạy từ 0.0 (Tệ) đến 1.0 (Rất ổn định)
        consistency = max(0.0, 1.0 - (stdev / 25.0))
    except:
        consistency = 1.0

    return {
        "past_tests": n - 1,
        "accuracy_growth_rate": round(growth_rate, 2),
        "consistency_index": round(consistency, 2),
        "scores_trajectory": scores # Gửi dãy điểm cho AI tham khảo
    }

@app.post("/grade", response_model=GradeResponse)
async def grade_endpoint(req: GradeRequest):
    try:
        # ==================================================================
        # BƯỚC 1: CHẤM ĐIỂM LOCAL (Tốc độ mili-giây)
        # ==================================================================
        total_correct, total_qs, per_q, skill_summary, weak_topics = grade_locally(
            req.answer_key, req.student_answers
        )

        # Tính % điểm hiện tại ngay lập tức
        current_score_percent = (total_correct / total_qs * 100) if total_qs > 0 else 0.0

        # Khởi tạo giá trị mặc định
        recommendations = []
        personalized_plan = None
        post_test_level = "Determining..."
        current_level = req.profile.current_level if req.profile else "Unknown"
        final_weak_topics = weak_topics 

        # ==================================================================
        # BƯỚC 2: GỌI GEMINI (Chỉ khi client yêu cầu)
        # ==================================================================
        if req.use_gemini:
            try:
                # --- A. Tính toán Trend bằng Python (FIX QUAN TRỌNG) ---
                # Lấy lịch sử thô từ request
                raw_history = req.profile.test_history if req.profile else []
                # Tính toán số liệu chính xác
                trend_data = calculate_trend_metrics(raw_history, current_score_percent)

                # --- B. Chuẩn bị dữ liệu Profile ---
                profile_data = jsonable_encoder(req.profile) if req.profile else {}
                
                # Tối ưu token: Xóa per_question trong lịch sử cũ
                if "test_history" in profile_data:
                    for h in profile_data["test_history"]:
                        if "per_question" in h: 
                            del h["per_question"]

                gemini_payload = {"profile": profile_data}

                # --- C. Chuẩn bị dữ liệu Kết quả Chấm & Trend ---
                skill_summary_dicts = [s.dict() for s in skill_summary]

                local_results_data = {
                    "total_score": total_correct,
                    "total_questions": total_qs,
                    "score_percentage": round(current_score_percent, 2), # Gửi điểm %
                    "weak_topics": weak_topics,
                    "skill_summary": skill_summary_dicts,
                    "trend_analysis": trend_data  # <--- GỬI DỮ LIỆU TREND ĐÃ TÍNH
                }

                # --- D. Gọi AI ---
                # Hàm call_gemini_analysis nhận payload đã có trend_analysis
                ai_data = await call_gemini_analysis(gemini_payload, local_results_data)

                # --- E. Xử lý kết quả trả về từ AI ---
                post_test_level = ai_data.get("post_test_level", "Unknown")
                
                if "current_level" in ai_data:
                    current_level = ai_data["current_level"]

                recommendations = ai_data.get("recommendations", [])
                
                if "weak_topics_refined" in ai_data and ai_data["weak_topics_refined"]:
                    final_weak_topics = ai_data["weak_topics_refined"]

                # --- F. Xử lý Personalized Plan & Map Tài Liệu ---
                plan_data = ai_data.get("personalized_plan")
                
                if plan_data and isinstance(plan_data, dict):
                    # Inject lại số liệu Python tính vào Plan của AI (để đảm bảo hiển thị đúng số)
                    # Vì đôi khi AI vẫn có thể hallucinate số liệu dù đã được cung cấp
                    if "progress_speed" in plan_data and "trend" in plan_data["progress_speed"]:
                         ai_trend = plan_data["progress_speed"]["trend"]
                         # Ghi đè số liệu chính xác từ Python vào kết quả AI
                         ai_trend["accuracy_growth_rate"] = trend_data["accuracy_growth_rate"]
                         ai_trend["consistency_index"] = trend_data["consistency_index"]
                         ai_trend["past_tests"] = trend_data["past_tests"]

                    # Mapping tài liệu
                    if "weekly_goals" in plan_data:
                        for goal in plan_data["weekly_goals"]:
                            detected_skill = "Grammar" 
                            goal_topic_str = goal.get("topic", "").lower()
                            
                            for s in skill_summary:
                                if s.skill.lower() in goal_topic_str:
                                    detected_skill = s.skill
                                    break
                            
                            materials_from_db = get_materials_from_database(detected_skill, weak_topics)
                            goal["materials"] = materials_from_db

                    personalized_plan = plan_data

            except Exception as e:
                print(f"⚠️ GEMINI ANALYSIS FAILED: {str(e)}")
                recommendations = ["AI analysis unavailable. Showing grading results only."]
                post_test_level = "Unknown (AI Error)"

        # ==================================================================
        # BƯỚC 3: TRẢ VỀ KẾT QUẢ
        # ==================================================================
        return GradeResponse(
            total_score=total_correct,
            total_questions=total_qs,
            per_question=per_q,
            skill_summary=skill_summary,
            weak_topics=final_weak_topics,
            recommendations=recommendations,
            personalized_plan=personalized_plan,
            current_level=current_level,
            post_test_level=post_test_level
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")