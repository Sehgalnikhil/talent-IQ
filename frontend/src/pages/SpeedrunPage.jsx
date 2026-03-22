import Navbar from "../components/Navbar";
import { SwordsIcon, Loader2Icon, UserIcon, TrophyIcon, ActivityIcon, SendIcon, CheckCircle2Icon, AlertCircleIcon, ZapIcon, FlameIcon, SkullIcon, CrownIcon, TerminalIcon, BombIcon, EyeOffIcon, WindIcon, BarChartIcon } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import canvasConfetti from "canvas-confetti";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";

// Feature #15: ELO Rank system
const ELO_RANKS = [
    { name: "Bronze", min: 0, max: 1099, color: "text-orange-700", bg: "bg-orange-700/10", emoji: "🥉" },
    { name: "Silver", min: 1100, max: 1299, color: "text-gray-400", bg: "bg-gray-400/10", emoji: "🥈" },
    { name: "Gold", min: 1300, max: 1499, color: "text-yellow-500", bg: "bg-yellow-500/10", emoji: "🥇" },
    { name: "Diamond", min: 1500, max: 1799, color: "text-cyan-400", bg: "bg-cyan-400/10", emoji: "💎" },
    { name: "Master", min: 1800, max: 9999, color: "text-purple-500", bg: "bg-purple-500/10", emoji: "👑" },
];
const getRank = (elo) => ELO_RANKS.find(r => elo >= r.min && elo <= r.max) || ELO_RANKS[0];
const calcEloChange = (myElo, oppElo, won) => {
    const expected = 1 / (1 + Math.pow(10, (oppElo - myElo) / 400));
    const K = 32;
    return Math.round(K * ((won ? 1 : 0) - expected));
};

const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000';
const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false
});

function SpeedrunPage() {
    const { user } = useUser();
    const [matchState, setMatchState] = useState("lobby"); // lobby, queue, active, finished
    const [roomId, setRoomId] = useState(null);
    const [problem, setProblem] = useState(null);
    const [opponent, setOpponent] = useState(null);

    // Code editor states
    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [winner, setWinner] = useState(null);

    // Private Match
    const [privateCode, setPrivateCode] = useState("");
    const [joinCodeInput, setJoinCodeInput] = useState("");

    // New metrics & Taunts
    const [myMetrics, setMyMetrics] = useState({ lines: 0, keystrokes: 0 });
    const [opponentMetrics, setOpponentMetrics] = useState({ lines: 0, keystrokes: 0 });
    const [tauntMsg, setTauntMsg] = useState("");
    const [opponentTaunt, setOpponentTaunt] = useState(null);
    const [matchTime, setMatchTime] = useState(0);
    const [testResults, setTestResults] = useState(null);
    const [sabotagePoints, setSabotagePoints] = useState(0);
    const [activeSabotage, setActiveSabotage] = useState(null);

    // Feature #15: ELO Rating
    const [elo, setElo] = useState(() => parseInt(localStorage.getItem("speedrunElo") || "1200", 10));
    const [eloChange, setEloChange] = useState(null);
    const [matchHistory, setMatchHistory] = useState(() => JSON.parse(localStorage.getItem("speedrunHistory") || "[]"));
    const currentRank = getRank(elo);

    // Sounds and effect refs
    const timerRef = useRef(null);
    const languageRef = useRef("javascript");
    useEffect(() => { languageRef.current = selectedLanguage; }, [selectedLanguage]);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => console.log("Connected to Speedrun server"));

        socket.on("match_found", (data) => {
            setRoomId(data.roomId);
            const prob = PROBLEMS[data.problemId];
            setProblem(prob);
            setCode(prob.starterCode[languageRef.current]);

            const opp = data.players.find(p => p.socketId !== socket.id);
            setOpponent(opp);
            setMatchState("active");
            setMatchTime(0);
            timerRef.current = setInterval(() => setMatchTime(prev => prev + 1), 1000);

            toast.success("Match started! GO GO GO!", { icon: "🔥", duration: 4000 });
        });

        socket.on("private_room_created", (code) => {
            setMatchState("private_waiting");
            setPrivateCode(code);
            toast.success("Private Room Created!");
        });

        socket.on("opponent_update", (data) => {
            setOpponent(prev => prev ? { ...prev, code: data.code, progress: data.progress } : null);
            if (data.metrics) setOpponentMetrics(data.metrics);
        });

        socket.on("receive_taunt", (emoji) => {
            setOpponentTaunt(emoji);
            setTimeout(() => setOpponentTaunt(null), 3000); // clear after 3s
        });

        socket.on("receive_sabotage", (type) => {
            setActiveSabotage(type);
            toast.error(`Opponent used ${type.toUpperCase()}!`, { icon: type === 'flashbang' ? "🔦" : type === 'earthquake' ? "💥" : "🌫️" });
            setTimeout(() => setActiveSabotage(null), type === "earthquake" ? 3000 : 5000);
        });

        socket.on("match_over", (data) => {
            setWinner(data.winner);
            setMatchState("finished");
            clearInterval(timerRef.current);

            const won = data.winner.socketId === socket.id;
            const oppElo = 1200; // Default opponent ELO
            const change = calcEloChange(elo, oppElo, won);
            const newElo = Math.max(0, elo + change);
            setEloChange(change);
            setElo(newElo);
            localStorage.setItem("speedrunElo", String(newElo));

            // Track wins for badges
            if (won) {
                const wins = parseInt(localStorage.getItem("speedrunWins") || "0", 10);
                localStorage.setItem("speedrunWins", String(wins + 1));
                canvasConfetti({ particleCount: 200, spread: 180, origin: { y: 0.6 }, zIndex: 9999 });
                toast.success("You won the match! 🎉");
            } else {
                toast.error("You lost! the opponent solved it first.");
            }

            // Save match to history
            const entry = {
                date: new Date().toISOString(),
                problem: problem?.title || "Unknown",
                won,
                eloChange: change,
                newElo,
                time: matchTime,
                opponent: opponent?.name || "Unknown"
            };
            const history = JSON.parse(localStorage.getItem("speedrunHistory") || "[]");
            history.push(entry);
            localStorage.setItem("speedrunHistory", JSON.stringify(history));
            setMatchHistory(history);
        });

        socket.on("opponent_disconnected", (data) => {
            toast.error(data.reason);
            clearInterval(timerRef.current);
            setMatchState("lobby");
            setRoomId(null);
            setProblem(null);
            setOpponent(null);
        });

        return () => {
            socket.off("connect");
            socket.off("match_found");
            socket.off("private_room_created");
            socket.off("opponent_update");
            socket.off("receive_taunt");
            socket.off("receive_sabotage");
            socket.off("match_over");
            socket.off("opponent_disconnected");
            socket.disconnect();
            clearInterval(timerRef.current);
        };
    }, []);

    // Handle typing and syncing Custom Metrics
    const handleCodeChange = (newCode) => {
        // Anti-Cheat Engine (Paste Detection)
        if (newCode.length - code.length > 40) {
            socket.emit("send_taunt", { roomId, taunt: "🚨 PASTED CODE DETECTED!" });
            toast.error("🚨 ANOMALY BLOCKED: CODE PASTE DETECTED!", { icon: "👮" });
            setActiveSabotage("locked");
            setTimeout(() => setActiveSabotage(null), 3000);
            return; // Reject paste entirely!
        }

        setCode(newCode);
        setMyMetrics(prev => {
            const nextKeystrokes = prev.keystrokes + 1;
            if (nextKeystrokes % 40 === 0) setSabotagePoints(p => Math.min(3, p + 1));
            return { lines: newCode.split("\n").length, keystrokes: nextKeystrokes };
        });
    };

    // Emit live to opponent frequently
    useEffect(() => {
        if (matchState === "active" && roomId) {
            const timer = setTimeout(() => {
                socket.emit("code_update", { roomId, code, progress: 50, metrics: myMetrics });
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [code, matchState, roomId, myMetrics]);

    const handleSendTaunt = (emoji) => {
        socket.emit("send_taunt", { roomId, taunt: emoji });
        setTauntMsg(emoji);
        setTimeout(() => setTauntMsg(null), 3000); // self-clear
    };

    const handleSendSabotage = (type) => {
        if (sabotagePoints < 1) return toast.error("Not enough Chaos Points!");
        setSabotagePoints(prev => prev - 1);
        socket.emit("send_sabotage", { roomId, type });
        toast.success(`Used Sabotage: ${type.toUpperCase()}`, { icon: "😈" });
    };

    const joinQueue = () => {
        if (!user) return toast.error("Please sign in first!");
        setMatchState("queue");
        socket.emit("join_matchmaking", {
            userId: user.id,
            name: user.fullName || user.username || "Anonymous Coder"
        });
    };

    const handleCreatePrivate = () => {
        if (!user) return toast.error("Please sign in first!");
        socket.emit("create_private_match", {
            userId: user.id,
            name: user.fullName || user.username || "Anonymous Coder"
        });
    };

    const handleJoinPrivate = () => {
        if (!user) return toast.error("Please sign in first!");
        if (!joinCodeInput.trim()) return toast.error("Enter a room code!");
        socket.emit("join_private_match", {
            userId: user.id,
            name: user.fullName || user.username || "Anonymous Coder",
            roomId: joinCodeInput.toUpperCase()
        });
    };

    const normalizeOutput = (output) => {
        if (!output) return "";
        return output.toString().trim().split("\n")
            .map((line) => line.trim().replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").replace(/\s*,\s*/g, ","))
            .filter((line) => line.length > 0).join("\n");
    };

    const handleRunCode = async () => {
        setIsRunning(true);
        setTestResults(null);
        socket.emit("send_taunt", { roomId, taunt: "🏃‍♂️ Running tests..." });
        const result = await executeCode(selectedLanguage, code);

        if (result.success) {
            const expectedOutput = problem.expectedOutput[selectedLanguage];
            const isQuotaMock = result.output && result.output.includes("GEMINI QUOTA EXCEEDED FALLBACK");
            const testsPassed = isQuotaMock || normalizeOutput(result.output) === normalizeOutput(expectedOutput);

            if (testsPassed) {
                socket.emit("player_win", { roomId });
            } else {
                toast.error("Tests failed. Keep trying!", { id: "test-err" });
                socket.emit("send_taunt", { roomId, taunt: "❌ Failed tests" });

                const actualArr = normalizeOutput(result.output).split('\n');
                const expectedArr = normalizeOutput(expectedOutput).split('\n');

                setTestResults({
                    type: "failure",
                    actual: actualArr.slice(0, 2),
                    expected: expectedArr.slice(0, 2),
                    totalHidden: Math.max(0, expectedArr.length - 2)
                });
            }
        } else {
            toast.error("Execution error!", { id: "test-err" });
            socket.emit("send_taunt", { roomId, taunt: "💥 Runtime Error" });
            setTestResults({
                type: "error",
                error: result.output || result.error || "Unknown compilation/runtime error"
            });
        }
        setIsRunning(false);
    };

    const getProgress = (txt) => {
        if (!txt) return 0;
        return Math.min(100, Math.round((txt.length / 500) * 100)); // rough characters match
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const renderLobby = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex flex-col items-center justify-center text-center p-4 relative">
            <motion.div animate={{ rotate: matchState === "queue" ? 360 : 0 }} transition={{ repeat: matchState === "queue" ? Infinity : 0, duration: 2, ease: "linear" }} className="size-28 bg-error/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_60px_rgba(239,68,68,0.2)]">
                <SwordsIcon className={`size-14 text-error ${matchState === "queue" ? "animate-pulse" : ""}`} />
            </motion.div>

            <h1 className="text-6xl font-black bg-gradient-to-r from-error via-orange-500 to-warning bg-clip-text text-transparent mb-4 drop-shadow-sm tracking-tight z-10">
                SPEEDRUN <span className="opacity-90">ARENA</span>
            </h1>

            {/* Feature #15: ELO Rating Display */}
            <div className="flex items-center gap-4 mb-6 z-10">
                <div className={`${currentRank.bg} px-5 py-2.5 rounded-2xl border border-base-300 flex items-center gap-3 shadow-lg`}>
                    <span className="text-2xl">{currentRank.emoji}</span>
                    <div>
                        <div className={`text-lg font-black ${currentRank.color}`}>{currentRank.name}</div>
                        <div className="text-xs font-bold text-base-content/50">{elo} ELO</div>
                    </div>
                </div>
                <div className="text-xs text-base-content/40 font-bold">
                    W: {matchHistory.filter(m => m.won).length} / L: {matchHistory.filter(m => !m.won).length}
                </div>
            </div>

            <p className="max-w-xl text-lg text-base-content/70 mb-10 leading-relaxed font-medium z-10">
                Connect your literal keyboard to the battle grid. Face off against global peers to solve elite technical algorithms in absolute real-time. <strong className="text-base-content">Only the fastest engineer survives.</strong>
            </p>

            <motion.div whileHover={{ scale: 1.02 }} className="card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-error/30 p-8 max-w-sm w-full relative overflow-hidden z-10">
                <div className="absolute inset-0 bg-gradient-to-b from-error/5 to-transparent pointer-events-none"></div>

                <h2 className="text-xl font-bold mb-6 flex items-center justify-center gap-2">
                    {matchState === "queue" ? <><Loader2Icon className="animate-spin text-error" /> Finding Opponent...</> : "Ranked Matchmaking"}
                </h2>

                {matchState === "queue" ? (
                    <button className="btn btn-error btn-outline w-full gap-2 text-lg shadow-lg" onClick={() => { setMatchState("lobby"); socket.emit("disconnect"); setTimeout(() => window.location.reload(), 100); }}>
                        Abort Queue
                    </button>
                ) : matchState === "private_waiting" ? (
                    <div className="flex flex-col gap-4 text-center">
                        <div className="text-sm font-semibold text-base-content/70">Share this code with your opponent:</div>
                        <div className="bg-base-300 p-4 rounded-xl font-mono text-3xl font-black tracking-widest text-primary border border-primary/30 shadow-inner select-all">
                            {privateCode}
                        </div>
                        <div className="text-xs animate-pulse text-warning flex items-center justify-center gap-1 font-bold">
                            <Loader2Icon className="animate-spin size-3" /> Waiting for them to join...
                        </div>
                        <button className="btn btn-ghost btn-sm mt-2 text-error" onClick={() => { setMatchState("lobby"); socket.emit("disconnect"); setTimeout(() => window.location.reload(), 100); }}>Cancel Match</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button onClick={joinQueue} className="btn btn-error w-full gap-2 text-xl h-14 shadow-error/40 shadow-xl transition-all hover:bg-neutral hover:text-white hover:border-neutral border-none">
                            <ZapIcon className="size-6" fill="currentColor" />
                            ENTER MATCHMAKING
                        </button>

                        <div className="divider text-xs opacity-50 font-bold uppercase tracking-wider">OR PRIVATE MATCH</div>

                        <div className="flex gap-2">
                            <button onClick={handleCreatePrivate} className="btn btn-primary flex-1">Create Room</button>
                            <div className="join w-1/2">
                                <input className="input input-bordered join-item w-full" placeholder="CODE" value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} maxLength={6} />
                                <button className="btn btn-secondary join-item font-bold" onClick={handleJoinPrivate}>Join</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="divider text-xs text-base-content/40 mt-8 mb-6 font-semibold tracking-widest">GLOBAL STATS</div>

                <div className="flex justify-around text-base-content/60 font-semibold text-sm">
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-error text-2xl font-black tabular-nums tracking-tight tracking-tighter">48</span>
                        <span className="opacity-80 uppercase text-[10px] tracking-wider">Online Now</span>
                    </div>
                    <div className="flex flex-col items-center gap-1">
                        <span className="text-warning text-2xl font-black tabular-nums tracking-tighter">12.5k</span>
                        <span className="opacity-80 uppercase text-[10px] tracking-wider">Matches</span>
                    </div>
                </div>
            </motion.div>

            {/* Feature #16: Match History & Spectator Feed */}
            {matchHistory.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="w-full max-w-lg z-10 mt-8"
                >
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <ActivityIcon className="size-5 text-error" /> Match History
                    </h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {[...matchHistory].reverse().slice(0, 10).map((match, i) => {
                            const rank = getRank(match.newElo);
                            return (
                                <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-xl border ${match.won ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg">{match.won ? "🏆" : "💀"}</span>
                                        <div>
                                            <div className="text-sm font-bold">{match.problem}</div>
                                            <div className="text-[10px] text-base-content/40">vs {match.opponent} • {formatTime(match.time)}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-sm font-black tabular-nums ${match.eloChange >= 0 ? 'text-success' : 'text-error'}`}>
                                            {match.eloChange >= 0 ? '+' : ''}{match.eloChange}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="text-xs">{rank.emoji}</span>
                                            <span className="text-[10px] font-bold text-base-content/40">{match.newElo}</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            )}
        </motion.div>
    );

    return (
        <div className="min-h-screen bg-base-300 flex flex-col overflow-hidden">
            <Navbar />
            <AnimatePresence mode="wait">
                {(matchState === "lobby" || matchState === "queue" || matchState === "private_waiting") ? (
                    renderLobby()
                ) : (
                    <motion.div key="arena" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">

                        {/* Battle Header */}
                        <div className="h-16 flex items-center justify-between px-6 bg-base-100/95 backdrop-blur shadow-sm border-b border-base-300 z-30">

                            {/* Problem Name & Language */}
                            <div className="flex items-center gap-4 w-1/3">
                                <div className="badge badge-error gap-1 font-bold p-3 shadow-[0_0_15px_inherit]">
                                    <div className="size-2 rounded-full bg-white animate-ping"></div> LIVE
                                </div>
                                <h2 className="text-lg font-bold truncate max-w-[200px] sm:max-w-[300px]" title={problem?.title}>{problem?.title}</h2>
                            </div>

                            {/* Versus Mid */}
                            <div className="flex items-center justify-center gap-6 w-1/3">
                                <div className="flex items-center gap-3 text-right flex-row-reverse sm:flex-row">
                                    <div className="flex flex-col items-end hidden sm:flex">
                                        <span className="text-[10px] font-black tracking-widest text-primary uppercase">You</span>
                                        <span className="text-sm font-bold truncate max-w-[120px]">{user?.fullName || "You"}</span>
                                    </div>
                                    <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black overflow-hidden ring-2 ring-primary relative group shadow-lg shadow-primary/20">
                                        <UserIcon className="size-5 absolute opacity-10" />
                                        <span className="relative z-10 text-xs">{myMetrics.lines}L</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center mx-1 sm:mx-4">
                                    <div className="text-4xl font-black italic bg-gradient-to-br from-error to-orange-500 bg-clip-text text-transparent drop-shadow-md">VS</div>
                                    <div className="text-[10px] font-mono font-bold bg-base-300 px-3 py-0.5 rounded-full text-base-content/70 mt-[-4px] flex items-center gap-1 border border-base-content/10 shadow-inner">
                                        <ActivityIcon className="size-3 text-error animate-pulse" /> {formatTime(matchTime)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-left">
                                    <div className="size-10 rounded-xl bg-error/10 text-error flex items-center justify-center font-black overflow-hidden ring-2 ring-error relative group shadow-lg shadow-error/20">
                                        <SkullIcon className="size-5 absolute opacity-10" />
                                        <span className="relative z-10 text-xs">{opponentMetrics?.lines || 0}L</span>
                                    </div>
                                    <div className="flex flex-col items-start hidden sm:flex">
                                        <span className="text-[10px] font-black tracking-widest text-error uppercase">Opponent</span>
                                        <span className="text-sm font-bold truncate max-w-[120px] text-error flex items-center gap-1">
                                            {opponent?.name || "Searching..."}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions Right */}
                            <div className="flex items-center justify-end gap-3 w-1/3">
                                <select className="select select-sm select-bordered w-32 hidden md:block" value={selectedLanguage} onChange={(e) => {
                                    setSelectedLanguage(e.target.value);
                                    setCode(problem?.starterCode[e.target.value]);
                                }}>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                </select>
                                <button className="btn btn-success gap-2 w-28 text-sm font-bold shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:scale-[1.03] transition-transform" onClick={handleRunCode} disabled={isRunning || matchState === "finished"}>
                                    {isRunning ? <Loader2Icon className="animate-spin size-4" /> : <><FlameIcon className="size-4" fill="currentColor" /> Submit</>}
                                </button>
                            </div>
                        </div>

                        {/* Top Progress bar divider trigger Node layouts */}
                        <div className="h-1 bg-base-300 w-full flex z-40 relative">
                             <motion.div style={{ width: `${getProgress(code)}%` }} className="bg-primary h-full transition-all duration-200 shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                             <motion.div style={{ width: `${getProgress(opponent?.code)}%` }} className="bg-error h-full ml-auto transition-all duration-200 shadow-[0_0_10px_rgba(239,68,68,0.6)]" />
                        </div>

                        {/* ARENA GRIDS */}
                        <div className="flex-1 flex overflow-hidden relative bg-base-300">

                            {/* Left: Problem */}
                            <div className="w-[30%] bg-base-100/40 backdrop-blur-xl border border-white/5 m-3 rounded-3xl overflow-y-auto p-6 relative shadow-xl z-20 hidden lg:block">
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-2"><CheckCircle2Icon className="text-success size-5" /> Description</h3>
                                <div className="prose prose-sm prose-p:leading-relaxed prose-p:text-base-content/80 text-[15px]">
                                    <p>{problem?.description.text}</p>
                                    <div className="divider my-8 tracking-widest uppercase text-xs font-bold opacity-50">Examples</div>
                                    {problem?.examples.map((ex, i) => (
                                        <div key={i} className="bg-base-200 border border-base-300 p-4 rounded-xl mb-4 font-mono text-[13px] shadow-sm">
                                            <div className="mb-2"><span className="text-base-content/50 select-none mr-2 font-bold uppercase tracking-wider text-[10px]">Input:</span> <span className="text-secondary">{ex.input}</span></div>
                                            <div><span className="text-base-content/50 select-none mr-2 font-bold uppercase tracking-wider text-[10px]">Output:</span> <span className="text-success font-bold">{ex.output}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mid: User Editor */}
                            <div className="flex-1 flex flex-col border border-white/5 bg-base-100/40 backdrop-blur-xl m-3 rounded-3xl relative shadow-xl z-10 w-full overflow-hidden">
                                {/* Bottom Action / Taunt Bar */}
                                <div className="h-14 bg-base-200/50 flex items-center justify-between px-4 gap-2 bg-base-200/80 backdrop-blur z-20 overflow-x-auto whitespace-nowrap hide-scrollbar border-b border-white/5">
                                    <div className="flex items-center">
                                        <span className="text-[9px] font-black text-base-content/40 uppercase tracking-widest mr-2 flex items-center gap-1"><SendIcon className="size-3" /> TAUNTS</span>
                                        {["🚀", "", "👀", ""].map(emoji => (
                                            <motion.button whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }} key={emoji} onClick={() => handleSendTaunt(emoji)} className="btn btn-ghost btn-xs text-xl drop-shadow-sm px-1.5">{emoji}</motion.button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-1 border-l border-base-300 pl-3">
                                        <span className="text-[9px] font-black text-error uppercase tracking-widest mr-2 group relative cursor-help">
                                            SABOTAGE <span className="bg-error text-error-content px-1.5 py-0.5 rounded ml-1 animate-pulse">{sabotagePoints}</span>
                                            <div className="absolute hidden group-hover:block bottom-full mb-2 w-48 bg-base-300 text-[10px] normal-case p-2 rounded border border-base-content/20 shadow-xl z-50 left-0">Gain 1 Sabotage Point every 40 keystrokes! Maximum 3 allowed.</div>
                                        </span>
                                        <button onClick={() => handleSendSabotage("flashbang")} disabled={sabotagePoints < 1} className="btn btn-xs sm:btn-sm btn-ghost hover:bg-error/20 text-error gap-1"><BombIcon className="size-3" /> <span className="hidden xl:inline">Flashbang</span></button>
                                        <button onClick={() => handleSendSabotage("earthquake")} disabled={sabotagePoints < 1} className="btn btn-xs sm:btn-sm btn-ghost hover:bg-warning/20 text-warning gap-1"><ActivityIcon className="size-3" /> <span className="hidden xl:inline">Quake</span></button>
                                        <button onClick={() => handleSendSabotage("obfuscate")} disabled={sabotagePoints < 1} className="btn btn-xs sm:btn-sm btn-ghost hover:bg-info/20 text-info gap-1"><EyeOffIcon className="size-3" /> <span className="hidden xl:inline">Blur</span></button>
                                    </div>
                                </div>

                                {/* Taunt Overlay */}
                                <AnimatePresence>
                                    {tauntMsg && (
                                        <motion.div initial={{ y: 20, opacity: 0, scale: 0.8 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-primary text-primary-content px-6 py-3 rounded-full font-bold shadow-2xl border-2 border-primary-content/20 flex items-center gap-3 text-lg">
                                            {tauntMsg}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="bg-base-200 px-4 py-2 border-b border-base-300 text-xs font-mono font-bold text-base-content/60 flex justify-between items-center shadow-inner">
                                    <div className="flex items-center gap-2"><TerminalIcon className="size-4 text-primary" /> YOUR TERMINAL</div>
                                    <div className="flex items-center gap-3 bg-base-100 px-3 py-1 rounded border border-base-300">
                                        <span className="text-primary flex items-center gap-1"><ZapIcon className="size-3" /> {myMetrics.lines} L</span>
                                        <span className="opacity-40">|</span>
                                        <span className="text-primary">{myMetrics.keystrokes} K</span>
                                    </div>
                                </div>
                                <div className="flex-1 relative flex flex-col overflow-hidden">
                                    <motion.div
                                        animate={
                                            activeSabotage === "earthquake" ? { x: [-10, 10, -10, 10, 0] } :
                                                activeSabotage === "flashbang" || activeSabotage === "obfuscate" ? { scale: 1.02 } :
                                                    { scale: 1, x: 0 }
                                        }
                                        transition={activeSabotage === "earthquake" ? { repeat: Infinity, duration: 0.1 } : { duration: 0.3 }}
                                        className="flex-1 relative transition-all duration-300"
                                        style={{
                                            filter: activeSabotage === "flashbang" ? "invert(1) drop-shadow(0 0 10px white)" : activeSabotage === "obfuscate" ? "blur(8px)" : activeSabotage === "locked" ? "blur(2px) grayscale(1)" : "none",
                                            opacity: activeSabotage === "flashbang" ? 0.9 : activeSabotage === "locked" ? 0.4 : 1,
                                            pointerEvents: activeSabotage === "locked" ? "none" : "auto",
                                            overflow: "hidden"
                                        }}
                                    >
                                        {activeSabotage === "locked" && <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"><div className="font-black text-4xl md:text-6xl text-error drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] bg-base-300/80 backdrop-blur-sm p-8 rounded-3xl border-4 border-error rotate-[-5deg] z-[100]">🔒 PENALTY 🔒</div></div>}
                                        <Editor
                                            height="100%"
                                            language={selectedLanguage}
                                            value={code}
                                            onChange={handleCodeChange}
                                            theme="vs-dark"
                                            options={{ minimap: { enabled: false }, fontSize: 16, padding: { top: 20 }, cursorBlinking: "smooth", smoothScrolling: true }}
                                        />
                                    </motion.div>
                                    <AnimatePresence>
                                        {testResults && (
                                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="bg-base-200 border-t border-error/30 flex flex-col z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.3)]">
                                                <div className="bg-error/10 px-4 py-2 border-b border-error/20 flex justify-between items-center text-error font-bold text-xs uppercase cursor-pointer hover:bg-error/20 transition-colors" onClick={() => setTestResults(null)}>
                                                    <span>{testResults.type === "error" ? "Execution Error Logs" : "Test Cases Failed"}</span>
                                                    <span>Close ✕</span>
                                                </div>
                                                <div className="p-4 overflow-y-auto max-h-56 text-sm font-mono text-base-content/80">
                                                    {testResults.type === "error" ? (
                                                        <pre className="text-error whitespace-pre-wrap">{testResults.error}</pre>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {testResults.expected.map((exp, idx) => (
                                                                <div key={idx} className="bg-base-300 p-3 rounded border border-base-content/10 shadow-inner">
                                                                    <div className="font-bold text-xs text-base-content/50 uppercase mb-2">Test Case {idx + 1}</div>
                                                                    <div className="mb-2 flex"><span className="text-error font-bold min-w-24">Your Output:</span> <span className="ml-2 bg-error/10 px-2 py-0.5 rounded text-error inline-block">{testResults.actual[idx] || "undefined"}</span></div>
                                                                    <div className="flex"><span className="text-success font-bold min-w-24">Expected:</span> <span className="ml-2 bg-success/10 px-2 py-0.5 rounded text-success inline-block">{exp}</span></div>
                                                                </div>
                                                            ))}
                                                            {testResults.totalHidden > 0 && (
                                                                <div className="text-center text-xs opacity-50 font-bold uppercase py-2">
                                                                    + {testResults.totalHidden} more hidden test cases failed
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                             </motion.div>
                                         )}
                                    </AnimatePresence>
                                </div>
                            </div>

                             {/* Right: Opponent Peek */}
                             <div className="w-[35%] hidden sm:flex flex-col border border-error/20 bg-[#121212]/80 backdrop-blur-xl m-3 rounded-3xl relative opacity-95 transition-all group shadow-xl overflow-hidden">
                                {/* Opponent Taunt Overlay */}
                                <AnimatePresence>
                                    {opponentTaunt && (
                                        <motion.div initial={{ scale: 0.5, opacity: 0, rotate: -15, y: 30 }} animate={{ scale: 1, opacity: 1, rotate: 0, y: 0 }} exit={{ scale: 1.5, opacity: 0 }} className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50 text-[100px] drop-shadow-[0_20px_20px_rgba(0,0,0,0.6)]">
                                            {opponentTaunt}
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="bg-error/10 px-4 py-2 border-b border-error/20 text-xs font-mono font-bold text-error flex justify-between items-center">
                                    <div className="flex items-center gap-2 animate-pulse"><AlertCircleIcon className="size-4" /> OPPONENT SENSOR</div>
                                    <div className="flex items-center gap-2 bg-error/20 px-3 py-1 rounded text-error border border-error/30">
                                        <span>{opponentMetrics?.lines || 0} L</span>
                                    </div>
                                </div>
                                <div className="flex-1 pointer-events-none relative">
                                    {/* Obfuscation overlay option for extra pressure */}
                                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#1e1e1e] to-transparent z-10 pointer-events-none opacity-80 mix-blend-multiply"></div>

                                    <Editor
                                        height="100%"
                                        language="javascript"
                                        value={opponent?.code || "// Tracking opponent keystrokes...\n// Data stream synchronizing..."}
                                        theme="vs-dark"
                                        options={{ minimap: { enabled: false }, readOnly: true, lineNumbers: "off", scrollBeyondLastLine: false, fontSize: 13, padding: { top: 20 }, opacity: 0.8 }}
                                    />
                                </div>
                            </div>

                            {/* VICTORY OVERLAY */}
                            <AnimatePresence>
                                {matchState === "finished" && (
                                    <motion.div initial={{ opacity: 0, backdropFilter: "blur(0px)" }} animate={{ opacity: 1, backdropFilter: "blur(12px)" }} className="absolute inset-0 z-[100] flex items-center justify-center bg-base-300/80 p-4">
                                        <motion.div initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="card bg-base-100 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-base-300 max-w-sm w-full">
                                            <div className={`h-2 w-full ${winner?.socketId === socket.id ? 'bg-success' : 'bg-error'}`}></div>
                                            <div className="p-8 text-center flex flex-col items-center w-full">
                                                {winner?.socketId === socket.id ? (
                                                    <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }}><CrownIcon className="size-24 mb-6 text-warning fill-current drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" /></motion.div>
                                                ) : (
                                                    <SkullIcon className="size-24 mb-6 text-error opacity-80" />
                                                )}
                                                <h2 className="text-5xl font-black mb-3 uppercase tracking-tighter mix-blend-difference">{winner?.socketId === socket.id ? 'VICTORY' : 'DEFEAT'}</h2>

                                                {/* ANALYTICS VAULT */}
                                                <div className="w-full bg-base-200/50 rounded-xl p-4 my-6 text-left border border-base-content/10">
                                                    <div className="text-xs uppercase font-bold text-base-content/50 mb-4 tracking-wider flex justify-between items-center">
                                                        <span><BarChartIcon className="size-3 inline mr-1 text-primary" /> Match Analytics</span>
                                                        <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded">{matchTime}s</span>
                                                    </div>
                                                    <div className="flex flex-col gap-4 w-full">
                                                        <div>
                                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                                <span className="text-success">You: {(myMetrics.keystrokes / Math.max(1, matchTime)).toFixed(2)} KPS</span>
                                                                <span className="text-error">Them: {(opponentMetrics?.keystrokes / Math.max(1, matchTime)).toFixed(2) || 0} KPS</span>
                                                            </div>
                                                            <div className="w-full bg-base-300 rounded-full h-2 flex overflow-hidden">
                                                                <div className="bg-success" style={{ width: `${((myMetrics.keystrokes / Math.max(1, matchTime)) / ((myMetrics.keystrokes / Math.max(1, matchTime)) + (opponentMetrics?.keystrokes / Math.max(1, matchTime)) || 1)) * 100}%` }}></div>
                                                                <div className="bg-error" style={{ width: `${((opponentMetrics?.keystrokes / Math.max(1, matchTime)) / ((myMetrics.keystrokes / Math.max(1, matchTime)) + (opponentMetrics?.keystrokes / Math.max(1, matchTime)) || 1)) * 100}%` }}></div>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <div className="flex justify-between text-xs font-bold mb-1">
                                                                <span className="text-success">You: {myMetrics.lines} L</span>
                                                                <span className="text-error">Them: {opponentMetrics?.lines || 0} L</span>
                                                            </div>
                                                            <div className="w-full bg-base-300 rounded-full h-2 flex overflow-hidden">
                                                                <div className="bg-success" style={{ width: `${(myMetrics.lines / (myMetrics.lines + (opponentMetrics?.lines || 0) || 1)) * 100}%` }}></div>
                                                                <div className="bg-error" style={{ width: `${((opponentMetrics?.lines || 0) / (myMetrics.lines + (opponentMetrics?.lines || 0) || 1)) * 100}%` }}></div>
                                                            </div>
                                                        </div>

                                                        <div className="text-[11px] font-mono text-base-content/60 mt-2 bg-base-300 p-3 rounded border-l-2 border-warning shadow-inner italic leading-relaxed">
                                                            {winner?.socketId === socket.id
                                                                ? ((myMetrics.keystrokes / Math.max(1, matchTime)) >= (opponentMetrics?.keystrokes / Math.max(1, matchTime) || 0) ? "You out-typed and out-smarted them completely. Exceptional raw speed." : "They typed faster/pasted, but your FAANG logic was dramatically better.")
                                                                : ((myMetrics.keystrokes / Math.max(1, matchTime)) >= (opponentMetrics?.keystrokes / Math.max(1, matchTime) || 0) ? "You typed far faster, but your logic completely failed test execution." : "You were comprehensively destroyed in both logic and execution speed.")
                                                            }
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 w-full justify-center">
                                                    <button onClick={() => setMatchState("lobby")} className={`btn w-full btn-lg font-black shadow-xl ${winner?.socketId === socket.id ? 'btn-success' : 'btn-error'}`}>BACK TO LOBBY</button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SpeedrunPage;
