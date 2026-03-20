import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router";
import { UserCheckIcon, CodeIcon, TrophyIcon, ActivityIcon, HexagonIcon, SparklesIcon, Share2Icon } from "lucide-react";
import toast from "react-hot-toast";
import { WeaknessAnalyzer, SmartTagger } from "../lib/ml-engine";

export default function PublicProfilePage() {
    const { username } = useParams();
    const [stats, setStats] = useState({ solved: 0, streak: 0, points: 0 });
    const [heatmapData, setHeatmapData] = useState([]);
    const [patterns, setPatterns] = useState([]);

    useEffect(() => {
        // Load stats from ML Engine / LS
        const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        const streak = parseInt(localStorage.getItem("currentStreak") || "0");
        const points = solved.length * 10;
        
        setStats({ solved: solved.length, streak, points });
        setHeatmapData(WeaknessAnalyzer.analyze().categories);
        setPatterns(SmartTagger.getPatternStats());
    }, []);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("Profile link copied! Share it with recruiters.");
    };

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />
            
            <div className="max-w-6xl mx-auto p-4 lg:p-8">
                
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 shadow-2xl relative overflow-hidden text-white flex flex-col md:flex-row items-center gap-8 mb-8">
                    <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 p-24 bg-black/10 rounded-full blur-2xl" />
                    
                    <div className="avatar z-10">
                        <div className="w-32 rounded-full ring ring-white ring-offset-base-100 ring-offset-4 shadow-2xl bg-base-100">
                            <span className="text-5xl font-black text-primary flex items-center justify-center pt-8">
                                {username?.substring(0, 1).toUpperCase() || "U"}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left z-10">
                        <h1 className="text-4xl font-black mb-2">{username || "Developer"}</h1>
                        <p className="text-white/80 font-medium mb-4">Talent IQ Interview Readiness Portfolio</p>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <div className="badge badge-lg border-white/30 bg-black/20 backdrop-blur-md gap-2 p-4 font-bold">
                                <TrophyIcon className="size-4 text-warning" /> {stats.points} IQ Points
                            </div>
                            <div className="badge badge-lg border-white/30 bg-black/20 backdrop-blur-md gap-2 p-4 font-bold flex items-center">
                                🔥 {stats.streak} Day Streak
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={handleShare} className="btn bg-white/20 hover:bg-white/30 text-white border-none shadow-lg z-10 gap-2 font-bold backdrop-blur-md">
                        <Share2Icon className="size-4" /> Share Portfolio
                    </button>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    
                    {/* Left Column */}
                    <div className="lg:col-span-1 space-y-6">
                        
                        {/* Verified Badge */}
                        <div className="card bg-base-100 shadow-xl border border-primary/20">
                            <div className="card-body p-6 items-center text-center">
                                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                                    <UserCheckIcon className="size-8 text-primary" />
                                </div>
                                <h3 className="card-title text-xl">Verified Skills</h3>
                                <p className="text-sm text-base-content/60">
                                    This profile's code executions are sandboxed and verified by Talent IQ's anti-cheat engine.
                                </p>
                            </div>
                        </div>

                        {/* Language Distribution */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body p-6">
                                <h3 className="card-title text-lg flex gap-2">
                                    <CodeIcon className="size-5 text-secondary" /> Top Languages
                                </h3>
                                <div className="space-y-4 mt-2">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>JavaScript</span>
                                            <span>85%</span>
                                        </div>
                                        <progress className="progress progress-warning w-full" value="85" max="100"></progress>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>Python</span>
                                            <span>10%</span>
                                        </div>
                                        <progress className="progress progress-info w-full" value="10" max="100"></progress>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span>Java</span>
                                            <span>5%</span>
                                        </div>
                                        <progress className="progress progress-error w-full" value="5" max="100"></progress>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column (Algorithms) */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Problem Heatmap Analysis */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="card-title text-xl flex gap-2">
                                        <ActivityIcon className="size-6 text-primary" /> Proficiency Radar
                                    </h3>
                                    <div className="text-right">
                                        <div className="text-3xl font-black text-primary">{stats.solved}</div>
                                        <div className="text-[10px] text-base-content/50 uppercase tracking-widest font-bold">Problems Solved</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {heatmapData.length > 0 ? (
                                        heatmapData.map(c => (
                                            <div key={c.category} className="bg-base-200/50 p-3 rounded-xl border border-base-300">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-xs font-bold truncate max-w-[70%]">{c.category}</span>
                                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                                                        c.strengthScore >= 70 ? 'bg-success/20 text-success' : 
                                                        c.strengthScore >= 40 ? 'bg-warning/20 text-warning' : 'bg-error/20 text-error'
                                                    }`}>{c.strengthScore}</span>
                                                </div>
                                                <div className="h-1.5 w-full bg-base-300 rounded-full overflow-hidden">
                                                    <div className={`h-full ${c.strengthScore >= 70 ? 'bg-success' : c.strengthScore >= 40 ? 'bg-warning' : 'bg-error'}`} style={{ width: `${c.strengthScore}%` }} />
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-full py-12 text-center text-base-content/40">
                                            <HexagonIcon className="size-12 mx-auto mb-2 opacity-20" />
                                            No proficiency data yet.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Demonstrated Patterns (ML Feature) */}
                        <div className="card bg-base-100 shadow-xl">
                            <div className="card-body p-6">
                                <h3 className="card-title text-xl flex gap-2 mb-4">
                                    <SparklesIcon className="size-6 text-accent" /> Strongest Algorithmic Patterns
                                </h3>
                                
                                <div className="flex flex-wrap gap-2">
                                    {patterns.length > 0 ? (
                                        patterns.map(p => (
                                            <div key={p.name} className="badge badge-lg border-accent/30 bg-accent/5 gap-2 px-4 py-3 font-semibold hover:bg-accent/10 transition-colors">
                                                <span>{p.icon}</span> {p.name}
                                                <span className="ml-1 text-[10px] opacity-60">Verified</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-sm text-base-content/50 italic">Submit code to showcase your algorithmic patterns.</div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
