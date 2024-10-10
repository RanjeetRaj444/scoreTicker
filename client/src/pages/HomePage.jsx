// HomePage.js
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export const SOCKET_SERVER_URL = "http://localhost:8000";

const HomePage = () => {
	const [matches, setMatches] = useState([]);

	const getMatches = async () => {
		try {
			const { data } = await axios.get(`${SOCKET_SERVER_URL}/api/matches`);
			setMatches(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getMatches();
	}, []);

	return (
		<div className="min-h-screen bg-gray-900 text-white">
			<div className="bg-hero bg-center bg-cover h-[60vh] flex flex-col justify-center items-center text-center p-10">
				<h2 className="text-5xl font-bold">Watch Live Cricket Now!</h2>
				<p className="mt-4 text-lg">Catch all the live action from the world of cricket.</p>
			</div>

			<div className="mt-12 px-6">
				<h3 className="text-4xl font-bold text-center">Matches</h3>
				<div className="overflow-x-auto mt-8">
					<table className="min-w-full table-auto border-collapse border border-gray-800">
						<thead>
							<tr className="bg-gray-800 text-left">
								<th className="px-6 py-4 border-b border-gray-700">Match</th>
								<th className="px-6 py-4 border-b border-gray-700">Date</th>
								<th className="px-6 py-4 border-b border-gray-700">Status</th>
								<th className="px-6 py-4 border-b border-gray-700 text-right">
									Action
								</th>
							</tr>
						</thead>
						<tbody>
							{matches.length ? (
								matches.map((match, index) => (
									<tr key={index} className="bg-gray-900 hover:bg-gray-800">
										<td className="px-6 py-4 border-b border-gray-700">
											{match.teams[0].name} vs {match.teams[1].name}
										</td>
										<td className="px-6 py-4 border-b border-gray-700">
											{new Date(match.matchDate).toLocaleString()}
										</td>
										<td className="px-6 py-4 border-b border-gray-700">
											{match?.matchStatus}
										</td>
										<td className="px-6 py-4 border-b border-gray-700 text-right flex gap-4  justify-end">
											{match?.matchStatus === "Ongoing" ? (
												<>
													<Link to={`/stream/${match._id}`}>
														<button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">
															Watch Now
														</button>
													</Link>
													<Link to={`/details/${match._id}`}>
														<button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">
															Details
														</button>
													</Link>
												</>
											) : (
												<Link to={`/stream/${match._id}`}>
													<button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg">
														See Result
													</button>
												</Link>
											)}
										</td>
									</tr>
								))
							) : (
								<tr>
									<td colSpan="4" className="px-6 py-4 text-center text-gray-500">
										No matches.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>

			<footer className="bg-black mt-12 p-6 text-center">
				<p>&copy; 2024 Cricket Live. All rights reserved.</p>
				<div className="flex justify-center space-x-4 mt-4">
					<a href="#" className="hover:text-gray-400">
						Facebook
					</a>
					<a href="#" className="hover:text-gray-400">
						Twitter
					</a>
					<a href="#" className="hover:text-gray-400">
						Instagram
					</a>
				</div>
			</footer>
		</div>
	);
};

export default HomePage;
