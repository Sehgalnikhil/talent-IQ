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

console.log(containsDuplicate([1,2,3,1]));
`;

const baseUrl = "http://localhost:5055/api/interview";

async function run() {
    try {
        console.log("🧪 Testing Piston Code Runner inside Backend...");
        const res = await axios.post(`${baseUrl}/run-code`, { code, language: "javascript" });
        console.log("✅ Piston Execution Response:", res.data);
    } catch (e) {
        console.error("❌ Test failed:", e.response?.data || e.message);
    }
}

run();
