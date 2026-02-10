import mongoose, { Schema } from "mongoose";

const ballSchema = new Schema(
  {
    matchId: { type: Schema.Types.ObjectId, ref: "Match", required: true },
    innings: { type: Number, required: true },
    over: { type: Number, required: true },
    ball: { type: Number, required: true },
    batsman: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    bowler: { type: Schema.Types.ObjectId, ref: "Player", required: true },
    runs: { type: Number, default: 0 },
    extras: {
      type: {
        type: String,
        enum: ["Wide", "NoBall", "Bye", "LegBye", "None"],
        default: "None",
      },
      runs: { type: Number, default: 0 },
    },
    wicket: {
      isWicket: { type: Boolean, default: false },
      type: {
        type: String,
        enum: [
          "Bowled",
          "Caught",
          "Run out",
          "Stumped",
          "LBW",
          "Hit wicket",
          "Retired hurt",
          "Timed out",
          "Handled ball",
          "Obstructing the field",
          null,
        ],
        default: null,
      },
      player: { type: Schema.Types.ObjectId, ref: "Player" }, // For Run out or Caught
      fielder: { type: Schema.Types.ObjectId, ref: "Player" },
    },
    commentary: { type: String },
    scoreAtBall: { type: Number },
    wicketsAtBall: { type: Number },
  },
  { timestamps: true },
);

export const Ball = mongoose.model("Ball", ballSchema);
