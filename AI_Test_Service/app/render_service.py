import os
import json
from dotenv import load_dotenv
from google import genai
from .prompts import generate_test_prompt

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("Bạn phải đặt GEMINI_API_KEY trong .env hoặc biến môi trường")

model_name = os.getenv("MODEL_NAME", "gemini-2.5-flash")
client = genai.Client(api_key=api_key)


async def render_test(topic: str,
                      num_questions: int = 10,
                      question_types: list = None,
                      exam_type: str = "TOEIC",       # TOEIC | IELTS
                      score_range: str = None):       # e.g. "TOEIC 405-600", "IELTS 6.5-7.0"
    prompt = generate_test_prompt(
        topic=topic,
        question_types=question_types,
        num_questions=num_questions,
        exam_type=exam_type,
        score_range=score_range
    )

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        text = response.text.strip()

        # Parse JSON trực tiếp (Gemini không trả markdown)
        data = json.loads(text)
        return data

    except json.JSONDecodeError:
        raise ValueError(f"Không parse được JSON từ Gemini: {text}")
    except Exception as e:
        raise RuntimeError(f"Lỗi khi gọi Gemini: {str(e)}")
