import { getModel } from "./src/config/gemini.js";
import dotenv from "dotenv";

dotenv.config();

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

async function test() {
    const aiModel = getModel();
    if (!aiModel) return console.log("Model init failed");

    const prompt = `You are an elite Algorithm Visualizer. Analyze this javascript code and generate a clean, responsive SVG flowchart detailing its absolute execution flow.

CODE:
${code}

SVG REQUIREMENTS:
1. Compact Flowchart view with vital nodes (Starts, loops, conditionals, stops).
2. Use dark mode values (Background: #111317, Borders: #00e3fd, Text: #ffffff).
3. Use <rect> for operations, <polygon> (diamonds) for conditionals and decisions.
4. Scale SVG accurately using viewBox coordinates template.
5. Return ONLY the raw valid <svg> block inside raw response securely.
Make it concise and speedy.`;

    console.log("🚀 Calling Gemini for SVG Flowchart...");
    const start = Date.now();
    try {
        const result = await aiModel.generateContent(prompt);
        console.log(`✅ Success in ${(Date.now() - start)/1000}s`);
        console.log("Output Snippet:", result.response.text().slice(0, 100));
    } catch (e) {
        console.error("❌ Gemini Call Failed:", e.message);
    }
}

test();
