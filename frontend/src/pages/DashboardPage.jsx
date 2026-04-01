import { useNavigate, Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
import { useUserStats } from "../hooks/useUserStats";
import { useCredits } from "../hooks/useCredits";
import axiosInstance from "../lib/axios";


import { 
  BrainCircuitIcon, 
  SparklesIcon, 
  TrendingUpIcon, 
  TargetIcon, 
  RocketIcon, 
  ZapIcon, 
  FlameIcon, 
  ClockIcon, 
  CalendarIcon, 
  LockIcon, 
  CheckCircleIcon, 
  TrophyIcon,
  LayoutDashboardIcon,
  CommandIcon,
} from "lucide-react";
import { motion, useMotionValue, useTransform, animate, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, Environment, PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import Navbar from "../components/Navbar";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import { PROBLEMS } from "../data/problems";
import { getEarnedBadges } from "../lib/badges.jsx";
import TiltCard from '../components/TiltCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { KarmaWidget, ReadinessWidget, PomodoroWidget, StudyPlanWidget, HireabilityWidget, InterviewSessionsWidget } from "../components/DashboardWidgets";

import { 
  SpacedRepetitionWidget, 
  AdaptiveDifficultyWidget, 
  WeaknessHeatmapWidget, 
  StudyTimeWidget, 
  BurnoutWidget, 
  PatternStatsWidget 
} from "../components/MLWidgets";
import GauntletTransition from "../components/GauntletTransition";

// --- GSAP REGISTRATION ---
gsap.registerPlugin(ScrollTrigger);

// --- 3D BACKGROUND COMPONENT WITH THEME SUPPORT ---

function CommandCenterBackground({ isDark }) {
  const shardsRef = useRef();
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (shardsRef.current) {
      shardsRef.current.rotation.y = t * 0.03;
      shardsRef.current.rotation.x = t * 0.01;
    }
  });

  return (
    <group ref={shardsRef}>
      {isDark && <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />}
      <Sparkles count={40} scale={20} size={2} speed={0.4} opacity={isDark ? 0.1 : 0.05} color={isDark ? "#8F00FF" : "#AD49FF"} />
      {[...Array(25)].map((_, i) => (
        <Float key={i} speed={2} rotationIntensity={2} floatIntensity={1} position={[
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 40,
          (Math.random() - 0.5) * 20 - 20
        ]}>
          <mesh rotation={[Math.random() * Math.PI, 0, 0]}>
            <octahedronGeometry args={[Math.random() * 0.6 + 0.1, 0]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#8F00FF" : "#00F0FF"} 
              emissive={i % 2 === 0 ? "#8F00FF" : "#00F0FF"}
              emissiveIntensity={isDark ? 1 : 0.5}
              transparent
              opacity={isDark ? 0.3 : 0.1}
            />
          </mesh>
        </Float>
      ))}
      <Environment preset={isDark ? "night" : "forest"} />
    </group>
  );
}

const CountUp = ({ value }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, Math.round);
    useEffect(() => {
        const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [value]);
    return <motion.span>{rounded}</motion.span>;
};

function DashboardPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGauntletTransition, setShowGauntletTransition] = useState(false);
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const [theme, setTheme] = useState(localStorage.getItem("talentiq-theme") || "dark");
  const isDark = useMemo(() => theme !== "light" && theme !== "nord" && theme !== "corporate", [theme]);

  const createSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  const { data: stats, isLoading: isLoadingStats } = useUserStats();
  const { balance, isLoading: isLoadingCredits } = useCredits();


  const solved = stats?.problemsSolved || [];
  const submissions = stats?.submissions || [];
  const speedrun = stats?.speedrun || { elo: 1200, wins: 0, history: [] };
  const points = stats?.points || 0;
  const badge = stats?.badge || "Beginner";
  const streak = stats?.streak || 0;


  useEffect(() => {
    // Listen for theme changes from Navbar
    const checkTheme = () => {
      setTheme(localStorage.getItem("talentiq-theme") || "dark");
    };
    window.addEventListener("storage", checkTheme);
    // Intersection observer or just polling if local storage isn't enough, 
    // but usually a state in Navbar that we react to is better. 
    // Here we'll just poll every 1s for theme sync if user changed it.
    const interval = setInterval(checkTheme, 1000);
    return () => {
        window.removeEventListener("storage", checkTheme);
        clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    gsap.from(".dashboard-item", { opacity: 0, y: 40, stagger: 0.1, duration: 1, ease: "power4.out", clearProps: "all" });
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (stats?.pomodoroSessions) {
        setPomodoroSessions(stats.pomodoroSessions);
    }
  }, [stats]);


  const dailyChallenge = useMemo(() => {
    const allProblems = Object.values(PROBLEMS);
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const problem = allProblems[seed % allProblems.length];
    const isDone = solved.includes(problem.id);
    const now = new Date();
    const hoursLeft = 23 - now.getHours();
    return { problem, isDone, hoursLeft };
  }, [solved]);

  const badges = useMemo(() => {
    return getEarnedBadges({
      solvedCount: solved.length,
      submissions: submissions,
      speedrunWins: speedrun?.wins || 0,
      interviewCount: 0
    });
  }, [solved, speedrun, submissions]);

  const currentStreak = useMemo(() => {
    let streak = 0;
    const today = new Date();
    const map = {};
    submissions.forEach(s => map[new Date(s.timestamp).toDateString()] = true);
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (map[d.toDateString()]) streak++;
        else if (i > 0) break;
    }
    return streak;
  }, [stats]);


  const handleCreateRoom = () => {
    if (!roomConfig.problem || !roomConfig.difficulty) return;
    createSessionMutation.mutate(
      { problem: roomConfig.problem, difficulty: roomConfig.difficulty.toLowerCase() },
      { onSuccess: (data) => { setShowCreateModal(false); navigate(`/session/${data.session._id}`); } }
    );
  };

  const activeSessions = activeSessionsData?.sessions || [];
  const recentSessions = recentSessionsData?.sessions || [];
  const isUserInSession = (s) => user.id === s.host?.clerkId || user.id === s.participant?.clerkId;

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans pb-32 relative overflow-x-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300 text-base-content'}`}>
      <Navbar />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          <Suspense fallback={null}>
            <CommandCenterBackground isDark={isDark} />
          </Suspense>
        </Canvas>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 space-y-8">
        <header className="pt-4 pb-4 flex flex-col md:flex-row items-end justify-between gap-6 dashboard-item">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className={`size-8 rounded-lg flex items-center justify-center border ${isDark ? 'bg-primary/20 border-primary/40' : 'bg-primary/10 border-primary/20'}`}>
                 <LayoutDashboardIcon className="size-4 text-primary" />
               </div>
               <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-primary' : 'text-primary/70'}`}>Command Interface v3.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">DASHBOARD.</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-base-100 border-base-200'} backdrop-blur-2xl border p-5 rounded-2xl flex items-center gap-10 shadow-xl`}>
                <div className="text-center">
                   <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>STREAK</p>
                   <p className="text-3xl font-black text-primary"><CountUp value={streak} />D</p>
                </div>

                <div className={`w-px h-10 ${isDark ? 'bg-white/10' : 'bg-base-content/10'}`} />
                <div className="text-center group cursor-pointer" onClick={() => navigate("/pricing")}>
                   <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${isDark ? 'text-white/40' : 'text-base-content/40'} group-hover:text-primary transition-colors`}>SCARLET</p>
                   <p className="text-3xl font-black text-primary group-hover:scale-110 transition-transform">{isLoadingCredits ? "..." : balance?.toLocaleString()}</p>
                </div>
            </div>

            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary h-24 px-12 rounded-2xl text-xl font-black shadow-[0_0_50px_rgba(143,0,255,0.4)] transition-all hover:scale-105 active:scale-95">
               INITIALIZE SESSION
            </button>
          </div>
        </header>

        {/* DAILY CHALLENGE HUD */}
        <div className="dashboard-item">
           <div className={`p-8 rounded-[40px] border relative overflow-hidden group transition-all duration-500 shadow-xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100 border-base-200'}`}>
              <div className={`absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity ${isDark ? 'text-white' : 'text-primary'}`}>
                 <ZapIcon className="size-40 group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className={`size-16 rounded-2xl flex items-center justify-center shadow-lg ${dailyChallenge.isDone ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                       {dailyChallenge.isDone ? <CheckCircleIcon /> : <SparklesIcon className="animate-pulse" />}
                    </div>
                    <div>
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-primary/60' : 'text-primary/40'}`}>Sovereign Daily Challenge</span>
                       <h3 className="text-3xl font-black">{dailyChallenge.problem.title}</h3>
                       <p className={`text-sm font-bold uppercase tracking-widest ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>{dailyChallenge.problem.difficulty} • {dailyChallenge.hoursLeft}H REMAINING</p>
                    </div>
                 </div>
                 <Link to={`/problem/${dailyChallenge.problem.id}`} className="btn btn-primary btn-lg rounded-full px-12 font-black shadow-xl">
                    {dailyChallenge.isDone ? "REVIEW RESULTS" : "START CHALLENGE"}
                 </Link>
              </div>
           </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
           <div className="dashboard-item">
              <TiltCard onClick={() => navigate("/speedrun")} className={`p-12 border transition-all rounded-[50px] group cursor-pointer h-full relative overflow-hidden shadow-2xl ${isDark ? 'bg-gradient-to-br from-error/10 to-transparent border-error/20 hover:border-error/50' : 'bg-base-100 border-error/20 hover:border-error/50'}`}>
                 <div className="size-40 bg-error/5 absolute -top-10 -right-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                 <div className="flex items-center justify-between pointer-events-none relative z-10">
                    <div className="space-y-6">
                       <span className="text-[10px] font-black text-error uppercase tracking-[0.4em] px-4 py-1 rounded-full bg-error/10 border border-error/20">Elite Arena</span>
                       <h2 className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-base-content'}`}>SPEEDRUN ARENA</h2>
                       <p className={`text-lg font-medium max-w-sm ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>Match-ups live from the global consensus node.</p>
                    </div>
                    <div className="size-24 rounded-[32px] bg-error/20 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] group-hover:rotate-12 transition-transform">
                       <ZapIcon className="size-12 text-error" fill="currentColor" />
                    </div>
                 </div>
              </TiltCard>
           </div>
           
           <div className="dashboard-item">
              <TiltCard onClick={() => setShowGauntletTransition(true)} className={`p-12 border transition-all rounded-[50px] group cursor-pointer h-full relative overflow-hidden shadow-2xl ${isDark ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20 hover:border-primary/50' : 'bg-base-100 border-primary/20 hover:border-primary/50'}`}>
              <div className="size-40 bg-primary/5 absolute -top-10 -right-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                 <div className="flex items-center justify-between pointer-events-none relative z-10">
                    <div className="space-y-6">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] px-4 py-1 rounded-full bg-primary/10 border border-primary/20">Protocol Simulation</span>
                       <h2 className={`text-5xl font-black tracking-tighter ${isDark ? 'text-white' : 'text-base-content'}`}>THE GAUNTLET</h2>
                       <p className={`text-lg font-medium max-w-sm ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>Complete end-to-end interview Mastery Protocol.</p>
                    </div>
                    <div className="size-24 rounded-[32px] bg-primary/20 flex items-center justify-center shadow-[0_0_40px_rgba(143,0,255,0.4)] group-hover:-rotate-12 transition-transform">
                       <TrophyIcon className="size-12 text-primary" />
                    </div>
                 </div>
              </TiltCard>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           <div className="dashboard-item lg:col-span-2">
              <StatsCards activeSessionsCount={activeSessions.length} recentSessionsCount={recentSessions.length} />
           </div>
           <div className="dashboard-item">
              <ActiveSessions sessions={activeSessions} isLoading={loadingActiveSessions} isUserInSession={isUserInSession} />
           </div>
           
           <div className="dashboard-item lg:col-span-2">
              <ActivityPortfolio currentStreak={currentStreak} submissions={submissions} isDark={isDark} />
           </div>
           
           <div className="dashboard-item">
              <AchievementsWidget badges={badges} isDark={isDark} />
           </div>

           <div className="dashboard-item"><ErrorBoundary><ReadinessWidget solved={solved} speedrun={speedrun} submissions={submissions} currentStreak={currentStreak} /></ErrorBoundary></div>
           
           {/* ML STACK */}
           <div className="dashboard-item"><ErrorBoundary><AdaptiveDifficultyWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><WeaknessHeatmapWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><StudyTimeWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><BurnoutWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><PatternStatsWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><HireabilityWidget /></ErrorBoundary></div>
           <div className="dashboard-item lg:col-span-3">
              <ErrorBoundary><InterviewSessionsWidget isDark={isDark} /></ErrorBoundary>
           </div>

           {pomodoroSessions > 0 && <div className="dashboard-item"><ErrorBoundary><PomodoroWidget initialSessions={pomodoroSessions} /></ErrorBoundary></div>}

        </div>

        <div className="dashboard-item">
           <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </main>

      <CreateSessionModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} roomConfig={roomConfig} setRoomConfig={setRoomConfig} onCreateRoom={handleCreateRoom} isCreating={createSessionMutation.isPending} />

      <AnimatePresence>
        {showGauntletTransition && (
          <GauntletTransition onComplete={() => navigate("/full-gauntlet")} />
        )}
      </AnimatePresence>
    </div>
  );
}

function ActivityPortfolio({ currentStreak, submissions, isDark }) {
    return (
        <TiltCard className={`p-10 h-full border rounded-[50px] shadow-2xl relative overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100 border-base-200'}`}>
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black tracking-[0.3em] flex items-center gap-3">
                    <CalendarIcon className="size-5 text-primary" /> ACTIVITY_LOG
                </h3>
                <div className={`px-4 py-2 rounded-xl border text-[10px] font-black tracking-widest ${isDark ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-primary/5 border-primary/10 text-primary/70'}`}>STREAK: {currentStreak}D</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <p className={`text-7xl font-black ${isDark ? 'text-white' : 'text-base-content'}`}>{submissions.length}</p>
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>Process Synchronization</p>
                    <div className={`h-1 rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-base-200'}`}>
                        <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 2 }} className="h-full bg-primary" />
                    </div>
                </div>
                <div className={`flex flex-wrap gap-2 justify-end opacity-20 group-hover:opacity-40 transition-opacity`}>
                    {[...Array(60)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-[2px] ${i % 4 === 0 ? 'bg-primary' : isDark ? 'bg-white/10' : 'bg-base-300'}`} />
                    ))}
                </div>
            </div>
        </TiltCard>
    );
}

function AchievementsWidget({ badges, isDark }) {
    const earned = badges.filter(b => b.earned);
    return (
        <TiltCard className={`p-10 h-full border rounded-[50px] shadow-2xl relative overflow-hidden ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100 border-base-200'}`}>
            <h3 className="text-xl font-black tracking-[0.3em] mb-10 flex items-center gap-3">
                <TargetIcon className="size-5 text-secondary" /> PROTOCOL_NODES
            </h3>
            <div className="grid grid-cols-4 gap-4">
                {badges.slice(0, 8).map((badge, i) => (
                    <div key={i} className={`size-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${badge.earned ? 'bg-secondary/10 border-secondary/30 text-secondary' : isDark ? 'bg-white/5 border-white/5 text-white/10 grayscale' : 'bg-base-200 border-base-300 text-base-content/10 grayscale'}`}>
                        {badge.icon}
                    </div>
                ))}
            </div>
            <div className={`mt-12 pt-8 border-t flex justify-between items-center font-mono ${isDark ? 'border-white/5' : 'border-base-200'}`}>
                <span className={`text-[10px] font-black tracking-widest uppercase ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>SYNC_LEVEL</span>
                <span className="text-sm font-black text-secondary">{earned.length} / {badges.length} EARNED</span>
            </div>
        </TiltCard>
    );
}

export default DashboardPage;
