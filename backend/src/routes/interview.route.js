import express from "express";
import {
    analyzeResume, chatWithInterviewer, evaluateCode, refactorCode, debugCode,
    getComplexity, getCoachHint, generateSkillReport, generateCustomTrack, runCodeAI,
    analyzeDiagram, generateExecutionTrace, generateAutoDrawDiagram, analyzeEmotion,
    startGithubMock,
    // New features
    reviewCode, explainProblemELI5, generateStudyPlan, generateProblem, generateFlashcards, evaluateBehavioral,
    startGauntlet, saveGauntletSession, getGauntletLeaderboard
} from "../controllers/interview.controller.js";

const router = express.Router();

import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });

router.post("/start", upload.single('resume'), startGauntlet);
router.post("/save-session", saveGauntletSession);
router.get("/leaderboard", getGauntletLeaderboard);

router.post("/analyze-resume", analyzeResume);
router.post("/chat", chatWithInterviewer);
router.post("/evaluate", evaluateCode);
router.post("/refactor", refactorCode);
router.post("/debug", debugCode);
router.post("/complexity", getComplexity);
router.post("/coach", getCoachHint);
router.post("/skill-report", generateSkillReport);
router.post("/generate-track", generateCustomTrack);
router.post("/run-code", runCodeAI);
router.post("/analyze-diagram", analyzeDiagram);
router.post("/trace", generateExecutionTrace);
router.post("/auto-draw", generateAutoDrawDiagram);
router.post("/analyze-emotion", analyzeEmotion);
router.post("/analyze-emotion", analyzeEmotion);
router.post("/github-mock", startGithubMock);
// New feature routes
router.post("/code-review", reviewCode);
router.post("/eli5", explainProblemELI5);
router.post("/study-plan", generateStudyPlan);
router.post("/generate-problem", generateProblem);
router.post("/flashcards", generateFlashcards);
router.post("/evaluate-behavioral", evaluateBehavioral);

export default router;
