import { Team } from "../models/team.model.js";

export const getTeams = async (req, res) => {
	try {
		const teams = await Team.find();
		res.status(200).json({
			success: true,
			data: teams,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getTeam = async (req, res) => {
	try {
		const team = await Team.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const createTeam = async (req, res) => {
	try {
		const team = await Team.create(req.body);
		res.status(201).json({
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updateTeam = async (req, res) => {
	try {
		const team = await Team.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const deleteTeam = async (req, res) => {
	try {
		const team = await Team.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: team,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
