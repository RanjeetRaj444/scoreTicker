import {
	Button,
	Card,
	Col,
	Divider,
	Form,
	Input,
	notification,
	Row,
	Upload,
	Typography,
} from "antd";
import { useState } from "react";
import useVenues from "../hooks/useVenues"; // A hook to create venues

const { Title } = Typography;

const CreateVenue = () => {
	const [form] = Form.useForm();
	const { createVenue } = useVenues(); // Hook to create a venue
	const [loading, setLoading] = useState(false);

	const onFinish = async (values) => {
		setLoading(true);
		try {
			await createVenue(values);
			notification.success({
				message: "Venue Created",
				description: "The venue has been successfully created.",
			});
			form.resetFields();
		} catch (error) {
			notification.error({
				message: "Error Creating Venue",
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
					Create Venue
				</Title>
				<Divider />

				<Form form={form} onFinish={onFinish} layout="vertical">
					<Row gutter={24}>
						<Col xs={24} sm={24} md={12} lg={12}>
							<Form.Item
								name="name"
								label="Venue Name"
								rules={[
									{ required: true, message: "Please enter venue name!" },
								]}
							>
								<Input placeholder="Enter venue name" />
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} lg={12}>
							<Form.Item
								name="capacity"
								label="Capacity"
								rules={[
									{ required: true, message: "Please enter venue capacity!" },
								]}
							>
								<Input type="number" placeholder="Enter venue capacity" />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={24}>
						<Col xs={24}>
							<Form.Item
								name="address"
								label="Address"
								rules={[
									{ required: true, message: "Please enter venue address!" },
								]}
							>
								<Input placeholder="Enter venue address" />
							</Form.Item>
						</Col>
					</Row>

					{/* <Row gutter={24}>
						<Col xs={24}>
							<Form.Item name="images" label="Images">
								<Upload
									listType="picture"
									beforeUpload={() => false} // Prevent automatic upload
								>
									<Button>Upload Images</Button>
								</Upload>
							</Form.Item>
						</Col>
					</Row> */}

					<Form.Item>
						<Button type="primary" htmlType="submit" block loading={loading}>
							Create Venue
						</Button>
					</Form.Item>
				</Form>
			</Card>
		</div>
	);
};

export default CreateVenue;
