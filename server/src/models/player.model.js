import mongoose, { Schema } from "mongoose";

const statsSchema = new Schema({
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  catches: { type: Number, default: 0 },
});

const playerSchema = new Schema({
  name: { type: String, required: true },
  avatar: { type: String },
  role: {
    type: String,
    enum: ["Batter", "Bowler", "Wicketkeeper", "All-rounder"],
    required: true,
  },
  battingStyle: {
    type: String,
    enum: ["Right-hand bat", "Left-hand bat"],
    default: "Right-hand bat",
  },
  bowlingStyle: {
    type: String,
    default: "N/A",
  },
  starts: [
    {
      matchLevel: {
        type: String,
        enum: [
          "International",
          "Domestic First-class",
          "Domestic List A",
          "Domestic T20",
          "Club",
          "School",
          "University",
          "Youth",
        ],
      },
      stats: { type: statsSchema },
    },
  ],
});

export const Player = mongoose.model("Player", playerSchema);
