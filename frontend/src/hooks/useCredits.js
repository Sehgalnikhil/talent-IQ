import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { creditsApi } from "../api/credits";

const useVerifyPaymentMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => creditsApi.verifyPayment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
        }
    });
};

export const useCredits = () => {
    const queryClient = useQueryClient();
    const verifyPaymentMutation = useVerifyPaymentMutation();

    const query = useQuery({
        queryKey: ["creditBalance"],
        queryFn: creditsApi.getBalance,
        staleTime: 30 * 1000, // 30 seconds
    });

    const purchaseMutation = useMutation({
        mutationFn: ({ amount, packId }) => creditsApi.purchase(amount, packId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["creditBalance"] });
        }
    });

    return {
        balance: query.data?.credits ?? 0,
        nextRefreshIn: query.data?.nextRefreshIn ?? 0,
        isLoading: query.isLoading,
        purchase: purchaseMutation.mutateAsync,
        isPurchasing: purchaseMutation.isPending,
        createOrder: (amount) => creditsApi.createOrder(amount),
        verifyPayment: (data) => verifyPaymentMutation.mutateAsync(data),
        isVerifying: verifyPaymentMutation.isPending
    };
};
