import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import {
    Bot, Mic, AlertTriangle, UploadCloud,
    Clock, Settings, Play, CheckCircle,
    XCircle, Zap, Eye, Activity, PlayCircle, Send,
    Wand2, Bug, Camera, Keyboard, Brain, FileWarning, Code2, Users, LayoutDashboard,
    ListTree, Timer, Network, TerminalSquare, ChevronRight
} from "lucide-react";
import Editor from "@monaco-editor/react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";
import { executeCode } from "../lib/piston";

function InterviewPage() {
    const [phase, setPhase] = useState("setup"); // setup, active, feedback
    const [isLoading, setIsLoading] = useState(false);

    // AI Coach State
    const [showCoachMessage, setShowCoachMessage] = useState(false);
    const [coachHint, setCoachHint] = useState("");
    const [isAskingCoach, setIsAskingCoach] = useState(false);

    // Setup State
    const [resumeUploaded, setResumeUploaded] = useState(false);
    const [stressMode, setStressMode] = useState(false);
    const [emotionMode, setEmotionMode] = useState(true);
    const [selectedCompany, setSelectedCompany] = useState("Google");
    const [interviewType, setInterviewType] = useState("DSA"); // DSA, GitHubPR, Behavioral
    const [problemContext, setProblemContext] = useState("Find all duplicates in an array in O(n) time and O(1) space.");

    // Advanced F3 & F4 State
    const [githubUrl, setGithubUrl] = useState("");
    const [aggressionLevel, setAggressionLevel] = useState(5);

    // Active State
    const [code, setCode] = useState("function solution(arr) {\n  // Write your optimized solution here\n  \n}");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [warnings, setWarnings] = useState(0);
    const [chatInput, setChatInput] = useState("");
    const [chatLog, setChatLog] = useState([
        { role: "ai", text: "[Hiring Manager]: Hello! We are your FAANG interviewing panel today. We have a DSA Engineer, a System Design Engineer, and myself. To start testing you, please write your initial algorithm or talk to us about your thoughts before coding." }
    ]);
    const [isRecordingVoice, setIsRecordingVoice] = useState(false);

    // Feedback State
    const [aiFeedback, setAiFeedback] = useState(null);
    const [refactoredCode, setRefactoredCode] = useState("");
    const [isRefactoring, setIsRefactoring] = useState(false);

    // Live Voice Recognition State
    const [hasSpeechSupport] = useState('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);
    const recognitionRef = useRef(null);

    // Live AI Complexity State
    const [liveComplexity, setLiveComplexity] = useState({ time: "O(?)", space: "O(?)" });
    const [isCalculatingComplexity, setIsCalculatingComplexity] = useState(false);

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

            // Mock live analytics
            const interval = setInterval(() => {
                const rand = Math.random();
                if (rand > 0.8) setCurrentStressLevel({ text: "High (Stressed)", color: "text-error", bg: "bg-error/10" });
                else if (rand > 0.4) setCurrentStressLevel({ text: "Medium (Focused)", color: "text-warning", bg: "bg-warning/10" });
                else setCurrentStressLevel({ text: "Low (Calm)", color: "text-success", bg: "bg-success/10" });
            }, 5000);

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

    // F1: Live AI Voice Synthesis Engine
    useEffect(() => {
        if (!audioEnabled || !window.speechSynthesis || chatLog.length === 0) return;
        const lastChat = chatLog[chatLog.length - 1];

        if (lastChat.role === "ai" && phase === "active") {
            const textToSpeak = lastChat.text.replace(/^\[.*?\]:\s*/, "");
            const utterance = new SpeechSynthesisUtterance(textToSpeak);

            // Map Personas to Voice Profiles
            if (lastChat.text.includes("[DSA Engineer]")) {
                utterance.pitch = 1.3;
                utterance.rate = 1.1; // Fast, algorithmic
            } else if (lastChat.text.includes("[System Design Engineer]")) {
                utterance.pitch = 0.8;
                utterance.rate = 0.9; // Deep, slow
            } else if (lastChat.text.includes("[Hiring Manager]")) {
                utterance.pitch = 1.0;
                utterance.rate = 1.0; // Standard
            }
            window.speechSynthesis.speak(utterance);
        }
    }, [chatLog, audioEnabled, phase]);

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
                setChatInput((prev) => prev + " " + finalTranscript.trim());
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

    // Tab change detection & Emotion Tracking Mock
    useEffect(() => {
        if (phase !== "active") return;

        // Auto Coach hint
        const coachTimer = setTimeout(async () => {
            try {
                const res = await axiosInstance.post("/interview/coach", { code, problemContext });
                if (res.data.hint) {
                    setCoachHint(res.data.hint);
                    setShowCoachMessage(true);
                }
            } catch (e) { }
        }, 120000); // 2 minutes in

        const handleVisibilityChange = () => {
            if (document.hidden) {
                setWarnings(prev => prev + 1);
                toast.error("WARNING: Tab switch detected! (Anti-Cheat Mechanism)", { icon: '🚨', duration: 4000 });
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            clearTimeout(coachTimer);
        };
    }, [phase]);

    // F3: Pressure Cooker & Stress Mode Drop
    useEffect(() => {
        if (phase === "active") {
            const timer = setInterval(() => {
                setTimeLeft(prev => {
                    if (stressMode && prev > 300 && Math.random() > 0.96) {
                        toast('PRESSURE COOKER: Constraints suddenly mutated!', { icon: '🚨', style: { background: '#ef4444', color: '#fff' } });
                        // Feature 3: Dynamic Constraint Mutation
                        setChatLog(logs => [...logs, { role: "ai", text: "[System Design Engineer]: I just checked production. We are severely memory constrained right now. You must optimize your space complexity to strictly O(1) immediately or the servers will crash." }]);
                        return prev - 180; // lose 3 minutes and shift constraints
                    }
                    return prev - 1;
                });
            }, 1000);

            // True Emotion Telemetry using Gemini Vision
            const emotionTimer = setInterval(async () => {
                if (videoRef.current && emotionMode) {
                    try {
                        const canvas = document.createElement("canvas");
                        canvas.width = videoRef.current.videoWidth;
                        canvas.height = videoRef.current.videoHeight;
                        const ctx = canvas.getContext("2d");
                        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                        const imageBase64 = canvas.toDataURL("image/jpeg", 0.5);

                        const res = await axiosInstance.post("/interview/analyze-emotion", { imageFile: imageBase64 });
                        if (res.data.text) {
                            setCurrentStressLevel({
                                text: res.data.text,
                                color: res.data.stressLevel > 70 ? "text-error" : "text-success",
                                bg: res.data.stressLevel > 70 ? "bg-error/10" : "bg-success/10"
                            });

                            if (res.data.actionableHint && res.data.stressLevel > 70) {
                                setCoachHint("Proactive AI Hint based on your hesitation: " + res.data.actionableHint);
                                setShowCoachMessage(true);
                            }
                        }
                    } catch (err) {
                        console.warn("Emotion telemetry failed");
                    }
                }
            }, 30000); // Analyze every 30s

            return () => {
                clearInterval(timer);
                clearInterval(emotionTimer);
            };
        }
    }, [phase, stressMode, emotionMode]);

    // File Upload Ref
    const fileInputRef = useRef(null);

    const handleFileUploadChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsLoading(true);
        toast("Reading File...", { icon: '📄' });

        try {
            const reader = new FileReader();
            reader.onload = async (event) => {
                const text = event.target.result;
                setResumeUploaded(true);

                // Real Call
                const res = await axiosInstance.post("/interview/analyze-resume", {
                    resumeText: text.substring(0, 5000) // limit to avoid token limits
                });

                const data = res.data;
                toast.success("Resume parsed successfully!");
                setProblemContext(data.suggestedProblem || problemContext);
                setChatLog([
                    { role: "ai", text: `Hello! I see you have experience with ${data.skills?.join(", ") || 'Modern Tech'}. Let's test that. ${data.suggestedProblem}` }
                ]);
                setIsLoading(false);
            };
            reader.readAsText(file); // Only fully readable for TXT/CSV/MD, else extracts raw
        } catch (err) {
            toast.error("Failed to read file.");
            setIsLoading(false);
        }
    };

    const handleSendMessage = async () => {
        if (!chatInput.trim()) return;
        const newLog = [...chatLog, { role: "user", text: chatInput }];
        setChatLog(newLog);
        setChatInput("");
        setIsLoading(true);

        try {
            const res = await axiosInstance.post("/interview/chat", {
                chatLog: newLog,
                code: code,
                interviewType,
                hostility: aggressionLevel
            });
            setChatLog([...newLog, { role: "ai", text: res.data.reply }]);
        } catch {
            setChatLog([...newLog, { role: "ai", text: "Network error reading AI. (Ensure GEMINI_API_KEY is active in .env)" }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunCode = async () => {
        toast("Running code with Piston engine...", { icon: '⚙️' });
        try {
            const output = await executeCode(language, code);
            toast.success("Code Ran! Output: " + (output.run.stdout || "Success"));
        } catch {
            toast.error("Execution error!");
        }
    };

    // F2: Trace Engine Trigger
    const handleTraceExecution = async () => {
        toast.loading("AI tracing variables & call stack...", { id: "trace" });
        setIsTracing(!isTracing);
        try {
            const res = await axiosInstance.post("/interview/trace", { code });
            setTraceData(res.data.steps || [{ line: 1, text: "Mock Trace step..." }]);
            toast.success("Trace complete!", { id: "trace" });
        } catch (err) {
            toast.error("Trace failed.", { id: "trace" });
        }
    };

    // F4: Auto Draw trigger
    const handleAutoDraw = async () => {
        toast.loading("Generating Diagram...", { id: "draw" });
        setIsGeneratingDiagram(true);
        try {
            const res = await axiosInstance.post("/interview/auto-draw", { code, chatLog });
            setMermaidDiagram(res.data.mermaid);
            toast.success("Architecture mapped!", { id: "draw" });
        } catch (err) {
            toast.error("Diagram failed.", { id: "draw" });
            setIsGeneratingDiagram(false);
        }
    };

    // Advanced API Calls
    const handleAIDebug = async () => {
        toast.loading("AI Debugger analyzing logic...", { id: "debugger" });
        try {
            const res = await axiosInstance.post("/interview/debug", { code });
            toast.success("Debug complete!", { id: "debugger" });
            setChatLog([...chatLog, { role: "ai", text: `[AI Debugger]: ${res.data.feedback}` }]);
        } catch {
            toast.error("Debugger failed.", { id: "debugger" });
        }
    };

    const handleGenerateEdgeCases = () => {
        toast.success("Generated edge cases!", { icon: "🔥" });
        setChatLog([...chatLog, { role: "ai", text: `Try these tricky edge cases: \n1. Empty Array [] \n2. Very large input [10^9, 10^9] \n3. Negative Constraints` }]);
    };

    const handleAskCoach = async () => {
        setIsAskingCoach(true);
        toast.loading("Copilot analyzing context...", { id: "coach" });
        try {
            const res = await axiosInstance.post("/interview/coach", { code, problemContext });
            setCoachHint(res.data.hint);
            setShowCoachMessage(true);
            toast.dismiss("coach");
        } catch {
            toast.error("Copilot AI failed.", { id: "coach" });
        } finally {
            setIsAskingCoach(false);
        }
    };

    const handleRefactorCode = async () => {
        setIsRefactoring(true);
        try {
            const res = await axiosInstance.post("/interview/refactor", { code });
            setRefactoredCode(res.data.refactored);
            toast.success("Refactored by AI!");
        } catch {
            toast.error("Refactor failed.");
        } finally {
            setIsRefactoring(false);
        }
    };

    const handleEndInterview = async () => {
        toast("Submitting code to AI evaluator...", { icon: '🧠' });
        setPhase("feedback");
        try {
            const res = await axiosInstance.post("/interview/evaluate", {
                code,
                problemContext
            });
            setAiFeedback(res.data);
            toast.success("Evaluation complete!");

            // Feature #11: Save interview recording to localStorage
            const recording = {
                id: Date.now(),
                company: selectedCompany,
                type: interviewType,
                date: new Date().toISOString(),
                duration: 45 * 60 - timeLeft,
                chatLog: chatLog,
                codeSnapshots: replayTimeline,
                score: res.data.score || 0,
                feedback: res.data.feedback || "",
            };
            const recordings = JSON.parse(localStorage.getItem("interviewRecordings") || "[]");
            recordings.push(recording);
            localStorage.setItem("interviewRecordings", JSON.stringify(recordings));
            // Track interview count for badges
            const count = parseInt(localStorage.getItem("interviewCount") || "0", 10);
            localStorage.setItem("interviewCount", String(count + 1));

        } catch {
            toast.error("Evaluation failed.");
            setAiFeedback({
                strengths: ["Network Failed"],
                weaknesses: ["Check Node backend logs"],
                score: 0,
                feedback: "The server threw a network or parse error.",
                plagiarismScore: 100,
                keyboardEfficiency: 0,
                timeToInsight: "N/A",
                personalityScore: "N/A",
                evolutionTimeline: ["Crash"],
                bottlenecks: [{ "line": "Error", "timeSpent": "N/A" }]
            });
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleStartInterview = async () => {
        setIsLoading(true);
        if (interviewType === "GitHubPR") {
            if (!githubUrl) {
                toast.error("Please enter a valid GitHub URL.");
                return setIsLoading(false);
            }
            try {
                const res = await axiosInstance.post("/interview/github-mock", { githubUrl });
                if (res.data.problemContext) {
                    setProblemContext(res.data.problemContext);
                    setChatLog([{ role: "ai", text: `[System Design Engineer]: ${res.data.firstMessage}` }]);
                    setPhase("active");
                }
            } catch (e) {
                toast.error("Failed to parse GitHub repository.");
            }
        } else if (interviewType === "Behavioral") {
            setChatLog([{ role: "ai", text: `[Hiring Manager]: Welcome to the final behavioral round. I'll be acting strictly as the Hiring Manager today. To start us off, tell me about a time you had to deal with a severe conflict with a senior engineer.` }]);
            setPhase("active");
        } else {
            // DSA Setup
            setChatLog([{ role: "ai", text: "[Hiring Manager]: Hello! We are your FAANG interviewing panel today. We have a DSA Engineer, a System Design Engineer, and myself. To start testing you, please write your initial algorithm or talk to us about your thoughts before coding." }]);
            setPhase("active");
        }
        setIsLoading(false);
    };

    if (phase === "setup") {
        return (
            <div className="min-h-screen bg-base-200 flex flex-col">
                <Navbar />
                <div className="flex-1 flex items-center justify-center p-4">
                    <div className="card bg-base-100 shadow-2xl w-full max-w-4xl border border-primary/20">
                        <div className="card-body">
                            <h2 className="text-4xl font-black text-center mb-8 flex items-center justify-center gap-4">
                                <Bot className="size-12 text-primary" /> Ultimate AI Interviewer
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <h3 className="font-bold text-xl border-b border-base-200 pb-2">1. Profile & Environment</h3>
                                    {/* Resume Upload */}
                                    <input type="file" accept=".txt,.md,.pdf,.doc,.docx" ref={fileInputRef} className="hidden" onChange={handleFileUploadChange} />
                                    <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${resumeUploaded ? 'border-success bg-success/5' : 'border-base-300 hover:border-primary/50 cursor-pointer'}`}
                                        onClick={() => !resumeUploaded && fileInputRef.current?.click()}>
                                        {resumeUploaded ? (
                                            <div className="flex flex-col items-center text-success">
                                                <CheckCircle className="size-8 mb-2" />
                                                <span className="font-bold">Resume Parsed & Uploaded</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-base-content/60">
                                                <UploadCloud className="size-8 mb-2" />
                                                <span className="font-bold">Click to Upload Resume Text</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Feature #12: FAANG Company Templates */}
                                    <div className="bg-base-200 p-4 rounded-xl">
                                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                            <ListTree className="size-4" /> Company Interview Template
                                        </h4>
                                        <select className="select select-bordered w-full select-sm" value={selectedCompany} onChange={(e) => {
                                            setSelectedCompany(e.target.value);
                                            // Auto-configure based on company
                                            if (e.target.value === "Google") {
                                                setTimeLeft(45 * 60); setAggressionLevel(6); setInterviewType("DSA");
                                            } else if (e.target.value === "Meta") {
                                                setTimeLeft(35 * 60); setAggressionLevel(5); setInterviewType("DSA");
                                            } else if (e.target.value === "Amazon") {
                                                setTimeLeft(60 * 60); setAggressionLevel(8); setInterviewType("Behavioral");
                                            } else if (e.target.value === "Apple") {
                                                setTimeLeft(40 * 60); setAggressionLevel(4); setInterviewType("DSA");
                                            } else if (e.target.value === "Startup") {
                                                setTimeLeft(30 * 60); setAggressionLevel(3); setInterviewType("GitHubPR");
                                            }
                                        }}>
                                            <option value="Google">Google — 45min, 2 Coding Rounds, Focus Optimality</option>
                                            <option value="Meta">Meta — 35min, 1 Round + System Design</option>
                                            <option value="Amazon">Amazon — 60min, Leadership Principles + Bar Raiser</option>
                                            <option value="Apple">Apple — 40min, Clean Code Architecture</option>
                                            <option value="Startup">Startup — 30min, Full-Stack + Product</option>
                                        </select>
                                        <div className="text-[10px] mt-2 text-base-content/50 font-bold">
                                            Auto-configured: {selectedCompany === "Google" ? "45min timer, aggression 6/10" : selectedCompany === "Meta" ? "35min timer, aggression 5/10" : selectedCompany === "Amazon" ? "60min timer, aggression 8/10, behavioral mode" : selectedCompany === "Apple" ? "40min timer, aggression 4/10" : "30min timer, aggression 3/10, GitHub PR mode"}
                                        </div>
                                    </div>

                                    {/* Problem Type */}
                                    <div className="bg-base-200 p-4 rounded-xl">
                                        <h4 className="font-bold text-sm mb-2 flex items-center gap-2">
                                            <Code2 className="size-4" /> Interview Format
                                        </h4>
                                        <select className="select select-bordered w-full select-sm mb-2" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
                                            <option value="DSA">Standard Algorithm (DSA)</option>
                                            <option value="Behavioral">Behavioral (STAR Method)</option>
                                            <option value="GitHubPR">Real World (GitHub PR Mock)</option>
                                        </select>

                                        {interviewType === "GitHubPR" && (
                                            <input
                                                type="text"
                                                className="input input-sm input-bordered w-full mt-2 placeholder-opacity-50"
                                                placeholder="https://github.com/facebook/react"
                                                value={githubUrl}
                                                onChange={e => setGithubUrl(e.target.value)}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <h3 className="font-bold text-xl border-b border-base-200 pb-2">2. Pressure Cooker Options</h3>

                                    <div className="bg-error/10 p-4 rounded-xl border border-error/20">
                                        <div className="flex justify-between mb-2">
                                            <h4 className="font-bold text-error flex items-center gap-2">
                                                Interviewer Hostility <AlertTriangle className="size-4" />
                                            </h4>
                                            <span className="text-error font-bold">{aggressionLevel}/10</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1" max="10"
                                            value={aggressionLevel}
                                            className="range range-error range-xs"
                                            onChange={(e) => setAggressionLevel(e.target.value)}
                                        />
                                        <div className="w-full flex justify-between text-[10px] px-2 mt-1 opacity-70">
                                            <span>Kind</span>
                                            <span>Bar Raiser</span>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-xl border-b border-base-200 pb-2">2. Constraints & Modes</h3>

                                    {/* Stress Mode Toggle */}
                                    <div className="flex items-center gap-4 bg-error/10 p-4 rounded-xl border border-error/20 cursor-pointer" onClick={() => setStressMode(!stressMode)}>
                                        <input type="checkbox" className="toggle toggle-error" checked={stressMode} readOnly />
                                        <div>
                                            <h4 className="font-bold text-error flex items-center gap-2">
                                                Stress Mode <Zap className="size-4" />
                                            </h4>
                                            <p className="text-xs text-error/80">Timer jumps, interruptive questions, strict constraints.</p>
                                        </div>
                                    </div>

                                    {/* Emotion Mode Toggle View */}
                                    <div className="flex items-center gap-4 bg-info/10 p-4 rounded-xl border border-info/20 cursor-pointer" onClick={() => setEmotionMode(!emotionMode)}>
                                        <input type="checkbox" className="toggle toggle-info" checked={emotionMode} readOnly />
                                        <div>
                                            <h4 className="font-bold text-info flex items-center gap-2">
                                                Emotion-Aware Mode <Camera className="size-4" />
                                            </h4>
                                            <p className="text-xs text-info/80">Uses webcam to measure confidence & hesitation.</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 bg-secondary/10 p-4 rounded-xl border border-secondary/20">
                                        <input type="checkbox" className="toggle toggle-secondary" defaultChecked />
                                        <div>
                                            <h4 className="font-bold text-secondary flex items-center gap-2">
                                                AI Coding Coach <Brain className="size-4" />
                                            </h4>
                                            <p className="text-xs text-secondary/80">Floating real-time hints and complexity tracking.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="card-actions mt-10">
                                <button className="btn btn-primary w-full text-lg h-16" onClick={handleStartInterview} disabled={isLoading}>
                                    {isLoading ? <span className="loading loading-spinner"></span> : "Enter Interview Arena"}
                                </button>
                                <div className="w-full flex justify-between text-xs text-base-content/50 px-2 mt-2">
                                    <span className="flex items-center gap-1"><Users className="size-3" /> Go to Multiplayer Arena instead</span>
                                    <span className="flex items-center gap-1"><LayoutDashboard className="size-3" /> System Design Whiteboard</span>
                                </div>

                                {/* Feature #11: Past Interview Recordings */}
                                {(() => {
                                    const recordings = JSON.parse(localStorage.getItem("interviewRecordings") || "[]");
                                    if (recordings.length === 0) return null;
                                    return (
                                        <div className="w-full mt-6">
                                            <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-base-content/70">
                                                <TerminalSquare className="size-4" /> Past Interview Recordings ({recordings.length})
                                            </h4>
                                            <div className="space-y-2 max-h-48 overflow-y-auto">
                                                {recordings.slice().reverse().map((rec, i) => (
                                                    <div key={rec.id || i} className="flex items-center justify-between px-4 py-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary/30 transition-colors cursor-pointer"
                                                        onClick={() => {
                                                            // Load recording into chat replay
                                                            if (rec.chatLog && rec.chatLog.length > 0) {
                                                                setChatLog(rec.chatLog);
                                                                setPhase("active");
                                                                toast.success("Loaded interview replay!");
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`size-8 rounded-lg flex items-center justify-center text-xs font-black ${rec.score >= 70 ? 'bg-success/10 text-success' : rec.score >= 40 ? 'bg-warning/10 text-warning' : 'bg-error/10 text-error'}`}>
                                                                {rec.score}
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-bold">{rec.company || "Interview"} — {rec.type || "DSA"}</div>
                                                                <div className="text-[10px] text-base-content/40">
                                                                    {new Date(rec.date).toLocaleDateString()} • {Math.floor(rec.duration / 60)}m {rec.duration % 60}s
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="size-4 text-base-content/30" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }

    if (phase === "active") {
        return (
            <div className="h-screen bg-base-300 flex flex-col pt-16">
                <Navbar />

                {/* Floating AI Coach Toast */}
                {showCoachMessage && (
                    <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
                        <div className="alert alert-info shadow-xl border border-info max-w-lg cursor-pointer" onClick={() => setShowCoachMessage(false)}>
                            <Brain className="size-8 min-w-[32px] animate-pulse" />
                            <span className="text-sm"><strong>AI Copilot:</strong> {coachHint || "You might want to ensure your edge cases are optimal."}</span>
                        </div>
                    </div>
                )}

                <div className="bg-neutral text-neutral-content p-2 flex justify-between items-center shadow-md z-40 border-b border-primary/20">
                    <div className="flex items-center gap-4">
                        <div className="badge badge-error gap-2 font-bold animate-pulse">
                            <span className="size-2 bg-red-500 rounded-full block"></span> REC
                        </div>
                        {warnings > 0 && (
                            <div className="badge badge-error gap-1 animate-pulse font-bold">
                                <AlertTriangle className="size-3" /> {warnings} Flags
                            </div>
                        )}
                    </div>

                    {/* Live Camera Feed */}
                    {emotionMode && (
                        <div className="flex items-center gap-4">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors duration-500 ${currentStressLevel.bg} ${currentStressLevel.color} border-current`}>
                                <Activity className="size-4 animate-pulse" /> {currentStressLevel.text}
                            </div>
                            <div className="size-10 rounded-full overflow-hidden bg-black border-2 border-primary/50 relative group">
                                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                                <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-[8px] font-bold text-white text-center">LIVE</div>
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-warning font-mono font-bold text-xl">
                            <Clock className="size-5" /> {formatTime(timeLeft)}
                        </div>
                        <button className="btn btn-error btn-sm gap-2 font-bold" onClick={handleEndInterview}>
                            End Interview
                        </button>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* LEFT CHAT PANEL (OR FULL SCREEN IF BEHAVIORAL) */}
                    <div className={`${interviewType === "Behavioral" ? "w-full max-w-4xl mx-auto rounded-t-xl" : "w-[30%] border-r"} bg-base-100 border-base-300 flex flex-col`}>
                        <div className="p-3 bg-base-200 border-b border-base-300 font-bold flex items-center justify-between text-sm">
                            <span>Interviewer</span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setAudioEnabled(!audioEnabled)}
                                    className={`btn btn-xs btn-ghost gap-1 ${!audioEnabled && 'opacity-50'}`}
                                >
                                    {audioEnabled ? <Mic className="size-3" /> : <Mic className="size-3 line-through" />}
                                    Auto-Voice
                                </button>
                                <div className="flex items-center gap-1 text-xs text-primary font-semibold">
                                    <Activity className="size-4" /> Live AI Core
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 p-4 overflow-auto space-y-4 pb-20 text-sm">
                            {chatLog.map((chat, idx) => (
                                <div key={idx} className={`chat ${chat.role === 'ai' ? 'chat-start' : 'chat-end'}`}>
                                    <div className="chat-image avatar hidden sm:block">
                                        <div className={`w-8 rounded-full ${chat.role === 'ai' ? (chat.text.startsWith('[DSA') ? 'bg-primary' : chat.text.startsWith('[System') ? 'bg-secondary' : chat.text.startsWith('[Hiring') ? 'bg-accent' : 'bg-primary') : 'bg-base-content'} flex items-center justify-center text-white`}>
                                            {chat.role === 'ai' ? (
                                                chat.text.startsWith('[DSA') ? <Code2 className="size-4" /> :
                                                    chat.text.startsWith('[System') ? <Network className="size-4" /> :
                                                        chat.text.startsWith('[Hiring') ? <Users className="size-4" /> :
                                                            <Bot className="size-4" />
                                            ) : <Mic className="size-4" />}
                                        </div>
                                    </div>
                                    <div className="chat-header text-xs opacity-50 mb-1 ml-1">
                                        {chat.role === 'ai'
                                            ? (chat.text.match(/^\[(.*?)\]/)?.[1] || "AI System")
                                            : "You"}
                                    </div>
                                    <div className={`chat-bubble ${chat.role === 'ai' ? 'bg-base-300 text-base-content' : 'bg-primary text-primary-content'}`}>
                                        {chat.text.replace(/^\[.*?\]:\s*/, '')}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="chat chat-start">
                                    <div className="chat-bubble bg-base-300 text-base-content opacity-50 flex gap-2">
                                        <span className="loading loading-dots loading-xs"></span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-base-300 bg-base-200 shadow-inner flex flex-col gap-2">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    className="input input-bordered input-sm w-full"
                                    placeholder="Speak your thoughts..."
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <button
                                    className={`btn btn-square btn-sm ${isRecordingVoice ? 'btn-error animate-pulse' : 'btn-ghost'} ${!hasSpeechSupport && 'opacity-50 cursor-not-allowed'}`}
                                    onMouseDown={() => hasSpeechSupport && setIsRecordingVoice(true)}
                                    onMouseUp={() => hasSpeechSupport && setIsRecordingVoice(false)}
                                    onMouseLeave={() => hasSpeechSupport && setIsRecordingVoice(false)}
                                    title={hasSpeechSupport ? "Hold to Voice Chat" : "Voice not supported"}
                                >
                                    <Mic className="size-4" />
                                </button>
                                <button className="btn btn-primary btn-square btn-sm" onClick={handleSendMessage} disabled={isLoading}>
                                    <Send className="size-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT EDITOR PANEL (HIDDEN IF BEHAVIORAL) */}
                    {interviewType !== "Behavioral" && (
                        <div className="w-[70%] flex flex-col">
                            <div className="p-2 bg-base-200 border-b border-base-300 flex justify-between items-center text-sm">
                                {/* Personalization & Language */}
                                <div className="flex items-center gap-2">
                                    <select className="select select-bordered select-xs" value={language} onChange={e => setLanguage(e.target.value)}>
                                        <option value="javascript">JavaScript</option>
                                        <option value="python">Python</option>
                                        <option value="java">Java</option>
                                    </select>
                                    <select className="select select-bordered select-xs" value={theme} onChange={e => setTheme(e.target.value)}>
                                        <option value="vs-dark">Dark Mode</option>
                                        <option value="light">Light Mode</option>
                                    </select>
                                    <button className="btn btn-xs btn-outline btn-info gap-1" onClick={handleGenerateEdgeCases}>
                                        <Bug className="size-3" /> AI Edge Cases
                                    </button>
                                    <button className="btn btn-xs btn-outline btn-secondary gap-1" onClick={handleAutoDraw}>
                                        <ListTree className="size-3" /> Auto-Draw System
                                    </button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <button className="btn btn-xs btn-outline btn-primary gap-1" onClick={handleTraceExecution}>
                                        <Activity className="size-3" /> {isTracing ? "Hide Trace" : "Trace Code"}
                                    </button>
                                    <button className="btn btn-warning btn-xs gap-1" onClick={handleAIDebug}>
                                        <Wand2 className="size-3" /> AI Debug
                                    </button>
                                    <button className="btn btn-success btn-xs gap-1 font-bold" onClick={handleRunCode}>
                                        <Play className="size-3 fill-current" /> Run
                                    </button>
                                </div>
                            </div>

                            {/* Mermaid Diagram Overlay modal-style block */}
                            {mermaidDiagram && (
                                <div className="absolute top-20 left-1/4 z-50 bg-base-100 p-6 rounded-xl shadow-2xl border border-primary/30 w-1/2">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-bold flex items-center gap-2"><Network className="size-4 text-secondary" /> AI Architecture Generator</h4>
                                        <button className="btn btn-xs btn-ghost" onClick={() => setMermaidDiagram(null)}><XCircle className="size-4" /></button>
                                    </div>
                                    <div className="p-4 bg-base-200 rounded-lg overflow-auto font-mono text-xs whitespace-pre">
                                        {/* Usually we'd use a mermaid react package here. Mocking for display */}
                                        <div className="text-secondary opacity-70 mb-2">// Mermaid Architecture Payload Generated by System Design AI:</div>
                                        {mermaidDiagram}
                                    </div>
                                </div>
                            )}

                            <Editor
                                height={isTracing ? "60%" : "100%"}
                                theme={theme}
                                language={language}
                                value={code}
                                onChange={(newValue) => setCode(newValue || "")}
                                options={{ minimap: { enabled: false }, fontSize: 14 }}
                            />

                            {/* F2: AI Execution Trace Panel */}
                            {isTracing && (
                                <div className="flex-1 border-t border-base-300 bg-base-200 p-2 overflow-auto relative">
                                    <h4 className="font-bold text-xs uppercase text-primary/70 mb-2 sticky top-0 bg-base-200 pb-1 z-10">Step-by-step Trace Visualizer</h4>
                                    {traceData ? (
                                        <div className="space-y-2">
                                            {traceData.map((step, idx) => (
                                                <div key={idx} className="bg-base-100 p-2 rounded border border-base-300 text-xs font-mono animate-fade-in flex gap-3">
                                                    <div className="min-w-6 text-primary font-bold">L{step.line || idx + 1}</div>
                                                    <div className="flex-1 opacity-80">{step.text}</div>
                                                    {step.vars && <div className="text-secondary">{JSON.stringify(step.vars)}</div>}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-full flex items-center justify-center opacity-50"><span className="loading loading-spinner"></span></div>
                                    )}
                                </div>
                            )}

                            {/* LIVE Code Complexity Overlay */}
                            <div className="absolute bottom-4 right-4 z-10 bg-base-100/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border border-primary/30 text-xs font-mono transition-all">
                                <div className="font-bold border-b border-base-300 pb-1 mb-1 flex items-center gap-2">
                                    <Activity className="size-3 text-info" /> AI Complexity
                                    {isCalculatingComplexity && <span className="loading loading-spinner loading-xs text-info ml-auto"></span>}
                                </div>
                                <div className="flex justify-between gap-4 mt-2"><span>Space:</span> <span className="text-success font-bold">{liveComplexity.space}</span></div>
                                <div className="flex justify-between gap-4"><span>Time:</span> <span className="text-warning font-bold">{liveComplexity.time}</span></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // FEEDBACK PHASE
    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8 w-full">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 flex items-center justify-center gap-3">
                        <CheckCircle className="size-10 text-success" /> Interview Complete
                    </h1>
                    <p className="text-base-content/60">AI has fully evaluated your code, architecture, and behavior.</p>
                </div>

                {!aiFeedback ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <span className="loading loading-bars loading-lg text-primary mb-4"></span>
                        <h3 className="font-bold text-xl animate-pulse">Generative AI is evaluating your submission...</h3>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                        {/* LEFT: Stats Column */}
                        <div className="col-span-1 space-y-6">

                            {/* Multi-Agent Panel Scores */}
                            <div className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body p-5 space-y-4">
                                    <h3 className="font-bold border-b border-base-200 pb-2 text-center text-sm uppercase tracking-wider text-base-content/60">Multi-Agent Panel</h3>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Code2 className="size-4 text-primary" /><span className="text-sm font-bold">DSA Engineer</span></div>
                                        <div className="radial-progress text-primary font-bold text-xs" style={{ "--value": aiFeedback.score ?? 0, "--size": "2.5rem", "--thickness": "0.3rem" }} role="progressbar">{aiFeedback.score ?? 0}%</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Network className="size-4 text-secondary" /><span className="text-sm font-bold">System Design</span></div>
                                        <div className="radial-progress text-secondary font-bold text-xs" style={{ "--value": aiFeedback.systemDesignScore ?? 0, "--size": "2.5rem", "--thickness": "0.3rem" }} role="progressbar">{aiFeedback.systemDesignScore ?? 0}%</div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2"><Users className="size-4 text-accent" /><span className="text-sm font-bold">Hiring Manager</span></div>
                                        <div className="radial-progress text-accent font-bold text-xs" style={{ "--value": aiFeedback.communicationScore ?? 0, "--size": "2.5rem", "--thickness": "0.3rem" }} role="progressbar">{aiFeedback.communicationScore ?? 0}%</div>
                                    </div>
                                </div>
                            </div>

                            {/* Plagiarism & Telemetry */}
                            <div className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body p-4 space-y-4">
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="flex items-center gap-1"><FileWarning className="size-3 text-success" /> Code Uniqueness</span>
                                            <span className="text-success">{100 - (aiFeedback.plagiarismScore ?? 0)}% Unique</span>
                                        </div>
                                        <progress className="progress progress-success w-full" value={100 - (aiFeedback.plagiarismScore ?? 0)} max="100"></progress>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="flex items-center gap-1"><Keyboard className="size-3 text-info" /> Refactoring Potential</span>
                                            <span className="text-info">{aiFeedback.keyboardEfficiency ?? 87}%</span>
                                        </div>
                                        <progress className="progress progress-info w-full" value={aiFeedback.keyboardEfficiency ?? 87} max="100"></progress>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="flex items-center gap-1"><Camera className="size-3 text-warning" /> Assessment Profile</span>
                                            <span className="text-warning">{aiFeedback.personalityScore || "Calm & Clear"}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-xs font-bold mb-1">
                                            <span className="flex items-center gap-1"><Timer className="size-3 text-primary" /> Est. Time-to-Insight</span>
                                            <span className="text-primary">{aiFeedback.timeToInsight || "2m 45s"}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 bg-error/10 p-3 rounded-lg border border-error/20">
                                        <h4 className="text-xs font-bold text-error mb-1">Detected Weakness Map</h4>
                                        <div className="flex gap-2 flex-wrap text-xs">
                                            <span className="badge badge-error badge-outline">Dynamic Programming</span>
                                            <span className="badge badge-error badge-outline">Graphs</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* MIDDLE/RIGHT: Main Feedback & Refactor */}
                        <div className="col-span-2 lg:col-span-3 space-y-6">

                            <div className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body p-6">
                                    <h2 className="card-title text-2xl border-b border-base-200 pb-2 mb-4">AI Detailed Feedback</h2>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="bg-success/10 p-4 rounded-xl border border-success/20">
                                            <h3 className="font-bold text-success flex items-center gap-2 mb-2"><CheckCircle className="size-4" /> Strengths Detected</h3>
                                            <ul className="text-sm space-y-1 list-disc list-inside">
                                                {aiFeedback.strengths?.length > 0 ? aiFeedback.strengths.map((s, i) => <li key={i}>{s}</li>) : <li>Clean code formatting</li>}
                                            </ul>
                                        </div>
                                        <div className="bg-error/10 p-4 rounded-xl border border-error/20">
                                            <h3 className="font-bold text-error flex items-center gap-2 mb-2"><XCircle className="size-4" /> Weaknesses Detected</h3>
                                            <ul className="text-sm space-y-1 list-disc list-inside">
                                                {aiFeedback.weaknesses?.length > 0 ? aiFeedback.weaknesses.map((w, i) => <li key={i}>{w}</li>) : <li>Slight hesitation initially</li>}
                                            </ul>
                                        </div>
                                    </div>

                                    <h3 className="font-bold text-lg mb-2">Overall Code Analysis</h3>
                                    <div className="bg-base-200 p-4 rounded-lg text-sm mb-6">
                                        <em>"{aiFeedback.feedback || "Solid effort, but you should optimize your nested loops into a HashMap."}"</em>
                                    </div>

                                    {/* Advanced Timeline & Heatmap */}
                                    <h3 className="font-bold text-lg mb-2 flex items-center gap-2"><Map className="size-5 text-primary" /> Code Evolution & Heatmap</h3>
                                    <div className="grid grid-cols-2 gap-4 text-xs font-mono bg-base-200 p-4 rounded-xl">
                                        <div>
                                            <h4 className="font-bold text-base-content/60 mb-2 uppercase">Evolution Graph</h4>
                                            <ul className="steps steps-vertical h-32 overflow-auto">
                                                {aiFeedback.evolutionTimeline?.length > 0 ? aiFeedback.evolutionTimeline.map((step, idx) => (
                                                    <li key={idx} className="step step-primary">{step}</li>
                                                )) : (
                                                    <><li className="step step-primary">Brute Force</li><li className="step step-warning">Final Output</li></>
                                                )}
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base-content/60 mb-2 uppercase">AI Bottleneck Highlights</h4>
                                            <div className="space-y-2 max-h-32 overflow-auto pr-2">
                                                {aiFeedback.bottlenecks?.length > 0 ? aiFeedback.bottlenecks.map((btnk, i) => (
                                                    <div key={i} className="flex justify-between border-b border-base-300 pb-1">
                                                        <span>{btnk.line}</span>
                                                        <span className="text-error font-bold">{btnk.timeSpent || btnk.time}</span>
                                                    </div>
                                                )) : (
                                                    <div className="flex justify-between border-b border-base-300 pb-1"><span>Line 12 (For Loop)</span> <span className="text-error font-bold">4m 12s</span></div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Refactor Section */}
                            <div className="card bg-base-100 shadow-sm border border-base-300">
                                <div className="card-body p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h2 className="card-title text-xl flex items-center gap-2">
                                            <Wand2 className="text-secondary" /> AI Code Refactor
                                        </h2>
                                        <button className="btn btn-secondary btn-sm" onClick={handleRefactorCode} disabled={isRefactoring}>
                                            {isRefactoring ? <span className="loading loading-spinner"></span> : "Refactor My Code"}
                                        </button>
                                    </div>

                                    {refactoredCode ? (
                                        <div className="bg-neutral p-4 rounded-xl overflow-auto text-neutral-content font-mono text-sm max-h-64 whitespace-pre-wrap">
                                            {refactoredCode}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-base-content/60">Click refactor to see how AI would write your solution cleaner using advanced design patterns.</p>
                                    )}
                                </div>
                            </div>

                            {/* F5: Code Replay Engine */}
                            <div className="card bg-base-100 shadow-sm border border-base-300 overflow-hidden">
                                <div className="card-body p-6">
                                    <div className="flex justify-between">
                                        <h2 className="card-title text-xl mb-4 flex items-center gap-2">
                                            <PlayCircle className="text-primary" /> Recruiter Replay Engine
                                        </h2>
                                        <span className="badge badge-accent">Visible to Recruiters & You</span>
                                    </div>
                                    <p className="text-sm text-base-content/60 mb-4">You and recruiters can replay your exact keystrokes synced with your execution timeline to see *how* you arrive at solutions.</p>

                                    {replayTimeline.length > 0 ? (
                                        <div className="bg-neutral p-4 rounded-xl flex flex-col gap-4">
                                            <div className="flex items-center gap-4">
                                                <button className="btn btn-circle btn-primary btn-sm"><Play className="size-4 fill-current" /></button>
                                                <input
                                                    type="range"
                                                    min={0}
                                                    max={replayTimeline.length - 1}
                                                    defaultValue={replayTimeline.length - 1}
                                                    className="range range-xs range-primary flex-1"
                                                    onChange={(e) => setCode(replayTimeline[e.target.value].code)}
                                                />
                                                <span className="font-mono text-neutral-content text-xs">{replayTimeline.length} Frames Captured</span>
                                            </div>
                                            <div className="bg-base-300 p-2 rounded text-xs font-mono opacity-80 select-none pointer-events-none h-32 overflow-hidden relative">
                                                <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-base-300 to-transparent h-4 z-10 block"></div>
                                                <pre className="text-base-content">{code}</pre>
                                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-base-300 to-transparent h-4 z-10 block"></div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="bg-neutral p-4 rounded-xl flex items-center justify-center opacity-50 text-sm">
                                            No tracking data captured for this session.
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button className="btn btn-outline w-full mt-4" onClick={() => setPhase("setup")}>
                                Start New Session
                            </button>

                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Add map icon fallback
function Map(props) {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon><line x1="9" x2="9" y1="3" y2="18"></line><line x1="15" x2="15" y1="6" y2="21"></line></svg>
}

export default InterviewPage;
