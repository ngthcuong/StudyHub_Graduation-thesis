import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import config from "../configs/config";
import { login, logout } from "../redux/slices/auth";

// Base Query
const baseQuery = fetchBaseQuery({
  baseUrl: config.baseApiUrl,
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.accessToken;
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Refresh Token
    const refreshResult = await baseQuery(
      {
        url: "/auth/refreshToken",
        method: "POST",
        body: { refreshToken: api.getState().auth.refreshToken },
      },
      api,
      extraOptions
    );
    if (refreshResult.data) {
      // Lưu accessToken vào state
      api.dispatch(login(refreshResult.data));
      //   Retry request với accessToken mới
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const rootApi = createApi({
  reducerPath: "rootApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
