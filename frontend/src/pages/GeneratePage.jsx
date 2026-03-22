import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SparklesIcon, ZapIcon, BrainCircuitIcon, TagIcon, Loader2Icon, RefreshCwIcon, ArrowRightIcon, CopyIcon, ChevronDownIcon } from "lucide-react";
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
            // Cache for ProblemPage compiler Workspace Workspace!
            localStorage.setItem("ai_problem", JSON.stringify(res.data));
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
        <div className="min-h-screen bg-base-300 relative overflow-hidden flex flex-col text-base-content">
            <Navbar />
            
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 size-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-4xl mx-auto px-4 py-12 w-full z-10 flex-1 flex flex-col justify-center">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
                    <div className="inline-flex items-center gap-4 mb-4">
                        <div className="size-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 animate-spin-slow">
                            <BrainCircuitIcon className="size-8 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                            AI Problem Generator
                        </h1>
                    </div>
                    <p className="text-base-content/60 font-medium text-sm">Describe your criteria — let adaptive LLM nodes construct elite coding scenarios flawlessly.</p>
                </motion.div>

                {/* Controls - Futuristic Panel */}
                <div className="card bg-base-100/40 backdrop-blur-2xl shadow-2xl rounded-3xl p-8 mb-8 border border-white/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                    <div className="grid md:grid-cols-3 gap-6 mb-8 relative z-10">
                        <div className="form-control">
                            <label className="text-xs font-black uppercase text-primary mb-2 flex items-center gap-1"><TagIcon className="size-3" /> Core Topic</label>
                            <select className="select select-bordered w-full bg-base-200/50 border-white/5 focus:outline-none focus:border-primary/50 text-sm font-bold" value={topic} onChange={e => setTopic(e.target.value)}>
                                {TOPICS.map(t => <option key={t} className="bg-base-300 text-base-content font-bold">{t}</option>)}
                            </select>
                        </div>
                        <div className="form-control">
                            <label className="text-xs font-black uppercase text-primary mb-2 flex items-center gap-1">Difficulty Metric</label>
                            <div className="flex gap-1 bg-base-200/50 p-1 rounded-xl border border-white/5">
                                {DIFFICULTIES.map(d => (
                                    <button key={d} onClick={() => setDifficulty(d)}
                                        className={`btn flex-1 btn-sm border-none rounded-lg font-black tracking-wider transition-all ${difficulty === d ? (d === "Easy" ? "bg-success text-success-content" : d === "Medium" ? "bg-warning text-warning-content" : "bg-error text-error-content") : "btn-ghost opacity-40"}`}>
                                        {d}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="form-control">
                            <label className="text-xs font-black uppercase text-primary mb-2 flex items-center gap-1">Simulation Context</label>
                            <select className="select select-bordered w-full bg-base-200/50 border-white/5 focus:outline-none focus:border-primary/50 text-sm font-bold" value={context} onChange={e => setContext(e.target.value)}>
                                {CONTEXTS.map(c => <option key={c} value={c} className="bg-base-300 text-base-content font-bold">{c || "None / Standard"}</option>)}
                            </select>
                        </div>
                    </div>
                    
                    <button onClick={generate} disabled={loading} className="btn btn-primary w-full btn-lg gap-2 shadow-xl shadow-primary/30 rounded-2xl font-black border-none relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        {loading
                            ? <><Loader2Icon className="size-5 animate-spin" /> Consolidating Nodes...</>
                            : <><SparklesIcon className="size-5" /> Construct Adaptive Scenario</>}
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
                                <div className="flex gap-3 items-center w-full">
                                    <button onClick={() => setShowHint(s => !s)} className="btn btn-warning btn-outline btn-sm gap-1">
                                        <ChevronDownIcon className={`size-4 transition-transform ${showHint ? "rotate-180" : ""}`} /> Hint
                                    </button>
                                    <button onClick={() => setShowApproach(s => !s)} className="btn btn-ghost btn-sm gap-1">
                                        <ChevronDownIcon className={`size-4 transition-transform ${showApproach ? "rotate-180" : ""}`} /> Approach
                                    </button>

                                    {/* Feature solve CTA */}
                                    <Link to="/problem/ai-problem" className="btn btn-primary btn-sm gap-2 ml-auto shadow-lg shadow-primary/20">
                                        Solve in Compiler <ArrowRightIcon className="size-4" />
                                    </Link>
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
