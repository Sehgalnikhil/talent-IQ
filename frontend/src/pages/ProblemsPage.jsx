import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { useState, useEffect, useMemo } from "react";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, CheckCircle2Icon, SearchIcon, FlameIcon, ClockIcon, TrophyIcon, TagIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";
import { motion } from "framer-motion";

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
function ProgressRing({ solved, total, color, label, size = 80 }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const percent = total === 0 ? 0 : solved / total;
  const offset = circumference - percent * circumference;

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth="6" fill="none" className="stroke-base-300" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} strokeWidth="6" fill="none"
          stroke={color} strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          strokeDasharray={circumference}
        />
      </svg>
      <div className="text-center -mt-[calc(50%+10px)]">
        <div className="text-lg font-black" style={{ color }}>{solved}</div>
        <div className="text-[9px] font-bold text-base-content/40 uppercase">{label}</div>
      </div>
      <div className="text-[10px] font-bold text-base-content/40 mt-6">/{total}</div>
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

  const categories = ["All", ...new Set(problems.flatMap((p) => p.category.split(" • ")))];

  // Feature #9: all company names
  const allCompanies = useMemo(() => {
    const set = new Set();
    Object.values(COMPANY_TAGS).forEach(tags => tags.forEach(t => set.add(t)));
    return ["All", ...set];
  }, []);

  useEffect(() => {
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    setSolvedProblems(solved);
  }, []);

  // Personal bests
  const personalBests = JSON.parse(localStorage.getItem("personalBests") || "{}");

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === "All" || p.category.includes(categoryFilter);
    const matchesCompany = companyFilter === "All" || (COMPANY_TAGS[p.id] && COMPANY_TAGS[p.id].includes(companyFilter));
    const matchesSolved = !showSolvedOnly || solvedProblems.includes(p.id);
    return matchesSearch && matchesDifficulty && matchesCategory && matchesCompany && matchesSolved;
  });

  // Feature #10: Progress counts
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

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Feature #10: Progress Rings Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 card bg-base-100 shadow-xl border border-base-300 rounded-3xl overflow-hidden"
        >
          <div className="card-body">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl font-black mb-1">Practice Problems</h1>
                <p className="text-base-content/60 text-sm">
                  {solvedProblems.length} of {problems.length} solved • Keep pushing!
                </p>
              </div>
              <div className="flex items-center gap-6">
                <ProgressRing solved={easySolved} total={easyTotal} color="#22c55e" label="Easy" />
                <ProgressRing solved={medSolved} total={medTotal} color="#f59e0b" label="Medium" />
                <ProgressRing solved={hardSolved} total={hardTotal} color="#ef4444" label="Hard" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Feature #9: Enhanced Filters with Tags */}
        <div className="bg-base-100 rounded-xl shadow-sm p-4 border border-base-300 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/50 size-5" />
              <input
                type="text"
                placeholder="Search problems..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-4 flex-wrap">
              <select className="select select-bordered w-full md:w-auto" value={difficultyFilter} onChange={(e) => setDifficultyFilter(e.target.value)}>
                <option value="All">All Difficulties</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
              <select className="select select-bordered w-full md:w-auto" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat === "All" ? "All Categories" : cat}</option>
                ))}
              </select>
              {/* Feature #9: Company Filter */}
              <select className="select select-bordered w-full md:w-auto" value={companyFilter} onChange={(e) => setCompanyFilter(e.target.value)}>
                {allCompanies.map((c) => (
                  <option key={c} value={c}>{c === "All" ? "All Companies" : `🏢 ${c}`}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Tag pills row */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowSolvedOnly(!showSolvedOnly)}
              className={`badge badge-lg gap-1 cursor-pointer transition-colors ${showSolvedOnly ? 'badge-primary' : 'badge-outline hover:badge-primary'}`}
            >
              <CheckCircle2Icon className="size-3" /> {showSolvedOnly ? "Showing Solved" : "Show Solved Only"}
            </button>
            {categories.filter(c => c !== "All").map(cat => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(categoryFilter === cat ? "All" : cat)}
                className={`badge badge-lg gap-1 cursor-pointer transition-colors ${categoryFilter === cat ? 'badge-secondary' : 'badge-outline hover:badge-secondary'}`}
              >
                <TagIcon className="size-3" /> {cat}
              </button>
            ))}
          </div>
        </div>

        {/* PROBLEM OF THE DAY */}
        {!searchQuery && difficultyFilter === "All" && categoryFilter === "All" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FlameIcon className="size-5 text-orange-500" /> Daily Challenge
            </h2>
            <Link
              to={`/problem/${problems[new Date().getDate() % problems.length].id}`}
              className="card bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 hover:scale-[1.01] transition-transform"
            >
              <div className="card-body">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-bold text-lg mb-1">{problems[new Date().getDate() % problems.length].title}</div>
                    <p className="text-sm opacity-70 line-clamp-1">{problems[new Date().getDate() % problems.length].description.text}</p>
                  </div>
                  <button className="btn btn-primary btn-sm">Solve Challenge</button>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* PROBLEMS LIST */}
        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12 text-base-content/50">No problems found matching your filters.</div>
          ) : (
            filteredProblems.map((problem) => {
              const isSolved = solvedProblems.includes(problem.id);
              const pb = personalBests[problem.id];
              const companies = COMPANY_TAGS[problem.id] || [];
              return (
                <Link key={problem.id} to={`/problem/${problem.id}`} className="card bg-base-100 hover:scale-[1.01] transition-transform">
                  <div className="card-body">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`size-12 rounded-lg ${isSolved ? "bg-success/10" : "bg-primary/10"} flex items-center justify-center`}>
                            {isSolved ? <CheckCircle2Icon className="size-6 text-success" /> : <Code2Icon className="size-6 text-primary" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <h2 className={`text-xl font-bold ${isSolved ? "text-success" : ""}`}>{problem.title}</h2>
                              <span className={`badge ${getDifficultyBadgeClass(problem.difficulty)}`}>{problem.difficulty}</span>
                              {/* Personal Best badge */}
                              {pb && (
                                <span className="badge badge-warning badge-sm gap-1">
                                  <ClockIcon className="size-3" /> {formatTime(pb)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm text-base-content/60">{problem.category}</span>
                              {/* Feature #9: Company Tags */}
                              {companies.map(c => (
                                <span key={c} className="badge badge-ghost badge-xs">{c}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-base-content/80 mb-3 line-clamp-2">{problem.description.text}</p>
                      </div>
                      <div className="flex items-center gap-2 text-primary">
                        <span className="font-medium">{isSolved ? "Review" : "Solve"}</span>
                        <ChevronRightIcon className="size-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
