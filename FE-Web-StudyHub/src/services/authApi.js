// import axios from "axios";
// import config from "../configs/config";
import { rootApi } from "./rootApi";
import { login } from "../redux/slices/auth";

// const login = async ({ email, password }) => {
//   try {
//     console.log({ email, password });

//     const response = await axios.post(`${config.baseApiUrl}/auth/login`, {
//       email,
//       password,
//     });

//     console.log(response);

//     return response;
//   } catch (error) {
//     console.error("Login failed: ", error);

//     // Log more detailed error information
//     if (error.response) {
//       console.error("Error status:", error.response.status);
//       console.error("Error data:", error.response.data);
//     }

//     throw error;
//   }
// };

// const register = async (data) => {
//   try {
//     console.log("data register: ", {
//       data,
//     });

//     const response = await axios.post(
//       `${config.baseApiUrl}/auth/register`,
//       data
//     );

//     console.log("res in service: ", response);
//     return response;
//   } catch (error) {
//     console.error("Register failed: ", error);

//     // Log more detailed error information
//     if (error.response) {
//       console.error("Error status:", error.response.status);
//       console.error("Error data:", error.response.data);
//     }

//     throw error;
//   }
// };

// const changePassword = async ({ currentPassword, newPassword }) => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.post(
//       `${config.baseApiUrl}/auth/change-password`,
//       { currentPassword, newPassword },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (response.status === 200) {
//       return response.data.message;
//     } else {
//       return response.data.error;
//     }
//   } catch (error) {
//     console.error("Change password failed: ", error);

//     // Log more detailed error information
//     if (error.response) {
//       console.error("Error status:", error.response.status);
//       console.error("Error data:", error.response.data);
//     }

//     throw error;
//   }
// };

export const authApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
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
    }),

    // RefreshToken
    refreshToken: builder.mutation({
      query: (refreshToken) => ({
        url: "/auth/refreshToken",
        method: "POST",
        body: { refreshToken },
      }),
    }),

    // Lấy thông tin người dùng
    getUserInfo: builder.query({
      query: () => "/user/profile",
    }),
  }),
});

// export default { login, register, changePassword };
export const { useLoginMutation, useRefreshTokenMutation } = authApi;
export default authApi;
