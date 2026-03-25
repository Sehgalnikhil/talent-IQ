import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { MicIcon, MicOffIcon, PlayIcon, SquareIcon, MessageSquareIcon, Volume2Icon, SparklesIcon, ZapIcon, ShieldCheckIcon, HistoryIcon, ActivityIcon } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import SoundReactiveSphere from "../components/SoundReactiveSphere";

export default function VoiceInterviewPage() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I am your AI Technical Interviewer. Whenever you are ready, let's begin the interview. I will be assessing your communication and problem-solving skills." }
    ]);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [evaluation, setEvaluation] = useState(null);
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [analyser, setAnalyser] = useState(null);
    const [isDark, setIsDark] = useState(true);
    const audioContextRef = useRef(null);
    
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    useEffect(() => {
        // Theme Sync logic
        const checkTheme = () => {
           const theme = document.documentElement.getAttribute("data-theme");
           setIsDark(!["light", "cupcake", "bumblebee", "emerald", "corporate", "retro", "cyberpunk", "valentine", "garden", "lofi", "pastel", "fantasy", "wireframe", "cmyk", "autumn", "business", "acid", "lemonade", "winter", "nord"].includes(theme));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

        // Initialize Speech Recognition
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            
            recognitionRef.current.onresult = (event) => {
                let currentTranscript = "";
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
            };
        } else {
            toast.error("Speech Recognition not supported in this browser.");
        }

        return () => {
            observer.disconnect();
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthesisRef.current) synthesisRef.current.cancel();
        };
    }, []);

    const speak = (text) => {
        if (!synthesisRef.current) return;
        synthesisRef.current.cancel(); 
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = synthesisRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google"));
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.rate = 1.0;
        utterance.onend = () => {
            if (recognitionRef.current && localStorage.getItem("voice_interview_active") === "true") {
                try {
                    setTranscript("");
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch (e) { console.warn(e); }
            }
        };
        synthesisRef.current.speak(utterance);
    };

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setTimeout(() => {
                setTranscript(prev => {
                    if (prev.trim()) handleUserSubmit(prev);
                    return ""; 
                });
            }, 300);
        } else {
            setTranscript("");
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleUserSubmit = async (text) => {
        const newMessages = [...messages, { role: "user", text }];
        setMessages(newMessages);
        try {
            const dialogueContext = newMessages.map(m => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.text}`).join("\n");
            const prompt = `You are a Senior FAANG technical interviewer on a voice call. Keep responses highly CONCISE (1-sentence max). No markdown. \nContext: ${dialogueContext}\nInterviewer Response:`;
            const res = await axiosInstance.post("/interview/chat", { prompt });
            let aiResponse = res.data.response || "Interesting point.";
            setMessages([...newMessages, { role: "ai", text: aiResponse }]);
            speak(aiResponse);
        } catch (error) { toast.error("Connection sync failed"); }
    };

    const startInterview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            const analyserNode = audioContext.createAnalyser();
            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyserNode);
            analyserNode.fftSize = 256;
            setAnalyser(analyserNode);
            audioContextRef.current = audioContext;
            setIsInterviewActive(true);
            localStorage.setItem("voice_interview_active", "true");
            speak(messages[0].text);
        } catch (error) { toast.error("Microphone access required."); }
    };

    const endInterview = async () => {
        setIsInterviewActive(false);
        setIsEvaluating(true);
        localStorage.setItem("voice_interview_active", "false");
        if (isListening) toggleListen();
        if (synthesisRef.current) synthesisRef.current.cancel();
        if (audioContextRef.current) { try { audioContextRef.current.close(); } catch (e) {} }

        try {
            const dialogueContext = messages.map(m => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.text}`).join("\n");
            const prompt = `Evaluate candidate voice performance. Return JSON ONLY: {"score": 1-100, "feedback": "...", "strengths": ["string"], "weaknesses": ["string"]}\nDialogue:\n${dialogueContext}`;
            const res = await axiosInstance.post("/interview/chat", { prompt });
            const jsonMatch = res.data.response.match(/\{[\s\S]*\}/);
            setEvaluation(JSON.parse(jsonMatch ? jsonMatch[0] : "{}"));
            toast.success("Interview Evaluation Decrypted");
        } catch (error) { toast.error("Evaluation sync failed"); } finally { setIsEvaluating(false); }
    };

    return (
        <div className={`min-h-screen transition-colors duration-700 font-sans selection:bg-primary/30 relative overflow-x-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300 text-base-content'}`}>
            <Navbar />
            
            {/* AMBIENT ENGINE */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden h-screen">
                <div className="absolute top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-primary/5 rounded-full blur-[180px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-secondary/5 rounded-full blur-[180px] animate-pulse" />
            </div>

            <main className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-32 space-y-12 h-screen flex flex-col">
                
                {/* 1. HEADER HUD */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-4">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start">
                            <div className="size-10 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/40 shadow-xl">
                                <Volume2Icon className="size-6 text-primary animate-pulse" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Neural_Link_Audio</span>
                        </div>
                        <h1 className="text-5xl font-black italic tracking-tighter bg-gradient-to-r from-white via-white/80 to-base-content/40 bg-clip-text text-transparent">AI Acoustic Session</h1>
                        <p className={`text-[11px] font-black uppercase tracking-[0.3em] mt-2 ${isDark ? 'opacity-30' : 'opacity-40'}`}>Synchronized_Communication_Simulation v4.0</p>
                    </div>

                    <div className="flex items-center gap-4">
                       <div className="p-4 rounded-3xl bg-base-100/20 backdrop-blur-2xl border border-white/5 flex items-center gap-4 shadow-xl">
                          <ActivityIcon className="size-5 text-success animate-ping" />
                          <div>
                             <p className="text-xs font-black uppercase tracking-widest text-success">Lively_Node_Active</p>
                             <p className="text-[9px] font-bold opacity-40 uppercase tracking-widest">Latency: 24ms</p>
                          </div>
                       </div>
                    </div>
                </div>

                {/* 2. COMMAND INTERFACE */}
                <div className={`flex-1 rounded-[48px] border overflow-hidden flex flex-col relative shadow-3xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-base-100/60 border-black/5'} backdrop-blur-3xl`}>
                    
                    {/* VISUALIZER CONSOLE */}
                    <div className={`h-72 border-b flex flex-col items-center justify-center relative overflow-hidden ${isDark ? 'bg-black/40 border-white/5' : 'bg-white/40 border-black/5'}`}>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-50" />
                        
                        {!isInterviewActive ? (
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={startInterview} 
                                className="btn btn-primary btn-lg rounded-full px-12 h-20 shadow-[0_0_40px_rgba(var(--color-primary),0.4)] z-10 font-black tracking-widest gap-4 text-xl group"
                            >
                                <PlayIcon className="size-6 fill-current group-hover:rotate-12 transition-transform" /> 
                                INITIALIZE_PROTOCOL
                            </motion.button>
                        ) : (
                            <div className="flex flex-col items-center z-10 w-full h-full p-4 relative">
                                <SoundReactiveSphere analyserNode={analyser} />
                                <div className="absolute top-8 left-8 flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-xl">
                                   <div className={`size-2 rounded-full ${isListening ? 'bg-success animate-ping' : 'bg-warning'}`} />
                                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isListening ? "INPUT_ACTIVE" : "AI_BROADCASTING"}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* DIALOGUE TRANSCRIPT GRID */}
                    <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar scroll-smooth">
                        {messages.map((msg, idx) => (
                            <motion.div 
                                initial={{ opacity:0, x: msg.role === "user" ? 20 : -20 }} 
                                animate={{ opacity:1, x:0 }}
                                key={idx} 
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div className={`max-w-[80%] p-6 rounded-[32px] border shadow-2xl relative ${msg.role === "user" ? 'bg-primary text-primary-content border-primary/20 rounded-tr-none shadow-primary/20' : 'bg-base-100/40 border-white/5 backdrop-blur-xl rounded-tl-none shadow-black/20'}`}>
                                    <div className={`absolute -top-3 ${msg.role === "user" ? 'right-4' : 'left-4'} px-3 py-1 rounded-full bg-base-100 text-[8px] font-black uppercase tracking-widest border border-white/10 shadow-lg ${msg.role === 'user' ? 'text-primary' : 'text-secondary'}`}>
                                       {msg.role === "user" ? "CANDIDATE_INPUT" : "NEURAL_INTERVIEWER_ID_0x71"}
                                    </div>
                                    <p className="text-sm font-medium leading-relaxed tracking-tight">{msg.text}</p>
                                </div>
                            </motion.div>
                        ))}
                        
                        {isListening && transcript && (
                            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex justify-end opacity-40">
                                <div className="max-w-[70%] p-4 rounded-3xl border border-dashed border-primary text-[11px] font-black italic tracking-widest">
                                    {transcript} <span className="animate-pulse">_</span>
                                </div>
                            </motion.div>
                        )}
                    </div>

                    {/* INTERFACE CONTROLS */}
                    <AnimatePresence>
                        {isInterviewActive && (
                            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} exit={{ y: 50 }} className="p-8 bg-base-300/30 backdrop-blur-3xl border-t border-white/5 flex justify-center items-center gap-8 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-error/5 opacity-50" />
                                
                                <button 
                                    onClick={toggleListen}
                                    className={`btn btn-circle btn-lg h-20 w-20 shadow-2xl hover:scale-110 active:scale-95 transition-all z-10 border-4 ${isListening ? "btn-error border-error-content/20 shadow-error/40" : "btn-primary border-primary-content/20 shadow-primary/40"}`}
                                >
                                    {isListening ? <SquareIcon className="size-8 fill-current" /> : <MicIcon className="size-8" />}
                                </button>
                                
                                <button onClick={endInterview} className="btn btn-ghost btn-lg px-10 rounded-[24px] font-black border border-error/20 hover:bg-error hover:text-error-content transition-all h-16 uppercase tracking-widest text-xs z-10 text-error">
                                    TERMINATE_PROTOCOL
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* EVALUATION MODAL ENGINE */}
            <AnimatePresence>
                {(isEvaluating || evaluation) && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-2xl z-[200] flex items-center justify-center p-8">
                        <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className={`max-w-xl w-full rounded-[48px] p-12 border shadow-[0_0_100px_rgba(var(--color-primary),0.2)] relative overflow-hidden ${isDark ? 'bg-base-100 border-white/10' : 'bg-base-100 border-black/10'}`}>
                            {isEvaluating ? (
                                <div className="text-center py-20 flex flex-col items-center space-y-8">
                                    <div className="size-24 rounded-full border-t-4 border-primary animate-spin shadow-primary/20" />
                                    <div className="space-y-2">
                                       <h3 className="text-3xl font-black italic tracking-tighter">De-Synchronizing_Matrix</h3>
                                       <p className="text-[10px] font-black uppercase tracking-[0.5em] opacity-40">Synthesizing_Performance_Artifacts</p>
                                    </div>
                                </div>
                            ) : evaluation && (
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between">
                                        <div>
                                           <h3 className="text-4xl font-black italic tracking-tighter italic">Evaluation Protocol</h3>
                                           <p className="text-[10px] uppercase font-black tracking-widest opacity-40 mt-1">Status: DECRYPTED_REPORT</p>
                                        </div>
                                        <div className={`size-24 rounded-3xl flex items-center justify-center font-black text-3xl shadow-2xl border-4 ${evaluation.score >= 80 ? 'bg-success/20 text-success border-success/40' : 'bg-warning/20 text-warning border-warning/40'}`}>
                                            {evaluation.score}
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white/5 p-6 rounded-[32px] border border-white/5">
                                       <p className="text-sm font-medium leading-relaxed opacity-80">{evaluation.feedback}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <header className="flex items-center gap-2 border-b border-success/20 pb-2">
                                               <ShieldCheckIcon className="size-4 text-success" />
                                               <span className="text-[10px] font-black uppercase tracking-widest text-success">Optimized</span>
                                            </header>
                                            <ul className="text-[11px] font-bold space-y-2 opacity-60">
                                                {evaluation.strengths?.map((s, i) => <li key={i} className="flex gap-2">• {s}</li>)}
                                            </ul>
                                        </div>
                                        <div className="space-y-4">
                                            <header className="flex items-center gap-2 border-b border-error/20 pb-2">
                                               <HistoryIcon className="size-4 text-error" />
                                               <span className="text-[10px] font-black uppercase tracking-widest text-error">Anomalies</span>
                                            </header>
                                            <ul className="text-[11px] font-bold space-y-2 opacity-60">
                                                {evaluation.weaknesses?.map((w, i) => <li key={i} className="flex gap-2">• {w}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <button onClick={() => setEvaluation(null)} className="btn btn-primary btn-lg w-full rounded-[24px] font-black tracking-widest shadow-2xl shadow-primary/30">
                                        DISMISS_TRANSMISSION
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
