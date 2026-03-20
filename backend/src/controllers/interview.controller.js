import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI = null;
let model = null;

const getModel = () => {
    if (model) return model;
    try {
        if (process.env.GEMINI_API_KEY) {
            genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
            // Reverting back to 2.5-flash. The 1.5-flash model threw 404 for this specific API key configuration.
            model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
            return model;
        }
    } catch (error) {
        console.log("Error initializing Gemini:", error.message);
    }
    return null;
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

        const aiModel = getModel();
        if (!aiModel) {
            return res.status(200).json({
                reply: "I am running in Mock Mode because GEMINI_API_KEY is not set. But your code looks interesting. Can you tell me your time complexity?",
                isCodeRequested: false
            });
        }

        let modeInstructions = "";
        if (interviewType === "Behavioral") {
            modeInstructions = `THIS IS A STRICT BEHAVIORAL INTERVIEW. The Hiring Manager should dominate the conversation. 
            When evaluating answers, you MUST look for the S.T.A.R. method (Situation, Task, Action, Result). If they miss the 'Result' or 'Action', explicitly call it out or ask a follow up.`;
        } else if (interviewType === "GitHubPR") {
            modeInstructions = `THIS IS A GITHUB PR ARCHITECTURE REVIEW Mock. 
            The candidate is writing code to fix a synthetic issue in an existing repository. Critically analyze their architecture, separation of concerns, and potential merge conflicts.`;
        } else {
            modeInstructions = `The candidate is solving a standard DSA coding problem.`;
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

        const result = await aiModel.generateContent(systemPrompt);
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

export const getComplexity = async (req, res) => {
    try {
        const { code } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ time: "O(n)", space: "O(n)" });

        const prompt = `Evaluate the strict Time and Space complexity of this code. Return ONLY JSON format: {"time": "O(N)", "space": "O(1)"}\n\n${code}`;
        const result = await aiModel.generateContent(prompt);
        const jsonString = result.response.text().replace(/```json\n?|```/gi, "").trim();
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) { res.status(500).json({ error: "Failed complexity" }); }
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
        const aiModel = getModel();
        if (!aiModel) {
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
        const result = await aiModel.generateContent(prompt);
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
        const result = await aiModel.generateContent(prompt);
        const rawText = result.response.text();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : "{}";
        res.status(200).json(JSON.parse(jsonString));
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
Respond ONLY in JSON:
{
  "title": "Problem Title",
  "description": "Full problem statement with context",
  "examples": [{"input": "...", "output": "...", "explanation": "..."}],
  "constraints": ["1 <= n <= 10^5", "..."],
  "hint": "A subtle hint without giving away the solution",
  "approach": "The recommended algorithmic approach",
  "timeComplexity": "Expected: O(...)",
  "tags": ["Arrays", "Hash Map"]
}`;
        const result = await aiModel.generateContent(prompt);
        const rawText = result.response.text();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : "{}";
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        console.error("Problem generation failed", e);
        res.status(500).json({ error: `Generation failed: ${e.message}` });
    }
};

// Feature #12: Smart Flashcard Generator
export const generateFlashcards = async (req, res) => {
    try {
        const { problemTitle, code, notes, concept } = req.body;
        const aiModel = getModel();
        if (!aiModel) return res.status(200).json({ cards: [{ question: "What is the key insight?", answer: "Use a hash map for O(1) lookup." }] });

        const prompt = `Create 3 spaced-repetition flashcards from this coding problem session.
Problem: "${problemTitle}", Key concept: "${concept || 'algorithm'}"
User's code: \`\`\`\n${code?.substring(0, 500) || ""}\n\`\`\`
Notes: "${notes || ""}"
Respond ONLY in JSON: {"cards": [{"question": "Q?", "answer": "A.", "category": "Algorithm|Complexity|Pattern|Gotcha"}]}`;
        const result = await aiModel.generateContent(prompt);
        const rawText = result.response.text();
        const jsonMatch = rawText.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : "{}";
        res.status(200).json(JSON.parse(jsonString));
    } catch (e) {
        console.error("Flashcard generation failed", e);
        res.status(500).json({ error: "Flashcard generation failed" });
    }
};
