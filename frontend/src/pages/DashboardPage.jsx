import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import axiosInstance from "../lib/axios";
import { BrainCircuitIcon } from "lucide-react";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  // AI Insights State
  const [aiReport, setAiReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  useEffect(() => {
    // simulate checking which problems the user solved (normally from DB)
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    if (solved.length > 0 && !aiReport) {
      setIsGeneratingReport(true);
      axiosInstance.post("/interview/skill-report", { solvedProblems: solved })
        .then(res => setAiReport(res.data))
        .catch(err => console.error("AI Insight error", err))
        .finally(() => setIsGeneratingReport(false));
    }
  }, [aiReport]);

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;

    createSessionMutation.mutate(
      {
        problem: roomConfig.problem,
        difficulty: roomConfig.difficulty.toLowerCase(),
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];

  const isUserInSession = (session) => {
    if (!user.id) return false;

    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  // Generate 7 rows x 52 cols of random colors for heatmap
  const getHeatmapColor = (intensity) => {
    if (intensity === 0) return 'bg-base-300';
    if (intensity === 1) return 'bg-success/30';
    if (intensity === 2) return 'bg-success/60';
    return 'bg-success';
  };

  return (
    <>
      <div className="min-h-screen bg-base-300">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <div className="container mx-auto px-6 pb-16 space-y-6">

          {/* USER PROFILE & HEATMAP ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-1 lg:col-span-2 card bg-base-100 shadow-sm border border-base-300 p-6">
              <h3 className="text-xl font-bold mb-4">Activity Portfolio</h3>
              <div className="flex gap-1 overflow-x-auto pb-2">
                {Array.from({ length: 52 }).map((_, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {Array.from({ length: 7 }).map((_, dayIndex) => {
                      // Map active session dates to intensity
                      const today = new Date();
                      const checkDate = new Date(today);
                      checkDate.setDate(today.getDate() - (52 - weekIndex) * 7 + dayIndex);

                      const sessionsOnDay = recentSessions.filter(s => {
                        const sDate = new Date(s.createdAt);
                        return sDate.toDateString() === checkDate.toDateString();
                      }).length;

                      let intensity = 0;
                      if (sessionsOnDay > 2) intensity = 3;
                      else if (sessionsOnDay === 2) intensity = 2;
                      else if (sessionsOnDay === 1) intensity = 1;

                      return (
                        <div key={dayIndex} className={`w-3.5 h-3.5 rounded-sm ${getHeatmapColor(intensity)}`}></div>
                      )
                    })}
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs opacity-50 mt-2 font-semibold">
                <span>1 Year Ago</span>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  <div className="w-3.5 h-3.5 rounded-sm bg-base-300"></div>
                  <div className="w-3.5 h-3.5 rounded-sm bg-success/30"></div>
                  <div className="w-3.5 h-3.5 rounded-sm bg-success/60"></div>
                  <div className="w-3.5 h-3.5 rounded-sm bg-success"></div>
                  <span>More</span>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-sm border border-base-300 p-6 flex flex-col relative overflow-hidden">
              <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
                <span>AI Language Analytics</span>
                <BrainCircuitIcon className={`size-5 text-primary ${isGeneratingReport ? 'animate-pulse' : ''}`} />
              </h3>

              {isGeneratingReport ? (
                <div className="flex-1 flex flex-col p-4 items-center justify-center opacity-70">
                  <span className="loading loading-spinner text-primary"></span>
                  <p className="text-xs mt-2 text-center">Gemini is analyzing your solved problems...</p>
                </div>
              ) : aiReport ? (
                <div className="space-y-4 relative z-10 flex-1 flex flex-col justify-between">
                  <div>
                    {Object.entries(aiReport.languages || {}).map(([lang, percentage], i) => (
                      <div key={lang} className="mb-2">
                        <div className="flex justify-between mb-1 text-sm font-semibold">
                          <span>{lang}</span><span>{percentage}%</span>
                        </div>
                        <progress className={`progress w-full ${i === 0 ? 'progress-warning' : i === 1 ? 'progress-info' : 'progress-error'}`} value={percentage} max="100"></progress>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 bg-primary/10 border border-primary/20 p-3 rounded-lg text-xs leading-relaxed">
                    <strong className="text-primary block mb-1">AI Recommendation:</strong>
                    {aiReport.recommendation}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-4 items-center justify-center bg-base-200/50 rounded-xl text-center">
                  <p className="text-sm opacity-60">Solve problems in the Arena to generate your AI Language analytics profile!</p>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StatsCards
              activeSessionsCount={activeSessions.length}
              recentSessionsCount={recentSessions.length}
            />
            <ActiveSessions
              sessions={activeSessions}
              isLoading={loadingActiveSessions}
              isUserInSession={isUserInSession}
            />
          </div>

          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </div>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
