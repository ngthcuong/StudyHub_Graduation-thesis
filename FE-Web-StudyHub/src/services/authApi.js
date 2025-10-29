import { rootApi } from "./rootApi";
import { login } from "../redux/slices/auth";

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    // Đăng ký
    register: builder.mutation({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Đăng nhập
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "/auth/login",
        method: "POST",
        body: { email, password },
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(login(data));
        } catch (error) {
          console.error("Login failed: ", error);
        }
      },
      invalidatesTags: ["User"],
    }),

    // RefreshToken
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refreshToken",
        method: "POST",
        body: { refreshToken },
      }),
      invalidatesTags: ["User"],
    }),

    // Thay đổi mật khẩu
    changePassword: builder.mutation({
      query: ({ currentPassword, newPassword }) => ({
        url: "/auth/change-password",
        method: "POST",
        body: { currentPassword, newPassword },
      }),
      invalidatesTags: ["User"],
    }),

    // Quên mật khẩu - có thể thêm sau nếu cần
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    // reset mật khẩu - có thể thêm sau nếu cần
    resetPassword: builder.mutation({
      query: ({ token, newPassword }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, newPassword },
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useRefreshTokenMutation,
  useChangePasswordMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
export default authApi;
