import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { TrophyIcon, FlameIcon, MedalIcon, CrownIcon } from "lucide-react";
import axiosInstance from "../lib/axios";

function LeaderboardPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axiosInstance.get("/users/leaderboard");
                setLeaderboard(res.data);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* HEADER */}
                <div className="text-center mb-10">
                    <div className="flex justify-center mb-4">
                        <TrophyIcon className="size-16 text-warning" />
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Global Leaderboard</h1>
                    <p className="text-base-content/70">
                        See how you stack up against top coders globally.
                    </p>
                </div>

                {/* LEADERBOARD TABLE */}
                <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300">
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead className="bg-base-200 text-base-content/80 font-bold uppercase text-xs">
                                <tr>
                                    <th className="text-center">Rank</th>
                                    <th>Coder</th>
                                    <th className="text-center">Problems Solved</th>
                                    <th className="text-center">Streak</th>
                                    <th className="text-center">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8">
                                            <span className="loading loading-spinner text-primary"></span> Loading global ranks...
                                        </td>
                                    </tr>
                                ) : leaderboard.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="text-center py-8 text-base-content/50">
                                            No ranked coders yet. Solve a problem to top the charts!
                                        </td>
                                    </tr>
                                ) : leaderboard.map((user, idx) => (
                                    <tr key={idx} className="hover:bg-base-200/50 transition-colors">
                                        <td className="text-center">
                                            {user.rank === 1 ? (
                                                <CrownIcon className="mx-auto size-6 text-warning" />
                                            ) : user.rank === 2 ? (
                                                <MedalIcon className="mx-auto size-6 text-base-content/50" />
                                            ) : user.rank === 3 ? (
                                                <MedalIcon className="mx-auto size-6 text-amber-700" />
                                            ) : (
                                                <span className="font-bold text-base-content/60">{user.rank}</span>
                                            )}
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <div className="avatar placeholder">
                                                    <div className="bg-neutral text-neutral-content rounded-full w-10">
                                                        <span className="text-xs">{user.name.substring(0, 2).toUpperCase()}</span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="font-bold">{user.name}</div>
                                                    <div className="text-sm opacity-50">{user.badge} Badge</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <span className="badge badge-primary badge-outline font-bold">{user.problems}</span>
                                        </td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-1 font-bold text-orange-500">
                                                <FlameIcon className="size-4" />
                                                {user.streak}
                                            </div>
                                        </td>
                                        <td className="text-center font-mono font-bold text-success text-lg">{user.points}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default LeaderboardPage;
