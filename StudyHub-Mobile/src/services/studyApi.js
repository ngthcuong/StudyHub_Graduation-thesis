import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import api from "./api";

export const studyApi = {
  getStudyStats: async (year, month) => {
    try {
      const response = await api.get(`/study-stats/${year}/${month}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching study stats:", error);
      throw error;
    }
  },
};
