 # FastAPI server để gọi gợi ý qua API

from fastapi import FastAPI
from pydantic import BaseModel # dùng để định nghĩa schema đầu vào (tự động kiểm tra kiểu dữ liệu).
from model.recommend import recommend_learning_path #hàm xử lý logic gợi ý, bạn đã viết trước đó trong file model/recommend.py.

app = FastAPI()

class StudentInput(BaseModel):
    time_available: int
    vocab_score: int
    grammar_score: int
    listening_score: int
    speaking_score: int
    reading_score: int
    writing_score: int

@app.post("/recommend")
def get_recommendation(student: StudentInput):
    input_vector = [
        student.time_available,
        student.vocab_score,
        student.grammar_score,
        student.listening_score,
        student.speaking_score,
        student.reading_score,
        student.writing_score
    ]
    return recommend_learning_path(input_vector)
