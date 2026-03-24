import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from "axios";

let genAI = null;
let model = null;

const getModel = () => {
    if (model) return model;
    try {
        if (process.env.GEMINI_API_KEY) {
            genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            // Swapping to 1.5-flash to bypass daily quota caps flawless flawlessly.
            model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
            return model;
        }
    } catch (error) {
        console.log("Error initializing Gemini:", error.message);
    }
    return null;
};

export const askAIWithFallback = async (prompt, isJson = true) => {
    // 🚀 TRY LOCAL OLLAMA FIRST TO SAVE GEMINI QUOTAS
    try {
         const payload = {
             model: process.env.OLLAMA_MODEL || "qwen2",
             prompt: prompt,
             stream: false
         };
         
         if (isJson) payload.format = "json";

         const ollamaUrl = `${process.env.OLLAMA_HOST || "http://localhost:11434"}/api/generate`;
         const resp = await axios.post(ollamaUrl, payload);
         return resp.data.response;
    } catch (ollamaErr) {
         console.warn("⚠️ Local Ollama Offline. Switching to Gemini...", ollamaErr.message);
    }

    try {
        const aiModel = getModel();
        if (aiModel) {
            const result = await aiModel.generateContent(prompt);
            return result.response.text();
        } else {
            throw new Error("Gemini API key is not configured.");
        }
    } catch (err) {
         throw new Error(`Both attempts failed: ${err.message}`);
    }
};

export const analyzeResume = async (req, res) => {
    try {
        const { resumeText } = req.body;

        const aiModel = getModel();
        if (!aiModel) {
            // Fallback for demo if no key
            return res.status(200).json({
                skills: ["React", "JavaScript", "Algorithms"],
                experience: "3 YOE",
                suggestedProblem: "Find duplicates in an array in O(n) time and O(1) space."
            });
        }

        const prompt = `Extract the top 3 core technical skills and Years of Experience from this resume text: "${resumeText}". Then suggest ONE short coding interview problem based on those skills. Respond ONLY in JSON format: {"skills": ["skill1", "skill2"], "experience": "X YOE", "suggestedProblem": "problem description"}`;
        const result = await aiModel.generateContent(prompt);
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
        const { chatLog, code, interviewType, hostility } = req.body;

        // 🚀 PREFER LOCAL OLLAMA FIRST (No early model exit here)

        let modeInstructions = "";
        switch (interviewType) {
            case "ML Technical":
                modeInstructions = `You are an AI/ML interviewer.
Focus Areas:
- Regression vs Classification, Bias-Variance tradeoff, Overfitting & Regularization, Evaluation metrics (Precision, Recall, F1, ROC-AUC)
Instructions:
- Ask conceptual + intuitive questions. Avoid textbook definitions. Ask "why" and "what if". Increase difficulty gradually.
Behavior:
- If shallow answer → challenge it. If good answer → ask deeper follow-up.`;
                break;

            case "Case Study":
                modeInstructions = `You are a senior ML system design interviewer.
Evaluate solution strictly on:
1. Problem Framing (0-2), 2. Data Strategy (0-2), 3. Model Selection (0-2), 4. Scalability & Latency (0-2), 5. Monitoring & Feedback (0-2).
Return strictly critical feedback. Do not inflate scores.`;
                break;

            case "System Design":
                modeInstructions = `You are a senior backend/system design interviewer.
Ask candidate to design scalable systems.
Focus: API design, Database choice, Caching, Load balancing, Tradeoffs.
Behavior: Interrupt with critical "Why this DB?" "What happens at 10M users?" "How to handle failures?". Push for depth (CAP theorem, Consistency vs availability, Scaling strategy).`;
                break;

            case "Debugging":
                modeInstructions = `You are a senior engineer reviewing a pull request.
Task: Identify bugs, bad practices, suggest improvements.
Focus: Async issues, Error handling, Scalability, Code readability.
Response style: Short, direct comments like real PR reviews. Example: "L17: Missing await → potential race condition"`;
                break;

            case "Resume":
                modeInstructions = `You are a strict interviewer reviewing a candidate's resume.
Instructions: Ask deep questions about projects. Focus on decisions, not descriptions. Challenge vague claims.
Behavior: If "used MongoDB" → Ask "Why MongoDB?". If "optimized performance" → Ask "What metrics improved?".
Goal: Expose fake knowledge, validate real understanding.`;
                break;

            case "Behavioral":
            case "HR":
                modeInstructions = `You are a hiring manager evaluating soft skills.
Focus: STAR method (Situation, Task, Action, Result), Conflict resolution, Ownership, Leadership.
Instructions: Ask situational questions. Evaluate clarity and structure.
Challenge weak answers: Ask "What exactly did YOU do?". If vague answer → Ask for measurable impact.`;
                break;

            case "Pair Programming":
                modeInstructions = `You are a collaborative interviewer during a live coding session.
Behavior: Guide but DO NOT give full solutions. Ask hints instead of answers.
Interruptions: "What is time complexity?" "Can we optimize this?" "Edge cases?".
If stuck → Give small hints, not solutions. Tone: Helpful but challenging.`;
                break;

            case "Final Evaluation":
                modeInstructions = `You are an expert evaluator summarizing a full interview.
Input: Performance across all rounds.
Return STRICT JSON: { "overall_score": number, "level": "L3 | L4 | L5", "strengths": [], "weaknesses": [], "hire_decision": "Yes | No | Borderline", "feedback": "Detailed paragraph" }
Be critical and realistic like a real hiring decision.`;
                break;

            default:
                modeInstructions = `The candidate is solving a standard DSA coding problem. Analyze their code for correctness, time/space complexity, and code design strictly.`;
        }

        let hostilityInstructions = "";
        const aggLevel = Number(hostility) || 5;
        if (aggLevel >= 8) {
            hostilityInstructions = `WARNING: Aggression Level is ${aggLevel}/10. You must act as a Hostile, 'Bar Raiser' Interviewer. Be extremely impatient, interrupt the candidate, harshly critique variable names, and act deeply unsatisfied unless the answer is perfectly optimal immediately. Do not be polite.`;
        } else if (aggLevel <= 3) {
            hostilityInstructions = `Aggression Level is ${aggLevel}/10. Act extremely supportive, friendly, and give lots of encouraging hints if they get stuck.`;
        }

        const systemPrompt = `You are simulating a Multi-Agent Interview Panel consisting of 3 distinct personas:
1. "DSA Engineer" - Focuses strictly on Data Structures, Time/Space Complexity, and algorithm optimization.
2. "System Design Engineer" - Focuses on scaling, bottlenecks, and architecture choices.
3. "Hiring Manager" - Focuses on behavioral questions, communication clarity, and trade-offs.

${modeInstructions}
${hostilityInstructions}

Here is their current code:\n${code}\n\n
Here is the chat history: ${JSON.stringify(chatLog)}\n

Based on the conversation context, decide WHICH of the 3 interviewers should reply next. 
Your response MUST start with their exact bracketed name, e.g. "[DSA Engineer]: " followed by their short 1-2 sentence response. Do not include multiple people in one message.`;

        let text = "";
        try {
            text = await askAIWithFallback(systemPrompt, false);
        } catch (err) {
            console.error("AI Generation Error inside chatWithInterviewer:", err);
            return res.status(200).json({ reply: "I reviewed your answers. Could you tell me more about your scalable designs?", response: "I reviewed your answers." });
        }

        res.status(200).json({ reply: text, response: text });
    } catch (error) {
        console.error("Chat Error:", error);
        
        // Safety Fallback for Quota Limits to ensure Voice Interview never breaks
        if (error.status === 429 || error.message?.includes("Quota exceeded")) {
             return res.status(200).json({ 
                 reply: "[GEMINI QUOTA FALLBACK] Your logic makes sense to me. Could you talk more about how scaling would affect it?",
                 response: "[GEMINI QUOTA FALLBACK] Your logic makes sense to me. Could you talk more about how scaling would affect it?"
             });
        }

        res.status(500).json({ error: "Failed to communicate with AI" });
    }
};

export const evaluateCode = async (req, res) => {
    try {
        const { code, problemContext } = req.body;

        const aiModel = getModel();
        if (!aiModel) {
            return res.status(200).json({
                strengths: ["Code is functional", "Variable naming is okay"],
                weaknesses: ["No AI key found, this is a mock analysis"],
                score: 75,
                feedback: "Please add GEMINI_API_KEY to your .env to see real AI analysis.",
                plagiarismScore: 100,
                keyboardEfficiency: 80,
                timeToInsight: "N/A",
                personalityScore: "Calm & Clear",
                evolutionTimeline: ["Started", "Finished"],
                bottlenecks: [{ "line": "System Not Configured", "timeSpent": "N/A" }]
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
      "score": number (0-100, DSA Engineer Score),
      "systemDesignScore": number (0-100),
      "communicationScore": number (0-100),
      "feedback": "A short paragraph of overall feedback from the panel.",
      "plagiarismScore": number (0-100, lower is better, estimate based on genericness),
      "keyboardEfficiency": number (0-100, estimate based on code cleanliness),
      "timeToInsight": "Estimate time string like '2m 15s'",
      "personalityScore": "A 2-3 word string like 'Direct & Analytical'",
      "evolutionTimeline": ["Initial code", "Optimization", "Final Result"],
      "bottlenecks": [
        {"line": "Name of bottleneck (e.g. nested loop)", "timeSpent": "estimate string"}
      ]
    }`;

        const result = await aiModel.generateContent(prompt);
        let rawText = result.response.text();

        // Robust JSON extraction using regex to capture the exact { ... } object
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        let jsonString = jsonMatch ? jsonMatch[0] : "{}";

        const parsed = JSON.parse(jsonString);
        res.status(200).json(parsed);

    } catch (error) {
        console.error("Evaluation Error:", error);
        // Instead of 500ing, return a 200 with the exact LLM stack trace so it renders in the UI
        res.status(200).json({
            strengths: ["Network Connected"],
            weaknesses: ["AI Execution Failed"],
            score: 0,
            feedback: `Server caught an error while contacting Gemini AI: ${error.message || "Unknown GenAI Error"}`,
            plagiarismScore: 100,
            keyboardEfficiency: 0,
            timeToInsight: "Error",
            personalityScore: "Offline",
            evolutionTimeline: ["Crash"],
            bottlenecks: [{ "line": "System Not Configured", "timeSpent": "N/A" }]
        });
    }
};

export const refactorCode = async (req, res) => {
    try {
        const { code } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ refactored: code + "\n// Mock refactored version (Add GEMINI_API_KEY for real AI refactoring)" });

        const prompt = `Refactor this code to be cleaner, more efficient, and use better design patterns. Return ONLY the pure code in raw text, no markdown formatting.\n\n${code}`;
        const result = await aiModel.generateContent(prompt);
        res.status(200).json({ refactored: result.response.text().replace(/```(javascript|js)?\n?|```/gi, "").trim() });
    } catch (e) { res.status(500).json({ error: "Failed refactor" }); }
};

export const debugCode = async (req, res) => {
    try {
        const { code } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ feedback: "Mock Debugger: Check if you are handling null edge cases or off-by-one errors." });

        const prompt = `Act as an AI Debugger. Identify bugs, explain what went wrong and why logic fails in this code. Keep it brief and constructive.\n\n${code}`;
        const result = await aiModel.generateContent(prompt);
        res.status(200).json({ feedback: result.response.text() });
    } catch (e) { res.status(500).json({ error: "Failed debugger" }); }
};

import { ComplexityAnalyzer } from '../lib/complexityAnalyzer.js';

export const getComplexity = async (req, res) => {
    try {
        const { code } = req.body;
        
        // 🚀 PREFER LOCAL TRAINED HEURISTICS FOR CODE COMPLEXITY
        const localComplexity = ComplexityAnalyzer.analyze(code);
        
        if (localComplexity) {
            return res.status(200).json({
                time: localComplexity.time,
                space: localComplexity.space,
                offline: true
            });
        }

        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ time: "O(n)", space: "O(n)" });
    } catch (e) {
        res.status(500).json({ error: "Failed complexity analysis" });
    }
};

export const getCoachHint = async (req, res) => {
    try {
        const { code, problemContext } = req.body;
        const aiModel = getModel();
        if (!aiModel) {
            return res.status(200).json({ hint: "Mock Coach: Try using a hashmap for O(1) lookups." });
        }

        const prompt = `You are a pair programming AI coach. The user is solving: ${problemContext}. Their code is: \n${code}\nGive them a single, short, subtle 1-sentence hint without giving away the exact code.`;
        const result = await aiModel.generateContent(prompt);
        res.status(200).json({ hint: result.response.text() });
    } catch (e) {
        res.status(500).json({ error: "Failed coach" });
    }
};

export const generateSkillReport = async (req, res) => {
    try {
        const { solvedProblems } = req.body;
        const aiModel = getModel();
        if (!aiModel) {
            return res.status(200).json({
                languages: { JavaScript: 80, Python: 15, Java: 5 },
                weaknesses: ["Dynamic Programming", "Graphs"],
                strengths: ["Arrays", "HashMaps"],
                recommendation: "Focus on 2D DP problems."
            });
        }

        const prompt = `Based on a candidate having solved these problems: ${JSON.stringify(solvedProblems || ['two sum', 'reverse string'])}. Generate a dynamic skill report. Return ONLY JSON: {"languages": {"JavaScript": 80, "Python": 15, "Java": 5}, "weaknesses": ["str1", "str2"], "strengths": ["str1", "str2"], "recommendation": "Short str"}`;
        const result = await aiModel.generateContent(prompt);
        const jsonString = result.response.text().replace(/```json\n?|```/gi, "").trim();
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        res.status(500).json({ error: "Failed to generate report" });
    }
};

export const generateCustomTrack = async (req, res) => {
    try {
        const { topic } = req.body;
        const aiModel = getModel();
        if (!aiModel) {
            return res.status(200).json({ trackId: "custom", title: topic + " Mastery", description: "AI generated mock track.", total: 10, problems: ["p1", "p2"] });
        }

        const prompt = `Generate a custom study track for learning: "${topic}". Return ONLY JSON: {"trackId": "custom-ai", "title": "...", "description": "...", "total": 5, "problems": ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"]}`;
        const result = await aiModel.generateContent(prompt);
        const jsonString = result.response.text().replace(/```json\n?|```/gi, "").trim();
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        res.status(500).json({ error: "Failed to generate track" });
    }
};

export const runCodeAI = async (req, res) => {
    try {
        const { language, code } = req.body;
        const fs = require('fs');
        const { exec } = require('child_process');
        const path = require('path');

        if (!code) return res.status(400).json({ success: false, error: "Code cannot be empty" });

        const supported = ["javascript", "python", "python3", "cpp", "java", "c"];
        if (!supported.includes(language?.toLowerCase())) {
             return res.status(400).json({ success: false, error: `${language} not supported yet in this local view flawlessly.` });
        }

        const extMap = { javascript: "js", python: "py", python3: "py", cpp: "cpp", java: "java", c: "c" };
        const ext = extMap[language.toLowerCase()] || "js";
        const tempFile = path.join("/tmp", `solution_${Date.now()}.${ext}`);
        
        fs.writeFileSync(tempFile, code);

        let cmd = `node ${tempFile}`;
        if (language.includes("python")) cmd = `python3 ${tempFile}`;
        else if (language.toLowerCase() === "cpp" || language.toLowerCase() === "c") {
             cmd = `g++ ${tempFile} -o ${tempFile}.out && ${tempFile}.out`;
        } else if (language.toLowerCase() === "java") {
             // Java needs class Main mapping Node flawless Node.
             const javaFile = path.join("/tmp", "Main.java");
             fs.writeFileSync(javaFile, code);
             cmd = `javac ${javaFile} && java -cp /tmp Main`;
        }

        exec(cmd, { timeout: 5000 }, (error, stdout, stderr) => {
             // Cleanup
             try { fs.unlinkSync(tempFile); } catch (e) {}
             if (language.toLowerCase() === "java") {
                  try { fs.unlinkSync("/tmp/Main.java"); fs.unlinkSync("/tmp/Main.class"); } catch (e) {}
             } else if (language.toLowerCase() === "cpp") {
                  try { fs.unlinkSync(`${tempFile}.out`); } catch (e) {}
             }

             const output = stdout || "";
             const errorLogs = stderr || "";

             if (error && error.killed) {
                  return res.status(200).json({ success: false, output, errorType: "Runtime Error", error: "Execution Timed Out (5s limit exceeded)" });
             }

             res.status(200).json({
                  success: error ? false : true,
                  output: output,
                  errorType: error ? "Runtime/Compile Error" : "",
                  error: errorLogs.trim() || (error ? error.message : "")
             });
        });

    } catch (e) {
        console.error("Local Sandbox execution error:", e);
        res.status(500).json({ success: false, error: `Failed to execute code: ${e.message}`, errorType: "Execution Server Error" });
    }
};

export const visualizeFlow = async (req, res) => {
    try {
        const { code, language } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ svg: "<svg></svg>" });

        const prompt = `You are an elite Algorithm Visualizer. Analyze this ${language} code and generate a clean, responsive SVG flowchart detailing its absolute execution flow.

CODE:
${code}

SVG REQUIREMENTS:
1. Compact Flowchart view with vital nodes (Starts, loops, conditionals, stops).
2. Use dark mode values (Background: #111317, Borders: #00e3fd, Text: #ffffff).
3. Use <rect> for operations, <polygon> (diamonds) for conditionals and decisions.
4. Scale SVG accurately using viewBox coordinates template.
5. Return ONLY the raw valid <svg> block inside raw response securely.
Make it concise and speedy.`;

        let output = "";
        try {
            output = await askAIWithFallback(prompt, false);
        } catch (err) {
            console.error("AI Generation Error inside VisualizeFlow:", err);
            return res.status(200).json({ svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 100"><rect width="100%" height="100%" fill="#111317"/><text x="20" y="50" fill="#ff5555" font-family="monospace">Generation failed on both Gemini and Ollama fallback: ${err.message || 'Unknown limit'}</text></svg>` });
        }
        
        console.log("=== VISUALIZE FLOW AI OUTPUT ===");
        console.log(output);

        if (output.includes("\`\`\`")) {
             output = output.replace(/\`\`\`(xml|svg)?\n?/gi, "").replace(/\`\`\`/g, "").trim();
        }

        // Match exact <svg> tag for safety
        const match = output.match(/<svg[\s\S]*<\/svg>/i);
        res.status(200).json({ svg: match ? match[0] : output });

    } catch (e) {
        console.error("VisualizeFlow Error:", e);
        res.status(500).json({ error: "Failed to visualize code." });
    }
};

export const translateCode = async (req, res) => {
    try {
        const { code, fromLanguage, toLanguage } = req.body;
        const aiModel = getModel();
        if (!aiModel || !code) return res.status(200).json({ code: code || "" });

        const prompt = `You are an elite developer. Translate this ${fromLanguage} code into idiomatic, identical ${toLanguage}. 
Output ONLY the raw code block. No explanations, no markdown wrap.`;

        const result = await aiModel.generateContent(prompt);
        let output = result.response.text();
        
        if (output.includes("\`\`\`")) {
             output = output.replace(/\`\`\`(javascript|cpp|python|java|c)?\n?/gi, "").replace(/\`\`\`/g, "").trim();
        }
        res.status(200).json({ code: output });
    } catch (e) {
        res.status(500).json({ error: "Translation failed." });
    }
};

export const oracleLint = async (req, res) => {
    try {
        const { code, language } = req.body;
        const aiModel = getModel();
        if (!aiModel || !code ) return res.status(200).json({ issues: [] });

        const prompt = `Inspect this ${language} code for logic/syntax errors (infinite loops, index-out-of-bounds, unhandled pointers).
Return ONLY a valid JSON object with a single top-level key "issues" holding an array of strings. 
Example Format: { "issues": ["Infinite loop risk at line 5", "Variable x never incremented"] }`;

        const result = await aiModel.generateContent(prompt);
        let output = result.response.text();
        
        if (output.includes("\`\`\`")) {
             output = output.replace(/\`\`\`(json)?\n?/gi, "").replace(/\`\`\`/g, "").trim();
        }
        res.status(200).json(JSON.parse(output));

    } catch (e) {
        res.status(200).json({ issues: [] }); // Fail gracefully for silence
    }
};

export const analyzeDiagram = async (req, res) => {
    try {
        const { image } = req.body;
        const aiModel = getModel();
        if (!aiModel) {
            return res.status(200).json({ feedback: "Mock Vision API: You drew an API Gateway routing to 3 Microservices, using Redis for caching and Postgres for your DB. Seems solid for 100k requests/min. (Insert GEMINI_API_KEY to enable real AI Vision)" });
        }

        const prompt = `You are an expert Principal System Design Architect interviewing a FAANG candidate.
Analyze this whiteboard diagram. Explain the architecture drawn. What are the core components you see? 
Are there any potential bottlenecks, single points of failure, scaling issues, or optimizations?
Rate their design out of 10 for clarity and scale. Give your response in a short, structured, bulleted markdown format.`;

        // Reformat base64 string to match Gemini API specifications
        const base64Data = image.split(",")[1];
        const mimeType = image.split(";")[0].split(":")[1] || "image/png";

        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType
            }
        };

        // Note: Gemini 1.5 flash natively supports multi-modal passing array
        const result = await aiModel.generateContent([prompt, imagePart]);
        res.status(200).json({ feedback: result.response.text() });
    } catch (e) {
        console.error("Diagram analysis failed", e);
        res.status(500).json({ error: "Failed to analyze diagram" });
    }
};

export const generateExecutionTrace = async (req, res) => {
    try {
        const { code } = req.body;
        const aiModel = getModel();

        const prompt = `Analyze this code and generate a stepwise variable execution trace as if checking it line by line. 
        Return a valid JSON array where each item has: "line" (approximate line number string), "text" (explanation of trace), and an optional "vars" (object of variable values). 
        Max 6 steps.
        Code:
        ${code}
        Respond ONLY with a JSON array.`;

        const result = await aiModel.generateContent(prompt);
        let rawText = result.response.text().trim();
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        const steps = JSON.parse(rawText || "[]");
        res.status(200).json({ steps });
    } catch (e) {
        console.error("Trace failed", e);
        res.status(500).json({ error: "Failed to generate trace" });
    }
};

export const generateAutoDrawDiagram = async (req, res) => {
    try {
        const { code, chatLog } = req.body;
        const aiModel = getModel();

        const chatContext = Array.isArray(chatLog) ? chatLog.map(l => l.role + ": " + l.text).join("\\n") : "No chat";
        const prompt = `Based on the following interview chat context and code, generate a Mermaid.js diagram that maps out the underlying software system architecture or logic flow discussed.
        Chat: ${chatContext}
        Code: ${code}
        
        Respond ONLY with the raw mermaid diagram payload (e.g. starting with 'graph TD' or 'sequenceDiagram'). Do not use markdown wrappers.`;

        const result = await aiModel.generateContent(prompt);
        let mermaid = result.response.text().trim();
        mermaid = mermaid.replace(/```mermaid/g, "").replace(/```/g, "").trim();

        res.status(200).json({ mermaid });
    } catch (e) {
        console.error("AutoDraw failed", e);
        res.status(500).json({ error: "Failed to generate diagram" });
    }
};

export const analyzeEmotion = async (req, res) => {
    try {
        const { imageFile } = req.body;
        const aiModel = getModel();

        if (!aiModel || !imageFile) return res.status(200).json({ stressLevel: 50, text: "Medium (Focused)", actionableHint: null });

        const imagePart = {
            inlineData: {
                data: imageFile.split(",")[1], // strip the data uri header
                mimeType: "image/jpeg"
            }
        };

        const prompt = `You are a real-time FAANG psychological profiler. Analyze the software engineering candidate's facial expression from this webcam snap. Are they stressed? Panicked? Confused?
        Return ONLY valid JSON: {"stressLevel": 1-100, "text": "Short string like 'High (Stressed)' or 'Low (Calm)'", "actionableHint": "If stressed > 70 or confused, provide a very short proactive hint for their code, else null"}`;

        const result = await aiModel.generateContent([prompt, imagePart]);
        let rawText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        res.status(200).json(JSON.parse(rawText));
    } catch (e) {
        console.error("Emotion analysis failed", e);
        res.status(500).json({ error: "Failed to analyze emotion" });
    }
};

export const startGithubMock = async (req, res) => {
    try {
        const { githubUrl } = req.body;
        const aiModel = getModel();

        const prompt = `The candidate just provided this GitHub repository URL: ${githubUrl}.
        You are the Staff Engineer of this repository. Generate a synthetic "Architectural Feature Request" or "Bug Report" based on what you guess this repo does.
        Respond ONLY in JSON format: {"problemContext": "Detailed description of the pull request issue they need to solve", "firstMessage": "Your first chat message to them welcoming them to the PR."}`;

        const result = await aiModel.generateContent(prompt);
        let rawText = result.response.text().replace(/```json/g, "").replace(/```/g, "").trim();

        res.status(200).json(JSON.parse(rawText));
    } catch (e) {
        console.error("Github mock failed", e);
        res.status(500).json({ error: "Failed to mock GitHub PR" });
    }
};

// Feature #1: AI Code Review
export const reviewCode = async (req, res) => {
    try {
        const { code, language, problemTitle } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({
            complexity: "O(n)", spaceComplexity: "O(1)",
            issues: ["Add more comments"], suggestions: ["Consider edge cases"],
            rating: 7, summary: "Solid solution with room for optimization."
        });

        const prompt = `You are a senior FAANG engineer reviewing a ${language} solution to "${problemTitle}".
Code: \`\`\`${language}\n${code}\n\`\`\`
Analyze it and respond ONLY in valid JSON:
{
  "timeComplexity": "O(...)",
  "spaceComplexity": "O(...)",
  "issues": ["issue1", "issue2"],
  "suggestions": ["refactor tip1", "optimization tip2"],
  "rating": 1-10,
  "summary": "2-3 sentence overall review",
  "betterApproach": "Optional: describe a more optimal approach if one exists, else null"
}`;
        let rawText = "";
        try {
            rawText = await askAIWithFallback(prompt);
        } catch (err) {
            console.error("AI Generation Review Error:", err);
            return res.status(200).json({ rating: 7, summary: "AI Review temporarily rate limited/blocked on both lines. Make sure Ollama llama3 is online." });
        }

        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : "{}";
        let parsed = { rating: 7, summary: "Failed to parse AI review output." };
        try {
            parsed = JSON.parse(jsonString);
        } catch (err) {
            console.error("AI JSON Parse Error:", rawText);
        }
        res.status(200).json(parsed);
    } catch (e) {
        console.error("Code review failed", e);
        res.status(500).json({ error: "Review failed" });
    }
};

// Feature #3: ELI5 Problem Explainer
export const explainProblemELI5 = async (req, res) => {
    try {
        const { problemTitle, problemDescription } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ explanation: "Imagine you have a bag of numbers. You need to find two numbers in the bag that add up to a target number. Simple!" });

        const prompt = `Explain this coding problem in the simplest terms possible, like explaining to a 10-year-old using a fun real-world analogy. No jargon. Max 3 short paragraphs.
Problem: "${problemTitle}"
Description: "${problemDescription?.substring(0, 500)}"
Respond in JSON: {"explanation": "plain english explanation with analogy", "analogy": "1-line fun comparison", "keyInsight": "the core trick to solve it"}`;
        const result = await aiModel.generateContent(prompt);
        const rawText = result.response.text();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : "{}";
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        console.error("ELI5 failed", e);
        res.status(500).json({ error: "ELI5 failed" });
    }
};

// Feature #4: AI Study Plan
export const generateStudyPlan = async (req, res) => {
    try {
        const { skillScores, solvedCount, weakCategories, duration } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ plan: [{ day: 1, tasks: ["Solve 2 Easy Array problems", "Review Big O notation"] }] });

        const prompt = `Create a personalized ${duration || 7}-day coding interview study plan.
User stats: Solved ${solvedCount} problems. Weak areas: ${weakCategories?.join(", ") || "Graphs, DP"}.
Skill scores: ${JSON.stringify(skillScores || {})}.
Respond ONLY in JSON: {"plan": [{"day": 1, "theme": "Arrays & Hashing", "tasks": ["Solve 2 Easy arrays", "1 Medium sliding window"], "tip": "motivational tip"}, ...], "weeklyGoal": "summary"}`;
        const result = await aiModel.generateContent(prompt);
        const rawText = result.response.text();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : "{}";
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        console.error("Study plan failed", e);
        res.status(500).json({ error: "Study plan failed" });
    }
};

// Feature #2: AI Problem Generator
export const generateProblem = async (req, res) => {
    try {
        const { topic, difficulty, context } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ title: "Find Peak Element", description: "Find a peak in an array...", examples: [], constraints: [] });

        const prompt = `Generate a unique, original coding interview problem about "${topic}" at "${difficulty}" difficulty${context ? ` inspired by: ${context}` : ""}.
Respond EXTREMELY CONCISELY and BRIEFLY to ensure ultra-fast response time (under 1 second). Skip long headers or filler text.
Respond ONLY in valid JSON matching this exact structure:
{
  "title": "Problem Title",
  "description": "Short problem statement",
  "examples": [{"input": "...", "output": "...", "explanation": "..."}],
  "constraints": ["1 <= n <= 10^4"],
  "hint": "1 sentence hint",
  "approach": "1 sentence approach",
  "timeComplexity": "O(...)",
  "tags": ["Arrays"],
  "starterCode": {
    "javascript": "function solve(args) {\\n  // code\\n}",
    "python": "def solve(args):\\n    pass",
    "java": "class Solution {\\n    public void solve() {\\n    }\\n}"
  },
  "expectedOutput": {
    "javascript": "string_of_first_example_output",
    "python": "string_of_first_example_output",
    "java": "string_of_first_example_output"
  }
}`;
        let rawText = "";
        try {
            rawText = await askAIWithFallback(prompt);
        } catch (err) {
            console.error("AI Generation Review Error inside GenerateProblem:", err);
            return res.status(500).json({ error: "Generation failed on both Gemini and local Ollama interfaces." });
        }
        const jsonString = rawText.trim() || "{}";
        
        try {
            const cleaned = jsonString.replace(/,\s*([\]}])/g, '$1');
            const parsed = JSON.parse(cleaned);
            
            // Robust Mapping structure over AI JSON response keys
            const problem = {
                title: parsed.title || parsed.ProblemTitle || parsed.name || parsed.problemTitle || "AI Problem",
                description: parsed.description || `Missing 'description' from AI response!\nFound Keys: [${Object.keys(parsed).join(", ")}]\nFull JSON Response:\n${cleaned}`,
                examples: parsed.examples || parsed.testCases || parsed.cases || [],
                constraints: parsed.constraints || [],
                hint: parsed.hint || parsed.hints || "No hints available",
                approach: parsed.approach || parsed.strategy || "",
                timeComplexity: parsed.timeComplexity || "O(n)",
                tags: parsed.tags || [topic],
                starterCode: parsed.starterCode || {
                    javascript: "function solve(args) {\n  // your code\n}",
                    python: "def solve(args):\n    pass",
                    java: "class Solution {\n    public void solve() {\n    }\n}"
                },
                expectedOutput: parsed.expectedOutput || { javascript: "", python: "", java: "" }
            };
            
            res.status(200).json(problem);
        } catch (parseError) {
            console.error("Failed to parse AI JSON:", parseError, jsonString);
            res.status(200).json({ 
                title: "AI Response Parse Failed", 
                description: `AI Response Error: ${parseError.message}.\n\nRaw Answer Was:\n${jsonString || rawText}`,
                examples: [], constraints: [],
                starterCode: { javascript: "", python: "", java: "" },
                expectedOutput: { javascript: "", python: "", java: "" }
            });
        }
    } catch (e) {
        console.error("Problem generation failed", e);
        res.status(500).json({ error: `Generation failed: ${e.message}` });
    }
};

import { scoreLocalBehavioral, trainModel } from '../lib/behavioralClassifier.js';

// Feature: Behavioral AI Evaluator (Uses Local Trained Model with Gemini Hybrid)
export const evaluateBehavioral = async (req, res) => {
    try {
        const { question, answer } = req.body;
        
        // 🚀 PREFER LOCAL TRAINED MODEL WEIGHTS FOR HR 
        const localScore = scoreLocalBehavioral(answer);
        
        // Let's provide an absolute fallback to offline classifier immediately!
        // This cuts down Gemini pricing to 0 for behaviorals while remaining highly accurate.
        if (localScore) {
            return res.status(200).json(localScore);
        }

        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ score: 75 });
    } catch (e) {
        console.error("Behavioral local evaluation failed fallback", e);
        res.status(500).json({ error: "Evaluation analysis offline." });
    }
};

// Feature #12: Smart Flashcard Generator
export const generateFlashcards = async (req, res) => {
    try {
        const { problemTitle, code, notes, concept } = req.body;
        const aiModel = getModel();
        const prompt = `Create 3 spaced-repetition flashcards from this coding problem session.
Problem: "${problemTitle}", Key concept: "${concept || 'algorithm'}"
User's code: \`\`\`\n${code?.substring(0, 500) || ""}\n\`\`\`
Notes: "${notes || ""}"
Respond ONLY in JSON: {"cards": [{"question": "Q?", "answer": "A.", "category": "Algorithm|Complexity|Pattern|Gotcha"}]}`;

        let cards = [{ question: "What is the key insight inside algorithm?", answer: "Always check edge cases and scale complexity limits.", category: "Algorithm" }];
        try {
            const result = await aiModel.generateContent(prompt);
            const rawText = result.response.text();
            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            const jsonString = jsonMatch ? jsonMatch[0] : "{}";
            cards = JSON.parse(jsonString).cards || cards;
        } catch (e) {
            console.error("Flashcards AI parse failure fallback:", e);
        }
        res.status(200).json({ cards });
    } catch (e) {
        console.error("Flashcard generation failed", e);
        res.status(500).json({ error: "Flashcard generation failed" });
    }
};


// 🚀 4. Real Resume Upload & Dynamic Generation (Pass Config)
export const startGauntlet = async (req, res) => {
    try {
        const { role, difficulty } = req.body;
        const file = req.file;

        if (!role || !difficulty || !file) {
            return res.status(400).json({ error: "Missing role, difficulty, or resume PDF." });
        }

        const pdfData = await pdfParse(file.buffer);
        const resumeText = pdfData.text.trim();

        // 🚀 PREFER LOCAL OLLAMA FIRST (No early model exit here)
        
        const prompt = `You are an AI Interview Orchestrator.
Your job is to generate a FULL personalized interview blueprint based on the candidate's core parameters.

Candidate Context:
- Role: ${role}
- Difficulty: ${difficulty}
- Resume Text: ${resumeText.substring(0, 3000)}

---

STEP 1: Analyze Candidate
Extract:
- Key skills (React, Node, ML, etc.)
- Project domains (e.g., ticket systems, ecommerce)
- Experience level

---

STEP 2: Generate Personalized Interview Plan
Return STRICT valid JSON using this exact schema:

{
  "aptitude": [
    {
      "question": "Generate EXACTLY 5 custom aptitude or logical questions (Indices 1 to 5) tailored strictly to their resume tech stack.",
      "options": [
        "Custom, plausible answer option 1 covering the problem context.",
        "Custom, plausible answer option 2 covering the problem context.",
        "Custom, plausible answer option 3 covering the problem context.",
        "Custom, plausible answer option 4 covering the problem context."
      ],
      "answer": "The EXACT string content of the correct option choice here."
    }
  ],

  "coding": [
    {
      "title": "A custom problem title (Problem 1).",
      "description": "Generate EXACTLY 2 distinct hard-level DSA problems tailored for their context. Problem 1 description.",
      "difficulty": "Hard",
      "starter_code": "Javascript starter skeleton setup"
    }
  ],

  "ml_concepts_start": "Personalized Hard startup AI question prompt tailored strictly to their resume tech stack. Assume 5-6 hard difficulty question increments dialogues loop.",

  "case_study": {
    "problem": "Generate a unique real-world business case study problem matching their industry or project domain background.",
    "context": "Comprehensive context breakdown."
  },

  "system_design": {
    "problem": "Architect a unique scalable system design prompt (Hard difficulty) matching their background.",
    "constraints": "Strict scaling limits guideline."
  },

  "debugging": [
    {
      "file_name": "filename.ts",
      "buggy_code": "Provide EXACTLY 2 distinct buggy/vulnerable snippets tailored strictly to their resume tech stack. Problem 1 buggy snippet.",
      "bug_explanation": "Explain logic bug setup context for analysis review."
    }
  ],

  "resumeSummary": "A brutal critical analysis paragraph.",

  "pair_programming": {
    "problem": "Detailed custom live pair programming scenario matching their background.",
    "starter_code": "Starter skeleton structure"
  }
}

---

RULES:
1. ITEM SPECS: aptitute MUST list exactly 5 MCQs. coding MUST list exactly 2 hard DS problems inside array state. debugging MUST list exactly 2 bug snippets inside array state.
2. DIFFICULTY: STRICTLY Hard/FAANG complexity levels for all technical dialogue nodes.
3. PERSONALIZATION: Focus strictly on their skills and role. Avoid generic textbooks questions.
4. DYNAMIC GENERATION: DO NOT use the exact placeholder text provided inside the schema template. Every field MUST be uniquely generated and tailored for this candidate (No literal match).
5. SPEED & CONCISENESS (CRITICAL FOR LOCAL MODELS): Keep descriptions, scenario framing, and summaries extremely brief and compact. Use max 1-2 short sentences for describing problems. Skip filler text or long setup blocks for faster generation.

OUTPUT STRICT JSON ONLY.`;

        let generatedConfig;
        try {
            const rawJson = await askAIWithFallback(prompt);
            const jsonMatch = rawJson ? rawJson.match(/\{[\s\S]*\}/) : null;
            const jsonString = jsonMatch ? jsonMatch[0] : "{}";
            generatedConfig = JSON.parse(jsonString);
        } catch (parseError) {
             console.error("Gauntlet Prompt Prompt Parse/Gen Failure:", parseError);
             generatedConfig = {
                "aptitude": [
                  { 
                    "question": "A system handles 10,000 requests per second. If average latency is 200ms, what is the concurrent request count according to Little's Law?", 
                    "options": ["1,000 requests", "2,000 requests", "5,000 requests", "10,000 requests"], 
                    "answer": "2,000 requests" 
                  }
                ],
                "coding": {
                  "title": "Design a Rate Limiter",
                  "description": "Design an API Rate Limiter mapping time and counts.",
                  "difficulty": "Medium",
                  "starter_code": "class RateLimiter {\n  allowRequest(userId) {\n    // code\n  }\n}"
                },
                "ml_concepts_start": "Explain when to optimize for Precision over Recall using a medical diagnostics use case.",
                "case_study": {
                  "problem": "Spam Detection Pipeline",
                  "context": "Build an end-to-end ML architecture for 1B active daily users."
                },
                "system_design": {
                  "problem": "Design a Distributed Message Broker",
                  "constraints": "Strict scaling limits guidelines (e.g. 1M QPS)"
                },
                "resumeSummary": "The AI analyzer is calibrating off baseline rates. Let's start on optimized engineering critique layers.",
                "pair_programming": {
                  "problem": "Live coding LRU Cache context",
                  "starter_code": "class LRUCache {}"
                }
             };
        }

        res.status(200).json({
            message: "Gauntlet Initialized Successfully",
            parsedResumeLength: resumeText.length,
            configuration: generatedConfig
        });
    } catch (error) {
        console.error("Gauntlet Start Error:", error);
        res.status(500).json({ error: "Failed to initialize Gauntlet AI Session." });
    }
}

import { GauntletSession } from "../models/gauntlet.model.js";
import { requireAuth } from "@clerk/express"; // Depending on how you auth, mock it if needed

export const saveGauntletSession = async (req, res) => {
   try {
       const sessionData = req.body;
       const userId = req.auth?.userId || "anonymous_user"; // Optional fallback based on auth

       const newSession = new GauntletSession({
           userId,
           targetRole: sessionData.targetRole,
           difficulty: sessionData.difficulty,
           finalScore: sessionData.finalScore,
           roundScores: sessionData.roundScores,
           aiFeedback: sessionData.aiFeedback
       });

       await newSession.save();
       res.status(201).json({ message: "Session saved to database.", sessionId: newSession._id });
   } catch (error) {
       console.error("Save Session Error:", error);
       res.status(500).json({ error: "Failed to save Gauntlet Session." });
   }
}

export const getGauntletLeaderboard = async (req, res) => {
    try {
        const topSessions = await GauntletSession.find()
            .sort({ finalScore: -1 })
            .limit(10)
            .select("userId targetRole difficulty finalScore completedAt");
        
        // Mock name aggregation since we don't hold names in GauntletSession 
        // In real prod, we fetch User objects from Clerk via webhook
        const leaderboard = topSessions.map((session, index) => ({
            rank: index + 1,
            id: session._id,
            userId: session.userId,
            score: session.finalScore,
            role: session.targetRole,
            date: session.completedAt,
            name: "Candidate_" + session.userId.substring(session.userId.length - 4)
        }));

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: "Failed to load leaderboard." });
    }
}
