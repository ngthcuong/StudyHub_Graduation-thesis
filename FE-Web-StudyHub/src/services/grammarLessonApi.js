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
  }),
});

export const {
  useGetAllGrammarLessonsMutation,
  useGetGrammarLessonByIdMutation,
  useCreateGrammarLessonMutation,
  useUpdateGrammarLessonMutation,
  useDeleteGrammarLessonMutation,
} = grammarLessonApi;

export default grammarLessonApi;
