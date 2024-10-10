import { Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMatch from "../hooks/useMatch";
import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "./HomePage";

const { Title } = Typography;

const DetailsPage = () => {
	const [tossWinner, setTossWinner] = useState(null);
	const [tossDecision, setTossDecision] = useState(null);
	const [overs, setOvers] = useState(0);
	const [totalRuns, setTotalRuns] = useState(0);
	const [wickets, setWickets] = useState(0);
	const [currentBowler, setCurrentBowler] = useState({});
	const [currentBatter, setCurrentBatter] = useState({});
	const [battingPairs, setBattingPairs] = useState([]);
	const [playerBatted, setPlayerBatted] = useState([]);
	const [bowler, setBowlers] = useState([]);
	const [bowlingPlayingXI, setBowlingPlayingXI] = useState();
	const [battingPlayingXI, setBattingPlayingXI] = useState();
	const [match, setMatch] = useState({});

	const { getMatch } = useMatch();
	const { id } = useParams();

	useEffect(() => {
		const socket = io(SOCKET_SERVER_URL);

		// Join the room for the specific match
		socket.emit("joinMatchRoom", id);

		// Listen for updates specific to this match
		socket.on("matchUpdated", (data) => {
			setMatch(data);
		});

		return () => {
			// Leave the room when the component unmounts
			socket.emit("leaveMatchRoom", id);
			socket.disconnect();
		};
	}, [id]);

	useEffect(() => {
		getMatch(id)
			.then((data) => {
				setMatch(data);
			})
			.catch((err) => {
				console.error(err);
			});
	}, [id]);

	useEffect(() => {
		const currentBattingTeam = match.teams?.find(
			(team) => team._id === match.currentTeamBatting
		);
		const currentBowlingTeam = match.teams?.find(
			(team) => team._id === match.currentTeamBowling
		);

		setOvers(currentBattingTeam?.overs ?? 0);
		setTotalRuns(currentBattingTeam?.totalScore ?? 0);
		setWickets(currentBattingTeam?.totalWickets ?? 0);
		setTossWinner(currentBattingTeam);
		setTossDecision(currentBattingTeam === currentBowlingTeam ? "Batting" : "Bowling");
		setBattingPlayingXI(currentBattingTeam?.playing11);
		setBowlingPlayingXI(currentBowlingTeam?.playing11);
		setPlayerBatted(currentBattingTeam?.playing11?.filter(({ hasBatted }) => hasBatted) || []);
		setBattingPairs(
			currentBattingTeam?.playing11?.filter(
				({ hasBatted, batting }) => hasBatted && !batting?.isOut
			) || []
		);
		setCurrentBatter(match?.currentBatter);
		setCurrentBowler(match?.currentBowler);
		setBowlers(currentBowlingTeam?.playing11?.filter(({ hasBowled }) => hasBowled) || []);
	}, [match]);

	const transformData = (data, type) => {
		return data
			.map((player) => {
				const { batting, bowling, player: playerInfo } = player;

				const playerName = playerInfo.name;

				if (type === "batting") {
					const strikeRate =
						batting.ballFaced > 0
							? ((batting.runs / batting.ballFaced) * 100).toFixed(2)
							: 0;

					return {
						batsman: playerName,
						runs: batting.runs,
						balls: batting.ballFaced,
						fours: batting.fours,
						sixes: batting.sixes,
						strikeRate: strikeRate,
						id: player._id,
						isOut: batting.isOut,
						dismissedBy: batting?.dismissedByBowler?.name,
					};
				} else if (type === "bowling") {
					const oversBowled = bowling.oversBowled > 0 ? bowling.oversBowled : 1;
					const economy = bowling.runGiven / oversBowled;

					return {
						bowler: playerName,
						overs: bowling.oversBowled,
						maidens: Math.floor(bowling.oversBowled / 6),
						runs: bowling.runGiven,
						wickets: bowling.wickets,
						economy: economy.toFixed(2),
						id: player._id,
					};
				}

				return null;
			})
			.filter((item) => item !== null);
	};

	return (
		<div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
			<Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
				Live Match Update
			</Title>
			<div className="bg-gray-900 text-white p-4  bottom-0 z-10 left-0 right-0">
				<div className="flex justify-between items-center">
					<div className="flex items-center">
						<p className="text-lg font-bold mr-4">Current Over: {overs}</p>
						<p className="text-lg font-bold mr-4">Total Overs: {match?.totalOvers}</p>
					</div>
					<div className="flex items-center">
						<p className="text-2xl font-bold">
							{totalRuns} / {wickets}
						</p>
						<span className="text-md ml-2">Scoreboard</span>
					</div>
				</div>
			</div>

			<Title level={4} style={{ marginTop: "40px" }} className="flex justify-between">
				Batting Summary
			</Title>

			<Table
				dataSource={transformData(playerBatted, "batting")}
				pagination={false}
				rowKey={"id"}
				columns={[
					{
						title: "Batter",
						dataIndex: "batsman",
						key: "batsman",
						render: (text, record) => (
							<span
								className={` ${record?.id === currentBatter?._id && "font-bold"}`}
							>
								{text.split(" ")[0]}
								{record?.id === currentBatter?._id ? "*" : ""}
								{record?.isOut && (
									<span className="text-red-500 text-xs ml-2">
										out by {record?.dismissedBy}
									</span>
								)}
							</span>
						),
					},
					{
						title: "R",
						dataIndex: "runs",
						key: "runs",
					},
					{
						title: "B",
						dataIndex: "balls",
						key: "balls",
					},
					{
						title: "4s",
						dataIndex: "fours",
						key: "fours",
					},
					{
						title: "6s",
						dataIndex: "sixes",
						key: "sixes",
					},
					{
						title: "SR",
						dataIndex: "strikeRate",
						key: "strikeRate",
						render: (strikeRate) => <span>{`${strikeRate}%`}</span>,
					},
				]}
				style={{ marginTop: "20px" }}
			/>
			<Title level={4} style={{ marginTop: "40px" }} className="flex justify-between">
				Bowling Summary
			</Title>
			<Table
				dataSource={transformData(bowler, "bowling")}
				pagination={false}
				rowKey={"id"}
				columns={[
					{
						title: "Bowler",
						dataIndex: "bowler",
						key: "bowler",
						render: (text, record) => (
							<span className={`${record?.id === currentBowler?._id && "font-bold"}`}>
								{text.split(" ")[0]} {record?.id === currentBowler?._id ? "*" : ""}{" "}
							</span>
						),
					},
					{
						title: "O",
						dataIndex: "overs",
						key: "overs",
					},
					{
						title: "M",
						dataIndex: "maidens",
						key: "maidens",
					},
					{
						title: "R",
						dataIndex: "runs",
						key: "runs",
					},
					{
						title: "W",
						dataIndex: "wickets",
						key: "wickets",
					},
					{
						title: "ECO",
						dataIndex: "economy",
						key: "economy",
						render: (economy) => <span>{`${economy}%`}</span>,
					},
				]}
				style={{ marginTop: "20px" }}
			/>
		</div>
	);
};

export default DetailsPage;
