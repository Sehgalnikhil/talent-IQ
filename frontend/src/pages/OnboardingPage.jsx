import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuitIcon, ArrowRightIcon, CheckCircleIcon, SparklesIcon, ZapIcon, CodeIcon, LayersIcon, TrophyIcon } from "lucide-react";
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
function SkillRadar({ scores, size = 200 }) {
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
        <svg width={size} height={size} className="mx-auto">
            {/* Grid rings */}
            {Array.from({ length: levels }).map((_, l) => {
                const ringPoints = categories.map((_, i) => getCoord(((l + 1) / levels) * 100, i));
                return (
                    <polygon key={l} points={ringPoints.map(p => `${p.x},${p.y}`).join(" ")}
                        fill="none" stroke="oklch(var(--bc)/0.1)" strokeWidth="1" />
                );
            })}
            {/* Axes */}
            {categories.map((cat, i) => {
                const end = getCoord(100, i);
                const labelPos = getCoord(120, i);
                return (
                    <g key={cat}>
                        <line x1={center} y1={center} x2={end.x} y2={end.y} stroke="oklch(var(--bc)/0.1)" strokeWidth="1" />
                        <text x={labelPos.x} y={labelPos.y} textAnchor="middle" dominantBaseline="middle"
                            className="fill-base-content/50 text-[9px] font-bold">{cat}</text>
                    </g>
                );
            })}
            {/* Data polygon */}
            <motion.polygon
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                points={pointsStr}
                fill="oklch(var(--p)/0.2)"
                stroke="oklch(var(--p))"
                strokeWidth="2"
            />
            {points.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4" fill="oklch(var(--p))" />
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

    const currentQuestion = step >= 1 && step <= 5 ? SKILL_QUESTIONS[step - 1] : null;

    const handleAnswer = (optionIdx) => {
        setSelectedOption(optionIdx);
        const isCorrect = optionIdx === currentQuestion.correct;
        const newAnswers = { ...answers, [currentQuestion.category]: isCorrect ? 100 : 20 };
        setAnswers(newAnswers);

        setTimeout(() => {
            setSelectedOption(null);
            const nextStep = step + 1;
            setStep(nextStep);
            // Auto-start countdown when we reach results (step 6)
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
        // ✅ Notify App.jsx to update its React state BEFORE navigating
        window.dispatchEvent(new Event("onboarding-complete"));
        navigate("/dashboard", { replace: true });
    };

    // Auto-redirect countdown after results shown
    const startCountdown = () => {
        let count = 4;
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
        <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-200">
            <Navbar />
            <div className="max-w-2xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {/* STEP 0: Intro */}
                    {step === 0 && (
                        <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="text-center space-y-8"
                        >
                            <div className="mx-auto size-24 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent flex items-center justify-center shadow-2xl">
                                <BrainCircuitIcon className="size-12 text-white" />
                            </div>
                            <h1 className="text-4xl font-black">
                                Welcome{user?.firstName ? `, ${user.firstName}` : ""}! 🎉
                            </h1>
                            <p className="text-lg text-base-content/60 max-w-md mx-auto">
                                Let's discover your <strong className="text-primary">Coding DNA</strong> in 5 quick questions.
                                We'll personalize your dashboard and recommend the perfect difficulty level.
                            </p>
                            <div className="flex items-center justify-center gap-3 text-sm text-base-content/40">
                                <ZapIcon className="size-4" /> Takes less than 2 minutes
                            </div>
                            <button onClick={() => setStep(1)} className="btn btn-primary btn-lg gap-2 shadow-xl">
                                Start Assessment <ArrowRightIcon className="size-5" />
                            </button>
                            <button onClick={handleFinish} className="btn btn-ghost btn-sm text-base-content/40 hover:text-base-content transition-colors">
                                Skip for now → go to Dashboard
                            </button>
                        </motion.div>
                    )}

                    {/* STEPS 1-5: Questions */}
                    {currentQuestion && (
                        <motion.div key={`q-${step}`} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="space-y-8"
                        >
                            {/* Progress */}
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-bold text-base-content/50">Question {step}/5</span>
                                <progress className="progress progress-primary flex-1" value={step} max={5}></progress>
                            </div>

                            <div className="card bg-base-100 shadow-2xl border border-base-300 rounded-3xl p-8">
                                <div className="badge badge-outline badge-sm mb-4">{currentQuestion.category}</div>
                                <h2 className="text-2xl font-bold mb-8">{currentQuestion.question}</h2>

                                <div className="grid grid-cols-1 gap-3">
                                    {currentQuestion.options.map((option, idx) => {
                                        const isSelected = selectedOption === idx;
                                        const isCorrect = idx === currentQuestion.correct;
                                        const showResult = selectedOption !== null;

                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => selectedOption === null && handleAnswer(idx)}
                                                disabled={selectedOption !== null}
                                                className={`w-full text-left px-5 py-4 rounded-2xl border-2 font-medium transition-all duration-200 ${showResult && isSelected && isCorrect ? "border-success bg-success/10 text-success" :
                                                    showResult && isSelected && !isCorrect ? "border-error bg-error/10 text-error" :
                                                        showResult && isCorrect ? "border-success/30 bg-success/5" :
                                                            "border-base-300 hover:border-primary/30 hover:bg-primary/5"
                                                    }`}
                                            >
                                                <span className="font-bold text-base-content/40 mr-3">{String.fromCharCode(65 + idx)}.</span>
                                                {option}
                                                {showResult && isCorrect && <CheckCircleIcon className="inline size-5 ml-2 text-success" />}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 6: Results */}
                    {step === 6 && (
                        <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="text-center">
                                <h1 className="text-3xl font-black mb-2">Your Coding DNA 🧬</h1>
                                <p className="text-base-content/60">Here's your personalized skill profile</p>
                            </div>

                            <div className="card bg-base-100 shadow-2xl border border-base-300 rounded-3xl p-8">
                                {/* Radar Chart */}
                                <SkillRadar scores={answers} />

                                {/* Score Summary */}
                                <div className="text-center mt-6 space-y-3">
                                    <div className={`text-4xl font-black ${skillLevel.color}`}>
                                        {totalCorrect}/5 — {skillLevel.level}
                                    </div>
                                    <p className="text-base-content/60">{skillLevel.description}</p>
                                    <div className="badge badge-lg badge-primary gap-2">
                                        <SparklesIcon className="size-4" /> Recommended: {skillLevel.recommended} Difficulty
                                    </div>
                                </div>

                                {/* Category Breakdown */}
                                <div className="mt-8 space-y-3">
                                    {Object.entries(answers).map(([cat, score]) => (
                                        <div key={cat} className="flex items-center justify-between">
                                            <span className="text-sm font-bold">{cat}</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-32 h-2 bg-base-200 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${score}%` }}
                                                        transition={{ duration: 0.8, delay: 0.3 }}
                                                        className={`h-full rounded-full ${score === 100 ? "bg-success" : "bg-error"}`}
                                                    />
                                                </div>
                                                <span className={`text-xs font-bold ${score === 100 ? "text-success" : "text-error"}`}>
                                                    {score === 100 ? "✓" : "✗"}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleFinish} className="btn btn-primary btn-lg w-full gap-2 shadow-xl">
                                Go to Dashboard <ArrowRightIcon className="size-5" />
                            </button>
                            {redirectCountdown !== null && redirectCountdown > 0 && (
                                <p className="text-center text-sm text-base-content/40 font-medium">
                                    Auto-redirecting to Dashboard in <strong className="text-primary">{redirectCountdown}s</strong>…
                                </p>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default OnboardingPage;
