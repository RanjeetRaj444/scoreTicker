import useVenues from "../hooks/useVenues";
import usePlayers from "../hooks/usePlayers";
import useMatch from "../hooks/useMatch";
import { Card, Col, Row, Statistic, Table, Typography, Tag } from "antd";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const { Title } = Typography;

const columns = [
  {
    title: "Match Title",
    dataIndex: "matchTitle",
    key: "matchTitle",
    render: (text, record) => (
      <Link
        to={
          record.matchStatus === "Ongoing"
            ? `/match/live/${record._id}`
            : `/details/${record._id}`
        }
        className="font-bold text-zinc-900 hover:text-orange-500"
      >
        {text}
      </Link>
    ),
  },
  {
    title: "Match Level",
    dataIndex: "matchLevel",
    key: "matchLevel",
    render: (level) => <Tag color="blue">{level}</Tag>,
  },
  {
    title: "Status",
    dataIndex: "matchStatus",
    key: "matchStatus",
    render: (status) => {
      const colors = {
        Ongoing: "green",
        Scheduled: "blue",
        Completed: "zinc",
        Abandoned: "red",
      };
      return <Tag color={colors[status] || "default"}>{status}</Tag>;
    },
  },
];

const Home = () => {
  const { matches } = useMatch();
  const { venues } = useVenues();
  const { players } = usePlayers();

  // Mock data for activity chart (simulating recent score updates/commentary)
  const activityData = [
    { time: "10:00", updates: 12 },
    { time: "11:00", updates: 18 },
    { time: "12:00", updates: 45 },
    { time: "13:00", updates: 30 },
    { time: "14:00", updates: 60 },
    { time: "15:00", updates: 75 },
    { time: "16:00", updates: 40 },
  ];

  const statusDistribution = [
    {
      name: "Ongoing",
      value: matches?.filter((m) => m.matchStatus === "Ongoing").length || 0,
    },
    {
      name: "Scheduled",
      value: matches?.filter((m) => m.matchStatus === "Scheduled").length || 0,
    },
    {
      name: "Completed",
      value: matches?.filter((m) => m.matchStatus === "Completed").length || 0,
    },
  ];

  const COLORS = ["#10b981", "#3b82f6", "#71717a", "#ef4444"];

  return (
    <div className="p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full space-y-8 md:space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Title
            level={2}
            className="font-black uppercase tracking-tight italic mb-2"
          >
            Admin <span className="text-orange-500">Dashboard</span>
          </Title>
          <p className="text-zinc-500 font-bold text-sm md:text-base">
            Real-time platform oversight and analytics
          </p>
        </div>
      </div>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-lg rounded-3xl border-none bg-zinc-900 text-white overflow-hidden relative">
            <Statistic
              title={
                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                  Total Matches
                </span>
              }
              value={matches?.length}
              valueStyle={{ color: "white", fontWeight: 900, fontSize: "2rem" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-lg rounded-3xl border border-zinc-100 bg-white">
            <Statistic
              title={
                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                  Ongoing
                </span>
              }
              value={matches?.filter((m) => m.matchStatus === "Ongoing").length}
              valueStyle={{
                color: "#10b981",
                fontWeight: 900,
                fontSize: "2rem",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-lg rounded-3xl border border-zinc-100 bg-white">
            <Statistic
              title={
                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                  Venues
                </span>
              }
              value={venues?.length}
              valueStyle={{
                color: "#18181b",
                fontWeight: 900,
                fontSize: "2rem",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-lg rounded-3xl border border-zinc-100 bg-white">
            <Statistic
              title={
                <span className="text-zinc-400 font-black uppercase text-[10px] tracking-widest">
                  Players
                </span>
              }
              value={players?.length}
              valueStyle={{
                color: "#18181b",
                fontWeight: 900,
                fontSize: "2rem",
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <Card
            className="rounded-[2.5rem] shadow-xl border border-zinc-100 p-2 overflow-hidden"
            title={
              <span className="font-black uppercase italic text-sm">
                Update Activity (Last 6h)
              </span>
            }
          >
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f4f4f5"
                  />
                  <XAxis
                    dataKey="time"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#71717a" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fontWeight: 700, fill: "#71717a" }}
                  />
                  <ChartTooltip
                    contentStyle={{
                      borderRadius: "1rem",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="updates"
                    stroke="#f97316"
                    strokeWidth={4}
                    dot={{ r: 6, fill: "#f97316", strokeWidth: 0 }}
                    activeDot={{ r: 8, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            className="rounded-[2.5rem] shadow-xl border border-zinc-100 p-2 overflow-hidden h-full"
            title={
              <span className="font-black uppercase italic text-sm">
                Match Status Distribution
              </span>
            }
          >
            <div className="h-[300px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ChartTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 flex-wrap">
              {statusDistribution.map((d, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[i] }}
                  />
                  <span className="text-[10px] font-bold text-zinc-500">
                    {d.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Title
            level={4}
            className="font-black uppercase tracking-tight italic m-0"
          >
            Recent Matches
          </Title>
          <div className="h-px flex-1 bg-zinc-100 mx-6 hidden md:block" />
          <Link
            to="/create-match"
            className="text-orange-500 font-black uppercase text-xs hover:underline tracking-widest"
          >
            View All
          </Link>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-md border border-zinc-100 overflow-hidden">
          <Table
            columns={columns}
            dataSource={matches}
            pagination={{ pageSize: 5 }}
            rowKey="_id"
            className="custom-admin-table"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
