import express from "express";
import { getLeaderboard, getUserStats, updateUserStats } from "../controllers/user.controller.js";
import { requireAuth } from "@clerk/express"; // Ensure authenticated user

const router = express.Router();

router.get("/leaderboard", getLeaderboard);
router.get("/stats", requireAuth(), getUserStats);
router.post("/stats/update", requireAuth(), updateUserStats);

export default router;
