import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { interviewApi } from "../api/interviews";

export const useInterviewSessions = () => {
  return useQuery({
    queryKey: ["interviewSessions"],
    queryFn: interviewApi.getSessions,
  });
};

export const useSaveInterviewSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: interviewApi.saveSession,
    
    // 🚀 OPTIMISTIC UPDATE Logic
    onMutate: async (newSession) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["userStats"] });
      await queryClient.cancelQueries({ queryKey: ["interviewSessions"] });

      // Snapshot the previous value
      const previousStats = queryClient.getQueryData(["userStats"]);
      const previousSessions = queryClient.getQueryData(["interviewSessions"]) || [];

      // Optimistically update to the new value
      if (previousStats) {
        queryClient.setQueryData(["userStats"], (old) => {
          const sessionScore = newSession.score || 0;
          
          // Basic ELO calculation logic match
          const normalizedScore = sessionScore / 100;
          const eloChange = Math.round(20 * (normalizedScore - 0.5));

          return {
            ...old,
            points: (old.points || 0) + sessionScore,
            speedrun: {
              ...old.speedrun,
              elo: Math.max(800, (old.speedrun?.elo || 1200) + eloChange),
              wins: sessionScore >= 70 ? (old.speedrun?.wins || 0) + 1 : (old.speedrun?.wins || 0)
            },
            // Note: Streak is harder to predict accurately without complex date logic
            // but we can increment it if it's a new day effectively.
          };
        });
      }

      queryClient.setQueryData(["interviewSessions"], (old = []) => [
        { ...newSession, createdAt: new Date().toISOString(), optimistic: true },
        ...old,
      ]);

      return { previousStats, previousSessions };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newSession, context) => {
      queryClient.setQueryData(["userStats"], context.previousStats);
      queryClient.setQueryData(["interviewSessions"], context.previousSessions);
      toast.error("Failed to sync session with cloud arena.");
    },

    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats"] });
      queryClient.invalidateQueries({ queryKey: ["interviewSessions"] });
    },
    
    onSuccess: () => {
      toast.success("Identity Matrix & Progress Synchronized!");
    }
  });
};
