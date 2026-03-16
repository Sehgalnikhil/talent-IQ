import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, ZapIcon, BrainCircuitIcon, TagIcon, Loader2Icon, RefreshCwIcon, CopyIcon, ChevronDownIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { Link } from "react-router";

// Feature #2: AI Problem Generator
const TOPICS = ["Arrays", "Linked Lists", "Trees", "Graphs", "Dynamic Programming", "Sliding Window", "Two Pointers", "Binary Search", "Sorting", "Stack & Queue", "Heap / Priority Queue", "String Manipulation", "Math", "Backtracking", "Design"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const CONTEXTS = ["", "E-commerce platform", "Social network", "Gaming system", "Financial trading", "Ride-sharing app", "Video streaming", "Healthcare system"];

function GeneratePage() {
    const [topic, setTopic] = useState("Arrays");
    const [difficulty, setDifficulty] = useState("Medium");
    const [context, setContext] = useState("");
    const [loading, setLoading] = useState(false);
    const [problem, setProblem] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [showApproach, setShowApproach] = useState(false);
    const [savedProblems, setSavedProblems] = useState(() =>
        JSON.parse(localStorage.getItem("generatedProblems") || "[]")
    );

    const generate = async () => {
        setLoading(true);
        setProblem(null);
        setShowHint(false);
        setShowApproach(false);
        try {
            const res = await axiosInstance.post("/interview/generate-problem", { topic, difficulty, context });
            setProblem(res.data);
        } catch (e) {
            toast.error("Generation failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const saveProblem = () => {
        if (!problem) return;
        const saved = [...savedProblems, { ...problem, id: Date.now(), topic, difficulty }];
        setSavedProblems(saved);
        localStorage.setItem("generatedProblems", JSON.stringify(saved));
        toast.success("Problem saved! 📌");
    };

    const copyProblem = () => {
        if (!problem) return;
        navigator.clipboard.writeText(`${problem.title}\n\n${problem.description}\n\nConstraints:\n${problem.constraints?.join("\n")}`);
        toast.success("Copied to clipboard!");
    };

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-xl">
                            <BrainCircuitIcon className="size-7 text-white" />
                        </div>
                        <h1 className="text-4xl font-black">AI Problem Generator</h1>
                    </div>
                    <p className="text-base-content/60">Describe what you want — Gemini creates a unique coding problem just for you.</p>
                </div>

                {/* Controls */}
                <div className="card bg-base-100 shadow-xl rounded-3xl p-8 mb-8">
                    <div className="grid md:grid-cols-3 gap-6 mb-6">
                        <div>
                            <label className="text-xs font-bold uppercase text-base-content/50 mb-2 block">Topic</label>
                            <select className="select select-bordered w-full" value={topic} onChange={e => setTopic(e.target.value)}>
                                {TOPICS.map(t => <option key={t}>{t}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-base-content/50 mb-2 block">Difficulty</label>
                            <div className="flex gap-2">
                                {DIFFICULTIES.map(d => (
                                    <button key={d} onClick={() => setDifficulty(d)}
                                        className={`btn flex-1 btn-sm ${difficulty === d ? (d === "Easy" ? "btn-success" : d === "Medium" ? "btn-warning" : "btn-error") : "btn-ghost"}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-base-content/50 mb-2 block">Real-World Context</label>
                            <select className="select select-bordered w-full" value={context} onChange={e => setContext(e.target.value)}>
                                {CONTEXTS.map(c => <option key={c} value={c}>{c || "No context"}</option>)}
                            </select>
                        </div>
                    </div>
                    <button onClick={generate} disabled={loading} className="btn btn-primary w-full btn-lg gap-2">
                        {loading
                            ? <><Loader2Icon className="size-5 animate-spin" /> Generating unique problem...</>
                            : <><SparklesIcon className="size-5" /> Generate Problem</>}
                    </button>
                </div>

                {/* Generated Problem */}
                <AnimatePresence>
                    {problem && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="card bg-base-100 shadow-2xl rounded-3xl overflow-hidden"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 border-b border-base-300">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h2 className="text-2xl font-black mb-2">{problem.title}</h2>
                                        <div className="flex flex-wrap gap-2">
                                            <span className={`badge badge-lg ${difficulty === "Easy" ? "badge-success" : difficulty === "Medium" ? "badge-warning" : "badge-error"}`}>{difficulty}</span>
                                            {problem.tags?.map(tag => <span key={tag} className="badge badge-outline">{tag}</span>)}
                                            {problem.timeComplexity && <span className="badge badge-ghost">{problem.timeComplexity}</span>}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={copyProblem} className="btn btn-ghost btn-sm gap-1"><CopyIcon className="size-4" /> Copy</button>
                                        <button onClick={saveProblem} className="btn btn-primary btn-sm">Save</button>
                                        <button onClick={generate} className="btn btn-ghost btn-sm gap-1"><RefreshCwIcon className="size-4" /> New</button>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Description */}
                                <div>
                                    <h3 className="font-bold text-lg mb-2">Problem</h3>
                                    <p className="text-base-content/80 leading-relaxed">{problem.description}</p>
                                </div>

                                {/* Examples */}
                                {problem.examples?.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-3">Examples</h3>
                                        <div className="space-y-3">
                                            {problem.examples.map((ex, i) => (
                                                <div key={i} className="bg-base-200 rounded-xl p-4 font-mono text-sm">
                                                    <div className="text-primary font-bold">Input: <span className="text-base-content font-normal">{ex.input}</span></div>
                                                    <div className="text-secondary font-bold">Output: <span className="text-base-content font-normal">{ex.output}</span></div>
                                                    {ex.explanation && <div className="text-base-content/60 mt-1 font-sans text-xs">{ex.explanation}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Constraints */}
                                {problem.constraints?.length > 0 && (
                                    <div>
                                        <h3 className="font-bold text-lg mb-2">Constraints</h3>
                                        <ul className="space-y-1">
                                            {problem.constraints.map((c, i) => <li key={i} className="text-sm font-mono text-base-content/70">• {c}</li>)}
                                        </ul>
                                    </div>
                                )}

                                {/* Hint & Approach toggles */}
                                <div className="flex gap-3">
                                    <button onClick={() => setShowHint(s => !s)} className="btn btn-warning btn-outline btn-sm gap-1">
                                        <ChevronDownIcon className={`size-4 transition-transform ${showHint ? "rotate-180" : ""}`} /> Hint
                                    </button>
                                    <button onClick={() => setShowApproach(s => !s)} className="btn btn-ghost btn-sm gap-1">
                                        <ChevronDownIcon className={`size-4 transition-transform ${showApproach ? "rotate-180" : ""}`} /> Approach
                                    </button>
                                </div>
                                {showHint && <div className="p-4 bg-warning/10 border border-warning/20 rounded-xl text-sm">{problem.hint}</div>}
                                {showApproach && <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl text-sm">{problem.approach}</div>}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Saved Problems */}
                {savedProblems.length > 0 && (
                    <div className="mt-10">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><TagIcon className="size-5" /> Saved Problems ({savedProblems.length})</h2>
                        <div className="space-y-3">
                            {savedProblems.slice().reverse().map((p, i) => (
                                <div key={p.id || i} className="flex items-center justify-between p-4 bg-base-100 rounded-2xl border border-base-300 hover:border-primary/30">
                                    <div>
                                        <div className="font-bold">{p.title}</div>
                                        <div className="text-xs text-base-content/40">{p.topic} • {p.difficulty}</div>
                                    </div>
                                    <button onClick={() => setProblem(p)} className="btn btn-ghost btn-sm">View</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default GeneratePage;
