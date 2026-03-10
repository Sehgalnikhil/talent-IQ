import Navbar from "../components/Navbar";
import { SwordsIcon, Loader2Icon, UserIcon, TrophyIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { useUser } from "@clerk/clerk-react";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import toast from "react-hot-toast";
import canvasConfetti from "canvas-confetti";
import Editor from "@monaco-editor/react";

// Connect to the Socket.IO server securely using environment variables
const SOCKET_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:3000';
const socket = io(SOCKET_URL, {
    withCredentials: true,
    autoConnect: false // We will connect manually
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

    useEffect(() => {
        // Only connect when visiting this page
        socket.connect();

        socket.on("connect", () => console.log("Connected to Speedrun server"));

        socket.on("match_found", (data) => {
            console.log("Match found!", data);
            setRoomId(data.roomId);
            const prob = PROBLEMS[data.problemId];
            setProblem(prob);
            setCode(prob.starterCode[selectedLanguage]);

            const opp = data.players.find(p => p.socketId !== socket.id);
            setOpponent(opp);
            setMatchState("active");
            toast.success("Match found! Provide your solution!");
        });

        socket.on("opponent_update", (data) => {
            setOpponent(prev => prev ? { ...prev, code: data.code, progress: data.progress } : null);
        });

        socket.on("match_over", (data) => {
            setWinner(data.winner);
            setMatchState("finished");
            if (data.winner.socketId === socket.id) {
                canvasConfetti({ particleCount: 150, spread: 180, origin: { y: 0.6 } });
                toast.success("You won the match! 🎉");
            } else {
                toast.error("You lost! the opponent solved it first.");
            }
        });

        socket.on("opponent_disconnected", (data) => {
            toast.error(data.reason);
            setMatchState("lobby");
            setRoomId(null);
            setProblem(null);
            setOpponent(null);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Sync our code with server periodically
    useEffect(() => {
        if (matchState === "active" && roomId) {
            const timer = setTimeout(() => {
                socket.emit("code_update", { roomId, code, progress: 50 });
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [code, matchState, roomId]);

    const joinQueue = () => {
        if (!user) return toast.error("Please sign in first!");
        setMatchState("queue");
        socket.emit("join_matchmaking", {
            userId: user.id,
            name: user.fullName || user.username || "Anonymous Coder"
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
        const result = await executeCode(selectedLanguage, code);

        if (result.success) {
            const expectedOutput = problem.expectedOutput[selectedLanguage];
            const testsPassed = normalizeOutput(result.output) === normalizeOutput(expectedOutput);

            if (testsPassed) {
                socket.emit("player_win", { roomId });
            } else {
                toast.error("Tests failed. Keep trying!");
            }
        } else {
            toast.error("Execution error!");
        }
        setIsRunning(false);
    };

    if (matchState === "active" || matchState === "finished") {
        return (
            <div className="h-screen bg-base-300 flex flex-col">
                <Navbar />
                {/* Header */}
                <div className="flex items-center justify-between p-4 bg-base-100 border-b border-base-300 shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <div className="badge badge-error gap-2 font-bold p-3">
                            <SwordsIcon className="size-4 animate-pulse" /> LIVE BATTLE
                        </div>
                        <h2 className="text-xl font-bold">{problem?.title}</h2>
                    </div>
                    <div className="flex items-center gap-6">
                        {/* My Status */}
                        <div className="flex flex-col items-end">
                            <span className="text-xs font-bold text-success uppercase">You</span>
                            <span className="text-sm font-semibold">{user?.fullName || "You"}</span>
                        </div>
                        <div className="text-2xl font-black text-base-content/30 italic">VS</div>
                        {/* Opponent Status */}
                        <div className="flex flex-col items-start bg-error/10 px-3 py-1 rounded-lg border border-error/20">
                            <span className="text-xs font-bold text-error uppercase">Opponent</span>
                            <span className="text-sm font-semibold flex flex-col items-start">
                                {opponent?.name || "Searching..."}
                                {opponent?.code?.length > 0 && <span className="text-[10px] text-error/80 animate-pulse">typing...</span>}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Code execution area */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Problem panel */}
                    <div className="w-1/3 border-r border-base-300 bg-base-200 overflow-auto p-6 hidden lg:block">
                        <h3 className="text-2xl font-bold mb-4">{problem?.title}</h3>
                        <div className="prose prose-sm">
                            <p className="text-base-content/80 text-lg leading-relaxed">{problem?.description.text}</p>

                            <h4 className="font-bold mt-6 mb-2 uppercase text-xs opacity-50">Example Input / Output</h4>
                            {problem?.examples.map((ex, i) => (
                                <div key={i} className="bg-base-300 p-3 rounded mb-2 font-mono text-sm">
                                    <div><strong className="text-primary">In:</strong> {ex.input}</div>
                                    <div><strong className="text-secondary">Out:</strong> {ex.output}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Editor Panel */}
                    <div className="flex-1 flex flex-col relative">
                        {matchState === "finished" && (
                            <div className="absolute inset-0 z-50 bg-base-300/80 backdrop-blur-md flex items-center justify-center">
                                <div className="card bg-base-100 shadow-2xl p-8 text-center max-w-sm w-full border border-base-300">
                                    <TrophyIcon className={`size-16 mx-auto mb-4 ${winner?.socketId === socket.id ? 'text-success' : 'text-error'}`} />
                                    <h2 className="text-3xl font-black mb-2">{winner?.socketId === socket.id ? 'VICTORY!' : 'DEFEAT'}</h2>
                                    <p className="text-base-content/70 mb-6 font-semibold">
                                        {winner?.socketId === socket.id ? 'You solved it first!' : `${winner?.name} beat you to it.`}
                                    </p>
                                    <button onClick={() => setMatchState("lobby")} className="btn btn-primary w-full">Play Again</button>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-between items-center p-2 bg-base-200 border-b border-base-300">
                            <select className="select select-sm max-w-xs" value={selectedLanguage} onChange={(e) => {
                                setSelectedLanguage(e.target.value);
                                setCode(problem?.starterCode[e.target.value]);
                            }}>
                                <option value="javascript">JavaScript</option>
                                <option value="python">Python</option>
                                <option value="java">Java</option>
                            </select>

                            <button className="btn btn-success btn-sm gap-2 w-32" onClick={handleRunCode} disabled={isRunning || matchState === "finished"}>
                                {isRunning ? <Loader2Icon className="animate-spin size-4" /> : "Submit"}
                            </button>
                        </div>

                        <div className="flex-1">
                            <Editor
                                height="100%"
                                language={selectedLanguage === "python" ? "python" : selectedLanguage === "java" ? "java" : "javascript"}
                                value={code}
                                onChange={setCode}
                                theme="vs-dark"
                                options={{ minimap: { enabled: false }, fontSize: 16 }}
                            />
                        </div>
                    </div>

                    {/* Opponent's Shadow Editor (Readonly) */}
                    <div className="w-1/3 border-l border-error/20 flex flex-col hidden xl:flex absolute right-0 top-0 bottom-0 pointer-events-none opacity-40 hover:opacity-100 transition-opacity bg-base-300 z-20 translate-x-[95%] hover:translate-x-0">
                        <div className="bg-error/10 p-2 text-center text-xs font-bold text-error uppercase border-b border-error/20 flex items-center justify-center gap-2">
                            <UserIcon className="size-4" /> Opponent's Screen
                        </div>
                        <div className="flex-1 pointer-events-none">
                            <Editor
                                height="100%"
                                language="javascript"
                                value={opponent?.code || "// Waiting for opponent to type..."}
                                theme="vs-dark"
                                options={{ minimap: { enabled: false }, readOnly: true, domReadOnly: true, lineNumbers: "off" }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // LOBBY UI
    return (
        <div className="min-h-screen bg-base-300 flex flex-col">
            <Navbar />

            <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                <div className="size-24 bg-error/10 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-error/10">
                    <SwordsIcon className={`size-12 text-error ${matchState === "queue" ? "animate-spin" : ""}`} />
                </div>

                <h1 className="text-5xl font-black bg-gradient-to-r from-error to-warning bg-clip-text text-transparent mb-4">
                    Speedrun Versus Mode
                </h1>

                <p className="max-w-xl text-lg text-base-content/70 mb-8">
                    Challenge other coders to a real-time battle. You will be matched with a random opponent, and race to solve a LeetCode problem first!
                </p>

                <div className="card bg-base-100 shadow-2xl border border-error/20 p-8 max-w-sm w-full">
                    <h2 className="text-xl font-bold mb-4">{matchState === "queue" ? "Searching for Opponent..." : "Ranked Matchmaking"}</h2>

                    {matchState === "queue" ? (
                        <button className="btn btn-error btn-outline w-full gap-2 text-lg animate-pulse">
                            <Loader2Icon className="size-5 animate-spin" /> In Queue...
                        </button>
                    ) : (
                        <button onClick={joinQueue} className="btn btn-error w-full gap-2 text-lg">
                            <SwordsIcon className="size-5" />
                            Find Match
                        </button>
                    )}

                    <div className="divider text-xs text-base-content/50">MATCH STATS</div>

                    <div className="flex justify-around text-base-content/60 font-semibold text-sm">
                        <div className="flex flex-col items-center"><span className="text-error text-xl font-black">2</span><span>Online</span></div>
                        <div className="flex flex-col items-center"><span className="text-warning text-xl font-black">12.5k</span><span>Matches</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SpeedrunPage;
