import { evaluateBehavioral, getComplexity } from "./src/controllers/interview.controller.js";

// Mock Express response object
const mockRes = () => {
    const res = {};
    res.status = (code) => {
        res.statusCode = code;
        return res;
    };
    res.json = (data) => {
        res.data = data;
        return res;
    };
    return res;
};

console.log("=== 🧪 TESTING END-TO-END EXPRESS WRAPPERS ===\n");

// 1. Test evaluateBehavioral
const reqBehavioral = {
    body: {
        question: "Tell me about a time you solved a bug.",
        answer: "We had a critical problem with slow API lag causing server crashes. My goal was fixing read times. I refactored the database index queries using Node.js to speed up access. We saved 40% in loading lag and CPU loads dropped by 10% saving revenue."
    }
};

const resBehavioral = mockRes();
evaluateBehavioral(reqBehavioral, resBehavioral).then(() => {
    console.log("--- 🟣 Endpoint: /evaluate-behavioral ---");
    console.log("Status:", resBehavioral.statusCode);
    console.log("Body:", JSON.stringify(resBehavioral.data, null, 2));
});

// 2. Test getComplexity
const reqComplexity = {
    body: {
        code: `function findPairs(arr) {
            let pairs = [];
            for (let i = 0; i < arr.length; i++) {
                for (let j = 0; j < arr.length; j++) {
                    pairs.push([arr[i], arr[j]]);
                }
            }
            return pairs;
        }`
    }
};

const resComplexity = mockRes();
getComplexity(reqComplexity, resComplexity).then(() => {
    console.log("\n--- 🟣 Endpoint: /complexity ---");
    console.log("Status:", resComplexity.statusCode);
    console.log("Body:", JSON.stringify(resComplexity.data, null, 2));
});
