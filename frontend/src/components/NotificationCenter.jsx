import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    BellIcon, 
    XIcon, 
    ZapIcon, 
    TrophyIcon, 
    FlameIcon, 
    SwordsIcon, 
    SparklesIcon,
    BotIcon,
    CpuIcon,
    SatelliteIcon
} from "lucide-react";
import { useSocket } from "../context/SocketContext";
import toast from "react-hot-toast";

const getBaselineNotifications = () => {
    const submissions = JSON.parse(localStorage.getItem("pastSubmissions") || "[]");
    const solved = JSON.parse(localStorage.getItem("solvedProblems") || "[]");
    const notifications = [];

    if (solved.length >= 1) {
        notifications.push({
            id: "first-solve",
            text: `Matrix Access: You've solved your first problem. ${solved.length} total.`,
            icon: <TrophyIcon className="size-4 text-warning" />,
            type: "Achievement",
            read: true,
            time: "System Record"
        });
    }

    if (solved.length >= 10) {
        notifications.push({
            id: "ten-solves",
            text: "Status Elevated: 10+ solutions validated. 'Grinder' badge initialized.",
            icon: <FlameIcon className="size-4 text-orange-500" />,
            type: "Achievement",
            read: false,
            time: "Protocol Update"
        });
    }

    return notifications.reverse();
};

export default function NotificationCenter() {
    const [open, setOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const socket = useSocket();

    useEffect(() => {
        setNotifications(getBaselineNotifications());
    }, []);

    useEffect(() => {
        if (!socket) return;

        const handleNewNotif = (data) => {
            const newNotif = {
                id: Date.now(),
                text: data.message || "New Synchronized Consensus detected.",
                icon: data.type === 'problem' ? <SparklesIcon className="size-4 text-primary" /> : <BotIcon className="size-4 text-success" />,
                type: data.type === 'problem' ? "AI Lab" : "Neural Alert",
                read: false,
                time: "Inbound Live"
            };
            setNotifications(prev => [newNotif, ...prev.slice(0, 19)]);
            if (!open) toast.success(newNotif.text, { 
                icon: "🛰️", 
                className: "bg-base-100 text-base-content border border-base-content/10 shadow-2xl rounded-2xl font-black text-xs uppercase italic tracking-tighter"
            });
        };

        socket.on("global_notification", handleNewNotif);
        return () => socket.off("global_notification", handleNewNotif);
    }, [socket, open]);

    const unreadCount = notifications.filter(n => !n.read).length;

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <div className="relative">
            <button
                onClick={() => {
                    setOpen(!open);
                    if (!open) markAllRead();
                }}
                className="group p-2 rounded-xl transition-all duration-300 hover:bg-base-content/5 border border-transparent hover:border-base-content/10 relative"
            >
                <div className="relative">
                    <BellIcon className={`size-5 transition-transform duration-500 ${open ? "rotate-[-10deg]" : "group-hover:rotate-12"}`} />
                    {unreadCount > 0 && (
                        <>
                            <span className="absolute -top-2 -right-2 bg-primary text-primary-content text-[9px] font-black rounded-full size-4 flex items-center justify-center animate-pulse z-10 shadow-[0_0_10px_rgba(var(--color-primary),0.5)]">
                                {unreadCount}
                            </span>
                            <span className="absolute -top-2 -right-2 bg-primary rounded-full size-4 animate-ping opacity-20" />
                        </>
                    )}
                </div>
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-[100]" 
                            onClick={() => setOpen(false)} 
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 15, scale: 0.98, x: 50 }}
                            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.98, x: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="absolute top-full right-0 mt-6 z-[110] w-[400px] pointer-events-auto"
                        >
                            <div className="bg-base-100 backdrop-blur-3xl border border-base-content/10 rounded-[40px] shadow-4xl overflow-hidden flex flex-col max-h-[600px]">
                                {/* HEADER */}
                                <div className="px-8 pt-8 pb-6 border-b border-base-content/5 bg-gradient-to-br from-base-content/5 to-transparent">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <SatelliteIcon className="size-4 text-primary animate-pulse" />
                                                <h3 className="text-sm font-black italic tracking-tight uppercase text-base-content">Pulse Nucleus</h3>
                                            </div>
                                            <p className="text-[9px] font-black opacity-30 uppercase tracking-[0.4em] mt-1 text-base-content">Live Node Synchronizer</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[9px] font-black px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full">{notifications.length} Nodes</span>
                                            <button onClick={() => setOpen(false)} className="size-8 rounded-lg hover:bg-base-content/5 flex items-center justify-center transition-colors">
                                                <XIcon className="size-4 opacity-40 hover:opacity-100 text-base-content" />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* NOTIFICATIONS LIST */}
                                <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-3">
                                    {notifications.length > 0 ? (
                                        <AnimatePresence mode="popLayout">
                                            {notifications.map((n, i) => (
                                                <motion.div
                                                    key={n.id}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    layout
                                                    className={`group p-5 rounded-3xl border transition-all duration-500 overflow-hidden relative cursor-default ${n.read ? "bg-base-content/[0.02] border-base-content/5 opacity-60" : "bg-base-content/5 border-base-content/10 shadow-lg"}`}
                                                >
                                                    {/* Glow accent for unread */}
                                                    {!n.read && <div className="absolute inset-0 bg-primary/5 -z-10 animate-pulse" />}
                                                    
                                                    <div className="flex gap-4">
                                                        <div className={`size-11 rounded-2xl flex items-center justify-center shrink-0 border border-base-content/5 ${n.read ? "bg-base-content/5 text-base-content/40" : "bg-primary/10 text-primary"}`}>
                                                            {n.icon}
                                                        </div>
                                                        <div className="flex flex-col gap-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className={`text-[10px] font-black uppercase tracking-widest ${n.read ? "text-base-content/40" : "text-primary"}`}>{n.type}</span>
                                                                <span className="text-[8px] font-bold opacity-30 uppercase tracking-widest text-base-content">/ {n.time} /</span>
                                                            </div>
                                                            <p className={`text-xs font-medium leading-relaxed tracking-tight ${n.read ? "text-base-content/40" : "text-base-content"}`}>{n.text}</p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </AnimatePresence>
                                    ) : (
                                        <div className="py-20 text-center space-y-4">
                                            <CpuIcon className="size-10 mx-auto opacity-10 animate-spin-slow" />
                                            <p className="text-[10px] font-black uppercase tracking-[0.6em] opacity-30">Sensors Idle: No Consensus Signals</p>
                                        </div>
                                    )}
                                </div>

                                {/* FOOTER */}
                                <div className="p-6 bg-white/[0.02] border-t border-white/5 flex items-center justify-between gap-4">
                                     <div className="flex items-center gap-2 px-4 py-2 bg-black/60 border border-white/5 rounded-2xl">
                                         <div className="size-1.5 rounded-full bg-success animate-ping" />
                                         <span className="text-[9px] font-black uppercase tracking-widest opacity-40">Uplink Stable</span>
                                     </div>
                                     <button onClick={() => setNotifications([])} className="text-[9px] font-black uppercase tracking-widest text-error hover:opacity-100 opacity-40 transition-opacity">Defrag_Matrix</button>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
