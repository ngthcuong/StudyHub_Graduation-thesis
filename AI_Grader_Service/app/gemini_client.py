import os
import json
import httpx
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

# Use the API key from env (do NOT hardcode). If you still need to use a direct key,
# set GEMINI_API_KEY in your .env to that key.
if not GEMINI_API_KEY:
    # Note: we don't raise here so unit tests can run without key if not calling gemini.
    pass

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent"

def _build_prompt(payload: Dict[str, Any]) -> str:
    """
    Construct a robust prompt instructing Gemini to return ONLY valid JSON
    with the fields we need: total_score, per_question (with explain), skill_summary,
    weak_topics, recommendations, personalized_plan, proficiency_prediction, monitoring_alerts.
    """
    # We include payload json as a compact string to provide context
    profile = payload.get("profile", {})
    test_info = payload.get("test_info", {})
    answer_key = payload.get("answer_key", [])
    student_answers = payload.get("student_answers", {})

    prompt = (
        "You are an expert English learning coach and exam grader. "
        "Your task: analyze the student's answers, grade the test, and produce a detailed,"
        " teacher-style explanation for each question (why the expected answer is correct"
        " and why any incorrect student answer is incorrect). Also produce skill-level"
        " predictions, monitoring alerts and a detailed personalized study plan for the"
        " next several weeks. RETURN ONLY VALID JSON (no extra text) with the EXACT fields below.\n\n"

        "REQUIRED OUTPUT SCHEMA (exact keys):\n"
        "{\n"
        "  \"total_score\": int,            // number of correct answers\n"
        "  \"total_questions\": int,\n"
        "  \"per_question\": [              // list of objects, one per question\n"
        "    {\n"
        "      \"id\": int,\n"
        "      \"question\": string or null,\n"
        "      \"correct\": boolean,\n"
        "      \"expected_answer\": string,\n"
        "      \"user_answer\": string or null,\n"
        "      \"skill\": string or null,\n"
        "      \"topic\": string or null,\n"
        "      \"explain\": string   // 1-3 sentences: identify grammar pattern, explain why expected is correct, why student answer is wrong (if wrong), give a short example\n"
        "    }\n"
        "  ],\n"
        "  \"skill_summary\": [            // aggregated by skill\n"
        "    {\"skill\": string, \"total\": int, \"correct\": int, \"accuracy\": float}\n"
        "  ],\n"
        "  \"weak_topics\": [string],      // top 3 weak topics\n"
        "  \"recommendations\": [string],  // short list of suggestions\n"
        "  \"personalized_plan\": {        // structured plan for next weeks\n"
        "    \"progress_speed\": string,   // e.g. 'Slow', 'Moderate', 'Fast'\n"
        "    \"weekly_goals\": [\n"
        "      {\"week\": int, \"topic\": string, \"description\": string, \"study_methods\": [string], \"materials\": [string], \"hours\": int}\n"
        "    ]\n"
        "  },\n"
        "  \"proficiency_prediction\": {   // per-skill estimated current mastery and predicted improvement rate\n"
        "    \"skill_estimates\": [{\"skill\": string, \"current_level\": string, \"confidence\": string, \"predicted_gain_weeks\": int}]\n"
        "  },\n"
        "  \"monitoring_alerts\": [string] // e.g. 'Significant drop in listening compared to last test', or empty list\n"
        "}\n\n"

        "Rules for 'explain' field (VERY IMPORTANT):\n"
        "- Must be 1-3 clear sentences in English (unless otherwise requested).\n"
        "- Explain the underlying grammar pattern (e.g. 'tag question: negative main clause -> positive tag', 'present perfect vs simple past', 'subject-verb agreement').\n"
        "- State specifically why the expected answer is correct and why the student's answer is incorrect if wrong (e.g. 'double negative', 'wrong auxiliary', 'pronoun mismatch', 'tense mismatch').\n"
        "- Provide a single short example sentence showing correct usage.\n\n"

        "Context (JSON):\n"
        f"Student Profile: {json.dumps(profile)}\n"
        f"Test Info: {json.dumps(test_info)}\n"
        f"Answer Key: {json.dumps(answer_key)}\n"
        f"Student Answers: {json.dumps(student_answers)}\n\n"

        "Produce JSON that exactly follows the schema above. Do not add any commentary, titles, or code fences. "
        "If some optional fields are not relevant, still include them but use empty lists or nulls as appropriate."
    )
    return prompt

def _extract_text_from_response(data: Dict[str, Any]) -> Optional[str]:
    """
    Given the raw HTTP response JSON from Gemini, attempt to extract the assistant text.
    Handles a few possible response shapes.
    """
    # Expected shape: data["candidates"][0]["content"]["parts"][0]["text"]
    try:
        # common current shape
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception:
        # try other shapes: some models return "output" or "result"
        # best-effort search for any string in nested dict
        def find_str(obj):
            if isinstance(obj, str):
                return obj
            if isinstance(obj, dict):
                for v in obj.values():
                    res = find_str(v)
                    if res:
                        return res
            if isinstance(obj, list):
                for item in obj:
                    res = find_str(item)
                    if res:
                        return res
            return None
        return find_str(data)

async def call_gemini_analysis(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    Async version: Send payload to Gemini and return parsed JSON following the REQUIRED OUTPUT SCHEMA.
    Raises RuntimeError if GEMINI_API_KEY is missing or response is invalid.
    """
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in environment; cannot call Gemini")

    prompt_text = _build_prompt(payload)
    url = f"{GEMINI_URL}?key={GEMINI_API_KEY}"
    headers = {"Content-Type": "application/json"}

    body = {
        "contents": [
            {
                "parts": [
                    {"text": prompt_text}
                ]
            }
        ]
    }

    timeout = httpx.Timeout(
        connect=10.0,   # thời gian chờ kết nối
        read=120.0,     # chờ dữ liệu phản hồi
        write=30.0,     # ghi dữ liệu request
        pool=10.0       # lấy connection từ pool
    )

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            resp = await client.post(url, headers=headers, json=body)
            resp.raise_for_status()
    except httpx.RequestError as re:
        raise RuntimeError(f"Network error when calling Gemini: {re}")
    except httpx.HTTPStatusError as he:
        raise RuntimeError(f"Bad response from Gemini: {he.response.status_code} - {he}")

    data = resp.json()
    text_output = _extract_text_from_response(data)
    if not text_output:
        raise RuntimeError(f"Could not extract text from Gemini response. Full response: {json.dumps(data)[:2000]}")

    # clean code fences and leading/trailing markers
    text_output = text_output.strip()
    if text_output.startswith("```"):
        # remove triple backticks and possible language hint
        # e.g. ```json\n{...}\n```
        # strip leading backticks, then if starts with json remove, then strip
        text_output = text_output.strip("`").lstrip("json").strip()

    # final parse
    try:
        parsed = json.loads(text_output)
        # minimal validation: must contain total_score and per_question
        if not isinstance(parsed, dict) or "per_question" not in parsed or "total_score" not in parsed:
            raise RuntimeError(f"Gemini returned JSON but schema mismatch. Parsed keys: {list(parsed.keys())}")
        return parsed
    except json.JSONDecodeError as e:
        # return helpful debug info
        raise RuntimeError(f"Failed to parse JSON from Gemini output: {e}\nOutput:\n{text_output[:4000]}")
