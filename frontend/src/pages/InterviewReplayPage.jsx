import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";

import { useParams, useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Navbar from "../components/Navbar";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Play, Pause, FastForward, Rewind, 
    Bot, Code2, MessageSquare, Activity, 
    ChevronLeft, Download, Share2, Sparkles,
    Timer, Target, Zap
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Canvas } from "@react-three/fiber";
import jsPDF from "jspdf";




const InterviewReplayPage = () => {
    const { user } = useUser();
    const { sessionId } = useParams();

    const navigate = useNavigate();
    
    // Player State
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);
    const [activeTab, setActiveTab] = useState("chat"); // chat, code, metrics
    const [currentSnapshot, setCurrentSnapshot] = useState(null);
    const [currentChatIndex, setCurrentChatIndex] = useState(-1);
    const [isDark, setIsDark] = useState(true);

    useEffect(() => {
        const checkTheme = () => {
            const theme = localStorage.getItem("talentiq-theme") || "dark";
            setIsDark(!["light", "cupcake", "bumblebee", "emerald", "corporate", "retro", "cyberpunk", "valentine", "garden", "lofi", "pastel", "fantasy", "wireframe", "cmyk", "autumn", "business", "acid", "lemonade", "winter", "nord"].includes(theme));
        };
        checkTheme();
        window.addEventListener("storage", checkTheme);
        const interval = setInterval(checkTheme, 1000);
        return () => {
            window.removeEventListener("storage", checkTheme);
            clearInterval(interval);
        };
    }, []);


    const { data: session, isLoading, refetch } = useQuery({
        queryKey: ['interview-session', sessionId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/interview/session/${sessionId}`);
            return res.data;
        }
    });

    const toggleMutation = useMutation({
        mutationFn: () => axiosInstance.post(`/interview/session/${sessionId}/toggle-public`),
        onSuccess: () => {
            refetch();
            toast.success("Dossier Visibility Synchronized.");
        }
    });

    const copyDossierLink = () => {
        const url = `${window.location.origin}/dossier/${sessionId}`;
        navigator.clipboard.writeText(url);
        toast.success("Recruiter-Link Copied to Matrix Clipboard.");
    };


    // Control Loop
    useEffect(() => {
        let interval;
        if (isPlaying && session) {
            interval = setInterval(() => {
                setCurrentTime(prev => {
                    const next = prev + (1 * playbackSpeed);
                    if (next >= session.duration) {
                        setIsPlaying(false);
                        return session.duration;
                    }
                    return next;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, session, playbackSpeed]);

    // Sync State with Timeline
    useEffect(() => {
        if (!session) return;

        // Find applicable code snapshot
        const applicableSnap = [...session.codeSnapshots]
            .reverse()
            .find(s => s.timestamp <= currentTime);
        setCurrentSnapshot(applicableSnap || session.codeSnapshots[0]);

        // Find applicable chat log
        const lastChatIdx = session.chatLog.findIndex((c, i) => {
            const next = session.chatLog[i+1];
            return c.timestamp <= currentTime && (!next || next.timestamp > currentTime);
        });
        setCurrentChatIndex(lastChatIdx);

    }, [currentTime, session]);

    if (isLoading) return (
        <div className="h-screen w-full flex items-center justify-center bg-black">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="size-12 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );
    const handleExportReport = () => {
        const doc = new jsPDF();
        
        // Premium Header
        doc.setFillColor(143, 0, 255);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("TALENT_IQ // SESSION_LOG", 15, 25);
        
        // Metadata
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`CANDIDATE: ${user?.fullName || 'User'}`, 15, 60);
        doc.text(`SECTOR: ${session.company}`, 15, 67);
        doc.text(`AGGREGATE_SCORE: ${session.score}%`, 150, 60);
        doc.text(`PROTOCOL: ${session.type || 'Standard'}`, 150, 67);
        
        // Feedback
        doc.setFontSize(12);
        doc.setTextColor(143, 0, 255);
        doc.text("NEURAL_CONSENSUS_FEEDBACK", 15, 85);
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        const feedbackLines = doc.splitTextToSize(session.feedback || "Strategic architectural alignment with minor algorithmic drift detected.", 180);
        doc.text(feedbackLines, 15, 95);
        
        // Chat History Section
        let yPos = 120;
        doc.setFontSize(12);
        doc.setTextColor(143, 0, 255);
        doc.text("TRANSMISSION_LOG", 15, yPos);
        yPos += 10;
        
        doc.setFontSize(8);
        doc.setTextColor(30, 30, 30);
        session.chatLog.slice(0, 10).forEach((chat, i) => {
            const role = chat.role === 'user' ? 'Candidate' : 'AI Panel';
            const log = `${role}: ${chat.content}`;
            const splitLog = doc.splitTextToSize(log, 180);
            doc.text(splitLog, 15, yPos);
            yPos += (splitLog.length * 5) + 2;
        });
        
        doc.save(`${session.company}_Report_${sessionId.substring(0, 6)}.pdf`);
        toast.success("Intelligence Dossier Exported!");
    };

    if (!session) return <div>Session not found.</div>;

    return (
        <div className={`min-h-screen transition-colors duration-500 overflow-hidden flex flex-col pt-24 ${isDark ? 'bg-[#050505] text-white' : 'bg-base-200 text-base-content'}`}>


            <Navbar />
            
            {/* Header / Dossier Bar */}
            <div className={`h-16 border-b transition-all px-8 flex items-center justify-between ${isDark ? 'border-white/5 bg-black/40 backdrop-blur-xl' : 'border-base-300 bg-base-100/80 backdrop-blur-md'}`}>

                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
                        <ChevronLeft className="size-5" />
                    </button>
                    <div>
                        <h1 className="font-bold flex items-center gap-2">
                            {session.company} - {session.type} Interview
                            <span className="badge badge-primary badge-sm ml-2">REPLAY</span>
                        </h1>
                        <p className="text-[10px] opacity-40 uppercase tracking-widest font-bold">Session ID: {sessionId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] opacity-40 font-black uppercase tracking-wider mb-1">Public Access</span>
                        <div className="flex items-center gap-2">
                             <input 
                                type="checkbox" 
                                className="toggle toggle-primary toggle-xs" 
                                checked={session?.isPublic || false} 
                                onChange={() => toggleMutation.mutate()} 
                            />
                             <span className={`text-[10px] font-black uppercase ${session?.isPublic ? 'text-primary' : 'text-white/20'}`}>
                                {session?.isPublic ? 'ACTIVE' : 'PRIVATE'}
                             </span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-white/10" />
                    <button onClick={copyDossierLink} className="btn btn-sm btn-ghost gap-2 border border-white/5 bg-white/5 rounded-xl hover:text-primary transition-all"><Share2 className="size-4" /> Share Dossier</button>
                    <button onClick={handleExportReport} className="btn btn-sm btn-primary rounded-xl gap-2 font-black shadow-xl shadow-primary/20"><Download className="size-4" /> Export Report</button>

                </div>

            </div>

            <main className="flex-1 flex overflow-hidden">
                {/* Visual Node (Avatar + AI Feed) */}
                <div className={`w-[450px] border-r flex flex-col transition-all ${isDark ? 'border-white/5 bg-black/20' : 'border-base-300 bg-base-100'}`}>

                    <div className="h-[400px] relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
                        <Canvas shadows gl={{ antialias: true, alpha: true }}>
                            <HolographicAvatar sentiment={session.chatLog[currentChatIndex]?.sentiment || "neutral"} isSpeaking={session.chatLog[currentChatIndex]?.role === 'assistant'} />
                        </Canvas>
                        <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10 z-10">
                            <p className="text-xs font-medium text-white/80 italic">
                                "{session.chatLog[currentChatIndex]?.content || "Watching simulation..."}"
                            </p>
                        </div>
                    </div>


                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-[10px] font-bold uppercase tracking-widest text-primary">Biometric Overlay</h3>
                            <Activity className="size-3 text-primary animate-pulse" />
                        </div>
                        
                        {/* Stress Index */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                            <div className="flex justify-between text-[10px] font-bold">
                                <span className="opacity-40 uppercase">Stress Index</span>
                                <span>{Math.round(session.metrics?.stressLevel || 24)}%</span>
                            </div>
                            <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-error shadow-[0_0_10px_#ff0000]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${session.metrics?.stressLevel || 24}%` }}
                                />
                            </div>
                        </div>

                        {/* Filler Words */}
                        <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                            <div>
                                <h4 className="text-[10px] opacity-40 font-bold uppercase">Filler Word Count</h4>
                                <p className="text-lg font-bold">{session.metrics?.fillerWords || 0}</p>
                            </div>
                            <Target className="size-5 text-warning opacity-50" />
                        </div>

                        {/* Cognitive Load */}
                        <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex justify-between items-center">
                            <div>
                                <h4 className="text-[10px] opacity-60 font-bold uppercase text-primary">Cognitive Load</h4>
                                <p className="text-lg font-bold text-primary">High Accuracy</p>
                            </div>
                            <Zap className="size-5 text-primary" />
                        </div>
                    </div>
                </div>

                {/* Simulation Canvas (Editor + History) */}
                <div className={`flex-1 flex flex-col relative transition-all ${isDark ? 'bg-[#0a0a0a]' : 'bg-base-100'}`}>
                    <div className={`h-12 flex items-center border-b px-6 gap-6 ${isDark ? 'border-white/5' : 'border-base-300'}`}>

                        <button 
                            onClick={() => setActiveTab("chat")}
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'chat' ? 'text-primary' : 'opacity-40 hover:opacity-100'}`}
                        >
                            <MessageSquare className="size-3" /> Chat Timeline
                        </button>
                        <button 
                            onClick={() => setActiveTab("code")}
                            className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${activeTab === 'code' ? 'text-primary' : 'opacity-40 hover:opacity-100'}`}
                        >
                            <Code2 className="size-3" /> Code Evolution
                        </button>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {activeTab === 'code' ? (
                                <motion.div 
                                    key="code"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0"
                                >
                                    <Editor
                                        height="100%"
                                        language={session.language || "javascript"}
                                        theme="vs-dark"
                                        value={currentSnapshot?.code || ""}
                                        options={{
                                            readOnly: true,
                                            minimap: { enabled: false },
                                            fontSize: 14,
                                            fontFamily: "JetBrains Mono, monospace",
                                            padding: { top: 20 },
                                            scrollBeyondLastLine: false,
                                        }}
                                    />
                                    {/* Snapshot Toast */}
                                    <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-[10px] font-bold text-primary backdrop-blur-md">
                                        SNAPSHOT: {currentSnapshot?.timestamp}s
                                    </div>
                                </motion.div>
                            ) : (
                                <motion.div 
                                    key="chat"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-8 space-y-6 overflow-y-auto h-full scrollbar-hide"
                                >
                                    {session.chatLog.map((chat, idx) => (
                                        <div 
                                            key={idx}
                                            className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} transition-all ${idx > currentChatIndex ? 'opacity-10 blur-sm scale-95' : 'opacity-100'}`}
                                        >
                                            <div className={`max-w-[80%] p-4 rounded-2xl ${chat.role === 'user' ? 'bg-primary/20 border border-primary/30 rounded-tr-none' : isDark ? 'bg-white/5 border border-white/10 rounded-tl-none' : 'bg-base-200 border border-base-300 rounded-tl-none'}`}>

                                                <div className="flex items-center gap-2 mb-2">
                                                    {chat.role === 'assistant' ? <Bot className="size-3 text-primary" /> : <div className="size-3 rounded-full bg-primary" />}
                                                    <span className="text-[10px] font-bold uppercase tracking-wider opacity-40">{chat.role === 'assistant' ? 'AI Interviewer' : 'Candidate'}</span>
                                                    <span className="text-[10px] opacity-30 ml-auto">{chat.timestamp}s</span>
                                                </div>
                                                <p className="text-sm font-medium leading-relaxed">{chat.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="h-20" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    
                    {/* Control HUD */}
                    <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-6 backdrop-blur-2xl px-8 py-4 rounded-[32px] border shadow-2xl z-50 transition-all ${isDark ? 'bg-black/60 border-white/10' : 'bg-base-100/90 border-base-300'}`}>

                        <div className="flex items-center gap-4">
                            <button onClick={() => setCurrentTime(prev => Math.max(0, prev - 10))} className="p-2 hover:bg-white/5 rounded-full transition-all text-white/60 hover:text-white"><Rewind className="size-5" /></button>
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="size-12 rounded-full bg-primary flex items-center justify-center text-white shadow-[0_0_20px_rgba(143,0,255,0.4)] hover:scale-105 active:scale-95 transition-all"
                            >
                                {isPlaying ? <Pause className="size-5" /> : <Play className="size-5" />}
                            </button>
                            <button onClick={() => setCurrentTime(prev => Math.min(session.duration, prev + 10))} className="p-2 hover:bg-white/5 rounded-full transition-all text-white/60 hover:text-white"><FastForward className="size-5" /></button>
                        </div>

                        <div className="h-10 w-px bg-white/10" />

                        <div className="flex items-center gap-4 min-w-[200px]">
                            <span className="text-[10px] font-bold opacity-40 w-12">{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
                            <div className="relative flex-1 group">
                                <input 
                                    type="range" 
                                    min="0" 
                                    max={session.duration || 600} 
                                    value={currentTime} 
                                    onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                                    className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-primary"
                                />
                                {/* Heatmap markers could go here */}
                            </div>
                            <span className="text-[10px] font-bold opacity-40 w-12">{new Date((session.duration || 600) * 1000).toISOString().substr(14, 5)}</span>
                        </div>

                        <div className="h-10 w-px bg-white/10" />

                        <select 
                            value={playbackSpeed} 
                            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
                            className="bg-transparent text-[10px] font-bold uppercase focus:outline-none cursor-pointer"
                        >
                            <option value="0.5" className="bg-neutral-900">0.5x</option>
                            <option value="1" className="bg-neutral-900">1.0x</option>
                            <option value="1.5" className="bg-neutral-900">1.5x</option>
                            <option value="2" className="bg-neutral-900">2.0x</option>
                        </select>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default InterviewReplayPage;
