import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { TrophyIcon, FlameIcon, MedalIcon, CrownIcon, SparklesIcon, TrendingUpIcon, ShieldCheckIcon, HistoryIcon, ChevronRightIcon, SwordsIcon, ActivityIcon, BotIcon, LayoutDashboardIcon, UsersIcon } from "lucide-react";
import axiosInstance from "../lib/axios";
import { motion, AnimatePresence } from "framer-motion";
import { useSocket } from "../context/SocketContext";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 30 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 80, damping: 20 } }
};

function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDark, setIsDark] = useState(true);
    const socket = useSocket();

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

    useEffect(() => {
        const checkTheme = () => {
            const theme = document.documentElement.getAttribute("data-theme");
            setIsDark(!["light", "cupcake", "bumblebee", "emerald", "corporate", "retro", "cyberpunk", "valentine", "garden", "lofi", "pastel", "fantasy", "wireframe", "cmyk", "autumn", "business", "acid", "lemonade", "winter", "nord"].includes(theme));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        fetchLeaderboard();

        if (socket) {
            socket.on("leaderboard_refresh", fetchLeaderboard);
            return () => socket.off("leaderboard_refresh", fetchLeaderboard);
        }
    }, [socket]);

    const topThree = leaderboard.slice(0, 3);
    const rest = leaderboard.slice(3);

    const globalAverage = leaderboard.length > 0
        ? (leaderboard.reduce((acc, curr) => acc + curr.score, 0) / leaderboard.length)
        : 78.4;

    const eliteCount = leaderboard.filter(u => u.score >= 90).length;

    return (
        <div className={`min-h-screen transition-colors duration-700 font-sans relative overflow-x-hidden pt-24 pb-32 ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300 text-base-content'}`}>
            <Navbar />

            {/* AMBIENT ENGINE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-full">
                <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] animate-pulse" />
            </div>

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-7xl mx-auto px-6 relative z-10 space-y-20"
            >
                {/* HEADER SECTION */}
                <motion.div variants={itemVariants} className="text-center space-y-6">
                    <div className="relative inline-block">
                        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-[-40px] rounded-full bg-warning/20 blur-3xl" />
                        <div className="size-24 mx-auto rounded-3xl bg-gradient-to-br from-warning via-amber-600 to-orange-700 p-[2px] shadow-3xl">
                            <div className={`w-full h-full rounded-[22px] flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
                                <TrophyIcon className="size-12 text-warning animate-bounce" />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-8xl font-black italic tracking-tighter uppercase bg-gradient-to-r from-warning via-amber-500 to-orange-400 bg-clip-text text-transparent">THE OLYMPIANS</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.8em] opacity-40">Global_Engineering_Leaderboard</p>
                    </div>
                </motion.div>

                {/* TOP PODIUM */}
                {!isLoading && topThree.length > 0 && (
                    <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">

                        {/* Rank 2 */}
                        {topThree[1] && (
                            <div className="md:col-span-3 order-2 md:order-1">
                                <motion.div whileHover={{ y: -10 }} className={`p-1 rounded-[40px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-3xl shadow-3xl text-center`}>
                                    <div className="p-10 space-y-6">
                                        <div className="size-16 mx-auto rounded-full bg-slate-500/20 flex items-center justify-center text-slate-400 font-black italic text-xl border border-slate-500/20">#2</div>
                                        <div className="avatar">
                                            <div className="size-20 rounded-2xl bg-slate-800 font-black text-slate-100 shadow-xl border border-white/5">
                                                {topThree[1].profileImage ? (
                                                    <img src={topThree[1].profileImage} alt={topThree[1].name} />
                                                ) : (
                                                    <span className="text-xl">{topThree[1].name.substring(0, 2).toUpperCase()}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black italic text-lg tracking-tight">{topThree[1].name.toUpperCase()}</h3>
                                            <p className="text-[8px] font-black uppercase opacity-30 mt-1">{topThree[1].role}</p>
                                        </div>
                                        <div className="text-3xl font-black text-success tracking-tighter italic">{topThree[1].score}%</div>
                                    </div>
                                </motion.div>
                            </div>
                        )}

                        {/* Rank 1 - THE PRIME */}
                        {topThree[0] && (
                            <div className="md:col-span-6 order-1 md:order-2">
                                <motion.div whileHover={{ scale: 1.02 }} className={`p-1 rounded-[64px] bg-gradient-to-br from-warning/20 to-amber-600/10 border border-warning/30 backdrop-blur-4xl shadow-4xl text-center relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 p-8">
                                        <CrownIcon className="size-12 text-warning opacity-20" />
                                    </div>
                                    <div className="p-16 space-y-8 relative z-10">
                                        <div className="size-24 mx-auto rounded-[32px] bg-warning/20 flex items-center justify-center text-warning font-black italic text-3xl border border-warning/40 shadow-2xl">#1</div>
                                        <div className="avatar relative">
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 10, repeat: Infinity, ease: "linear" }} className="absolute inset-[-10px] rounded-full border border-dashed border-warning/40" />
                                            <div className="size-36 rounded-3xl bg-gradient-to-br from-warning to-amber-500 font-black text-warning-content shadow-3xl ring-4 ring-warning/30">
                                                {topThree[0].profileImage ? (
                                                    <img src={topThree[0].profileImage} alt={topThree[0].name} className="object-cover" />
                                                ) : (
                                                    <span className="text-4xl">{topThree[0].name.substring(0, 2).toUpperCase()}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black italic text-3xl tracking-tighter uppercase">{topThree[0].name}</h3>
                                            <div className="badge bg-warning/10 text-warning border-warning/20 rounded-full px-6 py-4 font-black italic tracking-widest text-[10px] mt-4">APEX_ENGINEER</div>
                                        </div>
                                        <div className="text-6xl font-black bg-gradient-to-r from-warning to-white bg-clip-text text-transparent tracking-tighter italic drop-shadow-2xl">{topThree[0].score}%</div>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-warning/40 to-transparent" />
                                </motion.div>
                            </div>
                        )}

                        {/* Rank 3 */}
                        {topThree[2] && (
                            <div className="md:col-span-3 order-3">
                                <motion.div whileHover={{ y: -10 }} className={`p-1 rounded-[40px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-3xl shadow-3xl text-center`}>
                                    <div className="p-10 space-y-6">
                                        <div className="size-16 mx-auto rounded-full bg-amber-900/20 flex items-center justify-center text-amber-700 font-black italic text-xl border border-amber-900/20">#3</div>
                                        <div className="avatar">
                                            <div className="size-20 rounded-2xl bg-amber-900 font-black text-amber-100 shadow-xl border border-white/5">
                                                {topThree[2].profileImage ? (
                                                    <img src={topThree[2].profileImage} alt={topThree[2].name} />
                                                ) : (
                                                    <span className="text-xl">{topThree[2].name.substring(0, 2).toUpperCase()}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-black italic text-lg tracking-tight">{topThree[2].name.toUpperCase()}</h3>
                                            <p className="text-[8px] font-black uppercase opacity-30 mt-1">{topThree[2].role}</p>
                                        </div>
                                        <div className="text-3xl font-black text-success tracking-tighter italic">{topThree[2].score}%</div>
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* CANDIDATE TABLE */}
                <motion.div variants={itemVariants} className={`p-1 rounded-[48px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-3xl shadow-3xl overflow-hidden`}>
                    <div className="overflow-x-auto">
                        <table className="table w-full border-separate border-spacing-y-2 px-6">
                            <thead className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">
                                <tr>
                                    <th className="pl-12">Rank_Index</th>
                                    <th>Candidate_Profile</th>
                                    <th className="text-center">Sector_Target</th>
                                    <th className="text-center">Recorded_On</th>
                                    <th className="text-center pr-12">Gauntlet_Score</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr><td colSpan="5" className="text-center py-32"><span className="loading loading-spinner text-primary loading-lg"></span></td></tr>
                                ) : leaderboard.length === 0 ? (
                                    <tr><td colSpan="5" className="text-center py-32 opacity-20 text-[10px] font-black uppercase tracking-widest">No_Engineering_Archives_Found</td></tr>
                                ) : leaderboard.map((user, idx) => (
                                    <motion.tr
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group"
                                    >
                                        <td className="pl-12 py-6">
                                            <div className="flex items-center gap-4">
                                                {idx === 0 ? <CrownIcon className="size-5 text-warning group-hover:scale-125 transition-transform" /> :
                                                    idx === 1 ? <MedalIcon className="size-5 text-slate-400 group-hover:scale-125 transition-transform" /> :
                                                        idx === 2 ? <MedalIcon className="size-5 text-amber-700 group-hover:scale-125 transition-transform" /> :
                                                            <span className="text-sm font-black italic opacity-20">#{(idx + 1).toString().padStart(2, '0')}</span>}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-4">
                                                <div className="avatar">
                                                    <div className={`size-12 rounded-2xl shadow-xl transition-all group-hover:scale-110 ${idx < 3 ? 'bg-gradient-to-r from-warning to-amber-500 text-white' : 'bg-white/5 text-white/80'}`}>
                                                        {user.profileImage ? (
                                                            <img src={user.profileImage} alt={user.name} />
                                                        ) : (
                                                            <span className="text-xs font-black">{user.name.substring(0, 2).toUpperCase()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-black italic tracking-tight">{user.name.toUpperCase()}</div>
                                                    <div className="text-[8px] uppercase font-black tracking-widest opacity-30 group-hover:text-primary transition-colors">{user.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge bg-white/5 border border-white/5 rounded-full px-4 py-3 font-black text-[9px] uppercase tracking-widest opacity-60 group-hover:opacity-100 group-hover:border-primary/20 transition-all">{user.role}</span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-2 font-black text-[10px] opacity-40 uppercase tracking-tighter group-hover:opacity-100 transition-opacity">
                                                <TrendingUpIcon className="size-3 text-success" />
                                                {new Date(user.date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="text-center pr-12">
                                            <div className="text-2xl font-black italic text-success group-hover:scale-110 transition-transform tracking-tighter">{user.score}%</div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* FOOTER STATS */}
                <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { label: "Active_Coders", value: leaderboard.length, icon: <UsersIcon /> },
                        { label: "Global_Average", value: globalAverage.toFixed(1) + "%", icon: <ActivityIcon /> },
                        { label: "Elite_Engineers", value: eliteCount, icon: <BotIcon /> }
                    ].map(stat => (
                        <div key={stat.label} className="p-8 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-between group overflow-hidden relative">
                            <div className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <div className="relative z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-1">{stat.label}</p>
                                <p className="text-3xl font-black italic tracking-tighter">{stat.value}</p>
                            </div>
                            <div className="relative z-10 opacity-20 group-hover:opacity-100 transition-opacity">
                                {stat.icon}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}

export default LeaderboardPage;
