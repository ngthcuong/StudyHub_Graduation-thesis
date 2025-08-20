import axios, { AxiosResponse } from "axios";

// Định nghĩa kiểu dữ liệu cho login
interface LoginPayload {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    // 👉 bổ sung các field khác mà backend trả về
  };
}

// Login
const login = async ({
  email,
  password,
}: LoginPayload): Promise<AxiosResponse<AuthResponse>> => {
  console.log({ email, password });
  try {
    const response = await axios.post<AuthResponse>(
      `http://localhost:3000/api/v1/auth/login`,
      {
        email,
        password,
      }
    );

    console.log(response);

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

// Định nghĩa kiểu dữ liệu cho register
interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  // 👉 bổ sung thêm nếu backend yêu cầu
}

const register = async (
  data: RegisterPayload
): Promise<AxiosResponse<AuthResponse>> => {
  try {
    console.log("data register: ", { data });

    const response = await axios.post<AuthResponse>(
      `http://localhost:3000/api/v1/auth/register`,
      data
    );

    console.log("res in service: ", response);
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
