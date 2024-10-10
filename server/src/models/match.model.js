import mongoose, { Schema } from "mongoose";
import { playerPerformanceSchema, teamSchema } from "./team.model.js";

const matchLevels = [
	"International",
	"Domestic First-class",
	"Domestic List A",
	"Domestic T20",
	"Club",
	"School",
	"University",
	"Youth",
];

const matchStatuses = [
	"Scheduled",
	"Ongoing",
	"Completed",
	"Abandoned",
	"Postponed",
	"Cancelled",
	"Delayed",
	"Drawn",
];

const MatchSchema = new Schema(
	{
		matchTitle: { type: String },
		teams: {
			type: [teamSchema],
			required: true,
			validate: [(v) => v.length === 2, "{PATH} must contain exactly 2 teams"],
		},
		venue: { type: Schema.Types.ObjectId, ref: "Venue", required: true },
		tossWinner: { type: Schema.Types.ObjectId, ref: "Team" },
		tossDecision: { type: String, enum: ["Batting", "Bowling"] },
		matchStatus: { type: String, enum: matchStatuses, default: "Scheduled" },
		matchLevel: { type: String, enum: matchLevels, default: "International" },
		currentInnings: { type: Number, default: 1, min: 1 },
		currentOver: { type: Number, default: 0, min: 0 },
		overPlayed: { type: Number, default: 0, min: 0 },
		totalOvers: { type: Number, default: 20 },
		matchDate: { type: Date, required: true },
		currentTeamBatting: { type: Schema.Types.ObjectId, ref: "Team" },
		currentTeamBowling: { type: Schema.Types.ObjectId, ref: "Team" },
		prevBowler: { type: Schema.Types.ObjectId, ref: "Player" },
		winner: { type: Schema.Types.ObjectId, ref: "Team" },
		playerOfTheMatch: { type: Schema.Types.ObjectId, ref: "Player" },
		currentBowler: { type: playerPerformanceSchema },
		currentBatter: { type: playerPerformanceSchema },
	},
	{ timestamps: true }
);

export const Match = mongoose.model("Match", MatchSchema);
