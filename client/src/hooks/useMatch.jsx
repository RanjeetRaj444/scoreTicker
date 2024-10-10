import axios from "axios";
import { useEffect, useState } from "react";
import { DB_URI } from "../utils/server-route";

const useMatch = () => {
	const [matches, setMatches] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		getMatches();
	}, []);

	const getMatches = async () => {
		try {
			const { data } = await axios.get(`${DB_URI}/matches`);
			setMatches(data.data);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	};

	const getMatch = async (id) => {
		try {
			const { data } = await axios.get(`${DB_URI}/matches/${id}`);
			return data.data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	const recentMatches = async () => {
		try {
			const { data } = await axios.get(`${DB_URI}/matches`);
			return data.data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	return { matches, loading, error, recentMatches, getMatch };
};

export default useMatch;
