import User from "../models/User.js";
import getRazorpay from "../lib/razorpay.js";
import crypto from "crypto";



/**
 * Fetch current user's credit balance and handle auto-replenish if 24h passed.
 */
export const getCreditBalance = async (req, res) => {
    try {
        const clerkId = req.auth.userId;
        if (!clerkId) return res.status(401).json({ error: "Unauthorized" });

        let user = await User.findOne({ clerkId });
        if (!user) {
            // Implicitly create if missing
            user = await User.create({
                clerkId,
                name: "Candidate_" + clerkId.substring(clerkId.length - 4),
                email: clerkId + "@placeholder.com"
            });
        }

        // Check for 24h replenishment (500 bonus, capped at 5000)
        const now = new Date();
        const lastRefresh = new Date(user.lastCreditRefresh || 0);
        const hoursSinceRefresh = (now - lastRefresh) / (1000 * 60 * 60);

        if (hoursSinceRefresh >= 24) {
            const newCredits = Math.min(5000, user.credits + 500);
            user.credits = newCredits;
            user.lastCreditRefresh = now;
            await user.save();
        }

        res.status(200).json({ 
            credits: user.credits, 
            lastRefresh: user.lastCreditRefresh,
            nextRefreshIn: Math.max(0, 24 - hoursSinceRefresh)
        });
    } catch (error) {
        console.error("Credit Balance Error:", error);
        res.status(500).json({ error: "Failed to fetch credits" });
    }
};

/**
 * Razorpay: Create Order
 */
export const createOrder = async (req, res) => {
    try {
        const { amount, currency = "INR" } = req.body; // Amount in INR

        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_KEY_ID.includes("XXXX")) {
            return res.status(500).json({ 
                error: "Razorpay keys are missing in .env. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET." 
            });
        }

        const options = {

            amount: amount * 100, // Smallest unit (paise)
            currency,
            receipt: `receipt_${Date.now()}`
        };

        const rzp = getRazorpay();
        console.log(`[RAZORPAY_SYNC] Initializing with Node: ...${process.env.RAZORPAY_KEY_ID?.slice(-4)}`);
        
        const order = await rzp.orders.create(options);
        res.status(200).json(order);
    } catch (error) {
        console.error("Razorpay Order Error:", error);
        
        // Return descriptive error if possible
        const errorMessage = error.error?.description || error.message || "Order creation failed";
        res.status(500).json({ error: errorMessage });
    }

};

/**
 * Razorpay: Verify Payment
 */
export const verifyPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, credits } = req.body;
        const clerkId = req.auth.userId;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "key_secret_placeholder")
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // Payment verified
            const user = await User.findOne({ clerkId });
            if (!user) return res.status(404).json({ error: "User not found" });

            user.credits += Number(credits);
            await user.save();

            res.status(200).json({ success: true, message: "Payment verified successfully", newBalance: user.credits });
        } else {
            res.status(400).json({ success: false, message: "Invalid signature" });
        }
    } catch (error) {
        console.error("Payment Verification Error:", error);
        res.status(500).json({ error: "Verification failed" });
    }
};

/**
 * Purchase credits (Manual/Simulation Legacy - keeping for backward compatibility)
 */
export const purchaseCredits = async (req, res) => {

    try {
        const { amount, packId } = req.body;
        const clerkId = req.auth.userId;
        
        // In a real app, verify payment signature here
        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ error: "User not found" });

        user.credits += amount;
        await user.save();

        res.status(200).json({ success: true, newBalance: user.credits });
    } catch (error) {
        res.status(500).json({ error: "Purchase failed" });
    }
};

/**
 * Middleware/Helper to check and consume credits
 */
export const consumeCredits = async (clerkId, amount) => {
    const user = await User.findOne({ clerkId });
    if (!user) throw new Error("User not found");
    if (user.credits < amount) return false;

    user.credits -= amount;
    await user.save();
    return true;
};
