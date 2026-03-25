import { io } from "../socket.js";

export const broadcastNotification = (message, type = "system") => {
    if (!io) {
        console.warn("SocketIO not initialized. Notification suppressed:", message);
        return;
    }
    
    io.emit("global_notification", {
        message,
        type,
        timestamp: new Date().toISOString()
    });
};
