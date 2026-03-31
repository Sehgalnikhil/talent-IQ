import Navbar from "../components/Navbar";
import { BookOpenIcon, StarIcon, CheckCircleIcon, ArrowRightIcon, ZapIcon, BrainCircuitIcon, DatabaseIcon, CpuIcon, LayersIcon, Code2Icon, FlameIcon, SparklesIcon, PlusIcon } from "lucide-react";
import { Link } from "react-router";
import { useState, useEffect } from "react";
import { PROBLEMS } from "../data/problems";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function StudyTracksPage() {
    const [customTracks, setCustomTracks] = useState([]);
    const [isGeneratingTrack, setIsGeneratingTrack] = useState(false);
    const [customTopic, setCustomTopic] = useState("");

    const [solvedProblems, setSolvedProblems] = useState([]);

    // Load saved custom tracks
    useEffect(() => {
        axiosInstance.get("/users/stats")
            .then(res => {
                setCustomTracks(res.data.aiCustomTracks || []);
                setSolvedProblems(res.data.problemsSolved || []);
            })
            .catch(err => console.error("Failed to fetch custom tracks", err));
    }, []);

    const handleGenerateTrack = async () => {
        if (!customTopic.trim()) return;
        setIsGeneratingTrack(true);
        toast.loading("AI is generating your custom study path...", { id: "track" });
        try {
            const res = await axiosInstance.post("/interview/generate-track", { topic: customTopic });
            const aiData = res.data;

            const newTrack = {
                id: aiData.trackId + "-" + Date.now(),
                title: aiData.title,
                description: aiData.description,
                iconType: "SparklesIcon", // Store string representation for localstorage
                color: "fuchsia-500",
                gradient: "from-fuchsia-500/20 to-fuchsia-500/5",
                progress: 0,
                total: aiData.total || 5,
                level: "Personalized",
                aiKeywords: aiData.problems || [] // save the AI generated concepts
            };

            const tracks = [newTrack, ...customTracks];
            setCustomTracks(tracks);
            await axiosInstance.post("/users/metadata/update", {
                key: "aiCustomTracks",
                value: tracks
            });
            setCustomTopic("");
            toast.success("Custom Track Generated!", { id: "track" });
        } catch (error) {
            toast.error("Failed to generate track.", { id: "track" });
        } finally {
            setIsGeneratingTrack(false);
        }
    };

    const coreTracks = [
        {
            id: "blind-75",
            title: "Blind 75",
            description: "The classic 75 questions to level up your data structures & algorithms foundation quickly.",
            icon: <StarIcon className="size-6 text-warning" />,
            color: "warning",
            gradient: "from-warning/20 to-warning/5",
            filterFunc: (p, i) => i < 75,
            level: "Intermediate"
        },
        {
            id: "meta-prep",
            title: "Meta Interview Prep",
            description: "Curated list of problems frequently asked by Meta in the last 6 months. High frequency focus.",
            icon: <BrainCircuitIcon className="size-6 text-info" />,
            color: "info",
            gradient: "from-info/20 to-info/5",
            filterFunc: (p, i) => i % 2 !== 0 && i < 100,
            level: "Advanced"
        },
        {
            id: "dp-mastery",
            title: "Dynamic Programming Mastery",
            description: "Conquer your fear of DP. Master 1D, 2D memoization to advanced state machine patterns.",
            icon: <CheckCircleIcon className="size-6 text-success" />,
            color: "success",
            gradient: "from-success/20 to-success/5",
            filterFunc: (p) => p.category.includes("Dynamic Programming"),
            level: "Advanced"
        },
        {
            id: "system-design",
            title: "System Design Essentials",
            description: "Learn how to build scalable and distributed systems through practical architecture problems.",
            icon: <LayersIcon className="size-6 text-primary" />,
            color: "primary",
            gradient: "from-primary/20 to-primary/5",
            filterFunc: (p, i) => i % 3 === 0 && i < 120,
            level: "Expert"
        },
        {
            id: "sql-crunch",
            title: "SQL Data Cruncher",
            description: "Get real hands-on experience by writing complex window functions and performance queries.",
            icon: <DatabaseIcon className="size-6 text-secondary" />,
            color: "secondary",
            gradient: "from-secondary/20 to-secondary/5",
            filterFunc: (p, i) => i >= 10 && i <= 45,
            level: "Beginner"
        },
        {
            id: "speedrun-basics",
            title: "Algorithm Speedrun Basics",
            description: "A fast-paced track designed to warm you up with the core algorithms in under a week.",
            icon: <ZapIcon className="size-6 text-accent" />,
            color: "accent",
            gradient: "from-accent/20 to-accent/5",
            filterFunc: (p, i) => p.difficulty === "Easy" && i < 30,
            level: "Beginner"
        }
    ];

    return (
        <div className="min-h-screen bg-base-200 selection:bg-primary/30">
            <Navbar />

            {/* Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] mix-blend-screen animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-100 border border-base-300 shadow-sm text-sm font-medium mb-4">
                        <FlameIcon className="size-4 text-orange-500" />
                        <span>Curated for Success</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-tight">
                        Master Your<br className="md:hidden" />
                        <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Technical Journey</span>
                    </h1>
                    <p className="text-base-content/70 max-w-2xl mx-auto text-lg pt-2 leading-relaxed">
                        Stop guessing what to study next. Enroll in a track designed by industry experts to fast-track your learning and crush your technical interviews.
                    </p>
                </div>

                {/* AI Custom Track Builder */}
                <div className="mb-12 bg-base-100/50 border border-primary/20 p-6 rounded-3xl flex flex-col md:flex-row gap-4 items-center shadow-lg backdrop-blur-md">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                            <SparklesIcon className="text-primary size-5" /> Generative AI Tracks
                        </h3>
                        <p className="text-sm text-base-content/60">Type a specific company, tech stack, or topic (e.g., "Web3 System Design") to generate a custom track.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <input
                            type="text"
                            className="input input-bordered input-primary w-full md:w-64"
                            placeholder="e.g. Stripe API Architecture"
                            value={customTopic}
                            onChange={(e) => setCustomTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateTrack()}
                            disabled={isGeneratingTrack}
                        />
                        <button className="btn btn-primary shadow-lg shadow-primary/20" onClick={handleGenerateTrack} disabled={isGeneratingTrack}>
                            {isGeneratingTrack ? <span className="loading loading-spinner"></span> : <><PlusIcon className="size-4" /> Build</>}
                        </button>
                    </div>
                </div>

                <motion.div
                    variants={{
                        hidden: { opacity: 0 },
                        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
                    }}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {[...customTracks, ...coreTracks].map((track) => {
                        const allProblems = Object.values(PROBLEMS);
                        let trackProblems = [];
                        if (track.level === "Personalized") {
                            const seed = track.id.length * track.title.length;
                            trackProblems = allProblems.slice(0, track.total).map((p, i) => allProblems[(seed + i) % allProblems.length]);
                        } else {
                            trackProblems = allProblems.filter(track.filterFunc);
                        }

                        const solvedCount = trackProblems.filter((p) => solvedProblems.includes(p.id)).length;
                        const total = trackProblems.length;
                        const progress = total > 0 ? Math.round((solvedCount / total) * 100) : 0;

                        return (
                            <motion.div
                                key={track.id}
                                variants={{
                                    hidden: { opacity: 0, y: 30, scale: 0.95 },
                                    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
                                }}
                                className="group relative bg-base-100/80 backdrop-blur-xl border border-base-300/50 rounded-3xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-500 ease-out"
                            >
                                {/* Card Background Gradient */}
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${track.gradient} rounded-bl-full opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />

                                <div className="p-8 h-full flex flex-col relative z-10">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={`size-14 rounded-2xl bg-${track.color}/10 border border-${track.color}/20 flex items-center justify-center shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                                            {track.iconType === "SparklesIcon" ? <SparklesIcon className="size-6 text-fuchsia-500" /> : track.icon}
                                        </div>
                                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${track.level === "Personalized" ? 'bg-fuchsia-500/10 text-fuchsia-500 border-fuchsia-500/20' : `bg-${track.color}/10 text-${track.color} border-${track.color}/20`}`}>
                                            {track.level}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl font-bold mb-3 tracking-tight group-hover:text-primary transition-colors">{track.title}</h2>
                                    <p className="text-base-content/60 text-sm leading-relaxed mb-8 flex-1">
                                        {track.description}
                                    </p>

                                    <div className="space-y-3 mb-8 w-full">
                                        <div className="flex justify-between text-sm font-semibold text-base-content/80">
                                            <span>{solvedCount} / {total} Solved</span>
                                            <span className={`text-${track.color}`}>{progress}%</span>
                                        </div>
                                        <div className="relative w-full h-2.5 rounded-full bg-base-300 overflow-hidden">
                                            <div
                                                className={`absolute top-0 left-0 h-full bg-${track.color} transition-all duration-1000 ease-out`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {progress === 100 ? (
                                            <button className={`btn w-full gap-2 border-2 border-success bg-success/10 text-success hover:bg-success hover:text-success-content hover:border-success shadow-sm rounded-xl transition-all`}>
                                                <CheckCircleIcon className="size-5" /> Track Completed
                                            </button>
                                        ) : progress > 0 ? (
                                            <Link to={`/curated/${track.id}`} className={`btn w-full gap-2 border-2 text-${track.color} border-${track.color} hover:bg-${track.color} hover:text-${track.color}-content hover:border-${track.color} bg-transparent shadow-sm rounded-xl transition-all group-hover:shadow-${track.color}/20 min-h-[3rem] h-12 flex items-center justify-center`}>
                                                Continue Track <ArrowRightIcon className="size-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        ) : (
                                            <Link to={`/curated/${track.id}`} className={`btn bg-${track.color} border-none text-${track.color}-content hover:brightness-110 w-full gap-2 shadow-lg shadow-${track.color}/20 rounded-xl transition-all min-h-[3rem] h-12 flex items-center justify-center`}>
                                                Enroll Now <Code2Icon className="size-4 ml-1" />
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
}

export default StudyTracksPage;
