from fastapi import FastAPI, HTTPException
from fastapi.encoders import jsonable_encoder
from .schemas import GradeRequest, GradeResponse, PerQuestionResult, SkillSummary
from .grader import grade_locally
from .gemini_client import call_gemini_analysis
from .material_mapper import get_materials_from_database
from .schemas import PersonalizedPlan

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
                return {}
            profile_dict = jsonable_encoder(profile)
            # chỉ giữ per_question + weak_topics
            for item in profile_dict.get("test_history", []):
                if "score" in item:
                    del item["score"]
                if "notes" in item:
                    del item["notes"]
            return profile_dict

        gemini_resp = {}
        if req.use_gemini:
            payload = {
                "test_info": req.test_info.dict() if req.test_info else {},
                "answer_key": [q.dict() for q in req.answer_key],
                "student_answers": req.student_answers,
                "profile": serialize_profile(req.profile)
            }

            gemini_resp = await call_gemini_analysis(payload)

            # map Gemini output
            if "per_question" in gemini_resp:
                per_q = [PerQuestionResult(**p) for p in gemini_resp["per_question"]]
            if "skill_summary" in gemini_resp:
                skill_summary = [SkillSummary(**s) for s in gemini_resp["skill_summary"]]
            if "weak_topics" in gemini_resp:
                weak_topics = gemini_resp["weak_topics"]

            recommendations = gemini_resp.get("recommendations")
            personalized_plan_data = gemini_resp.get("personalized_plan")
            personalized_plan = None
            if personalized_plan_data:
                try:
                    personalized_plan = PersonalizedPlan(**personalized_plan_data)
                except Exception as e:
                    print(f"[WARN] Could not parse personalized_plan: {e}")
                    personalized_plan = personalized_plan_data  # fallback dạng raw dict

            if personalized_plan:
                # Nếu personalized_plan có weekly_goals thì xử lý như cũ
                if isinstance(personalized_plan, dict) and "weekly_goals" in personalized_plan:
                    for goal in personalized_plan["weekly_goals"]:
                        skill_detected = "Grammar"
                        for s in skill_summary:
                            if s.skill in goal.get("topic", ""):
                                skill_detected = s.skill
                                break
                        goal["materials"] = get_materials_from_database(skill_detected, weak_topics)
                    # Nếu không có weekly_goals (ví dụ plan dạng progress_speed)
                else:
                    # chọn skill chính để lấy materials
                    main_skill = skill_summary[0].skill if skill_summary else "Grammar"
                    materials = get_materials_from_database(main_skill, weak_topics)

                    # ép personalized_plan thành dict (đề phòng là pydantic model)
                    if hasattr(personalized_plan, "dict"):
                        personalized_plan = personalized_plan.dict()

                    # thêm materials vào personalized_plan
                    personalized_plan["materials"] = materials

            total_correct = gemini_resp.get("total_score", total_correct)
            total_qs = gemini_resp.get("total_questions", total_qs)

        resp = GradeResponse(
            total_score=total_correct,
            total_questions=total_qs,
            per_question=per_q,
            skill_summary=skill_summary,
            weak_topics=weak_topics,
            recommendations=recommendations,
            personalized_plan=personalized_plan,
            current_level=gemini_resp.get("current_level", req.profile.current_level if req.profile else "Unknown"),
            post_test_level=gemini_resp.get("post_test_level", "Unknown")
        )
        return resp

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
