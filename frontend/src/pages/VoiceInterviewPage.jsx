import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import { MicIcon, MicOffIcon, PlayIcon, SquareIcon, MessageSquareIcon, Volume2Icon } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

export default function VoiceInterviewPage() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [messages, setMessages] = useState([
        { role: "ai", text: "Hello! I am your AI Technical Interviewer. Whenever you are ready, let's begin the interview. I will be assessing your communication and problem-solving skills." }
    ]);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    
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
                for (let i = event.resultIndex; i < event.results.length; i++) {
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
        
        synthesisRef.current.speak(utterance);
    };

    const toggleListen = () => {
        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            if (transcript.trim()) {
                handleUserSubmit(transcript);
                setTranscript("");
            }
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleUserSubmit = async (text) => {
        const newMessages = [...messages, { role: "user", text }];
        setMessages(newMessages);
        
        try {
            // Using the existing chat endpoint as a proxy for the interviewer
            const res = await axiosInstance.post("/interview/chat", { 
                prompt: `You are an expert technical interviewer conducting a live mock interview over voice. 
                Keep your responses short, conversational, and spoken. Do not use markdown like bold text or code blocks, since this will be read aloud by Text-to-Speech.
                The candidate said: "${text}"
                React naturally to what they said, then ask the next technical question or dig deeper.` 
            });
            const aiResponse = res.data.response || "I see. Could you elaborate on that?";
            setMessages([...newMessages, { role: "ai", text: aiResponse }]);
            speak(aiResponse);
        } catch (error) {
            toast.error("Failed to connect to AI brain");
        }
    };

    const startInterview = () => {
        setIsInterviewActive(true);
        speak(messages[0].text);
    };

    const endInterview = () => {
        setIsInterviewActive(false);
        if (isListening) toggleListen();
        if (synthesisRef.current) synthesisRef.current.cancel();
        toast("Interview concluded. Check your dashboard for feedback!", { icon: "🏁" });
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
                            <div className="flex flex-col items-center z-10">
                                <div className="flex items-center gap-2 h-16">
                                    {[...Array(9)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className={`w-3 rounded-full bg-primary transition-all duration-75 ${isListening ? 'animate-pulse' : 'h-2 opacity-30 object-none px-0'}`}
                                            style={{ height: isListening ? `${Math.random() * 40 + 20}px` : '8px', animationDelay: `${i * 0.1}s` }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-bold text-base-content/50 uppercase tracking-widest mt-4">
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
                </div>
            </div>
        </div>
    );
}
