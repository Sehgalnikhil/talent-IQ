import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpenIcon, CheckCircleIcon, XCircleIcon, PlusIcon, SparklesIcon, Loader2Icon, RotateCcwIcon, TrashIcon, TagIcon } from "lucide-react";
import Navbar from "../components/Navbar";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

// Feature #12 + #13: Smart Flashcards with Spaced Repetition
const CATEGORY_COLORS = {
    Algorithm: "badge-primary",
    Complexity: "badge-warning",
    Pattern: "badge-success",
    Gotcha: "badge-error",
};

function FlashcardPage() {
    const [cards, setCards] = useState(() => JSON.parse(localStorage.getItem("flashcards") || "[]"));
    const [mode, setMode] = useState("browse"); // browse | study | add | generate
    const [currentIdx, setCurrentIdx] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const [newQ, setNewQ] = useState("");
    const [newA, setNewA] = useState("");
    const [filterCategory, setFilterCategory] = useState("All");

    // AI generate state
    const [genTopic, setGenTopic] = useState("");
    const [genCode, setGenCode] = useState("");
    const [generating, setGenerating] = useState(false);

    const saveCards = (updated) => {
        setCards(updated);
        localStorage.setItem("flashcards", JSON.stringify(updated));
    };

    const dueCards = cards.filter(c => {
        if (filterCategory !== "All" && c.category !== filterCategory) return false;
        const nextReview = c.nextReview ? new Date(c.nextReview) : new Date(0);
        return nextReview <= new Date();
    });

    const studyCard = dueCards[currentIdx % Math.max(dueCards.length, 1)];

    const markCard = (known) => {
        if (!studyCard) return;
        const updated = cards.map(c => {
            if (c.id !== studyCard.id) return c;
            const interval = known ? (c.interval || 1) * 2.5 : 1; // SRS: double on success
            const next = new Date();
            next.setDate(next.getDate() + interval);
            return { ...c, reviewed: (c.reviewed || 0) + 1, interval, nextReview: next.toISOString(), lastResult: known };
        });
        saveCards(updated);
        setFlipped(false);
        if (currentIdx >= dueCards.length - 1) {
            toast.success("🎉 All cards reviewed!");
            setMode("browse");
        } else {
            setCurrentIdx(i => i + 1);
        }
    };

    const addCard = () => {
        if (!newQ.trim() || !newA.trim()) return toast.error("Fill in both sides!");
        saveCards([...cards, { id: Date.now(), question: newQ, answer: newA, category: "Pattern", date: new Date().toISOString(), reviewed: 0 }]);
        setNewQ(""); setNewA("");
        toast.success("Card added! ✅");
    };

    const generateFromAI = async () => {
        if (!genTopic) return toast.error("Enter a topic first");
        setGenerating(true);
        try {
            const res = await axiosInstance.post("/interview/flashcards", {
                problemTitle: genTopic, code: genCode, concept: genTopic
            });
            const newCards = res.data.cards?.map(c => ({
                ...c, id: Date.now() + Math.random(), date: new Date().toISOString(), reviewed: 0
            })) || [];
            saveCards([...cards, ...newCards]);
            setMode("browse");
            toast.success(`${newCards.length} flashcards generated! 🧠`);
        } catch (e) {
            toast.error("Generation failed.");
        } finally {
            setGenerating(false);
        }
    };

    const deleteCard = (id) => saveCards(cards.filter(c => c.id !== id));

    const categories = ["All", ...new Set(cards.map(c => c.category).filter(Boolean))];

    return (
        <div className="min-h-screen bg-base-300 relative overflow-hidden flex flex-col text-base-content">
            <Navbar />
            
            {/* Ambient background glows */}
            <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 size-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

            <div className="max-w-3xl mx-auto px-4 py-12 w-full z-10 flex-1 flex flex-col justify-center">
                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-black flex items-center gap-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            <BookOpenIcon className="size-9 text-primary animate-bounce" /> Smart Flashcards
                        </h1>
                        <p className="text-base-content/50 mt-1 font-bold">{cards.length} cards in deck · {dueCards.length} due for review</p>
                    </div>
                    <div className="flex gap-2 bg-base-100/40 backdrop-blur-xl p-1 rounded-2xl border border-white/5 shadow-inner">
                        <button onClick={() => setMode("generate")} className={`btn btn-sm gap-1 rounded-xl font-black border-none ${mode === "generate" ? "bg-primary text-primary-content" : "btn-ghost"}`}><SparklesIcon className="size-4" /> Generate</button>
                        <button onClick={() => setMode("add")} className={`btn btn-sm gap-1 rounded-xl font-black border-none ${mode === "add" ? "bg-primary text-primary-content" : "btn-ghost"}`}><PlusIcon className="size-4" /> Add</button>
                        <button onClick={() => setMode("browse")} className={`btn btn-sm gap-1 rounded-xl font-black border-none ${mode === "browse" ? "bg-primary text-primary-content" : "btn-ghost"}`}><RotateCcwIcon className="size-4" /> Browse</button>
                    </div>
                </motion.div>

                {/* Mode: Study */}
                {mode === "study" && dueCards.length > 0 && (
                    <div className="text-center flex-1 flex flex-col items-center justify-center">
                        <div className="text-xs text-base-content/40 mb-4 font-black tracking-widest uppercase">
                            Card {(currentIdx % dueCards.length) + 1} / {dueCards.length}
                        </div>
                        {/* 3D Flip Card */}
                        <div className="relative h-72 w-full max-w-md cursor-pointer mb-8" onClick={() => setFlipped(f => !f)}
                            style={{ perspective: "1500px" }}>
                            <motion.div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}
                                animate={{ rotateY: flipped ? 180 : 0 }} transition={{ type: "spring", stiffness: 120, damping: 15 }}>
                                {/* Front */}
                                <div className="absolute inset-0 bg-base-100/60 backdrop-blur-xl rounded-3xl shadow-xl flex flex-col items-center justify-center p-8 border border-white/5 select-none"
                                    style={{ backfaceVisibility: "hidden" }}>
                                    <div className={`badge badge-md font-black shadow-inner border-none mb-4 ${CATEGORY_COLORS[studyCard?.category] || "badge-ghost"}`}>{studyCard?.category || "General"}</div>
                                    <p className="text-xl font-black text-center text-base-content/90 leading-relaxed">{studyCard?.question}</p>
                                    <span className="text-xs uppercase font-black text-base-content/30 mt-8 flex items-center gap-1 animate-pulse"><RotateCcwIcon className="size-3" /> Click to flip</span>
                                </div>
                                {/* Back */}
                                <div className="absolute inset-0 bg-primary/10 backdrop-blur-3xl rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border border-primary/20 select-none"
                                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
                                    <span className="text-xs font-black uppercase text-primary mb-4">Answer</span>
                                    <p className="text-lg font-bold text-center leading-relaxed text-base-content">{studyCard?.answer}</p>
                                    {studyCard?.problem && <p className="text-xs font-black text-base-content/30 mt-4 bg-base-300 px-3 py-1 rounded-full">Source: {studyCard.problem}</p>}
                                </div>
                            </motion.div>
                        </div>
                        {flipped && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-center gap-4 w-full max-w-md">
                                <button onClick={() => markCard(false)} className="btn btn-error flex-1 font-black shadow-lg shadow-error/20 rounded-2xl"><XCircleIcon className="size-5" /> Hard</button>
                                <button onClick={() => markCard(true)} className="btn btn-success flex-1 font-black shadow-lg shadow-success/20 rounded-2xl"><CheckCircleIcon className="size-5" /> Got it!</button>
                            </motion.div>
                        )}
                        {!flipped && <button onClick={() => { setMode("browse"); setCurrentIdx(0); }} className="btn btn-ghost btn-sm mt-4 font-black text-base-content/40">Exit Study Mode</button>}
                    </div>
                )}

                {/* Mode: Add Card */}
                {mode === "add" && (
                    <div className="card bg-base-100 shadow-xl rounded-3xl p-6 mb-6">
                        <h2 className="font-bold text-lg mb-4">Add New Card</h2>
                        <div className="space-y-3">
                            <textarea className="textarea textarea-bordered w-full font-mono" rows={3} placeholder="Question / Front side..." value={newQ} onChange={e => setNewQ(e.target.value)} />
                            <textarea className="textarea textarea-bordered w-full font-mono" rows={3} placeholder="Answer / Back side..." value={newA} onChange={e => setNewA(e.target.value)} />
                            <div className="flex gap-2">
                                <button onClick={addCard} className="btn btn-primary flex-1">Save Card</button>
                                <button onClick={() => setMode("browse")} className="btn btn-ghost">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mode: AI Generate */}
                {mode === "generate" && (
                    <div className="card bg-base-100 shadow-xl rounded-3xl p-6 mb-6">
                        <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><SparklesIcon className="size-5 text-primary" /> AI Flashcard Generator</h2>
                        <div className="space-y-3">
                            <input className="input input-bordered w-full" placeholder="Topic / Problem name (e.g. 'Two Pointer Pattern')" value={genTopic} onChange={e => setGenTopic(e.target.value)} />
                            <textarea className="textarea textarea-bordered w-full font-mono text-xs" rows={4} placeholder="Paste your code (optional) — AI will create cards based on your approach" value={genCode} onChange={e => setGenCode(e.target.value)} />
                            <div className="flex gap-2">
                                <button onClick={generateFromAI} disabled={generating} className="btn btn-primary flex-1 gap-2">
                                    {generating ? <><Loader2Icon className="size-4 animate-spin" /> Generating...</> : <><SparklesIcon className="size-4" /> Generate 3 Cards</>}
                                </button>
                                <button onClick={() => setMode("browse")} className="btn btn-ghost">Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Mode: Browse */}
                {mode === "browse" && (
                    <>
                        {dueCards.length > 0 && (
                            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 mb-6 flex items-center justify-between">
                                <div>
                                    <div className="font-bold">{dueCards.length} cards due for review</div>
                                    <div className="text-sm text-base-content/60">Based on spaced repetition schedule</div>
                                </div>
                                <button onClick={() => { setMode("study"); setCurrentIdx(0); setFlipped(false); }} className="btn btn-primary gap-2">
                                    <BookOpenIcon className="size-4" /> Study Now
                                </button>
                            </div>
                        )}

                        {/* Category Filter */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {categories.map(cat => (
                                <button key={cat} onClick={() => setFilterCategory(cat)}
                                    className={`btn btn-xs ${filterCategory === cat ? "btn-primary" : "btn-ghost"}`}>{cat}</button>
                            ))}
                        </div>

                        <div className="space-y-3">
                            {cards.filter(c => filterCategory === "All" || c.category === filterCategory).map(card => (
                                <div key={card.id} className="flex items-start gap-4 p-4 bg-base-100 rounded-2xl border border-base-300 hover:border-primary/30 transition-colors">
                                    <div className="flex-1">
                                        <div className="font-semibold text-sm mb-1">{card.question}</div>
                                        <div className="text-xs text-base-content/50">{card.answer.substring(0, 80)}…</div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className={`badge badge-xs ${CATEGORY_COLORS[card.category] || "badge-ghost"}`}>{card.category}</span>
                                            <span className="text-xs text-base-content/30">Reviewed {card.reviewed || 0}×</span>
                                            {card.lastResult !== undefined && (
                                                card.lastResult ? <CheckCircleIcon className="size-3 text-success" /> : <XCircleIcon className="size-3 text-error" />
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={() => deleteCard(card.id)} className="btn btn-ghost btn-xs text-error"><TrashIcon className="size-3" /></button>
                                </div>
                            ))}
                            {cards.length === 0 && (
                                <div className="text-center py-16 text-base-content/40">
                                    <BookOpenIcon className="size-12 mx-auto mb-4 opacity-30" />
                                    <p>No flashcards yet. Add cards manually or generate them with AI!</p>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default FlashcardPage;
