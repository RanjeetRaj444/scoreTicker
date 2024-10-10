import { useEffect, useState } from "react";
import { DB_URI, fetchPlayers } from "../utils/server-route";
import axios from "axios";

const usePlayers = () => {
	const [players, setPlayers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const createPlayer = async (payload) => {
		try {
			const { data } = await axios.post(`${DB_URI}/players`, payload);
			return data.data;
		} catch (error) {
			console.log(error);
			throw error;
		}
	};

	useEffect(() => {
		const getPlayers = async () => {
			try {
				const { data } = await fetchPlayers();
				setPlayers(data.data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		getPlayers();
	}, []);

	return { players, loading, error, createPlayer };
};

export default usePlayers;
