import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { useState, useEffect, useMemo } from "react";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, CheckCircle2Icon, SearchIcon, FlameIcon, ClockIcon, TrophyIcon, TagIcon, SparklesIcon, BotIcon, XIcon, LightbulbIcon, ArrowRightIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../lib/axios";
import toast from "react-hot-toast";

// Feature #9: Company tag data (mapped to problems)
const COMPANY_TAGS = {
  "two-sum": ["Google", "Amazon", "Meta"],
  "reverse-string": ["Microsoft", "Apple"],
  "palindrome-number": ["Google", "Meta"],
  "merge-sorted-array": ["Amazon", "Microsoft"],
  "roman-to-integer": ["Meta", "Bloomberg"],
  "valid-parentheses": ["Google", "Amazon", "Meta"],
  "best-time-to-buy-and-sell-stock": ["Amazon", "Goldman"],
  "linked-list-cycle": ["Microsoft", "Apple"],
  "maximum-subarray": ["Google", "Amazon"],
  "climbing-stairs": ["Apple", "Meta"],
};

// Feature #10: Circular Progress Ring SVG
function ProgressRing({ solved, total, color, label, size = 85 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = total === 0 ? 0 : solved / total;
  const offset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center gap-1 group">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="5" fill="none" className="stroke-white/5" />
          <motion.circle
            cx={size / 2} cy={size / 2} r={radius} strokeWidth="5" fill="none"
            stroke={color} strokeLinecap="round"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            strokeDasharray={circumference}
            style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
          />
        </svg>
        <div className="absolute text-center flex flex-col items-center">
          <div className="text-xl font-black tracking-tight" style={{ color }}>
            {solved}
          </div>
          <div className="text-[9px] font-black text-base-content/40 uppercase tracking-widest">{label}</div>
        </div>
      </div>
      <div className="text-[10px] font-bold text-base-content/40 mt-1">/{total}</div>
    </div>
  );
}

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [companyFilter, setCompanyFilter] = useState("All");
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [showSolvedOnly, setShowSolvedOnly] = useState(false);

  // AI Generator state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProblem, setGeneratedProblem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const categories = ["All", ...new Set(problems.flatMap((p) => p.category.split(" • ")))];

  const allCompanies = useMemo(() => {
    const set = new Set();
    Object.values(COMPANY_TAGS).forEach(tags => tags.forEach(t => set.add(t)));
    return ["All", ...set];
  }, []);

  useEffect(() => {
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    setSolvedProblems(solved);
  }, []);

  const personalBests = JSON.parse(localStorage.getItem("personalBests") || "{}");

  const filteredProblems = problems.filter((p) => {
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const matchesSearch = p.title.toLowerCase().includes(normalizedQuery) || p.category.toLowerCase().includes(normalizedQuery);
    const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === "All" || p.category.includes(categoryFilter);
    const matchesCompany = companyFilter === "All" || (COMPANY_TAGS[p.id] && COMPANY_TAGS[p.id].includes(companyFilter));
    const matchesSolved = !showSolvedOnly || solvedProblems.includes(p.id);
    return matchesSearch && matchesDifficulty && matchesCategory && matchesCompany && matchesSolved;
  });

  const easyTotal = problems.filter(p => p.difficulty === "Easy").length;
  const medTotal = problems.filter(p => p.difficulty === "Medium").length;
  const hardTotal = problems.filter(p => p.difficulty === "Hard").length;
  const easySolved = problems.filter(p => p.difficulty === "Easy" && solvedProblems.includes(p.id)).length;
  const medSolved = problems.filter(p => p.difficulty === "Medium" && solvedProblems.includes(p.id)).length;
  const hardSolved = problems.filter(p => p.difficulty === "Hard" && solvedProblems.includes(p.id)).length;

  const formatTime = (secs) => {
    if (!secs) return null;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s.toString().padStart(2, "0")}s`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.98 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 14 } }
  };

  const handleGenerateAI = async () => {
    setIsGenerating(true);
    try {
      const activeTopic = categoryFilter !== "All" ? categoryFilter : "Algorithms";
      const activeDiff = difficultyFilter !== "All" ? difficultyFilter : "Medium";
      
      const res = await axiosInstance.post("/interview/generate-problem", { 
        topic: activeTopic, 
        difficulty: activeDiff 
      });
      
      if (res.data && res.data.title) {
        setGeneratedProblem(res.data);
        setShowModal(true);
        toast.success("Problem Generated! 🧠");
      } else {
        toast.error("Format error from AI endpoint.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate custom problem");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-300 to-base-200 font-sans selection:bg-primary/30 relative overflow-hidden">
      {/* Background Dim accents */}
      <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      <Navbar />

      <div className="max-w-6xl mx-auto px-6 pt-64 pb-12 relative z-10">
        
        {/* HEADER PROGRESS RINGS */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="mb-8 card border border-white/5 bg-base-100/30 backdrop-blur-xl rounded-3xl overflow-hidden p-6 shadow-xl"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pointer-events-none">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SparklesIcon className="size-5 text-primary animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-primary">Skill Metrics</span>
              </div>
              <h1 className="text-4xl font-black bg-gradient-to-r from-white to-base-content/70 bg-clip-text text-transparent">Practice Arena</h1>
              <p className="text-base-content/50 text-sm mt-1 font-medium">
                {solvedProblems.length} of {problems.length} solved • {Math.round((solvedProblems.length/problems.length)*100)}% complete
              </p>
            </div>
            <div className="flex items-center gap-8 bg-base-300/30 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
              <ProgressRing solved={easySolved} total={easyTotal} color="#22c55e" label="Easy" />
              <ProgressRing solved={medSolved} total={medTotal} color="#f59e0b" label="Medium" />
              <ProgressRing solved={hardSolved} total={hardTotal} color="#ef4444" label="Hard" />
            </div>
          </div>
        </motion.div>

        {/* FILTERS PANEL */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-base-100/20 backdrop-blur-md rounded-2xl p-4 border border-white/5 mb-6 space-y-4 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 size-5 pointer-events-none" />
              <input
                type="text"
                placeholder="Search algorithms by title..."
                className="input bg-base-200/50 input-bordered w-full pl-12 h-12 text-sm font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-3 flex-wrap">
              <select className="select select-bordered bg-base-200/50 h-12 text-sm font-semibold" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                <option value="All">Difficulty</option>
                <option value="Easy">🟢 Easy</option>
                <option value="Medium">🟡 Medium</option>
                <option value="Hard">🔴 Hard</option>
              </select>
              <select className="select select-bordered bg-base-200/50 h-12 text-sm font-semibold" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                <option value="All">Category</option>
                {categories.filter(c => c !== "All").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select className="select select-bordered bg-base-200/50 h-12 text-sm font-semibold" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
                <option value="All">Company</option>
                {allCompanies.filter(c => c !== "All").map((c) => (
                  <option key={c} value={c}>🏢 {c}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
            <button
              onClick={() => setShowSolvedOnly(!showSolvedOnly)}
              className={`badge badge-lg h-8 gap-1.5 cursor-pointer font-bold transition-all border-none ${showSolvedOnly ? 'bg-primary text-primary-content shadow-md shadow-primary/20' : 'bg-base-300/50 hover:bg-base-300'}`}
            >
              <CheckCircle2Icon className="size-3.5" /> {showSolvedOnly ? "Solved" : "All Statuses"}
            </button>
            {categories.filter(c => c !== "All" && (categoryFilter === "All" || categoryFilter === c)).map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? "All" : cat)}
                className={`badge badge-lg h-8 gap-1.5 cursor-pointer font-bold transition-all border-none ${categoryFilter === cat ? 'bg-secondary text-secondary-content shadow-md shadow-secondary/20' : 'bg-base-300/50 hover:bg-base-300'}`}
              >
                <TagIcon className="size-3.5" /> {cat}
              </button>
            ))}
          </div>
        </motion.div>

        {/* AI GENERATOR PANEL */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="card bg-gradient-to-br from-primary/15 via-base-100/40 to-secondary/15 border border-primary/20 hover:border-primary/40 rounded-2xl p-6 shadow-xl mb-6 relative overflow-hidden group transition-all duration-300"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-2xl pointer-events-none group-hover:bg-primary/30 transition-all duration-500" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="size-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
                <BotIcon className="size-8 text-white animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <SparklesIcon className="size-3 text-primary" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary">Infinity problems</span>
                </div>
                <h2 className="text-2xl font-black text-white">Generate Custom Prompt</h2>
                <p className="text-xs text-base-content/60 font-medium max-w-sm mt-0.5">
                  Creates a unique problem tailored to your filters: <strong className="text-primary">{categoryFilter === "All" ? "Algorithms" : categoryFilter}</strong> (${difficultyFilter === "All" ? "Medium" : difficultyFilter})
                </p>
              </div>
            </div>
            <button 
              onClick={handleGenerateAI} 
              disabled={isGenerating}
              className="btn btn-primary btn-md rounded-xl font-bold gap-2 shadow-lg shadow-primary/20 w-full md:w-auto"
            >
              {isGenerating ? <span className="loading loading-spinner loading-sm"></span> : <SparklesIcon className="size-4" />}
              {isGenerating ? "Synthesizing..." : "Magic Generate"}
            </button>
          </div>
        </motion.div>

        {/* AI GENERATED MODAL */}
        <AnimatePresence>
          {showModal && generatedProblem && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="card bg-base-100 border border-white/10 w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl rounded-3xl p-6 relative"
              >
                <div className="absolute top-4 right-4">
                  <button onClick={() => setShowModal(false)} className="btn btn-ghost btn-sm btn-circle">
                    <XIcon className="size-5" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <SparklesIcon className="size-5 text-primary animate-pulse" />
                  <span className="text-xs font-black uppercase tracking-widest text-primary">AI Concept Board</span>
                </div>
                
                <h2 className="text-3xl font-black mb-1 text-white">{generatedProblem.title}</h2>
                <div className="flex gap-2 mb-4">
                  <span className="badge badge-sm badge-secondary font-bold">{generatedProblem.timeComplexity || "O(n)"}</span>
                  {(generatedProblem.tags || []).map(t => <span key={t} className="badge badge-sm badge-ghost">{t}</span>)}
                </div>

                <div className="space-y-4 text-sm font-medium text-base-content/80">
                  <div className="bg-base-200/50 p-4 rounded-xl border border-white/5">
                    <h3 className="font-bold text-white mb-1">Problem Description</h3>
                    <p>{generatedProblem.description}</p>
                  </div>

                  {generatedProblem.examples && generatedProblem.examples.length > 0 && (
                    <div>
                      <h3 className="font-bold text-white mb-1">Example Cases</h3>
                      <div className="bg-base-300 font-mono text-xs p-3 rounded-xl space-y-2">
                        {generatedProblem.examples.map((ex, i) => (
                          <div key={i}>
                            <div className="text-primary font-bold">Input: <span className="text-white/80">{ex.input}</span></div>
                            <div className="text-success font-bold">Output: <span className="text-white/80">{ex.output}</span></div>
                            {ex.explanation && <div className="text-base-content/40 mt-0.5">// {ex.explanation}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {generatedProblem.approach && (
                    <div className="border-l-2 border-primary/40 pl-4 py-1">
                      <h3 className="font-bold text-white text-xs mb-1 flex items-center gap-1">
                        <LightbulbIcon className="size-3.5 text-warning" /> Suggested Approach
                      </h3>
                      <p className="text-xs text-base-content/60">{generatedProblem.approach}</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex gap-3">
                  <button onClick={() => setShowModal(false)} className="btn btn-outline btn-md flex-1 rounded-xl font-bold">Dismiss</button>
                  <Link 
                    to="/problem/ai-problem"
                    onClick={() => {
                      const payload = {
                        ...generatedProblem,
                        id: "ai-problem",
                        category: (generatedProblem.tags || []).join(" • ") || "Dynamic Algoritm",
                        difficulty: generatedProblem.difficulty || difficultyFilter,
                        description: { text: generatedProblem.description, notes: [] }
                      };
                      localStorage.setItem("ai_problem", JSON.stringify(payload));
                    }}
                    className="btn btn-primary btn-md flex-1 rounded-xl gap-2 font-bold shadow-lg shadow-primary/20 flex items-center justify-center"
                  >
                     Open in AI Compiler <ArrowRightIcon className="size-4" />
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROBLEM OF THE DAY */}
        <AnimatePresence>
          {!searchQuery && difficultyFilter === "All" && categoryFilter === "All" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="mb-8"
            >
              <h2 className="text-sm font-black uppercase tracking-widest bg-gradient-to-r from-warning back to-orange-500 bg-clip-text text-transparent mb-3 flex items-center gap-2">
                <FlameIcon className="size-4 text-warning animate-bounce" /> Daily Challenge
              </h2>
              <Link
                to={`/problem/${problems[new Date().getDate() % problems.length].id}`}
                className="card bg-gradient-to-r from-warning/10 via-base-100/40 to-primary/10 border border-warning/10 hover:border-warning/30 backdrop-blur-xl group shadow-lg p-6 rounded-2xl relative overflow-hidden block"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-warning/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center justify-between gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="badge badge-warning badge-xs font-black">🔥 200 pts</div>
                      <span className="text-[11px] font-bold text-base-content/50">• Expires in 14h</span>
                    </div>
                    <div className="font-black text-xl mb-1 group-hover:text-warning transition-colors">{problems[new Date().getDate() % problems.length].title}</div>
                    <p className="text-sm text-base-content/60 font-medium line-clamp-1">{problems[new Date().getDate() % problems.length].description.text}</p>
                  </div>
                  <button className="btn btn-warning btn-sm font-bold shadow-md shadow-warning/20">Solve Now</button>
                </div>
              </Link>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PROBLEMS LIST */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-3"
        >
          {filteredProblems.length === 0 ? (
            <div className="text-center py-16 text-base-content/30 card bg-base-100/10 border border-dashed border-white/5 font-bold">No items match filters.</div>
          ) : (
            filteredProblems.map((problem) => {
              const isSolved = solvedProblems.includes(problem.id);
              const pb = personalBests[problem.id];
              const companies = COMPANY_TAGS[problem.id] || [];
              const diffColor = problem.difficulty === "Easy" ? "text-success" : problem.difficulty === "Medium" ? "text-warning" : "text-error";
              
              return (
                <motion.div key={problem.id} variants={itemVariants}>
                  <Link to={`/problem/${problem.id}`} className="card bg-base-100/10 hover:bg-base-100/20 backdrop-blur-md border border-white/5 p-5 group flex-row items-center justify-between relative overflow-hidden cursor-pointer">
                    {/* Active Gradient on hover */}
                    <div className={`absolute left-0 top-0 bottom-0 w-[4px] opacity-70 transition-all duration-300 ${isSolved ? 'bg-success' : 'bg-transparent group-hover:bg-primary'}`} />
                    
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`size-11 rounded-xl flex items-center justify-center transition-colors shadow-inner ${isSolved ? "bg-success/10" : "bg-base-200/80 border border-white/5 group-hover:bg-primary/10"}`}>
                        {isSolved ? <CheckCircle2Icon className="size-6 text-success" /> : <Code2Icon className="size-5 text-base-content/60 group-hover:text-primary transition-colors" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <h2 className={`font-black text-base group-hover:text-primary transition-colors ${isSolved ? "text-success" : "text-white/90"}`}>{problem.title}</h2>
                          <span className={`text-[11px] font-black uppercase tracking-wider ${diffColor}`}>{problem.difficulty}</span>
                          {pb && (
                            <span className="badge badge-warning badge-xs font-black gap-1 text-[9px] h-4 bg-warning/20 border-warning/10 text-warning">
                              🏆 {formatTime(pb)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap text-xs font-semibold text-base-content/50">
                          <span>{problem.category}</span>
                          {companies.length > 0 && <span className="opacity-30">•</span>}
                          {companies.map(c => (
                            <span key={c} className="text-[10px] text-base-content/40 hover:text-base-content transition-colors">@{c}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isSolved ? (
                        <span className="text-xs font-black text-success tracking-widest uppercase">Cleared</span>
                      ) : (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-3 group-hover:translate-x-0 transition-transform text-primary font-black text-xs uppercase tracking-wider">
                          Solve <ChevronRightIcon className="size-4" />
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
export default ProblemsPage;
