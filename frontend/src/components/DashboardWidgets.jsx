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
// Feature #9: Code Karma System
// ──────────────────────────────────
export function KarmaWidget() {
    const solvedCount = JSON.parse(localStorage.getItem("solvedProblems") || "[]").length;
    const wins = parseInt(localStorage.getItem("speedrunWins") || "0");
    const streak = parseInt(localStorage.getItem("currentStreak") || "0");
    const interviewCount = parseInt(localStorage.getItem("interviewCount") || "0");

    const karma = (solvedCount * 10) + (wins * 100) + (streak * 5) + (interviewCount * 25);
    const prevKarma = parseInt(localStorage.getItem("lastKarma") || "0");
    const karmaGained = karma - prevKarma;
    if (karma !== prevKarma) localStorage.setItem("lastKarma", karma);

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
export function ReadinessWidget() {
    const allProblems = Object.values(PROBLEMS);
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    const elo = parseInt(localStorage.getItem("speedrunElo") || "1000");
    const streak = parseInt(localStorage.getItem("currentStreak") || "0");
    const interviews = parseInt(localStorage.getItem("interviewCount") || "0");
    const recordings = JSON.parse(localStorage.getItem("interviewRecordings") || "[]");
    const avgScore = recordings.length ? Math.round(recordings.reduce((a, r) => a + (r.score || 0), 0) / recordings.length) : 0;

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
export function PomodoroWidget() {
    const [seconds, setSeconds] = useState(25 * 60);
    const [running, setRunning] = useState(false);
    const [mode, setMode] = useState("work"); // work | break
    const [sessions, setSessions] = useState(() => parseInt(localStorage.getItem("pomodoroSessions") || "0"));
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
                localStorage.setItem("pomodoroSessions", String(newSessions));
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
export function StudyPlanWidget() {
    const [plan, setPlan] = useState(() => JSON.parse(localStorage.getItem("studyPlan") || "null"));
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const today = new Date().getDay(); // 0-6

    const generatePlan = async () => {
        setLoading(true);
        try {
            const skillScores = JSON.parse(localStorage.getItem("skillScores") || "{}");
            const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
            const allProblems = Object.values(PROBLEMS);
            const weakCats = ["Graphs", "DP", "Trees"].filter(cat =>
                allProblems.filter(p => p.category === cat && solved.includes(p.id)).length < 3
            );
            const res = await axiosInstance.post("/interview/study-plan", {
                skillScores, solvedCount: solved.length, weakCategories: weakCats, duration: 7
            });
            const newPlan = { ...res.data, generatedAt: new Date().toISOString() };
            setPlan(newPlan);
            localStorage.setItem("studyPlan", JSON.stringify(newPlan));
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
export function RecommenderWidget() {
    const allProblems = Object.values(PROBLEMS);
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    const skillLevel = JSON.parse(localStorage.getItem("skillLevel") || "null");

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

export default { KarmaWidget, ReadinessWidget, PomodoroWidget, StudyPlanWidget, RecommenderWidget };
