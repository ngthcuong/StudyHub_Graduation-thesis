import axios from "axios";
import config from "../configs/config";

const login = async ({ email, password }) => {
  try {
    console.log({ email, password });

    const response = await axios.post(`${config.baseApiUrl}/auth/login`, {
      email,
      password,
    });

    console.log(response);

    return response;
  } catch (error) {
    console.error("Login failed: ", error);
  }
};

const register = async (data) => {
  try {
    console.log("data register: ", {
      data,
    });

    const response = await axios.post(
      `${config.baseApiUrl}/auth/register`,
      data
    );

    console.log("res in service: ", response);
    return response;
  } catch (error) {
    console.error("Register failed: ", error);
    throw error;
  }
};

export default { login, register };
