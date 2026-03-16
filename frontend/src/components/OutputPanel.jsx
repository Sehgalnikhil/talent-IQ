import { useState } from "react";
import { SparklesIcon, TerminalIcon, FileCodeIcon, Loader2Icon, BugIcon, CheckCircleIcon, XCircleIcon, EyeOffIcon, StarIcon, ZapIcon, AlertCircleIcon, LightbulbIcon } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function OutputPanel({ output, expectedOutput, problem, code, language }) {
  const [activeTab, setActiveTab] = useState("output");
  const [testcase, setTestcase] = useState("");
  const [isReviewing, setIsReviewing] = useState(false);
  const [review, setReview] = useState(null);

  const handleCodeReview = async () => {
    if (!code) return toast.error("Write some code first!");
    setIsReviewing(true);
    setReview(null);
    try {
      const res = await axiosInstance.post("/interview/code-review", {
        code,
        language: language || "javascript",
        problemTitle: problem?.title || "Coding Problem"
      });
      setReview(res.data);
    } catch (e) {
      toast.error("Code review failed. Try again.");
    } finally {
      setIsReviewing(false);
    }
  };

  // Save flashcard from review
  const saveFlashcard = (q, a) => {
    const cards = JSON.parse(localStorage.getItem("flashcards") || "[]");
    cards.push({ id: Date.now(), question: q, answer: a, problem: problem?.title, date: new Date().toISOString(), reviewed: 0 });
    localStorage.setItem("flashcards", JSON.stringify(cards));
    toast.success("Flashcard saved! 📝");
  };

  // Feature #6: Parse test case results for visual diff
  const getTestCaseResults = () => {
    if (!output || !output.success || !expectedOutput) return null;

    const actualLines = (output.output || "").trim().split("\n").filter(l => l.trim());
    const expectedLines = expectedOutput.trim().split("\n").filter(l => l.trim());
    const totalCases = Math.max(actualLines.length, expectedLines.length) || 1;

    const results = [];
    for (let i = 0; i < totalCases; i++) {
      const actual = (actualLines[i] || "").trim().replace(/\s*,\s*/g, ",").replace(/\[\s+/g, "[").replace(/\s+\]/g, "]");
      const expected = (expectedLines[i] || "").trim().replace(/\s*,\s*/g, ",").replace(/\[\s+/g, "[").replace(/\s+\]/g, "]");
      results.push({
        idx: i + 1,
        passed: actual === expected,
        actual: actualLines[i] || "(no output)",
        expected: expectedLines[i] || "(no expected)",
        hidden: i >= 2 && !output.testsPassed // hide 3rd+ test cases on failure
      });
    }
    return results;
  };

  const testResults = getTestCaseResults();
  const passedCount = testResults ? testResults.filter(t => t.passed).length : 0;
  const totalCount = testResults ? testResults.length : 0;

  return (
    <div className="h-full bg-base-100 flex flex-col">
      {/* TABS */}
      <div className="flex items-center gap-1 bg-base-200 border-b border-base-300 p-1">
        <button
          onClick={() => setActiveTab("output")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === "output" ? "bg-base-100 text-base-content border-t-2 border-primary" : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"}`}
        >
          <TerminalIcon className="size-4" /> Output
          {testResults && (
            <span className={`badge badge-sm ${output.testsPassed ? 'badge-success' : 'badge-error'}`}>
              {passedCount}/{totalCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab("testcases")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === "testcases" ? "bg-base-100 text-base-content border-t-2 border-primary" : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"}`}
        >
          <FileCodeIcon className="size-4" /> Testcases
        </button>
        <button
          onClick={() => setActiveTab("review")}
          className={`px-4 py-2 text-sm font-semibold rounded-t-lg flex items-center gap-2 transition-colors ${activeTab === "review" ? "bg-base-100 text-primary border-t-2 border-primary" : "text-base-content/60 hover:text-primary hover:bg-base-100/50"}`}
        >
          <SparklesIcon className="size-4 text-primary" /> AI Review
          {review && <span className="badge badge-primary badge-xs">{review.rating}/10</span>}
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
                {/* Feature #6: Visual progress bar */}
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-sm font-bold uppercase ${output.testsPassed ? 'text-success' : 'text-error'}`}>
                    {output.testsPassed ? '✅ All Tests Passed' : '❌ Tests Failed'}
                  </span>
                  {output.timeTaken && (
                    <span className="text-xs font-mono text-base-content/60">Execution Time: {output.timeTaken}ms</span>
                  )}
                </div>

                {/* Progress Bar */}
                {testResults && (
                  <div className="w-full h-2.5 bg-base-200 rounded-full overflow-hidden mb-3">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${output.testsPassed ? 'bg-success' : 'bg-error'}`}
                      style={{ width: `${(passedCount / totalCount) * 100}%` }}
                    />
                  </div>
                )}

                {/* Feature #6: Individual test case diff cards */}
                {testResults && testResults.length > 0 && (
                  <div className="space-y-2">
                    {testResults.map((tc) => (
                      <div key={tc.idx} className={`rounded-xl border p-3 ${tc.hidden ? 'bg-base-200/50 border-base-300' : tc.passed ? 'bg-success/5 border-success/20' : 'bg-error/5 border-error/20'}`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold flex items-center gap-1.5">
                            {tc.hidden ? (
                              <><EyeOffIcon className="size-3.5 text-base-content/40" /> Test Case {tc.idx} <span className="badge badge-ghost badge-xs">Hidden</span></>
                            ) : tc.passed ? (
                              <><CheckCircleIcon className="size-3.5 text-success" /> Test Case {tc.idx}</>
                            ) : (
                              <><XCircleIcon className="size-3.5 text-error" /> Test Case {tc.idx}</>
                            )}
                          </span>
                        </div>
                        {!tc.hidden && (
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-success/70 mb-0.5 block">Expected</span>
                              <pre className="text-xs font-mono p-2 rounded-lg bg-success/10 text-success border border-success/20 whitespace-pre-wrap">{tc.expected}</pre>
                            </div>
                            <div>
                              <span className="text-[10px] uppercase font-bold text-base-content/50 mb-0.5 block">Your Output</span>
                              <pre className={`text-xs font-mono p-2 rounded-lg whitespace-pre-wrap ${tc.passed ? 'bg-success/10 text-success border border-success/20' : 'bg-error/10 text-error border border-error/20'}`}>{tc.actual}</pre>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
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

        {activeTab === "review" && (
          <div className="flex flex-col h-full">
            {!review ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-4">
                <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <SparklesIcon className="size-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">AI Code Review</h3>
                  <p className="text-sm text-base-content/60 max-w-xs">Get instant Gemini-powered feedback on your code quality, complexity, and optimization tips.</p>
                </div>
                <button onClick={handleCodeReview} disabled={isReviewing} className="btn btn-primary gap-2">
                  {isReviewing ? <><Loader2Icon className="size-4 animate-spin" /> Reviewing...</> : <><SparklesIcon className="size-4" /> Review My Code</>}
                </button>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto">
                {/* Rating */}
                <div className="flex items-center justify-between p-4 bg-base-200 rounded-2xl">
                  <div>
                    <div className="text-2xl font-black">{review.rating}<span className="text-sm text-base-content/40">/10</span></div>
                    <div className="flex mt-1">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <StarIcon key={i} className={`size-3 ${i < review.rating ? 'text-warning fill-warning' : 'text-base-content/20'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="badge badge-outline gap-1"><ZapIcon className="size-3" /> {review.timeComplexity}</div>
                    <div className="badge badge-outline gap-1 ml-1">Space {review.spaceComplexity}</div>
                  </div>
                </div>
                {/* Summary */}
                <div className="p-3 bg-primary/5 rounded-xl border border-primary/20">
                  <p className="text-sm">{review.summary}</p>
                </div>
                {/* Issues */}
                {review.issues?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-error mb-2 flex items-center gap-1"><AlertCircleIcon className="size-3" /> Issues</h4>
                    <ul className="space-y-1">
                      {review.issues.map((issue, i) => (
                        <li key={i} className="text-sm flex items-start gap-2 text-error/80">
                          <span className="mt-0.5 shrink-0">•</span>{issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Suggestions */}
                {review.suggestions?.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold uppercase text-success mb-2 flex items-center gap-1"><LightbulbIcon className="size-3" /> Suggestions</h4>
                    <ul className="space-y-1">
                      {review.suggestions.map((s, i) => (
                        <li key={i} className="text-sm flex items-start gap-2 text-success/80">
                          <span className="mt-0.5 shrink-0">✓</span>
                          <span>{s}</span>
                          <button onClick={() => saveFlashcard(`Optimization: ${problem?.title}`, s)} className="btn btn-ghost btn-xs ml-auto shrink-0">💾</button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* Better approach */}
                {review.betterApproach && (
                  <div className="p-3 bg-warning/5 rounded-xl border border-warning/20">
                    <h4 className="text-xs font-bold uppercase text-warning mb-1">⚡ Better Approach</h4>
                    <p className="text-sm">{review.betterApproach}</p>
                  </div>
                )}
                <button onClick={() => { setReview(null); handleCodeReview(); }} className="btn btn-ghost btn-sm w-full">Re-review</button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default OutputPanel;
