import axiosInstance from "../lib/axios";

export const creditsApi = {
    getBalance: async () => {
        const res = await axiosInstance.get("/credits/balance");
        return res.data;
    },
    purchase: async (amount, packId) => {
        const res = await axiosInstance.post("/credits/purchase", { amount, packId });
        return res.data;
    },
    createOrder: async (amount) => {
        const res = await axiosInstance.post("/credits/create-order", { amount });
        return res.data;
    },
    verifyPayment: async (paymentData) => {
        const res = await axiosInstance.post("/credits/verify-payment", paymentData);
        return res.data;
    }
};

