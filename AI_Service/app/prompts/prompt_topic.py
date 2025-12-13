def generate_test_prompt(
    topic: str,
    question_types: list = None,
    num_questions: int = 10,
    exam_type: str = "TOEIC",
    score_range: str = None
):
    if question_types is None:
        question_types = ["multiple_choice", "fill_in_blank", "rearrange", "essay"]

    types_text = {
        "multiple_choice": "Multiple-choice (4 options)",
        "fill_in_blank": "Fill in the blank (Word Form with 4 options)", # <--- Cập nhật mô tả
        "rearrange": "Sentence rearrangement",
        "essay": "Essay (short/long)"
    }

    chosen_types_text = ", ".join([types_text[t] for t in question_types if t in types_text])

    return f"""
You are an English teacher specialized in {exam_type}.
Generate {num_questions} questions under the general theme "{topic}".
The required question types: {chosen_types_text}.
Target exam level: {exam_type} {score_range}.

IMPORTANT - DISTRIBUTION RULES:
- You MUST generate a mix of the requested question types (unless only one type was requested).

Requirements for EACH question:
- The **Question** and **Answers** must be in **English**.
- Vocabulary and grammar must match the learner's {exam_type} {score_range} level.
- Field "skill" must be derived from the question type.

- **Specific formatting for 'fill_in_blank':**
    * The blank space MUST be represented by `______` followed immediately by the **base/root form** in parentheses.
    * Example: "She drives very ______ (careful)..."

- **Explanation:** MUST be written in **Vietnamese**. Keep it concise (under 40 words).

IMPORTANT - JSON STRUCTURE RULES:
- **"options" field is MANDATORY for ALL question types.**
- **You MUST provide exactly 4 distinct options strings for every question.**
    * If `multiple_choice`: Standard A, B, C, D options.
    * If `fill_in_blank`: Provide the correct answer and 3 incorrect Word Form variations (distractors).
      (E.g., if answer is "carefully", options could be ["careful", "carefully", "caring", "care"]).

Return ONLY valid JSON in the following format:

{{
  "status": "success",
  "data": [
    {{
      "type": "multiple_choice",
      "skill": "Grammar",
      "topic": ["Tenses"],
      "question": "By the time he arrived, the train ______.",
      "options": ["left", "has left", "had left", "was leaving"],
      "answer": "had left",
      "explanation": "Dùng thì Quá khứ hoàn thành."
    }},
    {{
      "type": "fill_in_blank",
      "skill": "Grammar",
      "topic": ["Adverbs"],
      "question": "She drives very ______ (careful) on snowy roads.",
      "options": ["careful", "carefully", "carefulness", "caring"], 
      "answer": "carefully",
      "explanation": "Cần trạng từ 'carefully' bổ nghĩa cho động từ 'drives'."
    }}
  ]
}}

DO NOT add extra text.
"""