import { useEffect, useState } from "react";
import { fetchVenues } from "../utils/server-route";

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

	return { venues, loading, error };
};

export default useVenues;
