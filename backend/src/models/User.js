import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },
    problemsSolved: {
      type: [String],
      default: [],
    },
    points: {
      type: Number,
      default: 0,
    },
    streak: {
      type: Number,
      default: 0,
    },
    badge: {
      type: String,
      default: "Beginner",
    },
  },
  { timestamps: true } // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
