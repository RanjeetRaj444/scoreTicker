import useVenues from "../hooks/useVenues";
import usePlayers from "../hooks/usePlayers";
import useMatch from "../hooks/useMatch";
import { Card, Col, Row, Statistic, Table, Typography } from "antd";
import { Link } from "react-router-dom";
const { Title } = Typography;

const columns = [
	{
		title: "Match Title",
		dataIndex: "matchTitle",
		key: "matchTitle",
		render: (text, record) =>
			record.matchStatus === "Scheduled" ||
			record.matchStatus === "Abandoned" ||
			record.matchStatus === "Postponed" ||
			record.matchStatus === "Cancelled" ||
			record.matchStatus === "Delayed" ? (
				text
			) : (
				<Link
					to={`/match/${record.matchStatus === "Ongoing" ? "live" : "completed"}/${
						record._id
					}`}
				>
					{text}
				</Link>
			),
	},
	{
		title: "Match Level",
		dataIndex: "matchLevel",
		key: "matchLevel",
	},
	{
		title: "Status",
		dataIndex: "matchStatus",
		key: "matchStatus",
	},
];

const Home = () => {
	const { matches, recentMatches } = useMatch();
	const { venues } = useVenues();
	const { players } = usePlayers();

	return (
		<div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
			<Title level={2} style={{ textAlign: "center", marginBottom: "20px" }}>
				Admin Dashboard
			</Title>

			<Row gutter={24}>
				<Col span={8}>
					<Card>
						<Statistic title="Total Matches" value={matches?.length} />
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic title="Total Venues" value={venues?.length} />
					</Card>
				</Col>
				<Col span={8}>
					<Card>
						<Statistic title="Total Players" value={players?.length} />
					</Card>
				</Col>
			</Row>

			<Title level={4} style={{ marginTop: "40px" }}>
				Recent Matches
			</Title>
			{matches?.length === 0 ? (
				<div style={{ textAlign: "center", marginTop: "50px" }}>
					<Typography.Text type="danger">No recent matches found</Typography.Text>
				</div>
			) : (
				<Table
					columns={columns}
					dataSource={matches}
					pagination={false}
					rowKey="_id"
					style={{ marginTop: "20px" }}
				/>
			)}
		</div>
	);
};

export default Home;
