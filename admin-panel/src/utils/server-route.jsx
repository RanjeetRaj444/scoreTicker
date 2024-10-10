import axios from "axios";
export const DB_URI = import.meta.env.VITE_SERVER_KEY;

// players route
export const fetchPlayers = async () => {
	try {
		const res = await axios.get(`${DB_URI}/players`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

// venues route
export const fetchVenues = async () => {
	try {
		const res = await axios.get(`${DB_URI}/venues`);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};

// matches route

export const createMatch = async (data) => {
	try {
		const res = await axios.post(`${DB_URI}/matches`, data);
		return res;
	} catch (error) {
		console.log(error);
		return error;
	}
};
