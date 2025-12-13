# file prompt.py

def generate_test_prompt(
    current_level: str,
    toeic_score: int | None = None,
    weak_skills: list[str] | None = None,
    exam_type: str = "TOEIC",
    topics: list[str] | None = None,
    difficulty: str | None = None,
    question_ratio: str = "MCQ",
    num_questions: int = 15,
    time_limit: int | None = 20,
):
    weak_skills_str = ", ".join(weak_skills or [])
    topics_str = ", ".join(topics or [])

    return f"""
You are an experienced English exam designer for {exam_type} tests.

Generate {num_questions} questions based on the type: "{question_ratio}".
Each question must reflect the student's learning profile:

- Current level: {current_level}
- TOEIC score: {toeic_score or "N/A"}
- Weak skills: {weak_skills_str}
- Topics: {topics_str}
- Difficulty: {difficulty or "same as level"}

========================
**QUESTION REQUIREMENTS**
========================
1. **GENERAL RULE**: ALL questions MUST provide **4 distinct options**.
2. **LANGUAGE RULE**: 
   - **Question, Options, Answers**: MUST be in **ENGLISH**.
   - **Explanation**: MUST be in **VIETNAMESE** (Tiếng Việt) to help the student understand.

3. **SPECIFIC FORMAT**:
   - **MCQ**: Standard multiple-choice.
   - **Gap-fill**: Question must include `_______` and a HINT in parentheses (e.g., root word). Do NOT put the answer in the hint.

4. **Explanations**: 
   - **Keep it concise (under 50 words).**
   - Explain strictly why the answer is correct based on grammar rules.
   - **Write the explanation in Vietnamese.**

========================
**RESPONSE FORMAT**
========================
Return ONLY valid JSON (no markdown).

{{
  "status": "success",
  "data": [
    {{
      "type": "{question_ratio}",
      "skill": "Grammar or Vocabulary",
      "topic": ["Topic Name"],
      "question": "Question text in English...", 
      "options": ["Option A", "Option B", "Option C", "Option D"], 
      "answer": "Correct Option Text",
      "explanation": "Giải thích chi tiết bằng tiếng Việt..."
    }}
  ]
}}
"""