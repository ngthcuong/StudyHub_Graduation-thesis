from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field
from datetime import date

# ==========================================
# 1. CÁC CLASS CON (CHO GEMINI OUTPUT)
# ==========================================

class ProgressTrend(BaseModel):
    past_tests: int
    accuracy_growth_rate: float
    strong_skills: List[str]
    weak_skills: List[str]
    consistency_index: float
    # [THÊM] Để vẽ biểu đồ đường ở Frontend nếu cần
    scores_trajectory: Optional[List[float]] = [] 

class ProgressSpeed(BaseModel):
    category: str
    description: str
    trend: ProgressTrend
    predicted_reach_next_level_weeks: int
    recommendation: str

class WeeklyGoal(BaseModel):
    week: int
    topic: str
    description: str
    study_methods: List[str]
    materials: List[str]
    hours: int

class PersonalizedPlan(BaseModel):
    progress_speed: ProgressSpeed
    weekly_goals: List[WeeklyGoal]

# [THÊM] Class cho dự đoán kỹ năng (Khớp với Prompt)
class SkillEstimate(BaseModel):
    skill: str
    current_level: str
    confidence: str
    predicted_gain_weeks: int

class ProficiencyPrediction(BaseModel):
    skill_estimates: List[SkillEstimate]

# ==========================================
# 2. CÁC CLASS CẤU TRÚC ĐỀ THI & CHẤM ĐIỂM
# ==========================================

class QuestionKey(BaseModel):
    id: int
    question: Optional[str] = None 
    answer: str
    skill: Optional[str] = None
    topic: Optional[str] = None

class TestInfo(BaseModel):
    title: Optional[str] = None
    total_questions: Optional[int] = None

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

# ==========================================
# 3. CLASS INPUT & OUTPUT CHÍNH
# ==========================================

class TestHistoryItem(BaseModel):
    test_date: Optional[str] = None
    level_at_test: Optional[str] = "Unknown"
    # Các trường để tính toán Trend
    total_score: Optional[float] = 0.0
    total_questions: Optional[int] = 0
    score_percentage: Optional[float] = 0.0
    per_question: List[PerQuestionResult] = []
    weak_topics: List[str] = []

class LearningProfile(BaseModel):
    student_id: str
    name: str
    current_level: str
    study_hours_per_week: int
    learning_goals: str
    learning_preferences: List[str]
    study_methods: List[str]
    test_history: List[TestHistoryItem]

class GradeRequest(BaseModel):
    test_info: Optional[TestInfo] = None
    answer_key: List[QuestionKey]
    student_answers: Dict[str, str]
    use_gemini: Optional[bool] = False
    profile: Optional[LearningProfile]

class GradeResponse(BaseModel):
    total_score: int
    total_questions: int
    per_question: List[PerQuestionResult]
    skill_summary: List[SkillSummary]
    weak_topics: List[str]
    
    # Các trường AI tạo ra
    current_level: str 
    post_test_level: str
    recommendations: Optional[List[str]] = None
    personalized_plan: Optional[PersonalizedPlan] = None 
    
    # [THÊM] Hứng thêm dữ liệu từ AI
    proficiency_prediction: Optional[ProficiencyPrediction] = None 
    monitoring_alerts: Optional[List[str]] = []