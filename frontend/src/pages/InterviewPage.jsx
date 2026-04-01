import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import {
    Bot, Mic, AlertTriangle, UploadCloud,
    Clock, Settings, Play, CheckCircle,
    XCircle, Zap, Eye, Activity, PlayCircle, Send,
    Wand2, Bug, Camera, Keyboard, Brain, FileWarning, Code2, Users, LayoutDashboard,
    ListTree, Timer, Network, TerminalSquare, ChevronRight, Swords, Sparkles,
    ShieldCheck, Binary, Cpu, Trophy, History, User, UserCircle2
} from "lucide-react";


import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { executeCode } from "../lib/piston";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import HolographicAvatar from "../components/HolographicAvatar";

import { useSaveInterviewSession, useInterviewSessions } from "../hooks/useInterviews";
import { useUserStats } from "../hooks/useUserStats";
import { useCredits } from "../hooks/useCredits";
import { useNavigate } from "react-router";



function InterviewPage() {
    const [phase, setPhase] = useState("setup"); // setup, active, feedback
    const [isLoading, setIsLoading] = useState(false);
    const [isDark, setIsDark] = useState(true);

    // AI Coach State
    const [showCoachMessage, setShowCoachMessage] = useState(false);
    const [coachHint, setCoachHint] = useState("");
    const [isAskingCoach, setIsAskingCoach] = useState(false);

    // Setup State
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [stressMode, setStressMode] = useState(false);
    const [emotionMode, setEmotionMode] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState("Google");
    const [selectedArchetype, setSelectedArchetype] = useState("Standard Panel");
    const [interviewType, setInterviewType] = useState("DSA"); // DSA, GitHubPR, Behavioral
    const [problemContext, setProblemContext] = useState("Find all duplicates in an array in O(n) time and O(1) space.");

    // Advanced F3 & F4 State
    const [githubUrl, setGithubUrl] = useState("");
    const [aggressionLevel, setAggressionLevel] = useState(5);

    // Active State
    const [chatLog, setChatLog] = useState([
        { role: "assistant", content: "[Hiring Manager]: Hello! We are your FAANG interviewing panel today. We have a DSA Engineer, a System Design Engineer, and myself. To start testing you, please write your initial algorithm or talk to us about your thoughts before coding." }
    ]);
    const [aiFeedback, setAiFeedback] = useState(null);
    const [refactoredCode, setRefactoredCode] = useState("");
    const [isRefactoring, setIsRefactoring] = useState(false);
    const [message, setMessage] = useState("");

    // 🎧 VOICE INTELLIGENCE STACK
    const [isVoiceModeActive, setIsVoiceModeActive] = useState(false);
    const [isRecordingVoice, setIsRecordingVoice] = useState(false);
    const [isAISpeaking, setIsAISpeaking] = useState(false);
    const [aiSentiment, setAiSentiment] = useState("neutral");
    const [fillerWordsCount, setFillerWordsCount] = useState(0);
    const recognitionRef = useRef(null);
    const [hasSpeechSupport] = useState('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    const [warnings, setWarnings] = useState(0);




    // 🚀 NEW TANSTACK STACK
    const { data: cloudRecordingsData, isLoading: isLoadingRecordings } = useInterviewSessions();
    const saveInterviewMutation = useSaveInterviewSession();
    const { balance, isLoading: isLoadingCredits } = useCredits();
    const navigate = useNavigate();
    const cloudRecordings = cloudRecordingsData || [];


    // Live AI Complexity State
    const [liveComplexity, setLiveComplexity] = useState({ time: "O(?)", space: "O(?)" });
    const [isCalculatingComplexity, setIsCalculatingComplexity] = useState(false);

    // Active State
    const [code, setCode] = useState("function solution(arr) {\n  // Write your optimized solution here\n  \n}");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [timeLeft, setTimeLeft] = useState(45 * 60);

    // Live Camera Tracking State
    const videoRef = useRef(null);
    const [mediaStream, setMediaStream] = useState(null);
    const [currentStressLevel, setCurrentStressLevel] = useState({ text: "Low (Calm)", color: "text-success", bg: "bg-success/10" });

    // F1: Voice Synthesis State
    const [audioEnabled, setAudioEnabled] = useState(true);

    // F5: Recruiter Replay Engine Timeline State
    const [replayTimeline, setReplayTimeline] = useState([]);

    // F2: Trace Visualizer State
    const [isTracing, setIsTracing] = useState(false);
    const [traceData, setTraceData] = useState(null);

    // F4: Auto-Draw Architecture State
    const [isGeneratingDiagram, setIsGeneratingDiagram] = useState(false);
    const [mermaidDiagram, setMermaidDiagram] = useState(null);

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

    // No longer using manual fetch for recordings - handled by useInterviewSessions



    // Handle Camera Lifecycle
    useEffect(() => {
        if (phase === "active" && emotionMode) {
            // Request camera
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then((stream) => {
                    setMediaStream(stream);
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                })
                .catch((err) => {
                    toast.error("Camera access denied! Emotion tracking disabled.");
                    setEmotionMode(false);
                });

            // Real-time Emotion/Stress analytics via Gemini Vision
            const interval = setInterval(async () => {
                const video = document.querySelector('video');
                if (!video || !video.videoWidth) return;
                
                try {
                    const canvas = document.createElement("canvas");
                    canvas.width = 300; // Resize to lower resolution to save bandwidth & Gemini API constraints
                    canvas.height = (video.videoHeight / video.videoWidth) * 300;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const imageFile = canvas.toDataURL("image/jpeg", 0.8);

                    const res = await axiosInstance.post('/interview/analyze-emotion', { imageFile });
                    if (res.data && res.data.stressLevel !== undefined) {
                        const level = res.data.stressLevel;
                        if (level > 70) setCurrentStressLevel({ text: res.data.text || "High (Stressed)", color: "text-error", bg: "bg-error/10" });
                        else if (level > 35) setCurrentStressLevel({ text: res.data.text || "Medium (Focused)", color: "text-warning", bg: "bg-warning/10" });
                        else setCurrentStressLevel({ text: res.data.text || "Low (Calm)", color: "text-success", bg: "bg-success/10" });
                        
                        if (res.data.actionableHint && level > 70) {
                            toast(res.data.actionableHint, { icon: "🧠", duration: 3000 });
                        }
                    }
                } catch (error) {
                    console.error("Camera Tracking Error:", error);
                }
            }, 10000); // Poll every 10 seconds

            return () => clearInterval(interval);
        } else {
            // Cleanup camera when phase changes
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
                setMediaStream(null);
            }
        }
    }, [phase, emotionMode]);

    // Live Code Complexity Analyzer (Debounced)
    useEffect(() => {
        if (phase !== "active" || code.trim().length < 15) return;

        // F5: Recruiter Replay Engine - Capture Code Frame
        setReplayTimeline(prev => {
            const last = prev[prev.length - 1];
            if (!last || last.code !== code) {
                return [...prev, { time: 45 * 60 - timeLeft, code }];
            }
            return prev;
        });

        setIsCalculatingComplexity(true);
        const timer = setTimeout(async () => {
            try {
                const res = await axiosInstance.post("/interview/complexity", { code });
                if (res.data.time || res.data.space) {
                    setLiveComplexity({ time: res.data.time || "O(?)", space: res.data.space || "O(?)" });
                }
            } catch (err) {
                console.warn("Could not fetch complexity right now");
            } finally {
                setIsCalculatingComplexity(false);
            }
        }, 2000); // 2 seconds of no typing

        return () => clearTimeout(timer);
    }, [code, phase]);

    // Voice to text initialization
    useEffect(() => {
        if (!hasSpeechSupport) return;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;

        recognitionRef.current.onresult = (event) => {
            let interimTranscript = '';
            let finalTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setMessage((prev) => prev + " " + finalTranscript.trim());
            }

        };

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
        };
    }, [hasSpeechSupport]);

    // Handle Mic hold
    useEffect(() => {
        if (!recognitionRef.current) return;

        if (isRecordingVoice) {
            recognitionRef.current.start();
            toast('Listening to you...', { icon: '🎙️', id: 'voice-toast' });
        } else {
            recognitionRef.current.stop();
            toast.dismiss('voice-toast');
        }
    }, [isRecordingVoice]);

    // Tab change detection & Warnings
    useEffect(() => {
        if (phase !== "active") return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings(prev => prev + 1);
                toast.error("WARNING: Tab switch detected! (Anti-Cheat Mechanism)", { icon: '🚨', duration: 4000 });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [phase]);

    // F3: Pressure Cooker & Stress Mode Drop
    useEffect(() => {
        if (phase === "active") {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (stressMode && prev > 300 && Math.random() > 0.98) {
                        toast('PRESSURE COOKER: Constraints mutated!', { icon: '🚨', style: { background: '#ef4444', color: '#fff' } });
                        setChatLog(logs => [...logs, { role: "ai", text: "[System Design Engineer]: I just checked production. We are severely memory constrained. Optimize to O(1) space immediately." }]);
                        return prev - 180;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [phase, stressMode]);

    // File Upload Ref
    const fileInputRef = useRef(null);

    const handleFileUploadChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        toast("Reading Dossier...", { icon: '📄' });

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target.result;
                setResumeUploaded(true);
                const res = await axiosInstance.post("/interview/analyze-resume", {
                    resumeText: text.substring(0, 5000)
                });
                const data = res.data;
                toast.success("Identity Matrix Synchronized!");
                setProblemContext(data.suggestedProblem || problemContext);
                setChatLog([{ role: "assistant", content: `Hello! I see you have experience with ${data.skills?.join(", ") || 'Modern Tech'}. Let's dive in. ${data.suggestedProblem}` }]);

                setIsLoading(false);
            };
            reader.readAsText(file);
        } catch (err) {
            toast.error("Failed to read identity document.");
            setIsLoading(false);
        }
    };

    const handleSendMessage = async (customMsg = null) => {
        const text = customMsg || message;
        if (!text.trim()) return;

        const newChat = [...chatLog, { role: "user", content: text }];
        setChatLog(newChat);
        setMessage("");
        setIsLoading(true);

        try {
            const res = await axiosInstance.post("/interview/chat", {
                message: text,
                hostility: aggressionLevel,
                archetype: selectedArchetype,
                problemContext: `Candidate is applying for a ${interviewType} position at ${selectedCompany}.`
            });
            
            const aiMsg = { role: "assistant", content: res.data.content };
            setChatLog([...newChat, aiMsg]);
            
            // 🎙️ TTS (Speak response if voice mode is on)
            if (isVoiceModeActive) speakAI(res.data.content);


        } catch (error) {
            if (error.response?.status === 403 && error.response?.data?.requirePayment) {
                toast.error("Neural Node Depleted. Refill required.", { icon: '⚡' });
                navigate("/pricing");
            } else {
                toast.error("Cognitive Relay Offline.");
            }
        } finally {

            setIsLoading(false);
        }
    };

    const speakAI = (text) => {
        if (!window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggleVoiceMode = () => {
        if (!hasSpeechSupport) return toast.error("Speech Recognition not supported in this vessel.");
        
        if (!isVoiceModeActive) {
            if (!recognitionRef.current) {
                const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
                recognitionRef.current = new SpeechRecognition();
                recognitionRef.current.continuous = true;
                recognitionRef.current.interimResults = true;
                recognitionRef.current.onresult = (event) => {
                    const transcript = event.results[event.results.length - 1][0].transcript;
                    if (event.results[0].isFinal) {
                        handleSendMessage(transcript);
                        recognitionRef.current.stop();
                        setIsRecordingVoice(false);
                    }
                };

                recognitionRef.current.onend = () => setIsRecordingVoice(false);
            }
            recognitionRef.current.start();
            setIsRecordingVoice(true);
            setIsVoiceModeActive(true);
            toast.success("Voice Engine Primed. Listening...");
        } else {
            recognitionRef.current.stop();
            setIsRecordingVoice(false);
            setIsVoiceModeActive(false);
        }
    };

    const handleEndInterview = async () => {
        toast("Compiling Scoreboard...", { icon: '🧠' });
        setPhase("feedback");
        try {
            const res = await axiosInstance.post("/interview/evaluate", { code, problemContext });
            setAiFeedback(res.data);
            toast.success("Session Archive Completed!");

            const recording = {
                company: selectedCompany,
                interviewType: interviewType,
                duration: 45 * 60 - timeLeft,
                chatLog: chatLog,
                codeSnapshots: replayTimeline,
                score: res.data.score || 0,
                feedback: res.data.feedback || "",
                strengths: res.data.strengths || [],
                weaknesses: res.data.weaknesses || [],
                problemContext: problemContext,
                finalCode: code,
                metrics: {
                    fillerWords: fillerWordsCount,
                    stressLevel: 25 // Simulated or linked to state
                }
            };

            
            // 🚀 MUTATION WITH OPTIMISTIC UPDATE
            saveInterviewMutation.mutate(recording);
            
        } catch (err) { 
            console.error(err);
            toast.error("Evaluation Sync Failed."); 
        }
    };



    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleStartInterview = async () => {
        setIsLoading(true);
        if (interviewType === "GitHubPR" && !githubUrl) {
            toast.error("Enter a valid Codebase Matrix URL.");
            return setIsLoading(false);
        }

        if (interviewType === "GitHubPR") {
            try {
                const res = await axiosInstance.post("/interview/github-mock", { githubUrl });
                setProblemContext(res.data.problemContext);
                setChatLog([{ role: "assistant", content: `[System Design Engineer]: ${res.data.firstMessage}` }]);
                setPhase("active");
            } catch { toast.error("Codebase parsing offline."); }
        } else if (interviewType === "Behavioral") {
            setChatLog([{ role: "assistant", content: `[Hiring Manager]: Welcome. Let's explore your conflict resolution matrices. Tell me about your most complex disagreement.` }]);
            setPhase("active");
        } else {
            setChatLog([{ role: "assistant", content: "[Hiring Manager]: Hello! We are your FAANG panel. Let's start with your approach to the problem context." }]);
            setPhase("active");
        }

        setIsLoading(false);
    };

    const handleRunCode = async () => {
        setIsLoading(true);
        toast("Executing Matrix Vector...", { icon: '⚡' });
        try {
            const result = await executeCode(language, code);
            if (!result.success) {
                toast.error("Execution Conflict: " + (result.error || result.errorType));
            } else {
                toast.success("Execution Completed");
                const output = result.output;
                setChatLog(prev => [...prev, { role: "assistant", content: `[Terminal]: Execution Result:\n${output}` }]);
            }
        } catch (err) {
            toast.error("Process Terminated: Cluster Offline.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAIDebug = async () => {
        setIsLoading(true);
        toast("Scanning for Vulnerabilities...", { icon: '⚙️' });
        try {
            const res = await axiosInstance.post("/interview/chat", {
                chatLog: [...chatLog, { role: "user", content: "Analyze my code for potential bugs or logical errors." }],
                code: code,
                interviewType: "BugScan",
                hostility: 1
            });
            setChatLog(prev => [...prev, { role: "assistant", content: `[System Debugger]: ${res.data.reply}` }]);
            toast.success("Scan Complete");
        } catch {
            toast.error("Debugger Sync Failed");
        } finally {
            setIsLoading(false);
        }
    };

    const handleAskCoach = async () => {
        setIsAskingCoach(true);
        toast("Consulting Co-Pilot...", { icon: '🧠' });
        setAiSentiment("impressed"); // Coach is always nice
        setIsAISpeaking(true);
        try {
            const res = await axiosInstance.post("/interview/chat", {
                chatLog: [...chatLog, { role: "user", content: "Give me a subtle hint about my current approach without revealing the full solution." }],
                code: code,
                interviewType,
                hostility: 1
            });
            setCoachHint(res.data.reply);
            setShowCoachMessage(true);
            toast.success("Hint Received");
            setTimeout(() => setIsAISpeaking(false), 3000);
        } catch {
            toast.error("Co-Pilot Link Severed");
            setIsAISpeaking(false);
            setAiSentiment("neutral");
        } finally {
            setIsAskingCoach(false);
        }
    };

    if (phase === "setup") {
        return (
            <div className={`min-h-screen transition-colors duration-700 font-sans relative overflow-x-hidden pt-24 ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300 text-base-content'}`}>
                <Navbar />

                {/* AMBIENT ENGINE */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden h-screen">
                    <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[140px] animate-pulse" />
                    <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[140px] animate-pulse" />
                </div>

                <div className="max-w-7xl mx-auto px-6 pb-32 relative z-10 flex flex-col items-center">

                    {/* SECTOR IDENTITY */}
                    <div className="text-center space-y-4 mb-16">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="size-24 mx-auto rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-[2px] shadow-2xl">
                            <div className={`w-full h-full rounded-[22px] flex items-center justify-center ${isDark ? 'bg-black' : 'bg-white'}`}>
                                <Bot className="size-12 text-primary" />
                            </div>
                        </motion.div>
                        <h1 className="text-7xl font-black italic tracking-tighter bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">ULTIMATE INTERVIEW</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Synchronized_AI_Consensus_Pipeline</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 w-full">

                        {/* CONFIGURATION STACK */}
                        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={`lg:col-span-8 p-1 rounded-[48px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-3xl shadow-3xl`}>
                            <div className="p-12 space-y-12">

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-8">
                                        <header className="flex items-center gap-4 opacity-40">
                                            <Users className="size-5" />
                                            <span className="text-xs font-black uppercase tracking-widest">Profile_Calibration</span>
                                        </header>

                                        {/* RESUME COMPONENT */}
                                        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUploadChange} />
                                        <div onClick={() => !resumeUploaded && fileInputRef.current?.click()} className={`group p-8 rounded-[32px] border-2 border-dashed transition-all cursor-pointer ${resumeUploaded ? 'border-success bg-success/5' : 'border-white/10 hover:border-primary/40 hover:bg-white/5'}`}>
                                            {resumeUploaded ? (
                                                <div className="flex items-center gap-6">
                                                    <div className="size-14 rounded-2xl bg-success/20 flex items-center justify-center shadow-xl border border-success/30">
                                                        <ShieldCheck className="size-8 text-success" />

                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black italic">Identity Matrix Validated</p>
                                                        <p className="text-[10px] uppercase opacity-40 font-bold tracking-widest">Candidate_Sync_Active</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center gap-4 py-4">
                                                    <UploadCloud className="size-8 opacity-20 group-hover:text-primary group-hover:opacity-100 transition-all" />
                                                    <p className="text-xs font-black uppercase tracking-widest opacity-40">Synchronize_Dossier</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* COMPANY TEMPLATE */}
                                        <div className="space-y-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Sector_Template</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {["Google", "Meta", "Amazon", "Apple", "Netflix", "OpenAI"].map(comp => (
                                                    <button key={comp} onClick={() => setSelectedCompany(comp)} className={`p-5 rounded-2xl border font-black text-xs transition-all ${selectedCompany === comp ? 'bg-primary text-primary-content border-primary shadow-2xl shadow-primary/20 scale-105' : 'bg-white/5 border-white/5 hover:bg-white/10 opacity-60'}`}>
                                                        {comp}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <header className="flex items-center gap-4 opacity-40">
                                            <Cpu className="size-3" />
                                            <span className="text-xs font-black uppercase tracking-widest">Chaos_Modulators</span>
                                        </header>

                                        {/* HOSTILITY DIAL */}
                                        <div className="p-8 rounded-[32px] bg-error/5 border border-error/10 space-y-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-error">Interviewer_Aggression</span>
                                                <span className="text-xl font-black italic text-error">{aggressionLevel}/10</span>
                                            </div>
                                            <input type="range" min="1" max="10" value={aggressionLevel} onChange={e => setAggressionLevel(e.target.value)} className="range range-error range-xs" />
                                            <div className="flex justify-between text-[8px] font-black opacity-40 uppercase tracking-widest text-error">
                                                <span>Adaptive</span>
                                                <span>Bar_Raiser</span>
                                            </div>
                                        </div>

                                        {/* MODE SWITCHES */}
                                        <div className="space-y-3">
                                            {[
                                                { label: "Emotion_Tracking", icon: <Camera />, state: emotionMode, setter: setEmotionMode, color: "text-info", bg: "bg-info/10" }
                                            ].map(mode => (
                                                <div key={mode.label} onClick={() => mode.setter(!mode.state)} className={`flex items-center justify-between p-6 rounded-[24px] cursor-pointer transition-all border ${mode.state ? `${mode.color} ${mode.bg} border-current shadow-lg` : 'bg-white/5 border-white/5 opacity-40 hover:opacity-100'}`}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-10 rounded-xl bg-white/5 flex items-center justify-center">{mode.icon}</div>
                                                        <span className="text-[10px] font-black uppercase tracking-widest">{mode.label}</span>
                                                    </div>
                                                    <input type="checkbox" checked={mode.state} readOnly className={`toggle toggle-xs ${mode.state ? 'toggle-primary' : ''}`} />
                                                </div>
                                            ))}
                                        </div>

                                        {/* ARCHEOTYPE SELECTION */}
                                        <div className="space-y-4">
                                             <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Interviewer_Archetype</p>
                                             <div className="grid grid-cols-2 gap-3">
                                                 {[
                                                     { id: "Standard Panel", description: "FAANG Professionals", icon: UserCircle2 },
                                                     { id: "The Stoic", description: "Blunt & Critical", icon: Swords },
                                                     { id: "The Mentor", description: "Helpful & Kind", icon: Sparkles },
                                                     { id: "The Chaos Monkey", description: "Changing Specs", icon: Zap },
                                                 ].map(arch => (

                                                     <button 
                                                        key={arch.id} 
                                                        onClick={() => setSelectedArchetype(arch.id)} 
                                                        className={`p-4 rounded-2xl border text-left transition-all ${selectedArchetype === arch.id ? 'bg-primary/10 border-primary shadow-lg shadow-primary/10 scale-[1.02]' : 'bg-white/5 border-white/5 opacity-60'}`}
                                                     >
                                                         <div className="flex items-center gap-3 mb-2">
                                                            <arch.icon className={`size-4 ${selectedArchetype === arch.id ? 'text-primary' : 'opacity-40'}`} />
                                                            <span className="font-black text-[10px] uppercase">{arch.id}</span>
                                                         </div>
                                                         <p className={`text-[8px] font-bold opacity-30`}>{arch.description}</p>
                                                     </button>
                                                 ))}
                                             </div>
                                         </div>
                                    </div>

                                </div>

                                 {/* CREDIT STATUS IN SETUP */}
                                <div className="flex items-center gap-4 mb-2 justify-center">
                                    <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20">
                                        <Zap className="size-4 text-primary" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Balance: {isLoadingCredits ? "..." : `${balance?.toLocaleString()} SCARLET`}</span>
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-30">Cost: 500 / Session</span>
                                </div>

                                {balance < 500 ? (
                                    <button onClick={() => navigate("/pricing")} className="btn btn-warning w-full h-24 rounded-[32px] border-none text-warning-content shadow-2xl font-black tracking-widest text-xl group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <AlertTriangle className="size-8 mr-2" />
                                        RECHARGE_REQUIRED (LOW_NODES)
                                    </button>
                                ) : (
                                    <button onClick={handleStartInterview} disabled={isLoading} className="btn bg-gradient-to-r from-primary via-secondary to-accent w-full h-24 rounded-[32px] border-none text-white shadow-2xl font-black tracking-widest text-xl group relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                        <PlayCircle className="size-8" />
                                        {isLoading ? "INITIALIZING_GAUNTLET..." : "INITIALIZE_INTERVIEW_ARENA"}
                                    </button>
                                )}

                            </div>
                        </motion.div>

                        {/* SESSION HISTORY SIDEBAR */}
                        <motion.div initial={{ x: 30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="lg:col-span-4 space-y-8">

                            <div className={`p-10 rounded-[48px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100 border border-black/5'} backdrop-blur-3xl shadow-3xl`}>
                                <header className="flex items-center gap-4 mb-8 opacity-40">
                                    <History className="size-5" />
                                    <span className="text-xs font-black uppercase tracking-widest">Archive_Timeline</span>
                                </header>

                                {(() => {
                                    if (cloudRecordings.length === 0) return <div className="py-20 text-center opacity-20 text-[10px] font-black uppercase tracking-widest">No_Archives_Found</div>;
                                    return (
                                        <div className="space-y-4 max-h-[500px] overflow-y-auto no-scrollbar pr-2">
                                            {cloudRecordings.map((rec, i) => (
                                                <div key={i} className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all cursor-pointer group shadow-xl">
                                                    <div className="flex items-center gap-4 justify-between mb-4">
                                                        <div className={`size-12 rounded-2xl flex items-center justify-center font-black italic text-xl ${rec.score >= 70 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                                                            {rec.score}
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-[10px] font-black uppercase opacity-40 tracking-tighter">{new Date(rec.createdAt).toLocaleDateString()}</p>
                                                            <p className="text-xs font-black italic text-primary">{rec.company}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between opacity-30 group-hover:opacity-100 transition-opacity">
                                                        <span className="text-[8px] font-black uppercase tracking-widest">{rec.interviewType}</span>
                                                        <ChevronRight className="size-3" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })()}

                            </div>

                            {/* RECRUITER TIP */}
                            <div className="p-10 rounded-[40px] bg-primary/5 border border-primary/10 shadow-3xl text-center space-y-4">
                                <Sparkles className="size-8 text-primary mx-auto animate-pulse" />

                                <p className="text-xs font-bold leading-relaxed opacity-60 italic tracking-tight">"Our FAANG-calibrated AI detects micro-hesitation in your code-flow. Keep your logic as clean as your imports."</p>
                            </div>

                        </motion.div>
                    </div>
                </div>
            </div>
        );
    }

    if (phase === "active") {
        return (
            <div className={`h-screen flex flex-col pt-24 font-sans ${isDark ? 'bg-[#050505] text-white' : 'bg-base-200 text-base-content'}`}>
                <Navbar />

                {/* Floating AI Coach Toast */}
                <AnimatePresence>
                    {showCoachMessage && (
                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50">
                            <div className="bg-primary/95 text-primary-content px-8 py-4 rounded-[32px] shadow-4xl backdrop-blur-3xl border border-white/10 flex items-center gap-4 cursor-pointer" onClick={() => setShowCoachMessage(false)}>
                                <Brain className="size-8 animate-pulse text-white" />
                                <span className="text-xs font-bold leading-none tracking-tight"><strong>CO-PILOT:</strong> {coachHint || "Ensure optimal time complexity."}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={`${isDark ? 'bg-black/80 border-white/10' : 'bg-base-100/80 border-base-300'} backdrop-blur-3xl px-8 h-16 flex justify-between items-center z-40 border-b shadow-sm`}>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-3 py-1 bg-error/10 border border-error/20 rounded-full animate-pulse">
                            <span className="size-2 bg-error rounded-full block"></span>
                            <span className="text-[9px] font-black uppercase tracking-widest text-error">REC_SYNC</span>
                        </div>
                        {warnings > 0 && <div className="badge badge-error gap-1 font-black text-[10px] uppercase tracking-widest">{warnings} RED_FLAGS</div>}
                    </div>

                    {emotionMode && (
                        <div className="flex items-center gap-6">
                            <div className={`flex items-center gap-3 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${currentStressLevel.bg} ${currentStressLevel.color} border-current backdrop-blur-xl`}>
                                <Activity className="size-3" /> {currentStressLevel.text}
                            </div>
                            <div className={`size-8 rounded-xl overflow-hidden ${isDark ? 'bg-black border-white/20' : 'bg-base-300 border-base-300'} border relative group`}>
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-8">
                        <div className="flex items-center gap-3 text-warning font-black italic text-xl tracking-tighter">
                            <Timer className="size-5" /> {formatTime(timeLeft)}
                        </div>
                        <button className="btn btn-error btn-xs h-8 px-5 rounded-lg font-black tracking-widest uppercase" onClick={handleEndInterview}>TERMINATE</button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    <div className={`${interviewType === "Behavioral" ? "w-full max-w-4xl mx-auto rounded-t-xl" : `w-[30%] border-r ${isDark ? 'border-white/10' : 'border-base-300'}`} ${isDark ? 'bg-black/40' : 'bg-base-200/50'} flex flex-col backdrop-blur-3xl`}>
                        <div className={`px-6 h-16 ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-base-300/50 border-base-300 text-base-content'} border-b font-black text-[10px] flex items-center justify-between uppercase tracking-[0.4em] opacity-60`}>
                            <span>Intelligence_Feed</span>
                            <div className="flex items-center gap-4">
                                <button onClick={() => setAudioEnabled(!audioEnabled)} className={`flex items-center gap-2 ${!audioEnabled && 'opacity-30'}`}>{audioEnabled ? <Mic className="size-3" /> : <Mic className="size-3 line-through" />} VOX</button>
                                <span className="flex items-center gap-1 text-primary"><Activity className="size-3" /> CORE_SYNC</span>
                            </div>
                        </div>

                        {/* Holographic AI Avatar Section */}
                        <div className={`h-64 border-b ${isDark ? 'border-white/10 bg-black/40 shadow-inner' : 'border-base-300 bg-base-300/40 shadow-sm'} relative overflow-hidden flex-shrink-0`}>
                            <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-end p-4">
                                <div className="flex items-center gap-2">
                                    <div className={`size-2 rounded-full ${aiSentiment === 'stressed' ? 'bg-error' : aiSentiment === 'impressed' ? 'bg-warning' : 'bg-primary'} animate-pulse`} />
                                    <span className={`text-[9px] font-black uppercase tracking-widest ${aiSentiment === 'stressed' ? 'text-error' : aiSentiment === 'impressed' ? 'text-warning' : 'text-primary'}`}>{isAISpeaking ? 'Transmitting...' : 'Idle'}</span>
                                </div>
                            </div>
                            <Canvas shadows gl={{ antialias: true, alpha: true }}>
                                <HolographicAvatar sentiment={aiSentiment} isSpeaking={isAISpeaking} />
                            </Canvas>
                        </div>

                        <div className="flex-1 p-8 overflow-y-auto space-y-8 pb-32 no-scrollbar">
                            {chatLog.map((chat, idx) => (
                                <div key={idx} className={`chat ${chat.role === 'assistant' ? 'chat-start' : 'chat-end'}`}>
                                    <div className="chat-image avatar hidden sm:block">
                                        <div className={`size-10 rounded-2xl ${chat.role === 'assistant' ? 'bg-primary shadow-lg shadow-primary/20 text-white' : isDark ? 'bg-white/10 text-white' : 'bg-base-300 text-base-content'} flex items-center justify-center border ${isDark ? 'border-white/10' : 'border-base-200'}`}>
                                            {chat.role === 'assistant' ? <Bot className="size-5" /> : <User className="size-5" />}
                                        </div>
                                    </div>
                                    <div className="chat-header text-[8px] font-black opacity-40 uppercase tracking-[0.3em] mb-2 px-1">
                                        {chat.role === 'assistant' ? (chat.content?.match(/^\[(.*?)\]/)?.[1] || "AI System") : "Candidate"}
                                    </div>
                                    <div className={`chat-bubble max-w-[85%] rounded-[24px] px-6 py-4 text-xs font-medium leading-relaxed shadow-sm border ${chat.role === 'assistant' ? (isDark ? 'bg-white/5 border-white/5 text-white/90' : 'bg-base-100 border-base-200 text-base-content/90') : 'bg-primary text-primary-content border-primary/20 font-black'}`}>
                                        {chat.content?.replace(/^\[.*?\]:\s*/, '') || (chat.text?.replace(/^\[.*?\]:\s*/, '')) || "Signal interrupted..."}
                                    </div>

                                </div>
                            ))}
                        </div>


                        <div className={`p-6 ${isDark ? 'bg-black/40 border-white/10' : 'bg-base-200/80 border-base-300'} border-t relative`}>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1">
                                            <input
                                                type="text"
                                                value={message}
                                                onChange={(e) => setMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                                                placeholder={isVoiceModeActive ? "Listening for explanation..." : "Describe your logic..."}
                                                className={`w-full bg-white/5 border ${isVoiceModeActive ? 'border-primary shadow-[0_0_20px_rgba(143,0,255,0.2)]' : 'border-white/10'} rounded-2xl h-16 px-6 font-medium focus:outline-none transition-all`}
                                            />
                                            {isVoiceModeActive && <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 items-end h-4">
                                                {[1,2,3,4].map(i => <motion.div key={i} animate={{ height: [4, 16, 4] }} transition={{ repeat: Infinity, delay: i*0.1 }} className="w-1 bg-primary rounded-full" />)}
                                            </div>}
                                        </div>
                                        <button 
                                            onClick={toggleVoiceMode}
                                            className={`btn size-16 rounded-2xl border-white/10 transition-all ${isVoiceModeActive ? 'bg-primary text-white' : 'bg-white/5 opacity-40 hover:opacity-100'}`}
                                        >
                                            <Mic className={isVoiceModeActive ? 'animate-pulse' : ''} />
                                        </button>
                                        <button onClick={() => handleSendMessage()} className="btn btn-primary size-16 rounded-2xl shadow-xl shadow-primary/20">
                                            <Send className="size-5" />
                                        </button>
                                    </div>
                        </div>
                    </div>

                    {interviewType !== "Behavioral" && (
                        <div className={`flex-1 flex flex-col ${isDark ? 'bg-black border-white/10' : 'bg-base-100 border-base-300'} border-l`}>
                            <div className={`h-16 border-b ${isDark ? 'border-white/10 bg-white/5' : 'border-base-300 bg-base-200/50'} px-8 flex items-center justify-between shadow-sm`}>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="size-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(var(--color-primary),1)]" />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">System_Terminal</span>
                                    </div>
                                    <div className={`flex items-center gap-4 border-l ${isDark ? 'border-white/10' : 'border-base-300'} pl-6`}>
                                        <div className="flex items-center gap-2 text-[10px] font-black opacity-60">
                                            <Timer className="size-3" />
                                            <span>Time: {liveComplexity.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black opacity-60">
                                            <Cpu className="size-3" />

                                            <span>Space: {liveComplexity.space}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={handleAIDebug} className="btn btn-ghost btn-xs text-[10px] font-black uppercase tracking-widest gap-2"><Bug className="size-3" /> Reveal_Bugs</button>
                                    <button onClick={handleAskCoach} className="btn btn-primary btn-xs h-8 px-6 rounded-lg font-black tracking-widest uppercase shadow-lg shadow-primary/20">Ask_Coach</button>
                                    <button onClick={handleRunCode} className={`btn border-none btn-xs h-8 px-6 rounded-lg font-black tracking-widest uppercase ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-base-300 hover:bg-base-300/80 text-base-content'}`}>Execute</button>
                                </div>
                            </div>
                            <div className="flex-1 relative overflow-hidden">
                                <Editor height="100%" language={language} value={code} onChange={setCode} theme={isDark ? "vs-dark" : "light"} options={{ minimap: { enabled: false }, fontSize: 16, cursorBlinking: "smooth", smoothScrolling: true, padding: { top: 32, left: 32 } }} />

                                <div className="absolute bottom-8 right-8 space-y-3 pointer-events-none">
                                    <div className={`p-6 rounded-3xl ${isDark ? 'bg-black/60 border-white/10 text-white' : 'bg-base-100/90 border-base-300 text-base-content'} backdrop-blur-3xl border max-w-sm shadow-xl text-left space-y-2`}>
                                        <p className="text-[9px] font-black uppercase tracking-widest text-primary">Active_Prompt</p>
                                        <p className="text-xs font-bold leading-relaxed opacity-70 italic">{problemContext}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (phase === "feedback") {
        return (
            <div className={`min-h-screen pt-24 transition-colors duration-700 font-sans relative overflow-x-hidden ${isDark ? 'bg-[#050505] text-white' : 'bg-base-300'}`}>
                <Navbar />
                <div className="max-w-5xl mx-auto px-6 pb-32 relative z-10 flex flex-col items-center">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`w-full p-1 rounded-[64px] ${isDark ? 'bg-white/5 border border-white/10' : 'bg-base-100'} backdrop-blur-3xl shadow-3xl text-center`}>
                        <div className="p-20 space-y-12">
                            <div className="space-y-4">
                                <div className={`size-32 mx-auto rounded-full flex items-center justify-center font-black italic text-6xl ${aiFeedback?.score >= 70 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'} shadow-2xl ring-4 ring-white/5`}>
                                    {aiFeedback?.score || 0}
                                </div>
                                <h2 className="text-6xl font-black italic tracking-tighter uppercase">Evaluation Session Complete</h2>
                                <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-40">Synchronized_Dossier_Generated</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                                <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">Core_Strengths</p>
                                    <ul className="space-y-4">
                                        {aiFeedback?.strengths?.map((s, i) => <li key={i} className="flex items-center gap-4 text-xs font-bold"><CheckCircle className="size-4 text-success" /> {s}</li>)}
                                    </ul>
                                </div>
                                <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 space-y-6">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-error">Anomalies_Detected</p>
                                    <ul className="space-y-4">
                                        {aiFeedback?.weaknesses?.map((w, i) => <li key={i} className="flex items-center gap-4 text-xs font-bold"><XCircle className="size-4 text-error" /> {w}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 text-left space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40 italic">Final_Decision_Matrix</p>
                                <p className="text-sm font-medium leading-relaxed italic opacity-80">"{aiFeedback?.feedback}"</p>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => window.location.reload()} className="btn btn-primary h-20 flex-1 rounded-[32px] font-black tracking-widest shadow-2xl shadow-primary/20">RE_DEPLOY_GAUNTLET</button>
                                <button onClick={() => window.location.href = '/dashboard'} className="btn bg-white/5 hover:bg-white/10 text-white border-white/10 h-20 flex-1 rounded-[32px] font-black tracking-widest">EXIT_SESSION</button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    return null;
}

export default InterviewPage;
