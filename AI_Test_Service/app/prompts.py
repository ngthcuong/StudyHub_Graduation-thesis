def generate_test_prompt(
    topic: str,
    question_types: list = None,
    num_questions: int = 10,
    difficulty: str = "medium"
):
    """
    topic: the overall topic to guide question creation (e.g., "present simple")
    question_types: ["multiple_choice", "fill_in_blank", "rearrange", "essay"]
    num_questions: number of questions to generate
    difficulty: "easy" | "medium" | "hard"
    """
    if question_types is None:
        question_types = ["multiple_choice", "fill_in_blank", "rearrange", "essay"]

    types_text = {
        "multiple_choice": "Multiple-choice (4 options)",
        "fill_in_blank": "Fill in the blank",
        "rearrange": "Sentence rearrangement",
        "essay": "Essay (short/long)"
    }

    chosen_types_text = ", ".join([types_text[t] for t in question_types if t in types_text])

    return f"""
You are an English teacher specialized in TOEIC.
Generate {num_questions} questions with {difficulty} difficulty under the general theme "{topic}" (theme is only for guidance).
The required question types: {chosen_types_text}.

Requirements for EACH question:
- Field "skill" must be derived from the question type:
    * multiple_choice → Grammar
    * fill_in_blank  → Grammar
    * rearrange      → Grammar
    * essay          → Writing
- Field "topic" must be a **list of subtopics/concepts specific to the question itself**, NOT the overall theme.
  Examples: ["subject-verb agreement"], ["time expressions: present simple"],
            ["irregular verbs: past simple"], ["email etiquette"], ["collocations"].
  1–2 concise subtopics are enough.
- Each question must have a real correct answer (not just "A/B/C/D").
- Provide a detailed explanation for why the answer is correct/incorrect.
- If multiple_choice: "options" must be a raw list of answers (no numbering or letters).

Return ONLY valid JSON in the following format:

{{
  "status": "success",
  "data": [
    {{
      "type": "multiple_choice",   # multiple_choice, fill_in_blank, rearrange, essay
      "skill": "Grammar",          # auto from question type
      "topic": ["<subtopic-for-this-question>"],  # e.g., ["subject-verb agreement"]
      "question": "...",
      "options": ["option1", "option2", "option3", "option4"],  # only for multiple_choice
      "answer": "the correct option text",
      "explanation": "Detailed explanation..."
    }},
    ...
  ]
}}

DO NOT add extra text, DO NOT use markdown.
"""
