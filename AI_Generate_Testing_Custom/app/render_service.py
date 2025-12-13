# render_service.py

import os
import json
import asyncio
from dotenv import load_dotenv
from google import genai
from .prompts import generate_test_prompt

load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("MODEL_NAME", "gemini-2.5-flash")
client = genai.Client(api_key=api_key)

# Hàm phụ để gọi 1 batch nhỏ
async def generate_batch(batch_size, **kwargs):
    # Cập nhật số lượng câu hỏi cho prompt này
    kwargs['num_questions'] = batch_size
    prompt = generate_test_prompt(**kwargs)
    
    try:
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=model_name,
            contents=prompt
        )
        text = response.text.strip()
        if text.startswith("```"):
            text = text.strip("`").replace("json", "", 1).strip()
        return json.loads(text).get("data", [])
    except Exception as e:
        print(f"Batch failed: {e}")
        return [] # Trả về rỗng nếu lỗi để không chết cả app

async def render_test(
    num_questions: int = 15,
    **kwargs # Nhận tất cả các tham số còn lại (current_level, topics...)
):
    BATCH_SIZE = 5 # Mỗi lần chỉ tạo 5 câu để nhanh hơn
    
    # Tính toán số lượng batches cần chạy
    # Ví dụ: 15 câu => [5, 5, 5], 12 câu => [5, 5, 2]
    batches = []
    remaining = num_questions
    while remaining > 0:
        take = min(remaining, BATCH_SIZE)
        batches.append(take)
        remaining -= take

    # Tạo các task chạy song song
    tasks = [generate_batch(batch_size=b, num_questions=b, **kwargs) for b in batches]
    
    # Chạy tất cả cùng lúc và chờ kết quả
    results = await asyncio.gather(*tasks)
    
    # Gộp kết quả từ các list con thành 1 list lớn
    final_questions = []
    for res in results:
        final_questions.extend(res)

    return {"status": "success", "data": final_questions}