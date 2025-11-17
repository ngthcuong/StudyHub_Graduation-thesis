import { rootApi } from "./rootApi";

export const paymentApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Tạo payment mới (thanh toán khóa học)
    createPayment: builder.mutation({
      query: (paymentData) => ({
        url: "/payments",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["Payment", "Course"],
    }),

    // Lấy danh sách payments của user hiện tại
    getMyPayments: builder.query({
      query: () => ({
        url: "/payments/user",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // Lấy danh sách payments của một user cụ thể (admin)
    getPaymentsByUser: builder.query({
      query: (userId) => ({
        url: `/payments/user/${userId}`,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // Lấy danh sách payments của một khóa học
    getPaymentsByCourse: builder.query({
      query: (courseId) => ({
        url: `/payments/course/${courseId}`,
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // Lấy tất cả payments (admin only)
    getAllPayments: builder.query({
      query: () => ({
        url: "/payments/all",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // Lấy thống kê payments cho admin
    getPaymentStatistics: builder.query({
      query: () => ({
        url: "/payments/statistics",
        method: "GET",
      }),
      providesTags: ["Payment"],
    }),

    // Tạo payment link
    createPaymentLink: builder.mutation({
      query: (linkData) => ({
        url: "/payments/create-payment-link",
        method: "POST",
        body: linkData,
      }),
      invalidatesTags: ["Payment", "Course"],
    }),
  }),
});

export const {
  useCreatePaymentMutation,
  useGetMyPaymentsQuery,
  useGetPaymentsByUserQuery,
  useGetPaymentsByCourseQuery,
  useGetAllPaymentsQuery,
  useGetPaymentStatisticsQuery,
  useCreatePaymentLinkMutation,
} = paymentApi;

export default paymentApi;
