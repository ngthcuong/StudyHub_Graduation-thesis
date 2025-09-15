// src/services/attemptService.ts
import axios, { AxiosResponse } from "axios";

// --- Payload khi bắt đầu attempt ---
interface StartAttemptPayload {
  testId: string;
  userId?: string; // optional nếu lấy từ req.user
  evaluationModel?: string;
}

// --- Response attempt ---
interface AttemptResponse {
  message: string;
  data: {
    _id: string;
    testId: string;
    userId: string;
    score?: number;
    evaluationModel?: string;
    feedback?: string;
    startTime?: string;
    endTime?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

// --- Payload khi submit attempt ---
interface SubmitAnswer {
  questionId: string;
  selectedOptionId?: string;
  answerLetter?: string;
  answerText?: string;
}

interface SubmitAttemptPayload {
  answers: SubmitAnswer[];
}

interface SubmitAttemptResponse {
  message: string;
  attempt: any; // bạn có thể định nghĩa kỹ hơn dựa trên attemptModel
  answers: any[];
  summary: {
    totalScore: number;
    answered: number;
  };
}

// --- API Base URL ---
const API_BASE = "http://192.168.21.119:3000/api/v1/attempts";

// Bắt đầu attempt
const startAttempt = (payload: any, token: string) => {
  console.log("Attempt API called with payload:", payload, "and token:", token);
  return axios.post(`${API_BASE}`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Submit attempt
const submitAttempt = async (
  attemptId: string,
  data: SubmitAttemptPayload
): Promise<AxiosResponse<SubmitAttemptResponse>> => {
  return axios.post<SubmitAttemptResponse>(
    `${API_BASE}/${attemptId}/submit`,
    data
  );
};

// Lấy chi tiết attempt theo ID
const getAttemptById = async (
  attemptId: string
): Promise<AxiosResponse<AttemptResponse>> => {
  return axios.get<AttemptResponse>(`${API_BASE}/${attemptId}`);
};

// Lấy tất cả attempt theo user
const getAttemptsByUser = async (
  userId: string
): Promise<AxiosResponse<{ message: string; data: any[]; total: number }>> => {
  return axios.get<{ message: string; data: any[]; total: number }>(
    `${API_BASE}/user/${userId}`
  );
};

export default {
  startAttempt,
  submitAttempt,
  getAttemptById,
  getAttemptsByUser,
};
