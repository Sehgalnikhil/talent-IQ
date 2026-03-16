import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    BrainCircuitIcon,
    CodeIcon,
    ZapIcon,
    AlertTriangleIcon,
    CheckCircleIcon,
    InfoIcon,
    BarChart2Icon,
    ClockIcon,
    LayersIcon,
    Loader2Icon,
    ChevronDownIcon,
    ChevronUpIcon,
} from "lucide-react";
import Navbar from "../components/Navbar";

// ─── Local ML Engine ──────────────────────────────────────────────────────────

/**
 * Count how many times a regex pattern matches in a string (case-insensitive).
 */
function countMatches(code, pattern) {
    return (code.match(pattern) || []).length;
}

/**
 * Detect the most-likely Big-O time complexity by inspecting control-flow
 * patterns.  This is a rule-based classifier — no external API required.
 *
 * Rules (applied in priority order):
 *  1. Triple-nested loops            → O(n³)
 *  2. Divide-and-conquer recursion   → O(n log n)
 *  3. Nested loops or quadratic recursion → O(n²)
 *  4. Binary-search / halving pattern → O(log n)
 *  5. Linear recursion / single loop  → O(n)
 *  6. No loops, no recursion          → O(1)
 */
function detectTimeComplexity(code) {
    const lines = code.split("\n");

    // ── Measure loop nesting depth ──────────────────────────────────────────
    const loopRe = /\b(for|while|do)\b/;
    let maxNesting = 0;
    let depth = 0;
    for (const line of lines) {
        if (loopRe.test(line)) depth += 1;
        maxNesting = Math.max(maxNesting, depth);
        // Naive heuristic: a closing brace that follows a loop body decreases depth
        const closings = (line.match(/\}/g) || []).length;
        const openings = (line.match(/\{/g) || []).length;
        if (closings > openings) depth = Math.max(0, depth - (closings - openings));
    }

    // ── Feature extraction ──────────────────────────────────────────────────
    const hasMergeSort = /merge.?sort|sort.*merge/i.test(code);
    const hasQuickSort = /quick.?sort|sort.*quick/i.test(code);
    const hasSortCall = /\.(sort|sorted)\s*\(/.test(code);
    const hasDivideConquer =
        hasMergeSort ||
        hasQuickSort ||
        /divide.*conquer|conquer.*divide/i.test(code);

    const hasRecursion = /function\s+(\w+)[^{]*\{[\s\S]*?\b\1\s*\(/.test(code);

    const hasBinarySearch =
        /binary.?search|bsearch/i.test(code) ||
        /mid\s*=\s*(lo|low|left|start|l)\s*\+.*\/\s*2/.test(code) ||
        /\b(lo|low|left|start)\s*=\s*mid/.test(code) ||
        /\b(hi|high|right|end)\s*=\s*mid/.test(code);

    const hasLog =
        /Math\.log|log2|log10|\blog\s*\(/.test(code);

    // ── Classifier ──────────────────────────────────────────────────────────
    if (maxNesting >= 3) {
        return {
            label: "O(n³)",
            color: "text-error",
            badge: "badge-error",
            explanation:
                "Three or more nested loops detected — cubic time complexity.  Consider restructuring with memoization or a better data structure.",
        };
    }

    if (hasDivideConquer || (hasSortCall && !hasBinarySearch)) {
        return {
            label: "O(n log n)",
            color: "text-warning",
            badge: "badge-warning",
            explanation:
                "Divide-and-conquer pattern or sort call detected — typical of efficient sorting algorithms like Merge Sort / Quick Sort.",
        };
    }

    if (maxNesting >= 2) {
        return {
            label: "O(n²)",
            color: "text-warning",
            badge: "badge-warning",
            explanation:
                "Nested loops detected — quadratic time complexity.  Look for opportunities to use hash maps or sorting to reduce to O(n log n).",
        };
    }

    if (hasBinarySearch || (hasLog && !hasRecursion)) {
        return {
            label: "O(log n)",
            color: "text-success",
            badge: "badge-success",
            explanation:
                "Binary search or halving pattern detected — logarithmic time complexity.  Excellent!",
        };
    }

    if (
        maxNesting === 1 ||
        hasRecursion ||
        /\.map\s*\(|\.filter\s*\(|\.reduce\s*\(|\.forEach\s*\(/.test(code)
    ) {
        return {
            label: "O(n)",
            color: "text-info",
            badge: "badge-info",
            explanation:
                "Single loop or linear traversal detected — linear time complexity.  This is usually acceptable.",
        };
    }

    return {
        label: "O(1)",
        color: "text-success",
        badge: "badge-success",
        explanation:
            "No loops or recursion detected — constant time complexity.  Excellent!",
    };
}

/**
 * Detect space complexity based on data structure allocation patterns.
 */
function detectSpaceComplexity(code) {
    const hasMatrix =
        /\[\s*\[/.test(code) ||
        /Array\.from.*Array\.from/.test(code) ||
        /new Array.*\n.*new Array/.test(code);

    if (hasMatrix) {
        return {
            label: "O(n²)",
            badge: "badge-warning",
            explanation: "2-D array / matrix allocation detected — quadratic extra space.",
        };
    }

    const hasLinearAlloc =
        /new (Array|Map|Set|WeakMap|WeakSet|Object)\s*\(/.test(code) ||
        /\[\s*\]/.test(code) ||
        /\{\s*\}/.test(code) ||
        /\.push\s*\(|\.append\s*\(|\.add\s*\(/.test(code);

    const hasRecursion = /\breturn\b[^;]*\b\w+\s*\(/.test(code);

    if (hasLinearAlloc || hasRecursion) {
        return {
            label: "O(n)",
            badge: "badge-info",
            explanation:
                "Dynamic data structure or recursive call stack detected — linear extra space.",
        };
    }

    return {
        label: "O(1)",
        badge: "badge-success",
        explanation: "No dynamic allocation detected — constant extra space.",
    };
}

/**
 * Compute cyclomatic complexity (McCabe).
 * Starts at 1 and adds 1 for every branching keyword / operator.
 */
function computeCyclomaticComplexity(code) {
    const patterns = [
        /\bif\b/g,
        /\belse\s+if\b/g,
        /\belse\b/g,
        /\bfor\b/g,
        /\bwhile\b/g,
        /\bdo\b/g,
        /\bcase\b/g,
        /\bcatch\b/g,
        /\b\?\s/g,       // ternary
        /&&/g,
        /\|\|/g,
    ];

    let score = 1;
    for (const p of patterns) score += countMatches(code, p);
    return score;
}

/**
 * Detect code smells and return an array of warning objects.
 */
function detectCodeSmells(code) {
    const lines = code.split("\n");
    const smells = [];

    // 1. Deep nesting
    let maxIndent = 0;
    for (const line of lines) {
        const indent = line.match(/^(\s*)/)?.[1]?.length ?? 0;
        maxIndent = Math.max(maxIndent, indent);
    }
    if (maxIndent >= 16) {
        // ~4 levels of 4-space indent
        smells.push({
            severity: "error",
            title: "Deep Nesting",
            detail:
                "Code is nested more than 4 levels deep.  Consider extracting helper functions to flatten the structure.",
        });
    }

    // 2. Long function
    const funcLines = lines.length;
    if (funcLines > 60) {
        smells.push({
            severity: "warning",
            title: "Long Function",
            detail: `Function body is ${funcLines} lines.  Functions longer than 60 lines are hard to read and test.  Break it into smaller, focused helpers.`,
        });
    }

    // 3. Magic numbers (exclude 0-9 and common benign values like powers of 2 and round numbers)
    const COMMON_NUMBERS = new Set([
        "4", "8", "16", "32", "64", "128", "256", "512", "1024",
        "10", "100", "1000", "24", "60", "360", "180",
    ]);
    const rawMagic = code.match(/(?<![.\d])\b\d{2,}\b(?!\s*[*/]?=)/g) || [];
    const magicNums = rawMagic.filter((n) => !COMMON_NUMBERS.has(n));
    if (magicNums.length > 2) {
        smells.push({
            severity: "warning",
            title: "Magic Numbers",
            detail: `Detected ${magicNums.length} hard-coded numeric literals (e.g. ${[...new Set(magicNums)].slice(0, 3).join(", ")}).  Replace with named constants for clarity.`,
        });
    }

    // 4. TODO / FIXME comments
    const todos = countMatches(code, /\b(TODO|FIXME|HACK|XXX)\b/gi);
    if (todos > 0) {
        smells.push({
            severity: "info",
            title: "Unresolved TODOs",
            detail: `Found ${todos} TODO/FIXME comment${todos > 1 ? "s" : ""}.  Address these before submitting.`,
        });
    }

    // 5. Very long lines
    const longLines = lines.filter((l) => l.length > 120);
    if (longLines.length > 3) {
        smells.push({
            severity: "info",
            title: "Long Lines",
            detail: `${longLines.length} lines exceed 120 characters.  Consider wrapping for readability.`,
        });
    }

    // 6. console.log left in
    const debugCalls = countMatches(code, /console\.(log|debug|warn|error)\s*\(/g);
    if (debugCalls > 0) {
        smells.push({
            severity: "info",
            title: "Debug Statements",
            detail: `${debugCalls} console.log / debug call${debugCalls > 1 ? "s" : ""} detected.  Remove before production / submission.`,
        });
    }

    // 7. Duplicate code blocks (naive: 3+ identical non-trivial lines)
    const lineFreq = {};
    for (const l of lines) {
        const trimmed = l.trim();
        if (trimmed.length > 10) lineFreq[trimmed] = (lineFreq[trimmed] || 0) + 1;
    }
    const dupLines = Object.values(lineFreq).filter((v) => v >= 3).length;
    if (dupLines > 0) {
        smells.push({
            severity: "warning",
            title: "Possible Duplication",
            detail: `${dupLines} line${dupLines > 1 ? "s" : ""} appear${dupLines === 1 ? "s" : ""} 3+ times.  DRY: extract repeated logic into a helper.`,
        });
    }

    return smells;
}

/**
 * Compute an overall Code Quality Score (0–100) using a weighted model.
 *
 * Weights:
 *   - Cyclomatic complexity penalty : −3 per point above 5
 *   - Code smells penalty           : −8 per error, −5 per warning, −2 per info
 *   - Time complexity bonus/penalty :
 *       O(1)/O(log n) → +10, O(n) → 0, O(n log n) → −5, O(n²) → −10, O(n³) → −20
 */
function computeQualityScore(cc, smells, timeComplexity) {
    let score = 100;

    // Cyclomatic complexity
    if (cc > 5) score -= (cc - 5) * 3;

    // Code smells
    for (const s of smells) {
        if (s.severity === "error") score -= 8;
        else if (s.severity === "warning") score -= 5;
        else score -= 2;
    }

    // Time complexity
    const tcPenalty = {
        "O(1)": 10,
        "O(log n)": 10,
        "O(n)": 0,
        "O(n log n)": -5,
        "O(n²)": -10,
        "O(n³)": -20,
    };
    score += tcPenalty[timeComplexity] ?? 0;

    return Math.max(0, Math.min(100, score));
}

/**
 * Detect the programming language based on syntax patterns.
 */
function detectLanguage(code) {
    if (/\bdef\s+\w+\s*\(|import\s+\w+|print\s*\(/.test(code)) return "Python";
    if (/\bfn\s+\w+|let\s+mut\s+|println!/.test(code)) return "Rust";
    if (/\bpublic\s+(static|class|void)\b|System\.out\.print/.test(code)) return "Java";
    if (/#include\s*<|std::|\bcout\b/.test(code)) return "C++";
    if (/\bfunc\s+\w+\s*\(|fmt\.Print/.test(code)) return "Go";
    if (/\bconst\b|\blet\b|\bvar\b|=>|===/.test(code)) return "JavaScript / TypeScript";
    return "Unknown";
}

/**
 * Master analysis function — calls all the individual classifiers.
 */
function analyzeCode(code) {
    const trimmed = code.trim();
    if (!trimmed) return null;

    const timeComplexity = detectTimeComplexity(trimmed);
    const spaceComplexity = detectSpaceComplexity(trimmed);
    const cc = computeCyclomaticComplexity(trimmed);
    const smells = detectCodeSmells(trimmed);
    const qualityScore = computeQualityScore(cc, smells, timeComplexity.label);
    const language = detectLanguage(trimmed);
    const loc = trimmed.split("\n").filter((l) => l.trim().length > 0).length;

    return {
        timeComplexity,
        spaceComplexity,
        cyclomaticComplexity: cc,
        smells,
        qualityScore,
        language,
        loc,
    };
}

// ─── Score helpers ────────────────────────────────────────────────────────────

function scoreColor(score) {
    if (score >= 80) return "text-success";
    if (score >= 55) return "text-warning";
    return "text-error";
}

function scoreBg(score) {
    if (score >= 80) return "bg-success/10 border-success/30";
    if (score >= 55) return "bg-warning/10 border-warning/30";
    return "bg-error/10 border-error/30";
}

function scoreLabel(score) {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 55) return "Fair";
    if (score >= 35) return "Poor";
    return "Critical";
}

function smellIcon(severity) {
    if (severity === "error") return <AlertTriangleIcon className="size-4 text-error shrink-0" />;
    if (severity === "warning") return <AlertTriangleIcon className="size-4 text-warning shrink-0" />;
    return <InfoIcon className="size-4 text-info shrink-0" />;
}

// ─── Sample snippets ──────────────────────────────────────────────────────────

const SAMPLES = [
    {
        label: "Bubble Sort (O(n²))",
        code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  return arr;
}`,
    },
    {
        label: "Binary Search (O(log n))",
        code: `function binarySearch(arr, target) {
  let low = 0;
  let high = arr.length - 1;
  while (low <= high) {
    const mid = low + Math.floor((high - low) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}`,
    },
    {
        label: "Merge Sort (O(n log n))",
        code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) result.push(left[i++]);
    else result.push(right[j++]);
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,
    },
    {
        label: "Two Sum — Hash Map (O(n))",
        code: `function twoSum(nums, target) {
  const seen = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (seen.has(complement)) {
      return [seen.get(complement), i];
    }
    seen.set(nums[i], i);
  }
  return [];
}`,
    },
];

// ─── Component ────────────────────────────────────────────────────────────────

function CodeAnalyzerPage() {
    const [code, setCode] = useState("");
    const [result, setResult] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [expandedSmells, setExpandedSmells] = useState(true);

    const handleAnalyze = useCallback(() => {
        if (!code.trim()) return;
        setAnalyzing(true);
        // Simulate a brief "thinking" pause for UX polish, then run locally
        setTimeout(() => {
            setResult(analyzeCode(code));
            setAnalyzing(false);
        }, 350);
    }, [code]);

    const loadSample = (sample) => {
        setCode(sample.code);
        setResult(null);
    };

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar />

            <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black flex items-center gap-3">
                            <BrainCircuitIcon className="size-8 text-primary" />
                            Code Complexity Analyzer
                        </h1>
                        <p className="text-base-content/60 mt-1 text-sm">
                            Local ML engine — detects Big-O complexity, cyclomatic complexity &amp; code
                            smells entirely in your browser.&nbsp;
                            <span className="badge badge-success badge-xs">No API key required</span>
                        </p>
                    </div>
                </div>

                {/* Sample Snippets */}
                <div>
                    <p className="text-xs font-semibold text-base-content/50 uppercase tracking-widest mb-2">
                        Try a sample
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {SAMPLES.map((s) => (
                            <button
                                key={s.label}
                                onClick={() => loadSample(s)}
                                className="btn btn-xs btn-outline"
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor + Run */}
                <div className="card bg-base-100 shadow-xl rounded-3xl overflow-hidden">
                    <div className="p-4 border-b border-base-300 flex items-center justify-between">
                        <span className="font-semibold flex items-center gap-2">
                            <CodeIcon className="size-4 text-primary" />
                            Paste your code
                        </span>
                        <button
                            onClick={handleAnalyze}
                            disabled={!code.trim() || analyzing}
                            className="btn btn-primary btn-sm gap-2"
                        >
                            {analyzing ? (
                                <>
                                    <Loader2Icon className="size-4 animate-spin" />
                                    Analyzing…
                                </>
                            ) : (
                                <>
                                    <ZapIcon className="size-4" />
                                    Analyze
                                </>
                            )}
                        </button>
                    </div>
                    <textarea
                        className="w-full bg-base-200/50 p-4 font-mono text-sm outline-none resize-none leading-relaxed"
                        rows={14}
                        placeholder={`// Paste any code here — JavaScript, Python, Java, C++, Go, Rust…\nfunction example(arr) {\n  for (let i = 0; i < arr.length; i++) {\n    for (let j = 0; j < arr.length; j++) {\n      console.log(arr[i], arr[j]);\n    }\n  }\n}`}
                        value={code}
                        onChange={(e) => {
                            setCode(e.target.value);
                            setResult(null);
                        }}
                        spellCheck={false}
                    />
                </div>

                {/* Results */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 16 }}
                            transition={{ duration: 0.25 }}
                            className="space-y-4"
                        >
                            {/* Quality Score Card */}
                            <div
                                className={`card border rounded-3xl p-6 ${scoreBg(result.qualityScore)}`}
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                            Overall Code Quality
                                        </p>
                                        <div className="flex items-end gap-3 mt-1">
                                            <span
                                                className={`text-6xl font-black tabular-nums ${scoreColor(
                                                    result.qualityScore
                                                )}`}
                                            >
                                                {result.qualityScore}
                                            </span>
                                            <span className="text-2xl text-base-content/40 mb-1">/100</span>
                                            <span
                                                className={`text-lg font-bold mb-1 ${scoreColor(
                                                    result.qualityScore
                                                )}`}
                                            >
                                                — {scoreLabel(result.qualityScore)}
                                            </span>
                                        </div>
                                        <div className="w-full bg-base-300 rounded-full h-2 mt-3 max-w-xs">
                                            <motion.div
                                                className={`h-2 rounded-full ${result.qualityScore >= 80
                                                    ? "bg-success"
                                                    : result.qualityScore >= 55
                                                        ? "bg-warning"
                                                        : "bg-error"
                                                    }`}
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: `${result.qualityScore}%`,
                                                }}
                                                transition={{ duration: 0.6, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right space-y-1">
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="text-xs text-base-content/50">Language</span>
                                            <span className="badge badge-outline badge-sm">
                                                {result.language}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 justify-end">
                                            <span className="text-xs text-base-content/50">Non-blank lines</span>
                                            <span className="badge badge-outline badge-sm">{result.loc}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Metric Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* Time Complexity */}
                                <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ClockIcon className="size-4 text-primary" />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                            Time Complexity
                                        </span>
                                    </div>
                                    <span
                                        className={`text-3xl font-black font-mono ${result.timeComplexity.color}`}
                                    >
                                        {result.timeComplexity.label}
                                    </span>
                                    <p className="text-xs text-base-content/50 mt-2 leading-relaxed">
                                        {result.timeComplexity.explanation}
                                    </p>
                                </div>

                                {/* Space Complexity */}
                                <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <LayersIcon className="size-4 text-secondary" />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                            Space Complexity
                                        </span>
                                    </div>
                                    <span
                                        className={`text-3xl font-black font-mono ${result.spaceComplexity.label === "O(1)"
                                            ? "text-success"
                                            : result.spaceComplexity.label === "O(n²)"
                                                ? "text-warning"
                                                : "text-info"
                                            }`}
                                    >
                                        {result.spaceComplexity.label}
                                    </span>
                                    <p className="text-xs text-base-content/50 mt-2 leading-relaxed">
                                        {result.spaceComplexity.explanation}
                                    </p>
                                </div>

                                {/* Cyclomatic Complexity */}
                                <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <BarChart2Icon className="size-4 text-accent" />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                            Cyclomatic
                                        </span>
                                    </div>
                                    <span
                                        className={`text-3xl font-black tabular-nums ${result.cyclomaticComplexity <= 5
                                            ? "text-success"
                                            : result.cyclomaticComplexity <= 10
                                                ? "text-warning"
                                                : "text-error"
                                            }`}
                                    >
                                        {result.cyclomaticComplexity}
                                    </span>
                                    <p className="text-xs text-base-content/50 mt-2 leading-relaxed">
                                        {result.cyclomaticComplexity <= 5
                                            ? "Low complexity — easy to test."
                                            : result.cyclomaticComplexity <= 10
                                                ? "Moderate — consider simplifying branches."
                                                : "High — function is hard to test and maintain."}
                                    </p>
                                </div>

                                {/* Code Smells count */}
                                <div className="card bg-base-100 border border-base-300 rounded-2xl p-4 hover:border-primary/30 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertTriangleIcon className="size-4 text-warning" />
                                        <span className="text-xs font-semibold uppercase tracking-widest text-base-content/50">
                                            Code Smells
                                        </span>
                                    </div>
                                    <span
                                        className={`text-3xl font-black tabular-nums ${result.smells.length === 0
                                            ? "text-success"
                                            : result.smells.some((s) => s.severity === "error")
                                                ? "text-error"
                                                : "text-warning"
                                            }`}
                                    >
                                        {result.smells.length}
                                    </span>
                                    <p className="text-xs text-base-content/50 mt-2 leading-relaxed">
                                        {result.smells.length === 0
                                            ? "No issues detected — clean code!"
                                            : `${result.smells.filter((s) => s.severity === "error").length} error · ${result.smells.filter((s) => s.severity === "warning").length} warning · ${result.smells.filter((s) => s.severity === "info").length} info`}
                                    </p>
                                </div>
                            </div>

                            {/* Code Smells Detail */}
                            {result.smells.length > 0 && (
                                <div className="card bg-base-100 border border-base-300 rounded-3xl overflow-hidden">
                                    <button
                                        className="flex items-center justify-between w-full px-6 py-4 hover:bg-base-200/50 transition-colors"
                                        onClick={() => setExpandedSmells((v) => !v)}
                                    >
                                        <span className="font-semibold flex items-center gap-2">
                                            <AlertTriangleIcon className="size-4 text-warning" />
                                            Detected Issues &amp; Suggestions
                                        </span>
                                        {expandedSmells ? (
                                            <ChevronUpIcon className="size-4 text-base-content/40" />
                                        ) : (
                                            <ChevronDownIcon className="size-4 text-base-content/40" />
                                        )}
                                    </button>

                                    <AnimatePresence initial={false}>
                                        {expandedSmells && (
                                            <motion.div
                                                key="smells"
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-6 pb-6 space-y-3">
                                                    {result.smells.map((smell, idx) => (
                                                        <div
                                                            key={idx}
                                                            className={`flex items-start gap-3 p-3 rounded-2xl border ${smell.severity === "error"
                                                                ? "bg-error/5 border-error/20"
                                                                : smell.severity === "warning"
                                                                    ? "bg-warning/5 border-warning/20"
                                                                    : "bg-info/5 border-info/20"
                                                                }`}
                                                        >
                                                            {smellIcon(smell.severity)}
                                                            <div>
                                                                <p className="text-sm font-bold">{smell.title}</p>
                                                                <p className="text-xs text-base-content/60 mt-0.5 leading-relaxed">
                                                                    {smell.detail}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {result.smells.length === 0 && (
                                <div className="flex items-center gap-3 p-4 bg-success/10 border border-success/20 rounded-2xl">
                                    <CheckCircleIcon className="size-5 text-success shrink-0" />
                                    <p className="text-sm font-semibold text-success">
                                        No code smells detected — great work!
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* How it works */}
                <details className="collapse collapse-arrow bg-base-100 rounded-3xl border border-base-300 shadow">
                    <summary className="collapse-title font-semibold text-sm flex items-center gap-2">
                        <InfoIcon className="size-4 text-primary" />
                        How the local ML engine works
                    </summary>
                    <div className="collapse-content text-sm text-base-content/70 leading-relaxed space-y-2 pt-2">
                        <p>
                            <strong>No API key, no server round-trip.</strong> All analysis runs instantly in
                            your browser using pure JavaScript.
                        </p>
                        <ul className="list-disc list-inside space-y-1 pl-2">
                            <li>
                                <strong>Big-O Time Complexity</strong> — a rule-based classifier inspects loop
                                nesting depth, recursion patterns, sorting calls, and binary-search idioms.
                            </li>
                            <li>
                                <strong>Space Complexity</strong> — detects dynamic allocations (arrays, maps,
                                sets) and matrix patterns.
                            </li>
                            <li>
                                <strong>Cyclomatic Complexity (McCabe)</strong> — counts every branching
                                keyword (<code>if / for / while / case / catch / && / || / ?</code>) to
                                measure code testability.
                            </li>
                            <li>
                                <strong>Code Smell Detector</strong> — flags deep nesting, long functions,
                                magic numbers, unresolved TODOs, debug statements, and duplicated lines.
                            </li>
                            <li>
                                <strong>Quality Score (0–100)</strong> — a weighted scoring model combines all
                                signals into a single actionable number.
                            </li>
                        </ul>
                    </div>
                </details>
            </div>
        </div>
    );
}

export default CodeAnalyzerPage;
