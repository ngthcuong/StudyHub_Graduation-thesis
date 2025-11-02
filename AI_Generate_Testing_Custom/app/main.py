from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from app.render_service import render_test

app = FastAPI(title="AI Engine - English Test Generator")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TestRequest(BaseModel):
    current_level: str                    # A2, B1, B2
    toeic_score: int | None = None        # Optional
    weak_skills: list[str] | None = None  # e.g., ["Grammar", "Vocabulary"]
    exam_type: str = "TOEIC"              # TOEIC | IELTS
    topics: list[str] | None = None       # Grammar or Vocabulary topics
    difficulty: str | None = None         # easier / same / harder
    question_ratio: str = "MCQ"           # "MCQ" or "Gap-fill"
    num_questions: int = 15
    time_limit: int | None = 20           # minutes

@app.post("/generate-test-custom")
async def generate_test_endpoint(req: TestRequest):
    try:
        result = await render_test(
            current_level=req.current_level,
            toeic_score=req.toeic_score,
            weak_skills=req.weak_skills,
            exam_type=req.exam_type,
            topics=req.topics,
            difficulty=req.difficulty,
            question_ratio=req.question_ratio,
            num_questions=req.num_questions,
            time_limit=req.time_limit
        )
        return {"status": "success", "data": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}
