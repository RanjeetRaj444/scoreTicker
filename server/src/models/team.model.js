import mongoose, { Schema } from "mongoose";

export const playerPerformanceSchema = new Schema({
	player: { type: Schema.Types.ObjectId, ref: "Player", required: true },
	batting: {
		runs: { type: Number, default: 0, min: 0 },
		fours: { type: Number, default: 0, min: 0 },
		sixes: { type: Number, default: 0, min: 0 },
		dots: { type: Number, default: 0, min: 0 },
		singles: { type: Number, default: 0, min: 0 },
		twos: { type: Number, default: 0, min: 0 },
		threes: { type: Number, default: 0, min: 0 },
		ballFaced: { type: Number, default: 0, min: 0 },
		dismissedBy: { type: Schema.Types.ObjectId, ref: "Player", default: null },
		dismissedByBowler: { type: Schema.Types.ObjectId, ref: "Player", default: null },
		dismissedType: {
			type: String,
			enum: ["Caught", "Run out", "Stumped", "LBW", "Hit wicket"],
			default: null,
		},
		retiredHurt: { type: Boolean, default: false },
		isOut: {
			type: Boolean,
			default: false,
		},
	},
	bowling: {
		overs: { type: Number, default: 0, min: 0 },
		oversBowled: { type: Number, default: 0, min: 0 },
		wickets: { type: Number, default: 0, min: 0 },
		extras: { type: Number, default: 0, min: 0 },
		catches: { type: Number, default: 0, min: 0 },
		runouts: { type: Number, default: 0, min: 0 },
		runGiven: { type: Number, default: 0, min: 0 },
	},
	hasBatted: { type: Boolean, default: false },
	hasBowled: { type: Boolean, default: false },
	battingPosition: { type: Number, default: 0, min: 0 },
});

export const teamSchema = new Schema({
	name: { type: String, required: true, unique: true },
	logo: { type: String },
	squad: {
		type: [{ type: Schema.Types.ObjectId, ref: "Player", required: true }],
		validate: [(v) => v.length >= 11, "{PATH} must contain at least 11 players"],
	},
	playing11: {
		type: [playerPerformanceSchema],
		validate: [(v) => v.length === 11, "{PATH} must contain exactly 11 players"],
	},
	totalScore: { type: Number, default: 0, min: 0 },
	totalWickets: {
		type: Number,
		default: 0,
		min: 0,
	},
	overs: {
		type: Number,
		default: 0,
		min: 0,
	},
	extras: {
		type: Number,
		default: 0,
		min: 0,
	},
});

export const Team = mongoose.model("Team", teamSchema);
