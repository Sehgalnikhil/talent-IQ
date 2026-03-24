import dotenv from "dotenv";
dotenv.config();

console.log("CLERK_SECRET_KEY EXISTS:", !!process.env.CLERK_SECRET_KEY);
console.log("CLERK_SECRET_KEY VALUE:", process.env.CLERK_SECRET_KEY);
console.log("CLERK_PUBLISHABLE_KEY EXISTS:", !!process.env.CLERK_PUBLISHABLE_KEY);
