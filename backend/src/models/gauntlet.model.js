import mongoose from "mongoose";

const gauntletSchema = new mongoose.Schema({
  userId: {
    type: String, // Clerk userId
    required: true,
  },
  targetRole: {
    type: String,
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  finalScore: {
    type: Number,
    required: true,
  },
  roundScores: {
    aptitude: { type: Number, default: 0 },
    coding: { type: Number, default: 0 },
    mlConcepts: { type: Number, default: 0 },
    caseStudy: { type: Number, default: 0 },
    systemDesign: { type: Number, default: 0 },
    debugging: { type: Number, default: 0 },
    resume: { type: Number, default: 0 },
    hrVoice: { type: Number, default: 0 },
    pairProgramming: { type: Number, default: 0 }
  },
  aiFeedback: {
    strengths: { type: String, default: "" },
    weaknesses: { type: String, default: "" }
  },
  completedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

export const GauntletSession = mongoose.model("GauntletSession", gauntletSchema);
