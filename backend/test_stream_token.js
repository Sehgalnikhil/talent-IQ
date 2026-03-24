import { StreamClient } from "@stream-io/node-sdk";
import { ENV } from "./src/lib/env.js";

const apiKey = ENV.STREAM_API_KEY;
const apiSecret = ENV.STREAM_API_SECRET;

async function test() {
    try {
        console.log("🚀 Testing Stream Video Token creation...");
        const client = new StreamClient(apiKey, apiSecret);
        const token = client.createToken({ user_id: "test_user_123" });
        console.log("✅ Stream Video Token:", token);
    } catch (e) {
        console.error("❌ Failed:", e.message);
    }
}

test();
