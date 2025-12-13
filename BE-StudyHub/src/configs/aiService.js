// File: src/services/aiService.js
const axios = require("axios");
const axiosRetry = require("axios-retry").default;

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8000";

// --- PHẦN CẤU HÌNH DÙNG CHUNG (Giữ nguyên) ---
const aiClient = axios.create({
  baseURL: AI_SERVICE_URL,
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

axiosRetry(aiClient, {
  retries: 3,
  retryDelay: (retryCount) => {
    console.log(`⚠️ [AI Service] Đang thử lại lần thứ ${retryCount}...`);
    return axiosRetry.exponentialDelay(retryCount);
  },
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response && error.response.status >= 500)
    );
  },
});

// --- HÀM HELPER ĐỂ TRÁNH LẶP CODE (Optional nhưng khuyên dùng) ---
// Hàm này giúp bạn gọi bất kỳ endpoint nào mà không phải viết lại try/catch log lỗi
const callAIEndpoint = async (endpoint, payload) => {
  try {
    console.log(`🚀 [AI Service] Calling: ${endpoint}`);
    const response = await aiClient.post(endpoint, payload);
    return response;
  } catch (error) {
    console.error(`❌ [AI Service] Error calling ${endpoint}:`, error.message);
    if (error.response) {
      console.error("   Status:", error.response.status);
      console.error("   Data:", JSON.stringify(error.response.data));
    }
    throw error;
  }
};

// --- CÁC HÀM CHỨC NĂNG ---

/** 1. Tạo đề thi */
const generateTest = async (aiPayload) => {
  // Gọi endpoint /generate-test-custom
  return await callAIEndpoint("/generate-test-custom/", aiPayload);
};

/** 2. Chấm điểm (Mới thêm vào) */
const gradeSubmission = async (gradingPayload) => {
  // Gọi endpoint /grade/
  return await callAIEndpoint("/grade/", gradingPayload);
};

/** 2. Tạo bài thi cho courses */
const generateCourseTest = async (aiPayload) => {
  // Gọi endpoint /generate-course-test
  return await callAIEndpoint("/generate-test/", aiPayload);
};

// --- XUẤT RA CẢ 2 HÀM ---
module.exports = {
  generateTest,
  gradeSubmission,
  generateCourseTest,
};
