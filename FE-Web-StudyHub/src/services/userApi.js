import { rootApi } from "./rootApi";

// const getUserInfor = async () => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.get(`${config.baseApiUrl}/users/profile`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//         "Content-Type": "application/json",
//       },
//     });
//     if (response.status === 200) {
//       return response.data.data;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Get user information failed: ", error);

//     // Log more detailed error information
//     if (error.response) {
//       console.error("Error status:", error.response.status);
//       console.error("Error data:", error.response.data);
//     }

//     throw error;
//   }
// };

// const updateUserInfor = async (data) => {
//   try {
//     const accessToken = localStorage.getItem("accessToken");
//     const response = await axios.put(
//       `${config.baseApiUrl}/users/profile`,
//       data,
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     if (response.status === 200) {
//       return response.data;
//     } else {
//       return null;
//     }
//   } catch (error) {
//     console.error("Update user information failed: ", error);

//     // Log more detailed error information
//     if (error.response) {
//       console.error("Error status:", error.response.status);
//       console.error("Error data:", error.response.data);
//     }

//     throw error;
//   }
// };

// export default { getUserInfor, updateUserInfor };

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
