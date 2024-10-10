import { io } from "../app.js";
import { Match } from "../models/match.model.js";

export const createMatch = async (req, res) => {
	try {
		const match = await Match.create(req.body);
		res.status(201).json({
			success: true,
			data: match,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getMatches = async (req, res) => {
	try {
		const matches = await Match.find();
		res.status(200).json({
			success: true,
			data: matches,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getMatch = async (req, res) => {
	try {
		const match = await Match.findById(req.params.id)
			.populate("venue")
			.populate("currentBatter.player", "name")
			.populate("currentBowler.player", "name")
			.populate("playerOfTheMatch", "name")
			.populate("teams.playing11.player", "name")
			.populate("teams.playing11.batting.dismissedBy", "name")
			.populate("teams.playing11.batting.dismissedByBowler", "name");

		res.status(200).json({
			success: true,
			data: match,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updateMatch = async (req, res) => {
	try {
		await Match.findByIdAndUpdate(
			req.params.id,
			{ $set: req.body },
			{
				new: true,
				runValidators: true,
			}
		);

		const updatedMatch = await Match.findById(req.params.id)
			.populate("venue")
			.populate("currentBatter.player", "name")
			.populate("currentBowler.player", "name")
			.populate("playerOfTheMatch", "name")
			.populate("teams.playing11.player", "name")
			.populate("teams.playing11.batting.dismissedBy", "name")
			.populate("teams.playing11.batting.dismissedByBowler", "name");

		io.to(req.params.id).emit("matchUpdated", updatedMatch);

		res.status(200).json({
			success: true,
			data: updatedMatch,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const deleteMatch = async (req, res) => {
	try {
		const match = await Match.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: match,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
