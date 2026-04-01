import Razorpay from "razorpay";
import dotenv from "dotenv";
dotenv.config();

// Export as a function to ensure process.env is read after initialization
const getRazorpay = () => {
    return new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_placeholder",
        key_secret: process.env.RAZORPAY_KEY_SECRET || "key_secret_placeholder"
    });
};

export default getRazorpay;

