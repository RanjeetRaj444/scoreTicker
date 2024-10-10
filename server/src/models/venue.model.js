import mongoose, { Schema } from "mongoose";

const venueSchema = new Schema({
	name: { type: String, required: true },
	capacity: { type: Number, required: true },
	address: { type: String, required: true },
	matches: [{ type: Schema.Types.ObjectId, ref: "Match" }],
	images: [{ type: String }],
});

export const Venue = mongoose.model("Venue", venueSchema);
