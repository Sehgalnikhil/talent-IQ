import User from "../models/User.js";

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
        const { clerkId } = req.auth; // Passed from Clerk middleware
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
        const { clerkId } = req.auth;
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
        const { clerkId } = req.auth;
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
