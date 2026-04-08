// ═══════════════════════════════════════════════════════════════
// ML ENGINE — 10 Pure ML Features (No API Keys Required)
// All algorithms run 100% client-side using localStorage data
// ═══════════════════════════════════════════════════════════════

import { PROBLEMS } from "../data/problems";

// ──────────────────────────────────
// HELPER: Safe localStorage access
// ──────────────────────────────────
const getLS = (key, fallback = null) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
};
const setLS = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// ═══════════════════════════════════════════════════════════════
// FEATURE 1: Spaced Repetition Engine (SM-2 Algorithm)
// ═══════════════════════════════════════════════════════════════
export const SpacedRepetition = {
  /**
   * SM-2 Algorithm — schedules reviews based on recall quality
   * quality: 0-5 (0=complete blackout, 5=perfect recall)
   */
  calculateNext(card) {
    const { quality = 3, repetitions = 0, easeFactor = 2.5, interval = 1 } = card;
    let newEF = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEF = Math.max(1.3, newEF);

    let newInterval, newReps;
    if (quality < 3) {
      newReps = 0;
      newInterval = 1;
    } else {
      newReps = repetitions + 1;
      if (newReps === 1) newInterval = 1;
      else if (newReps === 2) newInterval = 6;
      else newInterval = Math.round(interval * newEF);
    }

    return {
      easeFactor: newEF,
      interval: newInterval,
      repetitions: newReps,
      nextReview: Date.now() + newInterval * 24 * 60 * 60 * 1000,
      lastReview: Date.now(),
    };
  },

  /** Record a review for a problem */
  recordReview(problemId, quality) {
    const cards = getLS("sr_cards", {});
    const existing = cards[problemId] || { quality, repetitions: 0, easeFactor: 2.5, interval: 1 };
    existing.quality = quality;
    cards[problemId] = { ...existing, ...this.calculateNext(existing) };
    setLS("sr_cards", cards);
    return cards[problemId];
  },

  /** Get all problems due for review */
  getDueReviews() {
    const cards = getLS("sr_cards", {});
    const now = Date.now();
    return Object.entries(cards)
      .filter(([, card]) => card.nextReview <= now)
      .map(([id, card]) => ({
        problemId: id,
        problem: PROBLEMS[id],
        ...card,
        overdueDays: Math.floor((now - card.nextReview) / (24 * 60 * 60 * 1000)),
      }))
      .sort((a, b) => a.nextReview - b.nextReview);
  },

  /** Get upcoming reviews */
  getUpcoming(days = 7) {
    const cards = getLS("sr_cards", {});
    const now = Date.now();
    const horizon = now + days * 24 * 60 * 60 * 1000;
    return Object.entries(cards)
      .filter(([, card]) => card.nextReview > now && card.nextReview <= horizon)
      .map(([id, card]) => ({
        problemId: id,
        problem: PROBLEMS[id],
        ...card,
        daysUntil: Math.ceil((card.nextReview - now) / (24 * 60 * 60 * 1000)),
      }))
      .sort((a, b) => a.nextReview - b.nextReview);
  },

  /** Auto-register solved problems if not already in the SR system */
  autoRegister() {
    const solved = getLS("solvedProblems", []);
    const cards = getLS("sr_cards", {});
    let added = 0;
    solved.forEach(id => {
      if (!cards[id]) {
        cards[id] = this.calculateNext({ quality: 4, repetitions: 0, easeFactor: 2.5, interval: 1 });
        added++;
      }
    });
    if (added > 0) setLS("sr_cards", cards);
    return added;
  },

  getStats() {
    const cards = getLS("sr_cards", {});
    const now = Date.now();
    const total = Object.keys(cards).length;
    const due = Object.values(cards).filter(c => c.nextReview <= now).length;
    const mastered = Object.values(cards).filter(c => c.repetitions >= 5 && c.easeFactor > 2.2).length;
    const learning = total - mastered;
    return { total, due, mastered, learning };
  }
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 2: Code Complexity Analyzer (AST Heuristics)
// ═══════════════════════════════════════════════════════════════
// ──────────────────────────────────
// CACHE: Simple in-memory cache
// ──────────────────────────────────
const _analysisCache = new Map();

// ═══════════════════════════════════════════════════════════════
// FEATURE 2: Code Complexity Analyzer (AST Heuristics)
// ═══════════════════════════════════════════════════════════════
export const ComplexityAnalyzer = {
  /** Analyze code complexity using pattern-based heuristics */
  analyze(code, language = "javascript") {
    if (!code || code.trim().length === 0) return null;

    // 1. Check cache first to save main-thread time
    const cacheKey = `${language}:${code.slice(0, 100)}:${code.length}`;
    if (_analysisCache.has(cacheKey)) return _analysisCache.get(cacheKey);


    const lines = code.split("\n");
    const cleanCode = code.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/#.*$/gm, "");

    // Count nesting depth
    let maxDepth = 0, currentDepth = 0;
    for (const char of cleanCode) {
      if (char === "{" || char === "(") { currentDepth++; maxDepth = Math.max(maxDepth, currentDepth); }
      if (char === "}" || char === ")") currentDepth = Math.max(0, currentDepth - 1);
    }

    // Count loops
    const forLoops = (cleanCode.match(/\b(for|while|do)\b/g) || []).length;
    const nestedLoops = this._countNestedLoops(cleanCode);

    // Count conditionals
    const conditionals = (cleanCode.match(/\b(if|else|switch|case|\?)\b/g) || []).length;

    // Recursion detection
    const funcNames = cleanCode.match(/function\s+(\w+)/g) || [];
    const arrowFuncs = cleanCode.match(/(?:const|let|var)\s+(\w+)\s*=\s*(?:\(|[a-zA-Z])/g) || [];
    const hasRecursion = funcNames.some(fn => {
      const name = fn.replace("function ", "");
      const bodyRegex = new RegExp(`function\\s+${name}[\\s\\S]*?${name}\\s*\\(`);
      return bodyRegex.test(cleanCode);
    });

    // Data structure usage
    const usesMap = /\bnew\s+Map\b|Map\(|\bdict\b|\bdictionary\b|{}/i.test(cleanCode);
    const usesSet = /\bnew\s+Set\b|Set\(/i.test(cleanCode);
    const usesArray = /\[\]|\bnew\s+Array\b|\.push\(|\.pop\(|\.slice\(/i.test(cleanCode);
    const usesSort = /\.sort\(|sorted\(/i.test(cleanCode);

    // Estimate time complexity
    let timeComplexity, spaceComplexity;
    if (nestedLoops >= 3) { timeComplexity = "O(n³)"; }
    else if (nestedLoops >= 2) { timeComplexity = "O(n²)"; }
    else if (hasRecursion && nestedLoops >= 1) { timeComplexity = "O(2^n)"; }
    else if (hasRecursion) { timeComplexity = "O(n log n)"; }
    else if (usesSort) { timeComplexity = "O(n log n)"; }
    else if (forLoops >= 1) { timeComplexity = "O(n)"; }
    else { timeComplexity = "O(1)"; }

    // Space complexity
    if (hasRecursion) { spaceComplexity = "O(n)"; }
    else if (usesMap || usesSet || usesArray) { spaceComplexity = "O(n)"; }
    else { spaceComplexity = "O(1)"; }

    // Cyclomatic complexity (simplified)
    const cyclomaticComplexity = 1 + conditionals + forLoops;

    // Code quality score (0-100)
    const linesOfCode = lines.filter(l => l.trim().length > 0).length;
    const commentLines = (code.match(/\/\/.*$|#.*$/gm) || []).length;
    const commentRatio = linesOfCode > 0 ? commentLines / linesOfCode : 0;
    
    let qualityScore = 100;
    if (cyclomaticComplexity > 10) qualityScore -= 20;
    else if (cyclomaticComplexity > 5) qualityScore -= 10;
    if (maxDepth > 4) qualityScore -= 15;
    if (linesOfCode > 50) qualityScore -= 10;
    if (commentRatio < 0.05 && linesOfCode > 10) qualityScore -= 10;
    if (nestedLoops >= 2) qualityScore -= 15;
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    const result = {
      timeComplexity,
      spaceComplexity,
      cyclomaticComplexity,
      maxNestingDepth: maxDepth,
      linesOfCode,
      forLoops,
      nestedLoops,
      conditionals,
      hasRecursion,
      usesMap, usesSet, usesSort,
      qualityScore,
      commentRatio: Math.round(commentRatio * 100),
      suggestions: this._getSuggestions({ timeComplexity, nestedLoops, maxDepth, cyclomaticComplexity, commentRatio, linesOfCode }),
    };

    // Store in cache (limited size to avoid memory leaks)
    if (_analysisCache.size > 50) _analysisCache.clear();
    _analysisCache.set(cacheKey, result);

    return result;
  },


  _countNestedLoops(code) {
    let maxNested = 0, current = 0;
    const lines = code.split("\n");
    for (const line of lines) {
      if (/\b(for|while)\b/.test(line)) { current++; maxNested = Math.max(maxNested, current); }
      if (/^\s*\}/.test(line)) current = Math.max(0, current - 1);
    }
    return maxNested;
  },

  _getSuggestions({ timeComplexity, nestedLoops, maxDepth, cyclomaticComplexity, commentRatio, linesOfCode }) {
    const suggestions = [];
    if (nestedLoops >= 2) suggestions.push("Consider using a HashMap to reduce nested loop complexity");
    if (maxDepth > 4) suggestions.push("High nesting depth — consider extracting helper functions");
    if (cyclomaticComplexity > 10) suggestions.push("High cyclomatic complexity — break into smaller functions");
    if (commentRatio < 0.05 && linesOfCode > 10) suggestions.push("Add comments to explain your approach");
    if (timeComplexity === "O(n²)" || timeComplexity === "O(n³)") suggestions.push("Polynomial time — look for sorting or hash-based optimizations");
    if (suggestions.length === 0) suggestions.push("Code looks clean and efficient! 🎉");
    return suggestions;
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 3: Adaptive Difficulty Engine (Multi-Armed Bandit)
// ═══════════════════════════════════════════════════════════════
export const AdaptiveDifficulty = {
  /** Get optimal difficulty using Upper Confidence Bound (UCB1) */
  getRecommendedDifficulty() {
    const history = getLS("difficultyHistory", []);
    if (history.length < 3) return "Easy";

    const difficulties = ["Easy", "Medium", "Hard"];
    const stats = {};
    difficulties.forEach(d => {
      const entries = history.filter(h => h.difficulty === d);
      stats[d] = {
        attempts: entries.length,
        successes: entries.filter(h => h.solved).length,
        avgTime: entries.length ? entries.reduce((a, h) => a + (h.timeSeconds || 300), 0) / entries.length : 300,
      };
    });

    // UCB1 scoring — balance exploration with exploitation
    const totalAttempts = history.length;
    let bestDiff = "Easy", bestScore = -Infinity;

    difficulties.forEach(d => {
      const s = stats[d];
      if (s.attempts === 0) { bestDiff = d; bestScore = Infinity; return; }
      
      const successRate = s.successes / s.attempts;
      // Optimal learning happens around 70-85% success rate (zone of proximal development)
      const zpd = 1 - Math.abs(successRate - 0.75) * 2;
      const exploration = Math.sqrt(2 * Math.log(totalAttempts) / s.attempts);
      const score = zpd + exploration * 0.5;
      
      if (score > bestScore) { bestScore = score; bestDiff = d; }
    });

    return bestDiff;
  },

  /** Record an attempt result */
  recordAttempt(problemId, difficulty, solved, timeSeconds) {
    const history = getLS("difficultyHistory", []);
    history.push({ problemId, difficulty, solved, timeSeconds, timestamp: Date.now() });
    // Keep last 100 entries
    if (history.length > 100) history.splice(0, history.length - 100);
    setLS("difficultyHistory", history);
  },

  /** Get success rates per difficulty */
  getSuccessRates() {
    const history = getLS("difficultyHistory", []);
    const rates = {};
    ["Easy", "Medium", "Hard"].forEach(d => {
      const entries = history.filter(h => h.difficulty === d);
      rates[d] = {
        attempts: entries.length,
        successRate: entries.length ? Math.round((entries.filter(h => h.solved).length / entries.length) * 100) : 0,
        avgTimeMin: entries.length ? Math.round(entries.reduce((a, h) => a + (h.timeSeconds || 0), 0) / entries.length / 60) : 0,
      };
    });
    return rates;
  },

  /** Get the learning zone label */
  getLearningZone() {
    const rates = this.getSuccessRates();
    const rec = this.getRecommendedDifficulty();
    const rate = rates[rec]?.successRate || 0;
    if (rate > 90) return { zone: "Comfort Zone", emoji: "😴", tip: "Time to challenge yourself!" };
    if (rate >= 65) return { zone: "Learning Zone", emoji: "🧠", tip: "Perfect balance! Keep going." };
    if (rate >= 40) return { zone: "Stretch Zone", emoji: "💪", tip: "Challenging but achievable." };
    return { zone: "Panic Zone", emoji: "😰", tip: "Try an easier difficulty first." };
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 4: Performance Prediction (Linear Regression)
// ═══════════════════════════════════════════════════════════════
export const PerformancePredictor = {
  /** Simple linear regression on features */
  predict(problemId) {
    const history = getLS("difficultyHistory", []);
    const solved = getLS("solvedProblems", []);
    const problem = PROBLEMS[problemId];
    if (!problem || history.length < 5) return null;

    // Feature encoding
    const diffScore = { Easy: 1, Medium: 2, Hard: 3 }[problem.difficulty] || 2;
    const categorySolved = solved.filter(id => PROBLEMS[id]?.category === problem.category).length;
    const totalSolved = solved.length;
    const streakDays = parseInt(localStorage.getItem("currentStreak") || "0");

    // Get historical success rates for this difficulty
    const sameDiff = history.filter(h => h.difficulty === problem.difficulty);
    const sameDiffRate = sameDiff.length ? sameDiff.filter(h => h.solved).length / sameDiff.length : 0.5;

    // Weighted prediction using learned "weights"
    const weights = { diffScore: -15, categorySolved: 5, totalSolved: 0.5, streak: 2, baseDiffRate: 40 };
    let prediction = 50 // base
      + weights.diffScore * (diffScore - 1)
      + weights.categorySolved * Math.min(categorySolved, 5)
      + weights.totalSolved * Math.min(totalSolved, 20)
      + weights.streak * Math.min(streakDays, 10)
      + weights.baseDiffRate * (sameDiffRate - 0.5);

    prediction = Math.max(5, Math.min(98, Math.round(prediction)));

    // Estimated time
    const avgTime = sameDiff.length
      ? Math.round(sameDiff.reduce((a, h) => a + (h.timeSeconds || 300), 0) / sameDiff.length / 60)
      : diffScore * 10;

    return {
      successProbability: prediction,
      estimatedTimeMin: avgTime,
      confidence: Math.min(95, Math.round(50 + history.length * 2)),
      factors: {
        difficulty: diffScore,
        categoryExperience: categorySolved,
        overallExperience: totalSolved,
        streak: streakDays,
        historicalRate: Math.round(sameDiffRate * 100),
      },
    };
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 5: Stuck Detection (Typing Pattern Analysis)
// ═══════════════════════════════════════════════════════════════
export const StuckDetector = {
  _buffer: [],
  _deleteCount: 0,
  _lastTypeTime: Date.now(),
  _stuckCallbacks: [],

  /** Record a keystroke event */
  recordKeystroke(eventType = "type") {
    const now = Date.now();
    const gap = now - this._lastTypeTime;
    this._buffer.push({ time: now, gap, type: eventType });
    this._lastTypeTime = now;

    if (eventType === "delete") this._deleteCount++;
    
    // Keep last 100 events
    if (this._buffer.length > 100) this._buffer.shift();
  },

  /** Analyze if user is stuck */
  analyze() {
    if (this._buffer.length < 10) return { isStuck: false, confidence: 0, reason: null };

    const recent = this._buffer.slice(-20);
    const avgGap = recent.reduce((a, e) => a + e.gap, 0) / recent.length;
    const longPauses = recent.filter(e => e.gap > 15000).length; // >15s pauses
    const deleteRatio = recent.filter(e => e.type === "delete").length / recent.length;

    let stuckScore = 0;
    let reason = null;

    if (avgGap > 10000) { stuckScore += 30; reason = "Long pauses between keystrokes"; }
    if (longPauses >= 3) { stuckScore += 25; reason = reason || "Multiple extended pauses detected"; }
    if (deleteRatio > 0.4) { stuckScore += 25; reason = reason || "Lots of deleting — rethinking approach?"; }

    // Check if no typing for a while
    const timeSinceLastType = Date.now() - this._lastTypeTime;
    if (timeSinceLastType > 30000) { stuckScore += 30; reason = reason || "No activity for 30+ seconds"; }
    if (timeSinceLastType > 60000) { stuckScore += 20; reason = reason || "No activity for 60+ seconds"; }

    return {
      isStuck: stuckScore >= 40,
      confidence: Math.min(100, stuckScore),
      reason,
      avgGapMs: Math.round(avgGap),
      deleteRatio: Math.round(deleteRatio * 100),
      timeSinceLastType: Math.round(timeSinceLastType / 1000),
    };
  },

  /** Reset the buffer (e.g., on problem change) */
  reset() {
    this._buffer = [];
    this._deleteCount = 0;
    this._lastTypeTime = Date.now();
  },

  onStuck(callback) {
    this._stuckCallbacks.push(callback);
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 6: Weakness Heatmap (Category Clustering)
// ═══════════════════════════════════════════════════════════════
export const WeaknessAnalyzer = {
  /** Analyze weaknesses across all categories */
  analyze() {
    const allProblems = Object.values(PROBLEMS);
    const solved = getLS("solvedProblems", []);
    const submissions = getLS("pastSubmissions", []);
    const history = getLS("difficultyHistory", []);

    // Extract unique categories
    const categories = [...new Set(allProblems.map(p => p.category))];

    const analysis = categories.map(cat => {
      const catProblems = allProblems.filter(p => p.category === cat);
      const catSolved = catProblems.filter(p => solved.includes(p.id));
      const catSubmissions = submissions.filter(s => catProblems.some(p => p.id === s.problemId));
      const catHistory = history.filter(h => catProblems.some(p => p.id === h.problemId));

      const totalAttempts = catSubmissions.length;
      const successfulAttempts = catSubmissions.filter(s => s.status === "Accepted").length;
      const failedAttempts = totalAttempts - successfulAttempts;
      const successRate = totalAttempts > 0 ? Math.round((successfulAttempts / totalAttempts) * 100) : null;

      const avgTime = catHistory.length
        ? Math.round(catHistory.reduce((a, h) => a + (h.timeSeconds || 0), 0) / catHistory.length / 60)
        : null;

      // Weakness score: lower = weaker (0-100)
      let strengthScore = 50; // neutral if no data
      if (totalAttempts > 0) {
        strengthScore = successRate * 0.6 + (catSolved.length / Math.max(catProblems.length, 1)) * 40;
      }
      strengthScore = Math.round(Math.min(100, strengthScore));

      return {
        category: cat,
        totalProblems: catProblems.length,
        solved: catSolved.length,
        attempts: totalAttempts,
        successRate,
        failedAttempts,
        avgTimeMin: avgTime,
        strengthScore,
        isWeak: strengthScore < 40,
        isStrong: strengthScore >= 70,
        difficulty: {
          easy: catProblems.filter(p => p.difficulty === "Easy").length,
          medium: catProblems.filter(p => p.difficulty === "Medium").length,
          hard: catProblems.filter(p => p.difficulty === "Hard").length,
        },
      };
    });

    // Sort by weakness (weakest first)
    analysis.sort((a, b) => a.strengthScore - b.strengthScore);

    return {
      categories: analysis,
      weakestAreas: analysis.filter(a => a.isWeak),
      strongestAreas: analysis.filter(a => a.isStrong),
      overallStrength: analysis.length ? Math.round(analysis.reduce((a, c) => a + c.strengthScore, 0) / analysis.length) : 50,
    };
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 7: Optimal Study Time Detector
// ═══════════════════════════════════════════════════════════════
export const StudyTimeAnalyzer = {
  /** Record a study session */
  recordSession(startTime = Date.now()) {
    const sessions = getLS("studySessions", []);
    const hour = new Date(startTime).getHours();
    const dayOfWeek = new Date(startTime).getDay();
    const solved = getLS("solvedProblems", []);
    
    sessions.push({
      timestamp: startTime,
      hour,
      dayOfWeek,
      solvedCount: solved.length,
    });

    // Keep last 200 entries
    if (sessions.length > 200) sessions.splice(0, sessions.length - 200);
    setLS("studySessions", sessions);
  },

  /** Analyze which hours and days yield best performance */
  analyze() {
    const submissions = getLS("pastSubmissions", []);
    if (submissions.length < 5) return null;

    // Hourly performance
    const hourlyData = Array.from({ length: 24 }, (_, h) => ({
      hour: h,
      total: 0,
      accepted: 0,
      label: `${h % 12 || 12}${h < 12 ? "AM" : "PM"}`,
    }));

    submissions.forEach(s => {
      const hour = new Date(s.timestamp).getHours();
      hourlyData[hour].total++;
      if (s.status === "Accepted") hourlyData[hour].accepted++;
    });

    // Day of week performance
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dailyData = Array.from({ length: 7 }, (_, d) => ({
      day: d,
      name: dayNames[d],
      total: 0,
      accepted: 0,
    }));

    submissions.forEach(s => {
      const day = new Date(s.timestamp).getDay();
      dailyData[day].total++;
      if (s.status === "Accepted") dailyData[day].accepted++;
    });

    // Find peak hours (top 3 with enough data)
    const peakHours = hourlyData
      .filter(h => h.total >= 2)
      .map(h => ({ ...h, successRate: Math.round((h.accepted / h.total) * 100) }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3);

    // Find best days
    const peakDays = dailyData
      .filter(d => d.total >= 2)
      .map(d => ({ ...d, successRate: Math.round((d.accepted / d.total) * 100) }))
      .sort((a, b) => b.successRate - a.successRate)
      .slice(0, 3);

    // Classify user pattern
    const morningActivity = hourlyData.slice(6, 12).reduce((a, h) => a + h.total, 0);
    const afternoonActivity = hourlyData.slice(12, 18).reduce((a, h) => a + h.total, 0);
    const eveningActivity = hourlyData.slice(18, 24).reduce((a, h) => a + h.total, 0);
    const nightActivity = hourlyData.slice(0, 6).reduce((a, h) => a + h.total, 0);

    let chronotype;
    const maxPeriod = Math.max(morningActivity, afternoonActivity, eveningActivity, nightActivity);
    if (maxPeriod === morningActivity) chronotype = { type: "Early Bird 🌅", desc: "You perform best in the morning" };
    else if (maxPeriod === afternoonActivity) chronotype = { type: "Afternoon Warrior ☀️", desc: "Peak focus in the afternoon" };
    else if (maxPeriod === eveningActivity) chronotype = { type: "Night Owl 🦉", desc: "You thrive in the evening" };
    else chronotype = { type: "Night Coder 🌙", desc: "Late night coding sessions" };

    return {
      hourlyData: hourlyData.map(h => ({ ...h, successRate: h.total > 0 ? Math.round((h.accepted / h.total) * 100) : 0 })),
      dailyData: dailyData.map(d => ({ ...d, successRate: d.total > 0 ? Math.round((d.accepted / d.total) * 100) : 0 })),
      peakHours,
      peakDays,
      chronotype,
      totalSessions: submissions.length,
    };
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 8: Solution Similarity Scorer (TF-IDF / Jaccard)
// ═══════════════════════════════════════════════════════════════
export const SimilarityScorer = {
  /** Tokenize code into meaningful tokens */
  _tokenize(code) {
    return code
      .replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/#.*$/gm, "")
      .replace(/[{}()\[\];,.:'"]/g, " ")
      .toLowerCase()
      .split(/\s+/)
      .filter(t => t.length > 1 && !/^\d+$/.test(t));
  },

  /** Jaccard similarity between two token sets */
  _jaccard(a, b) {
    const setA = new Set(a);
    const setB = new Set(b);
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    return union.size > 0 ? intersection.size / union.size : 0;
  },

  /** Compare user code against known patterns */
  score(userCode, optimalPatterns = []) {
    const userTokens = this._tokenize(userCode);
    if (userTokens.length < 3) return null;

    // Common optimal patterns to compare against
    const patterns = {
      "hash_map": ["map", "set", "hash", "object", "dict", "get", "has", "key", "value"],
      "two_pointer": ["left", "right", "while", "start", "end", "pointer", "low", "high"],
      "sliding_window": ["window", "left", "right", "while", "max", "min", "length", "substring"],
      "binary_search": ["mid", "left", "right", "while", "floor", "binary", "search", "low", "high"],
      "dfs": ["dfs", "visited", "stack", "recursive", "depth", "node", "children"],
      "bfs": ["bfs", "queue", "visited", "level", "breadth", "shift", "push"],
      "dynamic_programming": ["dp", "memo", "cache", "table", "bottom", "top", "previous", "state"],
      "greedy": ["sort", "greedy", "max", "min", "current", "best", "optimal"],
      "backtracking": ["backtrack", "path", "choices", "undo", "restore", "valid"],
      "divide_conquer": ["merge", "divide", "conquer", "left", "right", "mid", "combine"],
    };

    // Detect which patterns the user is using
    const detectedPatterns = [];
    let bestMatch = { pattern: "unknown", similarity: 0 };

    Object.entries(patterns).forEach(([name, keywords]) => {
      const similarity = this._jaccard(userTokens, keywords);
      if (similarity > 0.1) {
        detectedPatterns.push({ pattern: name.replace(/_/g, " "), similarity: Math.round(similarity * 100) });
      }
      if (similarity > bestMatch.similarity) {
        bestMatch = { pattern: name.replace(/_/g, " "), similarity: Math.round(similarity * 100) };
      }
    });

    detectedPatterns.sort((a, b) => b.similarity - a.similarity);

    // Code structure metrics
    const uniqueTokens = new Set(userTokens).size;
    const tokenDiversity = Math.round((uniqueTokens / userTokens.length) * 100);

    return {
      detectedPatterns: detectedPatterns.slice(0, 3),
      bestMatch,
      tokenCount: userTokens.length,
      uniqueTokens,
      tokenDiversity,
    };
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 9: Burnout Predictor (Moving Averages + Anomaly)
// ═══════════════════════════════════════════════════════════════
export const BurnoutPredictor = {
  /** Analyze performance trends for burnout detection */
  analyze() {
    const submissions = getLS("pastSubmissions", []);
    if (submissions.length < 10) return null;

    // Group by day
    const dailyMap = {};
    submissions.forEach(s => {
      const day = new Date(s.timestamp).toDateString();
      if (!dailyMap[day]) dailyMap[day] = { total: 0, accepted: 0, date: s.timestamp };
      dailyMap[day].total++;
      if (s.status === "Accepted") dailyMap[day].accepted++;
    });

    const days = Object.values(dailyMap).sort((a, b) => a.date - b.date);
    const successRates = days.map(d => d.total > 0 ? d.accepted / d.total : 0);

    // Calculate 3-day and 7-day  moving averages
    const ma3 = this._movingAverage(successRates, 3);
    const ma7 = this._movingAverage(successRates, 7);

    // Detect declining trend
    let trend = "stable";
    if (ma3.length >= 3) {
      const recentSlope = ma3[ma3.length - 1] - ma3[ma3.length - 3];
      if (recentSlope < -0.15) trend = "declining";
      else if (recentSlope > 0.15) trend = "improving";
    }

    // Activity level analysis
    const recentDays = days.slice(-7);
    const avgDailySessions = recentDays.reduce((a, d) => a + d.total, 0) / Math.max(recentDays.length, 1);
    const olderDays = days.slice(-14, -7);
    const oldAvgSessions = olderDays.reduce((a, d) => a + d.total, 0) / Math.max(olderDays.length, 1);
    
    const activityChange = oldAvgSessions > 0 ? Math.round(((avgDailySessions - oldAvgSessions) / oldAvgSessions) * 100) : 0;

    // Burnout score (0-100, higher = more burnout risk)
    let burnoutScore = 0;
    if (trend === "declining") burnoutScore += 30;
    if (activityChange < -30) burnoutScore += 20;
    if (avgDailySessions > 15) burnoutScore += 25; // overwork
    if (ma3.length > 0 && ma3[ma3.length - 1] < 0.3) burnoutScore += 15;
    const recentRate = recentDays.length ? recentDays.reduce((a, d) => a + d.accepted, 0) / recentDays.reduce((a, d) => a + d.total, 0) : 0.5;
    if (recentRate < 0.3) burnoutScore += 10;

    burnoutScore = Math.min(100, burnoutScore);

    let status, suggestion;
    if (burnoutScore >= 60) {
      status = { level: "High Risk", emoji: "🔴", color: "text-error" };
      suggestion = "Take a break! Go for a walk, rest for a day. You'll come back stronger. 🧘";
    } else if (burnoutScore >= 35) {
      status = { level: "Moderate", emoji: "🟡", color: "text-warning" };
      suggestion = "Mix things up — try a different problem category or do a fun coding challenge. 🎮";
    } else {
      status = { level: "Low", emoji: "🟢", color: "text-success" };
      suggestion = "You're doing great! Keep up the steady pace. 🚀";
    }

    return {
      burnoutScore,
      status,
      suggestion,
      trend,
      activityChange,
      avgDailySessions: Math.round(avgDailySessions * 10) / 10,
      recentSuccessRate: Math.round(recentRate * 100),
      ma3: ma3.map(v => Math.round(v * 100)),
      ma7: ma7.map(v => Math.round(v * 100)),
      daysTracked: days.length,
    };
  },

  _movingAverage(data, window) {
    if (data.length < window) return data;
    const result = [];
    for (let i = window - 1; i < data.length; i++) {
      const avg = data.slice(i - window + 1, i + 1).reduce((a, v) => a + v, 0) / window;
      result.push(avg);
    }
    return result;
  },
};


// ═══════════════════════════════════════════════════════════════
// FEATURE 10: Smart Problem Tags (Pattern Recognition)
// ═══════════════════════════════════════════════════════════════
export const SmartTagger = {
  /** Auto-detect algorithmic patterns in user's code */
  detectPatterns(code) {
    const patterns = [];
    const cleanCode = code.toLowerCase().replace(/\/\/.*$/gm, "").replace(/#.*$/gm, "");

    const detections = [
      { name: "Two Pointers", keywords: ["left", "right", "while.*left.*right", "start.*end"], icon: "👆👆", confidence: 0 },
      { name: "Sliding Window", keywords: ["window", "left.*right", "maxlen", "substring", "while.*left"], icon: "🪟", confidence: 0 },
      { name: "Binary Search", keywords: ["mid", "math.floor.*2", "left.*right", "low.*high", "binary"], icon: "🔍", confidence: 0 },
      { name: "BFS", keywords: ["queue", "bfs", "shift", "push", "level", "breadth"], icon: "🌊", confidence: 0 },
      { name: "DFS", keywords: ["dfs", "stack", "recursive", "visited", "depth"], icon: "🏔️", confidence: 0 },
      { name: "Dynamic Programming", keywords: ["dp\\[", "dp =", "memo", "tabulation", "bottom.up", "cache"], icon: "📊", confidence: 0 },
      { name: "Greedy", keywords: ["sort\\(", "sorted\\(", "greedy", "Math\\.max", "Math\\.min", "optimal"], icon: "🤑", confidence: 0 },
      { name: "Hash Map", keywords: ["map\\(", "new map", "new set", "has\\(", "get\\(", "dict", "{}"], icon: "🗺️", confidence: 0 },
      { name: "Recursion", keywords: ["function.*\\(.*\\).*{[\\s\\S]*?\\1\\(", "return.*\\(", "base case", "recursive"], icon: "🔄", confidence: 0 },
      { name: "Stack", keywords: ["stack", "push", "pop", "peek", "lifo"], icon: "📚", confidence: 0 },
      { name: "Backtracking", keywords: ["backtrack", "path", "choices", "undo", "restore"], icon: "↩️", confidence: 0 },
      { name: "Bit Manipulation", keywords: [">>", "<<", "\\^", "\\&", "\\|", "xor", "bit"], icon: "🔢", confidence: 0 },
    ];

    detections.forEach(d => {
      let matches = 0;
      d.keywords.forEach(kw => {
        try {
          if (new RegExp(kw, "i").test(cleanCode)) matches++;
        } catch { /* skip bad regex */ }
      });
      d.confidence = Math.round((matches / d.keywords.length) * 100);
      if (d.confidence >= 30) patterns.push(d);
    });

    patterns.sort((a, b) => b.confidence - a.confidence);
    return patterns.slice(0, 4);
  },

  /** Get pattern statistics for a user */
  getPatternStats() {
    const submissions = getLS("pastSubmissions", []);
    const patternCounts = {};

    submissions.forEach(s => {
      if (s.code) {
        const detected = this.detectPatterns(s.code);
        detected.forEach(p => {
          if (!patternCounts[p.name]) patternCounts[p.name] = { count: 0, icon: p.icon };
          patternCounts[p.name].count++;
        });
      }
    });

    return Object.entries(patternCounts)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count);
  },
};
