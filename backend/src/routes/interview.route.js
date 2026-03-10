import express from "express";
import { analyzeResume, chatWithInterviewer, evaluateCode, refactorCode, debugCode, getComplexity, getCoachHint, generateSkillReport, generateCustomTrack, runCodeAI } from "../controllers/interview.controller.js";

const router = express.Router();

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

export default router;
