import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams } from "react-router";
import { UserCheckIcon, CodeIcon, TrophyIcon, ActivityIcon, HexagonIcon, SparklesIcon, Share2Icon, FlameIcon, AwardIcon, FileTextIcon, CheckCircle2Icon, TrendingUpIcon } from "lucide-react";
import toast from "react-hot-toast";
import { WeaknessAnalyzer, SmartTagger } from "../lib/ml-engine";
import { motion, AnimatePresence } from "framer-motion";
import { PROBLEMS } from "../data/problems";

export default function PublicProfilePage() {
    const { username } = useParams();
    const [stats, setStats] = useState({ solved: 0, streak: 0, points: 0 });
    const [heatmapData, setHeatmapData] = useState([]);
    const [patterns, setPatterns] = useState([]);
    const [solvedList, setSolvedList] = useState([]);

    useEffect(() => {
        const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        const streak = parseInt(localStorage.getItem("currentStreak") || "0");
        const points = solved.length * 10;
        
        setStats({ solved: solved.length, streak, points });
        setHeatmapData(WeaknessAnalyzer.analyze().categories);
        setPatterns(SmartTagger.getPatternStats());
        setSolvedList(solved);
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied! Share it with recruiters.", { icon: "🔗" });
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.98 },
        show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 15 } }
    };

    return (
        <div className="min-h-screen bg-base-300 flex flex-col overflow-hidden text-base-content selection:bg-primary/30 relative">
            <Navbar />
            
            {/* Background Orbs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="max-w-6xl mx-auto p-5 lg:p-8 flex-1 w-full space-y-6 z-10 relative"
            >
                
                {/* Header Banner - Sleeker Glassy look */}
                <motion.div 
                    variants={cardVariants}
                    className="bg-gradient-to-br from-base-100/80 via-base-100/40 to-primary/5 backdrop-blur-xl rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-50" />
                    
                    <div className="avatar z-10 relative">
                        <div className="w-32 rounded-3xl shadow-2xl bg-gradient-to-br from-primary to-secondary p-[3px]">
                            <div className="w-full h-full bg-base-100 rounded-2xl flex items-center justify-center">
                                <span className="text-5xl font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent">
                                    {username?.substring(0, 1).toUpperCase() || "U"}
                                </span>
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-success text-success-content p-1.5 rounded-xl shadow-lg border-2 border-base-100">
                            <UserCheckIcon className="size-4" />
                        </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                            <h1 className="text-4xl font-black bg-gradient-to-r from-white to-base-content bg-clip-text text-transparent">{username || "Developer"}</h1>
                            <span className="badge badge-primary badge-outline text-xs uppercase tracking-widest font-black rounded-xl">Pro</span>
                        </div>
                        <p className="text-base-content/60 font-medium mb-4 text-sm flex items-center justify-center md:justify-start gap-1">
                             Talent IQ Interview Readiness Portfolio
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <div className="bg-base-200/80 backdrop-blur-md gap-2 px-3 py-1.5 rounded-xl border border-white/5 text-xs font-black flex items-center shadow-sm">
                                <AwardIcon className="size-4 text-warning animate-bounce" /> {stats.points} IQ Points
                            </div>
                            <div className="bg-base-200/80 backdrop-blur-md gap-1.5 px-3 py-1.5 rounded-xl border border-white/5 text-xs font-black flex items-center shadow-sm">
                                <FlameIcon className="size-4 text-error animate-pulse" /> {stats.streak} Day Streak
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleShare} className="btn btn-primary shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all z-10 gap-2 font-black rounded-xl px-5">
                        <Share2Icon className="size-4" /> Share Portfolio
                    </button>
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Verified Badge */}
                        <motion.div variants={cardVariants} className="bg-base-100/60 backdrop-blur-xl card border border-white/5 rounded-3xl shadow-sm">
                            <div className="card-body p-6 items-center text-center">
                                <div className="size-16 rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 flex items-center justify-center mb-2 shadow-inner border border-white/5">
                                    <UserCheckIcon className="size-8 text-primary animate-pulse" />
                                </div>
                                <h3 className="card-title text-xl font-black">Verified Skills</h3>
                                <p className="text-xs text-base-content/60 font-medium leading-relaxed">
                                    This profile's code executions are sandboxed and verified by Talent IQ's anti-cheat verification matrix engine.
                                </p>
                            </div>
                        </motion.div>

                        {/* Language Distribution */}
                        <motion.div variants={cardVariants} className="bg-base-100/60 backdrop-blur-xl card border border-white/5 rounded-3xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="card-title text-base font-black flex gap-2 mb-4 uppercase tracking-widest text-base-content/70">
                                    <CodeIcon className="size-5 text-secondary" /> Proficiency Graph
                                </h3>
                                <div className="space-y-4">
                                    {[{ lang: "JavaScript", val: 85, color: "bg-warning", bg: "bg-warning/10" }, { lang: "Python", val: 10, color: "bg-info", bg: "bg-info/10" }, { lang: "Java", val: 5, color: "bg-error", bg: "bg-error/10" }].map((item) => (
                                        <div key={item.lang}>
                                            <div className="flex justify-between text-xs font-black mb-1.5">
                                                <span>{item.lang}</span>
                                                <span className="opacity-70">{item.val}%</span>
                                            </div>
                                            <div className={`h-2 w-full ${item.bg} rounded-full overflow-hidden`}>
                                                <motion.div 
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.val}%` }}
                                                    transition={{ duration: 1, ease: "easeOut", delay: 0.3 }}
                                                    className={`h-full ${item.color} rounded-full`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* AI Readiness Report */}
                        <motion.div variants={cardVariants} className="bg-base-100/60 backdrop-blur-xl card border border-white/5 rounded-3xl shadow-md overflow-hidden relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-50" />
                            <div className="card-body p-6 relative z-10">
                                <h3 className="card-title text-base font-black flex gap-2 mb-4 uppercase tracking-widest text-base-content/70">
                                    <SparklesIcon className="size-5 text-primary animate-pulse" /> AI Readiness Score
                                </h3>
                                
                                <div className="flex flex-col items-center py-4">
                                    <div className="radial-progress text-primary font-black text-2xl shadow-inner bg-base-300/30 border border-white/5 rounded-full" style={{ "--value": stats.solved > 10 ? 88 : stats.solved * 8, "--size": "100px", "--thickness": "8px" }} role="progressbar">
                                         {stats.solved > 10 ? "88%" : `${stats.solved * 8}%`}
                                    </div>
                                    <div className="mt-4 text-center">
                                        <div className="text-sm font-black text-secondary">Ready for Mid-Level roles</div>
                                        <p className="text-[11px] text-base-content/50 font-medium">Top 12% in Algorithmic Efficiency</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Recent Solved List */}
                        <motion.div variants={cardVariants} className="bg-base-100/60 backdrop-blur-xl card border border-white/5 rounded-3xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="card-title text-base font-black flex gap-2 mb-4 uppercase tracking-widest text-base-content/70">
                                    <CheckCircle2Icon className="size-5 text-success" /> Recent Solved
                                </h3>
                                
                                <div className="space-y-2">
                                    {solvedList.length > 0 ? (
                                        solvedList.slice().reverse().slice(0, 4).map((id, index) => {
                                            const prob = PROBLEMS[id] || { title: id, difficulty: "Medium" };
                                            return (
                                                <div key={index} className="flex justify-between items-center p-2.5 bg-base-200/50 rounded-xl border border-white/5">
                                                    <span className="text-xs font-black truncate max-w-[150px]">{prob.title}</span>
                                                    <span className={`badge badge-ghost text-[10px] font-black ${prob.difficulty === "Easy" ? "text-success bg-success/10" : prob.difficulty === "Medium" ? "text-warning bg-warning/10" : "text-error bg-error/10"}`}>{prob.difficulty}</span>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="text-xs text-base-content/30 italic">No problems solved yet.</div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Middle/Right Column (Algorithms) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Problem Heatmap Analysis */}
                        <motion.div variants={cardVariants} className="bg-base-100/60 backdrop-blur-xl card border border-white/5 rounded-3xl shadow-sm">
                            <div className="card-body p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="card-title text-base font-black flex gap-2 uppercase tracking-widest text-base-content/70">
                                        <ActivityIcon className="size-5 text-primary" /> Skill Proficiency Grid
                                    </h3>
                                    <div className="text-right">
                                        <div className="text-3xl font-black bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{stats.solved}</div>
                                        <div className="text-[10px] text-base-content/40 uppercase tracking-widest font-black">Problems Handled</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    <AnimatePresence>
                                        {heatmapData.length > 0 ? (
                                            heatmapData.map((c, i) => (
                                                <motion.div 
                                                    key={c.category} 
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                    className="bg-base-200/50 p-3 rounded-2xl border border-white/5 flex flex-col justify-between"
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-xs font-black truncate max-w-[70%]">{c.category}</span>
                                                        <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-lg ${
                                                            c.strengthScore >= 70 ? 'bg-success/20 text-success' : 
                                                            c.strengthScore >= 40 ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                                                        }`}>{c.strengthScore}</span>
                                                    </div>
                                                    <div className="h-1.5 w-full bg-base-300 rounded-full overflow-hidden">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${c.strengthScore}%` }}
                                                            transition={{ duration: 0.8, ease: "easeOut" }}
                                                            className={`h-full ${c.strengthScore >= 70 ? 'bg-success' : c.strengthScore >= 40 ? 'bg-warning' : 'bg-error'}`} 
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))
                                        ) : (
                                            <div className="col-span-full py-12 text-center text-base-content/30 flex flex-col items-center">
                                                <HexagonIcon className="size-12 mb-2 opacity-20 animate-spin" />
                                                <p className="text-sm font-bold">No proficiency data logged yet.</p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Demonstrated Patterns (ML Feature) */}
                        <motion.div variants={cardVariants} className="bg-base-100/60 backdrop-blur-xl card border border-white/5 rounded-3xl shadow-sm">
                            <div className="card-body p-6">
                                <h3 className="card-title text-base font-black flex gap-2 mb-4 uppercase tracking-widest text-base-content/70">
                                    <SparklesIcon className="size-5 text-accent animate-pulse" /> Verified Algorithmic Patterns
                                </h3>
                                
                                <div className="flex flex-wrap gap-2">
                                    {patterns.length > 0 ? (
                                        patterns.map((p, i) => (
                                            <motion.div 
                                                key={p.name} 
                                                initial={{ fill: 0, scale: 0.8 }}
                                                animate={{ fill: 1, scale: 1 }}
                                                transition={{ delay: i * 0.08 }}
                                                className="badge badge-lg border-white/5 bg-accent/10 hover:bg-accent/20 gap-2 px-4 py-4 font-black text-xs transition-all hover:scale-105 cursor-pointer shadow-sm text-accent"
                                            >
                                                <span>{p.icon}</span> {p.name}
                                                <span className="ml-1 text-[9px] uppercase tracking-wider bg-accent/20 text-accent px-1.5 py-0.5 rounded-lg opacity-80">Verified</span>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="text-xs font-bold text-base-content/30 italic flex items-center gap-1">
                                             Solve problems to unlock recognized algorithmic pattern badges.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>
            </motion.div>
        </div>
    );
}
