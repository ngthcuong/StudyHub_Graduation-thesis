// File: src/services/aiService.js
const axios = require("axios");
const axiosRetry = require("axios-retry").default;

// Lấy URL từ biến môi trường (hoặc dùng fallback localhost để test)
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// 1. Tạo instance axios riêng cho AI Service
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 60000, // 60 giây timeout
  headers: {
    "Content-Type": "application/json",
  },
});

// 2. Cấu hình Retry (Tự động thử lại khi lỗi)
axiosRetry(aiClient, {
  retries: 3, // Thử lại tối đa 3 lần
  retryDelay: (retryCount) => {
    console.log(`⚠️ Đang thử lại lần thứ ${retryCount}...`);
    return axiosRetry.exponentialDelay(retryCount); // Chờ: 100ms -> 200ms -> 400ms...
  },
  retryCondition: (error) => {
    // Chỉ retry nếu lỗi mạng hoặc lỗi Server (5xx). Không retry lỗi 4xx.
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response && error.response.status >= 500)
    );
  },
});

/**
 * Hàm gọi AI để sinh đề thi
 * @param {Object} aiPayload - Dữ liệu cấu hình đề thi (level, topic, v.v.)
 * @returns {Promise<Object>} - Kết quả JSON từ AI
 */
const generateTest = async (aiPayload) => {
  try {
    console.log("🚀 [AI Service] Đang gửi yêu cầu tới:", AI_SERVICE_URL);

    const response = await aiClient.post("/generate-test-custom", aiPayload);

    // Trả về data gọn gàng
    return response.data;
  } catch (error) {
    console.error("❌ [AI Service] Thất bại:", error.message);

    // Nếu có response từ server (ví dụ lỗi 400, 500), log chi tiết hơn
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data));
    }

    // Ném lỗi ra ngoài để Controller xử lý (hoặc trả về null/default data tùy logic của bạn)
    throw error;
  }
};

// Xuất hàm ra để nơi khác dùng
module.exports = {
  generateTest,
};
