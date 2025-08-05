 # FastAPI server để gọi gợi ý qua API

from fastapi import FastAPI
from pydantic import BaseModel
from model.recommend import recommend_learning_path

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
