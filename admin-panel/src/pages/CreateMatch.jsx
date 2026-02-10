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
import {
  TrophyOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

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
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" tip="Loading data..." />
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <Typography.Text type="danger" className="text-xl font-bold">
          Error fetching data: {error}
        </Typography.Text>
      </div>
    );

  const handleSquadChange = (selected, teamIndex) => {
    const updatedTeams = [...teams];
    updatedTeams[teamIndex].squad = selected;
    setTeams(updatedTeams);

    const teamAPlayers = updatedTeams[0].squad;
    const teamBPlayers = updatedTeams[1].squad;

    if (teamAPlayers.some((player) => teamBPlayers.includes(player))) {
      notification.error({
        message: "Selection Error",
        description: "A player cannot be in both teams.",
      });
    }
  };

  const onFinish = (values) => {
    values.teams = values.teams.map((team) => ({
      ...team,
      playing11: team.playing11.map((player) => ({
        player: player,
        isCaptain: player === team.captain,
        isWK: player === team.wk,
      })),
    }));

    createMatch(values)
      .then((data) => {
        notification.success({ message: "Match Created Successfully!" });
        navigate(`/match/live/${data._id}`);
      })
      .catch((error) => {
        notification.error({
          message: "Creation Failed",
          description: error?.response?.data?.message ?? error.message,
        });
      });
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-6xl mx-auto w-full space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900 p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <Title
            level={2}
            className="!text-white font-black uppercase tracking-tight italic m-0"
          >
            Initialize <span className="text-orange-500">New Match</span>
          </Title>
          <Text className="text-zinc-400 font-bold">
            Configure teams, venue, and squad for the live broadcast
          </Text>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12 z-0">
          <TrophyOutlined className="text-[12rem] text-white" />
        </div>
      </div>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        className="space-y-8"
      >
        <Card className="rounded-[2.5rem] shadow-xl border border-zinc-100 p-4">
          <div className="flex items-center gap-3 mb-8">
            <InfoCircleOutlined className="text-orange-500 text-xl" />
            <h3 className="text-xl font-black uppercase italic tracking-tight m-0">
              General Information
            </h3>
          </div>
          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Form.Item
                name="matchTitle"
                label={
                  <span className="font-bold text-zinc-500">Match Title</span>
                }
                rules={[{ required: true }]}
              >
                <Input
                  placeholder="e.g., World Cup Final 2026"
                  className="rounded-xl h-12"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item
                name="venue"
                label={<span className="font-bold text-zinc-500">Venue</span>}
                rules={[{ required: true }]}
              >
                <Select
                  placeholder="Select Venue"
                  className="rounded-xl h-12 w-full"
                  options={venues.map((v) => ({ label: v.name, value: v._id }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="matchStatus"
                label={<span className="font-bold text-zinc-500">Status</span>}
                initialValue="Scheduled"
              >
                <Select
                  className="rounded-xl h-12"
                  options={[
                    { label: "Scheduled", value: "Scheduled" },
                    { label: "Ongoing", value: "Ongoing" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="matchDate"
                label={<span className="font-bold text-zinc-500">Date</span>}
                rules={[{ required: true }]}
              >
                <DatePicker className="rounded-xl h-12 w-full" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="totalOvers"
                label={
                  <span className="font-bold text-zinc-500">Total Overs</span>
                }
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={50}
                  className="rounded-xl h-12 w-full flex items-center"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        <Row gutter={[24, 24]}>
          {[0, 1].map((index) => (
            <Col xs={24} lg={12} key={index}>
              <Card className="rounded-[2.5rem] shadow-xl border border-zinc-100 p-4 h-full relative overflow-hidden">
                <div
                  className={`absolute top-0 right-0 w-32 h-32 ${index === 0 ? "bg-blue-500/5" : "bg-orange-500/5"} rounded-full blur-3xl -mr-16 -mt-16`}
                />
                <div className="flex items-center gap-3 mb-8">
                  <TeamOutlined
                    className={`${index === 0 ? "text-blue-500" : "text-orange-500"} text-xl`}
                  />
                  <h3 className="text-xl font-black uppercase italic tracking-tight m-0">
                    Team {index + 1}
                  </h3>
                </div>

                <Form.Item
                  name={["teams", index, "name"]}
                  label={
                    <span className="font-bold text-zinc-500">Team Name</span>
                  }
                  rules={[{ required: true }]}
                >
                  <Input
                    placeholder={`Enter Team ${index + 1} Name`}
                    className="rounded-xl h-12"
                  />
                </Form.Item>

                <Form.Item
                  name={["teams", index, "squad"]}
                  label={
                    <span className="font-bold text-zinc-500">
                      Select Squad
                    </span>
                  }
                  rules={[{ required: true }]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Select Players"
                    className="rounded-xl min-h-12 w-full"
                    onChange={(val) => handleSquadChange(val, index)}
                    options={players.map((p) => ({
                      label: p.name,
                      value: p._id,
                    }))}
                  />
                </Form.Item>

                <Form.Item
                  name={["teams", index, "playing11"]}
                  label={
                    <span className="font-bold text-zinc-500">Playing XI</span>
                  }
                  rules={[
                    { required: true, message: "Select exact 11 players" },
                    {
                      validator: (_, val) =>
                        val?.length === 11
                          ? Promise.resolve()
                          : Promise.reject("Must select 11 players"),
                    },
                  ]}
                >
                  <Select
                    mode="multiple"
                    placeholder="Playing XI (Max 11)"
                    className="rounded-xl min-h-12 w-full"
                    options={teams[index].squad.map((id) => ({
                      label: players.find((p) => p._id === id)?.name,
                      value: id,
                    }))}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name={["teams", index, "captain"]}
                      label={
                        <span className="font-bold text-zinc-500">Captain</span>
                      }
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="Captain"
                        className="rounded-xl h-10 w-full"
                        options={form
                          .getFieldValue(["teams", index, "playing11"])
                          ?.map((id) => ({
                            label: players.find((p) => p._id === id)?.name,
                            value: id,
                          }))}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name={["teams", index, "wk"]}
                      label={
                        <span className="font-bold text-zinc-500">
                          Wicket Keeper
                        </span>
                      }
                      rules={[{ required: true }]}
                    >
                      <Select
                        placeholder="WK"
                        className="rounded-xl h-10 w-full"
                        options={form
                          .getFieldValue(["teams", index, "playing11"])
                          ?.map((id) => ({
                            label: players.find((p) => p._id === id)?.name,
                            value: id,
                          }))}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Card>
            </Col>
          ))}
        </Row>

        <div className="flex justify-center pt-4">
          <Button
            type="primary"
            htmlType="submit"
            className="h-16 px-12 bg-zinc-900 border-none rounded-2xl font-black uppercase tracking-widest text-lg hover:!bg-black shadow-2xl shadow-zinc-900/40"
          >
            Launch Match Broadcast
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateMatch;
