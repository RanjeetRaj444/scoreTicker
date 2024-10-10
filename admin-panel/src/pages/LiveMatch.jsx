import { Alert, Button, Col, notification, Row, Select, Steps, Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ballActions, ballExtras } from "../constants/enums";
import useMatch from "../hooks/useMatch";
const { Step } = Steps;

const { Title } = Typography;

const LiveMatchUpdate = () => {
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

	const { getMatch, updateMatch } = useMatch();
	const { id } = useParams();

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
		setCurrentBall(match?.overPlayed ? Number(match?.overPlayed.toFixed(1).split(".")[1]) : 0);
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

	const handleTossDecisionClick = () => {
		const teams = match.teams;
		const secondTeam = teams.find((team) => team._id !== tossWinner);
		const tossPayLoad = {
			tossWinner: tossWinner,
			tossDecision: tossDecision,
			currentTeamBatting: tossDecision === "Batting" ? tossWinner : secondTeam,
			currentTeamBowling: tossDecision === "Batting" ? secondTeam : tossWinner,
		};

		updateMatch(id, tossPayLoad).then((data) => {
			setMatch(data);
		});
	};

	const [currentBall, setCurrentBall] = useState();

	const [selectedAction, setSelectedAction] = useState(null);
	const [selectedExtra, setSelectedExtra] = useState(null);

	const handleActionClick = (item, type) => {
		if (type === "action") {
			if (selectedAction === item) {
				setSelectedAction(null);
			} else {
				setSelectedAction(item);
			}
		} else if (type === "extra") {
			if (selectedExtra === item) {
				setSelectedExtra(null);
			} else {
				setSelectedExtra(item);
			}
		}
	};

	const handleBallActionSubmit = () => {
		const mainPayload = match;
		const categories = []
			.concat(
				selectedAction ? selectedAction.category : [],
				selectedExtra ? selectedExtra.category : []
			)
			.flatMap((category) => {
				const [mainCategory, subCategory] = category.split(",");
				return [mainCategory, subCategory];
			})
			.filter(Boolean);

		const totalRunOnBall = (selectedAction?.value ?? 0) + (selectedExtra?.value ?? 0);

		const batsmanPayload = {
			...currentBatter,
			batting: {
				...currentBatter.batting,
				runs: !selectedExtra
					? (currentBatter?.batting?.runs ?? 0) + totalRunOnBall
					: currentBatter?.batting?.runs ?? 0,
				ballFaced: !selectedExtra
					? (currentBatter?.batting?.ballFaced ?? 0) + 1
					: currentBatter?.batting?.ballFaced ?? 0,
				fours:
					categories.includes("fours") && !selectedExtra
						? currentBatter?.batting?.fours + 1
						: currentBatter?.batting?.fours,
				sixes:
					categories.includes("sixes") && !selectedExtra
						? currentBatter?.batting?.sixes + 1
						: currentBatter?.batting?.sixes,
				threes:
					categories.includes("threes") && !selectedExtra
						? currentBatter?.batting?.threes + 1
						: currentBatter?.batting?.threes,
				twos:
					categories.includes("twos") && !selectedExtra
						? currentBatter?.batting?.twos + 1
						: currentBatter?.batting?.twos,
				singles:
					categories.includes("singles") && !selectedExtra
						? currentBatter?.batting?.singles + 1
						: currentBatter?.batting?.singles,
				isOut: categories.includes("wickets") && !selectedExtra ? true : false,
				dismissedByBowler:
					categories.includes("wickets") && !selectedExtra
						? currentBowler?.player?._id
						: null,
			},
		};

		let oversBowled = currentBowler?.bowling?.oversBowled ?? 0;
		let overEnd = false;
		let overPlayed = match.overPlayed ?? 0;
		if (!selectedExtra) {
			const [wholeOvers, balls] = oversBowled.toFixed(1).split(".").map(Number);
			setCurrentBall(balls + 1);

			if (balls === 5) {
				oversBowled = (wholeOvers + 1).toFixed(1);
			} else {
				oversBowled = `${wholeOvers}.${balls + 1}`;
			}

			const [wholeOvers1, balls1] = overPlayed.toFixed(1).split(".").map(Number);
			setCurrentBall(balls1 + 1);

			if (balls1 === 5) {
				overPlayed = (wholeOvers1 + 1).toFixed(1);
				overEnd = true;
			} else {
				overPlayed = `${wholeOvers1}.${balls1 + 1}`;
			}

			mainPayload.overPlayed = parseFloat(overPlayed);
		}

		const bowlerPayload = {
			...currentBowler,
			bowling: {
				...currentBowler.bowling,
				runGiven: (currentBowler?.bowling?.runGiven ?? 0) + totalRunOnBall,
				wickets: categories.includes("wickets")
					? currentBowler?.bowling?.wickets + 1
					: currentBowler?.bowling?.wickets,
				extras: categories.includes("extras")
					? currentBowler?.bowling?.extras + 1
					: currentBowler?.bowling?.extras,
				oversBowled,
			},
		};

		const battingIndex = mainPayload.teams?.findIndex(
			(team) => team._id === match.currentTeamBatting
		);
		const updatedBatsman = mainPayload.teams[battingIndex].playing11.findIndex(
			(player) => player._id === batsmanPayload._id
		);

		const bowlerIndex = mainPayload.teams?.findIndex(
			(team) => team._id === match.currentTeamBowling
		);
		const updatedBowler = mainPayload.teams[bowlerIndex].playing11.findIndex(
			(player) => player._id === bowlerPayload._id
		);

		const battingTeam = mainPayload.teams[battingIndex];
		battingTeam.totalScore = (battingTeam?.totalScore ?? 0) + totalRunOnBall;
		battingTeam.totalWickets = categories.includes("wickets")
			? (battingTeam?.totalWickets ?? 0) + 1
			: battingTeam?.totalWickets;
		battingTeam.overs = parseFloat(overPlayed);

		battingTeam.playing11[updatedBatsman] = batsmanPayload;
		mainPayload.teams[bowlerIndex].playing11[updatedBowler] = bowlerPayload;
		mainPayload.currentBatter = categories.includes("wickets") ? null : batsmanPayload;
		mainPayload.currentBowler = overEnd ? null : bowlerPayload;
		mainPayload.prevBowler = overEnd ? bowlerPayload : null;

		updateMatch(id, mainPayload)
			.then((data) => {
				setMatch(data);
				setSelectedAction(null);
				setSelectedExtra(null);
			})
			.catch((error) => {
				notification.error({
					message: "Error",
					description: error.message,
				});
			});
	};

	const handleBatterAdding = (value) => {
		const batsman = JSON.parse(value);
		batsman.hasBatted = true;
		batsman.battingPosition = playerBatted.length;
		if (battingPairs.length === 2) {
			notification.error({
				message: "Active Pair limit exceeded!",
				description: "Only 2 player can be batted at a time!",
			});
			return;
		}
		const payload = match;
		const index = payload.teams?.findIndex((team) => team._id === match.currentTeamBatting);
		const updatedBatsman = payload.teams[index].playing11.findIndex(
			(player) => player._id === batsman._id
		);

		payload.teams[index].playing11[updatedBatsman].hasBatted = true;
		payload.teams[index].playing11[updatedBatsman].battingPosition = playerBatted.length;

		updateMatch(id, payload)
			.then((data) => {
				setMatch(data);
			})
			.catch((error) => {
				notification.error({
					message: "Error",
					description: error.message,
				});
			});
	};

	const handleBowlerAdding = (value) => {
		const bowler = JSON.parse(value);
		bowler.hasBowled = true;

		const payload = match;
		const index = payload.teams?.findIndex((team) => team._id === match.currentTeamBowling);
		const updatedBowler = payload.teams[index].playing11.findIndex(
			(player) => player._id === bowler._id
		);

		payload.teams[index].playing11[updatedBowler].hasBowled = true;
		payload.currentBowler = bowler;

		updateMatch(id, payload)
			.then((data) => {
				setMatch(data);
			})
			.catch((error) => {
				notification.error({
					message: "Error",
					description: error.message,
				});
			});
	};

	const transformData = (data, type) => {
		return data
			.map((player) => {
				const { batting, bowling, player: playerInfo } = player;

				// Common fields
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

				return null; // In case of an unknown type
			})
			.filter((item) => item !== null); // Remove null values
	};

	const handleCurrentBatter = (value) => {
		const batter = JSON.parse(value);
		const payload = {
			...match,
			currentBatter: batter,
		};

		updateMatch(id, payload)
			.then((data) => {
				setMatch(data);
			})
			.catch((error) => {
				notification.error({
					message: "Error",
					description: error.message,
				});
			});
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

			{match?.tossWinner ? (
				<>
					<div style={{ margin: "20px" }}>
						<Title className="flex justify-center" level={4}>
							Balls
						</Title>
						<Steps current={currentBall}>
							{[...Array(6)].map((_, index) => (
								<Step key={index} />
							))}
						</Steps>
					</div>

					<Row gutter={24} style={{ marginTop: "20px", display: "flex" }}>
						<Col span={12}>
							<p className="mb-3">Current Bowler</p>
							<Select
								placeholder="Select Bowler"
								style={{ width: "100%" }}
								value={currentBowler ? JSON.stringify(currentBowler) : ""}
								onChange={(value) => handleBowlerAdding(value)}
							>
								{bowlingPlayingXI?.map((p) => (
									<Select.Option
										disabled={match?.prevBowler === p._id}
										key={p.player.name}
										value={JSON.stringify(p)}
									>
										{p.player.name}
									</Select.Option>
								))}
							</Select>
						</Col>
						<Col span={12}>
							<p className="mb-3">Current Striker</p>
							<Select
								disabled={battingPairs.length < 2}
								placeholder="Select Striker"
								style={{ width: "100%" }}
								value={currentBatter ? JSON.stringify(currentBatter) : ""}
								onChange={(value) => handleCurrentBatter(value)}
							>
								{battingPairs?.map((p) => (
									<Select.Option key={p.player.name} value={JSON.stringify(p)}>
										{p.player.name}
									</Select.Option>
								))}
							</Select>
						</Col>
					</Row>

					<Row gutter={24} className="flex flex-col items-center gap-4">
						<div
							style={{
								marginTop: "20px",
								display: "flex",
								justifyContent: "center",
								gap: "20px",
								alignItems: "center",
							}}
						>
							<div className="">
								<p className="mb-3">Ball Action</p>
								{ballActions.map((action, index) => (
									<Button
										key={index}
										disabled={!currentBowler?.player || !currentBatter?.player}
										type={selectedAction === action ? "primary" : "default"}
										onClick={() => handleActionClick(action, "action")}
									>
										{action.name}
									</Button>
								))}
							</div>

							<div>
								<p className="mb-3">Ball Type</p>
								{ballExtras.map((extra, index) => (
									<Button
										key={index}
										disabled={!currentBowler?.player || !currentBatter?.player}
										type={selectedExtra === extra ? "primary" : "default"}
										onClick={() => handleActionClick(extra, "extra")}
									>
										{extra.name}
									</Button>
								))}
							</div>
						</div>

						<Button
							disabled={!selectedAction && !selectedExtra}
							type="primary"
							onClick={handleBallActionSubmit}
						>
							Submit Ball Action
						</Button>
					</Row>

					<Title level={4} style={{ marginTop: "40px" }} className="flex justify-between">
						Batting Summary
						<div className="flex items-center gap-3 justify-center">
							<p className="flex items-center !m-0">Add Batsman</p>
							<Select
								className="!w-[200px]"
								placeholder="Add batsman"
								disabled={battingPairs.length === 2}
								onChange={(value) => handleBatterAdding(value)}
							>
								{battingPlayingXI?.map((b) => (
									<Select.Option
										key={b._id}
										value={JSON.stringify(b)}
										disabled={b.hasBatted}
									>
										{b.player.name}
									</Select.Option>
								))}
							</Select>
						</div>
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
										className={` ${
											record?.id === currentBatter?._id && "font-bold"
										}`}
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
									<span
										className={`${
											record?.id === currentBowler?._id && "font-bold"
										}`}
									>
										{text.split(" ")[0]}{" "}
										{record?.id === currentBowler?._id ? "*" : ""}{" "}
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
				</>
			) : (
				<>
					<Alert message="Match not started yet" type="info" showIcon />
					<Select
						placeholder="Select team who have won the toss"
						style={{ width: "100%" }}
						className="mt-5"
						onChange={(value) => setTossWinner(value)}
					>
						{match?.teams?.map((team) => (
							<Select.Option key={team._id} value={team._id}>
								{team.name}
							</Select.Option>
						))}
					</Select>
					{tossWinner && (
						<Select
							placeholder="Select what is elected by toss winner"
							style={{ width: "100%", marginTop: "10px" }}
							onChange={(value) => setTossDecision(value)}
						>
							<Select.Option value="Batting">Batting</Select.Option>
							<Select.Option value="Bowling">Bowling</Select.Option>
						</Select>
					)}

					<Button
						type="primary"
						style={{ marginTop: "20px" }}
						disabled={!tossDecision}
						onClick={handleTossDecisionClick}
					>
						Go to Live Updates
					</Button>
				</>
			)}
		</div>
	);
};

export default LiveMatchUpdate;
