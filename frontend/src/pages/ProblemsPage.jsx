import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, CheckCircle2Icon, SearchIcon, FlameIcon } from "lucide-react";
import { getDifficultyBadgeClass } from "../lib/utils";

function ProblemsPage() {
  const problems = Object.values(PROBLEMS);

  const [searchQuery, setSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [solvedProblems, setSolvedProblems] = useState([]);

  // get unique categories
  const categories = ["All", ...new Set(problems.flatMap((p) => p.category.split(" • ")))];

  useEffect(() => {
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    setSolvedProblems(solved);
  }, []);

  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    const matchesCategory = categoryFilter === "All" || p.category.includes(categoryFilter);

    return matchesSearch && matchesDifficulty && matchesCategory;
  });

  const easyProblemsCount = problems.filter((p) => p.difficulty === "Easy").length;
  const mediumProblemsCount = problems.filter((p) => p.difficulty === "Medium").length;
  const hardProblemsCount = problems.filter((p) => p.difficulty === "Hard").length;

  const solvedCount = solvedProblems.length;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* HEADER */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
            <p className="text-base-content/70">
              Sharpen your coding skills with these curated problems
            </p>
          </div>
          <div className="flex flex-col gap-1 items-end text-sm font-semibold">
            <span>Solved: {solvedCount} / {problems.length}</span>
            <progress className="progress progress-primary w-48 mt-1" value={solvedCount} max={problems.length}></progress>
          </div>
        </div>

        {/* FILTERS SETTINGS */}
        <div className="bg-base-100 rounded-xl shadow-sm p-4 border border-base-300 mb-6 flex flex-col md:flex-row gap-4">
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
          <div className="flex gap-4">
            <select
              className="select select-bordered w-full md:w-auto"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulties</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            <select
              className="select select-bordered w-full md:w-auto"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === "All" ? "All Categories" : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* PROBLEM OF THE DAY */}
        {!searchQuery && difficultyFilter === "All" && categoryFilter === "All" && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FlameIcon className="size-5 text-orange-500" />
              Daily Challenge
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
            <div className="text-center py-12 text-base-content/50">
              No problems found matching your filters.
            </div>
          ) : (
            filteredProblems.map((problem) => {
              const isSolved = solvedProblems.includes(problem.id);
              return (
                <Link
                  key={problem.id}
                  to={`/problem/${problem.id}`}
                  className="card bg-base-100 hover:scale-[1.01] transition-transform"
                >
                  <div className="card-body">
                    <div className="flex items-center justify-between gap-4">
                      {/* LEFT SIDE */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`size-12 rounded-lg ${isSolved ? "bg-success/10" : "bg-primary/10"
                              } flex items-center justify-center`}
                          >
                            {isSolved ? (
                              <CheckCircle2Icon className="size-6 text-success" />
                            ) : (
                              <Code2Icon className="size-6 text-primary" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h2
                                className={`text-xl font-bold ${isSolved ? "text-success" : ""
                                  }`}
                              >
                                {problem.title}
                              </h2>
                              <span
                                className={`badge ${getDifficultyBadgeClass(
                                  problem.difficulty
                                )}`}
                              >
                                {problem.difficulty}
                              </span>
                            </div>
                            <p className="text-sm text-base-content/60">
                              {" "}
                              {problem.category}
                            </p>
                          </div>
                        </div>
                        <p className="text-base-content/80 mb-3 line-clamp-2">
                          {problem.description.text}
                        </p>
                      </div>
                      {/* RIGHT SIDE */}

                      <div className="flex items-center gap-2 text-primary">
                        <span className="font-medium">
                          {isSolved ? "Review" : "Solve"}
                        </span>
                        <ChevronRightIcon className="size-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>

        {/* STATS FOOTER */}
        <div className="mt-12 card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal">
              <div className="stat">
                <div className="stat-title">Total Problems</div>
                <div className="stat-value text-primary">{problems.length}</div>
              </div>

              <div className="stat">
                <div className="stat-title">Easy</div>
                <div className="stat-value text-success">{easyProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Medium</div>
                <div className="stat-value text-warning">{mediumProblemsCount}</div>
              </div>
              <div className="stat">
                <div className="stat-title">Hard</div>
                <div className="stat-value text-error">{hardProblemsCount}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProblemsPage;
