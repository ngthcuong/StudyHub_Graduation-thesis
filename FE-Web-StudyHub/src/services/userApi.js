import { rootApi } from "./rootApi";

const userApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Lấy thông tin người dùng
    getUserInfo: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),

    // Cập nhật thông tin người dùng
    updateUserInfo: builder.mutation({
      query: (updateUserData) => ({
        url: "/users/profile",
        method: "PUT",
        body: updateUserData,
      }),
      invalidatesTags: ["User"],
    }),

    // Admin APIs for user management
    // Get all users with statistics
    getUsersWithStats: builder.query({
      query: () => "/users/admin/stats",
      providesTags: ["AdminUsers"],
    }),

    // Get user detail with courses and custom tests
    getUserDetailWithCourses: builder.query({
      query: (userId) => `/users/admin/${userId}/detail`,
      providesTags: (result, error, userId) => [
        { type: "AdminUserDetail", id: userId },
      ],
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useUpdateUserInfoMutation,
  useGetUsersWithStatsQuery,
  useGetUserDetailWithCoursesQuery,
} = userApi;
export default userApi;
