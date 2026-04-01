import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Webcam from "react-webcam";
import { CameraIcon, StopCircleIcon, RefreshCwIcon, StarIcon, PresentationIcon, MicIcon, SmileIcon } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

// 3D Imports
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, MeshReflectorMaterial } from "@react-three/drei";
import HolographicAvatar from "../components/HolographicAvatar";
import * as THREE from "three";

const QUESTIONS = [
    "Tell me about a time you had a conflict with a teammate.",
    "Describe a technically complex problem you solved recently.",
    "Tell me about a time you failed to meet a deadline.",
    "How do you handle ambiguous requirements?"
];

// The Interrogation Room Component
function InterrogationRoom({ pressureLevel, sentiment, isRecording }) {
    // Morph the room color from a sleek #0f172a to deep red based on pressure
    const roomColor = new THREE.Color().lerpColors(new THREE.Color("#0f172a"), new THREE.Color("#450000"), pressureLevel);
    
    // Add pulsing to the main spotlight if pressure is high
    const spotLightRef = useRef();
    useFrame(({ clock }) => {
        if (spotLightRef.current && pressureLevel > 0.5) {
            spotLightRef.current.intensity = 2 + Math.sin(clock.elapsedTime * 8) * 0.5;
        } else if (spotLightRef.current) {
            spotLightRef.current.intensity = 2;
        }
    });

    return (
        <group>
            <color attach="background" args={[roomColor]} />
            <fog attach="fog" args={[roomColor, 5, 30]} />

            {/* The AI Avatar acting as the Interviewer */}
            <group position={[0, 1.2, -3]}>
                <HolographicAvatar sentiment={sentiment} isSpeaking={!isRecording && pressureLevel === 0} />
            </group>

            {/* Glossy Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                <planeGeometry args={[50, 50]} />
                <MeshReflectorMaterial
                    blur={[300, 100]}
                    resolution={1024}
                    mixBlur={1}
                    mixStrength={50}
                    roughness={0.8}
                    depthScale={1.2}
                    minDepthThreshold={0.4}
                    maxDepthThreshold={1.4}
                    color="#050505"
                    metalness={0.7}
                />
            </mesh>

            {/* Walls */}
            <mesh position={[0, 4, 0]} scale={[-20, -10, -20]}>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={roomColor} roughness={0.9} side={THREE.BackSide} />
            </mesh>
            
            <ambientLight intensity={0.4} />
            <spotLight 
                ref={spotLightRef}
                position={[0, 8, -2]} 
                intensity={2} 
                color={pressureLevel > 0.6 ? "#ff3333" : (sentiment === 'impressed' ? "#ffb300" : "#ffffff")} 
                angle={0.6} 
                penumbra={1} 
            />
            
            <Environment preset={pressureLevel > 0.5 ? "night" : "city"} />
            <OrbitControls 
                enableZoom={false} 
                enablePan={false} 
                minPolarAngle={Math.PI / 2.2} 
                maxPolarAngle={Math.PI / 2 + 0.1}
                minAzimuthAngle={-0.2}
                maxAzimuthAngle={0.2}
            />
        </group>
    );
}

export default function BehavioralInterviewPage() {
    const webcamRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState([]);
    const [videoUrl, setVideoUrl] = useState(null);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [answerText, setAnswerText] = useState("");
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
        if (SpeechRecognition) {
            const recog = new SpeechRecognition();
            recog.continuous = true;
            recog.interimResults = true;
            recog.lang = "en-US";
            
            recog.onresult = (event) => {
                let transcript = "";
                for (let i = 0; i < event.results.length; i++) {
                    transcript += event.results[i][0].transcript;
                }
                setAnswerText(transcript);
            };
            setRecognition(recog);
        }
    }, []);

    const handleStartCaptureClick = useCallback(() => {
        setRecordedChunks([]);
        setVideoUrl(null);
        setFeedback(null);
        setAnswerText("");
        
        try {
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm"
            });
            mediaRecorderRef.current.addEventListener("dataavailable", ({ data }) => {
                if (data.size > 0) setRecordedChunks((prev) => prev.concat(data));
            });
            mediaRecorderRef.current.start();
            setIsRecording(true);
            
            if (recognition) {
                try { recognition.start(); } catch (e) { console.warn(e); }
            }
        } catch (error) {
            toast.error("Camera access required to record your response.");
        }
    }, [webcamRef, recognition]);

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recognition) {
            try { recognition.stop(); } catch (e) { console.warn(e); }
        }
        setTimeout(() => {
            if (recordedChunks.length) {
                const blob = new Blob(recordedChunks, { type: "video/webm" });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
            }
        }, 100);
    }, [mediaRecorderRef, recordedChunks, recognition]);

    const nextQuestion = () => {
        setCurrentQuestionIndex((prev) => (prev + 1) % QUESTIONS.length);
        setVideoUrl(null);
        setRecordedChunks([]);
        setFeedback(null);
        setAnswerText("");
    };

    const analyzeResponse = async () => {
        if (!answerText.trim() && recordedChunks.length === 0) return toast.error("Record a video or paste your script first!");
        
        setIsAnalyzing(true);
        try {
            const res = await axiosInstance.post("/interview/evaluate-behavioral", {
                question: QUESTIONS[currentQuestionIndex],
                answer: answerText.trim() || "User presented a 1-minute pitch regarding the situation."
            });
            setFeedback(res.data);
            toast.success("AI analyzed your STAR response phrasing!");
        } catch (e) {
            toast.error("Analysis online support is currently busy.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Calculate Environment Pressure 
    const fillerWords = (answerText.match(/\b(um|ah|uh|like|so yeah|basically|you know)\b/gi) || []).length;
    let pressureLevel = Math.min(fillerWords / 5, 1); // 5+ filler words maxes out pressure
    
    let sentiment = "neutral";
    if (feedback?.score >= 80) {
        sentiment = "impressed";
        pressureLevel = 0; // Release pressure on victory
    } else if (feedback?.score < 50 && feedback?.score > 0) {
        sentiment = "angry";
    } else if (pressureLevel > 0.6) {
        sentiment = "stressed";
    }

    return (
        <div className="h-screen bg-base-200 flex flex-col overflow-hidden">
            <Navbar />
            
            <div className="pt-24 pb-6 px-6 max-w-[1600px] mx-auto w-full h-full flex flex-col gap-6">
                {/* Header */}
                <div className="flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="size-12 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-[0_0_20px_rgba(var(--color-primary),0.3)]">
                            <PresentationIcon className="size-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black italic tracking-tight">The Hot Seat</h1>
                            <p className="text-xs font-bold uppercase tracking-widest text-base-content/50">3D Virtual Interrogation Protocol</p>
                        </div>
                    </div>

                    {/* Pressure Gauge */}
                    <div className="flex items-center gap-4 bg-base-100 px-6 py-3 rounded-2xl border border-base-content/10 shadow-lg">
                        <div className="text-xs font-black uppercase tracking-widest opacity-60">Neural Pressure</div>
                        <div className="w-32 h-2 bg-base-300 rounded-full overflow-hidden">
                            <div 
                                className="h-full transition-all duration-500 rounded-full"
                                style={{ 
                                    width: `${pressureLevel * 100}%`,
                                    background: pressureLevel > 0.6 ? '#ff003c' : (pressureLevel > 0.3 ? '#f59e0b' : '#10b981')
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Split View */}
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                    
                    {/* Left: The Virtual Interrogation Room */}
                    <div className="relative rounded-3xl overflow-hidden border border-base-content/10 shadow-2xl bg-black">
                        <Canvas shadows camera={{ position: [0, 2, 5], fov: 45 }}>
                            <InterrogationRoom pressureLevel={pressureLevel} sentiment={sentiment} isRecording={isRecording} />
                        </Canvas>

                        {/* Top HUD Overlay */}
                        <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className={`size-2 rounded-full ${isRecording ? 'bg-error animate-ping' : 'bg-success'}`} />
                                {isRecording ? "Transcribing Voice..." : "AI Ready"}
                            </div>
                            <div className="bg-black/50 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white text-xs font-bold uppercase tracking-wider">
                                Filler Flags: <span className={pressureLevel > 0.5 ? 'text-error' : 'text-warning'}>{fillerWords}</span>
                            </div>
                        </div>

                        {/* Webcam PIP Overlay */}
                        <div className="absolute bottom-6 right-6 w-48 h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-base-300">
                            {videoUrl ? (
                                <video src={videoUrl} controls className="w-full h-full object-cover" />
                            ) : (
                                <Webcam audio={true} ref={webcamRef} muted={true} className="w-full h-full object-cover" />
                            )}
                        </div>

                        {/* Centered Controls at bottom */}
                        <div className="absolute bottom-6 left-6 right-56 flex justify-start pl-6 items-end pointer-events-auto">
                            {!videoUrl ? (
                                isRecording ? (
                                    <button onClick={handleStopCaptureClick} className="btn btn-error shadow-error/30 shadow-2xl hover:scale-105 transition-transform px-8 gap-2 border border-error/50">
                                        <StopCircleIcon className="size-5" /> Terminate Feed
                                    </button>
                                ) : (
                                    <button onClick={handleStartCaptureClick} className="btn bg-[#ffb300] hover:bg-[#ffb300]/80 text-black shadow-[#ffb300]/30 shadow-2xl hover:scale-105 transition-transform px-8 gap-2 border-none font-black uppercase tracking-widest">
                                        <CameraIcon className="size-5" /> Start Interview
                                    </button>
                                )
                            ) : (
                                <div className="flex gap-3">
                                    <button onClick={() => setVideoUrl(null)} className="btn bg-base-100/80 backdrop-blur text-base-content hover:bg-base-200 border border-base-content/20 shadow-xl">
                                        <RefreshCwIcon className="size-4" /> Retake
                                    </button>
                                    <button 
                                        onClick={analyzeResponse} 
                                        disabled={isAnalyzing}
                                        className="btn btn-primary font-black uppercase tracking-widest shadow-primary/30 shadow-xl hover:scale-105 border-none"
                                    >
                                        {isAnalyzing ? <span className="loading loading-spinner loading-sm" /> : <StarIcon className="size-4 fill-current" />}
                                        Analyze STAR
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Analysis Console */}
                    <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar pb-6">
                        
                        {/* The Question Box */}
                        <div className="bg-gradient-to-br from-primary/20 via-base-100 to-base-200 p-8 rounded-3xl border border-primary/20 shadow-lg relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 size-40 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
                            <div className="text-[10px] uppercase font-black tracking-[0.3em] text-primary/80 mb-4 flex items-center gap-2">
                                <div className="h-px w-6 bg-primary/50" />
                                Current prompt [ {currentQuestionIndex + 1} / {QUESTIONS.length} ]
                            </div>
                            <h2 className="text-3xl font-black font-serif leading-tight text-base-content relative z-10">"{QUESTIONS[currentQuestionIndex]}"</h2>
                            <div className="flex justify-end mt-6">
                                <button onClick={nextQuestion} className="text-xs font-bold uppercase tracking-widest text-base-content/40 hover:text-base-content transition-colors">Skip Prompt ⏭️</button>
                            </div>
                        </div>

                        {/* Live Transcription Box */}
                        <div className="bg-base-100 p-6 rounded-3xl border border-base-content/10 shadow-sm flex flex-col min-h-[150px]">
                            <label className="text-[10px] uppercase font-black text-base-content/50 mb-3 flex items-center gap-2">
                                <MicIcon className="size-3.5" /> Live Signal Transcription
                            </label>
                            {isRecording && !answerText && (
                                <div className="flex-1 flex items-center justify-center opacity-30 text-sm font-black uppercase tracking-widest">
                                    Listening...
                                </div>
                            )}
                            {(!isRecording && !answerText && !videoUrl) && (
                                <div className="flex-1 flex items-center justify-center opacity-30 text-sm font-black uppercase tracking-widest text-center px-8">
                                    Press <span className="text-[#ffb300] mx-2">Start Interview</span> to begin establishing audio feed.
                                </div>
                            )}
                            <textarea 
                                value={answerText}
                                onChange={e => setAnswerText(e.target.value)}
                                placeholder="Transcription will appear here. You may also paste a pre-written script to bypass speech recognition."
                                className="w-full flex-1 bg-transparent resize-none outline-none font-medium leading-relaxed text-sm read-only:opacity-70"
                                readOnly={isRecording}
                            />
                            {(!isRecording && answerText.trim() && !videoUrl) && (
                                <button 
                                    onClick={analyzeResponse} 
                                    disabled={isAnalyzing} 
                                    className="btn btn-primary btn-sm mt-4 gap-2 font-black shadow-primary/20 shadow-lg"
                                >
                                    {isAnalyzing ? <span className="loading loading-spinner loading-xs" /> : <StarIcon className="size-3.5 fill-current" />}
                                    Evaluate Typed Transcript
                                </button>
                            )}
                        </div>

                        {/* Feedback / Results Window */}
                        <div className="flex-1">
                            {isAnalyzing && (
                                <div className="h-full bg-base-100 rounded-3xl border border-base-content/10 flex flex-col items-center justify-center animate-pulse p-10 min-h-[300px]">
                                    <div className="size-16 relative flex items-center justify-center mb-6">
                                        <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin border-t-primary" />
                                        <StarIcon className="size-6 text-primary" />
                                    </div>
                                    <h3 className="font-black text-lg uppercase tracking-wider text-base-content mb-2">Analyzing Behavioral Metrics</h3>
                                    <p className="text-xs text-base-content/50 font-bold uppercase tracking-widest text-center max-w-xs leading-relaxed">Cross-referencing S.T.A.R. methodology against detected sentiment.</p>
                                </div>
                            )}

                            {feedback && !isAnalyzing && (
                                <div className="bg-base-100 rounded-3xl border-2 border-primary/20 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8">
                                    <div className="p-6 border-b border-base-content/10 bg-primary/5 flex items-center justify-between">
                                        <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-3">
                                            <StarIcon className="size-5 text-warning fill-warning" />
                                            S.T.A.R. Assessment
                                        </h3>
                                        <div className={`radial-progress font-black text-sm bg-base-100 border border-base-content/10 shadow-inner ${feedback.score >= 80 ? 'text-success' : 'text-warning'}`} 
                                             style={{"--value": feedback.score, "--size": "3.5rem", "--thickness": "4px"}}>
                                            {feedback.score}
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 space-y-4">
                                        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary block mb-2">Situation</span>
                                            <span className="text-sm font-medium leading-relaxed opacity-80">{feedback.starAnalysis?.situation || "Data unavailable."}</span>
                                        </div>
                                        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-error" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-error block mb-2">Task</span>
                                            <span className="text-sm font-medium leading-relaxed opacity-80">{feedback.starAnalysis?.task || "Data unavailable."}</span>
                                        </div>
                                        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-success" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-success block mb-2">Action</span>
                                            <span className="text-sm font-medium leading-relaxed opacity-80">{feedback.starAnalysis?.action || "Data unavailable."}</span>
                                        </div>
                                        <div className="bg-base-200/50 p-4 rounded-2xl border border-base-content/5 relative overflow-hidden">
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-warning" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-warning block mb-2">Result</span>
                                            <span className="text-sm font-medium leading-relaxed opacity-80">{feedback.starAnalysis?.result || "Data unavailable."}</span>
                                        </div>
                                        
                                        <div className="mt-6 flex items-start gap-4 p-5 bg-info/5 rounded-2xl border border-info/20">
                                            <SmileIcon className="size-6 text-info shrink-0" />
                                            <div>
                                                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-info mb-1.5">Delivery & Tone</h4>
                                                <p className="text-sm font-medium leading-relaxed opacity-80">{feedback.tone || "Tone assessment unavailable"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!isAnalyzing && !feedback && (
                                <div className="h-full flex flex-col justify-center bg-base-100 p-8 rounded-3xl border border-base-content/10 min-h-[250px] opacity-70">
                                    <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-3 mb-6">
                                        <StarIcon className="size-5" /> Framework Guide
                                    </h3>
                                    <ul className="space-y-4 text-sm font-medium">
                                        <li className="flex items-center gap-4"><span className="size-8 rounded-lg bg-primary/20 text-primary flex items-center justify-center font-black">S</span> Describe the precise environment.</li>
                                        <li className="flex items-center gap-4"><span className="size-8 rounded-lg bg-error/20 text-error flex items-center justify-center font-black">T</span> Outline your unique objective.</li>
                                        <li className="flex items-center gap-4"><span className="size-8 rounded-lg bg-success/20 text-success flex items-center justify-center font-black">A</span> Detail the exact steps YOU took.</li>
                                        <li className="flex items-center gap-4"><span className="size-8 rounded-lg bg-warning/20 text-warning flex items-center justify-center font-black">R</span> Quantify the final outcome.</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}
