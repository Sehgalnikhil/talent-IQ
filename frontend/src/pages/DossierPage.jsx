import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../lib/axios";
import Editor from "@monaco-editor/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    Bot, Code2, MessageSquare, Activity, 
    ChevronLeft, Download, Share2, Sparkles,
    Timer, Target, Zap, ShieldCheck, User, ExternalLink
} from "lucide-react";
import { Canvas } from "@react-three/fiber";
import HolographicAvatar from "../components/HolographicAvatar";


import jsPDF from "jspdf";
import toast from "react-hot-toast";

const DossierPage = () => {

    const { sessionId } = useParams();
    const navigate = useNavigate();
    
    const [currentTime, setCurrentTime] = useState(0);
    const [activeTab, setActiveTab] = useState("chat");
    const [currentSnapshot, setCurrentSnapshot] = useState(null);
    const [currentChatIndex, setCurrentChatIndex] = useState(-1);

    const { data: session, isLoading, error } = useQuery({
        queryKey: ['public-dossier', sessionId],
        queryFn: async () => {
            const res = await axiosInstance.get(`/interview/public/session/${sessionId}`);
            return res.data;
        },
        retry: false
    });

    useEffect(() => {
        if (!session) return;
        const snap = [...session.codeSnapshots].reverse().find(s => s.time <= currentTime);
        setCurrentSnapshot(snap || session.codeSnapshots[0]);

        const lastChatIdx = session.chatLog.findIndex((c, i) => {
            const next = session.chatLog[i+1];
            return c.timestamp <= currentTime && (!next || next.timestamp > currentTime);
        });
        setCurrentChatIndex(lastChatIdx);
    }, [currentTime, session]);

    if (isLoading) return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-primary">
            <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="size-20 rounded-full border-2 border-primary/30 flex items-center justify-center mb-8">
                <ShieldCheck className="size-10 animate-pulse" />
            </motion.div>
            <p className="text-[10px] font-black tracking-[0.5em] uppercase animate-pulse">Decrypting_Candidate_Archive...</p>
        </div>
    );

    const handleExportReport = () => {
        const doc = new jsPDF();
        
        doc.setFillColor(143, 0, 255);
        doc.rect(0, 0, 210, 40, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("TALENT_IQ // CANDIDATE_DOSSIER", 15, 25);
        
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text(`SECTOR: ${session.company}`, 15, 60);
        doc.text(`SCORE: ${session.score}%`, 15, 67);
        doc.text(`PROTOCOL: ${session.interviewType || 'Standard'}`, 150, 60);
        doc.text(`DATE: ${new Date(session.createdAt).toLocaleDateString()}`, 150, 67);
        
        doc.setFontSize(12);
        doc.setTextColor(143, 0, 255);
        doc.text("EVALUATION_SUMMARY", 15, 85);
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(10);
        const feedbackLines = doc.splitTextToSize(session.feedback || "Strategic architectural alignment with minor algorithmic drift detected.", 180);
        doc.text(feedbackLines, 15, 95);
        
        doc.save(`${session.company}_Dossier_${sessionId.substring(0, 6)}.pdf`);
        toast.success("Intelligence Dossier Exported!");
    };

    if (error) return (

        <div className="h-screen w-full flex flex-col items-center justify-center bg-[#050505] text-white p-8 text-center">
            <Activity className="size-16 text-error mb-6 opacity-20" />
            <h2 className="text-4xl font-black italic mb-2 tracking-tighter">ARCHIVE_PRIVATE</h2>
            <p className="text-white/40 max-w-md font-medium uppercase text-[10px] tracking-widest leading-loose">The requested session logs are restricted or have been deleted by the candidate. Access Denied.</p>
            <button onClick={() => navigate("/")} className="btn btn-outline btn-primary mt-8 px-12 rounded-full font-black">RETURN TO HUB</button>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans overflow-hidden">
            {/* Recruiter Protocol Header */}
            <header className="h-24 border-b border-white/5 bg-black/60 backdrop-blur-3xl px-12 flex items-center justify-between relative z-50">
                <div className="flex items-center gap-8">
                    <div className="size-14 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                        <User className="size-8 text-primary" />
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black italic tracking-tighter">CANDIDATE_DOSSIER</h1>
                            <span className="badge badge-success badge-outline font-black text-[9px] tracking-widest">VERIFIED_LOGS</span>
                        </div>
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mt-1">
                            {session.company} // {session.interviewType} Protocol // {new Date(session.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-10">
                    <div className="text-right">
                        <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mb-1">AGGREGATE_SCORE</p>
                        <div className="text-4xl font-black italic tracking-tight text-primary">{session.score}%</div>
                    </div>
                    <div className="h-12 w-px bg-white/10" />
                    <button onClick={handleExportReport} className="btn btn-primary rounded-full px-8 font-black gap-2 shadow-2xl shadow-primary/20">
                        <Download className="size-4" /> REPRODUCE_ARCHIVE
                    </button>

                </div>
            </header>

            <main className="flex-1 flex overflow-hidden">
                {/* Metrics Sidebar */}
                <aside className="w-[400px] border-r border-white/5 bg-black/40 p-10 overflow-y-auto hidden lg:block">
                    <section className="space-y-12">
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                                <Sparkles className="size-3" /> CANDIDATE_TRAITS
                            </h3>
                            <div className="space-y-3">
                                {session.strengths.slice(0, 3).map((s, i) => (
                                    <div key={i} className="bg-success/5 border border-success/10 p-4 rounded-2xl">
                                        <p className="text-[11px] font-bold text-success flex items-center gap-2">
                                            <ShieldCheck className="size-3" /> {s}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                                <Activity className="size-3" /> BIOMETRIC_FIDELITY
                            </h3>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-[9px] font-black uppercase text-white/40">Stress_Threshold</span>
                                        <span className="text-lg font-black italic">{session.metrics?.stressLevel || 24}%</span>
                                    </div>
                                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary" style={{ width: `${session.metrics?.stressLevel || 24}%` }} />
                                    </div>
                                </div>
                                <div className="bg-white/5 border border-white/10 p-6 rounded-[24px]">
                                    <span className="text-[9px] font-black uppercase text-white/40 mb-2 block">Filler_Word_Index</span>
                                    <p className="text-xl font-black italic">{session.metrics?.fillerWords || 0}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                                <Activity className="size-3" /> VISUAL_RECONSTRUCTION
                            </h3>
                            <div className="h-64 rounded-[32px] bg-black border border-white/5 relative overflow-hidden group mb-8">
                                <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                                <Canvas shadows gl={{ antialias: true, alpha: true }}>
                                    <HolographicAvatar 
                                        sentiment={session.chatLog[currentChatIndex]?.sentiment || "neutral"} 
                                        isSpeaking={session.chatLog[currentChatIndex]?.role === 'assistant'} 
                                    />
                                </Canvas>
                                <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                    <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                                    <span className="text-[8px] font-black uppercase tracking-widest text-primary/60">NEURAL_SIM_ACTIVE</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-6 flex items-center gap-2">
                                <Target className="size-3" /> EVALUATION_LOG
                            </h3>
                            <p className="text-xs font-medium text-white/60 leading-loose italic">
                                "{session.feedback || "The candidate demonstrated high architectural consistency with a minor drift in algorithmic space-complexity scaling."}"
                            </p>
                        </div>

                    </section>
                </aside>

                {/* Replay Canvas */}
                <section className="flex-1 flex flex-col bg-[#080808]">
                    {/* Tabs / Player HUD */}
                    <div className="h-16 flex items-center justify-between border-b border-white/5 px-10">
                        <div className="flex gap-8">
                            <button onClick={() => setActiveTab("chat")} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'chat' ? 'text-primary' : 'opacity-40'}`}>EVOLUTION_LOG</button>
                            <button onClick={() => setActiveTab("code")} className={`text-[10px] font-black uppercase tracking-widest ${activeTab === 'code' ? 'text-primary' : 'opacity-40'}`}>COGNITIVE_OUTPUT</button>
                        </div>
                        <div className="flex items-center gap-4">
                             <input 
                                type="range" 
                                min="0" 
                                max={session.duration} 
                                value={currentTime} 
                                onChange={(e) => setCurrentTime(parseInt(e.target.value))}
                                className="range range-primary range-xs w-48"
                            />
                            <span className="text-[10px] font-bold font-mono opacity-40">{Math.floor(currentTime/60)}:{(currentTime%60).toString().padStart(2, '0')}</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden relative">
                        <AnimatePresence mode="wait">
                            {activeTab === 'chat' ? (
                                <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full p-10 overflow-y-auto scrollbar-hide space-y-6">
                                    {session.chatLog.map((chat, i) => (
                                        <div key={i} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} transition-opacity ${i > currentChatIndex ? 'opacity-5' : 'opacity-100'}`}>
                                            <div className={`max-w-[70%] p-6 rounded-3xl ${chat.role === 'user' ? 'bg-primary/10 border border-primary/20 rounded-tr-none' : 'bg-white/5 border border-white/10 rounded-tl-none'}`}>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">{chat.role === 'user' ? 'CANDIDATE' : 'SYSTEM_PANEL'}</span>
                                                    <span className="text-[8px] font-mono opacity-20">{chat.timestamp}s</span>
                                                </div>
                                                <p className="text-sm font-medium leading-relaxed">{chat.content}</p>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="h-20" />
                                </motion.div>
                            ) : (
                                <motion.div key="code" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative">
                                    <Editor
                                        height="100%"
                                        language={session.language || "javascript"}
                                        theme="vs-dark"
                                        value={currentSnapshot?.code || ""}
                                        options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, padding: { top: 40, left: 40 } }}
                                    />
                                    <div className="absolute top-8 right-8 px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 backdrop-blur-xl text-[10px] font-black italic">T+{currentSnapshot?.time}s_FRAME</div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </section>
            </main>

            {/* Recruiter CTA Footer */}
            <footer className="h-20 border-t border-white/5 bg-black flex items-center justify-center gap-12 px-12">
                <p className="text-[10px] font-black text-white/30 tracking-[0.2em] hidden md:block">TALENT_IQ // NEURAL_CONSENSUS_RECAP</p>
                <div className="flex gap-4">
                    <button className="btn btn-sm btn-ghost gap-2 font-black text-[9px] uppercase"><ExternalLink className="size-3" /> VIEW_ON_GITHUB</button>
                    <button className="btn btn-sm btn-primary rounded-full px-6 font-black text-[9px] uppercase">HIRE_CANDIDATE</button>
                </div>
            </footer>
        </div>
    );
};

export default DossierPage;
