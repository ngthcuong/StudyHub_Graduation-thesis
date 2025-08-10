import axios from "axios";
import { API_BASE_URL } from "../configs";

export const verifyCertificateByHash = async (hash) => {
  try {
    const { data } = await axios.get(`${API_BASE_URL}/certificates/verify`, {
      params: { hash },
    });
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Certificate not found");
    }
    throw new Error("Network error");
  }
};
