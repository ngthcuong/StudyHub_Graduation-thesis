import os
import json
import httpx
from typing import Dict, Any
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

def call_gemini_analysis(payload: Dict[str, Any]) -> Dict[str, Any]:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in environment; cannot call Gemini")

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}

    body = {
    "contents": [
        {
            "parts": [
                {
                    "text": (
                        "You are an intelligent English learning coach.\n"
                        "Based on the student's profile, test history, current test results, "
                        "please do the following:\n"
                        "- Grade the test and summarize performance by skill and topic.\n"
                        "- Predict the student's learning progress speed.\n"
                        "- Generate a personalized study plan with weekly goals and recommended study methods/materials.\n"
                        "- Tailor the plan to student's preferences and available weekly study hours.\n"
                        "Return ONLY valid JSON with fields: total_score, per_question, skill_summary, weak_topics, recommendations, personalized_plan.\n"
                        f"Student Profile: {json.dumps(payload.get('profile', {}))}\n"
                        f"Test Info: {json.dumps(payload.get('test_info', {}))}\n"
                        f"Answer Key: {json.dumps(payload.get('answer_key', []))}\n"
                        f"Student Answers: {json.dumps(payload.get('student_answers', {}))}\n"
                        f"Test History: {json.dumps(payload.get('profile', {}).get('test_history', []))}\n"
                    )
                }
            ]
        }
    ]
}


    resp = httpx.post(url, headers=headers, json=body, timeout=30.0)
    resp.raise_for_status()

    data = resp.json()
    try:
        text_output = data["candidates"][0]["content"]["parts"][0]["text"].strip()

        # Gỡ bỏ ```json và ```
        if text_output.startswith("```"):
            text_output = text_output.strip("`").lstrip("json").strip()
        
        return json.loads(text_output)

    except Exception as e:
        raise RuntimeError(f"Invalid response format from Gemini: {e}\nFull response: {data}")

