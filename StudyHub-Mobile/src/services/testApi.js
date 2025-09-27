import api from "./api";

export const testApi = {
  // Get all tests
  getTests: async (params = {}) => {
    const response = await api.get("/tests", { params });
    return response.data;
  },

  // Get test by ID
  getTestById: async (testId) => {
    const response = await api.get(`/tests/${testId}`);
    return response.data;
  },

  // Get test questions
  getTestQuestions: async (testId) => {
    const response = await api.get(`/questions/test/${testId}`);
    return response.data;
  },

  // Start test attempt
  startTestAttempt: async (testId, userId) => {
    const response = await api.post(`/attempts`, {
      testId,
      userId,
      evaluationModel: "gemini",
    });
    return response.data;
  },

  // Submit test answer
  submitTestAnswer: async (attemptId, questionId, answer) => {
    const response = await api.post(`/attempts/${attemptId}/answers`, {
      questionId,
      answer,
    });
    return response.data;
  },

  // Submit test attempt
  submitTestAttempt: async (attemptId, answersPayload) => {
    const response = await api.post(`/attempts/${attemptId}/submit`, {
      answers: answersPayload,
    });
    return response.data;
  },

  // Get test results
  getTestResults: async (attemptId) => {
    const response = await api.get(`/attempts/${attemptId}`);
    return response.data;
  },

  // Get user's test attempts
  getMyTestAttempts: async () => {
    const response = await api.get("/attempts/my-attempts");
    return response.data;
  },
};
