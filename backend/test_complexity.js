import { ComplexityAnalyzer } from "./src/lib/complexityAnalyzer.js";

const codeEasy = `function sum(arr) {
    let s = 0;
    for (let i = 0; i < arr.length; i++) {
        s += arr[i];
    }
    return s;
}`;

const codeMedium = `function findPairs(arr) {
    let pairs = [];
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length; j++) {
            pairs.push([arr[i], arr[j]]);
        }
    }
    return pairs;
}`;

console.log("=== 🧪 TESTING LOCAL COMPLEXITY MODEL ===\n");

console.log("--- 🟢 Testing O(N) Loop ---");
console.log(JSON.stringify(ComplexityAnalyzer.analyze(codeEasy), null, 2));

console.log("\n--- 🔴 Testing O(N²) Nested Loop ---");
console.log(JSON.stringify(ComplexityAnalyzer.analyze(codeMedium), null, 2));
