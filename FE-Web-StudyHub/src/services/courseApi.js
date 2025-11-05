import { rootApi } from "./rootApi";

export const courseApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy danh sách tất cả các khóa học
    getCourses: builder.query({
      query: () => ({
        url: "/courses",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    // Lấy thông tin chi tiết của một khóa học
    getCourseById: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
        body: { id },
      }),
      invalidatesTags: ["Course"],
    }),

    // Tạo mới một khóa học
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/courses/create",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: ["Course"],
    }),

    // Cập nhật thông tin khóa học
    updateCourse: builder.mutation({
      query: ({ id, ...updatedCourse }) => ({
        url: `/courses/update/${id}`,
        method: "PUT",
        body: updatedCourse,
      }),
      invalidatesTags: ["Course"],
    }),

    // Xóa một khóa học
    deleteCourse: builder.mutation({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),

    // Lấy thống kê courses cho admin
    getCourseStatistics: builder.query({
      query: () => ({
        url: "/courses/statistics",
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCourseStatisticsQuery,
} = courseApi;

export default courseApi;
