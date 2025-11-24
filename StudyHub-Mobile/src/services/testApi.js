import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
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
  startTestAttempt: async (testId, maxAttempts) => {
    const response = await api.post(`/attempts`, {
      testId,
      evaluationModel: "gemini",
      maxAttempts,
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
  submitTestAttempt: async ({ attemptId, answers, testId, startTime }) => {
    const response = await api.post(`/attempts/${attemptId}/submit`, {
      answers,
      testId,
      startTime,
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

  generateTest: async (payload) => {
    console.log("Generating test with payload:", payload);
    const response = await api.post(`/generate-test`, payload);
    return response.data;
  },

  createTestPool: async (testId, level, userId) => {
    const response = await api.post(`/test-pools`, {
      baseTestId: testId,
      level,
      createdBy: userId,
      usageCount: 0,
      maxReuse: 10,
      status: "active",
    });
    return response.data;
  },

  getTestPoolByLevel: async (level) => {
    const response = await api.get(`/test-pools/level/${level}`);
    return response.data;
  },

  createTestPool: async (testId, level, userId) => {
    const response = await api.post(`/test-pools`, {
      baseTestId: testId?.testId,
      level: testId?.level,
      createdBy: testId?.userId,
      usageCount: 0,
      maxReuse: 10,
      status: "active",
    });
    return response.data;
  },

  updateTestPool: async (poolId, updateData) => {
    console.log("Updating test pool:", poolId, updateData);
    const response = await api.put(`/test-pools/${poolId}`, updateData);
    return response.data;
  },

  gradeTest: async (testId, attemptId) => {
    const response = await api.post(`/test-result/submit`, {
      attemptId,
      testId,
    });
    return response.data;
  },

  getCompletedTests: async () => {
    const response = await api.get("/attempt-details/details/grouped");
    return response.data;
  },

  getTestPoolByLevel: async (level) => {
    const response = await api.get(`/test-pools/level/${level}`);
    return response.data;
  },

  // GET BY TEST ID, LEVEL AND CREATE
  getTestPoolByTestIdAndLevel: async (
    testId,
    exam_type,
    score_range,
    createdBy
  ) => {
    const response = await api.post(`/questions/filter`, {
      testId,
      exam_type,
      score_range,
      createdBy,
    });

    return response.data;
  },

  // Get test attempts by test ID
  getTestAttemptsByTestId: async (testPoolId, userId) => {
    const response = await api.post(`/attempts/by-test-pool`, {
      testPoolId,
      userId,
    });
    return response.data;
  },

  getAttemptByTestAndUser: async (testId, userId) => {
    console.log("Fetching attempt for testId:", testId, "and userId:", userId);
    const response = await api.get(`/attempts/test/${testId}/user/${userId}`);
    return response.data;
  },

  // getAttemptDetailByUser
  getAttemptDetailByUser: async () => {
    const response = await api.get(`/attempts/custom/user`);
    return response.data;
  },

  // createTest
  createTest: async (payload) => {
    const response = await api.post(`/tests`, payload);
    return response.data;
  },

  // custom test
  createCustomTest: async (payload) => {
    const response = await api.post(`/generate-test/custom`, payload);
    return response.data;
  },

  // get question by attemptId
  getQuestionsByAttemptId: async (attemptId) => {
    const response = await api.get(`/questions/attempt/${attemptId}`);
    return response.data;
  },

  // get question by testId
  getQuestionByTestId: async (testId) => {
    const response = await api.get(`/questions/test/${testId}`);
    return response.data;
  },

  // update attempt
  updateAttempt: async (attemptId, updateData) => {
    const response = await api.patch(`/attempts/${attemptId}`, updateData);
    return response.data;
  },
};
