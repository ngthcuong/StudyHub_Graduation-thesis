from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.render_service import render_test

app = FastAPI(title="AI Engine - English Test Renderer")

# Cho phép FE từ bất kỳ domain
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestRequest(BaseModel):
    topic: str
    num_questions: int = 10
    question_types: list = None  # ['multiple_choice','fill_in_blank','rearrange','essay']
    exam_type: str = "TOEIC"     # "TOEIC" | "IELTS"
    score_range: str = None      # "TOEIC 405-600" | "IELTS 6.5-7.0"

@app.post("/generate-test")
async def generate_test_endpoint(req: TestRequest):
    try:
        result = await render_test(
            topic=req.topic,
            num_questions=req.num_questions,
            question_types=req.question_types,
            exam_type=req.exam_type,
            score_range=req.score_range
        )
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
