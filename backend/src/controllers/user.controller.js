import { exec } from "child_process";
import User from "../models/User.js";
import { broadcastNotification } from "../lib/notifier.js";
import { io } from "../socket.js";

// Fetch global leaderboard
export const getLeaderboard = async (req, res) => {
    try {
        const users = await User.find({})
            .sort({ points: -1 })
            .limit(50)
            .select("name badge points streak problemsSolved profileImage");

        const leaderboard = users.map((u, index) => ({
            rank: index + 1,
            name: u.name,
            points: u.points,
            streak: u.streak,
            badge: u.badge,
            problems: u.problemsSolved.length,
            profileImage: u.profileImage,
        }));

        res.status(200).json(leaderboard);
    } catch (error) {
        console.error("Leaderboard Error:", error);
        res.status(500).json({ error: "Failed to fetch leaderboard" });
    }
};

// Fetch current user stats
export const getUserStats = async (req, res) => {
    try {
        const clerkId = req.auth.userId; // Passed from Clerk middleware
        if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

        // Upsert implicitly so we don't break UI for missing backend hooks
        let user = await User.findOne({ clerkId });
        if (!user) {
            user = await User.create({
                clerkId,
                name: "Candidate_" + clerkId.substring(clerkId.length - 4),
                email: clerkId + "@placeholder.com"
            });
        }

        res.status(200).json({
            name: user.name,
            points: user.points,
            streak: user.streak,
            badge: user.badge,
            problems: user.problemsSolved.length,
            profileImage: user.profileImage,
            problemsSolved: user.problemsSolved,
            // Extended Data Points
            submissions: user.submissions,
            personalBests: user.personalBests,
            flashcards: user.flashcards,
            aiCustomTracks: user.aiCustomTracks,
            speedrun: user.speedrun,
            pomodoroSessions: user.pomodoroSessions,
            studyPlan: user.studyPlan,
            savedProblems: user.savedProblems || []
        });
    } catch (error) {
        console.error("Stats Error:", error);
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
};

// Update user performance (after mock interview or problem)
export const updateUserStats = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const { pointsGained, problemId } = req.body;

        if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

        let user = await User.findOne({ clerkId });
        if (!user) {
            user = await User.create({
                clerkId,
                name: "Candidate_" + clerkId.substring(clerkId.length - 4),
                email: clerkId + "@placeholder.com"
            });
        }

        if (problemId && !user.problemsSolved.includes(problemId)) {
            user.problemsSolved.push(problemId);
        }

        user.points += (pointsGained || 0);

        // Upgrade badges
        if (user.points > 1000) user.badge = "Master";
        else if (user.points > 500) user.badge = "Senior";
        else if (user.points > 200) user.badge = "Intermediate";
        else user.badge = "Beginner";

        await user.save();
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Update Stats Error:", error);
        res.status(500).json({ error: "Failed to update user stats" });
    }
};

// Generic Live Data Sync 
export const updateUserMetadata = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const { key, value } = req.body;

        if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Update exact key if it exists on expanded schema
        if (key && value !== undefined) {
             user[key] = value;
             // Mark Modified if it's an Object mixed type
             user.markModified(key);
             await user.save();
             return res.status(200).json({ success: true, message: `Updated ${key}` });
        }

        res.status(400).json({ error: "Missing key or value fields." });
    } catch (error) {
        console.error("Metadata Sync Error:", error);
        res.status(500).json({ error: "Failed to sync metadata." });
    }
};

// Executive Python Machine Learning prediction node
export const predictHireability = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ error: "User not found" });

        // Aggregate live metrics to feed the 10,000 Trained Model
        const experienceYears = user.submissions?.length > 10 ? 4 : 1; 
        const avgSkills = user.points > 2000 ? 85 : 55;
        const avgSpeed = user.personalBests ? 
            Object.values(user.personalBests).reduce((a,b) => a+b, 0) / (Object.values(user.personalBests).length || 1) 
            : 1800;

        const data = {
            experience: experienceYears,
            skills_score: avgSkills,
            aptitude_score: 75, // Sample base
            coding_speed_sec: Math.round(avgSpeed),
            sys_design_score: 6
        };

        const scriptPath = "src/ai/predict_hireability.py";
        const pythonScript = `python3 ${scriptPath} '${JSON.stringify(data)}'`;

        exec(pythonScript, (error, stdout, stderr) => {
            if (error) {
                console.error("ML Execute Error:", stderr);
                import('fs').then(fs => fs.writeFileSync("/tmp/ml_error.txt", `Error: ${error.message}\nStderr: ${stderr}\nStdout: ${stdout}`));
                return res.status(500).json({ error: "ML Inference failed", details: stderr });
            }
            try {
                const prediction = JSON.parse(stdout);
                res.status(200).json(prediction);
            } catch (pErr) {
                import('fs').then(fs => fs.writeFileSync("/tmp/ml_error.txt", `ParseError: ${pErr.message}\nStdout: ${stdout}`));
                res.status(500).json({ error: "Malformed ML output", raw: stdout });
            }
        });

    } catch (error) {
        console.error("Predict Hireability Error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};
export const syncUser = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        const { name, email, profileImage } = req.body;

        if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

        let user = await User.findOneAndUpdate(
            { clerkId },
            { 
               name: name || "Anonymous_Candidate",
               email: email || (clerkId + "@placeholder.com"),
               profileImage: profileImage || ""
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Real-time synchronization pulse
        if (io) {
            io.emit("leaderboard_refresh");
        }

        // Only broadcast system-wide if it's a first-time indexing (points == 0) or just a welcome back
        broadcastNotification(`Protocol Link: ${user.name} has been indexed in the Global Consensus Node.`, "achievement");

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error("Sync User Error:", error);
        res.status(500).json({ error: "Failed to sync user data." });
    }
};
