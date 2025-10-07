from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import date


class TestHistoryItem(BaseModel):
    test_date: date
    level_at_test: str
    score: int
    notes: Optional[str]

class LearningProfile(BaseModel):
    student_id: str
    name: str
    current_level: str
    study_hours_per_week: int
    learning_goals: str
    learning_preferences: List[str]
    study_methods: List[str]
    test_history: List[TestHistoryItem]

class QuestionKey(BaseModel):
    id: int
    question: Optional[str] = None 
    answer: str
    skill: Optional[str] = None
    topic: Optional[str] = None


class TestInfo(BaseModel):
    title: Optional[str] = None
    total_questions: Optional[int] = None


class GradeRequest(BaseModel):
    test_info: Optional[TestInfo] = None
    answer_key: List[QuestionKey]
    student_answers: Dict[int, str]
    use_gemini: Optional[bool] = False
    profile: Optional[LearningProfile]


class PerQuestionResult(BaseModel):
    id: int
    question: Optional[str] = None 
    correct: bool
    expected_answer: str
    user_answer: Optional[str] = None
    skill: Optional[str] = None
    topic: Optional[str] = None
    explain: Optional[str] = None


class SkillSummary(BaseModel):
    skill: str
    total: int
    correct: int
    accuracy: float


class GradeResponse(BaseModel):
    total_score: int
    total_questions: int
    per_question: List[PerQuestionResult]
    skill_summary: List[SkillSummary]
    weak_topics: List[str]
    recommendations: Optional[List[str]] = None
    personalized_plan: Optional[Any] = None