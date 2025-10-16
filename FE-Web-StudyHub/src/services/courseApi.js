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
    getCourseById: builder.query({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),

    // Tạo mới một khóa học
    createCourse: builder.mutation({
      query: (newCourse) => ({
        url: "/courses",
        method: "POST",
        body: newCourse,
      }),
      invalidatesTags: ["Course"],
    }),

    // Cập nhật thông tin khóa học
    updateCourse: builder.mutation({
      query: ({ id, updatedCourse }) => ({
        url: `/courses/${id}`,
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
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseByIdQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
} = courseApi;

export default courseApi;
