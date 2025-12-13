# render_service.py

import os
import json
import asyncio
from dotenv import load_dotenv
from google import genai
from json_repair import repair_json
from app.prompts.prompt_custom import generate_test_prompt

load_dotenv(override=True)

api_key = os.getenv("GEMINI_API_KEY")
model_name = os.getenv("MODEL_NAME", "gemini-2.5-flash")
client = genai.Client(api_key=api_key)

# Hàm phụ để gọi 1 batch nhỏ
async def generate_batch(batch_size: int, **kwargs):
    """
    Hàm này chịu trách nhiệm gọi AI và xử lý lỗi "tận gốc" cho từng batch.
    Nếu lỗi, nó trả về danh sách rỗng [] chứ không throw Exception làm sập app.
    """
    # 1. Cập nhật số lượng câu hỏi cho prompt này
    kwargs['num_questions'] = batch_size
    prompt = generate_test_prompt(**kwargs)

    try:
        # 2. Gọi AI (chạy trong thread pool để không chặn async loop)
        response = await asyncio.to_thread(
            client.models.generate_content,
            model=model_name,
            contents=prompt
        )
        
        raw_text = response.text.strip()

        # 3. Xử lý chuỗi JSON (Phương pháp 3)
        # repair_json sẽ tự động fix các lỗi cú pháp JSON phổ biến
        cleaned_json_str = repair_json(raw_text)
        data = json.loads(cleaned_json_str)

        # 4. Chuẩn hóa dữ liệu đầu ra
        # Đảm bảo kết quả luôn là một List câu hỏi
        if isinstance(data, dict):
            # Trường hợp AI trả về {"status": "success", "data": [...]}
            return data.get("data", [])
        elif isinstance(data, list):
            # Trường hợp AI trả về thẳng [...]
            return data
        else:
            return []

    except Exception as e:
        # ✅ LOG LỖI NHƯNG KHÔNG CRASH
        print(f"⚠️ Batch error (size {batch_size}): {str(e)}")
        # Trả về rỗng để các batch khác vẫn tiếp tục được ghép vào
        return []


# --- Hàm Chính: Điều phối song song ---
async def render_test(
    num_questions: int = 15,
    **kwargs # Nhận current_level, topics, etc.
):
    BATCH_SIZE = 5 
    
    # 1. Chia nhỏ yêu cầu
    batches = []
    remaining = num_questions
    while remaining > 0:
        take = min(remaining, BATCH_SIZE)
        batches.append(take)
        remaining -= take

    # 2. Tạo các task chạy song song (Concurrent)
    # Lưu ý: truyền **kwargs để đẩy hết tham số (level, topic...) vào hàm con
    tasks = [generate_batch(batch_size=b, **kwargs) for b in batches]
    
    # 3. Chạy tất cả và chờ kết quả
    # return_exceptions=True giúp nếu 1 task chết hẳn cũng không ảnh hưởng task khác
    results = await asyncio.gather(*tasks, return_exceptions=True)
    
    # 4. Gộp kết quả
    final_questions = []
    for res in results:
        if isinstance(res, list): # Chỉ gộp nếu kết quả là list hợp lệ
            final_questions.extend(res)
    
    # 5. Kiểm tra kết quả cuối cùng
    if not final_questions:
        # Nếu xui xẻo tất cả batch đều lỗi (rất hiếm)
        raise RuntimeError("AI service failed to generate any questions after retries.")

    return {"status": "success", "data": final_questions}