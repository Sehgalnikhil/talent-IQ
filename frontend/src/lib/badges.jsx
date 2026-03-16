// Achievement & Badge System — Feature #20
// All data is derived from real localStorage: solvedProblems, pastSubmissions, speedrunWins, interviewScores
import { TrophyIcon, FlameIcon, ZapIcon, BrainCircuitIcon, CrownIcon, SwordsIcon, CalendarIcon, MicIcon, StarIcon, TargetIcon } from "lucide-react";

const BADGE_DEFINITIONS = [
    {
        id: "first-blood",
        name: "First Blood",
        description: "Solve your first problem",
        icon: <ZapIcon className="size-5" />,
        color: "text-primary",
        bg: "bg-primary/10 border-primary/20",
        check: (data) => data.solvedCount >= 1,
    },
    {
        id: "speed-demon",
        name: "Speed Demon",
        description: "Solve a problem in under 2 minutes",
        icon: <FlameIcon className="size-5" />,
        color: "text-orange-500",
        bg: "bg-orange-500/10 border-orange-500/20",
        check: (data) => data.submissions.some(s => {
            const ms = parseFloat(s.timeTaken);
            return s.status === "Accepted" && ms < 120000;
        }),
    },
    {
        id: "five-streak",
        name: "On Fire",
        description: "Solve 5 problems",
        icon: <FlameIcon className="size-5" />,
        color: "text-error",
        bg: "bg-error/10 border-error/20",
        check: (data) => data.solvedCount >= 5,
    },
    {
        id: "ten-solver",
        name: "Grinder",
        description: "Solve 10 problems",
        icon: <StarIcon className="size-5" />,
        color: "text-warning",
        bg: "bg-warning/10 border-warning/20",
        check: (data) => data.solvedCount >= 10,
    },
    {
        id: "twenty-five",
        name: "Quarter Century",
        description: "Solve 25 problems",
        icon: <TrophyIcon className="size-5" />,
        color: "text-amber-500",
        bg: "bg-amber-500/10 border-amber-500/20",
        check: (data) => data.solvedCount >= 25,
    },
    {
        id: "century-club",
        name: "Century Club",
        description: "Solve 100 problems",
        icon: <CrownIcon className="size-5" />,
        color: "text-warning",
        bg: "bg-warning/10 border-warning/20",
        check: (data) => data.solvedCount >= 100,
    },
    {
        id: "arena-warrior",
        name: "Arena Warrior",
        description: "Win a Speedrun match",
        icon: <SwordsIcon className="size-5" />,
        color: "text-error",
        bg: "bg-error/10 border-error/20",
        check: (data) => data.speedrunWins >= 1,
    },
    {
        id: "arena-champ",
        name: "Arena Champion",
        description: "Win 10 Speedrun matches",
        icon: <SwordsIcon className="size-5" />,
        color: "text-error",
        bg: "bg-error/10 border-error/20",
        check: (data) => data.speedrunWins >= 10,
    },
    {
        id: "interview-ace",
        name: "Interview Ace",
        description: "Complete an AI Interview session",
        icon: <MicIcon className="size-5" />,
        color: "text-info",
        bg: "bg-info/10 border-info/20",
        check: (data) => data.interviewCount >= 1,
    },
    {
        id: "polyglot",
        name: "Polyglot",
        description: "Submit code in 2+ languages",
        icon: <BrainCircuitIcon className="size-5" />,
        color: "text-secondary",
        bg: "bg-secondary/10 border-secondary/20",
        check: (data) => {
            const langs = new Set(data.submissions.map(s => s.language));
            return langs.size >= 2;
        },
    },
];

export function getUserBadgeData() {
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    const submissions = JSON.parse(localStorage.getItem("pastSubmissions") || "[]");
    const speedrunWins = parseInt(localStorage.getItem("speedrunWins") || "0", 10);
    const interviewCount = parseInt(localStorage.getItem("interviewCount") || "0", 10);

    return {
        solvedCount: solved.length,
        submissions,
        speedrunWins,
        interviewCount,
    };
}

export function getEarnedBadges() {
    const data = getUserBadgeData();
    return BADGE_DEFINITIONS.map(badge => ({
        ...badge,
        earned: badge.check(data),
    }));
}

export function getEarnedCount() {
    return getEarnedBadges().filter(b => b.earned).length;
}

export { BADGE_DEFINITIONS };
