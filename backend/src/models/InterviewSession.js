import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    clerkId: {
      type: String,
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: true,
    },
    interviewType: {
      type: String,
      required: true,
    },
    duration: {
      type: Number, // in seconds
      required: true,
    },
    score: {
      type: Number,
      required: true,
    },
    feedback: {
      type: String,
      default: "",
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    chatLog: {
      type: [Object],
      default: [],
    },
    codeSnapshots: {
      type: [Object],
      default: [],
    },
    problemContext: {
      type: String,
      default: "",
    },
    finalCode: {
      type: String,
      default: "",
    },
    metrics: {
      fillerWords: { type: Number, default: 0 },
      stressLevel: { type: Number, default: 0 }, // average stress detected
      sentiment: { type: String, default: "Neutral" }
    },
    isPublic: {
      type: Boolean,
      default: false,
    }

  },
  { timestamps: true }
);

const InterviewSession = mongoose.model("InterviewSession", interviewSessionSchema);

export default InterviewSession;
