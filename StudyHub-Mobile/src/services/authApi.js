import api from "./api";

export const authApi = {
  // Register user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async ({ email, password }) => {
    const response = await api.post("/auth/login", { email, password });
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshTokenValue) => {
    const response = await api.post("/auth/refreshToken", {
      refreshToken: refreshTokenValue,
    });
    return response.data;
  },

  // Change password
  changePassword: async ({ currentPassword, newPassword }) => {
    const response = await api.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async ({ token, newPassword }) => {
    const response = await api.post("/auth/reset-password", {
      token,
      newPassword,
    });
    return response.data;
  },
};
