from fastapi import FastAPI, HTTPException
from .schemas import GradeRequest, GradeResponse
from .grader import grade_locally
from .gemini_client import call_gemini_analysis

app = FastAPI(title="AI Grader Service")


@app.post("/grade", response_model=GradeResponse)
async def grade_endpoint(req: GradeRequest):
    try:
        total_correct, total_qs, per_q, skill_summary, weak_topics = grade_locally(
            req.answer_key, req.student_answers
        )

        recommendations = None
        personalized_plan = None

        def serialize_profile(profile):
            if not profile:
                return None
            profile_dict = profile.dict()
            if "test_history" in profile_dict:
                for item in profile_dict["test_history"]:
                    if isinstance(item["test_date"], (str,)):
                        continue
                    item["test_date"] = item["test_date"].isoformat()
            return profile_dict

        if req.use_gemini:
            payload = {
                "test_info": req.test_info.dict() if req.test_info else {},
                "answer_key": [q.dict() for q in req.answer_key],
                "student_answers": req.student_answers,
                "profile": serialize_profile(req.profile) or {}
            }
            gemini_resp = call_gemini_analysis(payload)

            if isinstance(gemini_resp, dict):
                recommendations = gemini_resp.get("recommendations")
                personalized_plan = gemini_resp.get("personalized_plan")

        resp = GradeResponse(
            total_score=total_correct,
            total_questions=total_qs,
            per_question=per_q,
            skill_summary=skill_summary,
            weak_topics=weak_topics,
            recommendations=recommendations,
            personalized_plan=personalized_plan
        )
        return resp

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

