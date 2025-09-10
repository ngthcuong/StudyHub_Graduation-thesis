import axios from "axios";
import config from "../configs/config";

const getUserInfor = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(`${config.baseApiUrl}/users/profile`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
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
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.put(
      `${config.baseApiUrl}/users/profile`,
      data,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (response.status === 200) {
      return response.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Update user information failed: ", error);

    // Log more detailed error information
    if (error.response) {
      console.error("Error status:", error.response.status);
      console.error("Error data:", error.response.data);
    }

    throw error;
  }
};

export default { getUserInfor, updateUserInfor };
