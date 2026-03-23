import { scoreLocalBehavioral } from "./src/lib/behavioralClassifier.js";

const strongAnswer = "We had a critical problem with slow API lag causing server crashes. My goal was fixing read times. I refactored the database index queries using Node.js to speed up access. We saved 40% in loading lag and CPU loads dropped by 10% saving revenue.";
const weakAnswer = "I made some code work. It creates decent apps and runs fine on our systems with no big errors.";

console.log("=== 🧪 TESTING LOCAL STAR MODEL ===\n");

console.log("--- 🟢 Testing STRONG Answer ---");
console.log("Input:", strongAnswer);
console.log("Result:", JSON.stringify(scoreLocalBehavioral(strongAnswer), null, 2));

console.log("\n--- 🔴 Testing WEAK Answer ---");
console.log("Input:", weakAnswer);
console.log("Result:", JSON.stringify(scoreLocalBehavioral(weakAnswer), null, 2));
