import api from "./api";

export const certificateApi = {
  getCertificateByWalletAddress: async (walletAddress) => {
    const response = await api.get(`/certs/student/${walletAddress}`);
    return response.data;
  },
};
