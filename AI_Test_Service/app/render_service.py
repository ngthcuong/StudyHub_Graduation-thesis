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
                      difficulty: str = "trung bình",
                      question_types: list = None):
    prompt = generate_test_prompt(topic, question_types, num_questions, difficulty)

    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt
        )
        text = response.text.strip()

        # Parse JSON trực tiếp, Gemini không trả markdown nữa
        data = json.loads(text)
        return data

    except json.JSONDecodeError:
        raise ValueError(f"Không parse được JSON từ Gemini: {text}")
    except Exception as e:
        raise RuntimeError(f"Lỗi khi gọi Gemini: {str(e)}")
