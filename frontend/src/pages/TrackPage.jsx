import { Link, useParams, Navigate } from "react-router";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, CheckCircle2Icon, SearchIcon, ArrowLeftIcon, StarIcon, BrainCircuitIcon, CheckCircleIcon, LayersIcon, DatabaseIcon, ZapIcon, SparklesIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

const trackDetails = {
    "blind-75": {
        title: "Blind 75",
        description: "The classic 75 questions to level up your data structures & algorithms foundation quickly.",
        icon: <StarIcon className="size-8 text-warning" />,
        color: "warning",
        gradient: "from-warning/20 to-warning/5",
        filterFunc: (p, i) => i < 75 // Mocking by taking first 75 problems
    },
    "meta-prep": {
        title: "Meta Interview Prep",
        description: "Curated list of problems frequently asked by Meta in the last 6 months. High frequency focus.",
        icon: <BrainCircuitIcon className="size-8 text-info" />,
        color: "info",
        gradient: "from-info/20 to-info/5",
        filterFunc: (p, i) => i % 2 !== 0 && i < 100 // Mocking some subset
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
        filterFunc: (p, i) => i % 3 === 0 && i < 120 // Mocking
    },
    "sql-crunch": {
        title: "SQL Data Cruncher",
        description: "Get real hands-on experience by writing complex window functions and performance queries.",
        icon: <DatabaseIcon className="size-8 text-secondary" />,
        color: "secondary",
        gradient: "from-secondary/20 to-secondary/5",
        filterFunc: (p, i) => i >= 10 && i <= 45 // Mocking
    },
    "speedrun-basics": {
        title: "Algorithm Speedrun Basics",
        description: "A fast-paced track designed to warm you up with the core algorithms in under a week.",
        icon: <ZapIcon className="size-8 text-accent" />,
        color: "accent",
        gradient: "from-accent/20 to-accent/5",
        filterFunc: (p, i) => p.difficulty === "Easy" && i < 30 // Mocking specific difficulties
    }
};

function TrackPage() {
    const { trackId } = useParams();

    // Determine the track
    let track = trackDetails[trackId];
    let isCustom = false;

    if (!track && trackId.startsWith("custom-ai")) {
        // Synchronously load from local storage to prevent redirect flash
        const savedCustomTracks = JSON.parse(localStorage.getItem("aiCustomTracks") || "[]");
        const customTrack = savedCustomTracks.find(t => t.id === trackId);

        if (customTrack) {
            track = {
                ...customTrack,
                icon: <SparklesIcon className="size-8 text-fuchsia-500" />,
                filterFunc: () => true // we will do manual problem assignment below
            };
            isCustom = true;
        }
    }

    const [searchQuery, setSearchQuery] = useState("");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [solvedProblems, setSolvedProblems] = useState([]);

    useEffect(() => {
        const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        setSolvedProblems(solved);
    }, []);

    // If track STILL doesn't exist after checking local storage, redirect to curated tracks page
    if (!track) {
        return <Navigate to="/curated" />;
    }

    const allProblems = Object.values(PROBLEMS);

    // For Custom Tracks, we randomly match their total length from ALL problems
    let trackProblems = [];
    if (isCustom) {
        // very simple pseudo-random selection based on the trackId length to keep it deterministic per track
        const seed = track.id.length * track.title.length;
        trackProblems = allProblems.slice(0, track.total).map((p, i) => allProblems[(seed + i) % allProblems.length]);
    } else {
        trackProblems = allProblems.filter(track.filterFunc);
    }

    const filteredProblems = trackProblems.filter((p) => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
        return matchesSearch && matchesDifficulty;
    });

    const easyProblemsCount = trackProblems.filter((p) => p.difficulty === "Easy").length;
    const mediumProblemsCount = trackProblems.filter((p) => p.difficulty === "Medium").length;
    const hardProblemsCount = trackProblems.filter((p) => p.difficulty === "Hard").length;

    // Count specifically for this track
    const solvedCount = trackProblems.filter((p) => solvedProblems.includes(p.id)).length;

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            {/* Background Effect */}
            <div className={`absolute top-0 right-0 w-96 h-96 bg-${track.color}/10 rounded-full blur-[100px] mix-blend-screen animate-pulse pointer-events-none -z-10`} />

            <div className="max-w-6xl mx-auto px-4 py-8 relative z-10">
                <Link to="/curated" className="inline-flex items-center gap-2 text-base-content/60 hover:text-base-content mb-8 transition-colors">
                    <ArrowLeftIcon className="size-4" /> Back to Tracks
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
                                <h1 className="text-3xl font-bold mb-2 tracking-tight">{track.title}</h1>
                                <p className="text-base-content/70 text-lg leading-relaxed max-w-xl">
                                    {track.description}
                                </p>
                            </div>
                        </div>

                        <div className="bg-base-200/50 backdrop-blur-sm p-4 rounded-2xl border border-base-300 min-w-[200px]">
                            <div className="flex justify-between items-baseline mb-2 text-sm font-semibold">
                                <span>Track Progress</span>
                                <span className={`text-${track.color}`}>{Math.round((solvedCount / trackProblems.length) * 100) || 0}%</span>
                            </div>
                            <progress className={`progress progress-${track.color} w-full h-2.5`} value={solvedCount} max={trackProblems.length}></progress>
                            <div className="text-right text-xs text-base-content/60 mt-1.5 font-medium">
                                {solvedCount} / {trackProblems.length} Solved
                            </div>
                        </div>
                    </div>
                </div>

                {/* FILTERS SETTINGS */}
                <div className="bg-base-100 rounded-xl shadow-sm p-4 border border-base-300 mb-6 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 size-5" />
                        <input
                            type="text"
                            placeholder="Search in this track..."
                            className="input input-bordered w-full pl-10 bg-base-200/50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-4">
                        <select
                            className="select select-bordered w-full md:w-auto bg-base-200/50"
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>
                </div>

                {/* PROBLEMS LIST */}
                <div className="space-y-4">
                    {filteredProblems.length === 0 ? (
                        <div className="text-center py-16 bg-base-100 rounded-xl border border-base-300 shadow-sm text-base-content/50">
                            <div className={`mx-auto size-16 rounded-full bg-${track.color}/10 flex items-center justify-center mb-4`}>
                                <Code2Icon className="size-8 opacity-50" />
                            </div>
                            <h3 className="text-lg font-medium mb-1">No problems found</h3>
                            <p>Try adjusting your search or filters.</p>
                        </div>
                    ) : (
                        filteredProblems.map((problem, idx) => {
                            const isSolved = solvedProblems.includes(problem.id);
                            return (
                                <Link
                                    key={problem.id}
                                    to={`/problem/${problem.id}`}
                                    className="card bg-base-100 hover:shadow-md hover:-translate-y-[2px] border border-base-300 transition-all duration-300 group"
                                >
                                    <div className="card-body p-5">
                                        <div className="flex items-center justify-between gap-4">
                                            {/* LEFT SIDE */}
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 text-center font-bold text-base-content/30 group-hover:text-base-content/50 transition-colors">
                                                    {(idx + 1).toString().padStart(2, '0')}
                                                </div>
                                                <div className={`size-12 rounded-xl border ${isSolved ? "bg-success/10 border-success/20" : `bg-${track.color}/5 border-${track.color}/10 group-hover:bg-${track.color}/10`} flex items-center justify-center transition-colors`}>
                                                    {isSolved ? (
                                                        <CheckCircle2Icon className="size-6 text-success" />
                                                    ) : (
                                                        <Code2Icon className={`size-6 text-${track.color} opacity-80 group-hover:opacity-100`} />
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h2 className={`text-lg font-bold ${isSolved ? "text-success" : "group-hover:text-primary transition-colors"}`}>
                                                            {problem.title}
                                                        </h2>
                                                        <span className={`badge badge-sm uppercase ${getDifficultyBadgeClass(problem.difficulty)}`}>
                                                            {problem.difficulty}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-base-content/60 font-medium">
                                                        {problem.category}
                                                    </p>
                                                </div>
                                            </div>
                                            {/* RIGHT SIDE */}
                                            <div className={`flex items-center gap-2 text-${track.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
                                                <span className="font-semibold text-sm">
                                                    {isSolved ? "Review" : "Solve"}
                                                </span>
                                                <ChevronRightIcon className="size-5 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>

                {/* STATS FOOTER */}
                <div className="mt-12 card bg-base-100 shadow-sm border border-base-300">
                    <div className="card-body p-6">
                        <div className="stats stats-vertical lg:stats-horizontal bg-transparent p-0 m-0 w-full">
                            <div className="stat px-4 py-2 border-none">
                                <div className="stat-title text-base-content/60 font-semibold mb-1">Track Total</div>
                                <div className={`stat-value text-3xl text-${track.color}`}>{trackProblems.length}</div>
                            </div>
                            <div className="stat px-4 py-2 border-l border-base-300/50">
                                <div className="stat-title text-base-content/60 font-semibold mb-1">Easy</div>
                                <div className="stat-value text-3xl text-success">{easyProblemsCount}</div>
                            </div>
                            <div className="stat px-4 py-2 border-l border-base-300/50">
                                <div className="stat-title text-base-content/60 font-semibold mb-1">Medium</div>
                                <div className="stat-value text-3xl text-warning">{mediumProblemsCount}</div>
                            </div>
                            <div className="stat px-4 py-2 border-l border-base-300/50">
                                <div className="stat-title text-base-content/60 font-semibold mb-1">Hard</div>
                                <div className="stat-value text-3xl text-error">{hardProblemsCount}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TrackPage;
