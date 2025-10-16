import { rootApi } from "./rootApi";

export const testApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // -----------------------------
    // --- TẤT CẢ LÀ MUTATION ---
    // -----------------------------

    // 1. getTestById
    getTestById: builder.mutation({
      query: (testId) => ({
        url: `/tests/${testId}`,
        method: "GET",
      }),
      invalidatesTags: ["Test"],
    }),

    // 2. getTestPoolByLevel
    getTestPoolByLevel: builder.mutation({
      query: ({ level }) => ({
        url: `/test-pools/level/${level}`,
        method: "GET",
      }),
    }),

    // 3. getTestPoolByTestIdAndLevel
    getTestPoolByTestIdAndLevel: builder.mutation({
      query: ({ testId, exam_type, score_range, createdBy }) => ({
        url: `/questions/filter`,
        method: "POST",
        body: { testId, exam_type, score_range, createdBy },
      }),
      invalidatesTags: ["Question"],
    }),

    // 4. getTestAttemptsByTestId
    getTestAttemptsByTestId: builder.mutation({
      query: ({ testPoolId, userId }) => ({
        url: `/attempts/by-test-pool`,
        method: "POST",
        body: { testPoolId, userId },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 5. getAttemptByTestAndUser
    getAttemptByTestAndUser: builder.mutation({
      query: ({ testId, userId }) => ({
        url: `/attempts/test/${testId}/user/${userId}`,
        method: "GET",
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 6. createAttempt
    createAttempt: builder.mutation({
      query: ({ testPoolId, testId }) => ({
        url: "/attempts",
        method: "POST",
        body: { testPoolId, testId, evaluationModel: "gemini" },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 7. getAttemptInfo
    getAttemptInfo: builder.mutation({
      query: ({ userId, testId }) => ({
        url: "/attempts/info",
        method: "POST",
        body: { userId, testId },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 8. createTestPool
    createTestPool: builder.mutation({
      query: (testPoolInfo) => ({
        url: "/test-pools",
        method: "POST",
        body: testPoolInfo,
      }),
      invalidatesTags: ["TestPool"],
    }),

    // 9. generateTestQuestions
    generateTestQuestions: builder.mutation({
      query: (payload) => ({
        url: "/generate-test",
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["Question"],
    }),

    // 10. getAllTests
    getAllTests: builder.mutation({
      query: (params) => ({
        url: "/tests",
        method: "GET",
        params,
      }),
      invalidatesTags: ["Test"],
    }),

    // 11. getTestByTestId
    getTestByTestId: builder.mutation({
      query: (testId) => ({
        url: `/tests/${testId}`,
        method: "GET",
      }),
      invalidatesTags: ["Test"],
    }),

    // 12. getQuestionsByTestId
    getQuestionsByTestId: builder.mutation({
      query: (testId) => ({
        url: `/questions/test/${testId}`,
        method: "GET",
      }),
      invalidatesTags: ["Question"],
    }),

    // 13. submitTestAnswer
    submitTestAnswer: builder.mutation({
      query: ({ attemptId, questionId, answers }) => ({
        url: `/attempts/${attemptId}/answers`,
        method: "POST",
        body: { questionId, answers },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 14. submitTest
    submitTest: builder.mutation({
      query: ({ attemptId, answers, testId, startTime }) => ({
        url: `/attempts/${attemptId}/submit`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers, testId, startTime }), // <- stringify thủ công
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 15. getTestResults
    getTestResults: builder.mutation({
      query: (attemptId) => ({
        url: `/attempts/${attemptId}`,
        method: "GET",
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 16. getMyTestAttempts
    getMyTestAttempts: builder.mutation({
      query: () => ({
        url: "/attempts/my-attempts",
        method: "GET",
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 17. updateTestPool
    updateTestPool: builder.mutation({
      query: ({ poolId, updateData }) => ({
        url: `/test-pools/${poolId}`,
        method: "PUT",
        body: updateData,
      }),
      invalidatesTags: ["TestPool"],
    }),

    // 18. getTestResult (Grade Test)
    getTestResult: builder.mutation({
      query: ({ testId, attemptId }) => ({
        url: "/test-result/submit",
        method: "POST",
        body: { testId, attemptId },
      }),
    }),

    // 19. getListAttempt
    getListAttempt: builder.mutation({
      query: () => ({
        url: "/attempt-details/details/grouped",
        method: "GET",
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 20. getTestPoolsByCreatorId
    getTestPoolsByCreatorId: builder.mutation({
      query: (creatorId) => ({
        url: `/test-pools/creator/${creatorId}`,
        method: "GET",
      }),
      invalidatesTags: ["TestPool"],
    }),

    // 21. saveAnswers
    saveAnswers: builder.mutation({
      query: (answers) => ({
        url: "/answers/submit-many",
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 22. checkExistTestPool
    checkExistTestPool: builder.mutation({
      query: ({ userId, testId }) => ({
        url: "/attempts/info",
        method: "POST",
        body: { userId, testId },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // 23. getAttemptDetailByUserAndTest
    getAttemptDetailByUserAndTest: builder.mutation({
      query: ({ userId, testId }) => ({
        url: `attempt-details/user/${userId}/test/${testId}`,
        method: "GET",
      }),
      invalidatesTags: ["AttemptDetail"],
    }),

    // 24. createTest
    createTest: builder.mutation({
      query: (testData) => ({
        url: "/tests",
        method: "POST",
        body: testData,
      }),
      invalidatesTags: ["Test"],
    }),
  }),
});

export const {
  useGetTestByIdMutation,
  useGetTestPoolByLevelMutation,
  useGetTestPoolByTestIdAndLevelMutation,
  useGetTestAttemptsByTestIdMutation,
  useGetAttemptByTestAndUserMutation,
  useCreateAttemptMutation,
  useGetAttemptInfoMutation,
  useCreateTestPoolMutation,
  useGenerateTestQuestionsMutation,
  useGetAllTestsMutation,
  useGetTestByTestIdMutation,
  useGetQuestionsByTestIdMutation,
  useSubmitTestAnswerMutation,
  useSubmitTestMutation,
  useGetTestResultsMutation,
  useGetMyTestAttemptsMutation,
  useUpdateTestPoolMutation,
  useGetTestResultMutation,
  useGetListAttemptMutation,
  useGetTestPoolsByCreatorIdMutation,
  useSaveAnswersMutation,
  useCheckExistTestPoolMutation,
  useGetAttemptDetailByUserAndTestMutation,
  useCreateTestMutation,
} = testApi;

export default testApi;
