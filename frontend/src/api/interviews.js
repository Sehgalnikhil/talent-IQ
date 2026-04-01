import axiosInstance from "../lib/axios";

export const interviewApi = {
  saveSession: async (sessionData) => {
    const { data } = await axiosInstance.post("/interview/sessions", sessionData);
    return data;
  },
  getSessions: async () => {
    const { data } = await axiosInstance.get("/interview/sessions");
    return data;
  }
};
