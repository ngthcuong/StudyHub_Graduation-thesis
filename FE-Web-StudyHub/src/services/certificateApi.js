import axios from "axios";
import config from "../configs/config";

export const verifyCertificateByHash = async (hash) => {
  try {
    const { data } = await axios.get(
      `${config.baseApiUrl}/certificates/verify`,
      {
        params: { hash },
      }
    );
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Certificate not found");
    }
    throw new Error("Network error");
  }
};
