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
- TOEIC score (if provided): {toeic_score or "N/A"}
- Weak skills: {weak_skills_str}
- Topics to practice: {topics_str}
- Difficulty preference: {difficulty or "same as level"}

========================
**QUESTION REQUIREMENTS**
========================
1. **GENERAL RULE**: ALL questions (both MCQ and Gap-fill) MUST provide **4 distinct options** in the "options" list. The user will always select from a list.

2. **SPECIFIC FORMAT BY TYPE**:
   - **IF type is "MCQ"**: 
     - Standard multiple-choice question. Contextual sentences.
   
   - **IF type is "Gap-fill"**:
     - The "question" text MUST contain a blank `_______` followed immediately by a **HINT** in parentheses.
     - **For Grammar**: The hint is the **ROOT FORM** of the word.
       * Example Question: "She has _______ (COMPLETE) the report."
       * Example Options: ["completed", "complete", "completing", "completes"]
     - **For Vocabulary**: The hint is a **SHORT DEFINITION**.
       * Example Question: "Please _______ (look at closely) the document."
       * Example Options: ["review", "sign", "write", "send"]
     - **CRITICAL**: Do NOT put the answer in the hint, only the root word or definition.

3. **Explanations**: Must be detailed, explaining why the correct answer fits the specific hint/grammar rule.

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
      "question": "Question text...", 
      "options": ["Option A", "Option B", "Option C", "Option D"], 
      "answer": "Correct Option Text",
      "explanation": "Detailed explanation..."
    }}
  ]
}}
"""