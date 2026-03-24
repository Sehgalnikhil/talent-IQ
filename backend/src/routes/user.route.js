import express from "express";
import { getLeaderboard, getUserStats, updateUserStats, updateUserMetadata, predictHireability } from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express"; // Ensure authenticated user

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/stats", requireAuth(), getUserStats);
router.post("/stats/update", requireAuth(), updateUserStats);
router.post("/metadata/update", requireAuth(), updateUserMetadata);
router.get("/predict-hireability", requireAuth(), predictHireability);

export default router;
