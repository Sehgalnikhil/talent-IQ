import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/users";

export const useUserStats = () => {
  return useQuery({
    queryKey: ["userStats"],
    queryFn: userApi.getStats,
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true,
  });
};
