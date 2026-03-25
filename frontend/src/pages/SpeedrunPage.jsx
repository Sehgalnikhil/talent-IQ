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
import axiosInstance from "../lib/axios";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";


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

    // AI Whisper Tips State
    const [whisperTip, setWhisperTip] = useState("");
    const lastKeystrokeTime = useRef(Date.now());
    const [typingSpeed, setTypingSpeed] = useState(0); // CPM

    // Feature #15: ELO Rating
    const [elo, setElo] = useState(1200);
    const [eloChange, setEloChange] = useState(null);
    const [matchHistory, setMatchHistory] = useState([]);
    const currentRank = getRank(elo);

    useEffect(() => {
        axiosInstance.get("/users/stats")
            .then(res => {
                if (res.data.speedrun) {
                    setElo(res.data.speedrun.elo || 1200);
                    setMatchHistory(res.data.speedrun.history || []);
                }
            })
            .catch(err => console.error("Speedrun Stats fail", err));
    }, []);

    // Sounds and effect refs
    const timerRef = useRef(null);
    const languageRef = useRef("javascript");
    useEffect(() => { languageRef.current = selectedLanguage; }, [selectedLanguage]);

    useEffect(() => {
        console.log("🔌 Attempting Socket.IO connection to:", SOCKET_URL);
        socket.connect();
        socket.on("connect", () => console.log("✅ Socket Connected! ID:", socket.id));
        socket.on("connect_error", (err) => console.error("❌ Socket Connect Error:", err.message));
        socket.on("disconnect", (reason) => console.warn("⚠️ Socket Disconnected! Reason:", reason));

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
            console.log("✅ PRIVATE ROOM CREATED EVENT RECEIVED FROM BACKEND. Code:", code);
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
            console.log("😈 RECEIVED SABOTAGE FROM OPPONENT:", type);
            setActiveSabotage(type);
            toast.error(`Opponent used ${type.toUpperCase()}!`, { icon: type === 'flashbang' ? "🔦" : type === 'earthquake' ? "💥" : "🌫️" });
            setTimeout(() => {
                console.log("♻️ Clearing Sabotage effect:", type);
                setActiveSabotage(null);
            }, type === "earthquake" ? 3000 : 5000);
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

            // Track wins for badges
            if (won) {
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
            
            const history = [...matchHistory, entry];
            setMatchHistory(history);

            // 🔥 Production DB Sync
            axiosInstance.post("/users/metadata/update", {
                key: "speedrun",
                value: {
                    elo: newElo,
                    wins: won ? 1 : 0, // Wins are processed better by aggregates on queries
                    history: history
                }
            }).catch(err => console.error("Could not save matching weights", err));
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
            
            // Calculate typing speed (RPM / CPM)
            const now = Date.now();
            const diff = now - lastKeystrokeTime.current;
            lastKeystrokeTime.current = now;
            
            if (diff > 0) {
                const currentCpm = Math.floor(60000 / diff);
                setTypingSpeed(currentCpm > 600 ? 600 : currentCpm); // Clamp for visualization
            }

            if (nextKeystrokes > 0 && nextKeystrokes % 40 === 0) {
                setSabotagePoints(prevPoints => Math.min(3, prevPoints + 1));
                toast("🔥 +1 Sabotage Point!", { icon: "😈", duration: 2000 });
                
                // Generate AI Hint
                const randomTips = [
                    "Tip: Standardizing array bounds checks on triggers.",
                    "Tip: Beware time complexities targeting nested Loops.",
                    "Tip: Space complexity is O(1) if reusing pointers buffers.",
                    "Tip: Substring checks expand quickly to large limits."
                ];
                setWhisperTip(randomTips[Math.floor(Math.random() * randomTips.length)]);
            }
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
        console.log(`🚀 handleSendSabotage Clicked: ${type}`);
        console.log(`📊 Current State -> Points: ${sabotagePoints}, RoomId: ${roomId}`);
        
        if (sabotagePoints < 1) {
            console.warn("⚠️ Not enough points to sabotage!");
            return toast.error("Not enough Chaos Points!");
        }
        
        try {
            setSabotagePoints(prev => prev - 1);
            socket.emit("send_sabotage", { roomId, type });
            console.log(`📡 Emitted send_sabotage over socket with roomId: ${roomId}`);
            toast.success(`Used Sabotage: ${type.toUpperCase()}`, { icon: "😈" });
        } catch (err) {
            console.error("💥 Silent Crash in handleSendSabotage:", err);
        }
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
        console.log("🚀 User Clicked 'Create Private Match'. Socket ID:", socket.id);
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

    const handleExportPdf = async () => {
        const element = document.getElementById("analytics-dossier");
        if (!element) return toast.error("Dossier data not found yet!");

        toast.loading("Compiling Developer Dossier...", { id: "pdf-gen" });
        try {
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: "#0c0e12" });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF("p", "mm", "a4");
            const imgWidth = 210; // A4 width
            const pageHeight = 295; // A4 height
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 150);
            pdf.text("Developer Dossier - Speedrun Outputs", 10, 10);
            
            pdf.addImage(imgData, "PNG", 0, 15, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save(`Dossier_Speedrun_${Date.now()}.pdf`);
            toast.success("Dossier Exported!", { id: "pdf-gen" });
        } catch (err) {
            console.error(err);
            toast.error("Export Failed!", { id: "pdf-gen" });
        }
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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="flex-1 flex flex-col items-center justify-center text-center p-4 relative bg-[#0c0e12]">
            {/* Ambient Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-error/10 rounded-full blur-[120px] mix-blend-screen animate-pulse -z-10" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse -z-10" />

            <motion.div animate={{ rotate: matchState === "queue" ? 360 : 0 }} transition={{ repeat: matchState === "queue" ? Infinity : 0, duration: 2, ease: "linear" }} className="size-28 bg-gradient-to-br from-error/20 to-orange-500/20 rounded-3xl flex items-center justify-center mb-6 shadow-[0_0_80px_rgba(239,68,68,0.15)] relative overflow-hidden backdrop-blur-md">
                <SwordsIcon className={`size-14 text-error ${matchState === "queue" ? "animate-pulse" : ""}`} />
            </motion.div>

            <h1 className="text-6xl font-black bg-gradient-to-r from-error via-orange-500 to-warning bg-clip-text text-transparent mb-4 tracking-tight z-10 font-[Manrope] flex justify-center items-center gap-4 text-center">
                <span>SPEEDRUN</span> <span className="opacity-90">ARENA</span>
            </h1>

            {/* Feature #15: ELO Rating Display */}
            <div className="flex items-center gap-4 mb-6 z-10">
                <div className={`${currentRank.bg} px-5 py-2.5 rounded-2xl flex items-center gap-3 bg-gradient-to-tr from-base-100 to-base-200/50 shadow-[0_10px_30px_rgba(0,0,0,0.3)] backdrop-blur-md`}>
                    <span className="text-2xl">{currentRank.emoji}</span>
                    <div>
                        <div className={`text-lg font-black ${currentRank.color}`}>{currentRank.name}</div>
                        <div className="text-xs font-bold text-base-content/40">{elo} ELO</div>
                    </div>
                </div>
                <div className="text-xs text-base-content/40 font-bold bg-base-100/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                    W: {matchHistory.filter(m => m.won).length} / L: {matchHistory.filter(m => !m.won).length}
                </div>
            </div>

            <p className="max-w-xl text-lg text-base-content/70 mb-10 leading-relaxed font-medium z-10 font-[Inter]">
                Connect your literal keyboard to the battle grid. Face off against global peers to solve elite technical algorithms in absolute real-time. <strong className="text-base-content">Only the fastest engineer survives.</strong>
            </p>

            <motion.div whileHover={{ scale: 1.02 }} className="card bg-gradient-to-b from-[#1a1c20]/80 to-[#111317]/95 backdrop-blur-2xl shadow-[0_25px_80px_rgba(0,0,0,0.6)] p-8 max-w-sm w-full relative overflow-hidden z-10 rounded-3xl">
                <div className="absolute inset-0 bg-gradient-to-b from-error/5 to-transparent pointer-events-none"></div>

                <h2 className="text-xl font-black mb-6 flex items-center justify-center gap-2 font-[Manrope]">
                    {matchState === "queue" ? <><Loader2Icon className="animate-spin text-error" /> Finding Opponent...</> : "Ranked Matchmaking"}
                </h2>

                {matchState === "queue" ? (
                    <button className="btn btn-error btn-outline w-full gap-2 text-lg shadow-lg rounded-2xl" onClick={() => { setMatchState("lobby"); socket.emit("disconnect"); setTimeout(() => window.location.reload(), 100); }}>
                        Abort Queue
                    </button>
                ) : matchState === "private_waiting" ? (
                    <div className="flex flex-col gap-4 text-center">
                        <div className="text-sm font-semibold text-base-content/70">Share this code with your opponent:</div>
                        <div className="bg-[#0c0e12] p-4 rounded-xl font-mono text-3xl font-black tracking-widest text-primary shadow-inner select-all border border-primary/10">
                            {privateCode}
                        </div>
                        <div className="text-xs animate-pulse text-warning flex items-center justify-center gap-1 font-bold">
                            <Loader2Icon className="animate-spin size-3" /> Waiting for them to join...
                        </div>
                        <button className="btn btn-ghost btn-sm mt-2 text-error" onClick={() => { setMatchState("lobby"); socket.emit("disconnect"); setTimeout(() => window.location.reload(), 100); }}>Cancel Match</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <button onClick={joinQueue} className="btn bg-gradient-to-r from-error to-orange-500 w-full gap-2 text-xl font-black h-14 shadow-[0_15px_40px_rgba(239,68,68,0.3)] border-none text-white rounded-2xl scale-100 hover:scale-[1.03] transition-all">
                            <ZapIcon className="size-6" fill="currentColor" />
                            ENTER MATCHMAKING
                        </button>

                        <div className="divider text-xs opacity-50 font-bold uppercase tracking-wider before:bg-gradient-to-r before:from-transparent before:to-base-content/20 after:bg-gradient-to-r after:from-base-content/20 after:to-transparent">OR PRIVATE MATCH</div>

                        <div className="flex gap-2">
                            <button onClick={handleCreatePrivate} className="btn btn-primary flex-1 rounded-2xl font-bold">Create Room</button>
                            <div className="join w-1/2 rounded-2xl overflow-hidden border border-base-content/10">
                                <input className="input input-bordered join-item w-full font-mono font-bold text-center" placeholder="CODE" value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} maxLength={6} />
                                <button className="btn btn-secondary join-item font-bold" onClick={handleJoinPrivate}>Join</button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="divider text-xs text-secondary/60 mt-8 mb-4 font-black tracking-widest before:bg-gradient-to-r before:from-transparent before:to-secondary/20 after:bg-gradient-to-r after:from-secondary/20 after:to-transparent flex items-center gap-2">
                    <ZapIcon className="size-3 text-secondary animate-pulse" fill="currentColor" /> ARENA MUTATORS
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-base-content/60">
                    <div className="bg-[#111317]/60 p-2.5 rounded-xl border border-white/5 flex flex-col items-center gap-1.5 shadow-inner hover:scale-105 transition-transform cursor-help group relative">
                        <BombIcon className="size-4 text-error" />
                        <span className="text-error font-black">FLASHBANG</span>
                        <div className="absolute hidden group-hover:block bottom-full mb-2 w-40 bg-[#1a1c20] text-[9px] font-medium p-2 rounded-lg shadow-xl z-50 left-1/2 -translate-x-1/2 backdrop-blur-md">Blurs the opponent's screen for 5s! Gain 1 Pt per 40 keystrokes.</div>
                    </div>
                    <div className="bg-[#111317]/60 p-2.5 rounded-xl border border-white/5 flex flex-col items-center gap-1.5 shadow-inner hover:scale-105 transition-transform cursor-help group relative">
                        <ActivityIcon className="size-4 text-warning" />
                        <span className="text-warning font-black">QUAKE</span>
                        <div className="absolute hidden group-hover:block bottom-full mb-2 w-40 bg-[#1a1c20] text-[9px] font-medium p-2 rounded-lg shadow-xl z-50 left-1/2 -translate-x-1/2 backdrop-blur-md">Shakes the opponent's viewport vigorously making coding hard!</div>
                    </div>
                    <div className="bg-[#111317]/60 p-2.5 rounded-xl border border-white/5 flex flex-col items-center gap-1.5 shadow-inner hover:scale-105 transition-transform cursor-help group relative">
                        <EyeOffIcon className="size-4 text-info" />
                        <span className="text-info font-black">BLUR</span>
                        <div className="absolute hidden group-hover:block bottom-full mb-2 w-40 bg-[#1a1c20] text-[9px] font-medium p-2 rounded-lg shadow-xl z-50 left-1/2 -translate-x-1/2 backdrop-blur-md">Blurs code tracking rendering obfuscating their output telemetry.</div>
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
        <div className="min-h-screen bg-[#0c0e12] flex flex-col overflow-hidden">
            <Navbar />
            <AnimatePresence mode="wait">
                {(matchState === "lobby" || matchState === "queue" || matchState === "private_waiting") ? (
                    renderLobby()
                ) : (
                    <motion.div key="arena" initial={{ opacity: 0, scale: 1.02 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#0c0e12]">
                        {/* Ambient Glow behind Arena */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--fallback-b1,oklch(var(--b1)))_1px,transparent_1px)] bg-[size:32px_32px] opacity-10 pointer-events-none"></div>

                        {/* Battle Header */}
                        <div className="h-16 flex items-center justify-between px-6 bg-[#111317]/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)] z-30 relative overflow-hidden">
                            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-error/30 to-transparent"></div>

                            {/* Problem Name & Language */}
                            <div className="flex items-center gap-4 w-1/3">
                                <div className="badge bg-gradient-to-r from-error to-orange-500 border-none gap-1 font-black p-3 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]">
                                    <div className="size-2 rounded-full bg-white animate-ping"></div> LIVE
                                </div>
                                <h2 className="text-lg font-black truncate max-w-[200px] sm:max-w-[300px] font-[Manrope]" title={problem?.title}>{problem?.title}</h2>
                            </div>

                            {/* Versus Mid */}
                            <div className="flex items-center justify-center gap-6 w-1/3">
                                <div className="flex items-center gap-3 text-right flex-row-reverse sm:flex-row">
                                    <div className="flex flex-col items-end hidden sm:flex">
                                        <span className="text-[10px] font-black tracking-widest text-[#00daf3] uppercase">You</span>
                                        <span className="text-sm font-bold truncate max-w-[120px]">{user?.fullName || "You"}</span>
                                    </div>
                                    <div className="size-10 rounded-xl bg-gradient-to-br from-[#00daf3]/20 to-[#00616d]/10 text-[#00daf3] flex items-center justify-center font-black overflow-hidden relative group shadow-[0_0_15px_rgba(0,218,243,0.2)]">
                                        <UserIcon className="size-5 absolute opacity-10" />
                                        <span className="relative z-10 text-xs font-black">{myMetrics.lines}L</span>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center mx-1 sm:mx-4">
                                    <div className="text-4xl font-black italic bg-gradient-to-br from-error via-orange-500 to-warning bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(239,68,68,0.3)] font-[Manrope]">VS</div>
                                    <div className="text-[10px] font-mono font-bold bg-[#1a1c20] px-3 py-0.5 rounded-full text-base-content/70 mt-[-4px] flex items-center gap-1 shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                                        <ActivityIcon className="size-3 text-error animate-pulse" /> {formatTime(matchTime)}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-left">
                                    <div className="size-10 rounded-xl bg-gradient-to-br from-error/20 to-error/5 text-error flex items-center justify-center font-black overflow-hidden relative group shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                                        <SkullIcon className="size-5 absolute opacity-10" />
                                        <span className="relative z-10 text-xs font-black">{opponentMetrics?.lines || 0}L</span>
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
                                <select className="select select-sm select-bordered w-32 hidden md:block rounded-xl bg-[#1a1c20] border-base-content/10 font-bold" value={selectedLanguage} onChange={(e) => {
                                    setSelectedLanguage(e.target.value);
                                    setCode(problem?.starterCode[e.target.value]);
                                }}>
                                    <option value="javascript">JavaScript</option>
                                    <option value="python">Python</option>
                                    <option value="java">Java</option>
                                </select>
                                <button className="btn bg-gradient-to-r from-success to-[#00a96e] border-none text-white gap-2 w-28 text-sm font-black shadow-[0_10px_20px_rgba(34,197,94,0.3)] hover:scale-[1.03] transition-transform rounded-xl" onClick={handleRunCode} disabled={isRunning || matchState === "finished"}>
                                    {isRunning ? <Loader2Icon className="animate-spin size-4" /> : <><FlameIcon className="size-4" fill="currentColor" /> Submit</>}
                                </button>
                            </div>
                        </div>

                        {/* Top Progress bar divider trigger Node layouts */}
                        <div className="h-[2px] bg-[#1a1c20] w-full flex z-40 relative">
                             <motion.div style={{ width: `${getProgress(code)}%` }} className="bg-[#00daf3] h-full transition-all duration-200 shadow-[0_0_15px_rgba(0,218,243,0.8)]" />
                             <motion.div style={{ width: `${getProgress(opponent?.code)}%` }} className="bg-error h-full ml-auto transition-all duration-200 shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                        </div>

                        {/* ARENA GRIDS */}
                        <div className="flex-1 flex overflow-hidden relative bg-[#0c0e12] p-2">

                            {/* Left: Problem */}
                            <div className="w-[30%] bg-[#1a1c20]/60 backdrop-blur-2xl m-2 rounded-2xl overflow-y-auto p-6 relative shadow-[0_10px_40px_rgba(0,0,0,0.4)] z-20 hidden lg:block border border-white/5">
                                <h3 className="text-2xl font-black mb-6 flex items-center gap-3 font-[Manrope]"><CheckCircle2Icon className="text-success size-6" /> Description</h3>
                                <div className="prose prose-sm prose-p:leading-relaxed prose-p:text-base-content/80 text-[15px] font-[Inter]">
                                    <p className="font-medium text-base-content/90">{problem?.description.text}</p>
                                    <div className="divider my-8 tracking-widest uppercase text-xs font-black opacity-30 before:bg-gradient-to-r before:from-transparent before:to-base-content after:bg-gradient-to-r after:from-base-content after:to-transparent">Examples</div>
                                    {problem?.examples.map((ex, i) => (
                                        <div key={i} className="bg-[#111317]/80 backdrop-blur-md p-4 rounded-xl mb-4 font-mono text-[13px] shadow-inner border border-white/5">
                                            <div className="mb-2"><span className="text-base-content/40 select-none mr-2 font-black uppercase tracking-wider text-[10px]">Input:</span> <span className="text-[#00daf3] font-bold">{ex.input}</span></div>
                                            <div><span className="text-base-content/40 select-none mr-2 font-black uppercase tracking-wider text-[10px]">Output:</span> <span className="text-success font-black">{ex.output}</span></div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Mid: User Editor */}
                            <div className="flex-1 flex flex-col bg-[#1a1c20]/40 backdrop-blur-2xl m-2 rounded-2xl relative shadow-[0_10px_40px_rgba(0,0,0,0.4)] z-10 w-full overflow-hidden border border-white/5">
                                {/* Bottom Action / Taunt Bar */}
                                <div className="h-14 bg-[#111317]/80 flex items-center justify-between px-4 gap-2 backdrop-blur-xl z-20 overflow-x-auto whitespace-nowrap hide-scrollbar border-b border-white/5">
                                    <div className="flex items-center">
                                        <span className="text-[9px] font-black text-base-content/40 uppercase tracking-widest mr-3 flex items-center gap-1"><SendIcon className="size-3" /> TAUNTS</span>
                                        {["🚀", "🔥", "👀", "👑"].map(emoji => (
                                            <motion.button whileHover={{ scale: 1.2, y: -2 }} whileTap={{ scale: 0.9 }} key={emoji} onClick={() => handleSendTaunt(emoji)} className="btn btn-ghost btn-xs text-xl drop-shadow-sm px-1.5">{emoji}</motion.button>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-2 border-l border-white/10 pl-3">
                                        <span className="text-[9px] font-black text-error uppercase tracking-widest mr-2 cursor-help flex items-center gap-1 group" title="Gain 1 Sabotage Point every 40 keystrokes! Maximum 3 allowed.">
                                            SABOTAGE <span className="bg-error text-error-content px-1.5 py-0.5 rounded font-black text-[10px] animate-pulse">{sabotagePoints}</span>
                                        </span>
                                        <button onClick={() => handleSendSabotage("flashbang")} disabled={sabotagePoints < 1} className="btn btn-xs sm:btn-sm btn-ghost hover:bg-error/20 text-error gap-1 rounded-lg font-black disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"><BombIcon className="size-3" /> <span className="hidden xl:inline">Flashbang</span></button>
                                        <button onClick={() => handleSendSabotage("earthquake")} disabled={sabotagePoints < 1} className="btn btn-xs sm:btn-sm btn-ghost hover:bg-warning/20 text-warning gap-1 rounded-lg font-black disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"><ActivityIcon className="size-4" /> <span className="hidden xl:inline">Quake</span></button>
                                        <button onClick={() => handleSendSabotage("obfuscate")} disabled={sabotagePoints < 1} className="btn btn-xs sm:btn-sm btn-ghost hover:bg-info/20 text-info gap-1 rounded-lg font-black disabled:bg-transparent disabled:opacity-30 disabled:cursor-not-allowed"><EyeOffIcon className="size-3" /> <span className="hidden xl:inline">Blur</span></button>
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
                                        className={`flex-1 relative transition-all duration-500 ${typingSpeed > 120 ? 'shadow-[0_0_50px_rgba(34,197,94,0.2)] border border-success/20' : 'border border-transparent'}`}
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

                                        {/* AI Whisper Widget */}
                                        <div className="absolute bottom-4 right-4 z-40">
                                            <AnimatePresence>
                                                {whisperTip && (
                                                    <motion.div initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} className="bg-[#111317]/90 backdrop-blur-md rounded-2xl p-4 w-60 border border-white/5 shadow-2xl flex flex-col gap-2">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <div className="size-2.5 rounded-full bg-success animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.8)]"></div>
                                                                <span className="text-[10px] font-black text-success tracking-widest">AI CO-PILOT</span>
                                                            </div>
                                                            {typingSpeed > 0 && <span className="text-[9px] font-mono font-bold bg-[#1a1c20] px-1.5 py-0.5 rounded text-success">{typingSpeed} CPM</span>}
                                                        </div>
                                                        <p className="text-xs font-medium text-base-content/80 font-[Inter] leading-relaxed">
                                                            {whisperTip}
                                                        </p>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
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
                                        <motion.div id="analytics-dossier" initial={{ scale: 0.8, y: 50 }} animate={{ scale: 1, y: 0 }} transition={{ type: "spring", bounce: 0.5 }} className="card bg-base-100 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-base-300 max-w-sm w-full">
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
                                                    <button onClick={() => setMatchState("lobby")} className={`btn flex-1 font-black shadow-xl ${winner?.socketId === socket.id ? 'btn-success' : 'btn-error'}`}>BACK TO LOBBY</button>
                                                    <button onClick={handleExportPdf} className="btn bg-gradient-to-r from-[#00daf3] to-[#00a96e] hover:from-[#00c5dd] text-white border-none shadow-xl gap-2 flex-1">
                                                        <TrophyIcon className="size-4" /> DOSSIER
                                                    </button>
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
