import express from "express";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(express.json());
app.use(clerkMiddleware());

app.get("/test", requireAuth(), (req, res) => {
    console.log("=== req.auth ===");
    console.log(JSON.stringify(req.auth, null, 2));
    res.json({ success: true, auth: req.auth });
});

app.listen(6000, () => {
    console.log("Mock server on port 6000");
});
