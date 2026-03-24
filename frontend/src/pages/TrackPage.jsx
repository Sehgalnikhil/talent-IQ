import { Link, useParams, Navigate, useNavigate } from "react-router";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { PROBLEMS } from "../data/problems";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRightIcon, Code2Icon, CheckCircle2Icon, SearchIcon, ArrowLeftIcon, StarIcon, BrainCircuitIcon, CheckCircleIcon, LayersIcon, DatabaseIcon, ZapIcon, SparklesIcon, LockIcon, ShieldAlertIcon, SwordsIcon, TrophyIcon, UsersIcon, RepeatIcon, ActivityIcon, GitCommitIcon, HistoryIcon, MicIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import toast from "react-hot-toast";

const trackDetails = {
    "blind-75": {
        title: "Blind 75",
        description: "The classic 75 questions to level up your data structures & algorithms foundation. Highly curated to avoid repetition.",
        icon: <StarIcon className="size-8 text-warning" />,
        color: "warning",
        gradient: "from-warning/20 to-warning/5",
        filterFunc: (p, i) => i < 75
    },
    "meta-prep": {
        title: "Meta Interview Prep",
        description: "Curated list of problems frequently asked by Meta in the last 6 months. High frequency focus.",
        icon: <BrainCircuitIcon className="size-8 text-info" />,
        color: "info",
        gradient: "from-info/20 to-info/5",
        filterFunc: (p, i) => i % 2 !== 0 && i < 100
    },
    "dp-mastery": {
        title: "Dynamic Programming Mastery",
        description: "Conquer your fear of DP. Master 1D, 2D memoization to advanced state machine patterns.",
        icon: <CheckCircleIcon className="size-8 text-success" />,
        color: "success",
        gradient: "from-success/20 to-success/5",
        filterFunc: (p) => p.category.includes("Dynamic Programming")
    },
    "system-design": {
        title: "System Design Essentials",
        description: "Learn how to build scalable and distributed systems through practical architecture problems.",
        icon: <LayersIcon className="size-8 text-primary" />,
        color: "primary",
        gradient: "from-primary/20 to-primary/5",
        filterFunc: (p, i) => i % 3 === 0 && i < 120
    },
    "sql-crunch": {
        title: "SQL Data Cruncher",
        description: "Get real hands-on experience by writing complex window functions and performance queries.",
        icon: <DatabaseIcon className="size-8 text-secondary" />,
        color: "secondary",
        gradient: "from-secondary/20 to-secondary/5",
        filterFunc: (p, i) => i >= 10 && i <= 45
    },
    "speedrun-basics": {
        title: "Algorithm Speedrun Basics",
        description: "A fast-paced track designed to warm you up with the core algorithms in under a week.",
        icon: <ZapIcon className="size-8 text-accent" />,
        color: "accent",
        gradient: "from-accent/20 to-accent/5",
        filterFunc: (p, i) => p.difficulty === "Easy" && i < 30
    }
};

// --- SVG RADAR CHART COMPONENT (KNOWLEDGE GAP HEATMAP) ---
const RadarChart = ({ data, color, size = 160 }) => {
    const minVal = 0, maxVal = 100;
    const center = size / 2;
    const radius = size * 0.4;
    const angleStep = (Math.PI * 2) / data.length;

    const getCoord = (val, idx) => {
        const r = (val / maxVal) * radius;
        const angle = idx * angleStep - Math.PI / 2;
        return [center + Math.cos(angle) * r, center + Math.sin(angle) * r];
    };

    const polyPoints = data.map((d, i) => getCoord(d.value, i).join(",")).join(" ");

    return (
        <svg width={size} height={size} className="overflow-visible drop-shadow-lg">
            {/* Background Webs */}
            {[0.3, 0.6, 1].map((scale, i) => (
                <polygon
                    key={i}
                    points={data.map((_, idx) => getCoord(maxVal * scale, idx).join(",")).join(" ")}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="opacity-10 text-base-content"
                />
            ))}
            {/* Spoke Lines */}
            {data.map((_, i) => {
                const [x, y] = getCoord(maxVal, i);
                return <line key={i} x1={center} y1={center} x2={x} y2={y} stroke="currentColor" strokeWidth="1" className="opacity-10 text-base-content" />
            })}

            {/* Filled Polygon */}
            <motion.polygon
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 0.6 }}
                transition={{ duration: 0.8, delay: 0.1, type: "spring" }}
                points={polyPoints}
                fill={`var(--color-${color})`}
                stroke={`var(--fallback-${color}, oklch(var(--${color})))`}
                strokeWidth="2"
                style={{ transformOrigin: "center" }}
            />

            {/* Labels */}
            {data.map((d, i) => {
                const [x, y] = getCoord(maxVal + 20, i);
                return (
                    <text key={i} x={x} y={y} fill="currentColor" fontSize="10" textAnchor="middle" dominantBaseline="middle" className="font-bold opacity-70">
                        {d.label}
                    </text>
                );
            })}
        </svg>
    );
};

// --- SVG GAUGE (OFFER PROBABILITY) ---
const GaugeChart = ({ percent, color }) => {
    const size = 120;
    const strokeWidth = 10;
    const radius = size / 2 - strokeWidth;
    const circumference = Math.PI * radius; // Semi-circle
    const dashoffset = circumference - (percent / 100) * circumference;

    return (
        <div className="relative flex flex-col items-center justify-center">
            <svg width={size} height={size / 2 + 10} className="overflow-visible">
                <path
                    d={`M ${strokeWidth},${size / 2} a ${radius},${radius} 0 0,1 ${radius * 2},0`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="opacity-10 text-base-content"
                    strokeLinecap="round"
                />
                <motion.path
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: dashoffset }}
                    transition={{ duration: 1.5, type: "spring", bounce: 0.2 }}
                    d={`M ${strokeWidth},${size / 2} a ${radius},${radius} 0 0,1 ${radius * 2},0`}
                    fill="none"
                    stroke={`var(--fallback-${color}, oklch(var(--${color})))`}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_8px_rgba(currentColor,0.5)]"
                />
            </svg>
            <div className="absolute bottom-2 flex flex-col items-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                    className={`text-2xl font-black text-${color}`}
                >
                    {Math.round(percent)}%
                </motion.span>
                <span className="text-[9px] uppercase tracking-widest font-bold opacity-50">Offer Prob</span>
            </div>
        </div>
    );
};

function TrackPage() {
    const { trackId } = useParams();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(true);
    const [solvedProblems, setSolvedProblems] = useState([]);
    const [aiCustomTracks, setAiCustomTracks] = useState([]);
    const [activeBossModal, setActiveBossModal] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axiosInstance.get("/users/stats");
                setSolvedProblems(res.data.problemsSolved || []);
                setAiCustomTracks(res.data.aiCustomTracks || []);
            } catch (err) {
                console.error("Failed to load user stats");
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Determine the track
    let track = trackDetails[trackId];
    let isCustom = false;

    if (!track && trackId?.startsWith("custom-ai")) {
        const customTrack = aiCustomTracks.find(t => t.id === trackId);
        if (customTrack) {
            track = {
                ...customTrack,
                icon: <SparklesIcon className="size-8 text-fuchsia-500" />,
                filterFunc: () => true
            };
            isCustom = true;
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-base-200 flex items-center justify-center">
                <div className="loading loading-spinner loading-lg text-primary"></div>
            </div>
        );
    }

    if (!track) {
        return <Navigate to="/curated" />;
    }

    const allProblems = Object.values(PROBLEMS);

    // Filter problems
    let trackProblems = [];
    if (isCustom) {
        const seed = track.id.length * track.title.length;
        trackProblems = allProblems.slice(0, track.total).map((p, i) => allProblems[(seed + i) % allProblems.length]);
    } else {
        trackProblems = allProblems.filter(track.filterFunc);
    }

    const solvedCount = trackProblems.filter((p) => solvedProblems.includes(p.id)).length;
    const offerProbability = Math.min(99, 15 + (solvedCount / trackProblems.length) * 82);

    // Add fake users to cohort leaderboard
    const cohortLeaderboard = [
        { name: "You", points: 840, solved: 14, rank: 1, isMe: true },
        { name: "DevMaster99", points: 720, solved: 12, rank: 2, isMe: false },
        { name: "O(1)_Wizard", points: 650, solved: 10, rank: 3, isMe: false },
        { name: "NullPointer", points: 410, solved: 6, rank: 4, isMe: false },
        { name: "BTree_Hugger", points: 200, solved: 3, rank: 5, isMe: false },
    ];

    // Group problems into "Nodes/Tiers" to simulate a Skill Tree DAG
    const tiers = [];
    for (let i = 0; i < trackProblems.length; i += 3) {
        tiers.push(trackProblems.slice(i, i + 3));
    }

    // Fake Radar Data
    const radarData = [
        { label: "Arrays", value: 40 + solvedCount * 2 },
        { label: "Trees", value: 20 + solvedCount * 1.5 },
        { label: "DP", value: 10 + solvedCount * 0.8 },
        { label: "Graphs", value: 30 + solvedCount },
        { label: "Math", value: 50 },
    ].map(d => ({ ...d, value: Math.min(100, d.value) }));

    return (
        <div className="min-h-screen bg-base-200 overflow-x-hidden">
            <Navbar />

            {/* Boss Fight Modal */}
            <AnimatePresence>
                {activeBossModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                        <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-base-100 rounded-3xl p-8 max-w-xl w-full shadow-[0_0_50px_rgba(239,68,68,0.4)] border border-error/50 relative overflow-hidden text-center">
                            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-error via-orange-500 to-warning"></div>

                            <ShieldAlertIcon className="size-24 text-error drop-shadow-[0_0_15px_rgba(239,68,68,0.8)] mx-auto mb-6 animate-pulse" />
                            <h2 className="text-4xl font-black uppercase text-error mb-2 tracking-tight">BOSS FIGHT: System Architecture</h2>
                            <p className="text-base-content/80 text-lg mb-8 font-medium">
                                To unlock Tier 4, you must vocally explain the time-complexity of Hash Map collision resolution under 15 minutes to our AI Voice Interviewer.
                            </p>

                            <div className="flex gap-4 w-full justify-center">
                                <button className="btn btn-ghost" onClick={() => setActiveBossModal(false)}>Retreat</button>
                                <button className="btn btn-error shadow-[0_0_20px_rgba(239,68,68,0.5)] gap-2 font-bold text-lg" onClick={() => { setActiveBossModal(false); navigate("/interview"); }}>
                                    <MicIcon className="size-5" /> Engage Boss
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className={`absolute top-0 right-0 w-96 h-96 bg-${track.color}/10 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none -z-10`} />

            <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 flex flex-col xl:flex-row gap-8">

                {/* LEFT SIDE: MAIN TRACK DAG */}
                <div className="flex-1">
                    <Link to="/curated" className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content mb-8 transition-colors font-semibold">
                        <ArrowLeftIcon className="size-4" /> Exit Campaign
                    </Link>

                    {/* TRACK HEADER CONFIG */}
                    <div className={`bg-base-100 rounded-3xl p-8 mb-10 shadow-lg border border-base-300 relative overflow-hidden group`}>
                        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl ${track.gradient} rounded-bl-full opacity-30`} />
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                            <div className="flex-1 flex gap-6 items-start">
                                <div className={`shrink-0 size-16 rounded-2xl bg-${track.color}/10 border border-${track.color}/20 flex items-center justify-center shadow-inner`}>
                                    {track.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <h1 className="text-4xl font-black tracking-tight">{track.title}</h1>
                                    </div>
                                    <p className="text-base-content/70 text-lg leading-relaxed max-w-xl">
                                        {track.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mt-4">
                                        <button className="btn btn-xs btn-outline rounded-full gap-1 border-base-content/20"><UsersIcon className="size-3" /> Link with Squad</button>
                                        <button className="btn btn-xs btn-outline rounded-full text-success border-success/30 bg-success/5 gap-1"><SparklesIcon className="size-3" /> Auto-Scaling Difficulty On</button>
                                    </div>
                                </div>
                            </div>

                            <div className="hidden md:block">
                                <GaugeChart percent={offerProbability} color={track.color} />
                            </div>
                        </div>
                    </div>

                    {/* INTERACTIVE SKILL TREE UI (Path of Exile style) */}
                    <div className="relative bg-base-100 border border-base-300 rounded-3xl p-8 lg:p-12 shadow-inner overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--fallback-b3,oklch(var(--b3)))_1px,transparent_1px)] bg-[size:24px_24px] opacity-30 pointer-events-none"></div>

                        <div className="text-center mb-10">
                            <h2 className="text-sm tracking-[0.3em] font-black uppercase text-base-content/40">Campaign skill tree</h2>
                        </div>

                        <div className="relative flex flex-col items-center gap-16">
                            {tiers.map((tierProblems, tierIdx) => {
                                const isBossTier = tierIdx > 0 && tierIdx % 3 === 0;
                                const tierLocked = tierIdx > 1; // Fake unlock logic: tier 0 and 1 are unlocked

                                return (
                                    <div key={tierIdx} className="relative w-full flex flex-col items-center">
                                        {/* Connector Line to previous tier */}
                                        {tierIdx !== 0 && (
                                            <div className={`absolute -top-16 w-1 h-16 ${tierLocked ? 'bg-base-300' : `bg-${track.color}`} shadow-[0_0_10px_currentColor] z-0`}></div>
                                        )}

                                        {/* BOSS GATE */}
                                        {isBossTier && (
                                            <div className="w-full flex justify-center z-10 -mt-8 mb-16">
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    onClick={() => setActiveBossModal(true)}
                                                    className={`card flex-row items-center gap-4 bg-error/10 border-2 ${tierLocked ? 'border-base-300 opacity-50 grayscale' : 'border-error shadow-[0_0_30px_rgba(239,68,68,0.3)]'} p-4 rounded-2xl cursor-pointer w-full max-w-sm justify-center`}
                                                >
                                                    <ShieldAlertIcon className="size-8 text-error" />
                                                    <div className="text-left">
                                                        <div className="text-[10px] font-black tracking-widest text-error uppercase">Boss Checkpoint</div>
                                                        <div className="font-bold">System AI Interview</div>
                                                    </div>
                                                </motion.button>
                                            </div>
                                        )}

                                        {/* TIER ROW */}
                                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 z-10 w-full relative">
                                            {tierProblems.map((problem, i) => {
                                                const isSolved = solvedProblems.includes(problem.id);
                                                const isSpacedRepetition = i === 1 && tierIdx === 0; // fake spaced repetition
                                                const isSubOptimal = i === 2 && tierIdx === 0; // fake suboptimal

                                                return (
                                                    <Link
                                                        to={tierLocked ? '#' : `/problem/${problem.id}`}
                                                        key={problem.id}
                                                        className={`relative flex flex-col items-center group ${tierLocked ? 'pointer-events-none cursor-not-allowed opacity-50 grayscale' : ''}`}
                                                    >
                                                        {/* Node Label Top */}
                                                        <div className="mb-3 whitespace-nowrap text-center">
                                                            <div className="text-xs font-bold bg-base-200 px-3 py-1 rounded-full border border-base-300 opacity-80 group-hover:opacity-100 group-hover:bg-base-300 transition-all max-w-[150px] truncate" title={problem.title}>
                                                                {problem.title}
                                                            </div>
                                                        </div>

                                                        {/* Node Circle */}
                                                        <motion.div
                                                            whileHover={{ scale: 1.15 }}
                                                            className={`size-20 md:size-24 rounded-full border-[3px] flex items-center justify-center relative bg-base-100 shadow-xl transition-colors
                                                                ${isSolved
                                                                    ? isSubOptimal ? "border-slate-400 bg-slate-900 shadow-[0_0_15px_rgba(148,163,184,0.3)]" : "border-amber-400 bg-amber-900 shadow-[0_0_20px_rgba(251,191,36,0.5)]"
                                                                    : tierLocked ? "border-base-300" : `border-${track.color} border-opacity-50`}
                                                            `}
                                                        >
                                                            {isSolved ? (
                                                                isSubOptimal ? <TrophyIcon className="size-8 text-slate-400" /> : <TrophyIcon className="size-8 text-amber-400 drop-shadow-[0_0_5px_currentColor]" />
                                                            ) : tierLocked ? (
                                                                <LockIcon className="size-8 text-base-content/20" />
                                                            ) : (
                                                                <Code2Icon className={`size-8 text-${track.color} opacity-80`} />
                                                            )}

                                                            {/* Spaced Repetition Indicator */}
                                                            {isSpacedRepetition && isSolved && (
                                                                <div className="absolute -top-2 -right-2 bg-error text-error-content size-6 rounded-full flex items-center justify-center shadow-lg animate-bounce" title="Spaced Repetition Review Due">
                                                                    <RepeatIcon className="size-3" />
                                                                </div>
                                                            )}
                                                        </motion.div>

                                                        {/* Feature Medals Bottom */}
                                                        <div className="mt-3 flex gap-1">
                                                            {isSubOptimal && <div className="badge badge-outline text-[9px] border-slate-500 text-slate-400">SILVER KPS</div>}
                                                            {!isSubOptimal && isSolved && <div className="badge badge-outline text-[9px] border-amber-500 text-amber-400">GOLD AST</div>}
                                                            {problem.difficulty === "Hard" && !isSolved && <div className="badge badge-error badge-outline text-[9px]">MUTATED</div>}
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE: ANALYTICS & SOCIAL (Cohorts) */}
                <div className="w-full xl:w-96 flex flex-col gap-6">

                    {/* RADAR HEATMAP WIDGET */}
                    <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden rounded-3xl">
                        <div className="card-body p-6">
                            <h3 className="font-black text-sm uppercase tracking-wider text-base-content/50 mb-4 flex items-center gap-2">
                                <ActivityIcon className="size-4 text-primary" /> Gap Visualizer
                            </h3>
                            <div className="flex justify-center my-4">
                                <RadarChart data={radarData} color={track.color} />
                            </div>
                            <p className="text-xs text-center text-base-content/60 font-medium leading-relaxed">
                                You have severe structural weaknesses in <strong className="text-base-content">Dynamic Programming</strong>. The elastic difficulty AI is mutating upcoming nodes to compensate.
                            </p>
                        </div>
                    </div>

                    {/* LIVE COHORT LEADERBOARD */}
                    <div className="card bg-base-100 border border-base-300 shadow-sm overflow-hidden rounded-3xl flex-1">
                        <div className="card-body p-0 border-b border-base-300">
                            <div className="p-5 pb-4">
                                <h3 className="font-black text-sm uppercase tracking-wider text-base-content/50 flex items-center gap-2">
                                    <SwordsIcon className="size-4 text-error" /> Live Sprint Cohort
                                </h3>
                                <p className="text-[11px] font-bold text-base-content/40 mt-1">49 developers started {track.title} this week.</p>
                            </div>
                        </div>
                        <ul className="p-0 m-0 list-none bg-base-200/30">
                            {cohortLeaderboard.map((user, idx) => (
                                <li key={idx} className={`p-4 border-b border-base-300 flex items-center gap-4 ${user.isMe ? `bg-${track.color}/10 relative overflow-hidden` : ''}`}>
                                    {user.isMe && <div className={`absolute left-0 top-0 bottom-0 w-1 bg-${track.color}`}></div>}
                                    <div className={`font-black w-4 text-center ${idx === 0 ? 'text-warning' : idx === 1 ? 'text-slate-400' : idx === 2 ? 'text-amber-700' : 'text-base-content/30'}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-sm truncate">{user.name}</div>
                                        <div className="text-[10px] uppercase font-bold text-base-content/50 flex items-center gap-1 mt-0.5"><GitCommitIcon className="size-3" /> {user.solved} solved</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`font-black text-lg ${user.isMe ? `text-${track.color}` : ''}`}>{user.points}</div>
                                        <div className="text-[10px] uppercase font-bold text-base-content/30">XP</div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                        <div className="p-4 bg-base-100 text-center">
                            <button className="btn btn-sm btn-ghost w-full text-xs font-bold text-base-content/50">View All 49 Peers</button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TrackPage;

