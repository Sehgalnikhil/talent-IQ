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
    // Production Feature Extensions
    submissions: {
      type: [Object], // { problemId, status, language, timeTaken, code, timestamp }
      default: []
    },
    personalBests: {
      type: Map,
      of: Number, // problemId -> seconds
      default: {}
    },
    flashcards: {
      type: [Object],
      default: []
    },
    aiCustomTracks: {
      type: [Object],
      default: []
    },
    speedrun: {
      elo: { type: Number, default: 1200 },
      wins: { type: Number, default: 0 },
      history: { type: [Object], default: [] }
    },
    pomodoroSessions: {
      type: Number,
      default: 0
    },
    studyPlan: {
      type: Object,
      default: null
    }
  },
  { timestamps: true } // createdAt, updatedAt
);

const User = mongoose.model("User", userSchema);

export default User;
