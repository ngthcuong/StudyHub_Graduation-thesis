import axios from "axios";
import { store } from "../store/store";
import { refreshToken, logout } from "../store/slices/authSlice";

// Base API configuration
const API_BASE_URL = "http://localhost:5000/api"; // Update this with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const state = store.getState();
        const refreshTokenValue = state.auth.refreshTokenValue;

        if (refreshTokenValue) {
          await store.dispatch(refreshToken(refreshTokenValue)).unwrap();

          // Retry the original request with new token
          const newState = store.getState();
          originalRequest.headers.Authorization = `Bearer ${newState.auth.token}`;
          return api(originalRequest);
        } else {
          // No refresh token, logout user
          store.dispatch(logout());
        }
      } catch (refreshError) {
        // Refresh failed, logout user
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default api;
