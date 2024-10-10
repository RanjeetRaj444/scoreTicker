import { Venue } from "../models/venue.model.js";

export const getVenues = async (req, res) => {
	try {
		const venues = await Venue.find();
		res.status(200).json({
			success: true,
			data: venues,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const getVenue = async (req, res) => {
	try {
		const venue = await Venue.findById(req.params.id);
		res.status(200).json({
			success: true,
			data: venue,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const createVenue = async (req, res) => {
	try {
		// also handle bulk upload data
		const venues = await Venue.insertMany(req.body);
		// const venue = await Venue.create(req.body);
		res.status(201).json({
			success: true,
			data: venues,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updateVenue = async (req, res) => {
	try {
		const venue = await Venue.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			success: true,
			data: venue,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const deleteVenue = async (req, res) => {
	try {
		const venue = await Venue.findByIdAndDelete(req.params.id);
		res.status(200).json({
			success: true,
			data: venue,
		});
	} catch (error) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
