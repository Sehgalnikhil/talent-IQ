import { getDifficultyBadgeClass } from "../lib/utils";
import { useState } from "react";
import { LightbulbIcon, MessageSquareIcon, HistoryIcon, BookOpenIcon, CheckIcon, ThumbsUpIcon, SparklesIcon, Loader2Icon } from "lucide-react";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

function ProblemDescription({ problem, currentProblemId, onProblemChange, allProblems, submissions, onCodeLoad, isMock }) {
  const [showHints, setShowHints] = useState(false);
  const [activeTab, setActiveTab] = useState("description"); // description, solutions, submissions
  const [eli5, setEli5] = useState(null);
  const [loadingEli5, setLoadingEli5] = useState(false);
  const [showEli5, setShowEli5] = useState(false);

  const handleELI5 = async () => {
    if (eli5) { setShowEli5(s => !s); return; }
    setLoadingEli5(true);
    try {
      const res = await axiosInstance.post("/interview/eli5", {
        problemTitle: problem.title,
        problemDescription: problem.description?.text
      });
      setEli5(res.data);
      setShowEli5(true);
    } catch (e) {
      toast.error("ELI5 failed. Try again.");
    } finally {
      setLoadingEli5(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-base-200">
      {/* HEADER SECTION */}
      <div className="p-6 bg-base-100 border-b border-base-300">
        <div className="flex items-start justify-between mb-3">
          <h1 className="text-3xl font-bold text-base-content">{problem.title}</h1>
          <div className="flex items-center gap-2">
            {!isMock && (
              <button
                onClick={handleELI5}
                disabled={loadingEli5}
                className="btn btn-xs btn-outline btn-warning gap-1"
                title="Explain Like I'm 5"
              >
                {loadingEli5 ? <Loader2Icon className="size-3 animate-spin" /> : <SparklesIcon className="size-3" />}
                ELI5
              </button>
            )}
            <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>
              {problem.difficulty}
            </span>
          </div>
        </div>
        <p className="text-base-content/60">{problem.category}</p>

        {/* Problem selector */}
        {!isMock && (
          <div className="mt-4">
            <select
              className="select select-sm w-full"
              value={currentProblemId}
              onChange={(e) => {
                setShowHints(false);
                setActiveTab("description");
                onProblemChange(e.target.value);
              }}
            >
              {allProblems?.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} - {p.difficulty}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs tabs-bordered bg-base-100 px-4 pt-2 border-b border-base-300 flex-none">
        <button
          onClick={() => setActiveTab("description")}
          className={`tab tab-bordered ${activeTab === "description" ? "tab-active font-bold border-primary text-primary" : ""}`}
        >
          <BookOpenIcon className="size-4 mr-2" /> Description
        </button>
        <button
          onClick={() => setActiveTab("solutions")}
          className={`tab tab-bordered ${activeTab === "solutions" ? "tab-active font-bold border-primary text-primary" : ""}`}
        >
          <MessageSquareIcon className="size-4 mr-2" /> Solutions
        </button>
        <button
          onClick={() => setActiveTab("submissions")}
          className={`tab tab-bordered ${activeTab === "submissions" ? "tab-active font-bold border-primary text-primary" : ""}`}
        >
          <HistoryIcon className="size-4 mr-2" /> Submissions
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1 overflow-y-auto">
        {activeTab === "description" && (
          <>
            {/* Feature #3: ELI5 Card */}
            {showEli5 && eli5 && (
              <div className="bg-warning/10 border border-warning/30 rounded-2xl p-5 animate-fadeIn">
                <div className="flex items-center gap-2 mb-3">
                  <SparklesIcon className="size-5 text-warning" />
                  <h3 className="font-bold text-warning">Explain Like I'm 5 🧒</h3>
                  <button onClick={() => setShowEli5(false)} className="ml-auto btn btn-ghost btn-xs">✕</button>
                </div>
                <p className="text-base-content/80 leading-relaxed mb-3">{eli5.explanation}</p>
                {eli5.analogy && (
                  <div className="bg-warning/20 rounded-xl px-4 py-2 mb-2">
                    <span className="text-xs font-bold text-warning">🎯 Analogy: </span>
                    <span className="text-sm">{eli5.analogy}</span>
                  </div>
                )}
                {eli5.keyInsight && (
                  <div className="bg-success/10 rounded-xl px-4 py-2">
                    <span className="text-xs font-bold text-success">💡 Key Insight: </span>
                    <span className="text-sm">{eli5.keyInsight}</span>
                  </div>
                )}
              </div>
            )}
            {/* PROBLEM DESC */}
            <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
              <h2 className="text-xl font-bold text-base-content">Description</h2>

              <div className="space-y-3 text-base leading-relaxed">
                <p className="text-base-content/90">{typeof problem.description === 'string' ? problem.description : problem.description?.text}</p>
                {problem.description?.notes?.map((note, idx) => (
                  <p key={idx} className="text-base-content/90">
                    {note}
                  </p>
                ))}
              </div>
            </div>

            {/* EXAMPLES SECTION */}
            <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
              <h2 className="text-xl font-bold mb-4 text-base-content">Examples</h2>
              <div className="space-y-4">
                {problem.examples?.map((example, idx) => (
                  <div key={idx}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="badge badge-sm">{idx + 1}</span>
                      <p className="font-semibold text-base-content">Example {idx + 1}</p>
                    </div>
                    <div className="bg-base-200 rounded-lg p-4 font-mono text-sm space-y-1.5">
                      <div className="flex gap-2">
                        <span className="text-primary font-bold min-w-[70px]">Input:</span>
                        <span>{example.input}</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-secondary font-bold min-w-[70px]">Output:</span>
                        <span>{example.output}</span>
                      </div>
                      {example.explanation && (
                        <div className="pt-2 border-t border-base-300 mt-2">
                          <span className="text-base-content/60 font-sans text-xs">
                            <span className="font-semibold">Explanation:</span> {example.explanation}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CONSTRAINTS */}
            <div className="bg-base-100 rounded-xl shadow-sm p-5 border border-base-300">
              <h2 className="text-xl font-bold mb-4 text-base-content">Constraints</h2>
              <ul className="space-y-2 text-base-content/90">
                {problem.constraints?.map((constraint, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <code className="text-sm">{constraint}</code>
                  </li>
                ))}
              </ul>
            </div>

            {/* HINTS SECTION */}
            {problem.hints && problem.hints.length > 0 && (
              <div className="bg-base-100 rounded-xl shadow-sm border border-base-300 overflow-hidden">
                <button
                  className="w-full flex items-center gap-2 p-5 text-left transition-colors hover:bg-base-200"
                  onClick={() => setShowHints(!showHints)}
                >
                  <LightbulbIcon className={`size-5 ${showHints ? 'text-warning' : 'text-base-content/50'}`} />
                  <h2 className="text-xl font-bold text-base-content">
                    Hints ({problem.hints.length})
                  </h2>
                </button>

                {showHints && (
                  <div className="p-5 pt-0 mt-2 space-y-3">
                    <div className="border-t border-base-300 pb-2"></div>
                    {problem.hints?.map((hint, idx) => (
                      <div key={idx} className="p-3 bg-base-200 rounded-lg text-sm border-l-4 border-warning">
                        <span className="font-bold text-warning mr-2">Hint {idx + 1}:</span>
                        <span className="text-base-content/80">{hint}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {activeTab === "solutions" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Community Solutions</h2>
              <button className="btn btn-outline btn-sm gap-2">
                <MessageSquareIcon className="size-4" /> Share Solution
              </button>
            </div>

            {/* Mock Solution 1 */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-primary text-primary-content rounded-full w-8">
                        <span className="text-xs">AH</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Alice Hacker</p>
                      <p className="text-xs text-base-content/60">O(n) Time | O(n) Space • JavaScript</p>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm gap-1 text-base-content/60 hover:text-primary">
                    <ThumbsUpIcon className="size-4" /> 245
                  </button>
                </div>
                <h3 className="font-bold text-lg mb-2">Clean Hash Map Approach</h3>
                <pre className="bg-base-200 p-4 rounded-lg text-sm font-mono overflow-auto text-base-content/80">
                  {`function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
}`}
                </pre>
              </div>
            </div>

            {/* Mock Solution 2 */}
            <div className="card bg-base-100 border border-base-300 shadow-sm">
              <div className="card-body p-5">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="avatar placeholder">
                      <div className="bg-secondary text-secondary-content rounded-full w-8">
                        <span className="text-xs">BC</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-sm">Bob Coder</p>
                      <p className="text-xs text-base-content/60">O(n^2) Time | O(1) Space • Python</p>
                    </div>
                  </div>
                  <button className="btn btn-ghost btn-sm gap-1 text-base-content/60 hover:text-primary">
                    <ThumbsUpIcon className="size-4" /> 18
                  </button>
                </div>
                <h3 className="font-bold text-lg mb-2">Brute Force (Easy to understand)</h3>
                <p className="text-sm opacity-80 mb-2">Not the best approach, but works conceptually!</p>
                <pre className="bg-base-200 p-4 rounded-lg text-sm font-mono overflow-auto text-base-content/80">
                  {`def twoSum(self, nums, target):
    for i in range(len(nums)):
        for j in range(i + 1, len(nums)):
            if nums[i] + nums[j] == target:
                return [i, j]`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {activeTab === "submissions" && (
          <div>
            <h2 className="text-xl font-bold mb-6">Your Past Submissions</h2>

            <div className="overflow-x-auto bg-base-100 rounded-xl border border-base-300 rounded-box">
              <table className="table">
                <thead>
                  <tr>
                    <th>Status</th>
                    <th>Language</th>
                    <th>Runtime</th>
                    <th>Time Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {!submissions || submissions.filter(s => s.problemId === currentProblemId).length === 0 ? (
                    <tr><td colSpan="4" className="text-center py-8 text-base-content/50">No submissions yet. Try running your code!</td></tr>
                  ) : (
                    submissions.filter(s => s.problemId === currentProblemId).sort((a, b) => b.timestamp - a.timestamp).map((sub, idx) => (
                      <tr key={idx} className="hover cursor-pointer" onClick={() => onCodeLoad(sub.code, sub.language)}>
                        <td className={`font-semibold text-sm flex items-center gap-2 ${sub.status === 'Accepted' ? 'text-success' : 'text-error'}`}>
                          {sub.status === 'Accepted' ? <CheckIcon className="size-4" /> : null} {sub.status}
                        </td>
                        <td>{sub.language}</td>
                        <td className="font-mono text-sm opacity-70">{sub.timeTaken}</td>
                        <td className="opacity-50 text-sm">{new Date(sub.timestamp).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="mt-6 p-6 bg-base-100 rounded-xl border border-base-300">
              <h3 className="font-bold text-lg mb-2">Saved Code Notebook</h3>
              <p className="text-sm opacity-60 mb-4">Click any past submission to load it into the editor and view exactly how you solved it!</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ProblemDescription;
