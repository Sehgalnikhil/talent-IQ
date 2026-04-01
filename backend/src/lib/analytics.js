import User from "../models/User.js";

/**
 * Updates user analytics (Streak, ELO, Points) based on a completed session.
 * @param {string} clerkId - The user's unique Clerk ID.
 * @param {object} sessionData - Data from the completed session (score, etc).
 */
export const updateUserAnalytics = async (clerkId, sessionData) => {
  try {
    const user = await User.findOne({ clerkId });
    if (!user) return;

    const sessionScore = sessionData.score || 0;
    const now = new Date();
    const lastSessionDate = user.lastInterviewAt;

    // 1. UPDATE STREAK
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const isNewDay = !lastSessionDate || 
      new Date(lastSessionDate).toDateString() !== now.toDateString();
    
    const timeDiff = now - (lastSessionDate || now);

    if (isNewDay) {
        if (lastSessionDate && timeDiff > oneDayInMs * 2) {
            // Missed more than 1 day, reset streak
            user.streak = 1;
        } else {
            // New day within 48h, increment streak
            user.streak += 1;
        }
    }
    
    // Update the baseline for next session
    user.lastInterviewAt = now;


    // 2. UPDATE ELO (Simulated ELO adjustment based on score)
    // Baseline: 50 is neutral. >50 gains ELO, <50 loses ELO.
    const K_FACTOR = 20; // Max ELO change per session
    const normalizedScore = sessionScore / 100; // 0 to 1
    const expectedScore = 0.5; // Average expectation
    const eloChange = Math.round(K_FACTOR * (normalizedScore - expectedScore));
    
    user.speedrun = user.speedrun || { elo: 1200, wins: 0, history: [] };
    user.speedrun.elo = Math.max(800, user.speedrun.elo + eloChange); // Floor at 800

    if (sessionScore >= 70) {
        user.speedrun.wins += 1;
    }

    // 3. UPDATE POINTS & BADGE
    user.points += sessionScore;

    if (user.points > 10000) user.badge = "Legend";
    else if (user.points > 5000) user.badge = "Elite";
    else if (user.points > 1000) user.badge = "Pro";
    else if (user.points > 500) user.badge = "Learner";

    // 4. ADD TO SUBMISSIONS/HISTORY
    user.submissions.push({
        type: "interview",
        company: sessionData.company,
        score: sessionScore,
        timestamp: now
    });

    await user.save();
    console.log(`✅ Analytics synchronized for user ${clerkId}: Streak ${user.streak}, ELO ${user.speedrun.elo}`);
  } catch (error) {
    console.error("❌ Analytics Update Failed:", error);
  }
};
