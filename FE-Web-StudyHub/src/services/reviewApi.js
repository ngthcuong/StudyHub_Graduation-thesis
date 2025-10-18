import { rootApi } from "./rootApi";

export const reviewApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tạo đánh giá mới
    createReview: builder.mutation({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: ["Review", "Course"],
    }),

    // Lấy danh sách đánh giá của khóa học
    getReviewsByCourse: builder.query({
      query: (courseId) => ({
        url: `/reviews/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    // Cập nhật đánh giá
    updateReview: builder.mutation({
      query: ({ id, reviewData }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: reviewData,
      }),
      invalidatesTags: ["Review", "Course"],
    }),

    // Xóa đánh giá
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Review", "Course"],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useGetReviewsByCourseQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;

export default reviewApi;
