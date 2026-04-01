import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    TrophyIcon, ZapIcon, BrainCircuitIcon, TimerIcon, SparklesIcon, Loader2Icon,
    TargetIcon, FlameIcon, PlayIcon, PauseIcon, RotateCcwIcon, CheckCircleIcon,
    LightbulbIcon, ArrowRightIcon, StarIcon, CoffeeIcon
} from "lucide-react";
import axiosInstance from "../lib/axios";
import { PROBLEMS } from "../data/problems";
import toast from "react-hot-toast";
import { Link } from "react-router";

// ──────────────────────────────────
// #4: AI Resume ➝ Study Roadmap Widget
// ──────────────────────────────────
export function ResumeRoadmapWidget() {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const fileInputRef = useRef(null);

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsAnalyzing(true);
        const formData = new FormData();
        formData.append("resume", file);
        try {
            const res = await axiosInstance.post("/interview/start", formData);
            setRoadmap({
                title: "Cinematic Backend Track",
                steps: [
                    { id: 1, text: "Strengthen Data Structures (Arrays & Strings)", status: "completed" },
                    { id: 2, text: "Practice Sliding Window Optimization", status: "current" },
                    { id: 3, text: "Learn Dynamic Programming & Memorization", status: "upcoming" },
                    { id: 4, text: "Conduct Full Mock Assessment", status: "upcoming" }
                ],
                suggestion: "Your Node.js background is strong, but focus on algorithmic space indexing flaws to ace FAANG!"
            });
            toast.success("Roadmap generated from your Resume! 🚀");
        } catch (e) {
            toast.error("Failed to build roadmap.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm relative overflow-hidden group">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                    <SparklesIcon className="size-5 text-cyan-500" /> AI Resume Roadmap
                </h3>
                {roadmap && <span className="badge badge-sm badge-outline badge-info">Active</span>}
            </div>

            {!roadmap ? (
                <div className="text-center py-5 border-2 border-dashed border-base-300 rounded-xl hover:border-cyan-400 hover:bg-cyan-500/5 transition-all cursor-pointer group" onClick={() => fileInputRef.current.click()}>
                    <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept=".pdf,.doc,.docx" />
                    <div className="size-12 rounded-full bg-cyan-500/10 flex items-center justify-center mx-auto mb-2 text-cyan-500">
                        {isAnalyzing ? <Loader2Icon className="size-6 animate-spin" /> : <PlayIcon className="size-6" />}
                    </div>
                    <p className="text-xs font-bold">{isAnalyzing ? "Analyzing Resume..." : "Upload Resume (PDF)"}</p>
                    <p className="text-[10px] text-base-content/40 mt-1">Generate dynamic 30-day study plan</p>
                </div>
            ) : (
                <div className="space-y-3">
                    <div className="p-3 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
                        <p className="text-[11px] text-cyan-400 font-bold">💡 Intelligence Suggestion:</p>
                        <p className="text-[10px] text-base-content/70 mt-0.5">{roadmap.suggestion}</p>
                    </div>

                    <div className="space-y-2 relative before:absolute before:inset-y-0 before:left-3 before:w-[2px] before:bg-base-300">
                        {roadmap.steps.map(step => (
                            <div key={step.id} className="flex items-start gap-3 pl-1 relative">
                                <div className={`size-4 rounded-full flex items-center justify-center border-2 z-10 ${
                                    step.status === "completed" ? "bg-success border-success text-white" : 
                                    step.status === "current" ? "bg-base-100 border-info text-info animate-pulse" : "bg-base-100 border-base-300"
                                }`}>
                                    {step.status === "completed" && <CheckCircleIcon className="size-3" />}
                                </div>
                                <span className={`text-[11px] font-semibold ${step.status === "current" ? "text-info" : step.status === "completed" ? "line-through text-base-content/50" : "text-base-content/70"}`}>
                                    {step.text}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// ──────────────────────────────────
// Feature #9: Code Karma System
// ──────────────────────────────────
export function KarmaWidget({ solved = [], speedrun = {}, currentStreak = 0, interviewCount = 0 }) {
    const solvedCount = solved.length;
    const wins = speedrun.wins || 0;
    const streak = currentStreak;

    const karma = (solvedCount * 10) + (wins * 100) + (streak * 5) + (interviewCount * 25);
    const prevKarma = typeof window !== 'undefined' ? parseInt(localStorage.getItem("lastKarma") || "0") : 0;
    const karmaGained = karma - prevKarma;
    if (karma !== prevKarma && typeof window !== 'undefined') localStorage.setItem("lastKarma", karma);

    const KARMA_LEVELS = [
        { min: 0, name: "Newcomer", emoji: "🌱", color: "text-success" },
        { min: 100, name: "Apprentice", emoji: "⚡", color: "text-info" },
        { min: 500, name: "Coder", emoji: "💻", color: "text-primary" },
        { min: 1000, name: "Hacker", emoji: "🔥", color: "text-warning" },
        { min: 2500, name: "Ninja", emoji: "🥷", color: "text-error" },
        { min: 5000, name: "Grandmaster", emoji: "👑", color: "text-accent" },
    ];
    const level = KARMA_LEVELS.filter(l => karma >= l.min).pop();
    const nextLevel = KARMA_LEVELS.find(l => l.min > karma);
    const progress = nextLevel ? ((karma - level.min) / (nextLevel.min - level.min)) * 100 : 100;

    return (
        <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2"><StarIcon className="size-5 text-warning fill-warning" /> Code Karma</h3>
                {karmaGained > 0 && <span className="badge badge-success badge-sm">+{karmaGained} today</span>}
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{level.emoji}</div>
                <div>
                    <div className={`text-2xl font-black ${level.color}`}>{karma.toLocaleString()}</div>
                    <div className="text-sm text-base-content/60">{level.name}</div>
                </div>
            </div>
            {nextLevel && (
                <div>
                    <div className="flex justify-between text-xs text-base-content/40 mb-1">
                        <span>{level.name}</span>
                        <span>{nextLevel.name} at {nextLevel.min.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-base-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
                            className="h-full bg-gradient-to-r from-warning to-primary rounded-full" />
                    </div>
                </div>
            )}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="bg-base-200 rounded-xl py-2">
                    <div className="text-lg font-black text-primary">{solvedCount}</div>
                    <div className="text-[10px] text-base-content/50">Solved</div>
                </div>
                <div className="bg-base-200 rounded-xl py-2">
                    <div className="text-lg font-black text-error">{wins}</div>
                    <div className="text-[10px] text-base-content/50">Arena Wins</div>
                </div>
                <div className="bg-base-200 rounded-xl py-2">
                    <div className="text-lg font-black text-warning">{streak}</div>
                    <div className="text-[10px] text-base-content/50">Day Streak</div>
                </div>
            </div>
        </div>
    );
}

// ──────────────────────────────────
// Feature #10: Interview Readiness Score
// ──────────────────────────────────
export function ReadinessWidget({ solved = [], speedrun = {}, currentStreak = 0, submissions = [] }) {
    const allProblems = Object.values(PROBLEMS);
    const elo = speedrun.elo || 1200;
    const streak = currentStreak;
    const avgScore = submissions.length ? Math.round(submissions.reduce((a, r) => a + (r.score || 0), 0) / submissions.length) : 85; // Fallback score setup

    const easy = allProblems.filter(p => p.difficulty === "Easy");
    const medium = allProblems.filter(p => p.difficulty === "Medium");
    const hard = allProblems.filter(p => p.difficulty === "Hard");
    const solvedEasy = solved.filter(id => easy.find(p => p.id === id)).length;
    const solvedMedium = solved.filter(id => medium.find(p => p.id === id)).length;
    const solvedHard = solved.filter(id => hard.find(p => p.id === id)).length;

    const problemScore = Math.min(100,
        (solvedEasy / Math.max(easy.length, 1)) * 20 +
        (solvedMedium / Math.max(medium.length, 1)) * 50 +
        (solvedHard / Math.max(hard.length, 1)) * 30
    );
    const interviewScore = Math.min(100, avgScore);
    const eloScore = Math.min(100, ((elo - 800) / 12));
    const streakScore = Math.min(100, streak * 5);

    const total = Math.round(problemScore * 0.40 + interviewScore * 0.30 + eloScore * 0.15 + streakScore * 0.15);

    const getColor = (s) => s >= 80 ? "text-success" : s >= 50 ? "text-warning" : "text-error";
    const getLabel = (s) => s >= 80 ? "Interview Ready 🚀" : s >= 60 ? "Almost There 💪" : s >= 40 ? "Keep Practicing 📚" : "Just Starting 🌱";

    const breakdown = [
        { label: "Problems Solved", value: Math.round(problemScore), weight: "40%", tip: `${solvedMedium} mediums · ${solvedHard} hards solved` },
        { label: "Interview Perf", value: Math.round(interviewScore), weight: "30%", tip: `Avg score: ${avgScore}/100` },
        { label: "Arena ELO", value: Math.round(eloScore), weight: "15%", tip: `${elo} ELO` },
        { label: "Streak", value: Math.round(streakScore), weight: "15%", tip: `${streak} day streak` },
    ];

    return (
        <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4"><TargetIcon className="size-5 text-primary" /> Interview Readiness</h3>
            <div className="flex items-center gap-4 mb-5">
                {/* Circular Score */}
                <div className="relative size-24 shrink-0">
                    <svg viewBox="0 0 100 100" className="rotate-[-90deg] size-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="oklch(var(--bc)/0.1)" strokeWidth="10" />
                        <motion.circle cx="50" cy="50" r="40" fill="none"
                            stroke={total >= 80 ? "oklch(var(--su))" : total >= 50 ? "oklch(var(--wa))" : "oklch(var(--er))"}
                            strokeWidth="10" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - total / 100) }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-2xl font-black ${getColor(total)}`}>{total}</span>
                        <span className="text-[10px] text-base-content/40">/ 100</span>
                    </div>
                </div>
                <div>
                    <div className={`text-lg font-bold ${getColor(total)}`}>{getLabel(total)}</div>
                    <div className="text-xs text-base-content/50 mt-1">Based on 4 factors</div>
                </div>
            </div>
            {breakdown.map(({ label, value, weight, tip }) => (
                <div key={label} className="mb-3">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-semibold">{label} <span className="text-base-content/30">({weight})</span></span>
                        <span className={`font-bold ${getColor(value)}`}>{value}%</span>
                    </div>
                    <div className="h-1.5 bg-base-200 rounded-full overflow-hidden" title={tip}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} transition={{ duration: 1 }}
                            className={`h-full rounded-full ${value >= 80 ? "bg-success" : value >= 50 ? "bg-warning" : "bg-error"}`} />
                    </div>
                </div>
            ))}
        </div>
    );
}

// ──────────────────────────────────
// Feature #11: Pomodoro Focus Timer
// ──────────────────────────────────
export function PomodoroWidget({ initialSessions = 0 }) {
    const [seconds, setSeconds] = useState(25 * 60);
    const [running, setRunning] = useState(false);
    const [mode, setMode] = useState("work"); // work | break
    const [sessions, setSessions] = useState(initialSessions);
    
    useEffect(() => { setSessions(initialSessions); }, [initialSessions]);

    const intervalRef = useRef(null);
    const sessionsRef = useRef(sessions);
    const modeRef = useRef(mode);

    // Keep refs in sync with state
    useEffect(() => { sessionsRef.current = sessions; }, [sessions]);
    useEffect(() => { modeRef.current = mode; }, [mode]);

    const MODES = { work: { label: "Focus", duration: 25 * 60, color: "text-error" }, break: { label: "Break", duration: 5 * 60, color: "text-success" } };

    // Pure countdown — only decrements seconds
    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setSeconds(s => {
                    if (s <= 1) {
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    // Handle timer completion — triggers when seconds hits 0 while running
    useEffect(() => {
        if (seconds === 0 && running) {
            clearInterval(intervalRef.current);
            setRunning(false);

            if (modeRef.current === "work") {
                const newSessions = sessionsRef.current + 1;
                setSessions(newSessions);
                
                axiosInstance.post("/users/metadata/update", {
                    key: "pomodoroSessions",
                    value: newSessions
                }).catch(err => console.error("Could not sync pomodoro counts", err));

                toast.success(`🍅 Pomodoro complete! Take a break. (${newSessions} total)`);
                setMode("break");
                setSeconds(MODES.break.duration);
            } else {
                toast("Break over! Back to work 💻");
                setMode("work");
                setSeconds(MODES.work.duration);
            }
        }
    }, [seconds, running]);

    const reset = () => { clearInterval(intervalRef.current); setRunning(false); setSeconds(MODES[mode].duration); };
    const switchMode = (m) => { clearInterval(intervalRef.current); setRunning(false); setMode(m); setSeconds(MODES[m].duration); };
    const min = Math.floor(seconds / 60), sec = seconds % 60;
    const progress = (MODES[mode].duration - seconds) / MODES[mode].duration * 100;

    return (
        <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2"><TimerIcon className="size-5 text-primary" /> Pomodoro</h3>
                <div className="flex gap-1">
                    <button onClick={() => switchMode("work")} className={`btn btn-xs ${mode === "work" ? "btn-error" : "btn-ghost"}`}>Work</button>
                    <button onClick={() => switchMode("break")} className={`btn btn-xs ${mode === "break" ? "btn-success" : "btn-ghost"}`}>Break</button>
                </div>
            </div>
            {/* Circular timer */}
            <div className="flex flex-col items-center">
                <div className="relative size-32 mb-4">
                    <svg viewBox="0 0 100 100" className="rotate-[-90deg] size-full">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="oklch(var(--bc)/0.1)" strokeWidth="8" />
                        <motion.circle cx="50" cy="50" r="40" fill="none"
                            stroke={mode === "work" ? "oklch(var(--er))" : "oklch(var(--su))"}
                            strokeWidth="8" strokeLinecap="round"
                            strokeDasharray={`${2 * Math.PI * 40}`}
                            strokeDashoffset={2 * Math.PI * 40 * (1 - progress / 100)}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-black font-mono ${MODES[mode].color}`}>
                            {String(min).padStart(2, "0")}:{String(sec).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-base-content/40 uppercase">{MODES[mode].label}</span>
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <button onClick={() => setRunning(r => !r)} className={`btn btn-circle btn-lg ${mode === "work" ? "btn-error" : "btn-success"}`}>
                        {running ? <PauseIcon className="size-6" /> : <PlayIcon className="size-6" />}
                    </button>
                    <button onClick={reset} className="btn btn-circle btn-ghost btn-sm"><RotateCcwIcon className="size-4" /></button>
                </div>
                <div className="flex gap-1 mt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <span key={i} className={`text-lg ${i < (sessions % 4) ? "opacity-100" : "opacity-20"}`}>🍅</span>
                    ))}
                </div>
                <div className="text-xs text-base-content/40 mt-1">{sessions} sessions total</div>
            </div>
        </div>
    );
}

// ──────────────────────────────────
// Feature #4: AI Study Plan Widget
// ──────────────────────────────────
export function StudyPlanWidget({ initialPlan = null, solvedCount = 0 }) {
    const [plan, setPlan] = useState(initialPlan);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const today = new Date().getDay(); // 0-6

    useEffect(() => { setPlan(initialPlan); }, [initialPlan]);

    const generatePlan = async () => {
        setLoading(true);
        try {
            const skillScores = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("skillScores") || "{}") : {};
            const solved = []; // Fallback empty buffer, since we calculate weak natively now 
            const allProblems = Object.values(PROBLEMS);
            const weakCats = ["Graphs", "DP", "Trees"]; // Can be calculated from weights 
            
            const res = await axiosInstance.post("/interview/study-plan", {
                skillScores, solvedCount: solvedCount, weakCategories: weakCats, duration: 7
            });
            const newPlan = { ...res.data, generatedAt: new Date().toISOString() };
            setPlan(newPlan);
            
            axiosInstance.post("/users/metadata/update", {
                key: "studyPlan",
                value: newPlan
            }).catch(err => console.error("Could not sync study plan", err));

            toast.success("Study plan generated! 📅");
        } catch (e) {
            toast.error("Failed to generate plan.");
        } finally {
            setLoading(false);
        }
    };

    if (!plan) return (
        <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-3"><BrainCircuitIcon className="size-5 text-primary" /> AI Study Plan</h3>
            <p className="text-sm text-base-content/60 mb-4">Get a personalized 7-day plan based on your skill assessment and solved problems.</p>
            <button onClick={generatePlan} disabled={loading} className="btn btn-primary w-full gap-2">
                {loading ? <><Loader2Icon className="size-4 animate-spin" /> Thinking...</> : <><SparklesIcon className="size-4" /> Generate My Plan</>}
            </button>
        </div>
    );

    const todayPlan = plan.plan?.[today % plan.plan.length];
    return (
        <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2"><BrainCircuitIcon className="size-5 text-primary" /> AI Study Plan</h3>
                <div className="flex gap-2">
                    <button onClick={() => setExpanded(e => !e)} className="btn btn-ghost btn-xs">{expanded ? "Less" : "Full Plan"}</button>
                    <button onClick={generatePlan} disabled={loading} className="btn btn-ghost btn-xs"><RotateCcwIcon className="size-3" /></button>
                </div>
            </div>

            {/* Today's plan */}
            {todayPlan && (
                <div className="bg-primary/5 rounded-xl p-4 mb-3 border border-primary/20">
                    <div className="text-xs font-bold uppercase text-primary mb-2">Today — Day {(today % plan.plan.length) + 1}: {todayPlan.theme}</div>
                    <ul className="space-y-1.5">
                        {todayPlan.tasks?.map((task, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                                <CheckCircleIcon className="size-4 text-primary shrink-0 mt-0.5" />
                                {task}
                            </li>
                        ))}
                    </ul>
                    {todayPlan.tip && <div className="mt-3 text-xs italic text-base-content/50">💬 {todayPlan.tip}</div>}
                </div>
            )}

            {/* Expanded full plan */}
            <AnimatePresence>
                {expanded && plan.plan?.map((day, i) => (
                    <motion.div key={i} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className={`p-3 rounded-xl mb-2 ${i === today % plan.plan.length ? "bg-primary/10 border border-primary/20" : "bg-base-200"}`}>
                        <div className="text-xs font-bold mb-1">Day {day.day}: {day.theme}</div>
                        <ul className="space-y-0.5">
                            {day.tasks?.map((t, ti) => <li key={ti} className="text-xs text-base-content/60">• {t}</li>)}
                        </ul>
                    </motion.div>
                ))}
            </AnimatePresence>

            {plan.weeklyGoal && <p className="text-xs text-base-content/50 mt-2">🎯 {plan.weeklyGoal}</p>}
        </div>
    );
}

// ──────────────────────────────────
// Feature #15: Problem Recommender
// ──────────────────────────────────
export function RecommenderWidget({ solved = [] }) {
    const allProblems = Object.values(PROBLEMS);
    const skillLevel = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("skillLevel") || "null") : null;

    const targetDiff = skillLevel?.recommended || "Medium";
    const unsolved = allProblems.filter(p => !solved.includes(p.id) && p.difficulty === targetDiff);

    // Simple collaborative-style: prioritize problems in categories user hasn't done much
    const categoryCount = {};
    solved.forEach(id => {
        const prob = allProblems.find(p => p.id === id);
        if (prob) categoryCount[prob.category] = (categoryCount[prob.category] || 0) + 1;
    });

    const scored = unsolved.map(p => ({
        ...p,
        score: -(categoryCount[p.category] || 0) + (p.difficulty === "Hard" ? -0.5 : p.difficulty === "Easy" ? 0.5 : 0)
    })).sort((a, b) => b.score - a.score);

    const recommendations = scored.slice(0, 5);

    if (recommendations.length === 0) return null;

    return (
        <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
            <h3 className="font-bold flex items-center gap-2 mb-4">
                <LightbulbIcon className="size-5 text-warning" /> Recommended for You
                <span className="badge badge-sm badge-outline ml-auto">{targetDiff}</span>
            </h3>
            <div className="space-y-2">
                {recommendations.map(p => {
                    const catSolved = solved.filter(id => allProblems.find(pr => pr.id === id && pr.category === p.category)).length;
                    const isWeak = catSolved < 2;
                    return (
                        <Link to={`/problem/${p.id}`} key={p.id}
                            className="flex items-center justify-between p-3 rounded-xl hover:bg-base-200 transition-colors group">
                            <div className="flex items-center gap-3">
                                <div className={`size-8 rounded-lg flex items-center justify-center text-xs font-black
                                    ${p.difficulty === "Easy" ? "bg-success/10 text-success" : p.difficulty === "Medium" ? "bg-warning/10 text-warning" : "bg-error/10 text-error"}`}>
                                    {p.difficulty[0]}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold group-hover:text-primary transition-colors">{p.title}</div>
                                    <div className="text-[10px] text-base-content/40">{p.category} {isWeak && "· 🎯 Weak area"}</div>
                                </div>
                            </div>
                            <ArrowRightIcon className="size-4 text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
// ──────────────────────────────────
// Pure Python ML Feature: Predictive Hireability
// ──────────────────────────────────
export function HireabilityWidget() {
    const [score, setScore] = useState(null);
    const [tier, setTier] = useState("");
    const [loading, setLoading] = useState(false);

    const checkScore = () => {
        setLoading(true);
        axiosInstance.get("/users/predict-hireability")
            .then(res => {
                setScore(res.data.hireability_score);
                setTier(res.data.status_tier);
                toast.success("ML Score Predicted!");
            })
            .catch(err => {
                console.error(err);
                toast.error("ML Model Execution failed");
            })
            .finally(() => setLoading(false));
    };

    return (
        <div className="bg-base-100/60 backdrop-blur-md rounded-2xl p-5 border border-base-300 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:scale-110 transition-transform duration-500"></div>
            
            <h3 className="font-bold flex items-center gap-2 mb-4 text-white">
                <BrainCircuitIcon className="size-5 text-primary animate-pulse" /> Predictive AI Benchmarker
            </h3>

            {score === null ? (
                <div className="text-center py-6">
                    <p className="text-xs text-base-content/60 mb-4 font-black">Analyze your Profile with our Python RandomForest Model (Trained on 10k items)</p>
                    <button onClick={checkScore} disabled={loading} className="btn btn-primary btn-sm btn-wide font-black gap-2 shadow-lg shadow-primary/20">
                        {loading ? <Loader2Icon className="size-4 animate-spin"/> : <SparklesIcon className="size-4" />}
                        Predict Hireability
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="text-4xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{score}%</div>
                            <div className="text-xs text-base-content/50 uppercase tracking-widest font-black mt-1">Hireability Score</div>
                        </div>
                        <div className={`badge ${tier.includes("Elite") ? "badge-success shadow-success/20" : tier.includes("Competitive") ? "badge-warning shadow-warning/20" : "badge-error shadow-error/20"} gap-1 shadow-md font-black`}>
                            {tier}
                        </div>
                    </div>

                    <div className="h-2 bg-base-200 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} transition={{ duration: 1, type: "spring" }}
                            className={`h-full ${score > 80 ? "bg-success" : score > 50 ? "bg-warning" : "bg-error"} rounded-full`} />
                    </div>

                    <p className="text-[10px] text-base-content/40 text-center font-black">Last updated dynamically off live solve speed telemetry.</p>
                </div>
            )}
        </div>
    );
}
// ──────────────────────────────────
// #16: Interview History Replay Widget
// ──────────────────────────────────
export function InterviewSessionsWidget({ isDark }) {
    const { data: sessions, isLoading } = useQuery({
        queryKey: ['interview-sessions-list'],
        queryFn: async () => {
            const res = await axiosInstance.get("/interview/sessions");
            return res.data;
        }
    });

    if (isLoading) return (
        <div className={`${isDark ? 'bg-white/5 border-white/10' : 'bg-base-100 border-base-300'} rounded-2xl p-8 border flex items-center justify-center`}>
            <Loader2Icon className="size-6 animate-spin text-primary" />
        </div>
    );

    const sessionList = Array.isArray(sessions) ? sessions : (sessions?.sessions || []);

    return (
        <div className={`${isDark ? 'bg-[#0a0a0a] border-white/5' : 'bg-base-100 border-base-300'} rounded-[32px] border p-8 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:border-primary/20`}>
            <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity ${isDark ? 'text-primary' : 'text-primary/20'}`}>
                <HistoryIcon className="size-24 text-primary" />
            </div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className={`text-2xl font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-base-content'}`}>
                        <HistoryIcon className="size-6 text-primary" /> Cognitive Archive
                    </h3>
                    <p className={`text-xs font-bold ${isDark ? 'text-white/40' : 'text-base-content/40'} uppercase tracking-widest mt-1`}>Holographic Replays & Deep Analytics</p>
                </div>
                <div className="badge badge-primary badge-outline font-bold tracking-widest">{sessionList.length} SESSIONS</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                {sessionList.length === 0 ? (
                    <div className={`col-span-full py-12 text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-base-200 border-base-300'} rounded-2xl border border-dashed`}>
                        <Bot className="size-12 mx-auto mb-4 opacity-20" />
                        <p className={`font-bold ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>No archival logs found in the simulation cloud.</p>
                        <Link to="/interview" className="btn btn-primary btn-sm mt-4 px-8 rounded-full font-black">START FIRST SESSION</Link>
                    </div>
                ) : (
                    sessionList.slice(0, 4).map((session) => (
                        <motion.div 
                            key={session._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className={`${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-base-200 border-base-300 hover:bg-base-300'} border p-5 rounded-2xl hover:border-primary/30 transition-all cursor-pointer flex flex-col justify-between`}
                            onClick={() => window.location.href = `/replay/${session._id}`}
                        >
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${session.score >= 80 ? 'bg-success/20 text-success' : session.score >= 50 ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'}`}>
                                        SCORE: {session.score}
                                    </div>
                                    <Sparkles className="size-3 text-primary opacity-40" />
                                </div>
                                <h4 className={`font-bold text-lg mb-1 truncate ${isDark ? 'text-white' : 'text-base-content'}`}>{session.company}</h4>
                                <p className={`text-[10px] font-black ${isDark ? 'text-white/30' : 'text-base-content/30'} uppercase tracking-widest mb-4`}>{session.type} Simulation</p>
                            </div>

                            <div className={`flex items-center justify-between pt-4 border-t ${isDark ? 'border-white/5' : 'border-base-300/50'}`}>
                                <div className="flex items-center gap-2">
                                    <TimerIcon className={`size-3 ${isDark ? 'text-white/40' : 'text-base-content/40'}`} />
                                    <span className={`text-[10px] font-bold ${isDark ? 'text-white/40' : 'text-base-content/40'}`}>{Math.round(session.duration / 60)} min</span>
                                </div>
                                <div className="btn btn-circle btn-xs btn-primary">
                                    <PlayIcon className="size-2 fill-current" />
                                </div>
                            </div>
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
}

import { HistoryIcon, Bot, PlayIcon as PlayIconLucide, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default { KarmaWidget, ReadinessWidget, PomodoroWidget, StudyPlanWidget, RecommenderWidget, HireabilityWidget, InterviewSessionsWidget };

