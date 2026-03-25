import { useNavigate, Link } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect, useMemo, useRef, Suspense } from "react";
import { useActiveSessions, useCreateSession, useMyRecentSessions } from "../hooks/useSessions";
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
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Stars, Environment, PerspectiveCamera, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import StatsCards from "../components/StatsCards";
import ActiveSessions from "../components/ActiveSessions";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import { PROBLEMS } from "../data/problems";
import { getEarnedBadges } from "../lib/badges.jsx";
import TiltCard from '../components/TiltCard';
import ErrorBoundary from '../components/ErrorBoundary';
import { KarmaWidget, ReadinessWidget, PomodoroWidget, StudyPlanWidget, HireabilityWidget } from "../components/DashboardWidgets";
import { 
  SpacedRepetitionWidget, 
  AdaptiveDifficultyWidget, 
  WeaknessHeatmapWidget, 
  StudyTimeWidget, 
  BurnoutWidget, 
  PatternStatsWidget 
} from "../components/MLWidgets";

// --- GSAP REGISTRATION ---
gsap.registerPlugin(ScrollTrigger);

// --- 3D BACKGROUND COMPONENT ---

function CommandCenterBackground() {
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
      <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />
      <Sparkles count={40} scale={20} size={2} speed={0.4} opacity={0.1} color="#8F00FF" />
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
              emissiveIntensity={1}
              transparent
              opacity={0.3}
            />
          </mesh>
        </Float>
      ))}
      <Environment preset="night" />
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
  const [roomConfig, setRoomConfig] = useState({ problem: "", difficulty: "" });
  const dashboardRef = useRef();

  const createSessionMutation = useCreateSession();
  const { data: activeSessionsData, isLoading: loadingActiveSessions } = useActiveSessions();
  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const [aiReport, setAiReport] = useState(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [solved, setSolved] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [speedrun, setSpeedrun] = useState({ elo: 1200, wins: 0, history: [] });
  const [pomodoroSessions, setPomodoroSessions] = useState(0);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    gsap.from(".dashboard-item", {
      opacity: 0,
      y: 40,
      stagger: 0.1,
      duration: 1,
      ease: "power4.out",
      clearProps: "all"
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  useEffect(() => {
    if (user) {
      axiosInstance.get("/users/stats")
        .then(res => {
          setSolved(res.data.problemsSolved || []);
          setSubmissions(res.data.submissions || []);
          setSpeedrun(res.data.speedrun || { elo: 1200, wins: 0, history: [] });
          setPomodoroSessions(res.data.pomodoroSessions || 0);
        })
        .catch(err => console.warn("Sync error", err));
    }
  }, [user]);

  // Daily Challenge Logic
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
  }, [submissions]);

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
    <div ref={dashboardRef} className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 font-sans pb-32 relative overflow-x-hidden">
      <Navbar />
      
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={45} />
          <Suspense fallback={null}>
            <CommandCenterBackground />
          </Suspense>
        </Canvas>
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-6 space-y-12">
        <header className="pt-32 pb-6 flex flex-col md:flex-row items-end justify-between gap-8 dashboard-item">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
               <div className="size-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/40">
                 <LayoutDashboardIcon className="size-4 text-primary" />
               </div>
               <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Command Interface v3.0</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-none">DASHBOARD.</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl flex items-center gap-10">
               <div className="text-center">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">STREAK</p>
                  <p className="text-3xl font-black text-primary"><CountUp value={currentStreak} />D</p>
               </div>
               <div className="w-px h-10 bg-white/10" />
               <div className="text-center">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mb-1">ELO</p>
                  <p className="text-3xl font-black text-secondary">{speedrun.elo}</p>
               </div>
            </div>
            <button onClick={() => setShowCreateModal(true)} className="btn btn-primary h-24 px-12 rounded-2xl text-xl font-black shadow-[0_0_50px_rgba(143,0,255,0.4)] transition-all hover:scale-105 active:scale-95">
               INITIALIZE SESSION
            </button>
          </div>
        </header>

        {/* DAILY CHALLENGE OVERLAY HUD */}
        <div className="dashboard-item">
           <div className={`p-8 rounded-[40px] border relative overflow-hidden group transition-all duration-500 ${dailyChallenge.isDone ? 'bg-success/5 border-success/20' : 'bg-primary/5 border-primary/20'}`}>
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-20 transition-opacity">
                 <ZapIcon className="size-40 group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
                 <div className="flex items-center gap-6">
                    <div className={`size-16 rounded-2xl flex items-center justify-center shadow-lg ${dailyChallenge.isDone ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                       {dailyChallenge.isDone ? <CheckCircleIcon /> : <SparklesIcon className="animate-pulse" />}
                    </div>
                    <div>
                       <span className="text-[10px] font-black uppercase tracking-widest text-primary/60">Sovereign Daily Challenge</span>
                       <h3 className="text-3xl font-black">{dailyChallenge.problem.title}</h3>
                       <p className="text-sm text-white/40 font-bold uppercase tracking-widest">{dailyChallenge.problem.difficulty} • {dailyChallenge.hoursLeft}H REMAINING</p>
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
              <TiltCard onClick={() => navigate("/speedrun")} className="p-12 bg-gradient-to-br from-error/10 to-transparent border border-error/20 hover:border-error/50 transition-all rounded-[50px] group cursor-pointer h-full relative overflow-hidden">
                 <div className="size-40 bg-error/5 absolute -top-10 -right-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                 <div className="flex items-center justify-between pointer-events-none relative z-10">
                    <div className="space-y-6">
                       <span className="text-[10px] font-black text-error uppercase tracking-[0.4em] px-4 py-1 rounded-full bg-error/10 border border-error/20">Elite Node Arena</span>
                       <h2 className="text-5xl font-black tracking-tighter">SPEEDRUN ARENA</h2>
                       <p className="text-white/40 text-lg font-medium max-w-sm">Connect to the global consensus. High-stakes match-ups live.</p>
                    </div>
                    <div className="size-24 rounded-[32px] bg-error/20 flex items-center justify-center shadow-[0_0_40px_rgba(239,68,68,0.4)] group-hover:rotate-12 transition-transform">
                       <ZapIcon className="size-12 text-error" fill="currentColor" />
                    </div>
                 </div>
              </TiltCard>
           </div>
           
           <div className="dashboard-item">
              <TiltCard onClick={() => navigate("/full-gauntlet")} className="p-12 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 hover:border-primary/50 transition-all rounded-[50px] group cursor-pointer h-full relative overflow-hidden">
              <div className="size-40 bg-primary/5 absolute -top-10 -right-10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                 <div className="flex items-center justify-between pointer-events-none relative z-10">
                    <div className="space-y-6">
                       <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] px-4 py-1 rounded-full bg-primary/10 border border-primary/20">Protocol Simulation</span>
                       <h2 className="text-5xl font-black tracking-tighter">THE GAUNTLET</h2>
                       <p className="text-white/40 text-lg font-medium max-w-sm">Master end-to-end sovereignty. Predictive reporting active.</p>
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
              <ActivityPortfolio currentStreak={currentStreak} submissions={submissions} />
           </div>
           
           <div className="dashboard-item">
              <AchievementsWidget badges={badges} />
           </div>

           <div className="dashboard-item"><ErrorBoundary><ReadinessWidget solved={solved} speedrun={speedrun} submissions={submissions} currentStreak={currentStreak} /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><SpacedRepetitionWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><KarmaWidget solved={solved} speedrun={speedrun} currentStreak={currentStreak} /></ErrorBoundary></div>
           
           {/* ML STACK */}
           <div className="dashboard-item"><ErrorBoundary><AdaptiveDifficultyWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><WeaknessHeatmapWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><StudyTimeWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><BurnoutWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><PatternStatsWidget /></ErrorBoundary></div>
           <div className="dashboard-item"><ErrorBoundary><HireabilityWidget /></ErrorBoundary></div>
           {pomodoroSessions > 0 && <div className="dashboard-item"><ErrorBoundary><PomodoroWidget initialSessions={pomodoroSessions} /></ErrorBoundary></div>}
        </div>

        <div className="dashboard-item">
           <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </main>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        roomConfig={roomConfig}
        setRoomConfig={setRoomConfig}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </div>
  );
}

function ActivityPortfolio({ currentStreak, submissions }) {
    return (
        <TiltCard className="p-10 h-full bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[50px] shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black tracking-[0.3em] flex items-center gap-3">
                    <CalendarIcon className="size-5 text-primary" /> ACTIVITY_LOG
                </h3>
                <div className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-[10px] font-black tracking-widest text-primary">STREAK: {currentStreak}D</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                    <p className="text-7xl font-black text-white">{submissions.length}</p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">Submissions Decrypted</p>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: "85%" }} transition={{ duration: 2 }} className="h-full bg-primary shadow-[0_0_15px_rgba(143,0,255,0.8)]" />
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end opacity-20 group-hover:opacity-40 transition-opacity">
                    {[...Array(60)].map((_, i) => (
                        <div key={i} className={`w-3 h-3 rounded-[2px] ${i % 4 === 0 ? 'bg-primary' : 'bg-white/10'}`} />
                    ))}
                </div>
            </div>
        </TiltCard>
    );
}

function AchievementsWidget({ badges }) {
    const earned = badges.filter(b => b.earned);
    return (
        <TiltCard className="p-10 h-full bg-white/5 backdrop-blur-3xl border border-white/5 rounded-[50px] shadow-2xl relative overflow-hidden">
            <h3 className="text-xl font-black tracking-[0.3em] mb-10 flex items-center gap-3">
                <TargetIcon className="size-5 text-secondary" /> PROTOCOL_NODES
            </h3>
            <div className="grid grid-cols-4 gap-4">
                {badges.slice(0, 8).map((badge, i) => (
                    <div key={i} className={`size-16 rounded-2xl flex items-center justify-center border transition-all duration-500 ${badge.earned ? 'bg-secondary/10 border-secondary/30 text-secondary shadow-[0_0_20px_rgba(0,240,255,0.3)] scale-110' : 'bg-white/5 border-white/5 text-white/10 grayscale'}`}>
                        {badge.icon}
                    </div>
                ))}
            </div>
            <div className="mt-12 pt-8 border-t border-white/5 flex justify-between items-center font-mono">
                <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">SYNC_LEVEL</span>
                <span className="text-sm font-black text-secondary">{earned.length} / {badges.length} EARNED</span>
            </div>
        </TiltCard>
    );
}

export default DashboardPage;
