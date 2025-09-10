import { createSlice } from "@reduxjs/toolkit";
import { snackbarSlice } from "./snackbar";

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
      localStorage.setremoveItemItem("refreshToken");
    },
  },
});

export const { login } = snackbarSlice.actions;
export default snackbarSlice.reducer;
