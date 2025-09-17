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
        difficulty,
        question_types,
      }) => ({
        url: "/generate-test",
        method: "POST",
        body: { testId, topic, num_questions, difficulty, question_types },
      }),
      invalidatesTags: ["Question"],
    }),

    // Tạo attempt
    createAttempt: builder.mutation({
      query: ({ testId, userId }) => ({
        url: "/attempts",
        method: "POST",
        body: { testId, userId },
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
