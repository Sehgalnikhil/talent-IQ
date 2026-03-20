import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import axiosInstance from "../lib/axios";
import { AdaptiveDifficulty, StuckDetector } from "../lib/ml-engine";
import { ProblemMLInsights } from "../components/MLWidgets";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import { ClockIcon, TrophyIcon, MessageSquareIcon, SendIcon, Loader2Icon, XIcon, SparklesIcon, ShieldAlertIcon, ArrowRightIcon } from "lucide-react";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const isMock = searchParams.get("strictMode") === "true";
  const mockCompany = searchParams.get("company");
  const mockListStr = searchParams.get("mockList");
  const mockList = mockListStr ? mockListStr.split(",") : [];

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [submissions, setSubmissions] = useState([]);

  // Feature #7: Personal Best Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const [personalBest, setPersonalBest] = useState(null);
  const timerRef = useRef(null);

  // Feature #8: AI Chat Sidebar
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("pastSubmissions") || "[]");
    setSubmissions(saved);
  }, []);

  const currentProblem = PROBLEMS[currentProblemId];

  // Feature #7: Load personal best on problem change
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
      // Reset timer
      setTimerSeconds(0);
      setTimerRunning(true);
      // Load PB
      const pbs = JSON.parse(localStorage.getItem("personalBests") || "{}");
      setPersonalBest(pbs[id] || null);
      // Reset chat & StuckDetector
      setChatMessages([]);
      StuckDetector.reset();
    }
  }, [id, selectedLanguage]);

  // Feature #7: Timer tick
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.2, y: 0.6 } });
    confetti({ particleCount: 80, spread: 250, origin: { x: 0.8, y: 0.6 } });
  };

  const normalizeOutput = (output) => {
    if (!output) return "";
    return output.toString().trim().split("\n")
      .map((line) => line.trim().replace(/\[\s+/g, "[").replace(/\s+\]/g, "]").replace(/\s*,\s*/g, ","))
      .filter((line) => line.length > 0).join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    return normalizeOutput(actualOutput) === normalizeOutput(expectedOutput);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const startTime = performance.now();
    const result = await executeCode(selectedLanguage, code);
    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);

    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);
      setOutput({ ...result, timeTaken, testsPassed });

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");
        setTimerRunning(false); // Stop timer

        // Feature #7: Save personal best
        const pbs = JSON.parse(localStorage.getItem("personalBests") || "{}");
        if (!pbs[currentProblemId] || timerSeconds < pbs[currentProblemId]) {
          pbs[currentProblemId] = timerSeconds;
          localStorage.setItem("personalBests", JSON.stringify(pbs));
          setPersonalBest(timerSeconds);
          if (pbs[currentProblemId]) { // was existing PB
            toast.success(`New Personal Best! ${formatTime(timerSeconds)} 🎉`);
          }
        }

        const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        if (!solved.includes(currentProblemId)) {
          localStorage.setItem("solvedProblems", JSON.stringify([...solved, currentProblemId]));
        }
        
        // ML: Record adaptive difficulty success
        AdaptiveDifficulty.recordAttempt(currentProblemId, currentProblem.difficulty, true, timerSeconds);
      } else {
        toast.error("Tests failed. Check your output!");
      }

      // Save submission
      const newSubmission = {
        problemId: currentProblemId,
        status: testsPassed ? "Accepted" : "Wrong Answer",
        language: selectedLanguage,
        timeTaken: timeTaken + " ms",
        code: code,
        timestamp: Date.now()
      };
      const updatedSubmissions = [...submissions, newSubmission];
      setSubmissions(updatedSubmissions);
      localStorage.setItem("pastSubmissions", JSON.stringify(updatedSubmissions));

    } else {
      setOutput({ ...result, timeTaken });
      toast.error("Code execution failed!");

      const newSubmission = {
        problemId: currentProblemId,
        status: "Runtime Error",
        language: selectedLanguage,
        timeTaken: "N/A",
        code: code,
        timestamp: Date.now()
      };
      const updatedSubmissions = [...submissions, newSubmission];
      setSubmissions(updatedSubmissions);
      localStorage.setItem("pastSubmissions", JSON.stringify(updatedSubmissions));
      
      // ML: Record adaptive difficulty failure
      AdaptiveDifficulty.recordAttempt(currentProblemId, currentProblem.difficulty, false, timerSeconds);
    }
    setIsRunning(false);
  };

  const handleNextMockProblem = () => {
    const currentIndex = mockList.indexOf(currentProblemId);
    if (currentIndex < mockList.length - 1) {
      const nextProb = mockList[currentIndex + 1];
      toast.success(`Moving to next problem: ${nextProb}`);
      navigate(`/problem/${nextProb}?strictMode=true&company=${mockCompany}&mockList=${mockListStr}`);
    } else {
      toast.success("Assessment Complete! You nailed it. 🎉", { duration: 5000 });
      navigate("/dashboard");
    }
  };

  const handleGetAIHint = async () => {
    setIsAskingAI(true);
    try {
      const res = await axiosInstance.post("/interview/debug", { code });
      const hint = res.data.feedback || "The AI couldn't generate a hint right now.";
      setOutput({ success: true, output: "🤖 AI Debugger:\n========================\n" + hint, testsPassed: false });
      toast.success("AI generated a hint for you!");
    } catch (error) {
      console.error(error);
      toast.error("Could not fetch AI hint.");
    } finally {
      setIsAskingAI(false);
    }
  };

  const handleRefactorCode = async () => {
    setIsRefactoring(true);
    try {
      const res = await axiosInstance.post("/interview/refactor", { code });
      const refactored = res.data.refactored;
      if (refactored) {
        setCode(refactored);
        toast.success("Code refactored successfully! 🧹", { icon: "🧹" });
      }
    } catch (error) {
      console.error(error);
      toast.error("Could not refactor code.");
    } finally {
      setIsRefactoring(false);
    }
  };

  const handleEvaluateCode = async () => {
    setIsEvaluating(true);
    try {
      const res = await axiosInstance.post("/interview/evaluate", { code, problemContext: currentProblem.description });
      const evalData = res.data;
      const evalText = `📊 AI Evaluation Score: ${evalData.score}/100\n========================\n\n🟢 Strengths:\n${evalData.strengths.map(s => "- " + s).join("\n")}\n\n🔴 Weaknesses:\n${evalData.weaknesses.map(w => "- " + w).join("\n")}\n\n📝 Feedback:\n${evalData.feedback}`;
      setOutput({ success: true, output: evalText, testsPassed: true });
      toast.success("Solution Evaluated! 📊", { icon: "📊" });
    } catch (error) {
      console.error(error);
      toast.error("Could not evaluate code.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Feature #8: AI Chat handler
  const handleChatSend = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", text: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatLoading(true);

    try {
      const res = await axiosInstance.post("/interview/coach", {
        code,
        problemContext: `Problem: ${currentProblem.title}. ${currentProblem.description?.text || ""}. User question: ${chatInput}`
      });
      const aiMsg = { role: "ai", text: res.data.hint || "I couldn't generate a response right now." };
      setChatMessages(prev => [...prev, aiMsg]);
    } catch {
      setChatMessages(prev => [...prev, { role: "ai", text: "Sorry, I couldn't connect to the AI. Please try again." }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      {/* Feature #7: Timer Bar */}
      <div className="bg-base-200 border-b border-base-300 px-4 py-1.5 flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 font-mono font-bold">
            <ClockIcon className="size-4 text-primary" />
            <span className={timerRunning ? "text-primary animate-pulse" : "text-success"}>{formatTime(timerSeconds)}</span>
          </div>
          {personalBest !== null && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-warning">
              <TrophyIcon className="size-3.5" />
              PB: {formatTime(personalBest)}
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isMock ? (
             <div className="badge badge-error gap-1 mr-2 px-3 py-3 font-bold">
               <ShieldAlertIcon className="size-4" /> Strict Mode Active
             </div>
          ) : (
            <button onClick={() => setShowChat(!showChat)} className={`btn btn-xs gap-1 ${showChat ? "btn-primary" : "btn-ghost"}`}>
              <MessageSquareIcon className="size-3.5" /> AI Assistant
            </button>
          )}

          {isMock && output?.testsPassed && (
            <button onClick={handleNextMockProblem} className="btn btn-sm btn-success gap-2 ml-2 shadow-success/30 shadow-lg animate-pulse">
              Next Problem <ArrowRightIcon className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Code Area */}
        <div className="flex-1">
          <PanelGroup direction="horizontal">
            <Panel defaultSize={40} minSize={30}>
              <ProblemDescription
                problem={currentProblem}
                currentProblemId={currentProblemId}
                onProblemChange={handleProblemChange}
                allProblems={Object.values(PROBLEMS)}
                submissions={submissions}
                onCodeLoad={(oldCode, oldLang) => {
                  setSelectedLanguage(oldLang);
                  setCode(oldCode);
                  toast.success("Loaded past submission code!");
                }}
              />
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            <Panel defaultSize={60} minSize={30}>
              <PanelGroup direction="vertical">
                <Panel defaultSize={65} minSize={30}>
                  <CodeEditorPanel
                    selectedLanguage={selectedLanguage}
                    code={code}
                    isRunning={isRunning}
                    isAskingAI={isAskingAI}
                    isRefactoring={isRefactoring}
                    isEvaluating={isEvaluating}
                    onLanguageChange={handleLanguageChange}
                    onCodeChange={(newCode) => {
                      if (newCode.length < code.length) StuckDetector.recordKeystroke("delete");
                      else StuckDetector.recordKeystroke("type");
                      
                      const analysis = StuckDetector.analyze();
                      if (analysis.isStuck && !showChat) {
                        toast("You seem stuck. Opening AI Assistant to help! 🤖", { icon: "🧠" });
                        setShowChat(true);
                        setChatMessages([{ role: "ai", text: `I noticed you might be stuck (${analysis.reason}). Need a hint? Let me know where you're confused!` }]);
                        StuckDetector.reset(); // prevent spam
                      }
                      
                      setCode(newCode);
                    }}
                    onRunCode={handleRunCode}
                    onGetAIHint={handleGetAIHint}
                    onRefactorCode={handleRefactorCode}
                    onEvaluateCode={handleEvaluateCode}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                  />
                </Panel>

                <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

                <Panel defaultSize={35} minSize={30}>
                  <OutputPanel output={output} expectedOutput={currentProblem.expectedOutput[selectedLanguage]} problem={currentProblem} />
                </Panel>
              </PanelGroup>
            </Panel>

            <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

            {/* ML Insights Panel */}
            <Panel defaultSize={20} minSize={15} maxSize={30}>
              <div className="h-full bg-base-100 border-l border-base-300 overflow-y-auto w-full max-w-sm">
                <div className="p-3 border-b border-base-300 font-bold text-sm bg-base-200">
                  <SparklesIcon className="size-4 inline-block mr-1.5 text-primary" />
                  AI Execution Intelligence
                </div>
                <ProblemMLInsights
                  problemId={currentProblemId}
                  code={code}
                  language={selectedLanguage}
                />
              </div>
            </Panel>
          </PanelGroup>
        </div>

        {/* Feature #8: AI Chat Sidebar */}
        {showChat && (
          <div className="w-80 border-l border-base-300 bg-base-200/50 flex flex-col">
            <div className="p-3 border-b border-base-300 flex items-center justify-between bg-base-100">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
                  <SparklesIcon className="size-4 text-primary-content" />
                </div>
                <div>
                  <h4 className="text-sm font-bold">AI Rubber Duck</h4>
                  <p className="text-[10px] text-base-content/50">Ask anything about your code</p>
                </div>
              </div>
              <button onClick={() => setShowChat(false)} className="btn btn-ghost btn-xs btn-circle">
                <XIcon className="size-3" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8">
                  <SparklesIcon className="size-8 mx-auto text-primary/30 mb-2" />
                  <p className="text-xs text-base-content/40">Ask me questions about your code!</p>
                  <div className="mt-3 space-y-1.5">
                    {["Why is my code failing?", "Is there a better approach?", "What's the time complexity?"].map((q) => (
                      <button key={q} onClick={() => { setChatInput(q); }} className="block w-full text-left text-xs px-3 py-2 rounded-lg bg-base-100 border border-base-300 hover:border-primary/30 transition-colors">
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${msg.role === "user"
                      ? "bg-primary text-primary-content rounded-br-md"
                      : "bg-base-100 border border-base-300 rounded-bl-md"
                    }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2 rounded-2xl bg-base-100 border border-base-300 rounded-bl-md">
                    <Loader2Icon className="size-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="p-3 border-t border-base-300 flex gap-2">
              <input
                type="text"
                className="input input-bordered input-sm flex-1 text-sm"
                placeholder="Ask a question..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleChatSend()}
              />
              <button onClick={handleChatSend} disabled={isChatLoading} className="btn btn-primary btn-sm btn-square">
                <SendIcon className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProblemPage;
