import { useState, useRef, useCallback, useEffect } from "react";
import Navbar from "../components/Navbar";
import Webcam from "react-webcam";
import { CameraIcon, StopCircleIcon, PlayIcon, MicIcon, UploadCloudIcon, FrownIcon, SmileIcon, RefreshCwIcon, StarIcon, PresentationIcon } from "lucide-react";
import toast from "react-hot-toast";
import axiosInstance from "../lib/axios";

const QUESTIONS = [
    "Tell me about a time you had a conflict with a teammate.",
    "Describe a technically complex problem you solved recently.",
    "Tell me about a time you failed to meet a deadline.",
    "How do you handle ambiguous requirements?"
];

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
        setAnswerText(""); // Clear previous
        
        try {
            mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
                mimeType: "video/webm"
            });
            mediaRecorderRef.current.addEventListener(
                "dataavailable",
                handleDataAvailable
            );
            mediaRecorderRef.current.start();
            setIsRecording(true);
            
            if (recognition) {
                try { recognition.start(); } catch (e) { console.warn(e); }
            }
        } catch (error) {
            toast.error("Camera access required to record your response.");
        }
    }, [webcamRef, setIsRecording, mediaRecorderRef, recognition]);

    const handleDataAvailable = useCallback(
        ({ data }) => {
            if (data.size > 0) {
                setRecordedChunks((prev) => prev.concat(data));
            }
        },
        [setRecordedChunks]
    );

    const handleStopCaptureClick = useCallback(() => {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
        if (recognition) {
            try { recognition.stop(); } catch (e) { console.warn(e); }
        }
        setTimeout(() => {
            if (recordedChunks.length) {
                const blob = new Blob(recordedChunks, {
                    type: "video/webm"
                });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
            }
        }, 100);
    }, [mediaRecorderRef, webcamRef, setIsRecording, recordedChunks, recognition]);

    const handleDownload = useCallback(() => {
        if (recordedChunks.length) {
            const blob = new Blob(recordedChunks, {
                type: "video/webm"
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            a.href = url;
            a.download = `behavioral-q${currentQuestionIndex + 1}.webm`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }, [recordedChunks, currentQuestionIndex]);

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

    return (
        <div className="min-h-screen bg-base-200 flex flex-col">
            <Navbar />
            
            <div className="max-w-5xl mx-auto w-full pt-64 pb-8 px-4 lg:px-8 flex-1 flex flex-col">
                <div className="mb-6 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-3">
                        <PresentationIcon className="size-10 text-primary" />
                        STAR Method Simulator
                    </h1>
                    <p className="text-base-content/60">
                        Record yourself answering real behavioral questions. The AI will analyze your facial expressions, pacing, and 
                        grade your answer using the Situation-Task-Action-Result methodology.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
                    
                    {/* Left: Camera & Recording */}
                    <div className="flex flex-col gap-4">
                        <div className="card bg-base-100 shadow-xl overflow-hidden border border-base-300 relative aspect-video flex items-center justify-center bg-black/90">
                            {videoUrl ? (
                                <video src={videoUrl} controls className="w-full h-full object-cover" />
                            ) : (
                                <Webcam
                                    audio={true}
                                    ref={webcamRef}
                                    muted={true}
                                    className="w-full h-full object-cover"
                                />
                            )}

                            {isRecording && (
                                <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                                    <div className="size-3 rounded-full bg-error animate-pulse" />
                                    <span className="text-white text-xs font-bold uppercase tracking-wider">Recording</span>
                                </div>
                            )}
                        </div>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300">
                            {!videoUrl ? (
                                isRecording ? (
                                    <button onClick={handleStopCaptureClick} className="btn btn-error btn-lg gap-2 shadow-error/30 shadow-lg hover:scale-105 transition-transform w-48">
                                        <StopCircleIcon className="size-6" /> Stop
                                    </button>
                                ) : (
                                    <button onClick={handleStartCaptureClick} className="btn btn-primary btn-lg gap-2 shadow-primary/30 shadow-lg hover:scale-105 transition-transform w-48">
                                        <CameraIcon className="size-6" /> Record Answer
                                    </button>
                                )
                            ) : (
                                <>
                                    <button onClick={() => setVideoUrl(null)} className="btn btn-ghost gap-2">
                                        <RefreshCwIcon className="size-4" /> Retake
                                    </button>
                                    <button onClick={handleDownload} className="btn btn-outline gap-2">
                                        <UploadCloudIcon className="size-4" /> Download
                                    </button>
                                    <button 
                                        onClick={analyzeResponse} 
                                        disabled={isAnalyzing}
                                        className="btn btn-secondary gap-2 px-8 font-bold text-white shadow-secondary/30 shadow-lg hover:scale-105 transition-transform"
                                    >
                                        {isAnalyzing ? <span className="loading loading-spinner loading-sm" /> : <StarIcon className="size-5 fill-current" />}
                                        Analyze STAR
                                    </button>
                                </>
                            )}
                        </div>
                        {/* Manual Textbox input script setup structures */}
                        <div className="card bg-base-100 p-4 rounded-2xl shadow-sm border border-base-300 mt-0 flex flex-col">
                             <label className="text-xs uppercase font-black text-base-content/50 mb-1.5 flex justify-between">
                                <span>🎯 Script Outline / Transcription Support</span>
                                <span className="text-[10px] text-primary">Paste your script to get AI Grading</span>
                             </label>
                             <textarea 
                                value={answerText}
                                onChange={e => setAnswerText(e.target.value)}
                                placeholder="Write or paste your response script outline here so AI can analyze the content directly in addition to your delivery!"
                                className="textarea textarea-bordered h-24 text-sm font-medium resize-none bg-base-200/30"
                             />
                             {/* Analyze text trigger button */}
                             {answerText.trim() && !videoUrl && (
                                  <button 
                                      onClick={analyzeResponse} 
                                      disabled={isAnalyzing} 
                                      className="btn btn-secondary btn-sm mt-3 gap-2 font-black text-white shadow-secondary/20 shadow-lg w-full rounded-xl"
                                  >
                                      {isAnalyzing ? <span className="loading loading-spinner loading-xs" /> : <StarIcon className="size-3.5 fill-current" />}
                                      Analyze Written Response
                                  </button>
                             )}
                        </div>
                    </div>

                    {/* Right: Question & Feedback */}
                    <div className="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2 pb-10">
                        {/* Question Card */}
                        <div className="card bg-primary text-primary-content shadow-xl border-none">
                            <div className="card-body">
                                <div className="text-xs uppercase font-bold tracking-wider opacity-70 mb-2">Question {currentQuestionIndex + 1} of {QUESTIONS.length}</div>
                                <h2 className="text-2xl font-bold font-serif leading-snug">"{QUESTIONS[currentQuestionIndex]}"</h2>
                                <div className="card-actions justify-end mt-4">
                                    <button onClick={nextQuestion} className="btn btn-sm btn-ghost hover:bg-white/20">Skip Question ⏭️</button>
                                </div>
                            </div>
                        </div>

                        {/* Feedback Card */}
                        {isAnalyzing && (
                            <div className="card bg-base-100 border border-base-300 shadow-xl py-12 flex flex-col items-center justify-center animate-pulse">
                                <MicIcon className="size-10 text-primary animate-bounce mb-4" />
                                <h3 className="font-bold text-secondary">Analyzing Body Language & Transcription...</h3>
                                <p className="text-xs text-base-content/50 mt-2">Checking for eye contact, pacing, and STAR framework.</p>
                            </div>
                        )}

                        {feedback && (
                            <div className="card bg-base-100 border border-secondary/30 shadow-2xl animate-in slide-in-from-bottom-8">
                                <div className="card-body">
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-base-300">
                                        <h3 className="card-title text-2xl font-black flex gap-2">
                                            <StarIcon className="size-6 text-warning fill-warning" />
                                            AI Assessment
                                        </h3>
                                        <div className={`radial-progress font-bold text-lg ${feedback.score >= 80 ? 'text-success' : 'text-warning'}`} 
                                             style={{"--value": feedback.score, "--size": "3rem"}}>{feedback.score}</div>
                                    </div>
                                    
                                    <div className="space-y-4 text-sm">
                                        <div className="bg-base-200 p-3 rounded-xl border-l-4 border-primary">
                                            <span className="font-bold block mb-1">Situation</span>
                                            <span className="text-base-content/80">{feedback.starAnalysis?.situation || "Critique unavailable."}</span>
                                        </div>
                                        <div className="bg-base-200 p-3 rounded-xl border-l-4 border-error">
                                            <span className="font-bold block mb-1">Task</span>
                                            <span className="text-base-content/80">{feedback.starAnalysis?.task || "Critique unavailable."}</span>
                                        </div>
                                        <div className="bg-base-200 p-3 rounded-xl border-l-4 border-success">
                                            <span className="font-bold block mb-1">Action</span>
                                            <span className="text-base-content/80">{feedback.starAnalysis?.action || "Critique unavailable."}</span>
                                        </div>
                                        <div className="bg-base-200 p-3 rounded-xl border-l-4 border-warning">
                                            <span className="font-bold block mb-1">Result</span>
                                            <span className="text-base-content/80">{feedback.starAnalysis?.result || "Critique unavailable."}</span>
                                        </div>
                                        
                                        <div className="mt-6 flex items-start gap-4 p-4 bg-info/10 rounded-xl border border-info/20">
                                            <SmileIcon className="size-8 text-info shrink-0" />
                                            <div>
                                                <h4 className="font-bold text-info mb-1">Delivery Tone</h4>
                                                <p className="text-xs">{feedback.tone || "Tone assessment unavailable"}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Tips */}
                        {!isAnalyzing && !feedback && (
                            <div className="mt-4 p-5 bg-base-200 rounded-2xl border border-base-300 flex-1">
                                <h3 className="font-bold mb-3 flex items-center gap-2">💡 STAR Framework Tips</h3>
                                <ul className="space-y-3 text-sm text-base-content/70 font-medium">
                                    <li><span className="text-primary font-black">S</span> - Describe the <b>Situation</b> clearly (Who, what, where).</li>
                                    <li><span className="text-error font-black">T</span> - Explain your specific <b>Task</b> or goal.</li>
                                    <li><span className="text-success font-black">A</span> - Focus on the <b>Action</b> YOU took, not the team. Use "I".</li>
                                    <li><span className="text-warning font-black">R</span> - End with the <b>Result</b>. Quantify metrics if possible!</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
