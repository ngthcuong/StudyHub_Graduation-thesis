import os
import asyncio
from dotenv import load_dotenv
from google import genai

# Tải API Key từ .env
load_dotenv()

async def list_available_models():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Lỗi: Chưa tìm thấy GEMINI_API_KEY trong file .env")
        return

    client = genai.Client(api_key=api_key)
    
    print("--- Đang kiểm tra các model khả dụng cho Key của bạn ---")
    
    try:
        # Lấy danh sách model
        pager = client.models.list()
        
        found_any = False
        for model in pager:
            # Chỉ in ra các model hỗ trợ generateContent
            if "generateContent" in model.supported_actions:
                # In ra tên đầy đủ và chính xác
                print(f"✅ Model hợp lệ: {model.name}")
                found_any = True
        
        if not found_any:
            print("⚠️ Không tìm thấy model nào hỗ trợ generateContent. Có thể API Key của bạn không hợp lệ hoặc bị khóa.")
            
    except Exception as e:
        print(f"❌ Lỗi khi gọi API ListModels: {e}")

if __name__ == "__main__":
    asyncio.run(list_available_models())