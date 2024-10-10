import {
	Button,
	Card,
	Col,
	DatePicker,
	Divider,
	Form,
	Input,
	InputNumber,
	notification,
	Row,
	Select,
	Space,
	Spin,
	Typography,
} from "antd";
import React, { useState } from "react";
import usePlayers from "../hooks/usePlayers";
import useVenues from "../hooks/useVenues";
import useMatch from "../hooks/useMatch";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const CreateMatch = () => {
	const [form] = Form.useForm();
	const [teams, setTeams] = useState([
		{ name: "", squad: [], playing11: [] },
		{ name: "", squad: [], playing11: [] },
	]);
	const { players, loading, error } = usePlayers();
	const { venues } = useVenues();
	const { createMatch } = useMatch();
	const navigate = useNavigate();

	if (loading)
		return (
			<div style={{ textAlign: "center", marginTop: "50px" }}>
				<Spin tip="Loading players..." />
			</div>
		);
	if (error)
		return (
			<div style={{ textAlign: "center", marginTop: "50px" }}>
				<Typography.Text type="danger">Error fetching players: {error}</Typography.Text>
			</div>
		);

	const handleSquadChange = (selected, teamIndex) => {
		const updatedTeams = [...teams];
		updatedTeams[teamIndex].squad = selected;

		const teamAPlayers = updatedTeams[0].squad;
		const teamBPlayers = updatedTeams[1].squad;

		if (teamAPlayers.some((player) => teamBPlayers.includes(player))) {
			notification.error({
				message: "Player Selection Error",
				description: "A player cannot be selected in both teams!",
			});
			return;
		}

		setTeams(updatedTeams);
	};

	const handleMatchDataChange = (field, value) => {
		const updatedTeams = [...teams];
		updatedTeams[field.teamIndex][field.key] = value;
		setTeams(updatedTeams);
	};

	const onFinish = (values) => {
		values.teams = values.teams.map((team) => ({
			...team,
			playing11: team.playing11.map((player) => ({
				player: player,
			})),
		}));

		createMatch(values)
			.then((data) => {
				notification.success({
					message: "Match Created",
					description: "The match has been successfully created.",
				});
				form.resetFields();
				setTeams([
					{ name: "", squad: [], playing11: [] },
					{ name: "", squad: [], playing11: [] },
				]);
				navigate(`/match/live/${data._id}`);
			})
			.catch((error) => {
				console.error(error);
				notification.error({
					message: "Error Creating Match",
					description: error?.response?.data?.message ?? error.message,
				});
			});
	};

	const getPlayerOptions = (teamIndex) => {
		const otherTeamSquad = teams[teamIndex === 0 ? 1 : 0].squad;
		return players.map((player) => ({
			label: (
				<Space>
					<img
						src={player.avatar}
						alt={player.name}
						style={{
							width: 20,
							height: 20,
							borderRadius: "50%",
							marginRight: 8,
						}}
					/>
					{player.name}
				</Space>
			),
			value: player._id,
			key: player._id,
			disabled: otherTeamSquad.includes(player._id),
		}));
	};

	return (
		<div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
			<Card style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
				<Title level={2} style={{ textAlign: "center" }}>
					Create Match
				</Title>
				<Divider />

				<Form form={form} onFinish={onFinish} layout="vertical">
					<Row gutter={24}>
						<Col xs={24} sm={24} md={12} lg={12}>
							<Form.Item
								name="matchTitle"
								label="Match Title"
								rules={[{ required: true, message: "Please enter match title!" }]}
							>
								<Input
									placeholder="Enter match title"
									value={'form.getFieldValue("team")'}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} lg={12}>
							<Form.Item
								name="venue"
								label="Venue"
								rules={[{ required: true, message: "Please select a venue!" }]}
							>
								<Select
									placeholder="Select venue"
									options={venues.map((venue) => ({
										label: venue.name,
										value: venue._id,
										key: venue._id,
									}))}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Divider orientation="left">Teams Information</Divider>

					{teams.map((team, index) => (
						<div key={index}>
							<Title level={4}>{`Team ${index + 1}`}</Title>
							<Row gutter={24}>
								<Col xs={24} sm={24} md={12} lg={12}>
									<Form.Item
										name={["teams", index, "name"]}
										label={`Team ${index + 1} Name`}
										rules={[
											{
												required: true,
												message: `Please enter Team ${index + 1} name!`,
											},
										]}
									>
										<Input placeholder={`Enter Team ${index + 1} name`} />
									</Form.Item>
								</Col>
								<Col xs={24} sm={24} md={12} lg={12}>
									<Form.Item
										name={["teams", index, "squad"]}
										label={`Team ${index + 1} Squad`}
										rules={[
											{
												required: true,
												message: `Please select at least 11 Squad Members for Team ${
													index + 1
												}!`,
											},
											{
												validator: (_, value) =>
													value.length >= 11
														? Promise.resolve()
														: Promise.reject(
																new Error(
																	`Please select at least 11 Squad Members for Team ${
																		index + 1
																	}!`
																)
														  ),
											},
										]}
									>
										<Select
											mode="multiple"
											placeholder={`Select Squad Members for Team ${
												index + 1
											}`}
											value={team.squad}
											onChange={(selected) =>
												handleSquadChange(selected, index)
											}
											options={getPlayerOptions(index)}
											style={{ width: "100%" }}
										/>
									</Form.Item>
								</Col>
							</Row>

							<Form.Item
								name={["teams", index, "playing11"]}
								label={`Team ${index + 1} Playing 11`}
								rules={[
									{
										required: true,
										message: `Please select exact 11 players for Team ${
											index + 1
										}!`,
									},
									{
										validator: (_, value) => {
											if (value.length !== 11) {
												return Promise.reject(
													new Error(
														`Please select exact 11 players for Team ${
															index + 1
														}!`
													)
												);
											}
											return Promise.resolve();
										},
									},
								]}
							>
								<Select
									mode="multiple"
									placeholder={`Select Playing 11 for Team ${index + 1}`}
									value={team.playing11}
									onChange={(selected) =>
										handleMatchDataChange(
											{ teamIndex: index, key: "playing11" },
											selected
										)
									}
									options={team.squad.map((player) => ({
										label: (
											<Space>
												<img
													src={
														players.find((p) => p._id === player)
															?.avatar
													}
													alt={
														players.find((p) => p._id === player)?.name
													}
													style={{
														width: 20,
														height: 20,
														borderRadius: "50%",
														marginRight: 8,
													}}
												/>
												{players.find((p) => p._id === player)?.name}
											</Space>
										),
										value: player,
										key: player,
									}))}
									style={{ width: "100%" }}
									disabled={team.squad.length === 0}
								/>
							</Form.Item>
							<Divider />
						</div>
					))}

					<Form.Item
						name="matchStatus"
						label="Match Status"
						rules={[{ required: true, message: "Please select match status!" }]}
					>
						<Select
							placeholder="Select match status"
							options={[
								{ label: "Scheduled", value: "Scheduled" },
								{ label: "Ongoing", value: "Ongoing" },
								{ label: "Completed", value: "Completed" },
								{ label: "Abandoned", value: "Abandoned" },
								{ label: "Postponed", value: "Postponed" },
								{ label: "Cancelled", value: "Cancelled" },
								{ label: "Delayed", value: "Delayed" },
								{ label: "Drawn", value: "Drawn" },
							]}
						/>
					</Form.Item>

					<Form.Item
						name="matchLevel"
						label="Match Level"
						rules={[{ required: true, message: "Please select match level!" }]}
					>
						<Select
							placeholder="Select match level"
							options={[
								{ label: "International", value: "International" },
								{ label: "Domestic First-class", value: "Domestic First-class" },
								{ label: "Domestic List A", value: "Domestic List A" },
								{ label: "Domestic T20", value: "Domestic T20" },
								{ label: "Club", value: "Club" },
								{ label: "School", value: "School" },
								{ label: "University", value: "University" },
								{ label: "Youth", value: "Youth" },
							]}
						/>
					</Form.Item>

					<div className="flex gap-5">
						<Form.Item
							className="flex-1"
							name="matchDate"
							label="Match Date"
							rules={[{ required: true, message: "Please select match date!" }]}
						>
							<DatePicker className="w-full" />
						</Form.Item>

						<Form.Item
							className="flex-1"
							name="totalOvers"
							label="Total Overs"
							rules={[{ required: true, message: "Please enter total overs!" }]}
						>
							<InputNumber min={1} className="w-full" />
						</Form.Item>
					</div>

					<Form.Item>
						<Button type="primary" htmlType="submit" block>
							Create Match
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default CreateMatch;
