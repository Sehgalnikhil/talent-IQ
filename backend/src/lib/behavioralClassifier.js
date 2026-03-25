import fs from "fs";

// 1. DICTIONARIES & STOPWORDS
const STOPWORDS = new Set(["a", "an", "the", "and", "but", "if", "or", "because", "as", "what", "which", "this", "that", "these", "those", "then", "just", "so", "than", "such", "both", "through", "about", "for", "is", "of", "while", "during", "to", "was", "be", "with", "would", "at", "by", "on"]);

const STAR_DICTIONARY = {
    situation: new Set(["context", "situation", "background", "scenario", "challenge", "initially", "when", "problem", "environment", "issue", "faced", "occurred", "happened"]),
    task: new Set(["goal", "task", "objective", "plan", "role", "assigned", "responsible", "require", "needed", "expected", "deliverable", "target", "aim"]),
    action: new Set(["developed", "implemented", "created", "built", "designed", "wrote", "analyzed", "managed", "refactored", "optimized", "decided", "took", "led", "resolved", "coordinated", "executed", "initiated", "spearheaded", "drove"]),
    result: new Set(["increased", "decreased", "saved", "impact", "result", "revenue", "solved", "fixed", "led", "achieved", "delivered", "outcome", "improved", "reduced", "gained"])
};

const FILLER_WORDS = new Set(["basically", "literally", "actually", "like", "you know", "i mean", "sort of", "kind of", "stuff", "things"]);

const PASSIVE_INDICATORS = /\b(was|were|is|are|been|being)\s+([a-z]+ed)\b/gi;
const METRICS_REGEX = /(\d+%|\$?\d+(?:,\d{3})*(?:\.\d+)?(?:k|m|b)?\b|\b(percent|dollars|users|days|months|hours|seconds|minutes)\b)/gi;

const SITUATION_PATTERNS = [
  /during .* project/i,
  /in .* project/i,
  /while working/i,
  /at (college|company|internship)/i
];

// 2. HELPER FUNCTIONS

/**
 * Basic word stemmer (very lightweight heuristic)
 */
function stem(word) {
    word = word.toLowerCase().trim();
    if (word.endsWith('ing') && word.length > 5) return word.slice(0, -3);
    if (word.endsWith('ed') && word.length > 4) return word.slice(0, -2);
    if (word.endsWith('s') && !word.endsWith('ss') && word.length > 3) return word.slice(0, -1);
    return word;
}

/**
 * Tokenize, remove stopwords, and stem
 */
function tokenize(text) {
    const words = text.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/).filter(w => w.length > 0);
    const uniqueTokens = new Set();
    words.forEach(w => {
        if (!STOPWORDS.has(w)) {
            uniqueTokens.add(stem(w));
        }
    });
    return Array.from(uniqueTokens);
}

/**
 * Split text into sentences
 */
function splitSentences(text) {
    // splits on . ! ? followed by space or end of string
    return text.match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(s => s.length > 0) || [text];
}

/**
 * Detect metrics in a sentence
 */
function detectMetrics(sentence) {
    const matches = sentence.match(METRICS_REGEX);
    return matches ? matches.length : 0;
}

/**
 * Classify a single sentence into S, T, A, R or 'unknown'
 */
function classifySentence(sentence, index, totalSentences) {
    const tokens = tokenize(sentence);
    let counts = { situation: 0, task: 0, action: 0, result: 0 };
    
    // Check against dictionaries
    tokens.forEach(token => {
        for (const [category, words] of Object.entries(STAR_DICTIONARY)) {
            words.forEach(dictWord => {
                if (token === stem(dictWord) || dictWord.includes(token)) {
                    counts[category]++;
                }
            });
        }
    });

    // Add positional weighting
    // Situation usually early, Result usually late
    const positionPct = index / Math.max(1, (totalSentences - 1));
    if (positionPct < 0.3) counts.situation += 0.5;
    if (positionPct > 0.7) counts.result += 0.5;
    
    // Action usually correlates with past tense action verbs
    if (sentence.match(/\b([a-z]+ed)\b/i)) counts.action += 0.5;
    
    // Result strongly correlates with metrics
    if (detectMetrics(sentence) > 0) counts.result += 1.5;

    // Situation checks via common patterns
    if (SITUATION_PATTERNS.some(p => p.test(sentence))) {
        counts.situation += 2;
    }

    // Determine max category
    let maxCat = 'unknown';
    let maxVal = 0.5; // Threshold
    for (const [cat, val] of Object.entries(counts)) {
        if (val > maxVal) {
            maxVal = val;
            maxCat = cat;
        }
    }

    return maxCat;
}

/**
 * Detect passive tone
 */
function detectPassive(text) {
    const matches = text.match(PASSIVE_INDICATORS);
    return matches ? matches.length : 0;
}

// 3. MAIN EVALUATOR FUNCTION
export const scoreLocalBehavioral = (answer = "") => {
    // If empty
    if (!answer || answer.trim().length === 0) {
        return {
            score: 0,
            classification: "weak",
            breakdown: { situation: 0, task: 0, action: 0, result: 0 },
            sentenceAnalysis: [],
            feedback: "No answer provided. Please state a real-world example.",
            starAnalysis: { situation: "", task: "", action: "", result: "" },
            tone: "Passive",
            confidence: 1,
            offline: true
        };
    }

    const sentences = splitSentences(answer);
    const wordCount = answer.split(/\s+/).filter(w => w.trim().length > 0).length;
    
    let sentenceAnalysis = [];
    let discoveredCategories = [];
    
    let totalMetrics = 0;
    let passiveCount = detectPassive(answer);
    let fillerCount = 0;

    FILLER_WORDS.forEach(fw => {
        if (answer.toLowerCase().includes(fw)) fillerCount++;
    });

    sentences.forEach((sentence, index) => {
        const type = classifySentence(sentence, index, sentences.length);
        sentenceAnalysis.push({ sentence, type });
        
        if (type !== 'unknown' && Object.keys(STAR_DICTIONARY).includes(type)) {
            if (discoveredCategories[discoveredCategories.length - 1] !== type) {
                discoveredCategories.push(type);
            }
        }
        totalMetrics += detectMetrics(sentence);
    });

    // Score calculations
    // Base max possible: S:15, T:15, A:30, R:40
    let breakdown = { situation: 0, task: 0, action: 0, result: 0 };
    
    discoveredCategories.forEach(cat => {
        if (cat === "situation") breakdown.situation = 15;
        if (cat === "task") breakdown.task = 15;
        if (cat === "action") breakdown.action = 20; // up to 30 with active verbs
        if (cat === "result") breakdown.result = 20; // up to 40 with metrics
    });

    // Bonuses
    if (discoveredCategories.includes("action") && passiveCount === 0) breakdown.action += 10;
    else if (discoveredCategories.includes("action") && passiveCount > 0) breakdown.action += 5;

    if (discoveredCategories.includes("result") && totalMetrics > 0) breakdown.result += 20;

    let score = breakdown.situation + breakdown.task + breakdown.action + breakdown.result;

    // Penalties
    if (wordCount < 20) score -= 40;
    else if (wordCount < 40) score -= 15;

    if (totalMetrics === 0) {
        if (!discoveredCategories.includes("result")) {
            score -= 15; // heavy penalty
        }
        // if they had result words but no metrics, breakdown.result is already 20 (partial credit), so no heavy score deduction here
    }
    if (fillerCount > 3) score -= 10;

    // Structure validation: check if order is monotonic
    const starOrder = { situation: 1, task: 2, action: 3, result: 4 };
    let orderViolations = 0;
    for (let i = 0; i < discoveredCategories.length - 1; i++) {
        if (starOrder[discoveredCategories[i]] > starOrder[discoveredCategories[i+1]]) {
            orderViolations++;
        }
    }
    if (orderViolations > 0) score -= (10 * orderViolations);

    score = Math.max(0, Math.min(100, score));

    // Classification
    let classification = "average";
    if (score >= 80 && totalMetrics > 0 && orderViolations === 0) classification = "strong_star";
    else if (score < 50 || wordCount < 30) classification = "weak";

    // Confidence heuristic
    let matchedSentences = sentenceAnalysis.filter(s => s.type !== 'unknown').length;
    let confidence = Math.min(1, Math.max(0.3, matchedSentences / sentences.length));

    // Generate Feedback
    let feedbackParts = [];
    if (breakdown.action >= 20) feedbackParts.push("Strong use of action verbs showing ownership.");
    else feedbackParts.push("Your answer lacks clear actions. What exactly did YOU do?");

    if (totalMetrics > 0) feedbackParts.push("Great job using metrics to quantify your impact.");
    else if (breakdown.result > 0) feedbackParts.push("Try adding measurable metrics (e.g., %, time saved) to prove your result.");
    else feedbackParts.push("You are missing a clear result or outcome ending.");

    if (orderViolations > 0) feedbackParts.push("Your answer jumped around a bit. Stick strictly to Situation -> Task -> Action -> Result.");
    if (wordCount < 30) feedbackParts.push("Your answer is too short to fully evaluate. Provide more context next time.");
    if (passiveCount >= 2) feedbackParts.push("Avoid using passive voice; use 'I did' instead of 'It was done'.");

    let finalFeedback = feedbackParts.join(" ");

    // For compatibility with the backend (if it expects standard starAnalysis map):
    const starAnalysisFormat = {
        situation: breakdown.situation > 0 ? "Good contextual framing." : "Missing background setup.",
        task: breakdown.task > 0 ? "Clear task definition." : "Missing explicit task/goal.",
        action: breakdown.action >= 20 ? "Strong action steps." : "Vague actions. Elaborate.",
        result: breakdown.result >= 30 ? "Quantifiable results achieved." : "Missing or weak results. Use metrics."
    };

    return {
        score,
        classification,
        breakdown,
        sentenceAnalysis,
        feedback: finalFeedback,
        starAnalysis: starAnalysisFormat, 
        tone: passiveCount > 1 ? "Passive & Indirect" : "Active & Direct",
        confidence: Number(confidence.toFixed(2)),
        offline: true
    };
};

// Expose a no-op trainModel for compatibility with older code imports
export const trainModel = () => { return {}; };
