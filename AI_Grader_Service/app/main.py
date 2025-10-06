from fastapi import FastAPI, HTTPException
from .schemas import GradeRequest, GradeResponse, PerQuestionResult, SkillSummary
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
                    if isinstance(item.get("test_date"), (str,)):
                        continue
                    if item.get("test_date") is not None:
                        item["test_date"] = item["test_date"].isoformat()
            return profile_dict

        if req.use_gemini:
            payload = {
                "test_info": req.test_info.dict() if req.test_info else {},
                "answer_key": [q.dict() for q in req.answer_key],
                "student_answers": req.student_answers,
                "profile": serialize_profile(req.profile) or {}
            }

            gemini_resp = await call_gemini_analysis(payload)

            # Validate gemini_resp and map fields into our response.
            if isinstance(gemini_resp, dict):
                # per_question: if present, prefer Gemini's; otherwise keep local
                if "per_question" in gemini_resp and isinstance(gemini_resp["per_question"], list):
                    # convert items to PerQuestionResult-compatible dicts
                    new_per_q = []
                    for item in gemini_resp["per_question"]:
                        # ensure keys exist
                        new_item = {
                            "id": item.get("id"),
                            "question": item.get("question"),
                            "correct": item.get("correct", False),
                            "expected_answer": item.get("expected_answer"),
                            "user_answer": item.get("user_answer"),
                            "skill": item.get("skill"),
                            "topic": item.get("topic"),
                            "explain": item.get("explain")
                        }
                        new_per_q.append(new_item)
                    per_q = [PerQuestionResult(**p) for p in new_per_q]

                # skill_summary
                if "skill_summary" in gemini_resp and isinstance(gemini_resp["skill_summary"], list):
                    skill_summary = [SkillSummary(**s) for s in gemini_resp["skill_summary"]]

                # weak topics
                if "weak_topics" in gemini_resp:
                    weak_topics = gemini_resp.get("weak_topics") or []

                # recommendations & personalized_plan
                recommendations = gemini_resp.get("recommendations")
                personalized_plan = gemini_resp.get("personalized_plan")

                # If gemini returns total_score/total_questions, prefer those
                if "total_score" in gemini_resp:
                    total_correct = gemini_resp.get("total_score", total_correct)
                if "total_questions" in gemini_resp:
                    total_qs = gemini_resp.get("total_questions", total_qs)

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
        # Keep error simple but informative
        raise HTTPException(status_code=500, detail=str(e))
