from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from typing import Optional, List, Any
import statistics # Thư viện toán học tiêu chuẩn

# Import các module nội bộ
from .schemas import GradeRequest, GradeResponse, PersonalizedPlan
from .grader import grade_locally
from .gemini_client import call_gemini_analysis

# [THAY ĐỔI 1] Bỏ dòng import này vì không còn dùng mapper thủ công nữa
# from .material_mapper import get_materials_from_database 

app = FastAPI(title="AI Grader Service")

def calculate_trend_metrics(history: List[Any], current_score_percent: float):
    """
    Hàm Python thuần để tính toán xu hướng học tập.
    """
    scores = []
    
    for h in history:
        val = None
        if hasattr(h, 'score_percentage'): 
            val = h.score_percentage
        elif isinstance(h, dict): 
            val = h.get('score_percentage')
            
        if val is not None:
            scores.append(float(val))
            
    scores.append(current_score_percent)

    n = len(scores)
    
    if n < 2:
        return {
            "past_tests": 0,
            "accuracy_growth_rate": 0.0,
            "consistency_index": 1.0, 
            "scores_trajectory": scores
        }

    growth_rate = (scores[-1] - scores[0]) / n

    try:
        stdev = statistics.stdev(scores)
        consistency = max(0.0, 1.0 - (stdev / 25.0))
    except:
        consistency = 1.0

    return {
        "past_tests": n - 1,
        "accuracy_growth_rate": round(growth_rate, 2),
        "consistency_index": round(consistency, 2),
        "scores_trajectory": scores 
    }

@app.post("/grade", response_model=GradeResponse)
async def grade_endpoint(req: GradeRequest):
    try:
        # ==================================================================
        # BƯỚC 1: CHẤM ĐIỂM LOCAL 
        # ==================================================================
        total_correct, total_qs, per_q, skill_summary, weak_topics = grade_locally(
            req.answer_key, req.student_answers
        )

        current_score_percent = (total_correct / total_qs * 100) if total_qs > 0 else 0.0

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
                # --- A. Tính toán Trend bằng Python ---
                raw_history = req.profile.test_history if req.profile else []
                trend_data = calculate_trend_metrics(raw_history, current_score_percent)

                # --- B. Chuẩn bị dữ liệu Profile ---
                profile_data = jsonable_encoder(req.profile) if req.profile else {}
                
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
                    "score_percentage": round(current_score_percent, 2),
                    "weak_topics": weak_topics,
                    "skill_summary": skill_summary_dicts,
                    "trend_analysis": trend_data 
                }

                # --- D. Gọi AI ---
                ai_data = await call_gemini_analysis(gemini_payload, local_results_data)

                # --- E. Xử lý kết quả trả về từ AI ---
                post_test_level = ai_data.get("post_test_level", "Unknown")
                
                if "current_level" in ai_data:
                    current_level = ai_data["current_level"]

                recommendations = ai_data.get("recommendations", [])
                
                if "weak_topics_refined" in ai_data and ai_data["weak_topics_refined"]:
                    final_weak_topics = ai_data["weak_topics_refined"]

                # --- F. Xử lý Personalized Plan ---
                plan_data = ai_data.get("personalized_plan")
                
                if plan_data and isinstance(plan_data, dict):
                    # Inject lại số liệu Python tính vào Plan của AI (Trend metrics)
                    if "progress_speed" in plan_data and "trend" in plan_data["progress_speed"]:
                         ai_trend = plan_data["progress_speed"]["trend"]
                         ai_trend["accuracy_growth_rate"] = trend_data["accuracy_growth_rate"]
                         ai_trend["consistency_index"] = trend_data["consistency_index"]
                         ai_trend["past_tests"] = trend_data["past_tests"]

                    # [THAY ĐỔI 2] Đã XÓA hoàn toàn đoạn code for loop map tài liệu ở đây.
                    # Bây giờ chúng ta tin tưởng hoàn toàn vào dữ liệu "materials" (gồm title và url)
                    # mà Gemini trả về trong plan_data.

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