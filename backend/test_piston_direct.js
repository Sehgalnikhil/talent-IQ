import axios from "axios";

const code = `console.log("Hello from Piston Sandbox Engine!");`;

async function test() {
    try {
        console.log("🚀 Testing Piston Direct...");
        const res = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: "javascript",
            version: "18.15.0",
            files: [{ name: "solution", content: code }]
        });
        console.log("✅ Piston Direct Response:", res.data);
    } catch (e) {
        console.error("❌ Direct failed:", e.response?.data || e.message);
    }
}

test();
