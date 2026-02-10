import { Table, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useMatch from "../hooks/useMatch";
import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "./HomePage";

const { Title } = Typography;

const DetailsPage = () => {
  const [tossWinner, setTossWinner] = useState(null);
  const [overs, setOvers] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [currentBowler, setCurrentBowler] = useState({});
  const [currentBatter, setCurrentBatter] = useState({});
  const [playerBatted, setPlayerBatted] = useState([]);
  const [bowler, setBowlers] = useState([]);
  const [match, setMatch] = useState({});
  const [activeTab, setActiveTab] = useState("scorecard");

  const { getMatch } = useMatch();
  const { id } = useParams();

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.emit("joinMatchRoom", id);
    socket.on("matchUpdated", (data) => {
      setMatch(data);
    });
    return () => {
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
      (team) => team._id === match.currentTeamBatting,
    );
    const currentBowlingTeam = match.teams?.find(
      (team) => team._id === match.currentTeamBowling,
    );

    setOvers(currentBattingTeam?.overs ?? 0);
    setTotalRuns(currentBattingTeam?.totalScore ?? 0);
    setWickets(currentBattingTeam?.totalWickets ?? 0);
    setTossWinner(currentBattingTeam);
    setPlayerBatted(
      currentBattingTeam?.playing11?.filter(({ hasBatted }) => hasBatted) || [],
    );
    setCurrentBatter(match?.currentBatter);
    setCurrentBowler(match?.currentBowler);
    setBowlers(
      currentBowlingTeam?.playing11?.filter(({ hasBowled }) => hasBowled) || [],
    );
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
          const [wholeOvers, balls] = (bowling.oversBowled || 0)
            .toString()
            .split(".")
            .map(Number);
          const actualOvers = (wholeOvers || 0) + (balls || 0) / 6;
          const economy = actualOvers > 0 ? bowling.runGiven / actualOvers : 0;

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

  const calculateCRR = () => {
    const totalBalls = Math.floor(overs) * 6 + (overs % 1) * 10;
    if (totalBalls === 0) return "0.00";
    return ((totalRuns / totalBalls) * 6).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-20">
      {/* Header Score Summary */}
      <div className="bg-zinc-900 border-b border-zinc-800 sticky top-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-orange-500/5 blur-3xl" />
        <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <div className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1 font-bold">
                  Batting
                </div>
                <h3 className="text-xl font-black tracking-tight">
                  {
                    match.teams?.find((t) => t._id === match.currentTeamBatting)
                      ?.name
                  }
                </h3>
              </div>
              <div className="h-12 w-px bg-zinc-800" />
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-orange-500">
                  {totalRuns}-{wickets}
                </span>
                <span className="text-xl text-zinc-400 font-medium">
                  ({overs})
                </span>
              </div>
            </div>

            {/* Recent Balls Timeline */}
            <div className="flex-1 max-w-md mx-auto hidden md:flex flex-col items-center">
              <span className="text-zinc-600 text-[9px] uppercase tracking-[0.3em] font-black mb-2">
                Recently Bowled
              </span>
              <div className="flex items-center gap-1.5">
                {(match.recentBalls || []).map((ball, i) => (
                  <div
                    key={i}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-[10px] transition-all duration-300 ${
                      ball === "W"
                        ? "bg-red-600 text-white shadow-[0_0_10px_rgba(220,38,38,0.3)]"
                        : ["4", "6"].includes(ball)
                          ? "bg-orange-500 text-black shadow-[0_0_10px_rgba(249,115,22,0.3)]"
                          : "bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {ball}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-10">
              <div className="flex flex-col items-center">
                <span className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                  CRR
                </span>
                <span className="text-lg font-mono font-bold">
                  {calculateCRR()}
                </span>
              </div>
              <div className="flex items-center gap-3 bg-red-600/10 border border-red-600/20 px-4 py-2 rounded-2xl">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <span className="text-xs font-black text-red-500 uppercase tracking-widest">
                  {match.matchStatus}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 mt-10">
        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 bg-zinc-900/50 p-1.5 rounded-2xl border border-zinc-800 w-fit mx-auto overflow-x-auto no-scrollbar">
          {["scorecard", "commentary", "info"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-2.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                activeTab === tab
                  ? "bg-orange-500 text-black shadow-lg shadow-orange-500/20"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "scorecard" ? (
          <div className="space-y-10 animate-slide-up">
            {/* Batting Section */}
            <section className="premium-card overflow-hidden">
              <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  Batting Performance
                </h2>
              </div>
              <div className="overflow-x-auto">
                <Table
                  dataSource={transformData(playerBatted, "batting")}
                  pagination={false}
                  rowKey={"id"}
                  className="custom-table"
                  columns={[
                    {
                      title: "BATSMAN",
                      dataIndex: "batsman",
                      key: "batsman",
                      render: (text, record) => (
                        <div className="flex flex-col">
                          <span
                            className={`text-sm ${record?.id === currentBatter?._id ? "text-orange-500 font-black" : "font-black"}`}
                          >
                            {text}{" "}
                            {record?.id === currentBatter?._id && (
                              <span className="animate-pulse">*</span>
                            )}
                          </span>
                          {record?.isOut && (
                            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                              c & b {record.dismissedBy}
                            </span>
                          )}
                        </div>
                      ),
                    },
                    {
                      title: "R",
                      dataIndex: "runs",
                      key: "runs",
                      align: "right",
                      className: "font-mono font-black text-base",
                    },
                    {
                      title: "B",
                      dataIndex: "balls",
                      key: "balls",
                      align: "right",
                      className: "font-mono text-zinc-400",
                    },
                    {
                      title: "4s",
                      dataIndex: "fours",
                      key: "fours",
                      align: "right",
                      className: "font-mono",
                    },
                    {
                      title: "6s",
                      dataIndex: "sixes",
                      key: "sixes",
                      align: "right",
                      className: "font-mono",
                    },
                    {
                      title: "SR",
                      dataIndex: "strikeRate",
                      key: "strikeRate",
                      align: "right",
                      className: "font-mono font-bold text-orange-500/60",
                    },
                  ]}
                />
              </div>
            </section>

            {/* Bowling Section */}
            <section className="premium-card overflow-hidden">
              <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex justify-between items-center">
                <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                  <span className="w-1.5 h-4 bg-blue-500 rounded-full" />
                  Bowling Statistics
                </h2>
              </div>
              <div className="overflow-x-auto">
                <Table
                  dataSource={transformData(bowler, "bowling")}
                  pagination={false}
                  rowKey={"id"}
                  className="custom-table"
                  columns={[
                    {
                      title: "BOWLER",
                      dataIndex: "bowler",
                      render: (text, record) => (
                        <span
                          className={`text-sm font-black ${record?.id === currentBowler?._id ? "text-blue-500" : ""}`}
                        >
                          {text} {record?.id === currentBowler?._id && "*"}
                        </span>
                      ),
                    },
                    {
                      title: "O",
                      dataIndex: "overs",
                      align: "right",
                      className: "font-mono font-black",
                    },
                    {
                      title: "M",
                      dataIndex: "maidens",
                      align: "right",
                      className: "font-mono text-zinc-400",
                    },
                    {
                      title: "R",
                      dataIndex: "runs",
                      align: "right",
                      className: "font-mono",
                    },
                    {
                      title: "W",
                      dataIndex: "wickets",
                      align: "right",
                      className: "font-mono font-black text-red-500",
                    },
                    {
                      title: "ECON",
                      dataIndex: "economy",
                      align: "right",
                      className: "font-mono font-bold text-zinc-500",
                    },
                  ]}
                />
              </div>
            </section>
          </div>
        ) : activeTab === "commentary" ? (
          <div className="space-y-6 animate-slide-up max-w-2xl mx-auto">
            {match.commentary?.length > 0 ? (
              match.commentary.map((c, i) => (
                <div key={i} className="flex gap-6 group">
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center font-black text-sm text-orange-500 shadow-xl group-hover:scale-110 group-hover:bg-zinc-800 transition-all duration-300">
                      {c.ball}
                    </div>
                    {i !== match.commentary.length - 1 && (
                      <div className="w-px flex-1 bg-gradient-to-b from-zinc-800 to-transparent my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-10">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                          c.event === "wicket"
                            ? "bg-red-600 text-white"
                            : c.event === "boundary"
                              ? "bg-orange-500 text-black"
                              : "bg-zinc-800 text-zinc-500"
                        }`}
                      >
                        {c.event}
                      </span>
                    </div>
                    <p className="text-zinc-300 leading-relaxed font-bold text-base group-hover:text-white transition-colors">
                      {c.description}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-32 premium-card">
                <div className="text-4xl mb-6 opacity-20 italic font-black uppercase tracking-tighter text-zinc-500">
                  No commentary yet
                </div>
                <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
                  Live updates will appear here ball-by-ball
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-slide-up">
            <div className="premium-card p-10">
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] mb-10 italic">
                Match Details
              </h3>
              <div className="space-y-8">
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    Venue
                  </span>
                  <span className="text-lg font-black">
                    {match.venue?.name}, {match.venue?.city}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    Toss Result
                  </span>
                  <span className="text-lg font-bold text-orange-500">
                    {tossWinner?.name} won toss & elected to{" "}
                    {match.tossDecision}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">
                    Match Level
                  </span>
                  <span className="text-base font-bold text-zinc-400">
                    {match.matchLevel}
                  </span>
                </div>
              </div>
            </div>

            <div className="premium-card p-10">
              <h3 className="text-xs font-black text-zinc-600 uppercase tracking-[0.3em] mb-10 italic">
                Participating Teams
              </h3>
              <div className="space-y-10">
                {match.teams?.map((team, idx) => (
                  <div key={idx} className="flex items-center gap-6">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-3xl font-black text-orange-500">
                      {team.name[0]}
                    </div>
                    <div>
                      <p className="text-xl font-black tracking-tight">
                        {team.name}
                      </p>
                      <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">
                        {team.playing11?.length} Squad Members
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsPage;
