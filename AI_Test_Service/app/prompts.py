def generate_test_prompt(
    topic: str,
    question_types: list = None,
    num_questions: int = 10,
    difficulty: str = "trung bình"
):
    """
    topic: chủ đề của câu hỏi, ví dụ "present simple"
    question_types: danh sách loại câu hỏi ["multiple_choice", "fill_in_blank", "rearrange", "essay"]
    num_questions: số lượng câu hỏi muốn tạo
    difficulty: mức độ khó ("dễ", "trung bình", "khó")
    """

    if question_types is None:
        question_types = ["multiple_choice", "fill_in_blank", "rearrange", "essay"]

    # Map loại câu hỏi sang skill tương ứng
    question_type_to_skill = {
        "multiple_choice": "Grammar",
        "fill_in_blank": "Grammar",
        "rearrange": "Grammar",
        "essay": "Writing"
    }

    # Map loại câu hỏi sang tên hiển thị tiếng Việt
    types_text = {
        "multiple_choice": "Trắc nghiệm 4 lựa chọn",
        "fill_in_blank": "Điền từ",
        "rearrange": "Ghép câu / sắp xếp câu",
        "essay": "Tự luận (ngắn/dài)"
    }

    chosen_types_text = ", ".join([types_text[t] for t in question_types if t in types_text])

    return f"""
Bạn là giáo viên tiếng Anh chuyên TOEIC. 
Hãy tạo {num_questions} câu hỏi độ khó {difficulty} về chủ đề "{topic}".
Các loại câu hỏi cần tạo: {chosen_types_text}

Yêu cầu cho mỗi câu hỏi:
- Chỉ định trường "skill" dựa theo loại câu hỏi:
    * multiple_choice → Grammar
    * fill_in_blank → Grammar
    * rearrange → Grammar
    * essay → Writing
- Thêm trường "topic" là danh sách chứa chủ đề, ví dụ ["{topic}"]
- Mỗi câu phải có đáp án đúng thực tế, không phải ký tự A/B/C/D
- Giải thích chi tiết lý do đúng/sai
- Nếu là multiple_choice, options chỉ là danh sách đáp án thô, không đánh số hoặc ký tự

Chỉ trả về **JSON chuẩn** theo format sau:

{{
    "status": "success",
    "data": [
        {{
            "type": "multiple_choice",  # multiple_choice, fill_in_blank, rearrange, essay
            "skill": "Grammar",         # tự điền theo loại câu hỏi
            "topic": ["{topic}"],       # chủ đề câu hỏi
            "question": "...",
            "options": ["option1", "option2", "option3", "option4"],  # chỉ dành cho multiple_choice
            "answer": "option đúng",
            "explanation": "Chi tiết lý do đúng/sai..."
        }},
        ...
    ]
}}

KHÔNG thêm text thừa, KHÔNG markdown.
"""
