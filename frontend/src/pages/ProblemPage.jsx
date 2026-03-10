import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { PROBLEMS } from "../data/problems";
import Navbar from "../components/Navbar";

import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import ProblemDescription from "../components/ProblemDescription";
import OutputPanel from "../components/OutputPanel";
import CodeEditorPanel from "../components/CodeEditorPanel";
import { executeCode } from "../lib/piston";
import axiosInstance from "../lib/axios";

import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function ProblemPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [currentProblemId, setCurrentProblemId] = useState("two-sum");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState(PROBLEMS[currentProblemId].starterCode.javascript);
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [isRefactoring, setIsRefactoring] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  const currentProblem = PROBLEMS[currentProblemId];

  // update problem when URL param changes
  useEffect(() => {
    if (id && PROBLEMS[id]) {
      setCurrentProblemId(id);
      setCode(PROBLEMS[id].starterCode[selectedLanguage]);
      setOutput(null);
    }
  }, [id, selectedLanguage]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setCode(currentProblem.starterCode[newLang]);
    setOutput(null);
  };

  const handleProblemChange = (newProblemId) => navigate(`/problem/${newProblemId}`);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.2, y: 0.6 },
    });

    confetti({
      particleCount: 80,
      spread: 250,
      origin: { x: 0.8, y: 0.6 },
    });
  };

  const normalizeOutput = (output) => {
    // normalize output for comparison (trim whitespace, handle different spacing)
    if (!output) return "";
    return output
      .toString()
      .trim()
      .split("\n")
      .map((line) =>
        line
          .trim()
          // remove spaces after [ and before ]
          .replace(/\[\s+/g, "[")
          .replace(/\s+\]/g, "]")
          // normalize spaces around commas to single space after comma
          .replace(/\s*,\s*/g, ",")
      )
      .filter((line) => line.length > 0)
      .join("\n");
  };

  const checkIfTestsPassed = (actualOutput, expectedOutput) => {
    const normalizedActual = normalizeOutput(actualOutput);
    const normalizedExpected = normalizeOutput(expectedOutput);

    return normalizedActual === normalizedExpected;
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const startTime = performance.now();
    const result = await executeCode(selectedLanguage, code);
    const endTime = performance.now();
    const timeTaken = (endTime - startTime).toFixed(2);

    // check if code executed successfully and matches expected output
    if (result.success) {
      const expectedOutput = currentProblem.expectedOutput[selectedLanguage];
      const testsPassed = checkIfTestsPassed(result.output, expectedOutput);

      setOutput({ ...result, timeTaken, testsPassed });

      if (testsPassed) {
        triggerConfetti();
        toast.success("All tests passed! Great job!");

        // Save to local storage
        const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
        if (!solved.includes(currentProblemId)) {
          localStorage.setItem("solvedProblems", JSON.stringify([...solved, currentProblemId]));
        }
      } else {
        toast.error("Tests failed. Check your output!");
      }
    } else {
      setOutput({ ...result, timeTaken });
      toast.error("Code execution failed!");
    }
    setIsRunning(false);
  };

  const handleGetAIHint = async () => {
    setIsAskingAI(true);
    try {
      // The backend /interview/debug route analyzes code and returns `{ feedback }`
      const res = await axiosInstance.post("/interview/debug", { code });
      const hint = res.data.feedback || "The AI couldn't generate a hint right now.";

      // we can display this hint inside the OutputPanel by setting output!
      setOutput({
        success: true,
        output: "🤖 AI Debugger:\n========================\n" + hint,
        testsPassed: false
      });
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
      const res = await axiosInstance.post("/interview/evaluate", {
        code,
        problemContext: currentProblem.description
      });
      const evalData = res.data;

      const evalText = `📊 AI Evaluation Score: ${evalData.score}/100\n========================\n\n🟢 Strengths:\n${evalData.strengths.map(s => "- " + s).join("\n")}\n\n🔴 Weaknesses:\n${evalData.weaknesses.map(w => "- " + w).join("\n")}\n\n📝 Feedback:\n${evalData.feedback}`;

      setOutput({
        success: true,
        output: evalText,
        testsPassed: true // Setting true just to style it green/safe
      });
      toast.success("Solution Evaluated! 📊", { icon: "📊" });
    } catch (error) {
      console.error(error);
      toast.error("Could not evaluate code.");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="h-screen bg-base-100 flex flex-col">
      <Navbar />

      <div className="flex-1">
        <PanelGroup direction="horizontal">
          {/* left panel- problem desc */}
          <Panel defaultSize={40} minSize={30}>
            <ProblemDescription
              problem={currentProblem}
              currentProblemId={currentProblemId}
              onProblemChange={handleProblemChange}
              allProblems={Object.values(PROBLEMS)}
            />
          </Panel>

          <PanelResizeHandle className="w-2 bg-base-300 hover:bg-primary transition-colors cursor-col-resize" />

          {/* right panel- code editor & output */}
          <Panel defaultSize={60} minSize={30}>
            <PanelGroup direction="vertical">
              {/* Top panel - Code editor */}
              <Panel defaultSize={65} minSize={30}>
                <CodeEditorPanel
                  selectedLanguage={selectedLanguage}
                  code={code}
                  isRunning={isRunning}
                  isAskingAI={isAskingAI}
                  isRefactoring={isRefactoring}
                  isEvaluating={isEvaluating}
                  onLanguageChange={handleLanguageChange}
                  onCodeChange={setCode}
                  onRunCode={handleRunCode}
                  onGetAIHint={handleGetAIHint}
                  onRefactorCode={handleRefactorCode}
                  onEvaluateCode={handleEvaluateCode}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                />
              </Panel>

              <PanelResizeHandle className="h-2 bg-base-300 hover:bg-primary transition-colors cursor-row-resize" />

              {/* Bottom panel - Output Panel*/}

              <Panel defaultSize={35} minSize={30}>
                <OutputPanel output={output} expectedOutput={currentProblem.expectedOutput[selectedLanguage]} />
              </Panel>
            </PanelGroup>
          </Panel>
        </PanelGroup>
      </div>
    </div>
  );
}

export default ProblemPage;
