import { rootApi } from "./rootApi";

export const grammarLessonApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // 📘 Lấy tất cả bài học ngữ pháp
    getAllGrammarLessons: builder.mutation({
      query: () => ({
        url: "/grammar-lessons",
        method: "GET",
      }),
      providesTags: ["GrammarLesson"],
    }),

    // 📘 Lấy chi tiết 1 bài học ngữ pháp
    getGrammarLessonById: builder.mutation({
      query: (id) => ({
        url: `/grammar-lessons/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "GrammarLesson", id }],
    }),

    // ✏️ Tạo bài học mới (Admin)
    createGrammarLesson: builder.mutation({
      query: (lessonData) => ({
        url: "/grammar-lessons",
        method: "POST",
        body: lessonData,
      }),
      invalidatesTags: ["GrammarLesson"],
    }),

    // 🛠 Cập nhật bài học
    updateGrammarLesson: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/grammar-lessons/${id}`,
        method: "PATCH",
        body: updateData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "GrammarLesson", id },
        "GrammarLesson",
      ],
    }),

    // ❌ Xóa bài học
    deleteGrammarLesson: builder.mutation({
      query: (id) => ({
        url: `/grammar-lessons/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["GrammarLesson"],
    }),

    // GET ALL COURSES
    getAllCourses: builder.mutation({
      query: () => ({
        url: "/courses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    // GET LESSONS BY COURSE ID
    getLessonsByCourseId: builder.mutation({
      query: (courseId) => ({
        url: `/grammar-lessons/course/${courseId}`,
        method: "GET",
      }),
      providesTags: (result, error, courseId) => [
        { type: "GrammarLesson", id: `COURSE_${courseId}` },
      ],
    }),

    // GET PART BY PART ID
    getPartById: builder.mutation({
      query: (partId) => ({
        url: `/grammar-lessons/parts/${partId}`,
        method: "GET",
      }),
      providesTags: (result, error, partId) => [
        { type: "GrammarLesson", id: `PART_${partId}` },
      ],
    }),

    // GET COURSE BY ID
    getCourseById: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    // GET MY COURSES
    getMyCourses: builder.mutation({
      query: (userId) => ({
        url: `courses/my-courses/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [
        { type: "Course", id: `USER_${userId}` },
      ],
    }),

    // ADD TEST TO LESSON
    addTestToLesson: builder.mutation({
      query: ({ lessonId, testId }) => ({
        url: `/grammar-lessons/${lessonId}/tests`,
        method: "POST",
        body: { testId },
      }),
      invalidatesTags: (result, error, { lessonId }) => [
        { type: "GrammarLesson", id: lessonId },
        "GrammarLesson",
      ],
    }),
  }),
});

export const {
  useGetAllGrammarLessonsMutation,
  useGetGrammarLessonByIdMutation,
  useCreateGrammarLessonMutation,
  useUpdateGrammarLessonMutation,
  useDeleteGrammarLessonMutation,
  useGetAllCoursesMutation,
  useGetLessonsByCourseIdMutation,
  useGetPartByIdMutation,
  useGetCourseByIdMutation,
  useGetMyCoursesMutation,
  useAddTestToLessonMutation,
} = grammarLessonApi;

export default grammarLessonApi;
