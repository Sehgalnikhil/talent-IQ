import { Server } from "socket.io";

export let io;

const queue = []; // users waiting for match
const rooms = new Map(); // roomId -> { users: [], problemId, state }

export function initSocket(server, clientUrl) {
    io = new Server(server, {
        cors: {
            origin: clientUrl,
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("A user connected to SocketIO:", socket.id);

        // matchmaking
        socket.on("join_matchmaking", (data) => {
            const { userId, name } = data;

            // if already in queue, ignore
            if (queue.find(u => u.socketId === socket.id)) return;

            const userObj = { socketId: socket.id, userId, name };
            queue.push(userObj);

            console.log(`User ${name} joined matchmaking. Queue size: ${queue.length}`);

            if (queue.length >= 2) {
                // match them!
                const player1 = queue.shift();
                const player2 = queue.shift();

                const roomId = `room_${Date.now()}`;

                // Pick a random problem (just passing an ID since frontend has the data)
                const problemsList = ["two-sum", "valid-parentheses", "merge-two-sorted-lists", "contains-duplicate", "missing-number"];
                const randomProblem = problemsList[Math.floor(Math.random() * problemsList.length)];

                rooms.set(roomId, {
                    players: {
                        [player1.socketId]: { ...player1, progress: 0, code: "", status: "playing" },
                        [player2.socketId]: { ...player2, progress: 0, code: "", status: "playing" }
                    },
                    problemId: randomProblem,
                    status: "active"
                });

                // make sockets join room
                const socket1 = io.sockets.sockets.get(player1.socketId);
                const socket2 = io.sockets.sockets.get(player2.socketId);

                if (socket1) socket1.join(roomId);
                if (socket2) socket2.join(roomId);

                // Notify both players
                io.to(roomId).emit("match_found", {
                    roomId,
                    problemId: randomProblem,
                    players: Object.values(rooms.get(roomId).players)
                });

                console.log(`Match created: Room ${roomId}`);
            }
        });

        socket.on("create_private_match", (data) => {
            const { userId, name } = data;
            const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();

            const problemsList = ["two-sum", "valid-parentheses", "merge-two-sorted-lists", "contains-duplicate", "missing-number"];
            const randomProblem = problemsList[Math.floor(Math.random() * problemsList.length)];

            rooms.set(roomId, {
                players: {
                    [socket.id]: { socketId: socket.id, userId, name, progress: 0, code: "", status: "playing" }
                },
                problemId: randomProblem,
                status: "waiting",
                isPrivate: true
            });

            socket.join(roomId);
            socket.emit("private_room_created", roomId);
            console.log(`Private Match created: ${roomId} by ${name}`);
        });

        socket.on("join_private_match", (data) => {
            const { userId, name, roomId } = data;
            const room = rooms.get(roomId);

            if (room && room.isPrivate && room.status === "waiting") {
                room.players[socket.id] = { socketId: socket.id, userId, name, progress: 0, code: "", status: "playing" };
                room.status = "active";
                socket.join(roomId);

                io.to(roomId).emit("match_found", {
                    roomId,
                    problemId: room.problemId,
                    players: Object.values(room.players)
                });
                console.log(`User ${name} joined private match: ${roomId}`);
            } else {
                socket.emit("opponent_disconnected", { reason: "Room not found or already full." });
            }
        });

        // Handle code progress update
        socket.on("code_update", ({ roomId, code, progress, metrics }) => {
            const room = rooms.get(roomId);
            if (room && room.players[socket.id]) {
                room.players[socket.id].code = code;
                room.players[socket.id].progress = progress;

                // Broadcast to the other player in the room
                socket.to(roomId).emit("opponent_update", {
                    socketId: socket.id,
                    code,
                    progress,
                    metrics
                });
            }
        });

        // Handle Taunts (emojis/messages)
        socket.on("send_taunt", ({ roomId, taunt }) => {
            socket.to(roomId).emit("receive_taunt", taunt);
        });

        // Handle Sabotage powerups
        socket.on("send_sabotage", ({ roomId, type }) => {
            socket.to(roomId).emit("receive_sabotage", type);
        });

        // Handle win
        socket.on("player_win", ({ roomId }) => {
            const room = rooms.get(roomId);
            if (room) {
                room.status = "finished";
                const winnerInfo = room.players[socket.id];
                
                // Global Pulse update
                io.emit("global_notification", {
                    message: `Arena Update: ${winnerInfo.name || "A_CODER"} has emerged VICTORIOUS in the Combat Protocol!`,
                    type: "achievement"
                });

                io.to(roomId).emit("match_over", {
                    winner: winnerInfo,
                    reason: "solved"
                });
            }
        });

        // --- WHITEBOARD MULTIPLAYER ---
        socket.on("join_whiteboard", (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined whiteboard ${roomId}`);
        });

        socket.on("draw_event", (data) => {
            socket.to(data.roomId).emit("draw_event", data);
        });

        socket.on("cursor_move", (data) => {
            socket.to(data.roomId).emit("cursor_move", { ...data, socketId: socket.id });
        });

        socket.on("clear_whiteboard", (roomId) => {
            socket.to(roomId).emit("clear_whiteboard");
        });
        // ------------------------------

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);

            // Remove from queue if there
            const qIndex = queue.findIndex(u => u.socketId === socket.id);
            if (qIndex !== -1) queue.splice(qIndex, 1);

            // Remove from room and notify opponent
            for (const [roomId, room] of rooms.entries()) {
                if (room.players[socket.id]) {
                    socket.to(roomId).emit("opponent_disconnected", { reason: "Opponent left the game." });
                    rooms.delete(roomId);
                    break;
                }
            }
        });
    });
}
