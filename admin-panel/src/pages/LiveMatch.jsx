import {
  Alert,
  Button,
  Col,
  notification,
  Row,
  Select,
  Spin,
  Steps,
  Table,
  Typography,
  Divider,
} from "antd";
import { TrophyFilled } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ballActions, ballExtras } from "../constants/enums";
import useMatch from "../hooks/useMatch";

// New structured components
import MatchHeader from "../components/MatchHeader";
import BallActionPanel from "../components/BallActionPanel";
import StatsTable from "../components/StatsTable";

const { Step } = Steps;
const { Title } = Typography;

const LiveMatchUpdate = () => {
  const [tossWinner, setTossWinner] = useState(null);
  const [tossDecision, setTossDecision] = useState(null);
  const [overs, setOvers] = useState(0);
  const [totalRuns, setTotalRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [currentBowler, setCurrentBowler] = useState(null);
  const [currentBatter, setCurrentBatter] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [battingPairs, setBattingPairs] = useState([]);
  const [playerBatted, setPlayerBatted] = useState([]);
  const [bowler, setBowlers] = useState([]);
  const [bowlingPlayingXI, setBowlingPlayingXI] = useState([]);
  const [battingPlayingXI, setBattingPlayingXI] = useState([]);
  const [match, setMatch] = useState({});
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedExtra, setSelectedExtra] = useState(null);
  const [matchHistory, setMatchHistory] = useState([]);

  const { getMatch, updateMatch } = useMatch();
  const { id } = useParams();

  useEffect(() => {
    getMatch(id)
      .then((data) => setMatch(data))
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    if (!match.teams) return;

    const currentBattingTeam = match.teams?.find(
      (team) => team._id === match.currentTeamBatting,
    );
    const currentBowlingTeam = match.teams?.find(
      (team) => team._id === match.currentTeamBowling,
    );

    setOvers(currentBattingTeam?.overs ?? 0);
    setTotalRuns(currentBattingTeam?.totalScore ?? 0);
    setWickets(currentBattingTeam?.totalWickets ?? 0);
    setTossWinner(currentBattingTeam?._id);
    setTossDecision(match.tossDecision);
    setBattingPlayingXI(currentBattingTeam?.playing11 || []);
    setBowlingPlayingXI(currentBowlingTeam?.playing11 || []);

    const batted =
      currentBattingTeam?.playing11?.filter(({ hasBatted }) => hasBatted) || [];
    setPlayerBatted(batted);

    const pairs =
      currentBattingTeam?.playing11?.filter(
        ({ hasBatted, batting }) => hasBatted && !batting?.isOut,
      ) || [];
    setBattingPairs(pairs);

    setCurrentBatter(match?.currentBatter);
    setCurrentBowler(match?.currentBowler);

    // Set non-striker
    if (pairs.length === 2 && match?.currentBatter) {
      setNonStriker(pairs.find((p) => p._id !== match.currentBatter._id));
    }

    setBowlers(
      currentBowlingTeam?.playing11?.filter(({ hasBowled }) => hasBowled) || [],
    );
  }, [match]);

  const transformData = (data, type) => {
    return (data || [])
      .map((player) => {
        const { batting, bowling, player: playerInfo } = player;
        const playerName = playerInfo?.name || "Unknown";

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
          };
        } else {
          const [whole, balls] = (bowling.oversBowled || 0)
            .toString()
            .split(".")
            .map(Number);
          const actual = (whole || 0) + (balls || 0) / 6;
          const economy = actual > 0 ? bowling.runGiven / actual : 0;
          return {
            bowler: playerName,
            overs: bowling.oversBowled,
            maidens: bowling.maidens || 0,
            runs: bowling.runGiven,
            wickets: bowling.wickets,
            economy: economy.toFixed(2),
            id: player._id,
          };
        }
      })
      .filter(Boolean);
  };

  const handleActionClick = async (item, type) => {
    if (type === "action") {
      if (item.name === "swap") {
        if (!nonStriker) {
          notification.warning({ message: "No non-striker available" });
          return;
        }
        const payload = { ...match, currentBatter: nonStriker };
        const data = await updateMatch(id, payload);
        setMatch(data);
        notification.success({ message: "Strike Swapped" });
        return;
      }
      setSelectedAction(selectedAction === item ? null : item);
    } else if (type === "extra") {
      setSelectedExtra(selectedExtra === item ? null : item);
    } else if (type === "match_control") {
      if (item.name === "end_match") {
        if (window.confirm("Are you sure you want to end this match?")) {
          const payload = { ...match, matchStatus: "Completed" };
          const data = await updateMatch(id, payload);
          setMatch(data);
          notification.info({ message: "Match Finalized" });
        }
      } else if (item.name === "end_innings") {
        if (window.confirm("End current innings?")) {
          const teamBatIdx = match.teams.findIndex(
            (t) => t._id === match.currentTeamBatting,
          );
          const teamBowlIdx = match.teams.findIndex(
            (t) => t._id === match.currentTeamBowling,
          );
          const payload = {
            ...match,
            currentTeamBatting: match.teams[teamBowlIdx]._id,
            currentTeamBowling: match.teams[teamBatIdx]._id,
            currentInnings: match.currentInnings + 1,
            overPlayed: 0,
            currentBatter: null,
            currentBowler: null,
            recentBalls: [],
            targetScore:
              match.currentInnings === 1
                ? match.teams[teamBatIdx].totalScore + 1
                : match.targetScore,
          };
          const data = await updateMatch(id, payload);
          setMatch(data);
          notification.success({ message: "Next Innings Started" });
        }
      }
    }
  };

  const handleBallActionSubmit = async (wicketType) => {
    if (!currentBatter || !currentBowler) return;

    const mainPayload = JSON.parse(JSON.stringify(match));
    const runAction = selectedAction?.value ?? 0;
    const runExtra = selectedExtra?.value ?? 0;
    const totalRunsThisBall = runAction + runExtra;

    const isWicket = selectedAction?.name === "W";
    const isBoundary = [4, 6].includes(runAction);
    const isLegalBall = !["Wide", "NoBall"].includes(selectedExtra?.type);

    // 1. Update Batsman
    const batsmanPayload = { ...currentBatter };
    if (!["Wide"].includes(selectedExtra?.type)) {
      batsmanPayload.batting.runs += runAction;
      batsmanPayload.batting.ballFaced += isLegalBall ? 1 : 0;
      if (runAction === 4) batsmanPayload.batting.fours += 1;
      if (runAction === 6) batsmanPayload.batting.sixes += 1;
    }
    if (isWicket) {
      batsmanPayload.batting.isOut = true;
      batsmanPayload.batting.dismissedByBowler = currentBowler.player._id;
      batsmanPayload.batting.dismissedType = wicketType;

      // Update Fall of Wickets
      const fowEntry = {
        player: currentBatter.player._id,
        score:
          mainPayload.teams.find((t) => t._id === match.currentTeamBatting)
            .totalScore + totalRunsThisBall,
        wickets:
          mainPayload.teams.find((t) => t._id === match.currentTeamBatting)
            .totalWickets + 1,
        over: matchOverPlayed,
      };
      mainPayload.fallOfWickets = [
        ...(mainPayload.fallOfWickets || []),
        fowEntry,
      ];
    }

    // 2. Update Bowler
    let bowOvers = currentBowler.bowling.oversBowled || 0;
    let overEnded = false;
    let matchOverPlayed = match.overPlayed || 0;
    let runsInCurrentOver = (match.runsInOver || 0) + totalRunsThisBall;

    if (isLegalBall) {
      const [o, b] = Number(bowOvers).toFixed(1).split(".").map(Number);
      bowOvers = b === 5 ? o + 1 : parseFloat(`${o}.${b + 1}`);

      const [mo, mb] = Number(matchOverPlayed)
        .toFixed(1)
        .split(".")
        .map(Number);
      if (mb === 5) {
        matchOverPlayed = mo + 1;
        overEnded = true;
      } else {
        matchOverPlayed = parseFloat(`${mo}.${mb + 1}`);
      }
    }

    const bowlerPayload = { ...currentBowler };
    bowlerPayload.bowling.runGiven += totalRunsThisBall;
    bowlerPayload.bowling.wickets += isWicket ? 1 : 0;
    bowlerPayload.bowling.oversBowled = Number(bowOvers.toFixed(1));

    if (overEnded) {
      if (runsInCurrentOver === 0) {
        bowlerPayload.bowling.maidens =
          (bowlerPayload.bowling.maidens || 0) + 1;
      }
      mainPayload.runsInOver = 0;
    } else {
      mainPayload.runsInOver = runsInCurrentOver;
    }

    // 3. Update Teams & Match State
    const batIdx = mainPayload.teams.findIndex(
      (t) => t._id === match.currentTeamBatting,
    );
    const bowlIdx = mainPayload.teams.findIndex(
      (t) => t._id === match.currentTeamBowling,
    );

    const pBatIdx = mainPayload.teams[batIdx].playing11.findIndex(
      (p) => p._id === currentBatter._id,
    );
    const pBowlIdx = mainPayload.teams[bowlIdx].playing11.findIndex(
      (p) => p._id === currentBowler._id,
    );

    mainPayload.teams[batIdx].totalScore += totalRunsThisBall;
    mainPayload.teams[batIdx].totalWickets += isWicket ? 1 : 0;
    mainPayload.teams[batIdx].overs = matchOverPlayed;
    mainPayload.teams[batIdx].playing11[pBatIdx] = batsmanPayload;
    mainPayload.teams[bowlIdx].playing11[pBowlIdx] = bowlerPayload;
    mainPayload.overPlayed = matchOverPlayed;

    // Ball String for timeline
    let ballStr = isWicket ? "W" : totalRunsThisBall.toString();
    if (selectedExtra?.type === "Wide")
      ballStr = (runAction > 0 ? runAction + 1 : "") + "wd";
    if (selectedExtra?.type === "NoBall")
      ballStr = (runAction > 0 ? runAction + 1 : "") + "nb";

    mainPayload.recentBalls = [
      ballStr,
      ...(mainPayload.recentBalls || []),
    ].slice(0, 12);

    // Commentary
    const desc = `${currentBowler.player.name} to ${currentBatter.player.name}, ${
      isWicket
        ? `OUT! ${wicketType ? wicketType.toUpperCase() + "!" : ""} What a delivery!`
        : isBoundary
          ? `FOUR! ${runAction === 6 ? "SIX!" : "CRACKING SHOT!"}`
          : totalRunsThisBall === 0
            ? "No run."
            : `${totalRunsThisBall === 1 ? "Just a single." : totalRunsThisBall + " runs."}`
    }`;
    mainPayload.commentary = [
      {
        ball: matchOverPlayed.toFixed(1),
        runs: totalRunsThisBall,
        event: isWicket ? "wicket" : isBoundary ? "boundary" : "normal",
        description: desc,
      },
      ...(mainPayload.commentary || []),
    ].slice(0, 30);

    // Strike Rotation
    let nextBatter = isWicket ? null : batsmanPayload;
    if (!isWicket) {
      let rotationCount = 0;
      if (
        runAction % 2 !== 0 &&
        !["Wide", "NoBall"].includes(selectedExtra?.type)
      )
        rotationCount++;
      if (overEnded) rotationCount++;

      if (rotationCount % 2 !== 0 && nonStriker) {
        nextBatter = nonStriker;
      }
    }

    mainPayload.currentBatter = nextBatter;
    mainPayload.currentBowler = overEnded ? null : bowlerPayload;
    if (overEnded) mainPayload.prevBowler = currentBowler.player._id;

    try {
      const updated = await updateMatch(id, mainPayload);
      setMatchHistory((prev) => [match, ...prev].slice(0, 5));
      setMatch(updated);
      setSelectedAction(null);
      setSelectedExtra(null);
      if (overEnded)
        notification.info({
          message: "Over Finished",
          description: `End of over ${matchOverPlayed}. Please select a new bowler.`,
        });
      if (isWicket)
        notification.warning({
          message: "Wicket!",
          description: "Select a new batsman to continue.",
        });
    } catch (e) {
      notification.error({ message: "Update Failed", description: e.message });
    }
  };

  const handleUndo = async () => {
    if (matchHistory.length === 0) {
      notification.warning({ message: "No history to undo" });
      return;
    }
    const previousState = matchHistory[0];
    try {
      const updated = await updateMatch(id, previousState);
      setMatch(updated);
      setMatchHistory((prev) => prev.slice(1));
      notification.success({ message: "Action Undone" });
    } catch (e) {
      notification.error({ message: "Undo Failed", description: e.message });
    }
  };

  const handleMOTM = async (playerId) => {
    try {
      const updated = await updateMatch(id, {
        ...match,
        playerOfTheMatch: playerId,
      });
      setMatch(updated);
      notification.success({ message: "Player of the Match Set" });
    } catch (e) {
      notification.error({
        message: "Failed to set MOTM",
        description: e.message,
      });
    }
  };

  const handleTossDecisionClick = () => {
    const teams = match.teams;
    const secondTeam = teams.find((team) => team._id !== tossWinner);
    const tossPayLoad = {
      tossWinner: tossWinner,
      tossDecision: tossDecision,
      currentTeamBatting:
        tossDecision === "Batting" ? tossWinner : secondTeam?._id,
      currentTeamBowling:
        tossDecision === "Batting" ? secondTeam?._id : tossWinner,
      matchStatus: "Ongoing",
    };
    updateMatch(id, tossPayLoad).then(setMatch);
  };

  const handleBatterAdding = (value) => {
    const batsman = JSON.parse(value);
    const payload = JSON.parse(JSON.stringify(match));
    const index = payload.teams.findIndex(
      (t) => t._id === match.currentTeamBatting,
    );
    const pIdx = payload.teams[index].playing11.findIndex(
      (p) => p._id === batsman._id,
    );
    payload.teams[index].playing11[pIdx].hasBatted = true;
    updateMatch(id, payload).then(setMatch);
  };

  const handleBowlerAdding = (value) => {
    const blr = JSON.parse(value);
    const payload = JSON.parse(JSON.stringify(match));
    const index = payload.teams.findIndex(
      (t) => t._id === match.currentTeamBowling,
    );
    const pIdx = payload.teams[index].playing11.findIndex(
      (p) => p._id === blr._id,
    );
    payload.teams[index].playing11[pIdx].hasBowled = true;
    payload.currentBowler = payload.teams[index].playing11[pIdx];
    updateMatch(id, payload).then(setMatch);
  };

  const handleCurrentBatter = (value) => {
    const btr = JSON.parse(value);
    updateMatch(id, { ...match, currentBatter: btr }).then(setMatch);
  };

  return (
    <div className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto">
        <MatchHeader
          match={match}
          totalRuns={totalRuns}
          wickets={wickets}
          overs={overs}
        />

        {/* Dynamic Partnership Indicator */}
        {match.currentBatter && battingPairs.length > 1 && (
          <div className="mb-8 animate-slide-up">
            <div className="bg-white px-4 md:px-8 py-4 rounded-2xl md:rounded-[2rem] border border-zinc-100 flex flex-col md:flex-row items-start md:items-center justify-between shadow-sm gap-4 md:gap-0">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {battingPairs.map((p, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-4 border-white flex items-center justify-center font-black text-[10px] md:text-xs ${p._id === currentBatter?._id ? "bg-orange-500 text-black" : "bg-zinc-100 text-zinc-400"}`}
                    >
                      {p.player?.name?.[0]}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest block">
                    Current Partnership
                  </span>
                  <span className="font-black text-xs md:text-sm text-zinc-900 uppercase">
                    {battingPairs[0]?.player?.name} &{" "}
                    {battingPairs[1]?.player?.name || "---"}
                  </span>
                </div>
              </div>
              <div className="flex gap-6 md:gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 border-zinc-50 pt-3 md:pt-0">
                <div className="text-center md:text-left flex-1 md:flex-none">
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
                    Runs
                  </span>
                  <span className="text-lg md:text-xl font-black tabular-nums">
                    {battingPairs.reduce(
                      (acc, p) => acc + (p.batting?.runs || 0),
                      0,
                    )}
                  </span>
                </div>
                <div className="text-center md:text-left flex-1 md:flex-none">
                  <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
                    Balls
                  </span>
                  <span className="text-lg md:text-xl font-black tabular-nums text-zinc-400">
                    {battingPairs.reduce(
                      (acc, p) => acc + (p.batting?.ballFaced || 0),
                      0,
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Match Completed - MOTM Selection */}
        {match.matchStatus === "Completed" && (
          <div className="mb-10 animate-slide-up">
            <Alert
              message="Match Completed!"
              description={
                <div className="mt-4 space-y-4">
                  <p className="font-bold text-zinc-900 uppercase tracking-tight">
                    Select Player of the Match
                  </p>
                  <div className="flex gap-4">
                    <Select
                      className="w-72 h-12"
                      placeholder="Select Player"
                      onChange={handleMOTM}
                      value={match.playerOfTheMatch}
                    >
                      {match.teams
                        .flatMap((t) => t.playing11)
                        .map((p) => (
                          <Select.Option
                            key={p.player._id}
                            value={p.player._id}
                          >
                            {p.player.name}
                          </Select.Option>
                        ))}
                    </Select>
                    {match.playerOfTheMatch && (
                      <div className="flex items-center gap-2 text-orange-500 font-black italic uppercase">
                        <TrophyFilled /> Selected
                      </div>
                    )}
                  </div>
                </div>
              }
              type="success"
              showIcon
              style={{ borderRadius: "2rem", padding: "2rem" }}
            />
          </div>
        )}

        {match?.tossWinner ? (
          <Row gutter={[32, 32]}>
            {/* Control Column */}
            <Col xs={24} lg={16} className="space-y-6 md:space-y-8">
              <BallActionPanel
                currentBowler={currentBowler}
                currentBatter={currentBatter}
                bowlingPlayingXI={bowlingPlayingXI}
                battingPairs={battingPairs}
                prevBowler={match.prevBowler}
                handleBowlerAdding={handleBowlerAdding}
                handleCurrentBatter={handleCurrentBatter}
                selectedAction={selectedAction}
                selectedExtra={selectedExtra}
                handleActionClick={handleActionClick}
                handleBallActionSubmit={handleBallActionSubmit}
                handleUndo={handleUndo}
                overs={overs}
              />

              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-md border border-zinc-100 overflow-hidden">
                <div className="p-4 md:p-8 border-b border-zinc-50 flex flex-col md:flex-row justify-between items-start md:items-center bg-zinc-50/50 gap-4">
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight italic">
                    Batting Log
                  </h3>
                  <Select
                    className="w-full md:w-56"
                    placeholder="+ New Batsman"
                    disabled={battingPairs.length === 2}
                    onChange={handleBatterAdding}
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
                <div className="overflow-x-auto">
                  <StatsTable
                    type="batting"
                    data={transformData(playerBatted, "batting")}
                    currentId={currentBatter?._id}
                  />
                </div>
              </div>
            </Col>

            {/* Side Column */}
            <Col xs={24} lg={8} className="space-y-6 md:space-y-8">
              {/* Recent Balls Grid */}
              <div className="bg-zinc-900 text-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl">
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] mb-4 md:mb-6 text-zinc-500 italic">
                  This Over
                </h3>
                <div className="grid grid-cols-6 gap-2 md:gap-3">
                  {(match.recentBalls || [])
                    .slice(0, 6)
                    .reverse()
                    .map((ball, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-xl md:rounded-2xl flex items-center justify-center font-black text-xs md:text-sm shadow-xl transition-transform hover:scale-110 ${
                          ball === "W"
                            ? "bg-red-600"
                            : ["4", "6"].includes(ball)
                              ? "bg-orange-500 text-black"
                              : "bg-zinc-800 text-zinc-400 border border-white/5"
                        }`}
                      >
                        {ball}
                      </div>
                    ))}
                  {Array.from({
                    length: Math.max(0, 6 - (match.recentBalls?.length || 0)),
                  }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square rounded-xl md:rounded-2xl border-2 border-dashed border-zinc-800 flex items-center justify-center opacity-20"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bowling Stats Card */}
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] shadow-md border border-zinc-100 overflow-hidden p-2">
                <div className="p-4 md:p-6 border-b border-zinc-50 flex items-center gap-3">
                  <div className="w-1.5 h-6 md:w-2 md:h-8 bg-orange-500 rounded-full" />
                  <h3 className="text-lg md:text-xl font-black uppercase tracking-tight italic">
                    Bowling Log
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <StatsTable
                    type="bowling"
                    data={transformData(bowler, "bowling")}
                    currentId={currentBowler?._id}
                  />
                </div>
              </div>

              {/* Real-time Commentary Log */}
              <div className="bg-zinc-100/80 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border border-zinc-200">
                <h3 className="text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 text-zinc-400">
                  Commentary Stream
                </h3>
                <div className="space-y-4 md:space-y-6 max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2 custom-scrollbar no-scrollbar">
                  {(match.commentary || []).map((c, i) => (
                    <div key={i} className="flex gap-3 md:gap-4 group">
                      <div className="flex flex-col items-center">
                        <span className="font-mono text-[9px] md:text-[10px] font-black text-zinc-900 bg-white w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg md:rounded-xl shadow-sm border border-zinc-200 group-hover:bg-orange-500 group-hover:text-black transition-colors">
                          {c.ball}
                        </span>
                        {i !== match.commentary.length - 1 && (
                          <div className="w-px flex-1 bg-zinc-300 my-2" />
                        )}
                      </div>
                      <div className="flex-1 pt-1 pb-4">
                        <p className="text-[11px] md:text-xs leading-relaxed text-zinc-600 font-bold group-hover:text-zinc-900 transition-colors">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        ) : (
          <div className="max-w-2xl mx-auto bg-white p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] shadow-2xl border border-zinc-100 text-center animate-slide-up">
            <div className="w-16 h-16 md:w-24 md:h-24 bg-orange-100 text-orange-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-10 shadow-inner rotate-3">
              <span className="text-3xl md:text-5xl">🏏</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-black text-zinc-900 mb-4 tracking-tighter uppercase italic">
              Kickoff <span className="text-orange-500">Match</span>
            </h2>
            <p className="text-zinc-500 mb-8 md:mb-12 font-bold text-base md:text-lg max-w-sm mx-auto leading-tight">
              Configure the toss results to initialize the live broadcast
              stream.
            </p>

            <div className="space-y-6 md:space-y-8 text-left">
              <div className="space-y-3">
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block pl-1">
                  Who Won the Toss?
                </label>
                <Select
                  placeholder="Select Winning Team"
                  className="w-full h-12 md:h-16 custom-select-lg"
                  onChange={setTossWinner}
                >
                  {match?.teams?.map((team) => (
                    <Select.Option key={team._id} value={team._id}>
                      {team.name}
                    </Select.Option>
                  ))}
                </Select>
              </div>

              {tossWinner && (
                <div className="animate-slide-up space-y-3">
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block pl-1">
                    Decision
                  </label>
                  <Select
                    placeholder="Decided to choose..."
                    className="w-full h-12 md:h-16"
                    onChange={setTossDecision}
                  >
                    <Select.Option value="Batting">Batting</Select.Option>
                    <Select.Option value="Bowling">Bowling</Select.Option>
                  </Select>
                </div>
              )}
            </div>

            <Button
              className="w-full h-16 md:h-20 bg-zinc-900 text-white font-black text-lg md:text-xl rounded-2xl border-none hover:!bg-black mt-8 md:mt-14 transition-all shadow-2xl shadow-zinc-900/40 uppercase tracking-widest"
              disabled={!tossDecision}
              onClick={handleTossDecisionClick}
            >
              Start Live Broadcast
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveMatchUpdate;
