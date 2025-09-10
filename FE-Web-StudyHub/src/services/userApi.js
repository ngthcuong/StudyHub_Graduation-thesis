import axios from "axios";
import config from "../configs/config";

const accessToken = localStorage.getItem("accessToken");

const getUserInfor = async () => {
  try {
    const response = await axios.get(`${config.baseApiUrl}/users/profile`, {
      headers: {
        Authorization: `Bear ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      console.log(response.data);
      return response.data.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Get user information failed: ", error);

    // Log more detailed error information
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }

    throw error;
  }
};

const updateUserInfor = async (data) => {
  try {
    console.log(data);
  } catch (error) {
    console.error("Register failed: ", error);

    // Log more detailed error information
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }

    throw error;
  }
};

export default { getUserInfor, updateUserInfor };
