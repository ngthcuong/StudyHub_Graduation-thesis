# app_gemini.py
import os, asyncio, re, uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime
import motor.motor_asyncio
from google import genai  # google-genai SDK

# --- Config ---
API_KEY = os.getenv("GEMINI_API_KEY")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = "custom_test_db"

if not API_KEY:
    raise RuntimeError("Set GEMINI_API_KEY env var first")

# --- Init clients ---
client_genai = genai.Client(vertexai=False, api_key=API_KEY)  # vertexai=True for Vertex mode. See docs.
mongo = motor.motor_asyncio.AsyncIOMotorClient(MONGO_URI)
db = mongo[DB_NAME]

app = FastAPI(title="Custom Test + Gemini (MCQ & Gap-fill)")

# --- Models ---
class PreferredTopics(BaseModel):
    grammar: Optional[List[str]] = []
    vocabulary: Optional[List[str]] = []

class Profile(BaseModel):
    currentLevel: str
    toeicScore: Optional[int] = None
    weakSkills: Optional[List[str]] = []
    goals: Optional[List[str]] = []
    preferredTopics: Optional[PreferredTopics] = PreferredTopics()

class TestPreferences(BaseModel):
    questionRatio: Dict[str,int] = {"mcq":70,"gap":30}
    numQuestions: int = 15
    difficultyPreference: str = "same"
    timeLimit: Optional[int] = None

class CreateTestRequest(BaseModel):
    userId: str
    profile: Profile
    testPreferences: TestPreferences

# --- Helpers ---
LEVEL_ORDER = ["A1","A2","B1","B2","C1","C2"]
def map_level_range(level:str, pref:str):
    try:
        idx = LEVEL_ORDER.index(level)
    except ValueError:
        idx = 2
    rng = {LEVEL_ORDER[max(0,idx-1)], LEVEL_ORDER[idx], LEVEL_ORDER[min(len(LEVEL_ORDER)-1, idx+1)]}
    if pref == "harder" and idx+1 < len(LEVEL_ORDER):
        rng.add(LEVEL_ORDER[idx+1])
    if pref == "easier" and idx-1 >= 0:
        rng.add(LEVEL_ORDER[idx-1])
    return list(rng)

def normalize_answer(s:str):
    s = s.lower().strip()
    s = re.sub(r"[^\w'\s]", "", s)
    return s

# --- Gemini helper: generate questions from prompt ---
async def gemini_generate_questions(prompt:str, examples:int=5, model:str="gemini-2.5-flash"):
    """
    Call Gemini to generate structured JSON list of questions (MCQ / Gap-fill).
    We instruct Gemini to return strict JSON with fields: id, type, level, tags, skills, text, options (for mcq), answers.
    """
    # Use synchronous call style via SDK — wrapper for async usage
    resp = client_genai.models.generate_content(model=model, contents=prompt)
    # resp.text() typically returns generated text
    text = resp.text() if hasattr(resp, "text") else str(resp)
    return text

# --- Route: admin add question (optional) ---
@app.post("/questions/add")
async def add_question(q: dict):
    # q should contain id (optional), type, level, tags, skills, text, options/answers
    q_id = q.get("id") or str(uuid.uuid4())
    q["id"] = q_id
    await db.questions.update_one({"id": q_id}, {"$set": q}, upsert=True)
    return {"status":"ok", "id": q_id}

# --- Route: create custom test ---
@app.post("/tests/custom")
async def create_custom_test(req: CreateTestRequest):
    profile = req.profile
    prefs = req.testPreferences

    # 1) compute level range
    lr = map_level_range(profile.currentLevel, prefs.difficultyPreference)

    # 2) try to fetch questions from DB matching tags/levels
    pref_tags = (profile.preferredTopics.grammar or []) + (profile.preferredTopics.vocabulary or [])
    query = {"level": {"$in": lr}}
    if pref_tags:
        query["tags"] = {"$in": pref_tags}

    # fetch candidates
    candidates = await db.questions.find(query).to_list(length=500)
    # categorize
    mcq_cands = [c for c in candidates if c.get("type")=="mcq"]
    gap_cands = [c for c in candidates if c.get("type")=="gap"]

    # 3) decide counts
    num = prefs.numQuestions
    mcq_count = round(num * (prefs.questionRatio.get("mcq",70)/100))
    gap_count = num - mcq_count

    selected = []
    import random
    def sample_or_none(lst, k):
        if not lst:
            return []
        if len(lst) >= k:
            return random.sample(lst, k)
        else:
            return lst.copy()

    selected += sample_or_none(mcq_cands, mcq_count)
    selected += sample_or_none(gap_cands, gap_count)

    # 4) If not enough questions in DB, call Gemini to generate missing ones
    missing = num - len(selected)
    if missing > 0:
        # Build robust prompt instructing Gemini to output strict JSON array
        prompt = f"""
You are a strict JSON generator for TOEIC/IELTS style practice. Return a JSON array of exactly {missing} questions.
Each question must be an object with:
- id: short unique id
- type: "mcq" or "gap"
- level: one of {lr}
- tags: array of short tags like "present_perfect", "conditionals_type2", "business_vocab"
- skills: ["grammar"] or ["vocabulary"]
- text: the question text in English (for gap, use ____ to mark blank)
- options: array of 4 options in English (for mcq)
- answers: array of acceptable answers
- explanation: Detailed explanation in **VIETNAMESE** (Tiếng Việt).

Produce valid JSON ONLY. No commentary.
"""
        gen_text = await asyncio.to_thread(gemini_generate_questions, prompt)
        # try parse JSON from gen_text
        import json
        try:
            arr = json.loads(gen_text)
            # minimal validation
            for q in arr:
                q["id"] = q.get("id") or str(uuid.uuid4())[:8]
                selected.append(q)
                # save generated question into DB for reuse
                await db.questions.update_one({"id": q["id"]}, {"$set": q}, upsert=True)
        except Exception as e:
            # fallback: if parsing fails, return error but continue with what we have
            print("Gemini parse error:", e)
            # As graceful fallback, continue with selected

    # shuffle and cut to requested num
    random.shuffle(selected)
    selected = selected[:num]

    test_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat()
    test_doc = {
        "id": test_id,
        "creatorId": req.userId,
        "profileSnapshot": profile.dict(),
        "settings": prefs.dict(),
        "question_ids": [q["id"] for q in selected],
        "questions": selected,  # store inline for demo; in prod store refs only
        "createdAt": now
    }
    await db.tests.insert_one(test_doc)

    # return summary for frontend
    dist = {"mcq": sum(1 for q in selected if q.get("type")=="mcq"), "gap": sum(1 for q in selected if q.get("type")=="gap")}
    est_time = sum(q.get("time_estimate",30) for q in selected)/60
    return {"testId": test_id, "summary": {"total": len(selected), "distribution": dist, "estTimeMin": round(est_time)}}

# --- Route: get questions (no answers) ---
@app.get("/tests/{test_id}/questions")
async def get_questions(test_id: str):
    test = await db.tests.find_one({"id": test_id})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    # strip answers before returning
    qs = []
    for q in test["questions"]:
        q_no_answer = {k:v for k,v in q.items() if k not in ("answers",)}
        qs.append(q_no_answer)
    return {"testId": test_id, "questions": qs}

# --- Route: submit attempt (basic grading) ---
class MCQAns(BaseModel):
    questionId: str
    selectedOption: str

class GapAns(BaseModel):
    questionId: str
    text: str

class SubmitAttempt(BaseModel):
    testId: str
    userId: str
    mcqAnswers: Optional[List[MCQAns]] = []
    gapAnswers: Optional[List[GapAns]] = []

@app.post("/attempts")
async def submit_attempt(payload: SubmitAttempt):
    test = await db.tests.find_one({"id": payload.testId})
    if not test:
        raise HTTPException(status_code=404, detail="Test not found")
    qmap = {q["id"]: q for q in test["questions"]}
    correct=0; total=len(test["questions"])
    skill_scores = {"grammar": {"score":0,"max":0},"vocabulary":{"score":0,"max":0}}
    # MCQ
    for a in payload.mcqAnswers or []:
        q = qmap.get(a.questionId)
        if not q: continue
        skill = q.get("skills", ["grammar"])[0]
        skill_scores.setdefault(skill, {"score":0,"max":0})
        skill_scores[skill]["max"] += 1
        correct_option = q.get("answers",[q.get("options",[None])[0]])[0]
        if normalize_answer(a.selectedOption) == normalize_answer(correct_option):
            skill_scores[skill]["score"] += 1
            correct += 1
    # Gap-fill
    for a in payload.gapAnswers or []:
        q = qmap.get(a.questionId)
        if not q: continue
        skill = q.get("skills", ["grammar"])[0]
        skill_scores.setdefault(skill, {"score":0,"max":0})
        skill_scores[skill]["max"] += 1
        user_ans = normalize_answer(a.text)
        ok=False
        for cand in q.get("answers",[]):
            if normalize_answer(cand) == user_ans:
                ok=True; break
        if not ok:
            # optional: ask Gemini to judge equivalence (expensive)
            # prompt: "Is '{user_ans}' equivalent to '{correct}'? yes/no"
            pass
        if ok:
            skill_scores[skill]["score"] += 1
            correct += 1

    # compute percents
    skill_pct = {s: round((v["score"]/v["max"]*100) if v["max"]>0 else 0,1) for s,v in skill_scores.items()}
    total_pct = round((correct/total*100),1) if total>0 else 0
    weaknesses = []
    for s,p in skill_pct.items():
        if p < 60:
            severity = "high" if p < 40 else "medium"
            weaknesses.append({"skill":s, "pct":p, "severity":severity})
    attempt_id = str(uuid.uuid4())
    doc = {
        "id": attempt_id, "testId": payload.testId, "userId": payload.userId,
        "correct": correct, "total": total, "pct": total_pct, "skillPct": skill_pct,
        "weaknesses": weaknesses, "submittedAt": datetime.utcnow().isoformat()
    }
    await db.attempts.insert_one(doc)
    return {"attemptId": attempt_id, "result": doc}
