import api from "./api";

export const userApi = {
  // Get user profile
  getProfile: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put("users/profile", profileData);
    return response.data;
  },
};
