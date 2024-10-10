import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	notification,
	Row,
	Select,
	Space,
	Spin,
	Typography,
} from "antd";
import React, { useState } from "react";
import usePlayers from "../hooks/usePlayers"; // A hook to create player

const { Title } = Typography;

const CreatePlayer = () => {
	const [form] = Form.useForm();
	const { createPlayer } = usePlayers(); // Hook to create a player
	const [loading, setLoading] = useState(false);

	const onFinish = async (values) => {
		setLoading(true);
		try {
			const player = await createPlayer(values);
			notification.success({
				message: `${player.name}`,
				description: "The player has been successfully created.",
			});
			form.resetFields();
		} catch (error) {
			notification.error({
				message: "Error Creating Player",
				description: error.message,
			});
		} finally {
			setLoading(false);
		}
	};

	return (
		<div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
			<Card style={{ boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
				<Title level={2} style={{ textAlign: "center" }}>
					Create Player
				</Title>
				<Divider />

				<Form form={form} onFinish={onFinish} layout="vertical">
					<Row gutter={24}>
						<Col xs={24} sm={24} md={12} lg={12}>
							<Form.Item
								name="name"
								label="Player Name"
								rules={[{ required: true, message: "Please enter player's name!" }]}
							>
								<Input placeholder="Enter player name" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} lg={12}>
							<Form.Item name="avatar" label="Avatar URL">
								<Input placeholder="Enter avatar URL" />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={24}>
						<Col xs={24} sm={24} md={12} lg={12}>
							<Form.Item
								name="role"
								label="Player Role"
								rules={[
									{ required: true, message: "Please select player's role!" },
								]}
							>
								<Select
									placeholder="Select player role"
									options={[
										{ label: "Batter", value: "Batter" },
										{ label: "Bowler", value: "Bowler" },
										{ label: "Wicketkeeper", value: "Wicketkeeper" },
										{ label: "All-rounder", value: "All-rounder" },
									]}
								/>
							</Form.Item>
						</Col>
					</Row>

					<Form.Item>
						<Button type="primary" htmlType="submit" block loading={loading}>
							Create Player
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default CreatePlayer;
