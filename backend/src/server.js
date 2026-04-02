import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import path from "path";
import cors from "cors";
import { serve } from "inngest/express";
import { clerkMiddleware } from "@clerk/express";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";
import { inngest, functions } from "./lib/inngest.js";

import chatRoutes from "./routes/chatRoutes.js";
import sessionRoutes from "./routes/sessionRoute.js";
import interviewRoutes from "./routes/interview.route.js";
import userRoutes from "./routes/user.route.js";
import creditRoutes from "./routes/credit.route.js";

import { initSocket } from "./socket.js";

const app = express();
const httpServer = http.createServer(app);

const __dirname = path.resolve();

// middleware
app.use(express.json());
// credentials:true meaning?? => server allows a browser to include cookies on request
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(clerkMiddleware()); // this adds auth field to request object: req.auth()

app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/users", userRoutes);
app.use("/api/credits", creditRoutes);


app.get("/health", (req, res) => {
  res.status(200).json({ msg: "api is up and running" });
});

app.get("/", (req, res) => {
  res.send("Backend API is running. Please access the frontend at http://localhost:5173");
});

// make our app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

const startServer = async () => {
    // 1. Start listening immediately so endpoints bind up full-time
    httpServer.listen(5055, () => console.log("Server is running on port: 5055"));

    try {
        await connectDB();
        
        // Initialize WebSockets
        initSocket(httpServer, ENV.CLIENT_URL);
    } catch (error) {
        console.error("💥 Error connecting to MongoDB:", error);
        console.log("⚠️ Server continues running in OFFLINE mode.");
    }
};

startServer();
