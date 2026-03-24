import axios from "axios";

async function test() {
    try {
        const res = await axios.post("http://localhost:5055/api/interview/visualize-flow", {
            code: "function sum(a, b) { return a + b; }",
            language: "javascript"
        });
        console.log("=== VISUALIZE FLOW RESPONSE ===");
        console.log(JSON.stringify(res.data, null, 2));
    } catch (e) {
        console.error("Fetch Error:", e.response ? e.response.data : e.message);
    }
}

test();
