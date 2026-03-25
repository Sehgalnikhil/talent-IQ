import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { MicIcon, MicOffIcon, PlayIcon, SquareIcon, MessageSquareIcon, Volume2Icon } from "lucide-react";
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
    const audioContextRef = useRef(null);
    
    const recognitionRef = useRef(null);
    const synthesisRef = useRef(window.speechSynthesis);

    useEffect(() => {
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
            toast.error("Your browser does not support Speech Recognition. Please use Chrome.");
        }

        return () => {
            if (recognitionRef.current) recognitionRef.current.stop();
            if (synthesisRef.current) synthesisRef.current.cancel();
        };
    }, []);

    const speak = (text) => {
        if (!synthesisRef.current) return;
        synthesisRef.current.cancel(); // stop current speech
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Try to find a good English voice
        const voices = synthesisRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang.includes("en-US") && v.name.includes("Google"));
        if (preferredVoice) utterance.voice = preferredVoice;
        
        utterance.rate = 0.95; // Slightly slower for clarity
        utterance.pitch = 1.0;
        
        // Automatic turn-taking handles Node flawless
        utterance.onend = () => {
            if (recognitionRef.current && localStorage.getItem("voice_interview_active") === "true") {
                try {
                    setTranscript(""); // Clear previous nodes Node setups
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
            
            // Async buffer syncer layout Node flawless
            setTimeout(() => {
                setTranscript(prev => {
                    if (prev.trim()) {
                        handleUserSubmit(prev);
                    }
                    return ""; // Clear layout
                });
            }, 300);
        } else {
            setTranscript(""); // Clear before speaking Node
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleUserSubmit = async (text) => {
        const newMessages = [...messages, { role: "user", text }];
        setMessages(newMessages);
        
        try {
            // Build Contextual Dialogue History String to pass turn memories Node
            const dialogueContext = newMessages.map(m => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.text}`).join("\n");
            
            const prompt = `You are an elite Senior FAANG Technical Interviewer conducting a live interactive mock screening over voice. 
            
            Deployment-Grade Guidelines (Strict):
            1. Response Length: Keep responses highly conversational and CONCISE (1-2 sentences max). Setup response ideal for Text-To-Speech audio reads.
            2. Strict Hygiene: NEVER use Code Blocks, bullet points, Markdown (like **bolding** or # header structures), or symbols/emojis.
            3. Iterative follow-ups: Focus strictly on candidate statements. If their logic is correct, immediately introduce rigorous follow-up constraints: systemic bottlenecks, memory limits, or race conditions.
            4. Do not explain full solutions. Offer subtle single-sentence conceptual hints instead of yielding answers.
            5. Use subtle conversational fillers occasionally ("I see", "Got it", "That's a good point") to keep pacing natural.

            Previous Dialogue Context:
            ${dialogueContext}
            
            Interviewer Response:`;

            // Using the existing chat endpoint as a proxy for the interviewer
            const res = await axiosInstance.post("/interview/chat", { prompt });
            let aiResponse = res.data.response || "I see. Could you elaborate on that?";
            
            // Safety Strip redundant interviewer markers the AI might output
            aiResponse = aiResponse.replace(/^(Interviewer:)/i, '').trim();

            setMessages([...newMessages, { role: "ai", text: aiResponse }]);
            speak(aiResponse);
        } catch (error) {
            toast.error("Failed to connect to AI brain");
        }
    };

    const startInterview = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            // Setup Web Audio API constraints flawlessly
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
        } catch (error) {
            console.error(error);
            toast.error("Microphone access is required to take the voice interview.");
        }
    };

    const endInterview = async () => {
        setIsInterviewActive(false);
        setIsEvaluating(true);
        localStorage.setItem("voice_interview_active", "false");
        if (isListening) toggleListen();
        if (synthesisRef.current) synthesisRef.current.cancel();

        // Close AudioContext nodes
        if (audioContextRef.current) {
            try { audioContextRef.current.close(); } catch (e) {}
        }

        try {
            const dialogueContext = messages.map(m => `${m.role === "user" ? "Candidate" : "Interviewer"}: ${m.text}`).join("\n");
            const prompt = `Evaluate the candidate based on this voice interview interaction. Return strict JSON ONLY with no markdown: {"score": 1-100, "feedback": "...", "strengths": ["string"], "weaknesses": ["string"]}\nDialogue:\n${dialogueContext}`;
            
            const res = await axiosInstance.post("/interview/chat", { prompt });
            let rawJson = res.data.response || "{}";
            const jsonMatch = rawJson.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : "{}";
            setEvaluation(JSON.parse(jsonString));
            toast.success("Interview Evaluated! 🏁");
        } catch (error) {
            console.error(error);
            toast.error("Failed to generate voice evaluation report.");
        } finally {
            setIsEvaluating(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar />
            
            <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full p-4 lg:p-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black mb-2 flex items-center justify-center gap-3">
                        <Volume2Icon className="size-10 text-primary" />
                        AI Voice Interviewer
                    </h1>
                    <p className="text-base-content/60">Practice verbalizing your thoughts. The AI will listen and respond.</p>
                </div>

                {/* Main Interface */}
                <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 flex-1 flex flex-col overflow-hidden relative">
                    
                    {/* Visualizer Area (Fake) */}
                    <div className="h-48 bg-base-200 border-b border-base-300 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
                        
                        {!isInterviewActive ? (
                            <button onClick={startInterview} className="btn btn-primary btn-lg rounded-full shadow-lg shadow-primary/30 z-10 w-48 h-16 text-lg font-bold hover:scale-105 transition-transform">
                                <PlayIcon className="size-6 fill-current" /> Begin Interview
                            </button>
                        ) : (
                            <div className="flex flex-col items-center z-10 w-full h-full">
                                <SoundReactiveSphere analyserNode={analyser} />
                                <span className="text-xs font-bold text-base-content/50 uppercase tracking-widest mt-2">
                                    {isListening ? "Listening..." : "AI is speaking or paused"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Chat History Transcript */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`chat ${msg.role === "user" ? "chat-end" : "chat-start"}`}>
                                <div className="chat-image avatar">
                                    <div className={`w-10 rounded-full flex items-center justify-center ${msg.role === "ai" ? "bg-primary text-white" : "bg-base-300"}`}>
                                        {msg.role === "ai" ? <MessageSquareIcon className="size-5 mt-2.5 ml-2.5" /> : "U"}
                                    </div>
                                </div>
                                <div className={`chat-bubble shadow-sm ${msg.role === "user" ? "chat-bubble-primary text-primary-content" : "bg-base-200 text-base-content"}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        
                        {/* Live Transcript Preview */}
                        {isListening && transcript && (
                            <div className="chat chat-end opacity-70">
                                <div className="chat-bubble chat-bubble-primary bg-transparent border border-primary text-primary">
                                    {transcript} <span className="animate-pulse">|</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Controls */}
                    {isInterviewActive && (
                        <div className="p-4 bg-base-200/50 border-t border-base-300 flex justify-center gap-4">
                            <button 
                                onClick={toggleListen}
                                className={`btn btn-circle btn-lg shadow-lg hover:scale-105 transition-transform ${isListening ? "btn-error" : "btn-primary"}`}
                            >
                                {isListening ? <SquareIcon className="size-6 fill-current" /> : <MicIcon className="size-6" />}
                            </button>
                            
                            <button onClick={endInterview} className="btn btn-outline btn-error btn-lg px-8 shadow-sm">
                                End Interview
                            </button>
                        </div>
                    )}
                    {/* Modal Overlay for Evaluation / Loading */}
                    <AnimatePresence>
                        {(isEvaluating || evaluation) && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-base-300/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
                                <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-base-100 max-w-lg w-full rounded-3xl p-8 border border-base-300 shadow-2xl relative">
                                    {isEvaluating ? (
                                        <div className="text-center py-12 flex flex-col items-center">
                                            <div className="loading loading-spinner loading-lg text-primary mb-4" />
                                            <h3 className="text-xl font-bold">Evaluating Performance...</h3>
                                            <p className="text-xs text-base-content/60 mt-1">Our AI is analyzing your pacing and dialogue responses.</p>
                                        </div>
                                    ) : evaluation && (
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-2xl font-black">Performance Report</h3>
                                                <div className={`badge badge-lg gap-1 font-bold ${evaluation.score >= 80 ? 'badge-success' : evaluation.score >= 50 ? 'badge-warning' : 'badge-error'}`}>
                                                    Score: {evaluation.score}
                                                </div>
                                            </div>
                                            <p className="text-sm bg-base-200 p-4 rounded-xl border border-base-300 text-base-content/80">{evaluation.feedback}</p>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <span className="text-xs font-black uppercase text-success">Strengths</span>
                                                    <ul className="list-disc pl-4 text-xs mt-1 space-y-1 text-base-content/70">
                                                        {evaluation.strengths?.map((s, i) => <li key={i}>{s}</li>)}
                                                    </ul>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-black uppercase text-error">Weaknesses</span>
                                                    <ul className="list-disc pl-4 text-xs mt-1 space-y-1 text-base-content/70">
                                                        {evaluation.weaknesses?.map((w, i) => <li key={i}>{w}</li>)}
                                                    </ul>
                                                </div>
                                            </div>
                                            <button onClick={() => setEvaluation(null)} className="btn btn-primary w-full shadow-lg">
                                                Dismiss
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
