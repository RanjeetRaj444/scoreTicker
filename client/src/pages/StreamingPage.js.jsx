import React, { useEffect, useState } from "react";
import Scoreboard from "../components/Scoreboard";
import { useParams } from "react-router-dom";
import { SOCKET_SERVER_URL } from "./HomePage";
import { io } from "socket.io-client";
import axios from "axios";

const StreamingPage = () => {
	const { id } = useParams();
	const [scoreData, setScoreData] = useState([]);
	const [overs, setOvers] = useState(0);
	const [totalRuns, setTotalRuns] = useState(0);
	const [wickets, setWickets] = useState(0);
	const [currentBattingTeam, setCurrentBattingTeam] = useState();
	const [currentBowlingTeam, setCurrentBowlingTeam] = useState();
	const [battingPairs, setBattingPairs] = useState([]);

	// Helper function to update the match data
	const updateMatchData = (match) => {
		const currentBattingTeam = match.teams?.find(
			(team) => team._id === match.currentTeamBatting
		);
		const currentBowlingTeam = match.teams?.find(
			(team) => team._id === match.currentTeamBowling
		);

		setCurrentBattingTeam(currentBattingTeam);
		setCurrentBowlingTeam(currentBowlingTeam);
		setOvers(currentBattingTeam?.overs ?? 0);
		setTotalRuns(currentBattingTeam?.totalScore ?? 0);
		setWickets(currentBattingTeam?.totalWickets ?? 0);

		setBattingPairs(
			currentBattingTeam?.playing11?.filter(
				({ hasBatted, batting }) => hasBatted && !batting?.isOut
			) || []
		);
		setScoreData(match);
	};

	// Fetch initial match data
	const getInitialMatchData = async () => {
		try {
			const { data } = await axios.get(`${SOCKET_SERVER_URL}/matches/${id}`);
			updateMatchData(data.data);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getInitialMatchData();

		const socket = io(SOCKET_SERVER_URL);

		// Listen for match updates
		socket.on("matchUpdated", (data) => {
			updateMatchData(data);
		});

		// Cleanup socket connection
		return () => {
			socket.disconnect();
		};
	}, []);

	return (
		<div className="min-h-screen bg-gray-900 text-white relative">
			<div className="w-full h-screen ">
				<iframe
					className="absolute top-0 left-0 w-full h-full"
					src="https://www.youtube.com/embed/q60V5PrOjgs"
					title="Live Cricket Stream"
					frameBorder="0"
					allowFullScreen
				></iframe>

				<div className="absolute bottom-0 left-0 w-full">
					<Scoreboard
						scoreData={scoreData}
						overs={overs}
						totalRuns={totalRuns}
						wickets={wickets}
						currentBattingTeam={currentBattingTeam}
						currentBowlingTeam={currentBowlingTeam}
						battingPairs={battingPairs}
					/>
				</div>
			</div>
		</div>
	);
};

export default StreamingPage;
