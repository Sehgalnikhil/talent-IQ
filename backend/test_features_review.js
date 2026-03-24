import axios from "axios";

const code = `
function containsDuplicate(nums) {
    let set = new Set();
    for(let n of nums) {
        if(set.has(n)) return true;
        set.add(n);
    }
    return false;
}
`;

const baseUrl = "http://localhost:5055/api/interview";

async function run() {
    try {
        console.log("🧪 Testing Visualize Flow...");
        const resFlow = await axios.post(`${baseUrl}/visualize-flow`, { code, language: "javascript" });
        console.log("✅ Flow response received. Length:", resFlow.data.svg?.length);
        
        console.log("\n🧪 Testing Code Review...");
        const resReview = await axios.post(`${baseUrl}/code-review`, { code, language: "javascript", problemTitle: "Contains Duplicate" });
        console.log("✅ Review response received:", Object.keys(resReview.data));
    } catch (e) {
        console.error("❌ Test failed:", e.response?.data || e.message);
    }
}

run();
