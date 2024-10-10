import { useEffect, useState } from "react";
import { DB_URI, fetchVenues } from "../utils/server-route";
import axios from "axios";

const useVenues = () => {
	const [venues, setVenues] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const getVenues = async () => {
			try {
				const { data } = await fetchVenues();
				setVenues(data.data);
			} catch (err) {
				setError(err);
			} finally {
				setLoading(false);
			}
		};

		getVenues();
	}, []);

	const createVenue = async (payload) => {
		try {
			const { data } = await axios.post(`${DB_URI}/venues`, payload);
			return data?.data || null;
		} catch (error) {
			console.error("Error creating venue:", error.message);
			throw new Error(error);
		}
	};

	return { venues, loading, error, createVenue };
};

export default useVenues;
