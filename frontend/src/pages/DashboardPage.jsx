import { useNavigate, Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useMemo } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import axiosInstance from "../lib/axios";
import { BrainCircuitIcon, SparklesIcon, TrendingUpIcon, TargetIcon, RocketIcon, ZapIcon, FlameIcon, ClockIcon, CalendarIcon, LockIcon, CheckCircleIcon } from "lucide-react";
import { motion } from "framer-motion";
import { PROBLEMS } from "../data/problems";
import { getEarnedBadges } from "../lib/badges.jsx";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import { KarmaWidget, ReadinessWidget, PomodoroWidget, StudyPlanWidget, RecommenderWidget } from "../components/DashboardWidgets";

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });

  const createSessionMutation = useCreateSession();

  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const [aiReport, setAiReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [dailyTip, setDailyTip] = useState("");

  // Real data from localStorage
  const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
  const submissions = JSON.parse(localStorage.getItem("pastSubmissions") || "[]");
  const badges = getEarnedBadges();

  useEffect(() => {
    const tips = [
      "AI Career Advisor: Your algorithm speed is great! Focus on System Design patterns today to balance your profile.",
      "AI Career Advisor: You are heavily reliant on Arrays. Try tackling Graph traversals (DFS/BFS) this week.",
      "AI Career Advisor: Mock interviews increase offer-rates by 45%. Jump into the Interview Arena!",
      "AI Career Advisor: Companies like your target (Google) are asking more sliding window problems recently."
    ];
    setDailyTip(tips[Math.floor(Math.random() * tips.length)]);
  }, []);

  useEffect(() => {
    if (solved.length > 0 && !aiReport) {
      setIsGeneratingReport(true);
      axiosInstance.post("/interview/skill-report", { solvedProblems: solved })
        .then(res => setAiReport(res.data))
        .catch(err => console.error("AI Insight error", err))
        .finally(() => setIsGeneratingReport(false));
    }
  }, []);

  // Feature #5: Daily Challenge — deterministic seed from today's date
  const dailyChallenge = useMemo(() => {
    const allProblems = Object.values(PROBLEMS);
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const idx = seed % allProblems.length;
    const problem = allProblems[idx];
    const isDone = solved.includes(problem.id);
    // Hours remaining
    const now = new Date();
    const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const hoursLeft = Math.floor((endOfDay - now) / 1000 / 60 / 60);
    const minsLeft = Math.floor(((endOfDay - now) / 1000 / 60) % 60);
    return { problem, isDone, hoursLeft, minsLeft };
  }, [solved]);

  // Feature #3: Real heatmap from submissions
  const heatmapData = useMemo(() => {
    const map = {};
    submissions.forEach(s => {
      const day = new Date(s.timestamp).toDateString();
      map[day] = (map[day] || 0) + 1;
    });
    // Also count solved problems by looking at sessions
    return map;
  }, [submissions]);

  const getHeatmapColor = (count) => {
    if (count === 0) return 'bg-base-200/50';
    if (count === 1) return 'bg-primary/30';
    if (count === 2) return 'bg-primary/60';
    return 'bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.8)]';
  };

  // Feature #4: Sparkline data from last 7 days
  const sparklineData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      data.push(heatmapData[key] || 0);
    }
    return data;
  }, [heatmapData]);

  const maxSpark = Math.max(...sparklineData, 1);
  const sparkPoints = sparklineData.map((v, i) => `${(i / 6) * 100},${100 - (v / maxSpark) * 80}`).join(" ");

  // Feature #7: streak calculation
  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      if (heatmapData[key] && heatmapData[key] > 0) {
        streak++;
      } else if (i > 0) break; // allow today to be 0
    }
    return streak;
  }, [heatmapData]);

  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      { problem: roomConfig.problem, difficulty: roomConfig.difficulty.toLowerCase() },
      { onSuccess: (data) => { setShowCreateModal(false); navigate(`/session/${data.session._id}`); } }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const isUserInSession = (session) => {
    if (!user.id) return false;
    return session.host?.clerkId === user.id || session.participant?.clerkId === user.id;
  };

  const containerVariants = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.15 } } };
  const itemVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } } };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-200 font-sans selection:bg-primary/30 pb-20">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <div className="max-w-7xl mx-auto px-6 space-y-8 mt-2">

          {/* Feature #5: DAILY CHALLENGE CARD */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 80 }}
            className={`relative overflow-hidden rounded-3xl border shadow-xl p-6 ${dailyChallenge.isDone ? 'bg-success/10 border-success/30' : 'bg-gradient-to-r from-warning/10 via-base-100 to-error/10 border-warning/30'}`}
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-warning/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${dailyChallenge.isDone ? 'bg-success/20' : 'bg-warning/20 animate-pulse'}`}>
                  {dailyChallenge.isDone ? <CheckCircleIcon className="size-8 text-success" /> : <ZapIcon className="size-8 text-warning" />}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-warning">Daily Challenge</span>
                    {dailyChallenge.isDone && <span className="badge badge-success badge-sm">Completed!</span>}
                  </div>
                  <h3 className="text-xl font-black">{dailyChallenge.problem.title}</h3>
                  <p className="text-sm text-base-content/60">{dailyChallenge.problem.difficulty} • {dailyChallenge.problem.category}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {!dailyChallenge.isDone && (
                  <div className="flex items-center gap-2 text-sm font-bold text-base-content/50">
                    <ClockIcon className="size-4" />
                    {dailyChallenge.hoursLeft}h {dailyChallenge.minsLeft}m left
                  </div>
                )}
                <Link to={`/problem/${dailyChallenge.problem.id}`} className="btn btn-warning btn-sm shadow-lg gap-2 font-bold">
                  {dailyChallenge.isDone ? "Review" : "Solve Now"} <ZapIcon className="size-4" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* AI Daily Tip */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 80 }}
            className="bg-gradient-to-r from-primary/20 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-4 flex items-center gap-4 relative overflow-hidden backdrop-blur-md shadow-lg shadow-primary/5"
          >
            <div className="p-3 bg-primary/20 rounded-xl">
              <SparklesIcon className="size-6 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium text-base-content/80 tracking-wide">{dailyTip}</p>
            </div>
          </motion.div>

          <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Feature #3: REAL HEATMAP + Feature #4: SPARKLINES */}
            <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 group">
              <div className="h-full card bg-base-100/60 backdrop-blur-xl shadow-2xl shadow-base-300/50 border border-base-100 hover:border-primary/30 transition-all duration-500 overflow-hidden relative p-8 rounded-3xl">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none transition-transform group-hover:scale-110"></div>

                <h3 className="text-2xl font-bold mb-2 flex items-center justify-between z-10 relative">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-base-content to-base-content/60">Activity Portfolio</span>
                  <div className="flex items-center gap-3">
                    <div className="badge badge-outline font-bold gap-1"><FlameIcon className="size-3 text-orange-500" /> {currentStreak} day streak</div>
                    <div className="badge badge-primary font-bold shadow-sm shadow-primary/40"><TrendingUpIcon className="size-3 mr-1" /> {submissions.length} submissions</div>
                  </div>
                </h3>

                {/* Mini Sparkline */}
                <div className="flex items-center gap-3 mb-4 z-10 relative">
                  <span className="text-xs font-bold text-base-content/40">Last 7 days:</span>
                  <svg width="100" height="30" viewBox="0 0 100 100" className="overflow-visible">
                    <polyline fill="none" stroke="oklch(var(--p))" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={sparkPoints} />
                    {sparklineData.map((v, i) => (
                      <circle key={i} cx={(i / 6) * 100} cy={100 - (v / maxSpark) * 80} r="3" fill="oklch(var(--p))" />
                    ))}
                  </svg>
                  <span className="text-xs font-bold text-primary">{sparklineData[6]} today</span>
                </div>

                <div className="flex gap-1.5 overflow-x-auto pb-4 no-scrollbar z-10 relative">
                  {Array.from({ length: 52 }).map((_, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-1.5">
                      {Array.from({ length: 7 }).map((_, dayIndex) => {
                        const today = new Date();
                        const checkDate = new Date(today);
                        checkDate.setDate(today.getDate() - (51 - weekIndex) * 7 - (6 - dayIndex));
                        const key = checkDate.toDateString();
                        const count = heatmapData[key] || 0;

                        return (
                          <div
                            key={dayIndex}
                            className={`w-4 h-4 rounded-md transition-all duration-300 hover:scale-125 hover:z-20 cursor-crosshair ${getHeatmapColor(count)}`}
                            title={`${count} submission${count !== 1 ? 's' : ''} on ${checkDate.toLocaleDateString()}`}
                          ></div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center text-xs opacity-60 mt-4 font-semibold z-10 relative">
                  <span>1 Year Ago</span>
                  <div className="flex items-center gap-2">
                    <span>Less</span>
                    <div className="w-4 h-4 rounded-md bg-base-200/50"></div>
                    <div className="w-4 h-4 rounded-md bg-primary/30"></div>
                    <div className="w-4 h-4 rounded-md bg-primary/60"></div>
                    <div className="w-4 h-4 rounded-md bg-primary shadow-[0_0_8px_rgba(var(--color-primary),0.8)]"></div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* AI Language Analytics */}
            <motion.div variants={itemVariants} className="col-span-1 group">
              <div className="h-full card bg-base-100/60 backdrop-blur-xl shadow-2xl shadow-base-300/50 border border-base-100 hover:border-secondary/30 transition-all duration-500 flex flex-col relative overflow-hidden p-8 rounded-3xl">
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl -ml-10 -mb-10 pointer-events-none transition-transform group-hover:scale-110"></div>
                <h3 className="text-xl font-bold mb-6 flex items-center justify-between z-10 relative">
                  <span>AI Language Analytics</span>
                  <div className={`p-2 rounded-xl bg-secondary/10 ${isGeneratingReport ? 'animate-spin' : ''}`}>
                    <BrainCircuitIcon className="size-5 text-secondary" />
                  </div>
                </h3>

                {isGeneratingReport ? (
                  <div className="flex-1 flex flex-col p-4 items-center justify-center opacity-70 z-10 relative">
                    <span className="loading loading-spinner text-secondary loading-lg mb-4"></span>
                    <p className="text-sm mt-2 text-center font-medium animate-pulse">Gemini is analyzing your execution data...</p>
                  </div>
                ) : aiReport ? (
                  <div className="space-y-6 relative z-10 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      {Object.entries(aiReport.languages || {}).map(([lang, percentage], i) => (
                        <div key={lang} className="relative">
                          <div className="flex justify-between mb-1.5 text-sm font-bold opacity-80">
                            <span>{lang}</span><span className={i === 0 ? "text-primary" : i === 1 ? "text-secondary" : "text-accent"}>{percentage}%</span>
                          </div>
                          <div className="h-2.5 w-full bg-base-200 rounded-full overflow-hidden">
                            <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                              className={`h-full rounded-full ${i === 0 ? 'bg-primary' : i === 1 ? 'bg-secondary' : 'bg-accent'} shadow-lg`} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 bg-gradient-to-br from-secondary/10 to-transparent border border-secondary/20 p-4 rounded-xl text-sm leading-relaxed backdrop-blur-sm shadow-inner">
                      <div className="flex items-center gap-2 mb-2"><TargetIcon className="size-4 text-secondary" /><strong className="text-secondary tracking-wide">AI Recommendation</strong></div>
                      <p className="text-base-content/80 font-medium">{aiReport.recommendation}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col p-6 items-center justify-center bg-base-200/30 border border-dashed border-base-300 rounded-2xl text-center z-10 relative">
                    <RocketIcon className="size-10 text-base-content/20 mb-3" />
                    <p className="text-sm font-semibold opacity-60">Solve problems to unlock AI Language Analytics!</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Feature #20: ACHIEVEMENT BADGES */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, type: "spring", stiffness: 100 }}>
            <div className="card bg-base-100/60 backdrop-blur-xl shadow-2xl border border-base-100 rounded-3xl p-8">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <span>🏅 Achievement Badges</span>
                <span className="badge badge-primary badge-sm">{badges.filter(b => b.earned).length}/{badges.length}</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-300 ${badge.earned
                      ? `${badge.bg} shadow-lg hover:scale-105 cursor-default`
                      : 'bg-base-200/30 border-base-300 opacity-40 grayscale'
                      }`}
                  >
                    <div className={`mx-auto mb-2 ${badge.earned ? badge.color : 'text-base-content/30'}`}>
                      {badge.icon}
                    </div>
                    <div className="text-xs font-bold truncate">{badge.name}</div>
                    <div className="text-[9px] text-base-content/50 mt-0.5">{badge.description}</div>
                    {!badge.earned && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <LockIcon className="size-5 text-base-content/20" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, type: "spring", stiffness: 100 }} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <StatsCards activeSessionsCount={activeSessions.length} recentSessionsCount={recentSessions.length} />
            <div className="col-span-1 lg:col-span-2">
              <ActiveSessions sessions={activeSessions} isLoading={loadingActiveSessions} isUserInSession={isUserInSession} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, type: "spring", stiffness: 100 }}>
            <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
          </motion.div>

          {/* ─── New Feature Widgets ─── */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ReadinessWidget />
            <KarmaWidget />
            <PomodoroWidget />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-6"
          >
            <StudyPlanWidget />
            <RecommenderWidget />
          </motion.div>
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
