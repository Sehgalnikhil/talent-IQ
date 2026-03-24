// ═══════════════════════════════════════════════════════════════
// ML FEATURE WIDGETS — Dashboard Components for 10 ML Features
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../lib/axios";;
import { Link } from "react-router";
import toast from "react-hot-toast";
import {
  BrainCircuitIcon, CalendarClockIcon, BarChart3Icon, ShieldAlertIcon,
  TargetIcon, ActivityIcon, TagIcon, ClockIcon, ArrowRightIcon,
  RefreshCcwIcon, CheckCircleIcon, AlertTriangleIcon, TrendingDownIcon,
  TrendingUpIcon, ZapIcon, HeartPulseIcon, SparklesIcon, SunIcon,
  MoonIcon, SunriseIcon, CoffeeIcon, BatteryIcon, EyeIcon
} from "lucide-react";
import {
  SpacedRepetition, AdaptiveDifficulty, PerformancePredictor,
  WeaknessAnalyzer, StudyTimeAnalyzer, BurnoutPredictor, SmartTagger,
  ComplexityAnalyzer, SimilarityScorer
} from "../lib/ml-engine";

// ──────────────────────────────────
// #1: Spaced Repetition Widget
// ──────────────────────────────────
export function SpacedRepetitionWidget() {
  const [dueReviews, setDueReviews] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [stats, setStats] = useState({ total: 0, due: 0, mastered: 0, learning: 0 });

  useEffect(() => {
    SpacedRepetition.autoRegister();
    setDueReviews(SpacedRepetition.getDueReviews());
    setUpcoming(SpacedRepetition.getUpcoming(7));
    setStats(SpacedRepetition.getStats());
  }, []);

  const handleReview = (problemId, quality) => {
    SpacedRepetition.recordReview(problemId, quality);
    setDueReviews(SpacedRepetition.getDueReviews());
    setUpcoming(SpacedRepetition.getUpcoming(7));
    setStats(SpacedRepetition.getStats());
    toast.success(quality >= 3 ? "Nice recall! 🎯" : "Scheduled for sooner review 📚");
  };

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <BrainCircuitIcon className="size-5 text-primary" /> Spaced Repetition
        </h3>
        <div className="flex gap-1">
          {stats.due > 0 && <span className="badge badge-error badge-sm animate-pulse">{stats.due} due</span>}
          <span className="badge badge-ghost badge-sm">{stats.total} cards</span>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-base-200 rounded-xl p-2 text-center">
          <div className="text-lg font-black text-primary">{stats.learning}</div>
          <div className="text-[9px] text-base-content/50">Learning</div>
        </div>
        <div className="bg-base-200 rounded-xl p-2 text-center">
          <div className="text-lg font-black text-success">{stats.mastered}</div>
          <div className="text-[9px] text-base-content/50">Mastered</div>
        </div>
        <div className="bg-base-200 rounded-xl p-2 text-center">
          <div className="text-lg font-black text-error">{stats.due}</div>
          <div className="text-[9px] text-base-content/50">Due Now</div>
        </div>
      </div>

      {/* Due Reviews */}
      {dueReviews.length > 0 ? (
        <div className="space-y-2">
          <div className="text-xs font-bold text-error uppercase tracking-wide mb-2">📚 Due for Review</div>
          {dueReviews.slice(0, 3).map(r => (
            <div key={r.problemId} className="flex items-center justify-between p-2.5 rounded-xl bg-error/5 border border-error/20">
              <Link to={`/problem/${r.problemId}`} className="flex items-center gap-2 hover:text-primary transition-colors flex-1 min-w-0">
                <div className={`size-6 rounded-md flex items-center justify-center text-[10px] font-black ${
                  r.problem?.difficulty === "Easy" ? "bg-success/20 text-success" :
                  r.problem?.difficulty === "Medium" ? "bg-warning/20 text-warning" : "bg-error/20 text-error"
                }`}>{r.problem?.difficulty?.[0]}</div>
                <span className="text-sm font-semibold truncate">{r.problem?.title || r.problemId}</span>
              </Link>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleReview(r.problemId, 2)} className="btn btn-xs btn-ghost text-error" title="Hard">😓</button>
                <button onClick={() => handleReview(r.problemId, 3)} className="btn btn-xs btn-ghost text-warning" title="Good">🤔</button>
                <button onClick={() => handleReview(r.problemId, 5)} className="btn btn-xs btn-ghost text-success" title="Easy">😄</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 bg-success/5 rounded-xl border border-success/20">
          <CheckCircleIcon className="size-6 mx-auto text-success mb-1" />
          <p className="text-xs text-success font-bold">All caught up! 🎉</p>
          {upcoming.length > 0 && (
            <p className="text-[10px] text-base-content/40 mt-1">
              {upcoming.length} review{upcoming.length > 1 ? "s" : ""} coming in {upcoming[0].daysUntil} day{upcoming[0].daysUntil > 1 ? "s" : ""}
            </p>
          )}
        </div>
      )}
    </div>
  );
}


// ──────────────────────────────────
// #3: Adaptive Difficulty Widget
// ──────────────────────────────────
export function AdaptiveDifficultyWidget() {
  const recommended = AdaptiveDifficulty.getRecommendedDifficulty();
  const rates = AdaptiveDifficulty.getSuccessRates();
  const zone = AdaptiveDifficulty.getLearningZone();

  const diffColors = {
    Easy: { bg: "bg-success/10", text: "text-success", border: "border-success/30" },
    Medium: { bg: "bg-warning/10", text: "text-warning", border: "border-warning/30" },
    Hard: { bg: "bg-error/10", text: "text-error", border: "border-error/30" },
  };

  const rc = diffColors[recommended];

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <h3 className="font-bold flex items-center gap-2 mb-4">
        <TargetIcon className="size-5 text-primary" /> Adaptive Difficulty
      </h3>

      {/* Recommended Zone */}
      <motion.div 
        whileHover={{ y: -4, scale: 1.02 }} 
        transition={{ type: "spring", stiffness: 400 }} 
        className={`rounded-xl p-4 mb-4 ${rc.bg} border ${rc.border} cursor-pointer shadow-sm hover:shadow-md`}
      >
        <div className="text-xs uppercase font-bold text-base-content/40 mb-1">Recommended</div>
        <div className={`text-2xl font-black ${rc.text}`}>{recommended}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className="text-lg">{zone.emoji}</span>
          <div>
            <div className="text-sm font-bold">{zone.zone}</div>
            <div className="text-[10px] text-base-content/40">{zone.tip}</div>
          </div>
        </div>
      </motion.div>

      {/* Success Rates */}
      <div className="space-y-2">
        {["Easy", "Medium", "Hard"].map(d => {
          const r = rates[d];
          const colors = diffColors[d];
          return (
            <div key={d} className="flex items-center gap-3">
              <span className={`text-xs font-bold w-14 ${colors.text}`}>{d}</span>
              <div className="flex-1 h-2 bg-base-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${r.successRate}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full rounded-full ${d === "Easy" ? "bg-success" : d === "Medium" ? "bg-warning" : "bg-error"}`}
                />
              </div>
              <span className="text-xs font-mono w-10 text-right">{r.successRate}%</span>
              <span className="text-[10px] text-base-content/30 w-8 text-right">{r.attempts}x</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}


// ──────────────────────────────────
// #6: Weakness Heatmap Widget
// ──────────────────────────────────
export function WeaknessHeatmapWidget() {
  const data = useMemo(() => WeaknessAnalyzer.analyze(), []);
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? data.categories : data.categories.slice(0, 8);

  const getColor = (score) => {
    if (score >= 70) return "bg-success";
    if (score >= 45) return "bg-warning";
    return "bg-error";
  };

  const getTextColor = (score) => {
    if (score >= 70) return "text-success";
    if (score >= 45) return "text-warning";
    return "text-error";
  };

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <BarChart3Icon className="size-5 text-primary" /> Skill Heatmap
        </h3>
        <span className={`badge badge-sm ${data.overallStrength >= 60 ? "badge-success" : data.overallStrength >= 40 ? "badge-warning" : "badge-error"}`}>
          {data.overallStrength}% overall
        </span>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        {displayed.map(cat => (
          <div key={cat.category} className="relative group">
            <div className={`p-2.5 rounded-xl border transition-all hover:scale-[1.02] cursor-default ${
              cat.isWeak ? "border-error/30 bg-error/5" : cat.isStrong ? "border-success/30 bg-success/5" : "border-base-300 bg-base-200/50"
            }`}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold truncate max-w-[80%]">{cat.category}</span>
                <span className={`text-[10px] font-black ${getTextColor(cat.strengthScore)}`}>{cat.strengthScore}</span>
              </div>
              <div className="h-1.5 bg-base-200 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${getColor(cat.strengthScore)}`} style={{ width: `${cat.strengthScore}%` }} />
              </div>
              <div className="text-[9px] text-base-content/30 mt-1">{cat.solved}/{cat.totalProblems} solved</div>
            </div>
          </div>
        ))}
      </div>

      {data.categories.length > 8 && (
        <button onClick={() => setShowAll(!showAll)} className="btn btn-ghost btn-xs w-full">
          {showAll ? "Show Less" : `Show All (${data.categories.length})`}
        </button>
      )}

      {/* Weak Areas Alert */}
      {data.weakestAreas.length > 0 && (
        <div className="mt-3 p-3 rounded-xl bg-error/5 border border-error/20">
          <div className="flex items-center gap-1.5 text-xs font-bold text-error mb-1">
            <AlertTriangleIcon className="size-3.5" /> Focus Areas
          </div>
          <p className="text-[10px] text-base-content/50">
            {data.weakestAreas.slice(0, 3).map(a => a.category).join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}


// ──────────────────────────────────
// #7: Optimal Study Time Widget
// ──────────────────────────────────
export function StudyTimeWidget() {
  const data = useMemo(() => StudyTimeAnalyzer.analyze(), []);
  if (!data) return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <h3 className="font-bold flex items-center gap-2 mb-3">
        <ClockIcon className="size-5 text-primary" /> Study Time Intelligence
      </h3>
      <div className="text-center py-6 text-base-content/40">
        <ClockIcon className="size-8 mx-auto mb-2 opacity-30" />
        <p className="text-xs">Solve 5+ problems to unlock time analysis</p>
      </div>
    </div>
  );

  const chronoIcon = data.chronotype.type.includes("Early") ? <SunriseIcon className="size-5 text-warning" /> :
    data.chronotype.type.includes("Afternoon") ? <SunIcon className="size-5 text-orange-400" /> :
    data.chronotype.type.includes("Night Owl") ? <MoonIcon className="size-5 text-indigo-400" /> :
    <MoonIcon className="size-5 text-violet-400" />;

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <h3 className="font-bold flex items-center gap-2 mb-4">
        <ClockIcon className="size-5 text-primary" /> Study Time Intelligence
      </h3>

      {/* Chronotype */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20 mb-4">
        {chronoIcon}
        <div>
          <div className="text-sm font-bold">{data.chronotype.type}</div>
          <div className="text-[10px] text-base-content/50">{data.chronotype.desc}</div>
        </div>
      </div>

      {/* Hourly Activity Bar Chart */}
      <div className="mb-3">
        <div className="text-xs font-bold text-base-content/40 mb-2">Hourly Activity</div>
        <div className="flex items-end gap-[2px] h-16">
          {data.hourlyData.map((h, i) => {
            const height = data.totalSessions > 0 ? Math.max(2, (h.total / Math.max(...data.hourlyData.map(x => x.total), 1)) * 100) : 2;
            return (
              <div key={i} className="flex-1 flex flex-col items-center group relative">
                <div
                  className={`w-full rounded-t-sm transition-all ${h.total > 0 ? (h.successRate >= 70 ? "bg-success" : h.successRate >= 40 ? "bg-warning" : "bg-error") : "bg-base-200"}`}
                  style={{ height: `${height}%` }}
                  title={`${h.label}: ${h.total} attempts, ${h.successRate}% success`}
                />
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[8px] text-base-content/30 mt-1">
          <span>12AM</span><span>6AM</span><span>12PM</span><span>6PM</span><span>11PM</span>
        </div>
      </div>

      {/* Peak Times */}
      {data.peakHours.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs font-bold text-base-content/40">🏆 Best Hours</div>
          {data.peakHours.map((h, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="font-semibold">{h.label}</span>
              <span className="text-success font-bold">{h.successRate}% success</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


// ──────────────────────────────────
// #9: Burnout Predictor Widget
// ──────────────────────────────────
export function BurnoutWidget() {
  const data = useMemo(() => BurnoutPredictor.analyze(), []);
  if (!data) return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <h3 className="font-bold flex items-center gap-2 mb-3">
        <HeartPulseIcon className="size-5 text-primary" /> Wellness Monitor
      </h3>
      <div className="text-center py-6 text-base-content/40">
        <HeartPulseIcon className="size-8 mx-auto mb-2 opacity-30" />
        <p className="text-xs">Need 10+ submissions to analyze</p>
      </div>
    </div>
  );

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold flex items-center gap-2">
          <HeartPulseIcon className="size-5 text-primary" /> Wellness Monitor
        </h3>
        <span className={`badge badge-sm ${data.burnoutScore >= 60 ? "badge-error" : data.burnoutScore >= 35 ? "badge-warning" : "badge-success"}`}>
          {data.status.emoji} {data.status.level}
        </span>
      </div>

      {/* 💓 Dynamic EKG Core Pulse View Node */}
      <div className="bg-base-300/40 rounded-xl p-2 mb-4 relative overflow-hidden flex items-center justify-center">
         <svg className="w-full h-12" viewBox="0 0 100 25" preserveAspectRatio="none">
            <motion.path 
               d="M0 12 L35 12 L38 2 L41 22 L44 12 L47 12 L50 8 L53 12 L100 12" 
               stroke={data.burnoutScore >= 60 ? "#ef4444" : data.burnoutScore >= 35 ? "#f59e0b" : "#10b981"} 
               strokeWidth="2" 
               fill="none" 
               initial={{ strokeDashoffset: 100 }}
               animate={{ strokeDashoffset: [100, 0] }} 
               transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }} 
               strokeDasharray="40 10" 
            />
         </svg>
         <div className={`absolute right-4 size-2 rounded-full animate-ping ${data.burnoutScore >= 60 ? "bg-error" : data.burnoutScore >= 35 ? "bg-warning" : "bg-success"}`} />
      </div>

      {/* Burnout Gauge */}
      <div className="relative h-4 bg-base-200 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${data.burnoutScore}%` }}
          transition={{ duration: 1 }}
          className={`h-full rounded-full ${
            data.burnoutScore >= 60 ? "bg-gradient-to-r from-warning to-error" :
            data.burnoutScore >= 35 ? "bg-gradient-to-r from-success to-warning" :
            "bg-gradient-to-r from-success/50 to-success"
          }`}
        />
        <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black">
          {data.burnoutScore}% stress
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-base-200 rounded-xl p-2 text-center">
          <div className="text-xs font-black">{data.avgDailySessions}</div>
          <div className="text-[9px] text-base-content/40">Avg/Day</div>
        </div>
        <div className="bg-base-200 rounded-xl p-2 text-center">
          <div className={`text-xs font-black flex items-center justify-center gap-0.5 ${data.trend === "declining" ? "text-error" : data.trend === "improving" ? "text-success" : ""}`}>
            {data.trend === "declining" ? <TrendingDownIcon className="size-3" /> : data.trend === "improving" ? <TrendingUpIcon className="size-3" /> : null}
            {data.recentSuccessRate}%
          </div>
          <div className="text-[9px] text-base-content/40">Success</div>
        </div>
        <div className="bg-base-200 rounded-xl p-2 text-center">
          <div className={`text-xs font-black ${data.activityChange < -20 ? "text-warning" : ""}`}>
            {data.activityChange > 0 ? "+" : ""}{data.activityChange}%
          </div>
          <div className="text-[9px] text-base-content/40">Activity Δ</div>
        </div>
      </div>

      {/* Suggestion */}
      <div className={`p-3 rounded-xl text-xs ${
        data.burnoutScore >= 60 ? "bg-error/5 border border-error/20" :
        data.burnoutScore >= 35 ? "bg-warning/5 border border-warning/20" :
        "bg-success/5 border border-success/20"
      }`}>
        <div className="flex items-start gap-2">
          <SparklesIcon className="size-3.5 shrink-0 mt-0.5 text-primary" />
          <p className="text-base-content/70">{data.suggestion}</p>
        </div>
      </div>
    </div>
  );
}


// ──────────────────────────────────
// #10: Smart Pattern Tags Widget
// ──────────────────────────────────
export function PatternStatsWidget() {
  const patternStats = useMemo(() => SmartTagger.getPatternStats(), []);

  if (patternStats.length === 0) return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <h3 className="font-bold flex items-center gap-2 mb-3">
        <TagIcon className="size-5 text-primary" /> Pattern Intelligence
      </h3>
      <div className="text-center py-6 text-base-content/40">
        <TagIcon className="size-8 mx-auto mb-2 opacity-30" />
        <p className="text-xs">Submit solutions to detect patterns</p>
      </div>
    </div>
  );

  const maxCount = Math.max(...patternStats.map(p => p.count));

  return (
    <div className="bg-base-100 rounded-2xl p-5 border border-base-300 shadow-sm">
      <h3 className="font-bold flex items-center gap-2 mb-4">
        <TagIcon className="size-5 text-primary" /> Pattern Intelligence
      </h3>

      <div className="space-y-2.5">
        {patternStats.slice(0, 6).map((p, i) => (
          <div key={p.name} className="flex items-center gap-3">
            <span className="text-lg w-6 text-center">{p.icon}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-semibold">{p.name}</span>
                <span className="text-[10px] text-base-content/40">{p.count}x used</span>
              </div>
              <div className="h-1.5 bg-base-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.count / maxCount) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {patternStats.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/20">
          <p className="text-[10px] text-base-content/50">
            <span className="font-bold text-primary">Top pattern:</span> {patternStats[0]?.icon} {patternStats[0]?.name} ({patternStats[0]?.count} uses)
          </p>
        </div>
      )}
    </div>
  );
}


// ──────────────────────────────────
// Combined ML Insights Panel (for Problem Page)
// ──────────────────────────────────
export function ProblemMLInsights({ problemId, code, language }) {
  const [analysis, setAnalysis] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [patterns, setPatterns] = useState([]);
  const [similarity, setSimilarity] = useState(null);
  const [stress, setStress] = useState(30);
  const [oracleIssues, setOracleIssues] = useState([]);
  const [isLints, setIsLints] = useState(false);
  const lastCodeLength = useRef(code?.length || 0);

  useEffect(() => {
    if (code && code.length > 10) {
        setIsLints(true);
        const timer = setTimeout(async () => {
             try {
                const res = await axiosInstance.post("/interview/oracle-lint", { code, language });
                setOracleIssues(res.data.issues || []);
             } catch (e) {} finally { setIsLints(false); }
        }, 1500);
        return () => clearTimeout(timer);
    }
  }, [code, language]);

  useEffect(() => {
    if (code !== undefined) {
      const currentLength = code.length;
      const lengthDelta = Math.abs(currentLength - lastCodeLength.current);
      lastCodeLength.current = currentLength;

      if (lengthDelta > 0) {
          setStress(prev => {
             // Typing raises focus, deletions raise anxiety node
             const change = lengthDelta > 2 ? 8 : 2;
             return Math.min(100, Math.max(10, prev + change));
          });
      }
    }
  }, [code]);

  // Gradually cool down stress level when quiet
  useEffect(() => {
    const cooldown = setInterval(() => {
       setStress(prev => Math.max(20, prev - 3));
    }, 1500);
    return () => clearInterval(cooldown);
  }, []);

  useEffect(() => {
    setPrediction(PerformancePredictor.predict(problemId));
  }, [problemId]);

  useEffect(() => {
    if (code && code.length > 20) {
      const timer = setTimeout(() => {
        setAnalysis(ComplexityAnalyzer.analyze(code, language));
        setPatterns(SmartTagger.detectPatterns(code));
        setSimilarity(SimilarityScorer.score(code));
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [code, language]);

  return (
    <div className="space-y-3 p-3">
      {/* 🧬 Biometric Stress Metric Node */}
      <div className="bg-base-200/50 rounded-xl p-3 border border-base-300">
          <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-2 flex items-center justify-between">
             <span className="flex items-center gap-1"><HeartPulseIcon className="size-3 text-error" /> Biometric Cadence</span>
             <span className={`badge badge-xs ${stress > 60 ? "badge-error" : stress > 35 ? "badge-warning" : "badge-success"}`}>{stress > 60 ? "High Stress" : stress > 35 ? "Normal" : "Focused"}</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="flex-1 h-3 bg-base-300 rounded-full overflow-hidden relative">
                <motion.div 
                   animate={{ width: `${stress}%` }} 
                   className={`h-full rounded-full ${stress > 60 ? "bg-error" : stress > 35 ? "bg-warning" : "bg-success"}`} 
                />
             </div>
             <span className="text-sm font-black font-mono">{stress}%</span>
          </div>
          <div className="text-[9px] text-base-content/40 mt-1 flex items-center gap-1">
             <div className="size-1.5 rounded-full bg-success animate-ping" /> Analyzing keystroke biomechatronics...
          </div>
      </div>

      {/* Performance Prediction */}
      {prediction && (
        <div className="bg-base-200/50 rounded-xl p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-2 flex items-center gap-1">
            <ZapIcon className="size-3" /> Success Prediction
          </div>
          <div className="flex items-center gap-3">
            <div className={`text-2xl font-black ${prediction.successProbability >= 70 ? "text-success" : prediction.successProbability >= 40 ? "text-warning" : "text-error"}`}>
              {prediction.successProbability}%
            </div>
            <div className="flex-1">
              <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${prediction.successProbability >= 70 ? "bg-success" : prediction.successProbability >= 40 ? "bg-warning" : "bg-error"}`}
                  style={{ width: `${prediction.successProbability}%` }} />
              </div>
              <div className="text-[9px] text-base-content/40 mt-1">~{prediction.estimatedTimeMin} min estimated</div>
            </div>
          </div>
        </div>
      )}

      {/* Complexity Analysis */}
      {analysis && (
        <div className="bg-base-200/50 rounded-xl p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-2 flex items-center gap-1">
            <ActivityIcon className="size-3" /> Code Analysis
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-base-content/50">Time</span>
              <span className="font-mono font-bold text-primary">{analysis.timeComplexity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/50">Space</span>
              <span className="font-mono font-bold text-secondary">{analysis.spaceComplexity}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/50">Quality</span>
              <span className={`font-bold ${analysis.qualityScore >= 70 ? "text-success" : "text-warning"}`}>{analysis.qualityScore}/100</span>
            </div>
            <div className="flex justify-between">
              <span className="text-base-content/50">Cyclomatic</span>
              <span className="font-bold">{analysis.cyclomaticComplexity}</span>
            </div>
          </div>
          {analysis.suggestions.length > 0 && (
            <div className="mt-2 text-[10px] text-base-content/50 space-y-0.5">
              {analysis.suggestions.slice(0, 2).map((s, i) => (
                <div key={i} className="flex items-start gap-1">
                  <span className="text-primary">💡</span> {s}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detected Patterns */}
      {patterns.length > 0 && (
        <div className="bg-base-200/50 rounded-xl p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-2 flex items-center gap-1">
            <TagIcon className="size-3" /> Detected Patterns
          </div>
          <div className="flex flex-wrap gap-1.5">
            {patterns.map(p => (
              <span key={p.name} className="badge badge-sm badge-outline gap-1">
                {p.icon} {p.name}
                <span className="text-primary font-bold">{p.confidence}%</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 🔮 AI Bug Index Oracle */}
      <div className="bg-base-200/50 rounded-xl p-3 border border-base-300/40">
           <div className="text-[10px] font-bold uppercase tracking-wider text-base-content/40 mb-2 flex items-center justify-between">
               <span className="flex items-center gap-1"><SparklesIcon className="size-3 text-cyan-500" /> AI Oracle (Live)</span>
               {isLints && <span className="loading loading-spinner loading-xs text-cyan-500" />}
           </div>
           {oracleIssues.length > 0 ? (
               <div className="space-y-1.5 border-t border-base-300/30 pt-1.5 mt-1.5">
                   {oracleIssues.map((issue, i) => (
                       <div key={i} className="flex items-start gap-1 p-1.5 bg-error/5 border border-error/20 rounded-lg">
                           <ShieldAlertIcon className="size-3 text-error mt-0.5" />
                           <span className="text-[10px] text-base-content/80">{issue}</span>
                       </div>
                   ))}
               </div>
           ) : (
                <p className="text-[10px] text-base-content/40 text-center py-2 flex items-center justify-center gap-1">
                   {isLints ? "Analyzing buffers..." : "Clean analysis. No major risks found."}
                </p>
           )}
      </div>
    </div>
  );
}
