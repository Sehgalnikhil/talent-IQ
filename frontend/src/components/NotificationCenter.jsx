import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellIcon, XIcon, ZapIcon, TrophyIcon, FlameIcon, SwordsIcon, SparklesIcon } from "lucide-react";

function getNotifications() {
    const submissions = JSON.parse(localStorage.getItem("pastSubmissions") || "[]");
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    const notifications = [];

    // Build real notifications from actual user data
    if (solved.length >= 1) {
        notifications.push({
            id: "first-solve",
            text: `You solved your first problem! ${solved.length} total solved so far.`,
            icon: <TrophyIcon className="size-4 text-warning" />,
            time: "Achievement",
            read: true
        });
    }

    if (solved.length >= 10) {
        notifications.push({
            id: "ten-solves",
            text: "You've solved 10+ problems! You earned the 'Grinder' badge.",
            icon: <FlameIcon className="size-4 text-orange-500" />,
            time: "Achievement",
            read: false
        });
    }

    // Daily challenge reminder
    const today = new Date().toDateString();
    const dailySeed = new Date().getDate() + new Date().getMonth() * 31;
    const todaysSubmissions = submissions.filter(s => new Date(s.timestamp).toDateString() === today);
    if (todaysSubmissions.length === 0) {
        notifications.push({
            id: "daily",
            text: "Your Daily Challenge is waiting! Complete it before midnight to keep your streak.",
            icon: <ZapIcon className="size-4 text-primary" />,
            time: "Today",
            read: false
        });
    } else {
        notifications.push({
            id: "daily-done",
            text: `You made ${todaysSubmissions.length} submission(s) today. Keep going!`,
            icon: <SparklesIcon className="size-4 text-success" />,
            time: "Today",
            read: true
        });
    }

    // Recent submission notifications
    const recentSubs = submissions.slice(-3).reverse();
    recentSubs.forEach((sub, i) => {
        notifications.push({
            id: `sub-${i}`,
            text: `${sub.status} on "${sub.problemId}" in ${sub.language} (${sub.timeTaken})`,
            icon: sub.status === "Accepted"
                ? <TrophyIcon className="size-4 text-success" />
                : <SwordsIcon className="size-4 text-error" />,
            time: new Date(sub.timestamp).toLocaleDateString(),
            read: true
        });
    });

    return notifications;
}

function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        setNotifications(getNotifications());
    }, [open]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="btn btn-ghost btn-sm btn-circle relative"
            >
                <BellIcon className="size-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-error text-error-content text-[10px] font-bold rounded-full size-5 flex items-center justify-center animate-pulse">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <div className="fixed inset-0 z-[90]" onClick={() => setOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="absolute right-0 top-12 z-[100] w-80 bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden"
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
                                <h3 className="font-bold text-sm">Notifications</h3>
                                <button onClick={() => setOpen(false)} className="btn btn-ghost btn-xs btn-circle">
                                    <XIcon className="size-3" />
                                </button>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-6 text-center text-base-content/40 text-sm">No notifications yet</div>
                                ) : (
                                    notifications.map((n) => (
                                        <div
                                            key={n.id}
                                            className={`px-4 py-3 border-b border-base-200 flex gap-3 items-start ${!n.read ? "bg-primary/5" : ""}`}
                                        >
                                            <div className="mt-0.5 shrink-0">{n.icon}</div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm leading-snug">{n.text}</p>
                                                <p className="text-[10px] font-bold text-base-content/40 mt-1 uppercase">{n.time}</p>
                                            </div>
                                            {!n.read && <div className="size-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

export default NotificationCenter;
