import axiosInstance from "../lib/axios";

export const userApi = {
  getStats: async () => {
    const { data } = await axiosInstance.get("/users/stats");
    return data;
  }
};
