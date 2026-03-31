import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuitIcon, ArrowRightIcon, CheckCircleIcon, SparklesIcon, ZapIcon, CodeIcon, LayersIcon, TrophyIcon, ShieldCheckIcon, CpuIcon, BinaryIcon, NetworkIcon, FingerprintIcon } from "lucide-react";
import Navbar from "../components/Navbar";

// Feature #2: AI Skill Assessment Onboarding
const SKILL_QUESTIONS = [
    {
        question: "What's the time complexity of binary search?",
        options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        correct: 1,
        category: "Algorithms"
    },
    {
        question: "Which data structure uses LIFO ordering?",
        options: ["Queue", "Stack", "Linked List", "Heap"],
        correct: 1,
        category: "Data Structures"
    },
    {
        question: "What's the best approach for the Two Sum problem?",
        options: ["Brute force O(n²)", "Sort + Two Pointers O(n log n)", "Hash Map O(n)", "Binary Search O(n log n)"],
        correct: 2,
        category: "Problem Solving"
    },
    {
        question: "In a graph, BFS uses which data structure?",
        options: ["Stack", "Queue", "Priority Queue", "Array"],
        correct: 1,
        category: "Graphs"
    },
    {
        question: "What's the space complexity of merge sort?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n²)"],
        correct: 2,
        category: "Sorting"
    }
];

const DIFFICULTY_MAP = {
    0: { level: "Beginner", description: "Start with Easy problems and build your foundation", color: "text-success", recommended: "Easy" },
    1: { level: "Beginner", description: "Start with Easy problems and build your foundation", color: "text-success", recommended: "Easy" },
    2: { level: "Intermediate", description: "You have solid basics! Focus on Medium problems", color: "text-warning", recommended: "Medium" },
    3: { level: "Intermediate", description: "You have solid basics! Focus on Medium problems", color: "text-warning", recommended: "Medium" },
    4: { level: "Advanced", description: "Strong fundamentals! Tackle Hard problems and system design", color: "text-primary", recommended: "Hard" },
    5: { level: "Expert", description: "You're interview-ready! Focus on speed and optimization", color: "text-error", recommended: "Hard" },
};

// SVG Radar Chart for skill visualization
function SkillRadar({ scores, size = 200, isDark = true }) {
    const categories = ["Algorithms", "Data Structures", "Problem Solving", "Graphs", "Sorting"];
    const center = size / 2;
    const radius = size * 0.38;
    const levels = 5;

    const getCoord = (value, index) => {
        const angle = (Math.PI * 2 * index) / categories.length - Math.PI / 2;
        const r = (value / 100) * radius;
        return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
    };

    const points = categories.map((cat, i) => {
        const score = scores[cat] || 0;
        return getCoord(score, i);
    });
    const pointsStr = points.map(p => `${p.x},${p.y}`).join(" ");

    return (
        <svg width={size} height={size} className="mx-auto drop-shadow-2xl">
            {/* Grid rings */}
            {Array.from({ length: levels }).map((_, l) => {
                const ringPoints = categories.map((_, i) => getCoord(((l + 1) / levels) * 100, i));
                return (
                    <polygon key={l} points={ringPoints.map(p => `${p.x},${p.y}`).join(" ")}
                        fill="none" stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
                );
            })}
            {/* Axes */}
            {categories.map((cat, i) => {
                const end = getCoord(100, i);
                const labelPos = getCoord(125, i);
                return (
                    <g key={cat}>
                        <line x1={center} y1={center} x2={end.x} y2={end.y} stroke={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"} strokeWidth="1" />
                        <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle"
                            className={`${isDark ? 'fill-white/30' : 'fill-black/30'} text-[7px] font-black uppercase tracking-tight`}>{cat}</text>
                    </g>
                );
            })}
            {/* Data polygon */}
            <motion.polygon
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, ease: "circOut" }}
                points={pointsStr}
                fill="rgba(var(--color-primary-rgb), 0.15)"
                stroke="oklch(var(--p))"
                strokeWidth="2"
                style={{ transformOrigin: `${center}px ${center}px` }}
            />
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="3" fill="oklch(var(--p))" className="shadow-lg shadow-primary/20" />
            ))}
        </svg>
    );
}

function OnboardingPage() {
    const navigate = useNavigate();
    const { user } = useUser();
    const [step, setStep] = useState(0); // 0 = intro, 1-5 = questions, 6 = results
    const [answers, setAnswers] = useState({});
    const [selectedOption, setSelectedOption] = useState(null);
    const [redirectCountdown, setRedirectCountdown] = useState(null);
    const [isDark, setIsDark] = useState(true);

    const currentQuestion = step >= 1 && step <= 5 ? SKILL_QUESTIONS[step - 1] : null;

    useEffect(() => {
        const checkTheme = () => {
           const theme = document.documentElement.getAttribute("data-theme");
           setIsDark(!["light", "cupcake", "bumblebee", "emerald", "corporate", "retro", "cyberpunk", "valentine", "garden", "lofi", "pastel", "fantasy", "wireframe", "cmyk", "autumn", "business", "acid", "lemonade", "winter", "nord"].includes(theme));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => observer.disconnect();
    }, []);

    const handleAnswer = (optionIdx) => {
        setSelectedOption(optionIdx);
        const isCorrect = optionIdx === currentQuestion.correct;
        const newAnswers = { ...answers, [currentQuestion.category]: isCorrect ? 100 : 20 };
        setAnswers(newAnswers);

        setTimeout(() => {
            setSelectedOption(null);
            const nextStep = step + 1;
            setStep(nextStep);
            if (nextStep === 6) {
                setTimeout(() => startCountdown(), 500);
            }
        }, 800);
    };

    const totalCorrect = useMemo(() => Object.values(answers).filter(v => v === 100).length, [answers]);
    const skillLevel = DIFFICULTY_MAP[totalCorrect] || DIFFICULTY_MAP[0];

    const handleFinish = () => {
        localStorage.setItem("onboardingComplete", "true");
        if (skillLevel) {
            localStorage.setItem("skillLevel", JSON.stringify(skillLevel));
        }
        localStorage.setItem("skillScores", JSON.stringify(answers));
        window.dispatchEvent(new Event("onboarding-complete"));
        navigate("/dashboard", { replace: true });
    };

    const startCountdown = () => {
        let count = 6;
        setRedirectCountdown(count);
        const timer = setInterval(() => {
            count -= 1;
            setRedirectCountdown(count);
            if (count <= 0) {
                clearInterval(timer);
                handleFinish();
            }
        }, 1000);
    };

    return (
        <div className={`min-h-screen transition-colors duration-700 font-sans relative overflow-x-hidden pt-24 pb-32 ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300 text-base-content'}`}>
            <Navbar />
            
            {/* AMBIENT ENGINE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] animate-pulse" />
            </div>

            <div className="max-w-3xl mx-auto px-6 relative z-10">
                <AnimatePresence mode="wait">
                    {/* STEP 0: Intro */}
                    {step === 0 && (
                        <motion.div key="intro" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                            className="text-center space-y-12 py-12"
                        >
                            <div className="relative inline-block">
                                <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20px] rounded-full border border-dashed border-primary/20" />
                                <div className="size-32 mx-auto rounded-[40px] bg-gradient-to-br from-primary via-secondary to-accent p-[2px] shadow-3xl">
                                    <div className={`w-full h-full rounded-[38px] flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
                                        <BrainCircuitIcon className="size-16 text-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">CODE GENESIS</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Identity_Synchronization_Phase</p>
                            </div>

                            <p className="text-lg font-medium opacity-60 max-w-lg mx-auto leading-relaxed italic">
                                "Synchronizing your algorithmic capabilities with the Sovereign consensus. Let's find your baseline potential."
                            </p>

                            <div className="flex flex-col items-center gap-6 pt-8">
                                <button onClick={() => setStep(1)} className="btn btn-primary h-20 px-12 rounded-[32px] font-black tracking-widest text-lg shadow-2xl shadow-primary/30 group">
                                    INITIALIZE GAUNTLET <ArrowRightIcon className="size-6 ml-2 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button onClick={handleFinish} className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100 transition-opacity flex items-center gap-2">
                                    <ShieldCheckIcon className="size-3" /> Skip_and_enter_node
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* STEPS 1-5: Questions */}
                    {currentQuestion && (
                        <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="space-y-10"
                        >
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Sector_Analysis</p>
                                    <h2 className="text-sm font-black italic text-primary">{currentQuestion.category}</h2>
                                </div>
                                <div className="text-right space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Step_0{step}/05</p>
                                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${(step / 5) * 100}%` }} className="h-full bg-primary" />
                                    </div>
                                </div>
                            </div>

                            <div className={`p-1 rounded-[48px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-3xl shadow-3xl`}>
                                <div className="p-12 space-y-10">
                                    <h2 className="text-3xl font-black italic tracking-tight leading-snug">{currentQuestion.question}</h2>

                                    <div className="grid grid-cols-1 gap-4">
                                        {currentQuestion.options.map((option, idx) => {
                                            const isSelected = selectedOption === idx;
                                            const isCorrect = idx === currentQuestion.correct;
                                            const showResult = selectedOption !== null;

                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => selectedOption === null && handleAnswer(idx)}
                                                    disabled={selectedOption !== null}
                                                    className={`w-full text-left px-8 py-6 rounded-[24px] border-2 font-black italic transition-all duration-300 flex items-center justify-between group ${showResult && isSelected && isCorrect ? "border-success bg-success/10 text-success" :
                                                        showResult && isSelected && !isCorrect ? "border-error bg-error/10 text-error" :
                                                            showResult && isCorrect ? "border-success/30 bg-success/5" :
                                                                "border-white/5 bg-white/5 hover:border-primary/40 hover:bg-primary/5 opacity-60 hover:opacity-100"
                                                        }`}
                                                >
                                                    <span className="flex items-center gap-4">
                                                        <span className="text-[10px] font-black opacity-30 group-hover:opacity-100 uppercase tracking-widest">0{idx + 1}</span>
                                                        <span className="text-base tracking-tight">{option}</span>
                                                    </span>
                                                    {showResult && isCorrect && <CheckCircleIcon className="size-5 text-success" />}
                                                    {showResult && isSelected && !isCorrect && <ZapIcon className="size-5 text-error" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: Results */}
                    {step === 6 && (
                        <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-4">
                                <h1 className="text-6xl font-black italic tracking-tighter bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent uppercase">IDENTITY MATRICES</h1>
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">System_Synchronization_Complete</p>
                            </div>

                            <div className={`p-1 rounded-[64px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-4xl shadow-3xl text-center`}>
                                <div className="p-16 space-y-12">
                                    <SkillRadar scores={answers} isDark={isDark} size={300} />

                                    <div className="space-y-4">
                                        <div className={`text-6xl font-black italic ${skillLevel.color} tracking-tighter`}>
                                            RANK_{skillLevel.level.toUpperCase()}
                                        </div>
                                        <div className="badge bg-primary/20 text-primary border-primary/20 rounded-full px-8 py-4 font-black italic tracking-widest uppercase">
                                            {totalCorrect}/5 SCORE_MATRIX
                                        </div>
                                        <p className="text-sm font-medium opacity-60 italic max-w-sm mx-auto">"{skillLevel.description}"</p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {Object.entries(answers).map(([cat, score]) => (
                                            <div key={cat} className="space-y-2 text-center">
                                                <div className={`h-1.5 rounded-full overflow-hidden bg-white/5`}>
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${score}%` }} className={`h-full ${score === 100 ? 'bg-success' : 'bg-error'}`} />
                                                </div>
                                                <p className="text-[8px] font-black uppercase tracking-tighter opacity-40">{cat}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                <button onClick={handleFinish} className="btn btn-primary h-24 w-full rounded-[32px] font-black tracking-widest text-xl shadow-2xl shadow-primary/40 group relative overflow-hidden">
                                     <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                     ENTER_COMMAND_CENTER <ArrowRightIcon className="size-6 ml-4" />
                                </button>
                                {redirectCountdown !== null && redirectCountdown > 0 && (
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 flex items-center gap-3">
                                        <CpuIcon className="size-3 animate-spin" /> Synchronizing_Neural_Links_in_{redirectCountdown}s
                                    </p>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default OnboardingPage;
