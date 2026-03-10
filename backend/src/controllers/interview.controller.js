import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

try {
    if (process.env.GEMINI_API_KEY) {
        genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // or gemini-pro
    }
} catch (error) {
    console.log("Error initializing Gemini:", error.message);
}

export const analyzeResume = async (req, res) => {
    try {
        const { resumeText } = req.body;

        if (!genAI || !model) {
            // Fallback for demo if no key
            return res.status(200).json({
                skills: ["React", "JavaScript", "Algorithms"],
                experience: "3 YOE",
                suggestedProblem: "Find duplicates in an array in O(n) time and O(1) space."
            });
        }

        const prompt = `Extract the top 3 core technical skills and Years of Experience from this resume text: "${resumeText}". Then suggest ONE short coding interview problem based on those skills. Respond ONLY in JSON format: {"skills": ["skill1", "skill2"], "experience": "X YOE", "suggestedProblem": "problem description"}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const jsonString = response.text().replace(/```json\n?|```/g, "").trim();

        const parsed = JSON.parse(jsonString);
        res.status(200).json(parsed);
    } catch (error) {
        console.error("Analysis Error:", error);
        res.status(500).json({ error: "Failed to analyze resume" });
    }
};

export const chatWithInterviewer = async (req, res) => {
    try {
        const { chatLog, code } = req.body;

        if (!genAI || !model) {
            return res.status(200).json({
                reply: "I am running in Mock Mode because GEMINI_API_KEY is not set. But your code looks interesting. Can you tell me your time complexity?",
                isCodeRequested: false
            });
        }

        const systemPrompt = `You are a strict but fair technical interviewer. The candidate is solving a coding problem. 
    Here is their current code:\n${code}\n\n
    Here is the chat history: ${JSON.stringify(chatLog)}\n
    Respond to the user's latest message as the AI interviewer. Keep your response under 3 sentences. Ask follow-up questions about complexity or edge cases if appropriate.`;

        const result = await model.generateContent(systemPrompt);
        const text = result.response.text();

        res.status(200).json({ reply: text });
    } catch (error) {
        console.error("Chat Error:", error);
        res.status(500).json({ error: "Failed to communicate with AI" });
    }
};

export const evaluateCode = async (req, res) => {
    try {
        const { code, problemContext } = req.body;

        if (!genAI || !model) {
            return res.status(200).json({
                strengths: ["Code is functional", "Variable naming is okay"],
                weaknesses: ["No AI key found, this is a mock analysis"],
                score: 75,
                feedback: "Please add GEMINI_API_KEY to your .env to see real AI analysis."
            });
        }

        const prompt = `Act as an expert technical recruiter and AI telemetry system analyzing a candidate's code submission.
    Problem Context: ${problemContext}
    Code:
    ${code}

    Evaluate this code strictly and simulate behavior metrics based on the code's maturity. Return ONLY a valid JSON object matching this exact schema:
    {
      "strengths": ["string"],
      "weaknesses": ["string"],
      "score": number (0-100),
      "feedback": "A short paragraph of overall feedback.",
      "plagiarismScore": number (0-100, lower is better, estimate based on genericness),
      "keyboardEfficiency": number (0-100, estimate based on code cleanliness),
      "timeToInsight": "Estimate time string like '2m 15s'",
      "personalityScore": "A 2-3 word string like 'Direct & Analytical'",
      "evolutionTimeline": ["Initial code", "Optimization", "Final Result"],
      "bottlenecks": [
        {"line": "Name of bottleneck (e.g. nested loop)", "timeSpent": "estimate string"}
      ]
    }`;

        const result = await model.generateContent(prompt);
        let jsonString = result.response.text().replace(/```json\n?|```/g, "").trim();

        const parsed = JSON.parse(jsonString);
        res.status(200).json(parsed);

    } catch (error) {
        console.error("Evaluation Error:", error);
        res.status(500).json({ error: "Failed to evaluate code" });
    }
};

export const refactorCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!genAI || !model) return res.status(200).json({ refactored: code + "\n// Mock refactored version (Add GEMINI_API_KEY for real AI refactoring)" });

        const prompt = `Refactor this code to be cleaner, more efficient, and use better design patterns. Return ONLY the pure code in raw text, no markdown formatting.\n\n${code}`;
        const result = await model.generateContent(prompt);
        res.status(200).json({ refactored: result.response.text().replace(/```(javascript|js)?\n?|```/gi, "").trim() });
    } catch (e) { res.status(500).json({ error: "Failed refactor" }); }
};

export const debugCode = async (req, res) => {
    try {
        const { code } = req.body;
        if (!genAI || !model) return res.status(200).json({ feedback: "Mock Debugger: Check if you are handling null edge cases or off-by-one errors." });

        const prompt = `Act as an AI Debugger. Identify bugs, explain what went wrong and why logic fails in this code. Keep it brief and constructive.\n\n${code}`;
        const result = await model.generateContent(prompt);
        res.status(200).json({ feedback: result.response.text() });
    } catch (e) { res.status(500).json({ error: "Failed debugger" }); }
};

export const getComplexity = async (req, res) => {
    try {
        const { code } = req.body;
        if (!genAI || !model) return res.status(200).json({ time: "O(n)", space: "O(n)" });

        const prompt = `Evaluate the strict Time and Space complexity of this code. Return ONLY JSON format: {"time": "O(N)", "space": "O(1)"}\n\n${code}`;
        const result = await model.generateContent(prompt);
        const jsonString = result.response.text().replace(/```json\n?|```/gi, "").trim();
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) { res.status(500).json({ error: "Failed complexity" }); }
};

export const getCoachHint = async (req, res) => {
    try {
        const { code, problemContext } = req.body;
        if (!genAI || !model) {
            return res.status(200).json({ hint: "Mock Coach: Try using a hashmap for O(1) lookups." });
        }

        const prompt = `You are a pair programming AI coach. The user is solving: ${problemContext}. Their code is: \n${code}\nGive them a single, short, subtle 1-sentence hint without giving away the exact code.`;
        const result = await model.generateContent(prompt);
        res.status(200).json({ hint: result.response.text() });
    } catch (e) {
        res.status(500).json({ error: "Failed coach" });
    }
};

export const generateSkillReport = async (req, res) => {
    try {
        const { solvedProblems } = req.body;
        if (!genAI || !model) {
            return res.status(200).json({
                languages: { JavaScript: 80, Python: 15, Java: 5 },
                weaknesses: ["Dynamic Programming", "Graphs"],
                strengths: ["Arrays", "HashMaps"],
                recommendation: "Focus on 2D DP problems."
            });
        }

        const prompt = `Based on a candidate having solved these problems: ${JSON.stringify(solvedProblems || ['two sum', 'reverse string'])}. Generate a dynamic skill report. Return ONLY JSON: {"languages": {"JavaScript": 80, "Python": 15, "Java": 5}, "weaknesses": ["str1", "str2"], "strengths": ["str1", "str2"], "recommendation": "Short str"}`;
        const result = await model.generateContent(prompt);
        const jsonString = result.response.text().replace(/```json\n?|```/gi, "").trim();
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        res.status(500).json({ error: "Failed to generate report" });
    }
};

export const generateCustomTrack = async (req, res) => {
    try {
        const { topic } = req.body;
        if (!genAI || !model) {
            return res.status(200).json({ trackId: "custom", title: topic + " Mastery", description: "AI generated mock track.", total: 10, problems: ["p1", "p2"] });
        }

        const prompt = `Generate a custom study track for learning: "${topic}". Return ONLY JSON: {"trackId": "custom-ai", "title": "...", "description": "...", "total": 5, "problems": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"]}`;
        const result = await model.generateContent(prompt);
        const jsonString = result.response.text().replace(/```json\n?|```/gi, "").trim();
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        res.status(500).json({ error: "Failed to generate track" });
    }
};

export const runCodeAI = async (req, res) => {
    try {
        const { language, code } = req.body;
        if (!genAI || !model) {
            return res.status(200).json({ output: "Mock execution: Hello World", success: true });
        }

        const prompt = `You are a strict code compiler and execution engine.
Language: ${language}
Code:
${code}

Simulate the execution of this code. 
Return ONLY a valid JSON object matching this schema:
{
  "success": boolean (true if runs without crashing, false if runtime/compile error),
  "output": "Exact stdout printed here if any, or empty string",
  "errorType": "Compile Error OR Runtime Error (leave empty if success)",
  "error": "If success is false, provide the EXACT realistic compiler/runtime error stack trace like LeetCode. E.g. 'ReferenceError: x is not defined at line 2' or 'SyntaxError: Unexpected token'. Leave empty if success is true."
}`;
        const result = await model.generateContent(prompt);
        let output = result.response.text();
        // remove codeblocks if gemini sneaks them in
        if (output.startsWith("\`\`\`")) {
            output = output.replace(/\`\`\`(json)?\n?/gi, "").replace(/\`\`\`/g, "").trim();
        }
        res.status(200).json(JSON.parse(output));
    } catch (e) {
        res.status(500).json({ success: false, error: "Failed to simulate code execution", errorType: "Server Error" });
    }
};
