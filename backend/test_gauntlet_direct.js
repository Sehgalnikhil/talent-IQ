import { startGauntlet } from "../backend/src/controllers/interview.controller.js";
import fs from "fs";

// Mock Express req/res
const req = {
    body: { role: "Software Engineer", difficulty: "FAANG Level" },
    file: { buffer: fs.readFileSync("/Users/nikhilsehgal/Downloads/talent-IQ-master/backend/package.json") } // Mock buffer
};

const res = {
    status: (code) => {
        console.log("Status Code:", code);
        return { json: (data) => console.log("Response:", JSON.stringify(data, null, 2)) };
    }
};

try {
    console.log("Starting debug execution...");
    await startGauntlet(req, res);
} catch (e) {
    console.error("Execution Exception:", e);
}
