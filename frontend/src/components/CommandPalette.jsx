import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { SearchIcon, ArrowRightIcon, BookOpenIcon, SwordsIcon, BrainCircuitIcon, LayoutDashboardIcon, TrophyIcon, PaletteIcon, SparklesIcon, CodeIcon, PenToolIcon, ZapIcon } from "lucide-react";
import { PROBLEMS } from "../data/problems";

const PAGES = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboardIcon className="size-4" />, category: "Navigate" },
    { name: "Problems", path: "/problems", icon: <BookOpenIcon className="size-4" />, category: "Navigate" },
    { name: "Curated Tracks", path: "/curated", icon: <SparklesIcon className="size-4" />, category: "Navigate" },
    { name: "AI Interview", path: "/interview", icon: <BrainCircuitIcon className="size-4" />, category: "Navigate" },
    { name: "Speedrun Arena", path: "/speedrun", icon: <SwordsIcon className="size-4" />, category: "Navigate" },
    { name: "Leaderboard", path: "/leaderboard", icon: <TrophyIcon className="size-4" />, category: "Navigate" },
    { name: "Whiteboard", path: "/whiteboard", icon: <PenToolIcon className="size-4" />, category: "Navigate" },
    { name: "Code Sandbox", path: "/playground", icon: <CodeIcon className="size-4" />, category: "Navigate" },
];

function CommandPalette() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIdx, setSelectedIdx] = useState(0);
    const inputRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handler = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
                setQuery("");
                setSelectedIdx(0);
            }
            if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    useEffect(() => {
        if (open && inputRef.current) inputRef.current.focus();
    }, [open]);

    const allProblems = useMemo(() => Object.values(PROBLEMS).map(p => ({
        name: p.title,
        path: `/problem/${p.id}`,
        icon: <CodeIcon className="size-4" />,
        category: "Problem",
        meta: `${p.difficulty} • ${p.category}`
    })), []);

    const allItems = useMemo(() => [...PAGES, ...allProblems], [allProblems]);

    const filtered = useMemo(() => {
        if (!query.trim()) return PAGES;
        const q = query.toLowerCase();
        return allItems.filter(item =>
            item.name.toLowerCase().includes(q) ||
            (item.meta && item.meta.toLowerCase().includes(q)) ||
            item.category.toLowerCase().includes(q)
        ).slice(0, 12);
    }, [query, allItems]);

    useEffect(() => { setSelectedIdx(0); }, [query]);

    const handleSelect = (item) => {
        navigate(item.path);
        setOpen(false);
        setQuery("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIdx(i => Math.min(i + 1, filtered.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIdx(i => Math.max(i - 1, 0));
        } else if (e.key === "Enter" && filtered[selectedIdx]) {
            handleSelect(filtered[selectedIdx]);
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]"
                    onClick={() => setOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-lg overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-base-300">
                            <SearchIcon className="size-5 text-base-content/40 shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                placeholder="Search problems, pages, actions..."
                                className="flex-1 bg-transparent outline-none text-lg font-medium placeholder:text-base-content/30"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <kbd className="kbd kbd-sm text-base-content/40">ESC</kbd>
                        </div>

                        {/* Results */}
                        <div className="max-h-[350px] overflow-y-auto p-2">
                            {filtered.length === 0 ? (
                                <div className="text-center py-8 text-base-content/40 text-sm">No results found</div>
                            ) : (
                                filtered.map((item, idx) => (
                                    <button
                                        key={item.path + idx}
                                        onClick={() => handleSelect(item)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${idx === selectedIdx ? "bg-primary/10 text-primary" : "hover:bg-base-200"
                                            }`}
                                    >
                                        <div className={`shrink-0 ${idx === selectedIdx ? "text-primary" : "text-base-content/50"}`}>
                                            {item.icon}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm truncate">{item.name}</div>
                                            {item.meta && <div className="text-xs text-base-content/50 truncate">{item.meta}</div>}
                                        </div>
                                        <div className="shrink-0 flex items-center gap-2">
                                            <span className="text-[10px] font-bold uppercase text-base-content/30 bg-base-200 px-2 py-0.5 rounded">{item.category}</span>
                                            {idx === selectedIdx && <ArrowRightIcon className="size-4 text-primary" />}
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="px-5 py-3 border-t border-base-300 flex items-center gap-4 text-xs text-base-content/40">
                            <span className="flex items-center gap-1"><kbd className="kbd kbd-xs">↑↓</kbd> Navigate</span>
                            <span className="flex items-center gap-1"><kbd className="kbd kbd-xs">↵</kbd> Open</span>
                            <span className="flex items-center gap-1"><kbd className="kbd kbd-xs">esc</kbd> Close</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default CommandPalette;
