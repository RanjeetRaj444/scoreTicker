import { Player } from "../models/player.model.js";

export const createPlayer = async (req, res) => {
	try {
		// also handle bulk upload data
		// const players = await Player.insertMany(req.body);

		// console.log("players", players);
		const player = await Player.create(req.body);
		res.status(201).json({
			success: true,
			data: player,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getPlayers = async (req, res) => {
	try {
		const players = await Player.find();
		res.status(200).json({
			success: true,
			data: players,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getPlayer = async (req, res) => {
	try {
		const player = await Player.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: player,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updatePlayer = async (req, res) => {
	try {
		const player = await Player.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			success: true,
			data: player,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const deletePlayer = async (req, res) => {
	try {
		const player = await Player.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: player,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
