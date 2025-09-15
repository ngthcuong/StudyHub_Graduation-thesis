import axios from "axios";
import config from "../configs/config";

const verifyCertificateByHash = async (hash) => {
  try {
    const { data } = await axios.get(`${config.baseApiUrl}/certs/hash/${hash}`);
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Certificate not found");
    }
    throw new Error("Network error");
  }
};

const verifyCertificateByCode = async (code) => {
  try {
    const { data } = await axios.get(`${config.baseApiUrl}/certs/code/${code}`);
    return data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data?.message || "Certificate not found");
    }
    throw new Error("Network error");
  }
};

export { verifyCertificateByHash, verifyCertificateByCode };
