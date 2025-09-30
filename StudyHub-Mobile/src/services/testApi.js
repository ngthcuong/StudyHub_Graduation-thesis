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
  startTestAttempt: async (testPoolId) => {
    const response = await api.post(`/attempts`, {
      testPoolId,
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

  getAttemptInfo: async (userId, testId) => {
    const response = await api.post(`/attempts/info`, {
      userId,
      testId,
    });
    return response.data;
  },

  generrateTest: async (payload) => {
    const response = await api.post(`/generate-test`, payload);
    return response.data;
  },

  createTestPool: async (testId, level, userId) => {
    const response = await api.post(`/test-pools`, {
      baseTestId: testId,
      level,
      createdBy: userId,
      usageCount: 0,
      maxReuse: 5,
      status: "active",
    });
    return response.data;
  },

  getTestPoolByLevel: async (level) => {
    const response = await api.get(`/test-pools/level/${level}`);
    return response.data;
  },

  gradeTest: async (testId, attemptId) => {
    const response = await api.post(`/test-result/submit`, {
      attemptId,
      testId,
    });
    return response.data;
  },
};
