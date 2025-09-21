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
  }),
});

export const { useGetUserInfoQuery, useUpdateUserInfoMutation } = userApi;
export default userApi;
