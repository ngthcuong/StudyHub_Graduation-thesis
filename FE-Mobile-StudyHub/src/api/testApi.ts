// src/services/testService.ts

import axios, { AxiosResponse } from "axios";

// --- Payload khi tạo test ---
interface CreateTestPayload {
  topic: string;
  question_types: string[];
  num_questions: number;
  difficulty: string;
}

// --- Response từ backend khi tạo/gọi test ---
interface TestResponse {
  message: string;
  test: {
    _id: string;
    title?: string;
    topic: string;
    question_types: string[];
    num_questions: number;
    difficulty: string;
    questions: Array<{
      id: number;
      question: string;
      options?: string[];
      answer?: string;
      skill?: string;
      topic?: string[];
      explanation?: string;
    }>;
    createdAt: string;
    updatedAt: string;
  };
}

// --- API Base URL ---
const API_BASE = "http://192.168.21.119:3000/api/v1/tests";

// Lấy tất cả tests
const getAllTests = async (): Promise<AxiosResponse<TestResponse[]>> => {
  return axios.get<TestResponse[]>(API_BASE);
};

// Lấy chi tiết 1 test
const getTestById = async (id: string): Promise<AxiosResponse<TestResponse>> => {
  return axios.get<TestResponse>(`${API_BASE}/${id}`);
};

// Tạo test mới
const createTest = async (
  data: CreateTestPayload
): Promise<AxiosResponse<TestResponse>> => {
  return axios.post<TestResponse>(API_BASE, data);
};

// Xóa test
const deleteTest = async (id: string): Promise<AxiosResponse<{ message: string }>> => {
  return axios.delete<{ message: string }>(`${API_BASE}/${id}`);
};

export default {
  getAllTests,
  getTestById,
  createTest,
  deleteTest,
};
