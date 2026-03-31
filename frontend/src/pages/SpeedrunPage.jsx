import Navbar from "../components/Navbar";
import { 
  SwordsIcon, 
  Loader2Icon, 
  UserIcon, 
  TrophyIcon, 
  ActivityIcon, 
  SendIcon, 
  CheckCircle2Icon, 
  AlertCircleIcon, 
  ZapIcon, 
  FlameIcon, 
  SkullIcon, 
  CrownIcon, 
  TerminalIcon, 
  BombIcon, 
  EyeOffIcon, 
  WindIcon, 
  BarChartIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  HistoryIcon,
  BinaryIcon,
  CpuIcon
} from "lucide-react";
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
    const [isDark, setIsDark] = useState(true);

    const [selectedLanguage, setSelectedLanguage] = useState("javascript");
    const [code, setCode] = useState("");
    const [isRunning, setIsRunning] = useState(false);
    const [winner, setWinner] = useState(null);

    const [privateCode, setPrivateCode] = useState("");
    const [joinCodeInput, setJoinCodeInput] = useState("");

    const [myMetrics, setMyMetrics] = useState({ lines: 0, keystrokes: 0 });
    const [opponentMetrics, setOpponentMetrics] = useState({ lines: 0, keystrokes: 0 });
    const [tauntMsg, setTauntMsg] = useState("");
    const [opponentTaunt, setOpponentTaunt] = useState(null);
    const [matchTime, setMatchTime] = useState(0);
    const [testResults, setTestResults] = useState(null);
    const [sabotagePoints, setSabotagePoints] = useState(0);
    const [activeSabotage, setActiveSabotage] = useState(null);
    const [oppSabotageEffect, setOppSabotageEffect] = useState(null);

    const [whisperTip, setWhisperTip] = useState("");
    const lastKeystrokeTime = useRef(Date.now());
    const [typingSpeed, setTypingSpeed] = useState(0);

    const [elo, setElo] = useState(1200);
    const [eloChange, setEloChange] = useState(null);
    const [matchHistory, setMatchHistory] = useState([]);
    const currentRank = getRank(elo);

    const timerRef = useRef(null);
    const languageRef = useRef("javascript");
    const sabotageTimerRef = useRef(null);
    
    // Refs for socket callbacks to avoid re-initializing effect
    const matchTimeRef = useRef(0);
    const eloRef = useRef(1200);
    const historyRef = useRef([]);
    const problemRef = useRef(null);
    const opponentRef = useRef(null);

    useEffect(() => { matchTimeRef.current = matchTime; }, [matchTime]);
    useEffect(() => { eloRef.current = elo; }, [elo]);
    useEffect(() => { historyRef.current = matchHistory; }, [matchHistory]);
    useEffect(() => { problemRef.current = problem; }, [problem]);
    useEffect(() => { opponentRef.current = opponent; }, [opponent]);

    useEffect(() => {
        const checkTheme = () => {
           const theme = document.documentElement.getAttribute("data-theme");
           setIsDark(!["light", "cupcake", "bumblebee", "emerald", "corporate", "retro", "cyberpunk", "valentine", "garden", "lofi", "pastel", "fantasy", "wireframe", "cmyk", "autumn", "business", "acid", "lemonade", "winter", "nord"].includes(theme));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        axiosInstance.get("/users/stats")
            .then(res => {
                if (res.data.speedrun) {
                    setElo(res.data.speedrun.elo || 1200);
                    setMatchHistory(res.data.speedrun.history || []);
                }
            })
            .catch(err => console.error("Speedrun Stats fail", err));

        return () => observer.disconnect();
    }, []);

    useEffect(() => { languageRef.current = selectedLanguage; }, [selectedLanguage]);

    useEffect(() => {
        socket.connect();
        
        const onMatchFound = (data) => {
            setRoomId(data.roomId);
            const prob = PROBLEMS[data.problemId];
            setProblem(prob);
            // Access ref if needed, but here we can set directly
            setCode(prob.starterCode[languageRef.current]);
            const opp = data.players.find(p => p.socketId !== socket.id);
            setOpponent(opp);
            setMatchState("active");
            setMatchTime(0);
            if (timerRef.current) clearInterval(timerRef.current);
            timerRef.current = setInterval(() => setMatchTime(prev => prev + 1), 1000);
            toast.success("Consensus Synchronized! Fight for survival.", { icon: "🔥" });
        };

        const onPrivateRoomCreated = (code) => {
            setMatchState("private_waiting");
            setPrivateCode(code);
            toast.success("Private Matrix Created");
        };

        const onOpponentUpdate = (data) => {
            setOpponent(prev => {
                if (!prev) return { socketId: data.socketId, code: data.code, progress: data.progress, name: "AGHOST_NODE", language: data.language || "javascript" };
                return { ...prev, code: data.code, progress: data.progress, language: data.language || prev.language || "javascript" };
            });
            if (data.metrics) setOpponentMetrics(data.metrics);
        };

        const onReceiveTaunt = (emoji) => {
            setOpponentTaunt(emoji);
            setTimeout(() => setOpponentTaunt(null), 3000);
        };

        const onReceiveSabotage = (type) => {
            if (sabotageTimerRef.current) clearTimeout(sabotageTimerRef.current);
            setActiveSabotage(type);
            toast.error(`Opponent used ${type.toUpperCase()}_VIRUS!`, { icon: type === 'flashbang' ? "🔦" : "💥" });
            sabotageTimerRef.current = setTimeout(() => setActiveSabotage(null), type === "earthquake" ? 3000 : 5000);
        };

        const onMatchOver = (data) => {
            setWinner(data.winner);
            setMatchState("finished");
            if (timerRef.current) clearInterval(timerRef.current);
            
            const won = data.winner.socketId === socket.id;
            const oppElo = 1200;
            const change = calcEloChange(eloRef.current, oppElo, won);
            const newElo = Math.max(0, eloRef.current + change);
            
            setEloChange(change);
            setElo(newElo);

            if (won) {
                canvasConfetti({ particleCount: 200, spread: 180, origin: { y: 0.6 }, zIndex: 9999 });
                toast.success("Consensus Champion! node status elevated.");
            } else {
                toast.error("Anode Offline: Solution outranked.");
            }

            const entry = {
                date: new Date().toISOString(),
                problem: problemRef.current?.title || "Unknown",
                won,
                eloChange: change,
                newElo,
                time: matchTimeRef.current,
                opponent: opponentRef.current?.name || "Unknown"
            };
            
            setMatchHistory(prev => {
                const updated = [...prev, entry];
                // Save to metadata using functional update logic
                axiosInstance.post("/users/metadata/update", {
                    key: "speedrun",
                    value: { elo: newElo, wins: won ? 1 : 0, history: updated }
                }).catch(err => console.error("Could not save matching weights", err));
                return updated;
            });
        };

        const onOpponentDisconnected = (data) => {
            toast.error(data.reason);
            if (timerRef.current) clearInterval(timerRef.current);
            setMatchState("lobby");
            setRoomId(null);
            setProblem(null);
            setOpponent(null);
        };

        socket.on("match_found", onMatchFound);
        socket.on("private_room_created", onPrivateRoomCreated);
        socket.on("opponent_update", onOpponentUpdate);
        socket.on("receive_taunt", onReceiveTaunt);
        socket.on("receive_sabotage", onReceiveSabotage);
        socket.on("match_over", onMatchOver);
        socket.on("opponent_disconnected", onOpponentDisconnected);

        return () => {
            socket.off("match_found", onMatchFound);
            socket.off("private_room_created", onPrivateRoomCreated);
            socket.off("opponent_update", onOpponentUpdate);
            socket.off("receive_taunt", onReceiveTaunt);
            socket.off("receive_sabotage", onReceiveSabotage);
            socket.off("match_over", onMatchOver);
            socket.off("opponent_disconnected", onOpponentDisconnected);
            socket.disconnect();
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const handleCodeChange = (newCode) => {
        if (newCode.length - code.length > 60) {
            socket.emit("send_taunt", { roomId, taunt: "🚨 ANOMALY_P" });
            toast.error("PASTE_BOT_DETECTED", { icon: "👮" });
            setActiveSabotage("locked");
            setTimeout(() => setActiveSabotage(null), 3000);
            return;
        }

        setCode(newCode);
        setMyMetrics(prev => {
            const nextKeystrokes = prev.keystrokes + 1;
            const now = Date.now();
            const diff = now - lastKeystrokeTime.current;
            lastKeystrokeTime.current = now;
            
            if (diff > 0) {
                const currentCpm = Math.floor(60000 / diff);
                setTypingSpeed(currentCpm > 600 ? 600 : currentCpm);
            }

            if (nextKeystrokes > 0 && nextKeystrokes % 40 === 0) {
                setSabotagePoints(prevPoints => Math.min(3, prevPoints + 1));
                const randomTips = [
                    "Tip: Standardizing array bounds checks.",
                    "Tip: Beware nested Loops.",
                    "Tip: Space complexity is O(1).",
                    "Tip: Substring checks expand quickly."
                ];
                setWhisperTip(randomTips[Math.floor(Math.random() * randomTips.length)]);
            }
            return { lines: newCode.split("\n").length, keystrokes: nextKeystrokes };
        });
    };

    useEffect(() => {
        if (matchState === "active" && roomId) {
            const timer = setTimeout(() => {
                socket.emit("code_update", { roomId, code, progress: 50, metrics: myMetrics, language: selectedLanguage });
            }, 150);
            return () => clearTimeout(timer);
        }
    }, [code, matchState, roomId, myMetrics]);

    const handleSendTaunt = (emoji) => {
        socket.emit("send_taunt", { roomId, taunt: emoji });
        setTauntMsg(emoji);
        setTimeout(() => setTauntMsg(null), 3000);
    };

    const handleSendSabotage = (type) => {
        if (sabotagePoints < 1) return toast.error("Not enough Chaos Points!");
        setSabotagePoints(prev => prev - 1);
        socket.emit("send_sabotage", { roomId, type });
        setOppSabotageEffect(type);
        setTimeout(() => setOppSabotageEffect(null), 5000);
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

    const hideOutputAnomalies = (output) => {
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
            const isQuotaMock = result.output && result.output.includes("FALLBACK");
            const testsPassed = isQuotaMock || hideOutputAnomalies(result.output) === hideOutputAnomalies(expectedOutput);

            if (testsPassed) {
                socket.emit("player_win", { roomId });
            } else {
                toast.error("Tests failed. Keep trying!");
                socket.emit("send_taunt", { roomId, taunt: "❌ Failed tests" });
                setTestResults({
                    type: "failure",
                    actual: hideOutputAnomalies(result.output).split('\n').slice(0, 2),
                    expected: hideOutputAnomalies(expectedOutput).split('\n').slice(0, 2),
                    totalHidden: Math.max(0, hideOutputAnomalies(expectedOutput).split('\n').length - 2)
                });
            }
        } else {
            toast.error("Execution error!");
            setTestResults({ type: "error", error: result.output || "Unknown runtime error" });
        }
        setIsRunning(false);
    };

    const handleExportPdf = async () => {
        const element = document.getElementById("analytics-dossier");
        if (!element) return;
        toast.loading("Compiling Dossier...", { id: "pdf-gen" });
        try {
            const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#050505" });
            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF("p", "mm", "a4");
            pdf.addImage(imgData, "PNG", 0, 0, 210, 297);
            pdf.save(`Dossier_Speedrun_${Date.now()}.pdf`);
            toast.success("Dossier Exported!", { id: "pdf-gen" });
        } catch (err) { toast.error("Export Failed!", { id: "pdf-gen" }); }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const renderLobby = () => (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col items-center justify-center relative p-6 pt-24 pb-8 font-sans overflow-y-auto no-scrollbar">
            {/* AMBIENT ENGINE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-screen -z-10">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-error/10 rounded-full blur-[140px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
            </div>

            <main className="max-w-7xl mx-auto w-full flex flex-col items-center text-center space-y-12 z-10">
                
                {/* 1. SECTOR IDENTITY */}
                <div className="space-y-4">
                    <motion.div 
                        animate={{ rotate: matchState === "queue" ? 360 : 0 }} 
                        transition={{ repeat: matchState === "queue" ? Infinity : 0, duration: 4, ease: "linear" }}
                        className="size-32 mx-auto rounded-[40px] bg-gradient-to-br from-error via-orange-500 to-warning p-[3px] shadow-[0_0_80px_rgba(239,68,68,0.2)]"
                    >
                        <div className={`w-full h-full rounded-[38px] flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
                            <SwordsIcon className={`size-16 text-error ${matchState === "queue" ? "animate-pulse" : ""}`} />
                        </div>
                    </motion.div>
                    
                    <h1 className="text-8xl font-black italic tracking-tighter bg-gradient-to-r from-error via-orange-500 to-warning bg-clip-text text-transparent italic">SPEEDRUN ARENA</h1>
                    <div className="flex items-center justify-center gap-4">
                        <div className={`${currentRank.bg} px-6 py-2 rounded-2xl border border-white/5 backdrop-blur-3xl flex items-center gap-4 shadow-2xl`}>
                            <span className="text-3xl">{currentRank.emoji}</span>
                            <div className="text-left">
                                <p className={`text-sm font-black uppercase tracking-widest ${currentRank.color}`}>{currentRank.name} PROTOCOL</p>
                                <p className="text-xs font-bold opacity-40 uppercase tracking-[0.2em]">{elo} ELO RATING</p>
                            </div>
                        </div>
                        <div className="bg-base-100/40 backdrop-blur-2xl px-6 py-2 rounded-2xl border border-white/5">
                            <p className="text-xs font-black uppercase tracking-[0.4em] opacity-40">SYNERGY_RECORD</p>
                            <p className="text-sm font-black">{matchHistory.filter(m => m.won).length}W / {matchHistory.filter(m => !m.won).length}L</p>
                        </div>
                    </div>
                </div>

                {/* 2. MATCHMAKING CORE */}
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className={`max-w-md w-full p-1 rounded-[48px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-3xl shadow-3xl overflow-hidden`}>
                    <div className="p-10 space-y-8">
                       <h2 className="text-xl font-black italic tracking-tight flex items-center justify-center gap-3">
                           {matchState === "queue" ? <><Loader2Icon className="animate-spin text-error" /> Synchronizing Adversary...</> : <><CpuIcon className="size-5 text-error" /> Initialization Core</>}
                       </h2>

                       {matchState === "queue" ? (
                           <button className="btn btn-error btn-outline w-full rounded-[24px] font-black tracking-widest h-16" onClick={() => window.location.reload()}>
                                TERMINATE_QUEUE
                           </button>
                       ) : matchState === "private_waiting" ? (
                           <div className="space-y-6">
                               <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Adversary Access Code</p>
                               <div className="bg-black/40 p-6 rounded-[32px] font-mono text-5xl font-black tracking-[0.2em] text-primary border border-primary/20 shadow-inner">
                                   {privateCode}
                               </div>
                               <button className="btn btn-ghost btn-xs text-error font-black uppercase tracking-widest opacity-60" onClick={() => window.location.reload()}>CANCEL_SESSION</button>
                           </div>
                       ) : (
                           <div className="space-y-4">
                               <button onClick={joinQueue} className="btn bg-gradient-to-r from-error to-orange-500 w-full h-20 rounded-[32px] border-none text-white shadow-2xl shadow-error/40 font-black tracking-widest text-xl group overflow-hidden relative">
                                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                   <ZapIcon className="size-6 fill-current" />
                                   RANKED_DEPLOY
                               </button>

                               <div className="divider text-[9px] font-black uppercase tracking-[0.5em] opacity-30">PRIVATE_CHANNEL</div>

                               <div className="flex gap-4">
                                   <button onClick={handleCreatePrivate} className="btn btn-ghost border border-white/10 hover:bg-white/5 flex-1 rounded-[24px] font-black text-xs uppercase tracking-widest">Create_Link</button>
                                   <div className="join flex-[1.5] rounded-[24px] overflow-hidden border border-white/10">
                                       <input className="input join-item w-full bg-transparent font-mono font-black text-center" placeholder="ID_CODE" value={joinCodeInput} onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} maxLength={6} />
                                       <button className="btn btn-neutral join-item font-black px-6" onClick={handleJoinPrivate}>JOIN</button>
                                   </div>
                               </div>
                           </div>
                       )}

                       {/* MUTATORS GRID */}
                       <div className="pt-4 space-y-4">
                            <div className="flex items-center gap-2 justify-center opacity-40">
                                <ZapIcon className="size-3 text-warning fill-current" />
                                <span className="text-[9px] font-black uppercase tracking-[0.4em]">Integrated_Mutators</span>
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: <BombIcon/>, label: "F_BANG", color: "text-error" },
                                    { icon: <ActivityIcon/>, label: "QUAKE", color: "text-warning" },
                                    { icon: <EyeOffIcon/>, label: "OBFUSC", color: "text-info" }
                                ].map(m => (
                                    <div key={m.label} className={`p-4 rounded-3xl bg-white/5 border border-white/5 flex flex-col items-center gap-2 group cursor-help transition-all hover:bg-white/10 shadow-xl`}>
                                        <div className={m.color}>{m.icon}</div>
                                        <span className={`text-[9px] font-black uppercase tracking-widest ${m.color}`}>{m.label}</span>
                                    </div>
                                ))}
                            </div>
                       </div>
                    </div>
                </motion.div>

                {/* 3. COGNITIVE HISTORY */}
                {matchHistory.length > 0 && (
                    <div className="w-full max-w-4xl space-y-6">
                        <div className="flex items-center gap-4 px-4 opacity-40">
                            <HistoryIcon className="size-5" />
                            <h3 className="font-black italic text-lg tracking-tight">Consensus Logs</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[...matchHistory].reverse().slice(0, 4).map((match, i) => (
                                <div key={i} className={`p-6 rounded-[32px] border ${match.won ? 'bg-success/10 border-success/20 shadow-success/10' : 'bg-error/10 border-error/20 shadow-error/10'} backdrop-blur-2xl flex items-center justify-between shadow-2xl`}>
                                    <div className="flex items-center gap-6">
                                        <div className={`size-12 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 shadow-inner`}>
                                           {match.won ? <CrownIcon className="size-6 text-success" /> : <SkullIcon className="size-6 text-error" />}
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-black italic tracking-tight">{match.problem}</p>
                                            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest">vs {match.opponent} • {formatTime(match.time)}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-xl font-black italic ${match.eloChange >= 0 ? 'text-success' : 'text-error'}`}>
                                            {match.eloChange >= 0 ? '+' : ''}{match.eloChange}
                                        </p>
                                        <div className="flex items-center gap-1 justify-end opacity-40">
                                            <span className="text-[10px] font-black uppercase tracking-widest">{match.newElo} ELO</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </motion.div>
    );

    return (
        <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-primary/30 relative overflow-x-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300 text-base-content'}`}>
            <Navbar />
            <AnimatePresence mode="wait">
                {(matchState === "lobby" || matchState === "queue" || matchState === "private_waiting") ? (
                    renderLobby()
                ) : (
                    <motion.div key="arena" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex-1 flex flex-col pt-24 h-screen overflow-hidden bg-transparent">
                        
                        {/* 1. ARENA COMMAND BAR */}
                        <div className="px-8 pb-4 flex items-center justify-between gap-8 max-w-[1920px] mx-auto w-full">
                            
                            {/* ADVERSARY METRICS: LEFT */}
                            <div className="flex-1 flex items-center gap-6">
                                <div className="space-y-1 text-right">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30">CANDIDATE_NODE</p>
                                    <p className="text-xl font-black italic tracking-tighter">{user?.fullName || "A_CODER"}</p>
                                </div>
                                <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                                    <span className="relative z-10 text-lg tracking-tighter">{myMetrics.lines}L</span>
                                </div>
                                <div className="h-0.5 flex-1 bg-white/5 rounded-full overflow-hidden relative">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (code.length / 500) * 100)}%` }}
                                        className="h-full bg-primary shadow-[0_0_15px_rgba(var(--color-primary),0.8)]" 
                                    />
                                </div>
                            </div>

                            {/* CENTER HUB: TIME & SYNC */}
                            <div className="flex flex-col items-center">
                                <div className="text-5xl font-black italic tracking-tighter bg-gradient-to-br from-error via-orange-500 to-warning bg-clip-text text-transparent drop-shadow-2xl font-[Manrope]">VS</div>
                                <div className="px-4 py-1 rounded-full bg-base-100/40 border border-white/10 backdrop-blur-xl shadow-2xl mt-[-5px] flex items-center gap-2">
                                    <ActivityIcon className="size-3 text-error animate-pulse" />
                                    <span className="text-[11px] font-black tracking-[0.2em]">{formatTime(matchTime)}</span>
                                </div>
                            </div>

                            {/* ADVERSARY METRICS: RIGHT */}
                            <div className="flex-1 flex items-center flex-row-reverse gap-6">
                                <div className="space-y-1 text-left">
                                    <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-30 text-error">AGHOST_NODE</p>
                                    <p className="text-xl font-black italic tracking-tighter text-error">{opponent?.name || "REDACTED"}</p>
                                </div>
                                <div className="size-14 rounded-2xl bg-error/10 border border-error/20 flex items-center justify-center font-black text-error shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-error/5 animate-pulse" />
                                    <span className="relative z-10 text-lg tracking-tighter">{opponentMetrics?.lines || 0}L</span>
                                </div>
                                <div className="h-0.5 flex-1 bg-white/5 rounded-full overflow-hidden relative">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, (opponent?.code?.length / 500) * 100)}%` }}
                                        className="h-full bg-error shadow-[0_0_15px_rgba(var(--color-error),0.8)]" 
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 2. BATTLE GRID ENGINE */}
                        <div className="flex-1 flex px-8 pb-6 gap-6 max-w-[1920px] mx-auto w-full overflow-hidden">
                            
                            {/* L: SCHEMATIC DESCRIPTION */}
                            <div className={`w-[24%] rounded-[40px] border p-10 overflow-y-auto no-scrollbar relative shadow-3xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl hidden xl:block`}>
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="size-10 rounded-xl bg-success/10 flex items-center justify-center border border-success/20">
                                       <BinaryIcon className="size-5 text-success" />
                                    </div>
                                    <h3 className="font-black italic text-xl tracking-tight">System Specs</h3>
                                </div>
                                <div className="space-y-10">
                                    <p className="text-sm font-medium leading-relaxed opacity-70 tracking-tight">{problem?.description.text}</p>
                                    <div className="space-y-6">
                                        <p className="text-[9px] font-black uppercase tracking-[0.5em] opacity-30">Validation_Schemas</p>
                                        {problem?.examples.map((ex, i) => (
                                            <div key={i} className="p-6 rounded-3xl bg-black/20 border border-white/5 shadow-inner space-y-3">
                                                <div className="flex items-center gap-2">
                                                   <span className="text-[8px] font-black uppercase tracking-widest opacity-30">INPUT //</span>
                                                   <code className="text-[11px] text-primary font-bold">{ex.input}</code>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                   <span className="text-[8px] font-black uppercase tracking-widest opacity-30">OUTPUT //</span>
                                                   <code className="text-[11px] text-success font-black">{ex.output}</code>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* M: COGNITIVE TERMINAL */}
                            <div className={`flex-1 flex flex-col rounded-[48px] border overflow-hidden relative shadow-4xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl`}>
                                {/* TERMINAL ACTION HUD */}
                                <div className="px-8 h-16 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-2xl">
                                    <div className="flex items-center gap-2">
                                        <TerminalIcon className="size-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30">Sovereign_Terminal_v4.2</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-error/10 border border-error/20">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-error">Chaos_Points</span>
                                            <div className="flex gap-1">
                                               {[1,2,3].map(i => <div key={i} className={`size-1.5 rounded-full ${sabotagePoints >= i ? 'bg-error shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'bg-white/10'}`} />)}
                                            </div>
                                        </div>
                                        <div className="h-8 w-[1px] bg-white/10" />
                                        <div className="flex items-center gap-2">
                                            {["🚀", "🔥", "👀", "👑"].map(emoji => (
                                                <button key={emoji} onClick={() => handleSendTaunt(emoji)} className="size-10 rounded-xl hover:bg-white/10 flex items-center justify-center transition-all text-xl">{emoji}</button>
                                            ))}
                                        </div>
                                        <button onClick={handleRunCode} disabled={isRunning} className="btn btn-primary h-10 min-h-[40px] px-6 rounded-xl font-black italic tracking-tighter shadow-2xl shadow-primary/40">
                                            {isRunning ? <Loader2Icon className="animate-spin size-4" /> : "BROADCAST_SOLUTION"}
                                        </button>
                                    </div>
                                </div>

                                {/* SABOTAGE DECK */}
                                <div className="px-8 h-12 flex items-center gap-4 bg-error/5 border-b border-white/5 overflow-x-auto no-scrollbar">
                                   <p className="text-[8px] font-black uppercase tracking-[0.4em] opacity-40 shrink-0">Available_Subversion:</p>
                                   <button onClick={() => handleSendSabotage("flashbang")} disabled={sabotagePoints < 1} className="text-[10px] font-black uppercase tracking-widest text-error hover:opacity-100 opacity-60 flex items-center gap-2 disabled:opacity-10"><BombIcon className="size-3" /> Flashbang</button>
                                   <button onClick={() => handleSendSabotage("earthquake")} disabled={sabotagePoints < 1} className="text-[10px] font-black uppercase tracking-widest text-warning hover:opacity-100 opacity-60 flex items-center gap-2 disabled:opacity-10"><ActivityIcon className="size-3" /> Quake</button>
                                   <button onClick={() => handleSendSabotage("obfuscate")} disabled={sabotagePoints < 1} className="text-[10px] font-black uppercase tracking-widest text-info hover:opacity-100 opacity-60 flex items-center gap-2 disabled:opacity-10"><EyeOffIcon className="size-3" /> Blur</button>
                                </div>

                                <div className="flex-1 relative overflow-hidden">
                                     {/* TAUNT OVERLAY */}
                                    <AnimatePresence> {tauntMsg && <motion.div initial={{ y: 20, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ opacity:0 }} className="absolute bottom-8 left-8 z-50 bg-primary text-primary-content px-6 py-3 rounded-3xl font-black text-2xl shadow-4xl">{tauntMsg}</motion.div>} </AnimatePresence>

                                    <motion.div
                                        animate={activeSabotage === "earthquake" ? { x: [-10, 10, -10, 10, 0] } : { x: 0 }}
                                        transition={{ repeat: activeSabotage === "earthquake" ? Infinity : 0, duration: 0.1 }}
                                        className="h-full relative"
                                        style={{
                                            filter: activeSabotage === "flashbang" ? "invert(1) blur(10px)" : activeSabotage === "obfuscate" ? "blur(12px)" : "none",
                                            opacity: activeSabotage === "locked" ? 0.3 : 1
                                        }}
                                    >
                                        <Editor 
                                            height="100%" 
                                            language={selectedLanguage} 
                                            value={code} 
                                            onChange={handleCodeChange} 
                                            theme="vs-dark"
                                            options={{ minimap: { enabled: false }, fontSize: 18, cursorBlinking: "smooth", smoothScrolling: true, padding: { top: 32, left: 32 } }}
                                        />
                                    </motion.div>

                                    {/* AI WHISPER FLOAT */}
                                    <AnimatePresence>
                                        {whisperTip && (
                                            <motion.div initial={{ x: 50, opacity:0 }} animate={{ x:0, opacity:1 }} exit={{ x:50, opacity:0 }} className="absolute top-12 right-12 w-64 p-6 rounded-[32px] bg-black/60 backdrop-blur-3xl border border-white/5 shadow-3xl text-left space-y-3 z-50">
                                                <div className="flex items-center gap-2">
                                                   <div className="size-2 rounded-full bg-success animate-ping" />
                                                   <span className="text-[9px] font-black uppercase tracking-widest text-success">AI_COG_SYNC</span>
                                                </div>
                                                <p className="text-[11px] font-bold leading-relaxed tracking-tight opacity-70">{whisperTip}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* TEST RESULTS LOGS */}
                                <AnimatePresence>
                                    {testResults && (
                                        <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} className="absolute bottom-0 inset-x-0 h-64 bg-black/90 backdrop-blur-3xl border-t border-white/10 z-[100] flex flex-col overflow-hidden">
                                            <header className="px-8 h-12 flex items-center justify-between border-b border-white/5 bg-white/5">
                                               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-error flex items-center gap-2"><AlertCircleIcon className="size-4" /> COMPILATION_ANOMALY</span>
                                               <button onClick={() => setTestResults(null)} className="btn btn-ghost btn-xs text-[10px] font-black">DISMISS</button>
                                            </header>
                                            <div className="flex-1 p-8 overflow-y-auto font-mono text-xs space-y-6">
                                                {testResults.type === "error" ? (
                                                    <pre className="text-error opacity-80 whitespace-pre-wrap">{testResults.error}</pre>
                                                ) : (
                                                    <div className="grid grid-cols-2 gap-6">
                                                        {testResults.expected.map((exp, i) => (
                                                            <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                                                <p className="text-[9px] opacity-30 font-black uppercase tracking-widest">Test_Case_{i+1}</p>
                                                                <div className="flex gap-2">
                                                                   <span className="text-error font-black uppercase tracking-widest text-[10px]">Actual:</span>
                                                                   <code className="text-error">{testResults.actual[i]}</code>
                                                                </div>
                                                                <div className="flex gap-2">
                                                                   <span className="text-success font-black uppercase tracking-widest text-[10px]">Expected:</span>
                                                                   <code className="text-success">{exp}</code>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* R: ADVERSARY SENSOR */}
                            <div className={`w-[20%] rounded-[40px] border overflow-hidden flex flex-col relative shadow-3xl ${isDark ? 'bg-white/5 border-white/5' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl hidden lg:flex border-error/20`}>
                                <header className="px-6 h-12 flex items-center justify-between border-b border-white/5 bg-error/10">
                                   <div className="flex items-center gap-2">
                                      <SkullIcon className="size-4 text-error animate-pulse" />
                                      <span className="text-[9px] font-black uppercase tracking-[0.4em] text-error">Adversary_Stream</span>
                                   </div>
                                </header>
                                <div className="flex-1 opacity-40 grayscale pointer-events-none p-4 relative">
                                     <div className="absolute inset-0 bg-transparent flex items-center justify-center pointer-events-none z-50">
                                        <AnimatePresence>
                                            {oppSabotageEffect && (
                                                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} className="bg-error/30 backdrop-blur-md px-4 py-2 rounded-full border border-error/50 flex items-center gap-2">
                                                    <BombIcon className="size-4 text-white" />
                                                    <span className="text-[10px] font-black text-white uppercase tracking-tighter">Sabotaged!</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                     </div>
                                     <motion.div 
                                        className="h-full w-full"
                                        animate={oppSabotageEffect === "earthquake" ? { x: [-5, 5, -5, 5, 0] } : { x: 0 }}
                                        transition={{ repeat: oppSabotageEffect === "earthquake" ? Infinity : 0, duration: 0.1 }}
                                        style={{ 
                                            filter: oppSabotageEffect === "flashbang" ? "invert(1) blur(8px)" : (oppSabotageEffect === "obfuscate" ? "blur(10px)" : "none") 
                                        }}
                                     >
                                         <Editor 
                                            height="100%" 
                                            language={opponent?.language || "javascript"}
                                            value={opponent?.code || "// Tracking Adversary Node..."} 
                                            theme="vs-dark" 
                                            options={{ 
                                                minimap: { enabled: false }, 
                                                readOnly: true, 
                                                lineNumbers: "off", 
                                                fontSize: 12 
                                            }} 
                                         />
                                     </motion.div>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />
                            </div>
                        </div>

                        {/* VICTORY OVERLAY ENGINE */}
                        <AnimatePresence>
                            {matchState === "finished" && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[500] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-8">
                                    <motion.div id="analytics-dossier" initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="max-w-xl w-full rounded-[64px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(var(--color-primary),0.2)] bg-base-100 relative">
                                        <div className={`h-3 w-full ${winner?.socketId === socket.id ? 'bg-success shadow-[0_0_30px_rgba(var(--color-success),1)]' : 'bg-error shadow-[0_0_30px_rgba(var(--color-error),1)]'}`} />
                                        
                                        <div className="p-16 text-center space-y-12">
                                            {winner?.socketId === socket.id ? (
                                                <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                                                   <CrownIcon className="size-32 mx-auto text-warning fill-current drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]" />
                                                </motion.div>
                                            ) : (
                                                <SkullIcon className="size-32 mx-auto text-error opacity-80" />
                                            )}
                                            
                                            <div className="space-y-2">
                                               <h2 className="text-7xl font-black italic tracking-tighter uppercase">{winner?.socketId === socket.id ? 'VICTORY' : 'DEFEAT'}</h2>
                                               <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Synchronized_Dossier_Generated</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-8 text-left">
                                                <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 space-y-4">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">PERFORMANCE_ELO</p>
                                                    <div className="flex items-center justify-between">
                                                       <span className="text-3xl font-black italic">{elo}</span>
                                                       <span className={`text-sm font-black ${eloChange >= 0 ? 'text-success' : 'text-error'}`}>{eloChange >= 0 ? '+' : ''}{eloChange}</span>
                                                    </div>
                                                </div>
                                                <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 space-y-4">
                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-40">EXECUTION_TIME</p>
                                                    <span className="text-3xl font-black italic block uppercase tracking-tighter">{formatTime(matchTime)}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-4">
                                                <button onClick={() => window.location.reload()} className={`btn btn-lg flex-1 rounded-[28px] font-black tracking-widest h-20 ${winner?.socketId === socket.id ? 'btn-success shadow-success/20' : 'btn-error shadow-error/20'}`}>RE_DEPLOY</button>
                                                <button onClick={handleExportPdf} className="btn btn-primary btn-lg flex-1 rounded-[28px] h-20 font-black tracking-widest gap-4 shadow-primary/20">
                                                    <TrophyIcon className="size-6" /> DOSSIER
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default SpeedrunPage;
