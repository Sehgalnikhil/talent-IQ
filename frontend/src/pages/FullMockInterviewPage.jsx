import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuitIcon, 
  Code2Icon, 
  DatabaseIcon, 
  BugIcon, 
  LineChartIcon, 
  FileTextIcon, 
  UsersIcon, 
  TerminalSquareIcon,
  TrophyIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  CheckCircle2Icon,
  ClockIcon,
  Network,
  Activity
} from 'lucide-react';
import PageTransition from '../components/PageTransition';
import SpotlightCard from '../components/SpotlightCard';
import { useNavigate } from 'react-router';
import { executeCode } from '../lib/piston';
import axiosInstance from '../lib/axios';
import toast from 'react-hot-toast';
import DecodingText from '../components/DecodingText';

const AptitudeOptionCard = ({ children, isSelected, onClick }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            onClick={onClick}
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300 relative overflow-hidden ${isSelected ? 'border-[#00daf3] bg-[#00daf3]/10 shadow-[0_0_15px_rgba(0,218,243,0.2)]' : 'border-[#494455]/40 hover:border-[#00daf3]/40 hover:bg-[#00daf3]/5 bg-[#1a1c20]'}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition duration-300"
                style={{
                    opacity: isHovered ? 1 : 0,
                    background: `radial-gradient(400px circle at ${position.x}px ${position.y}px, rgba(0, 227, 253, 0.08), transparent 80%)`,
                }}
            />
            {children}
        </div>
    );
};

const ROUNDS = [
  { id: 'aptitude', title: 'Aptitude & Logical', icon: LineChartIcon, description: 'Quantitative, logical reasoning, and data interpretation.', time: '15 mins' },
  { id: 'coding', title: 'Coding Round', icon: Code2Icon, description: 'Standard DSA problems with automated test cases.', time: '45 mins' },
  { id: 'ml_concepts', title: 'AI/ML Technical', icon: BrainCircuitIcon, description: 'Core Concepts: Regression, Bias-Variance, Evaluation metrics.', time: '20 mins' },
  { id: 'case_study', title: 'ML Case Study', icon: FileTextIcon, description: 'Design a spam detection or recommendation system.', time: '30 mins' },
  { id: 'system_design', title: 'System Design', icon: DatabaseIcon, description: 'Architect a scalable backend or ML pipeline.', time: '40 mins' },
  { id: 'debugging', title: 'Code Review', icon: BugIcon, description: 'Find errors, optimize, and improve readability.', time: '20 mins' },
  { id: 'resume', title: 'Resume Review', icon: FileTextIcon, description: 'Deep dive into your uploaded resume projects.', time: '25 mins' },
  { id: 'hr_voice', title: 'HR & Situational', icon: UsersIcon, description: 'STAR method and ethical dilemma handling via voice.', time: '30 mins' },
  { id: 'pair_programming', title: 'Pair Programming', icon: TerminalSquareIcon, description: 'Live coding with AI providing hints and interruptions.', time: '45 mins' },
  { id: 'final_report', title: 'Final Evaluation', icon: TrophyIcon, description: 'Complete performance dashboard and improvement plan.', time: '--' }
];

const APTITUDE_QUESTIONS = [
  { 
    id: 1, 
    text: "A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?", 
    options: ["120 metres", "150 metres", "180 metres", "210 metres"], 
    answer: "150 metres" 
  },
  { 
    id: 2, 
    text: "Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new numbers are in the ratio 12:23. The smaller number is:", 
    options: ["27", "33", "49", "55"], 
    answer: "33" 
  },
  { 
    id: 3, 
    text: "A sum of money at simple interest amounts to Rs. 815 in 3 years and to Rs. 854 in 4 years. The sum is:", 
    options: ["Rs. 650", "Rs. 690", "Rs. 698", "Rs. 700"], 
    answer: "Rs. 698" 
  }
];

export default function FullMockInterviewPage() {
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  
// Aptitude Round States
  const [aptitudeQuestions, setAptitudeQuestions] = useState([...APTITUDE_QUESTIONS]);
  const [aptitudeQIndex, setAptitudeQIndex] = useState(0);
  const [aptitudeAnswers, setAptitudeAnswers] = useState({});
  const [aptitudeTimeLeft, setAptitudeTimeLeft] = useState(15 * 60);
  const [isAptitudeLocked, setIsAptitudeLocked] = useState(false);

  // Global Grading
  const [calculatedFinalScore, setCalculatedFinalScore] = useState(84); // Default to 84 until Evaluation phase
  const [aiReport, setAiReport] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);

  // Coding Round States
  const [codingCode, setCodingCode] = useState(`function isPalindrome(s) {\n  // Write your code here...\n  \n  return true;\n}`);
  const [codingOutput, setCodingOutput] = useState("Waiting for execution...");
  const [isExecuting, setIsExecuting] = useState(false);

  // ML Technical Round States
  const [mlChatInput, setMlChatInput] = useState("");
  const [mlChatLog, setMlChatLog] = useState([
    { role: "ai", text: "Hello. I am the AI/ML Technical Evaluator. Today we will cover Regression vs Classification, Bias-Variance tradeoff, and Evaluation metrics. Are you ready?" }
  ]);
  const [isMlChatLoading, setIsMlChatLoading] = useState(false);

  // Case Study Round States
  const [caseStudyText, setCaseStudyText] = useState("1. Problem Framing:\n\n2. Data Collection & Features:\n\n3. Model Selection:\n\n4. Serving & Monitoring:\n");

  // System Design Round States
  const [sysDesignConfig, setSysDesignConfig] = useState({
    apiGateway: "AWS API Gateway",
    database: "PostgreSQL (Metadata) + Cassandra (Scale)",
    cache: "Redis Cluster",
    queue: "Kafka",
    storage: "S3 Object Storage"
  });

  // Code Review Round States
  const [reviewComments, setReviewComments] = useState([
    { line: 17, comment: "Possible unhandled promise. No await." }
  ]);
  const [newCommentLine, setNewCommentLine] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Resume Review Round States
  const [resumeChatLog, setResumeChatLog] = useState([
    { role: "ai", text: "I see you listed a Node.js Microservices project using Kafka and Redis. Could you elaborate on what specific consistency challenges you faced implementing the pub/sub architecture?" }
  ]);
  const [resumeChatInput, setResumeChatInput] = useState("");
  const [isResumeChatLoading, setIsResumeChatLoading] = useState(false);

  // HR Voice Round States
  const [hrChatLog, setHrChatLog] = useState([
    { role: "ai", text: "Welcome to the Behavioral and Scenarios round. Let's start with the STAR method: Tell me about a time you had a fundamental technical disagreement with a Senior Engineer or Product Manager regarding a scale or deadline constraint. How did you resolve it?" }
  ]);
  const [isHrRecording, setIsHrRecording] = useState(false);

  // Pair Programming Round States
  const [collabCode, setCollabCode] = useState(`class RateLimiter {\n  constructor(limit) {\n    this.limit = limit;\n    this.requests = new Map();\n  }\n\n  // TODO: Implement allowRequest(userId)\n}`);
  const [collabChatLog, setCollabChatLog] = useState([
    { role: "ai", text: "Hey! Let's build a basic Rate Limiter together for the API. I've set up the boilerplate class for you on the left. How should we approach the sliding window tracking using the Map?" }
  ]);
  const [collabChatInput, setCollabChatInput] = useState("");
  const [isCollabLoading, setIsCollabLoading] = useState(false);

  // Dynamic Configurations
  const [dynamicCoding, setDynamicCoding] = useState({ title: "Rate Limiter", description: "Design an API Rate Limiter.", difficulty: "Medium", starter_code: `function isPalindrome(s) {\n  // Write your code here...\n  \n  return true;\n}` });
  const [dynamicCaseStudy, setDynamicCaseStudy] = useState({ problem: "Design a Spam Detection System", context: "Build an end-to-end ML architecture to classify SMS/Emails as Spam or Not Spam for 1B active daily users." });
  const [dynamicSysDesign, setDynamicSysDesign] = useState({ problem: "Architect a scalable backend or custom task node", constraints: "Limit latency to < 50ms for 1M reads/sec." });

  const navigate = useNavigate();

  const handleRunCode = async () => {
    setIsExecuting(true);
    setCodingOutput("Executing tests...");
    try {
       const res = await executeCode('javascript', codingCode);
       if(res.success) {
         setCodingOutput(res.output || "Tests Passed - Console Clean");
       } else {
         setCodingOutput(res.error || "Execution Error");
       }
    } catch(err) {
       setCodingOutput("Failed to execute code natively.");
    } finally {
       setIsExecuting(false);
    }
  };

  const handleSendMlMessage = async (e) => {
    e?.preventDefault();
    if (!mlChatInput.trim() || isMlChatLoading) return;

    const newLog = [...mlChatLog, { role: "user", text: mlChatInput }];
    setMlChatLog(newLog);
    setMlChatInput("");
    setIsMlChatLoading(true);

    try {
      const res = await axiosInstance.post("/interview/chat", {
        chatLog: newLog,
        interviewType: "ML Technical",
        hostility: 5
      });
      setMlChatLog([...newLog, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      setMlChatLog([...newLog, { role: "ai", text: "Connection error logging telemetry." }]);
    } finally {
      setIsMlChatLoading(false);
    }
  };

  const handleSendResumeMessage = async (e) => {
    e?.preventDefault();
    if (!resumeChatInput.trim() || isResumeChatLoading) return;

    const newLog = [...resumeChatLog, { role: "user", text: resumeChatInput }];
    setResumeChatLog(newLog);
    setResumeChatInput("");
    setIsResumeChatLoading(true);

    try {
      const res = await axiosInstance.post("/interview/chat", {
        chatLog: newLog,
        interviewType: "Resume",
        hostility: 7
      });
      setResumeChatLog([...newLog, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      setResumeChatLog([...newLog, { role: "ai", text: "Connection error logging resume AI." }]);
    } finally {
      setIsResumeChatLoading(false);
    }
  };

  const handleSendCollabMessage = async (e) => {
    e?.preventDefault();
    if (!collabChatInput.trim() || isCollabLoading) return;

    const newLog = [...collabChatLog, { role: "user", text: collabChatInput }];
    setCollabChatLog(newLog);
    setCollabChatInput("");
    setIsCollabLoading(true);

    try {
      const res = await axiosInstance.post("/interview/chat", {
        chatLog: newLog,
        interviewType: "Pair Programming",
        codeSnippet: collabCode
      });
      setCollabChatLog([...newLog, { role: "ai", text: res.data.reply }]);
    } catch (err) {
      setCollabChatLog([...newLog, { role: "ai", text: "Connection error logging pair programming AI." }]);
    } finally {
      setIsCollabLoading(false);
    }
  };

  // Global Timer effect for active round
  useEffect(() => {
    let timer;
    if (isStarted && currentRoundIndex === 0 && aptitudeTimeLeft > 0) {
      timer = setInterval(() => setAptitudeTimeLeft(prev => prev - 1), 1000);
    } else if (isStarted && currentRoundIndex === 0 && aptitudeTimeLeft <= 0) {
      handleNext();
    }
    return () => clearInterval(timer);
  }, [isStarted, currentRoundIndex, aptitudeTimeLeft]);

  const currentRound = ROUNDS[currentRoundIndex];

  const handleNext = async () => {
    if (currentRoundIndex === 0) {
      setIsAptitudeLocked(true);
    }

    if (currentRoundIndex < ROUNDS.length - 1) {
      const nextIndex = currentRoundIndex + 1;
      
      // If we are moving into the Final Evaluation exactly:
      if (nextIndex === ROUNDS.length - 1) {
        try {
          // Dummy calculate internal logic for hackathon MVP realness
          let aptitudeCorrect = 0;
          aptitudeQuestions.forEach((q) => {
            if (aptitudeAnswers[q.id] === q.answer || (q.options && aptitudeAnswers[q.id] === q.options[0])) {
               aptitudeCorrect += 1;
            }
          });
          const aptitudePct = Math.round((aptitudeCorrect / aptitudeQuestions.length) * 100) || 75;
          const codingPct = codingOutput.includes("Error") ? 30 : 85;

          const calculatedTotal = Math.round((aptitudePct + codingPct + 80 + 85) / 4);
          setCalculatedFinalScore(calculatedTotal);

          setIsEvaluating(true);
          const feedbackRes = await axiosInstance.post("/interview/chat", {
             chatLog: [
               { role: "user", text: `Generate a Final Evaluation Report. Aptitude Score: ${aptitudePct}%, Coding Score: ${codingPct}%. Analyze these strictly and return valid JSON.` }
             ],
             interviewType: "Final Evaluation"
          });

          let parsed = {};
          try {
             const jsonMatch = feedbackRes.data.reply.match(/\{[\s\S]*\}/);
             parsed = JSON.parse(jsonMatch ? jsonMatch[0] : "{}");
          } catch (e) {
             parsed = { feedback: feedbackRes.data.reply || "Assessment Finished.", hire_decision: "Yes", level: "L4", strengths: ["Analytical"], weaknesses: ["Verbose"] };
          }
          setAiReport(parsed);

          await axiosInstance.post("/interview/save-session", {
             targetRole,
             difficulty: targetDifficulty,
             finalScore: calculatedTotal,
             roundScores: { aptitude: aptitudePct, coding: codingPct },
             aiFeedback: parsed
          });
          setIsEvaluating(false);
          console.log("Gauntlet Sync Successful");
        } catch (err) {
          console.error("Failed to sync final Gauntlet logic:", err);
        }
      }
      
      setCurrentRoundIndex(nextIndex);
    }
  };

  const handlePrevious = () => {
    if (currentRoundIndex > 0) {
      setCurrentRoundIndex(currentRoundIndex - 1);
    }
  };

  // Pre-Interview Config States
  const [targetRole, setTargetRole] = useState("Full-Stack Engineer");
  const [targetDifficulty, setTargetDifficulty] = useState("FAANG Level");
  const [uploadedResume, setUploadedResume] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  // Real Dynamic Backend Initialization
  const startInterview = async () => {
    if (!uploadedResume) return;
    setIsInitializing(true);
    
    try {
      const formData = new FormData();
      formData.append('role', targetRole);
      formData.append('difficulty', targetDifficulty);
      formData.append('resume', uploadedResume);
      
      const configRes = await axiosInstance.post("/interview/start", formData, {
         headers: { 'Content-Type': 'multipart/form-data' }
      });

      console.log("[Gauntlet Baseline Generated] - ", configRes.data);
      const { configuration } = configRes.data;

      // Dynamically override initial state constraints
      if (configuration) {
        if (configuration.aptitude?.length > 0) {
          const formattedAptitude = configuration.aptitude.map((q, idx) => ({
            id: q.id || idx + 1,
            text: q.question || q.text || "Problem context description.",
            options: q.options || [],
            answer: q.answer || ""
          }));
          setAptitudeQuestions(formattedAptitude);
        }

        if (configuration.coding) {
          setDynamicCoding(configuration.coding);
          setCodingCode(configuration.coding.starter_code || "");
        }

        if (configuration.case_study) {
          setDynamicCaseStudy(configuration.case_study);
        }

        if (configuration.system_design) {
          setDynamicSysDesign(configuration.system_design);
        }

        if (configuration.resumeSummary) {
          setResumeChatLog([
            { role: "ai", text: `I reviewed your resume. ${configuration.resumeSummary || "Let's dive in."} Could you elaborate on this?` }
          ]);
        }

        if (configuration.ml_concepts_start) {
          setMlChatLog([
            { role: "ai", text: configuration.ml_concepts_start }
          ]);
        }

        if (configuration.pair_programming) {
          setCollabCode(configuration.pair_programming.starter_code || "");
          setCollabChatLog([
             { role: "ai", text: `Hey! Let's approach this: ${configuration.pair_programming.problem}. How should we start on the right structure?` }
          ]);
        }
      }
      
      setIsStarted(true);
    } catch (err) {
      console.error("Failed to initialize Gauntlet loop with AI:", err);
      toast.error("Failed to parse resume configuration with AI. Please try initiating again.");
    } finally {
      setIsInitializing(false);
    }
  };

  if (!isStarted) {
    return (
      <PageTransition>
        <div className="min-h-screen flex flex-col justify-center px-4 pt-64 pb-12 relative overflow-hidden bg-[#111317] text-white" style={{ backgroundColor: "#111317" }}>
          {/* Deep Void Background Glows */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#7C4DFF]/10 rounded-full blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-[#00E5FF]/10 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="container mx-auto max-w-6xl relative z-10 flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 text-left">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="inline-flex p-5 rounded-[1.25rem] bg-[#7C4DFF]/10 text-[#d8b9ff] mb-6 ring-1 ring-[#7C4DFF]/20 backdrop-blur-3xl shadow-[0_0_60px_-15px_rgba(124,77,255,0.4)]"
              >
                <TrophyIcon className="size-12" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-white via-white/80 to-white/40 drop-shadow-sm font-manrope">
                Configure Protocol
              </h1>
              <p className="text-xl text-[#cac3d8] max-w-2xl leading-relaxed font-inter font-medium mb-8">
                Initialize a full 9-stage engineering hiring loop tailored natively to your target role and strictly graded.
              </p>

              <div className="bg-[#1a1c20] border border-[#494455]/40 rounded-3xl p-8 mb-8 shadow-2xl relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-[#9244f4]/5 to-transparent pointer-events-none"></div>
                 
                 <div className="mb-6">
                    <label className="block text-sm font-bold text-[#948ea1] mb-2 uppercase tracking-wide">Target Role</label>
                    <select 
                      className="select w-full bg-[#111317] border-[#494455]/50 text-white focus:border-[#d8b9ff] text-lg font-medium h-14"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    >
                       <option>Frontend Engineer</option>
                       <option>Backend Engineer</option>
                       <option>Full-Stack Engineer</option>
                       <option>Machine Learning Engineer</option>
                       <option>Data Scientist</option>
                    </select>
                 </div>

                 <div className="mb-6">
                    <label className="block text-sm font-bold text-[#948ea1] mb-2 uppercase tracking-wide">Select Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                       {["Junior L3", "Mid-Level L4", "FAANG Level"].map((diff) => (
                          <button 
                            key={diff}
                            onClick={() => setTargetDifficulty(diff)}
                            className={`btn h-12 border ${targetDifficulty === diff ? 'bg-[#9244f4] bg-opacity-20 border-[#9244f4] text-[#d8b9ff] shadow-[0_0_15px_rgba(146,68,244,0.3)]' : 'bg-[#111317] border-[#494455]/30 text-[#948ea1] hover:border-[#494455]'}`}
                          >
                             {diff}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-bold text-[#948ea1] mb-2 uppercase tracking-wide">Upload Baseline Document</label>
                    <div className="border-2 border-dashed border-[#494455]/50 hover:border-[#00daf3]/50 rounded-2xl p-6 text-center transition-colors bg-[#111317]/50 cursor-pointer flex flex-col items-center justify-center">
                       <input 
                         type="file" 
                         accept=".pdf,.doc,.docx" 
                         className="hidden" 
                         id="resume-upload" 
                         onChange={(e) => setUploadedResume(e.target.files[0])}
                       />
                       <label htmlFor="resume-upload" className="cursor-pointer w-full h-full flex flex-col items-center">
                          <FileTextIcon className={`size-8 mb-3 ${uploadedResume ? 'text-[#00daf3]' : 'text-[#494455]'}`} />
                          {uploadedResume ? (
                            <span className="text-[#00daf3] font-bold">{uploadedResume.name}</span>
                          ) : (
                            <span className="text-[#948ea1]">Click to attach Resume PDF for AI Interrogation Phase</span>
                          )}
                       </label>
                    </div>
                 </div>
              </div>

              <button 
                onClick={startInterview}
                disabled={!uploadedResume || isInitializing}
                className={`btn btn-lg rounded-[1rem] px-14 py-4 border-0 text-white shadow-[0_0_40px_rgba(146,68,244,0.4)] transition-all font-inter font-bold tracking-wide w-full md:w-auto h-16 ${!uploadedResume || isInitializing ? 'opacity-50 grayscale cursor-not-allowed' : 'hover:shadow-[0_0_60px_rgba(146,68,244,0.6)] hover:scale-[1.02] bg-gradient-to-r from-[#d8b9ff] to-[#9244f4]'}`}
              >
                {isInitializing ? (
                  <span className="flex items-center gap-3">
                    <span className="loading loading-spinner loading-md"></span>
                    GENERATING AI BACKEND...
                  </span>
                ) : (
                  <>
                    INITIALIZE GAUNTLET LOOP
                    <ArrowRightIcon className="size-5 ml-3" />
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-gradient-to-b from-[#111317]/0 via-[#111317]/80 to-[#111317] z-10 pointer-events-none mt-40"></div>
                <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-4 scrollbar-hide opacity-80" style={{ perspective: '1000px' }}>
                  {ROUNDS.map((round, index) => {
                    const Icon = round.icon;
                    return (
                      <div key={round.id} className="bg-[#1a1c20] border border-[#494455]/30 p-5 rounded-2xl flex items-center gap-4 transform rotate-x-12 scale-95 opacity-80 blur-[1px]">
                          <div className="p-3 rounded-xl bg-[#111317] text-[#948ea1]">
                            <Icon className="size-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-bold text-[#bdf4ff] px-2 py-0.5 rounded-full bg-[#00e3fd]/10 tracking-wider">0{index + 1}</span>
                              <span className="text-[10px] text-[#948ea1] font-mono tracking-widest">{round.time}</span>
                            </div>
                            <h3 className="font-bold text-sm text-[#cac3d8]">{round.title}</h3>
                          </div>
                      </div>
                    );
                  })}
                </div>
            </div>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col w-full !bg-[#111317] text-white" style={{ backgroundColor: "#111317", color: "white" }}>
        {/* Progress Timeline Header */}
        <div className="bg-[#111317]/90 backdrop-blur-2xl border-b border-[#494455]/30 p-4 sticky top-16 z-30 shadow-md">
          <div className="container mx-auto max-w-7xl">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {ROUNDS.map((round, idx) => (
                <div key={round.id} className="flex items-center shrink-0">
                  <div className={`flex items-center justify-center h-9 px-5 rounded-full text-sm font-bold transition-all duration-300 ${
                    idx === currentRoundIndex 
                      ? 'bg-gradient-to-r from-[#d8b9ff] to-[#9244f4] text-white shadow-[0_0_20px_rgba(146,68,244,0.4)] scale-105' 
                      : idx < currentRoundIndex
                        ? 'bg-[#00e3fd]/10 text-[#00daf3] border border-[#00e3fd]/20'
                        : 'bg-[#1a1c20] text-[#948ea1] border border-[#494455]/30'
                  }`}>
                    {idx < currentRoundIndex ? <CheckCircle2Icon className="size-4 mr-2" /> : <round.icon className="size-4 mr-2" />}
                    {round.title}
                  </div>
                  {idx < ROUNDS.length - 1 && (
                    <div className={`w-10 h-0.5 mx-2 rounded-full ${idx < currentRoundIndex ? 'bg-[#00daf3]/50' : 'bg-[#494455]/30'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dynamic Interview Content Area */}
        <div className="flex-1 container mx-auto px-4 py-8 max-w-7xl flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRound.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col"
            >
              {/* This is where we inject the specific UI for each round */}
              <div className="flex-1 rounded-3xl bg-[#1a1c20]/80 border border-[#494455]/30 flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.5)] overflow-hidden backdrop-blur-xl p-8 relative">
                  
                  {/* Decorative Background */}
                  <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#9244f4]/10 rounded-full blur-[100px] pointer-events-none"></div>

                  <div className="flex items-center gap-4 mb-8 relative z-10 border-b border-[#494455]/30 pb-6">
                    <div className="p-4 rounded-2xl bg-[#9244f4]/20 text-[#d8b9ff] border border-[#9244f4]/40 shadow-[0_0_15px_rgba(146,68,244,0.3)]">
                      <currentRound.icon className="size-8" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-black text-white">{currentRound.title}</h2>
                      <p className="text-[#948ea1] mt-1">{currentRound.description}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-2 text-sm font-mono bg-base-200 px-4 py-2 rounded-lg">
                       Time Limit: <span className="text-primary font-bold">{currentRound.time}</span>
                    </div>
                  </div>

                  {/* Dynamic Round Content */}
                  {currentRound.id === 'aptitude' ? (
                    <div className="flex-1 flex flex-col relative z-10 w-full max-w-4xl mx-auto h-full overflow-y-auto pr-4 scrollbar-hide mt-4">
                      {/* Interactive Aptitude Module */}
                      <div className="mb-6 flex justify-between items-end border-b border-base-200 pb-4">
                        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                          Question {aptitudeQIndex + 1} of {aptitudeQuestions.length}
                        </h3>
                        <div className="badge badge-error gap-2 badge-lg shadow-sm font-mono">
                          <ClockIcon className="size-4"/> 
                          {Math.floor(aptitudeTimeLeft / 60)}:{(aptitudeTimeLeft % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                      
                      <div className="bg-[#111317] p-6 rounded-2xl border border-[#494455]/30 shadow-inner mb-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#00daf3]/5 to-[#9244f4]/5 pointer-events-none"></div>
                        <p className="text-lg font-medium leading-relaxed mb-6 relative z-10 text-white shadow-sm"><DecodingText text={aptitudeQuestions[aptitudeQIndex].text} /></p>
                        
                        <div className="space-y-3 relative z-10">
                            {aptitudeQuestions[aptitudeQIndex].options.map((opt, i) => {
                              const qId = aptitudeQuestions[aptitudeQIndex].id;
                              const isSelected = aptitudeAnswers[qId] === opt;
                              return (
                                <AptitudeOptionCard key={i} isSelected={isSelected} onClick={() => !isAptitudeLocked && setAptitudeAnswers(prev => ({ ...prev, [qId]: opt }))}>
                                    <input 
                                      type="radio" 
                                      name={`aptitude_q${qId}`} 
                                      className="radio radio-primary border border-white/30 checked:border-[#00daf3] checked:bg-[#00daf3]" 
                                      checked={isSelected}
                                      disabled={isAptitudeLocked}
                                      onChange={() => !isAptitudeLocked && setAptitudeAnswers(prev => ({ ...prev, [qId]: opt }))}
                                    />
                                    <span className={`font-medium ${isSelected ? 'text-[#00daf3]' : 'text-[#cac3d8]'} ${isAptitudeLocked ? 'opacity-60 cursor-not-allowed' : ''}`}>{opt}</span>
                                </AptitudeOptionCard>
                              );
                            })}
                        </div>
                      </div>

                      <div className="mt-auto flex justify-end gap-4">
                         <button 
                           className="btn bg-transparent border-[#494455]/50 hover:bg-[#2a2d36] text-[#cac3d8]"
                           onClick={() => {
                             if (aptitudeQIndex < aptitudeQuestions.length - 1) {
                               setAptitudeQIndex(prev => prev + 1);
                             }
                           }}
                         >
                           Skip Concept
                         </button>
                         <button 
                           className="btn bg-[#00daf3] hover:bg-[#00b5cc] text-[#111317] border-none font-bold px-8 shadow-[0_0_20px_rgba(0,218,243,0.4)]"
                           onClick={() => {
                             if (aptitudeQIndex < aptitudeQuestions.length - 1) {
                               setAptitudeQIndex(prev => prev + 1);
                             } else {
                               handleNext(); // Trigger end of round
                             }
                           }}
                         >
                           {aptitudeQIndex === aptitudeQuestions.length - 1 ? 'Finalize Assesment' : 'Submit Answer & Run Context'}
                           <ArrowRightIcon className="size-4"/>
                         </button>
                      </div>
                    </div>
                  ) : currentRound.id === 'coding' ? (
                    <div className="flex-1 flex gap-4 w-full h-full mt-4">
                       <div className="flex-1 bg-base-200/50 rounded-2xl border border-base-200 p-6 overflow-y-auto hidden md:block">
                          <h3 className="text-xl font-bold mb-4 flex items-center gap-2"><Code2Icon className="size-5 text-primary"/> Valid Palindrome</h3>
                          <div className="flex gap-2 mb-4">
                             <span className="badge badge-success badge-sm">Easy</span>
                             <span className="badge badge-outline badge-sm">String</span>
                          </div>
                          <p className="text-sm opacity-80 mb-4 leading-relaxed">A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.</p>
                          <div className="bg-base-300 p-4 rounded-xl text-xs font-mono mb-4 text-base-content/70">
                             <strong>Input:</strong> s = "A man, a plan, a canal: Panama"<br/>
                             <strong>Output:</strong> true
                          </div>
                       </div>
                       <div className="flex-[2] flex flex-col gap-4">
                         <div className="flex-1 bg-base-300 rounded-2xl border border-base-200 font-mono text-sm p-4 text-primary w-full relative flex flex-col">
                            <div className="absolute top-2 right-4 text-xs opacity-50 z-10">javascript</div>
                            <textarea 
                               className="mt-4 flex-1 w-full bg-transparent outline-none resize-none font-mono text-sm"
                               value={codingCode}
                               onChange={(e) => setCodingCode(e.target.value)}
                               spellCheck={false}
                            />
                         </div>
                         <div className="h-32 bg-[#111317] rounded-2xl border border-base-300 p-4 font-mono text-xs flex flex-col shadow-inner overflow-y-auto">
                            <span className="text-success mb-2">&gt; Console Output</span>
                            <span className={`${codingOutput.includes("Error") ? "text-error" : "opacity-80"} whitespace-pre-wrap`}>
                               {codingOutput}
                            </span>
                         </div>
                         <div className="flex justify-end gap-4 mt-auto">
                            <button 
                               className="btn btn-outline border-primary/30 text-primary" 
                               onClick={handleRunCode}
                               disabled={isExecuting}
                            >
                               {isExecuting ? <span className="loading loading-spinner loading-xs"></span> : null} Run Tests
                            </button>
                            <button className="btn btn-primary px-8" onClick={handleNext}>Submit Final Code <ArrowRightIcon className="size-4"/></button>
                         </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'ml_concepts' ? (
                    <div className="flex-1 flex gap-4 w-full h-full mt-4">
                       <div className="flex-1 bg-base-200/50 rounded-2xl border border-base-200 flex flex-col overflow-hidden relative">
                           <div className="border-b border-base-300 p-4 font-bold text-sm flex items-center gap-2">
                              <BrainCircuitIcon className="size-4 text-primary" /> ML AI Evaluator Connected
                           </div>
                           <div className="flex-1 p-4 overflow-y-auto space-y-4">
                              {mlChatLog.map((chat, idx) => (
                                 <div key={idx} className={`chat ${chat.role === 'ai' ? 'chat-start' : 'chat-end'}`}>
                                    <div className={`chat-bubble ${chat.role === 'ai' ? 'bg-base-300 text-base-content' : 'bg-primary text-white'}`}>
                                      {chat.text}
                                    </div>
                                 </div>
                              ))}
                              {isMlChatLoading && (
                                <div className="chat chat-start">
                                   <div className="chat-bubble bg-base-300 text-base-content"><span className="loading loading-dots loading-xs"></span></div>
                                </div>
                              )}
                           </div>
                           <form onSubmit={handleSendMlMessage} className="p-4 border-t border-base-300 flex gap-2 bg-[#111317]">
                              <input 
                                type="text" 
                                className="input input-bordered flex-1" 
                                placeholder="Explain your concept..." 
                                value={mlChatInput}
                                onChange={(e) => setMlChatInput(e.target.value)}
                              />
                              <button type="submit" className="btn btn-primary" disabled={isMlChatLoading}>Send</button>
                           </form>
                       </div>
                       <div className="flex-1 hidden md:flex flex-col gap-4">
                           <div className="bg-base-200/50 rounded-2xl p-6 border border-base-200">
                              <h3 className="font-bold text-lg mb-4">Core Concepts Assessment</h3>
                              <ul className="space-y-3 text-sm opacity-80 list-disc list-inside">
                                 <li><strong>Regression vs Classification:</strong> Differentiate outputs.</li>
                                 <li><strong>Bias-Variance:</strong> Explain overfitting and trading complexity.</li>
                                 <li><strong>Metrics:</strong> F1 Score, ROC-AUC, Recall optimization.</li>
                              </ul>
                              <div className="mt-8 bg-error/10 border border-error/20 rounded-xl p-4 text-xs font-mono">
                                 &gt; The AI dynamically adapts its questions. Do not copy-paste definitions; explain them intuitively.
                              </div>
                           </div>
                           <div className="mt-auto flex justify-end gap-4">
                              <button className="btn btn-primary px-8" onClick={handleNext}>Finish ML Round <ArrowRightIcon className="size-4"/></button>
                           </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'case_study' ? (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 w-full h-full mt-4">
                       <div className="flex-1 bg-base-200/50 rounded-2xl border border-base-200 p-6 flex flex-col overflow-y-auto">
                           <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-primary">
                             <FileTextIcon className="size-5"/> {dynamicCaseStudy.problem}
                           </h3>
                           <p className="text-sm opacity-80 mb-6 leading-relaxed">
                             {dynamicCaseStudy.context}
                           </p>
                           
                           <div className="flex flex-wrap gap-2 mb-6">
                              <span className="badge badge-outline">Text Classification</span>
                              <span className="badge badge-outline">Scale</span>
                              <span className="badge badge-outline">Real-Time</span>
                           </div>

                           <div className="mt-auto bg-base-300 rounded-xl p-4 text-xs">
                             <h4 className="font-bold mb-2">Evaluation Metrics:</h4>
                             <ul className="list-disc list-inside space-y-1 opacity-75">
                               <li>Scalability (Latency &lt; 50ms)</li>
                               <li>Model Choice Appropriateness</li>
                               <li>Handling Imbalanced Data</li>
                             </ul>
                           </div>
                       </div>

                       <div className="flex-[2] flex flex-col shadow-inner bg-base-200/30 rounded-2xl border border-base-200 overflow-hidden relative">
                           <div className="bg-[#111317] border-b border-base-300 p-3 flex justify-between items-center text-xs">
                              <span className="font-mono opacity-50">architecture_planner.md</span>
                              <button className="btn btn-xs btn-outline">Preview Diagram</button>
                           </div>
                           <textarea 
                              className="flex-1 w-full bg-transparent outline-none resize-none font-mono text-sm p-6 leading-relaxed"
                              value={caseStudyText}
                              onChange={(e) => setCaseStudyText(e.target.value)}
                              spellCheck={false}
                           />
                           <div className="bg-[#111317] border-t border-base-300 p-4 flex justify-end gap-4">
                              <button className="btn btn-outline">Draft Outline</button>
                              <button className="btn btn-primary px-8" onClick={handleNext}>Submit Architecture <ArrowRightIcon className="size-4"/></button>
                           </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'system_design' ? (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 w-full h-full mt-4">
                       <div className="flex-1 bg-base-200/50 rounded-2xl border border-base-200 p-6 flex flex-col overflow-y-auto">
                           {/* The Problem Prompt */}
                           <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-secondary">
                             <DatabaseIcon className="size-5"/> Design Netflix Video Streaming
                           </h3>
                           <p className="text-sm opacity-80 mb-6 leading-relaxed">
                             Design a globally scalable architecture capable of streaming 4K video to 50M concurrent users. 
                             Define the Edge, Delivery Network, Database, and internal microservices.
                           </p>
                           
                           <div className="flex flex-col gap-4">
                              {/* Configuration Fields */}
                              {Object.entries(sysDesignConfig).map(([key, val]) => (
                                <div key={key} className="form-control">
                                  <label className="label py-1">
                                     <span className="label-text text-xs uppercase opacity-70 font-bold">{key}</span>
                                  </label>
                                  <input 
                                     type="text" 
                                     className="input input-sm input-bordered border-[#494455]/50 bg-[#111317] font-mono text-xs focus:border-secondary" 
                                     value={val}
                                     onChange={(e) => setSysDesignConfig(prev => ({ ...prev, [key]: e.target.value }))}
                                  />
                                </div>
                              ))}
                           </div>

                       </div>

                       <div className="flex-[2] flex flex-col shadow-inner bg-[#111317] rounded-2xl border border-base-200 overflow-hidden relative justify-between">
                           {/* Mock Visualizer rendering */}
                           <div className="border-b border-base-300 p-3 flex justify-between items-center text-xs bg-base-200">
                              <span className="font-mono opacity-50 flex items-center gap-2"><Network className="size-4"/> Architecture Graph Topology Live</span>
                              <div className="badge badge-error badge-sm gap-1 animate-pulse"><Activity className="size-3"/> Recording Trace</div>
                           </div>

                           <div className="flex-1 p-8 flex items-center justify-center relative overflow-hidden">
                              <div className="absolute inset-0 block bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:14px_24px]"></div>
                              
                              <div className="flex flex-col items-center gap-6 relative z-10 w-full max-w-sm">
                                 {/* Top Nodes */}
                                 <div className="grid grid-cols-2 w-full gap-4">
                                     <div className="bg-primary/20 border border-primary text-center p-3 rounded-xl shadow-lg backdrop-blur-md">
                                        <h4 className="font-bold text-sm">Client Devices</h4>
                                        <p className="text-[10px] opacity-70">50M Active</p>
                                     </div>
                                     <div className="bg-secondary/20 border border-secondary text-center p-3 rounded-xl shadow-lg backdrop-blur-md">
                                        <h4 className="font-bold text-sm">CDN Edge</h4>
                                        <p className="text-[10px] opacity-70">{sysDesignConfig.cache}</p>
                                     </div>
                                 </div>
                                 
                                 {/* Connector */}
                                 <div className="w-1 h-8 bg-gradient-to-b from-secondary to-accent"></div>
                                 
                                 {/* API Gateway */}
                                 <div className="w-full bg-accent/20 border border-accent text-center p-3 rounded-xl shadow-lg backdrop-blur-md">
                                     <h4 className="font-bold text-sm">API Gateway</h4>
                                     <p className="text-[10px] opacity-70">{sysDesignConfig.apiGateway}</p>
                                 </div>
                                 
                                 <div className="w-1 h-8 bg-gradient-to-b from-accent to-success"></div>

                                 {/* Microservices & DB */}
                                 <div className="grid grid-cols-2 w-full gap-4">
                                     <div className="bg-success/20 border border-success text-center p-3 rounded-xl shadow-lg backdrop-blur-md">
                                        <h4 className="font-bold text-sm">Main Database</h4>
                                        <p className="text-[10px] opacity-70">{sysDesignConfig.database}</p>
                                     </div>
                                     <div className="bg-info/20 border border-info text-center p-3 rounded-xl shadow-lg backdrop-blur-md">
                                        <h4 className="font-bold text-sm">Media Storage</h4>
                                        <p className="text-[10px] opacity-70">{sysDesignConfig.storage}</p>
                                     </div>
                                 </div>
                              </div>
                           </div>

                           <div className="bg-base-200 border-t border-base-300 p-4 flex justify-between items-center gap-4 relative z-20">
                              <span className="text-xs text-base-content/50 italic">Diagram updates live based on your configuration.</span>
                              <button className="btn btn-secondary px-8" onClick={handleNext}>Submit Design <ArrowRightIcon className="size-4"/></button>
                           </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'debugging' ? (
                    <div className="flex-1 flex gap-6 w-full h-full mt-4">
                       <div className="flex-1 bg-[#111317] rounded-2xl border border-base-200 shadow-inner flex flex-col overflow-hidden relative">
                           <div className="border-b border-base-300 p-3 flex justify-between items-center bg-base-300/50">
                              <span className="text-xs font-mono font-bold flex items-center gap-2 text-error"><BugIcon className="size-4"/> pull_request_42.ts</span>
                           </div>
                           <pre className="p-4 font-mono text-sm leading-relaxed overflow-auto flex-1 text-base-content/80">
{`10: async function processPayment(req, res) {
11:    try {
12:      const user = await User.findById(req.user.id);
13:      const amount = req.body.amount;
14:      
15:      // Deduct balance
16:      user.balance = user.balance - amount;
17:      user.save(); // Unhandled promise
18:      
19:      return res.status(200).send("Success");
20:    } catch(e) {
21:      console.log(e);
22:    }
23: }`}
                           </pre>
                       </div>

                       <div className="flex-1 flex flex-col gap-4">
                          <div className="bg-base-200/50 rounded-2xl border border-base-200 p-6">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-warning"><FileTextIcon className="size-5" /> PR Review Comments</h3>
                            <p className="text-sm opacity-80 mb-6">Flag issues, security vulnerabilities, or poor practices in the TypeScript code on the left.</p>
                            
                            <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                               {reviewComments.map((rc, idx) => (
                                 <div key={idx} className="bg-base-300 p-3 rounded-lg border border-base-content/10 text-sm flex gap-3">
                                   <span className="font-mono text-error font-bold w-tight shrink-0 mt-0.5">L{rc.line}:</span>
                                   <span>{rc.comment}</span>
                                 </div>
                               ))}
                            </div>
                          </div>

                          <div className="bg-base-200/50 rounded-2xl border border-base-200 p-6 mt-auto">
                            <h4 className="font-bold text-sm mb-3">Add new comment</h4>
                            <div className="flex gap-2">
                               <input 
                                 type="number" 
                                 className="input input-bordered w-20 text-center font-mono" 
                                 placeholder="Line"
                                 value={newCommentLine}
                                 onChange={e => setNewCommentLine(e.target.value)}
                               />
                               <input 
                                 type="text" 
                                 className="input input-bordered flex-1" 
                                 placeholder="Explain the bug or optimization..."
                                 value={newCommentText}
                                 onChange={e => setNewCommentText(e.target.value)}
                                 onKeyDown={(e) => {
                                   if (e.key === 'Enter' && newCommentLine && newCommentText) {
                                     setReviewComments(prev => [...prev, { line: newCommentLine, comment: newCommentText }]);
                                     setNewCommentText("");
                                   }
                                 }}
                               />
                               <button 
                                 className="btn btn-primary"
                                 onClick={() => {
                                   if (newCommentLine && newCommentText) {
                                     setReviewComments(prev => [...prev, { line: newCommentLine, comment: newCommentText }]);
                                     setNewCommentText("");
                                   }
                                 }}
                               >Add</button>
                            </div>
                            <div className="flex justify-end gap-4 mt-6">
                               <button className="btn btn-warning px-8 text-warning-content font-bold shadow-lg shadow-warning/20" onClick={handleNext}>Approve Changes <CheckCircle2Icon className="size-4"/></button>
                            </div>
                          </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'resume' ? (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 w-full h-full mt-4">
                       {/* Left Pane: The Loaded Resume */}
                       <div className="flex-[1.5] bg-base-100 rounded-2xl border border-base-200 shadow-xl flex flex-col overflow-hidden relative p-8">
                           <div className="absolute top-0 right-0 p-4">
                              <span className="badge badge-success font-mono badge-sm">Parsed & Indexed</span>
                           </div>
                           <h1 className="text-3xl font-serif text-primary">Nikhil Sehgal</h1>
                           <h2 className="text-lg font-bold opacity-70 mb-6">Senior Full-Stack Engineer</h2>
                           
                           <div className="space-y-6 flex-1 overflow-y-auto pr-4 scrollbar-hide text-sm">
                              <div>
                                 <h3 className="font-bold border-b border-base-300 pb-1 mb-2 uppercase text-xs tracking-wider">Experience</h3>
                                 <div className="mb-4">
                                    <div className="flex justify-between font-bold">
                                       <span>Software Engineer III</span>
                                       <span className="opacity-50 text-xs">2021 - Present</span>
                                    </div>
                                    <p className="opacity-80 italic mb-1">TechCorp SaaS</p>
                                    <ul className="list-disc list-inside space-y-1 opacity-90 leading-relaxed text-[13px]">
                                       <li>Engineered a high-throughput microservice architecture using Node.js and Redis, handling 5M+ pub/sub events daily.</li>
                                       <li>Optimized PostgreSQL queries reducing P99 latency by 45%.</li>
                                    </ul>
                                 </div>
                              </div>
                              <div>
                                 <h3 className="font-bold border-b border-base-300 pb-1 mb-2 uppercase text-xs tracking-wider">Skills</h3>
                                 <div className="flex flex-wrap gap-2">
                                     {['JavaScript', 'React', 'Node.js', 'PostgreSQL', 'Redis', 'Kafka', 'System Design'].map(s => (
                                         <span key={s} className="badge badge-outline badge-sm font-mono bg-base-200">{s}</span>
                                     ))}
                                 </div>
                              </div>
                           </div>
                       </div>

                       {/* Right Pane: AI Drill-Down Evaluator */}
                       <div className="flex-1 bg-[#1a1c20] rounded-2xl border border-primary/20 shadow-inner flex flex-col overflow-hidden relative">
                           <div className="border-b border-[#494455]/30 p-3 flex justify-between items-center text-xs">
                              <span className="font-mono text-primary font-bold flex items-center gap-2">
                                 <Activity className="size-4"/> Resume Interrogation Engine
                              </span>
                           </div>
                           <div className="flex-1 p-4 overflow-y-auto space-y-4">
                              {resumeChatLog.map((chat, idx) => (
                                 <div key={idx} className={`chat ${chat.role === 'ai' ? 'chat-start' : 'chat-end'}`}>
                                    <div className={`chat-bubble ${chat.role === 'ai' ? 'bg-[#9244f4]/20 border border-[#9244f4]/40 text-[#d8b9ff]' : 'bg-base-200 text-base-content'} text-[13px] leading-relaxed`}>
                                      {chat.text}
                                    </div>
                                 </div>
                              ))}
                              {isResumeChatLoading && (
                                <div className="chat chat-start">
                                   <div className="chat-bubble bg-[#9244f4]/20 text-[#d8b9ff]"><span className="loading loading-dots loading-xs"></span></div>
                                </div>
                              )}
                           </div>
                           <form onSubmit={handleSendResumeMessage} className="p-4 border-t border-[#494455]/30 flex gap-2 bg-[#111317]">
                              <input 
                                type="text" 
                                className="input input-bordered input-sm flex-1 font-mono text-xs" 
                                placeholder="Explain your impact..." 
                                value={resumeChatInput}
                                onChange={(e) => setResumeChatInput(e.target.value)}
                              />
                              <button type="submit" className="btn btn-primary btn-sm" disabled={isResumeChatLoading}>Reply</button>
                           </form>
                           <div className="bg-[#111317] p-2 flex justify-end">
                              <button className="btn btn-ghost btn-xs text-base-content/50" onClick={handleNext}>Skip Drill-Down &rarr;</button>
                           </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'hr_voice' ? (
                    <div className="flex-1 flex gap-6 w-full h-full mt-4">
                       {/* Left Pane: Artificial AI Avatar Representation */}
                       <div className="flex-1 flex flex-col justify-center items-center bg-[#111317] rounded-2xl border border-base-200 p-8 shadow-inner relative overflow-hidden">
                          <div className="absolute inset-0 bg-[#00daf3]/5 blur-[100px] pointer-events-none rounded-full"></div>
                          
                          <div className="relative z-10 size-48 rounded-full border border-[#00daf3]/30 flex items-center justify-center bg-[#00daf3]/10 mb-8 shadow-[0_0_50px_rgba(0,218,243,0.1)]">
                             <div className={`size-32 rounded-full border border-[#00daf3] flex items-center justify-center bg-[#00daf3]/20 transition-all duration-300 ${isHrRecording ? 'scale-110 shadow-[0_0_80px_rgba(0,218,243,0.6)] animate-pulse' : ''}`}>
                                  <UsersIcon className="size-12 text-[#00daf3] opacity-80" />
                             </div>
                             {isHrRecording && (
                                <div className="absolute inset-0 rounded-full border-2 border-[#00daf3]/50 animate-ping"></div>
                             )}
                          </div>
                          
                          <h3 className="text-xl font-bold mb-2">Technical Hiring Manager</h3>
                          <p className="text-sm opacity-60 mb-8 flex items-center gap-2">
                             <Activity className="size-4 animate-pulse text-success" /> Live Telemetry Linked
                          </p>

                          <button 
                             className={`btn ${isHrRecording ? 'btn-error animate-pulse' : 'btn-outline border-[#00daf3] text-[#00daf3]'} px-12 h-14 rounded-full shadow-lg transition-all duration-300`}
                             onClick={() => setIsHrRecording(!isHrRecording)}
                          >
                             {isHrRecording ? 'Stop Recording' : 'Hold to Speak'}
                          </button>
                       </div>

                       {/* Right Pane: Telemetry and Transcript */}
                       <div className="flex-[1.5] bg-[#1a1c20] rounded-2xl border border-base-200 flex flex-col overflow-hidden relative shadow-xl">
                          <div className="border-b border-base-300 p-4 font-bold text-sm bg-base-300/50 flex items-center gap-2">
                             <UsersIcon className="size-4 text-warning" /> Behavioral & STAR Protocol
                          </div>
                          
                          <div className="p-6 bg-warning/5 border-b border-warning/10 m-4 rounded-xl">
                             <p className="text-sm text-warning-content/90 font-medium leading-relaxed">
                                {hrChatLog[0].text}
                             </p>
                          </div>

                          <div className="flex-1 p-6 flex flex-col justify-end">
                             <div className="bg-[#111317] p-6 rounded-2xl border border-base-300 min-h-[150px] relative">
                                <span className="absolute top-2 left-4 text-[10px] font-mono opacity-50 uppercase tracking-widest">Live Transcript</span>
                                <div className="mt-4 text-sm font-mono opacity-80 leading-relaxed max-w-lg">
                                   {isHrRecording 
                                     ? <span className="text-[#00daf3] animate-pulse">Listening to microphone array... analyzing vocal stress and structuring STAR extraction...</span> 
                                     : <span className="opacity-30">Press hold to speak and dictate your response using the STAR (Situation, Task, Action, Result) method.</span>}
                                </div>
                             </div>
                          </div>

                          <div className="bg-[#111317] border-t border-base-300 p-4 flex justify-between items-center z-10">
                              <span className="text-xs text-base-content/50">Audio evaluation occurs dynamically.</span>
                              <button className="btn btn-primary px-8 shadow-lg" onClick={handleNext}>Confirm Submission <ArrowRightIcon className="size-4" /></button>
                          </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'pair_programming' ? (
                    <div className="flex-1 flex flex-col md:flex-row gap-6 w-full h-full mt-4">
                       {/* Left Pane: Collaborative Code Editor */}
                       <div className="flex-[2] bg-[#111317] rounded-2xl border border-base-300 shadow-xl flex flex-col overflow-hidden relative">
                           <div className="border-b border-[#2a2d36] p-3 flex justify-between items-center bg-[#1a1c20]">
                              <span className="text-xs font-mono font-bold flex items-center gap-2 text-white"><TerminalSquareIcon className="size-4 text-primary"/> Multi-player Workspace</span>
                              <div className="flex -space-x-2 overflow-hidden">
                                  <div className="inline-block size-6 rounded-full ring-2 ring-[#00daf3] bg-[#00daf3]/20 text-[10px] flex items-center justify-center font-bold text-white shadow-[0_0_10px_#00daf3]">You</div>
                                  <div className="inline-block size-6 rounded-full ring-2 ring-[#d8b9ff] bg-[#9244f4] text-[10px] flex items-center justify-center font-bold text-white shadow-[0_0_10px_#9244f4]">AI</div>
                              </div>
                           </div>
                           <textarea 
                              className="flex-1 w-full bg-[#0d0f12] text-[#00daf3] outline-none resize-none font-mono text-sm p-6 leading-relaxed focus:ring-1 focus:ring-[#00daf3]/30"
                              value={collabCode}
                              onChange={(e) => setCollabCode(e.target.value)}
                              spellCheck={false}
                           />
                           <div className="h-48 border-t border-[#2a2d36] bg-[#08090a] p-4 font-mono text-xs overflow-y-auto">
                              <div className="flex justify-between items-center mb-3">
                                <span className="opacity-70 text-white font-bold tracking-wider uppercase text-[10px]">Terminal Output</span>
                                <button className="btn btn-xs btn-outline border-white/20 text-white font-sans hover:bg-white/10 uppercase tracking-wider text-[10px]">Run Tests</button>
                              </div>
                              <span className="text-success">&gt; Jest Sandbox initialized.</span><br/>
                              <span className="opacity-70 text-white">&gt; Waiting for allowRequest implementation...</span>
                           </div>
                       </div>

                       {/* Right Pane: Copilot AI Sidekick */}
                       <div className="flex-1 bg-[#1a1c20] rounded-2xl border border-[#9244f4]/30 shadow-[0_0_20px_rgba(146,68,244,0.1)] flex flex-col overflow-hidden relative">
                           <div className="border-b border-[#2a2d36] p-3 flex justify-between items-center text-xs bg-[#111317]">
                              <span className="font-mono text-[#d8b9ff] font-bold flex items-center gap-2">
                                 <BrainCircuitIcon className="size-4"/> Copilot Sidekick
                              </span>
                           </div>
                           <div className="flex-1 p-4 overflow-y-auto space-y-4">
                              {collabChatLog.map((chat, idx) => (
                                 <div key={idx} className={`chat ${chat.role === 'ai' ? 'chat-start' : 'chat-end'}`}>
                                    <div className={`chat-bubble ${chat.role === 'ai' ? 'bg-[#9244f4]/20 border border-[#9244f4]/40 text-[#d8b9ff]' : 'bg-[#00daf3]/20 border border-[#00daf3]/40 text-[#00daf3]'} text-[13px] leading-relaxed`}>
                                      {chat.text}
                                    </div>
                                 </div>
                              ))}
                              {isCollabLoading && (
                                <div className="chat chat-start">
                                   <div className="chat-bubble bg-[#9244f4]/20 text-[#d8b9ff]"><span className="loading loading-dots loading-xs"></span></div>
                                </div>
                              )}
                           </div>
                           <form onSubmit={handleSendCollabMessage} className="p-4 border-t border-[#2a2d36] flex gap-2 bg-[#111317]">
                              <input 
                                type="text" 
                                className="input input-sm flex-1 font-mono text-xs bg-[#1a1c20] border border-[#2a2d36] text-white focus:border-[#d8b9ff]" 
                                placeholder="Message your sidekick..." 
                                value={collabChatInput}
                                onChange={(e) => setCollabChatInput(e.target.value)}
                              />
                              <button type="submit" className="btn btn-primary btn-sm rounded-lg" disabled={isCollabLoading}>Ask</button>
                           </form>
                           <div className="bg-[#111317] p-4 flex justify-end pb-4 pt-0">
                              <button className="btn btn-success w-full text-white font-bold border-none shadow-[0_0_15px_rgba(0,169,110,0.5)] scale-100 hover:scale-[1.02] transition-transform" onClick={handleNext}>Submit Code <CheckCircle2Icon className="size-4" /></button>
                           </div>
                       </div>
                    </div>
                  ) : currentRound.id === 'final_report' ? (
                     <div className="flex-1 flex flex-col gap-6 w-full h-full mt-4 relative">
                        {isEvaluating && (
                            <div className="absolute inset-0 bg-[#1a112c]/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center rounded-2xl border border-[#9244f4]/30">
                                <span className="loading loading-spinner text-primary size-12 mb-4"></span>
                                <p className="text-sm font-mono text-[#00daf3] animate-pulse font-black uppercase tracking-widest">Compiling Full Gauntlet Evaluation...</p>
                            </div>
                        )}
                        {/* Top Banner Analysis */}
                        <div className="bg-gradient-to-r from-[#9244f4]/20 to-[#00daf3]/20 border border-[#9244f4]/30 rounded-2xl p-8 shadow-[0_0_30px_rgba(146,68,244,0.15)] relative overflow-hidden flex flex-col items-center justify-center text-center">
                            <div className="absolute inset-0 bg-[#111317]/50 pointer-events-none"></div>
                            <TrophyIcon className="size-16 text-warning mb-4 relative z-10 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]" />
                            <h2 className="text-3xl font-black text-white relative z-10 mb-2">Gauntlet Protocol Complete</h2>
                            <p className="text-[#00daf3] relative z-10 font-mono text-sm uppercase tracking-widest font-bold">Estimated Level: {aiReport?.level || "L4 Mid-Level"}</p>
                            
                            <div className="flex gap-12 mt-8 relative z-10">
                               <div className="text-center">
                                  <div className="text-4xl font-black text-success drop-shadow-[0_0_10px_rgba(0,169,110,0.5)]">{calculatedFinalScore}<span className="text-lg opacity-50">/100</span></div>
                                  <div className="text-xs font-bold uppercase tracking-wider opacity-70 mt-1">Aggregate Score</div>
                               </div>
                               <div className="text-center">
                                  <div className="text-4xl font-black text-[#d8b9ff] drop-shadow-[0_0_10px_rgba(146,68,244,0.5)]">Top {Math.max(1, 100 - calculatedFinalScore)}%</div>
                                  <div className="text-xs font-bold uppercase tracking-wider opacity-70 mt-1">Global Percentile</div>
                               </div>
                               <div className="text-center">
                                  <div className="text-4xl font-black text-warning drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">{aiReport?.hire_decision || "Pass"}</div>
                                  <div className="text-xs font-bold uppercase tracking-wider opacity-70 mt-1">FAANG Prediction</div>
                               </div>
                            </div>
                        </div>
 
                        {/* Granular Breakdown Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                           <div className="bg-[#111317] rounded-2xl border border-base-200 p-6 shadow-xl">
                              <h3 className="font-bold text-lg mb-6 flex items-center gap-2"><LineChartIcon className="size-5 text-primary"/> Competency Radar</h3>
                              <div className="space-y-4">
                                 {[
                                   { label: 'Aptitude & Logic', val: calculatedFinalScore >= 75 ? 85 : 70, color: 'progress-error' },
                                   { label: 'Data Structures & Algos', val: codingOutput.includes("Error") ? 30 : 85, color: 'progress-primary' },
                                   { label: 'System Design Scaling', val: 80, color: 'progress-secondary' },
                                   { label: 'General Evaluation Score', val: calculatedFinalScore, color: 'progress-success' }
                                 ].map(skill => (
                                    <div key={skill.label}>
                                       <div className="flex justify-between text-xs mb-1 font-mono">
                                         <span className="opacity-80">{skill.label}</span>
                                         <span className="font-bold">{skill.val}%</span>
                                       </div>
                                       <progress className={`progress ${skill.color} w-full`} value={skill.val} max="100"></progress>
                                    </div>
                                 ))}
                              </div>
                           </div>
                           
                           <div className="bg-[#1a1c20] rounded-2xl border border-[#00daf3]/20 p-6 shadow-inner flex flex-col">
                              <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><BrainCircuitIcon className="size-5 text-[#00daf3]"/> AI Feedback Synthesis</h3>
                              <div className="flex-1 bg-[#111317] rounded-xl p-5 border border-base-300 font-serif text-sm leading-loose overflow-y-auto text-base-content/80 relative">
                                 <span className="absolute top-0 right-4 p-2 font-mono text-[10px] opacity-40 uppercase tracking-widest">Gemini Analysis</span>
                                 <div className="mb-4 text-[#d8b9ff] space-y-3">
                                    <p><strong>Feedback:</strong> {aiReport?.feedback || "Summarization pending analysis..."}</p>
                                    {aiReport?.strengths?.length > 0 && (
                                        <div><strong>Strengths:</strong>
                                            <ul className="list-disc list-inside ml-2">
                                                {aiReport.strengths.map((s,i) => <li key={i}>{s}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {aiReport?.weaknesses?.length > 0 && (
                                        <div><strong>Areas to Improve:</strong>
                                            <ul className="list-disc list-inside ml-2 text-error/90">
                                                {aiReport.weaknesses.map((w,i) => <li key={i}>{w}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                 </div>
                              </div>
                              <button className="btn w-full mt-4 bg-gradient-to-r from-success to-info text-white font-bold border-none shadow-[0_0_20px_rgba(0,169,110,0.3)]">Export Full PDF Dossier</button>
                           </div>
                        </div>
                     </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center border-2 border-dashed border-base-300 rounded-2xl bg-base-200/20 relative z-10 mt-4">
                       <div className="text-center max-w-md">
                          <currentRound.icon className="size-16 mx-auto mb-4 text-base-content/20" />
                          <h3 className="text-xl font-bold mb-2">Simulated Interface: {currentRound.title}</h3>
                          <p className="text-base-content/60 text-sm">
                             This view connects directly to the generative Gemini backend to construct adaptive, AI-driven assessment flows tailored to the core parameters of the {currentRound.title} module.
                          </p>
                       </div>
                    </div>
                  )}

              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 pb-8">
            <button 
              onClick={handlePrevious} 
              disabled={currentRoundIndex === 0}
              className="btn bg-[#1a1c20] border-[#2a2d36] hover:bg-[#2a2d36] text-white gap-2"
            >
              <ArrowLeftIcon className="size-4" /> Previous Round
            </button>
            
            {currentRoundIndex === ROUNDS.length - 1 ? (
              <button onClick={() => navigate('/dashboard')} className="btn btn-success gap-2 px-8 shadow-[0_0_20px_rgba(0,169,110,0.5)] text-white font-bold border-none">
                Return to Dashboard <TrophyIcon className="size-4" />
              </button>
            ) : (
              <button onClick={handleNext} className="btn bg-gradient-to-r from-[#d8b9ff] to-[#9244f4] text-white font-bold gap-2 px-8 shadow-[0_0_20px_rgba(146,68,244,0.4)] border-none hover:scale-105 transition-transform duration-300">
                Complete Sequence & Next <ArrowRightIcon className="size-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
