import { useState } from "react";
import { SparklesIcon, TerminalIcon, FileCodeIcon, Loader2Icon, BugIcon } from "lucide-react";

function OutputPanel({ output, expectedOutput }) {
  const [activeTab, setActiveTab] = useState("output");
  const [testcase, setTestcase] = useState("");
  const [isAskingAI, setIsAskingAI] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);

  const simulateAI = () => {
    setIsAskingAI(true);
    setAiResponse(null);
    setTimeout(() => {
      setIsAskingAI(false);
      setAiResponse(
        "I noticed your logic might be missing a crucial edge case. Have you checked what happens when the input array is empty or contains negative numbers? Also, ensure your loop conditions are strictly less than the length. Keep going, you're close! 🚀"
      );
    }, 2000);
  };

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* TABS */}
      <div className="flex items-center gap-1 bg-base-200 border-b border-base-300 p-1">
        <button
          onClick={() => setActiveTab("output")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === "output" ? "bg-base-100 text-base-content border-t-2 border-primary" : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
            }`}
        >
          <TerminalIcon className="size-4" /> Output
        </button>
        <button
          onClick={() => setActiveTab("testcases")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === "testcases" ? "bg-base-100 text-base-content border-t-2 border-primary" : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
            }`}
        >
          <FileCodeIcon className="size-4" /> Testcases
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === "ai" ? "bg-base-100 text-primary border-t-2 border-primary" : "text-base-content/60 hover:text-primary hover:bg-base-100/50"
            }`}
        >
          <SparklesIcon className="size-4 text-primary" /> AI Coach
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
        {activeTab === "output" && (
          <>
            {output === null ? (
              <p className="text-base-content/50 text-sm">Click "Run Code" to see the output here...</p>
            ) : output.success ? (
              <>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-bold uppercase ${output.testsPassed ? 'text-success' : 'text-error'}`}>
                    {output.testsPassed ? '✅ All Tests Passed' : '❌ Tests Failed'}
                  </span>
                  {output.timeTaken && (
                    <span className="text-xs font-mono text-base-content/60">Execution Time: {output.timeTaken}ms</span>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase text-base-content/50 font-semibold mb-1">Your Output</p>
                  <pre className={`text-sm font-mono whitespace-pre-wrap p-3 rounded-lg ${output.testsPassed ? 'bg-success/10 text-success border border-success/30' : 'bg-error/10 text-error border border-error/30'}`}>
                    {output.output}
                  </pre>
                </div>

                {!output.testsPassed && expectedOutput && (
                  <div>
                    <p className="text-xs uppercase text-base-content/50 font-semibold mt-4 mb-1">Expected Output</p>
                    <pre className="text-sm font-mono whitespace-pre-wrap p-3 rounded-lg bg-base-200 text-base-content border border-base-300">
                      {expectedOutput}
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs uppercase text-error font-semibold mb-1 flex items-center gap-1">
                    <BugIcon className="size-4 text-error" /> {output.errorType || "Runtime Error"}
                  </p>
                  {output.timeTaken && (
                    <span className="text-xs font-mono text-base-content/60">Execution Time: {output.timeTaken}ms</span>
                  )}
                </div>
                {output.output && (
                  <pre className="text-sm font-mono text-base-content whitespace-pre-wrap mb-2 p-3 bg-base-200 rounded-lg">
                    {output.output}
                  </pre>
                )}
                <pre className="text-sm font-mono text-error whitespace-pre-wrap p-3 bg-error/10 border border-error/30 rounded-lg">
                  {output.error}
                </pre>
              </div>
            )}
          </>
        )}

        {activeTab === "testcases" && (
          <div className="h-full flex flex-col">
            <p className="text-xs uppercase text-base-content/50 font-semibold mb-2">Custom Input</p>
            <textarea
              className="textarea textarea-bordered w-full h-32 font-mono text-sm resize-none mb-4"
              placeholder='e.g. nums = [1,2,3], target = 5'
              value={testcase}
              onChange={(e) => setTestcase(e.target.value)}
            />
            <p className="text-xs text-base-content/50 mt-auto">Note: Custom constraints running locally on your browser.</p>
          </div>
        )}

        {activeTab === "ai" && (
          <div className="flex flex-col h-full bg-gradient-to-b from-primary/5 to-transparent rounded-xl border border-primary/20 p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30">
                <SparklesIcon className="size-6 text-primary-content" />
              </div>
              <div>
                <h3 className="font-bold text-lg">AI Coding Coach</h3>
                <p className="text-xs text-base-content/60">Powered by Talent IQ</p>
              </div>
            </div>

            <div className="flex-1 overflow-auto mb-4">
              {aiResponse ? (
                <div className="chat chat-start">
                  <div className="chat-bubble chat-bubble-primary bg-primary text-primary-content">
                    {aiResponse}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-base-content/60 mb-4 max-w-sm">Having trouble passing the tests? Ask the AI Coach to review your code and give you a subtle hint.</p>
                </div>
              )}
            </div>

            <button
              onClick={simulateAI}
              className="btn btn-primary w-full"
              disabled={isAskingAI}
            >
              {isAskingAI ? (
                <><Loader2Icon className="size-5 animate-spin" /> Thinking...</>
              ) : (
                <><SparklesIcon className="size-5" /> Debug My Code</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
