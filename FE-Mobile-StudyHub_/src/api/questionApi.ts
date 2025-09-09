// src/services/questionApi.ts

import axios, { AxiosResponse } from "axios";

// --- Payload khi tạo câu hỏi ---
export interface CreateQuestionPayload {
  testId: string;
  questionText: string;
  questionType: "mcq" | "essay" | "truefalse"; // có thể mở rộng
  skill?: string;
  topic?: string;
  points?: number;
  options?: Array<{
    text: string;
    isCorrect: boolean;
  }>;
}

// --- Response của 1 câu hỏi ---
export interface Question {
  _id: string;
  testId: string;
  questionText: string;
  questionType: string;
  skill?: string;
  topic?: string;
  points?: number;
  options?: Array<{
    _id: string;
    text: string;
    isCorrect: boolean;
  }>;
  createdAt: string;
  updatedAt: string;
}

// --- Response chung ---
interface ApiResponse<T> {
  message: string;
  data: T;
  total?: number;
}

// --- API Base URL ---
const API_BASE = "http://192.168.21.119:3000/api/v1/questions";

// Tạo 1 câu hỏi
const createQuestion = async (
  data: CreateQuestionPayload
): Promise<AxiosResponse<ApiResponse<Question>>> => {
  return axios.post<ApiResponse<Question>>(API_BASE, data);
};

// Tạo nhiều câu hỏi
const createManyQuestions = async (
  questions: CreateQuestionPayload[]
): Promise<AxiosResponse<ApiResponse<Question[]>>> => {
  return axios.post<ApiResponse<Question[]>>(`${API_BASE}/bulk`, { questions });
};

// Lấy tất cả câu hỏi theo testId
const getQuestionsByTest = async (
  testId: string
): Promise<AxiosResponse<ApiResponse<Question[]>>> => {
  return axios.get<ApiResponse<Question[]>>(`${API_BASE}/test/${testId}`);
};

// Lấy chi tiết câu hỏi theo id
const getQuestionById = async (
  questionId: string
): Promise<AxiosResponse<ApiResponse<Question>>> => {
  return axios.get<ApiResponse<Question>>(`${API_BASE}/${questionId}`);
};

// Cập nhật câu hỏi theo id
const updateQuestionById = async (
  questionId: string,
  updateData: Partial<CreateQuestionPayload>
): Promise<AxiosResponse<ApiResponse<Question>>> => {
  return axios.put<ApiResponse<Question>>(
    `${API_BASE}/${questionId}`,
    updateData
  );
};

// Xóa câu hỏi theo id
const deleteQuestionById = async (
  questionId: string
): Promise<AxiosResponse<ApiResponse<Question>>> => {
  return axios.delete<ApiResponse<Question>>(`${API_BASE}/${questionId}`);
};

export default {
  createQuestion,
  createManyQuestions,
  getQuestionsByTest,
  getQuestionById,
  updateQuestionById,
  deleteQuestionById,
};
