import axios, { AxiosResponse } from "axios";

// --- Payload khi gửi login ---
interface LoginPayload {
  email: string;
  password: string;
}

// --- Payload khi gửi register ---
interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

// --- Response từ backend ---
interface AuthResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  };
}

// Login
const login = async ({
  email,
  password,
}: LoginPayload): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response = await axios.post<AuthResponse>(
      `http://192.168.21.119:3000/api/v1/auth/login`,
      { email, password }
    );
    console.log("res login: ", response.data);
    return response;
  } catch (error: any) {
    console.error("Login failed: ", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};

// Register
const register = async (
  data: RegisterPayload
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    const response = await axios.post<AuthResponse>(
      `http://192.168.21.119:3000/api/v1/auth/register`,
      data
    );
    console.log("res register: ", response.data);
    return response;
  } catch (error: any) {
    console.error("Register failed: ", error);
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }
    throw error;
  }
};

export default { login, register };
