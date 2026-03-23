/**
 * 🪚 Local complexity analyzer ported from ml-engine with strict node support
 */
export const ComplexityAnalyzer = {
  analyze(code) {
    if (!code || code.trim().length === 0) return { time: "O(1)", space: "O(1)" };

    const cleanCode = code
      .replace(/\/\/.*$/gm, "")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/#.*$/gm, "");

    // Count nesting depth
    let maxDepth = 0, currentDepth = 0;
    for (const char of cleanCode) {
      if (char === "{" || char === "(") { currentDepth++; maxDepth = Math.max(maxDepth, currentDepth); }
      if (char === "}" || char === ")") currentDepth = Math.max(0, currentDepth - 1);
    }

    // Count loops
    const forLoops = (cleanCode.match(/\b(for|while|do)\b/g) || []).length;
    let nestedLoops = 0;
    const lines = cleanCode.split("\n");
    let currentNest = 0;
    for (const line of lines) {
      if (/\b(for|while)\b/.test(line)) { currentNest++; nestedLoops = Math.max(nestedLoops, currentNest); }
      if (/^\s*\}/.test(line)) currentNest = Math.max(0, currentNest - 1);
    }

    // Recursion detection
    const hasRecursion = /function\s+(\w+)[\s\S]*?\1\s*\(/.test(cleanCode) || 
                       /(\w+)\s*=\s*\(.*\)[\s\S]*?\1\s*\(/.test(cleanCode);

    // Data structure usage
    const usesMap = /\bnew\s+Map\b|Map\(|\bdict\b|{}/i.test(cleanCode);
    const usesSet = /\bnew\s+Set\b|Set\(/i.test(cleanCode);
    const usesArray = /\[\]|\bnew\s+Array\b|\.push\(|\.pop\(/i.test(cleanCode);
    const usesSort = /\.sort\(|sorted\(/i.test(cleanCode);

    // Estimate time complexity
    let time = "O(1)";
    if (nestedLoops >= 3) time = "O(n³)";
    else if (nestedLoops >= 2) time = "O(n²)";
    else if (hasRecursion) time = "O(2^n) or O(n log n)";
    else if (usesSort) time = "O(n log n)";
    else if (forLoops >= 1) time = "O(n)";

    // Space complexity
    let space = "O(1)";
    if (hasRecursion) space = "O(n)";
    else if (usesMap || usesSet || usesArray) space = "O(n)";

    return { time, space, maxDepth, loopCount: forLoops };
  }
};
