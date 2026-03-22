import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { TrophyIcon, FlameIcon, MedalIcon, CrownIcon, SparklesIcon, TrendingUpIcon } from "lucide-react";
import axiosInstance from "../lib/axios";
import { motion } from "framer-motion";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
};

function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axiosInstance.get("/interview/leaderboard");
                setLeaderboard(res.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    return (
        <div className="min-h-screen bg-base-300 flex flex-col relative overflow-hidden text-base-content">
            <Navbar />
            <div className="absolute top-0 right-0 size-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
            <div className="absolute bottom-0 left-0 size-96 bg-secondary/10 rounded-full blur-3xl -z-10" />

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-4xl mx-auto px-4 py-12 w-full flex-1 z-10"
            >
                {/* HEADER */}
                <motion.div variants={itemVariants} className="text-center mb-12">
                    <div className="flex justify-center mb-4 relative">
                        <TrophyIcon className="size-16 text-warning animate-bounce" />
                        <SparklesIcon className="absolute top-0 right-1/3 size-5 text-warning animate-pulse" />
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-black mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Global Leaderboard
                    </h1>
                    <p className="text-base-content/60 font-medium text-sm">
                        Compete with elite developers across absolute algorithms!
                    </p>
                </motion.div>

                {/* TOP 3 PODIUM CARDS */}
                {!isLoading && topThree.length > 0 && (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {/* Rank 2 - Left */}
                        {topThree[1] && (
                            <div className="card bg-base-100/60 backdrop-blur-xl border border-white/5 order-2 md:order-1 mt-6 animate-fadeIn hover:shadow-lg transition-shadow">
                                <div className="card-body items-center text-center p-6">
                                    <div className="size-12 rounded-full bg-slate-500/10 flex items-center justify-center text-slate-400 mb-3 border border-slate-500/20">
                                        <MedalIcon className="size-6" />
                                    </div>
                                    <div className="avatar placeholder mb-2">
                                        <div className="size-14 rounded-full bg-slate-600 font-black text-slate-100 shadow-md">
                                            <span className="text-lg">{topThree[1].name.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-lg">{topThree[1].name}</h3>
                                    <span className="badge badge-sm badge-ghost font-bold opacity-60">RANK 2</span>
                                    <div className="divider my-2 opacity-10" />
                                    <span className="text-2xl font-black text-success">{topThree[1].score}%</span>
                                </div>
                            </div>
                        )}

                        {/* Rank 1 - Center */}
                        {topThree[0] && (
                            <div className="card bg-base-200/80 backdrop-blur-2xl border border-warning/10 order-1 md:order-2 shadow-2xl shadow-warning/5 relative scale-105 rounded-3xl animate-fadeIn">
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-14 rounded-full bg-warning/20 backdrop-blur-md flex items-center justify-center border border-warning/30 shadow-lg shadow-warning/20">
                                    <CrownIcon className="size-7 text-warning" />
                                </div>
                                <div className="card-body items-center text-center p-8 pt-10">
                                    <div className="avatar placeholder mb-3">
                                        <div className="size-20 rounded-full bg-gradient-to-br from-warning to-amber-600 font-black text-warning-content shadow-xl ring-4 ring-warning/30">
                                            <span className="text-2xl">{topThree[0].name.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-xl flex items-center gap-2">
                                        {topThree[0].name}
                                    </h3>
                                    <span className="badge badge-sm badge-warning font-black shadow-sm">RANK 1</span>
                                    <div className="divider my-3 opacity-20" />
                                    <span className="text-3xl font-black bg-gradient-to-r from-warning to-amber-500 bg-clip-text text-transparent">{topThree[0].score}%</span>
                                </div>
                            </div>
                        )}

                        {/* Rank 3 - Right */}
                        {topThree[2] && (
                            <div className="card bg-base-100/60 backdrop-blur-xl border border-white/5 order-3 mt-6 animate-fadeIn hover:shadow-lg transition-shadow">
                                <div className="card-body items-center text-center p-6">
                                    <div className="size-12 rounded-full bg-amber-800/10 flex items-center justify-center text-amber-700 mb-3 border border-amber-800/20">
                                        <MedalIcon className="size-6" />
                                    </div>
                                    <div className="avatar placeholder mb-2">
                                        <div className="size-14 rounded-full bg-amber-900 font-black text-amber-100 shadow-md">
                                            <span className="text-lg">{topThree[2].name.substring(0, 2).toUpperCase()}</span>
                                        </div>
                                    </div>
                                    <h3 className="font-black text-lg">{topThree[2].name}</h3>
                                    <span className="badge badge-sm badge-ghost font-bold opacity-60">RANK 3</span>
                                    <div className="divider my-2 opacity-10" />
                                    <span className="text-2xl font-black text-success">{topThree[2].score}%</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* LEADERBOARD TABLE */}
                <motion.div variants={itemVariants} className="card bg-base-100/40 backdrop-blur-xl shadow-2xl overflow-hidden border border-white/5 rounded-3xl">
                    <div className="overflow-x-auto">
                        <table className="table">
                            <thead className="bg-base-200/50 text-base-content/60 font-black uppercase text-xs tracking-wider border-b border-white/5">
                                <tr>
                                    <th className="text-center w-20">Rank</th>
                                    <th>Candidate</th>
                                    <th className="text-center">Target Role</th>
                                    <th className="text-center">Recorded</th>
                                    <th className="text-center">Gauntlet Score</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12">
                                            <span className="loading loading-spinner text-primary loading-md"></span>
                                        </td>
                                    </tr>
                                ) : leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-12 text-base-content/40 font-bold">
                                            No ranked coders yet. Let's start streaming!
                                        </td>
                                    </tr>
                                ) : leaderboard.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-base-200/40 cursor-pointer transition-colors">
                                        <td className="text-center">
                                            {idx === 0 ? (
                                                <CrownIcon className="mx-auto size-5 text-warning" />
                                            ) : idx === 1 ? (
                                                <MedalIcon className="mx-auto size-5 text-slate-400" />
                                            ) : idx === 2 ? (
                                                <MedalIcon className="mx-auto size-5 text-amber-700" />
                                            ) : (
                                                <span className="font-black text-sm text-base-content/50">#{idx + 1}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className={`rounded-full w-9 shadow-sm ${idx === 0 ? 'bg-gradient-to-r from-warning to-amber-500 text-warning-content' : 'bg-base-300 text-base-content/80'}`}>
                                                        <span className="text-xs font-black">{user.name.substring(0, 2).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-black text-sm">{user.name}</div>
                                                    <div className="text-[10px] uppercase font-black tracking-wider opacity-40">{user.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge badge-sm badge-outline font-black text-primary border-primary/20 bg-primary/5">{user.role}</span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-1 font-black text-orange-500 text-sm">
                                                <TrendingUpIcon className="size-4" />
                                                {new Date(user.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="text-center font-mono font-black text-success text-md">{user.score}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}

export default LeaderboardPage;
