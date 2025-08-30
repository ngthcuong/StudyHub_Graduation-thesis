def generate_test_prompt(
    topic: str,
    question_types: list = None,
    num_questions: int = 10,
    difficulty: str = "trung bình"
):
    """
    Tạo prompt để Gemini sinh đề thi tiếng Anh tự động
    - topic: chủ điểm (ngữ pháp, từ vựng, kỹ năng TOEIC)
    - question_types: danh sách loại câu hỏi ['multiple_choice','fill_in_blank','rearrange','essay']
    - num_questions: số lượng câu hỏi
    - difficulty: 'dễ', 'trung bình', 'khó'
    """

    if question_types is None:
        question_types = ["multiple_choice", "fill_in_blank", "rearrange", "essay"]

    types_text = {
        "multiple_choice": "Trắc nghiệm 4 lựa chọn",
        "fill_in_blank": "Điền từ",
        "rearrange": "Ghép câu / sắp xếp câu",
        "essay": "Tự luận (ngắn/dài)"
    }

    chosen_types_text = ", ".join([types_text[t] for t in question_types if t in types_text])

    return f"""
Bạn là giáo viên tiếng Anh chuyên TOEIC. 
Hãy tạo {num_questions} câu hỏi độ khó {difficulty} về chủ điểm "{topic}".
Các loại câu hỏi cần tạo: {chosen_types_text}

Mỗi câu phải có:
- Đáp án đúng
- Giải thích chi tiết tại sao đúng/sai

Chỉ trả về **JSON chuẩn**, ví dụ format:

[
{{
    "type": "multiple_choice",  # multiple_choice, fill_in_blank, rearrange, essay
    "question": "...",
    "options": ["A. ...", "B. ...", "C. ...", "D. ..."],  # chỉ dành cho multiple_choice
    "answer": "B",
    "explanation": "Chi tiết lý do đúng/sai..."
}},
...
]
Trả JSON chuẩn, KHÔNG thêm text thừa, KHÔNG markdown.
"""
