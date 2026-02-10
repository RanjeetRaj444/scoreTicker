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
import { TrophyFilled } from "@ant-design/icons";
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
    <div className="p-4 md:p-8 lg:p-12 max-w-4xl mx-auto w-full">
      <Card className="shadow-2xl shadow-zinc-200/50 rounded-3xl border-none">
        <Title
          level={2}
          className="text-center font-black uppercase tracking-tight italic mb-0"
        >
          Create Player
        </Title>
        <Divider className="my-8" />

        <Form form={form} onFinish={onFinish} layout="vertical">
          <Row gutter={24}>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                name="name"
                label="Player Name"
                rules={[
                  { required: true, message: "Please enter player's name!" },
                ]}
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
                name="battingStyle"
                label="Batting Style"
                initialValue="Right-hand bat"
              >
                <Select
                  options={[
                    { label: "Right-hand bat", value: "Right-hand bat" },
                    { label: "Left-hand bat", value: "Left-hand bat" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12}>
              <Form.Item
                name="bowlingStyle"
                label="Bowling Style"
                initialValue="N/A"
              >
                <Input placeholder="e.g. Right-arm fast" />
              </Form.Item>
            </Col>
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
