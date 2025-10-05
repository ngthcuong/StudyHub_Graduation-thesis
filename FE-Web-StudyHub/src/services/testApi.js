import { rootApi } from "./rootApi";

// Inject endpoints vào rootApi
export const testApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tạo test
    createTest: builder.mutation({
      query: (testInfo) => ({
        url: "/tests",
        method: "POST",
        body: testInfo,
      }),
      invalidatesTags: ["Test"],
    }),

    // Kiểm tra bài test đã có test pool hay chưa
    checkExistTestPool: builder.mutation({
      query: ({ userId, testId }) => ({
        url: "/attempts/info",
        method: "POST",
        body: { userId, testId },
      }),
      providesTags: ["Attempt"],
    }),

    // Tạo test pool
    createTestPool: builder.mutation({
      query: (testPoolInfo) => ({
        url: "/test-pools",
        method: "POST",
        body: testPoolInfo,
      }),
      invalidatesTags: ["TestPool"],
    }),

    // Lấy test pool theo creator Id
    getTestPoolsByCreatorId: builder.mutation({
      query: (creatorId) => ({
        url: `/test-pools/creator/${creatorId}`,
      }),
      providesTags: ["TestPool"],
    }),

    // Lấy toàn bộ bài test
    getAllTest: builder.query({
      query: () => ({
        url: "/tests",
      }),
      providesTags: ["Test"],
    }),

    // Lấy test theo ID
    getTestByTestId: builder.query({
      query: (testId) => ({
        url: `/tests/${testId}`,
      }),
      providesTags: ["Test"],
    }),

    // Lấy questions theo testId
    getQuestionsByTestId: builder.query({
      query: (testId) => ({
        url: `/questions/test/${testId}`,
      }),
      providesTags: ["Question"],
    }),

    // Tạo câu hỏi test
    generateTestQuestions: builder.mutation({
      query: ({
        testId,
        topic,
        num_questions,
        question_types,
        exam_type,
        score_range,
      }) => ({
        url: "/generate-test",
        method: "POST",
        body: {
          testId,
          topic,
          num_questions,
          question_types,
          exam_type,
          score_range,
        },
      }),
      invalidatesTags: ["Question"],
    }),

    // Tạo attempt
    createAttempt: builder.mutation({
      query: ({ testPoolId }) => ({
        url: "/attempts",
        method: "POST",
        body: { testPoolId },
      }),
      invalidatesTags: ["Test"],
    }),

    // Lưu câu trả lời
    saveAnswers: builder.mutation({
      query: (answers) => ({
        url: "/answers/submit-many",
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // Submit test
    submitTest: builder.mutation({
      query: ({ answers, attemptId }) => ({
        url: `/attempts/${attemptId}/submit`,
        method: "POST",
        body: { answers },
      }),
      invalidatesTags: ["Attempt"],
    }),

    // Lấy kết quả test
    getTestResult: builder.mutation({
      query: ({ testId, attemptId }) => ({
        url: "/test-result/submit",
        method: "POST",
        body: { testId, attemptId },
      }),
      // invalidatesTags: ["Test"],
    }),
  }),
});

// Export hooks
export const {
  useCreateTestMutation,
  useCheckExistTestPoolMutation,
  useCreateTestPoolMutation,
  useGetTestPoolsByCreatorIdMutation,
  useGetAllTestQuery,
  useGetTestByTestIdQuery,
  useGetQuestionsByTestIdQuery,
  useGenerateTestQuestionsMutation,
  useCreateAttemptMutation,
  useSaveAnswersMutation,
  useSubmitTestMutation,
  useGetTestResultMutation,
} = testApi;
export default testApi;
