import os
import json
import re
import asyncio
import random  # <--- 1. Thêm thư viện random
from dotenv import load_dotenv
from google import genai
from app.prompts.prompt_topic import generate_test_prompt

load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("MODEL_NAME", "gemini-1.5-flash")
client = genai.Client(api_key=api_key)

# Hàm wrapper để gọi Gemini (vì hàm gốc có thể là sync blocking)
async def call_gemini_async(prompt):
    try:
        # Chạy hàm blocking trong thread pool để không chặn event loop
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=model_name,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Error in sub-request: {e}")
        return ""

async def render_test(topic: str,
                      num_questions: int = 10,
                      question_types: list = None,
                      exam_type: str = "TOEIC",
                      score_range: str = None):
    
    # CHIẾN THUẬT: CHIA NHỎ REQUEST
    batch_size = 5
    tasks = []
    
    remaining = num_questions
    while remaining > 0:
        current_batch = min(remaining, batch_size)
        
        prompt = generate_test_prompt(
            topic=topic,
            question_types=question_types,
            num_questions=current_batch,
            exam_type=exam_type,
            score_range=score_range
        )
        
        tasks.append(call_gemini_async(prompt))
        remaining -= current_batch

    # CHẠY TẤT CẢ CÁC REQUEST CÙNG LÚC
    results = await asyncio.gather(*tasks)
    
    # GỘP KẾT QUẢ
    final_data = []
    
    for text in results:
        text = text.strip()
        # Clean text logic
        clean_text = re.sub(r"^```(?:json)?|```$", "", text, flags=re.MULTILINE).strip()
        try:
            # Cố gắng parse JSON
            try:
                data_batch = json.loads(clean_text)
            except:
                # Fallback fix lỗi JSON
                fixed_text = clean_text.replace('\n', '\\n')
                data_batch = json.loads(fixed_text)
                
            if isinstance(data_batch, dict) and "data" in data_batch:
                final_data.extend(data_batch["data"])
        except Exception as e:
            print(f"Bỏ qua một batch do lỗi parse: {e}")
            continue

    # ---------------------------------------------------------
    # 2. THÊM LOGIC XÁO TRỘN ĐÁP ÁN Ở ĐÂY (Trước khi return)
    # ---------------------------------------------------------
    for question in final_data:
        # Kiểm tra nếu có options và là list không rỗng
        if "options" in question and isinstance(question["options"], list) and len(question["options"]) > 0:
            random.shuffle(question["options"]) 

    return {"status": "success", "data": final_data}