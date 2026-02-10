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
    <div className="p-4 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
      <Card className="shadow-2xl shadow-zinc-200/50 rounded-3xl border-none">
        <Title
          level={2}
          className="text-center font-black uppercase tracking-tight italic mb-0"
        >
          Create Venue
        </Title>
        <Divider className="my-8" />

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
