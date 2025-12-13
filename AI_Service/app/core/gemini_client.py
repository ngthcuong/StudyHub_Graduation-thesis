import os
import json
import httpx
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv(override=True)
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# --- QUAN TRỌNG: Dùng Model 1.5 Flash (Bản ổn định & nhanh nhất hiện nay) ---
# Đã sửa lại URL thành 1.5-flash để tránh lỗi 404
GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

def _build_prompt(payload: Dict[str, Any], local_results: Dict[str, Any]) -> str:
    """
    Xây dựng prompt dựa trên Profile, Kết quả chấm và Trend đã tính toán.
    """
    profile = payload.get("profile", {})
    
    # Lấy dữ liệu đã chấm từ Local
    score = local_results.get("total_score", 0)
    total = local_results.get("total_questions", 0)
    weak_topics = local_results.get("weak_topics", [])
    skill_summary = local_results.get("skill_summary", [])
    
    # Lấy dữ liệu Trend đã tính toán bằng Python (QUAN TRỌNG)
    trend_analysis = local_results.get("trend_analysis", {})
    
    # Tính % chính xác để Gemini dễ tham chiếu
    accuracy = (score / total * 100) if total > 0 else 0.0

    # Chỉ dẫn thang điểm
    scales_text = (
        "STRICT OUTPUT RULES for 'post_test_level':\n"
        "You MUST return exactly one of the specific strings below based on performance. Do NOT return 'A1', 'B1', etc.\n\n"
        "Valid TOEIC Levels:\n"
        "- 'TOEIC 10-250'\n"
        "- 'TOEIC 255-400'\n"
        "- 'TOEIC 405-600'\n"
        "- 'TOEIC 605-780'\n"
        "- 'TOEIC 785-900'\n"
        "- 'TOEIC 905-990'\n\n"
        "Valid IELTS Levels:\n"
        "- 'IELTS 0-3.5'\n"
        "- 'IELTS 4.0-5.0'\n"
        "- 'IELTS 5.5-6.0'\n"
        "- 'IELTS 6.5-7.0'\n"
        "- 'IELTS 7.5-8.0'\n"
        "- 'IELTS 8.5-9.0'\n"
    )


    prompt = (
        "Bạn là một trợ lý AI, chuyên gia giáo dục Tiếng Anh (English Tutor).\n"
        "Nhiệm vụ: Phân tích kết quả bài thi và đưa ra lộ trình học cá nhân hóa.\n\n"
        
        "QUY TẮC QUAN TRỌNG VỀ NGÔN NGỮ (LANGUAGE RULES):\n"
        "1. Toàn bộ giá trị trong JSON output (description, recommendations, study_methods, category,...) PHẢI LÀ TIẾNG VIỆT.\n"
        "2. Riêng các thuật ngữ chuyên ngành (như tên thì 'Past Simple', 'Future Perfect', 'TOEIC') có thể giữ nguyên tiếng Anh hoặc mở ngoặc chú thích.\n"
        "3. Tuyệt đối tuân thủ JSON Schema được yêu cầu bên dưới.\n\n"

        "DỮ LIỆU ĐẦU VÀO (ĐÃ CHẤM ĐIỂM & TÍNH TOÁN):\n"
        f"- Hồ sơ học viên: {json.dumps({k:v for k,v in profile.items() if k != 'test_history'}, ensure_ascii=False)}\n"
        f"- Điểm số: {score}/{total} ({accuracy:.1f}%)\n"
        f"- Các chủ đề yếu: {json.dumps(weak_topics, ensure_ascii=False)}\n"
        f"- Thống kê kỹ năng: {json.dumps(skill_summary, ensure_ascii=False)}\n"
        f"- Phân tích xu hướng (Trend): {json.dumps(trend_analysis, ensure_ascii=False)}\n\n"

        "YÊU CẦU CỤ THỂ:\n"
        "1. Xác định 'post_test_level' (Trình độ sau bài thi) dựa trên thang điểm TOEIC/IELTS.\n"
        "2. Phân tích 'weak_topics' để đưa ra 'recommendations' (Lời khuyên) cụ thể bằng Tiếng Việt.\n"
        "3. Tạo 'personalized_plan' (Kế hoạch học tập):\n"
        "   - Chỉ lập 'weekly_goals' cho 3 TUẦN KẾ TIẾP (Next 3 weeks only) để tập trung cải thiện ngay lập tức.\n"
        "   - 'progress_speed': Nhận xét tốc độ tiến bộ (ví dụ: 'đang tăng tốc', 'ổn định', 'cần cố gắng') và giải thích chi tiết bằng tiếng Việt.\n"
        "   - 'weekly_goals': Lập mục tiêu hàng tuần để khắc phục điểm yếu.\n"
        "     + 'description': Mô tả chi tiết hành động cần làm (Tiếng Việt).\n"
        "     + 'materials': Tìm 2-3 video YouTube chất lượng liên quan. Nếu không chắc chắn về URL, hãy tạo search URL (VD: 'https://www.youtube.com/results?search_query=...').\n"
        "4. Output bắt buộc là JSON hợp lệ.\n\n"

        "JSON SCHEMA YÊU CẦU:\n"
        "{\n"
        "  \"post_test_level\": string, \n"
        "  \"current_level\": string, \n"
        "  \"recommendations\": [string], \n"
        "  \"weak_topics_refined\": [string], \n"
        "  \"personalized_plan\": {\n"
        "      \"progress_speed\": {\n"
        "          \"category\": string, // 'tăng tốc', 'ổn định', 'giảm sút'\n"
        "          \"description\": string, // Giải thích tiếng Việt\n"
        "          \"trend\": {\n"
        "               \"past_tests\": int,\n"
        "               \"accuracy_growth_rate\": float,\n"
        "               \"strong_skills\": [string],\n"
        "               \"weak_skills\": [string],\n"
        "               \"consistency_index\": float\n"
        "          },\n"
        "          \"predicted_reach_next_level_weeks\": int,\n"
        "          \"recommendation\": string // Lời khuyên tiếng Việt\n"
        "      },\n"
        "      \"weekly_goals\": [\n"
        "          {\n"
        "              \"week\": int,\n"
        "              \"topic\": string,\n"
        "              \"description\": string, // Mô tả tiếng Việt\n"
        "              \"study_methods\": [string], // Phương pháp học tiếng Việt\n"
        "              \"materials\": [\n"
        "                 { \"title\": string, \"url\": string }\n"
        "              ],\n"
        "              \"hours\": int\n"
        "          }\n"
        "      ]\n"
        "  },\n"
        "  \"proficiency_prediction\": {\n"
        "      \"skill_estimates\": [\n"
        "          {\"skill\": string, \"current_level\": string, \"confidence\": string, \"predicted_gain_weeks\": int}\n"
        "      ]\n"
        "  },\n"
        "  \"monitoring_alerts\": [string] // Cảnh báo tiếng Việt\n"
        "}\n"
    )
    return prompt

def _extract_text_from_response(data: Dict[str, Any]) -> Optional[str]:
    """Helper để lấy text từ response của Gemini"""
    try:
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        return None

async def call_gemini_analysis(payload: Dict[str, Any], local_results: Dict[str, Any]) -> Dict[str, Any]:
    """
    Gọi Gemini API để phân tích.
    Args:
        payload: Dữ liệu bài test và profile (từ request gốc)
        local_results: Kết quả chấm điểm + Trend analysis (từ main.py)
    """
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in environment")

    # 1. Build Prompt với dữ liệu local (bao gồm Trend)
    prompt_text = _build_prompt(payload, local_results)
    
    url = f"{GEMINI_URL}?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}

    # 2. Config Request: BẬT JSON MODE
    body = {
        "contents": [
            {
                "parts": [{"text": prompt_text}]
            }
        ],
        "generationConfig": {
            "response_mime_type": "application/json", # Quan trọng: Ép trả về JSON
            "temperature": 0.3 # Thấp để ổn định logic
        }
    }

    # 3. Timeout settings
    timeout = httpx.Timeout(connect=5.0, read=45.0, write=10.0, pool=10.0)

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(url, headers=headers, json=body)
            
            if resp.status_code != 200:
                print(f"❌ GEMINI API ERROR: {resp.status_code} - {resp.text}")
                resp.raise_for_status()
                
            data = resp.json()
            
    except httpx.RequestError as re:
        raise RuntimeError(f"Network error calling Gemini: {str(re)}")
    except httpx.HTTPStatusError as he:
        raise RuntimeError(f"Gemini API returned error: {he.response.status_code}")

    # 4. Parse Response
    text_output = _extract_text_from_response(data)
    if not text_output:
        raise RuntimeError("Gemini returned empty response text")

    # Clean text (dù JSON mode khá sạch nhưng vẫn nên clean)
    text_output = text_output.strip()
    if text_output.startswith("```"):
        text_output = text_output.strip("`").lstrip("json").strip()

    try:
        return json.loads(text_output)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"Failed to parse JSON from Gemini: {e}\nRaw output: {text_output[:200]}...")