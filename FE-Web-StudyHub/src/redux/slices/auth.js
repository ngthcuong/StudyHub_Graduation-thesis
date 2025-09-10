import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: {},
    accessToken: "",
    refreshToken: "",
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("accessToken", state.accessToken);
      localStorage.setItem("refreshToken", state.refreshToken);
    },
    logout: (state) => {
      state.user = {};
      state.accessToken = "";
      state.refreshToken = "";
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    },
    getUserFromStorage: (state) => {
      const user = localStorage.getItem("user");
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");

      if (user && accessToken) {
        state.user = JSON.parse(user);
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      }
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
