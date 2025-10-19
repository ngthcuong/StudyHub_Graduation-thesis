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

    // Lấy thống kê rating của khóa học
    getCourseRatingStats: builder.query({
      query: (courseId) => ({
        url: `/reviews/course/${courseId}/stats`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    // Lấy thống kê tổng quan reviews cho admin
    getAdminReviewStats: builder.query({
      query: () => ({
        url: "/reviews/admin/stats",
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    // Lấy danh sách đánh giá của user
    getReviewsByUser: builder.query({
      query: (userId) => ({
        url: `/reviews/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["Review"],
    }),

    // Lấy đánh giá theo ID
    getReviewById: builder.query({
      query: (reviewId) => ({
        url: `/reviews/${reviewId}`,
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
  useGetCourseRatingStatsQuery,
  useGetAdminReviewStatsQuery,
  useGetReviewsByUserQuery,
  useGetReviewByIdQuery,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = reviewApi;

export default reviewApi;
