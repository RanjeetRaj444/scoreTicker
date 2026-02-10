import React, { useEffect, useState } from "react";
import Scoreboard from "../components/Scoreboard";
import { useParams } from "react-router-dom";
import { API_BASE_URL, SOCKET_SERVER_URL } from "./HomePage";
import { io } from "socket.io-client";
import axios from "axios";

import { Link } from "react-router-dom";

const StreamingPage = () => {
  const { id } = useParams();
  const [match, setMatch] = useState({});

  const updateMatchData = (data) => {
    setMatch(data);
  };

  const getInitialMatchData = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/matches/${id}`);
      updateMatchData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getInitialMatchData();
    const socket = io(SOCKET_SERVER_URL);
    socket.emit("joinMatchRoom", id);
    socket.on("matchUpdated", (data) => {
      updateMatchData(data);
    });
    return () => {
      socket.emit("leaveMatchRoom", id);
      socket.disconnect();
    };
  }, [id]);

  const currentBattingTeam = match.teams?.find(
    (team) => team._id === match.currentTeamBatting,
  );
  const currentBowlingTeam = match.teams?.find(
    (team) => team._id === match.currentTeamBowling,
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden flex flex-col">
      {/* Broadcast Header */}
      <div className="glass-effect p-4 sticky top-0 z-50 border-x-0 border-t-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-zinc-500 hover:text-white transition-colors bg-white/5 w-10 h-10 rounded-full flex items-center justify-center"
            >
              <span>←</span>
            </Link>
            <div>
              <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">
                Cricket <span className="text-orange-500">Live</span>
              </h1>
              <p className="text-[10px] text-zinc-500 font-bold tracking-[0.2em] uppercase">
                {match.matchTitle || "Premium Stream"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 bg-red-600/10 border border-red-600/20 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
              <span className="text-[10px] font-black uppercase tracking-widest text-red-500">
                Live
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Broadcast Container */}
      <div className="flex-1 relative bg-zinc-950 flex flex-col overflow-hidden">
        {/* Aspect Ratio Box for Stream */}
        <div className="relative w-full h-full">
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src="https://www.youtube.com/embed/q60V5PrOjgs?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1"
            title="Live Cricket Stream"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>

          {/* Stream Overlay HUD */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/20" />

          {/* Floating Branding */}
          <div className="absolute top-10 right-10 opacity-20 hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <span className="text-6xl font-black italic tracking-tighter text-white/10 uppercase">
              Live
            </span>
          </div>

          {/* Right Side Commentary Overlay - Floating */}
          <div className="absolute top-10 right-10 bottom-32 w-80 hidden lg:flex flex-col gap-4 pointer-events-none">
            <div className="bg-black/40 backdrop-blur-xl rounded-3xl border border-white/5 p-6 flex-1 flex flex-col overflow-hidden shadow-2xl">
              <h3 className="text-orange-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                Live Commentary
              </h3>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 pointer-events-auto custom-scrollbar">
                {(match.commentary || []).map((c, i) => (
                  <div
                    key={i}
                    className="animate-slide-up bg-white/5 p-3 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-zinc-500 font-black text-[10px] tabular-nums">
                        {c.ball}
                      </span>
                      <span
                        className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${
                          c.event === "wicket"
                            ? "bg-red-600 text-white"
                            : c.event === "boundary"
                              ? "bg-orange-500 text-black"
                              : "bg-transparent text-zinc-600"
                        }`}
                      >
                        {c.event !== "normal" ? c.event : ""}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-zinc-300 leading-relaxed">
                      {c.description}
                    </p>
                  </div>
                ))}
                {!match.commentary?.length && (
                  <p className="text-zinc-600 italic text-xs text-center py-10 uppercase tracking-widest font-black">
                    Connecting to field...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Scoreboard Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-10 z-20 pointer-events-none">
          <div className="max-w-5xl mx-auto flex flex-col gap-4">
            {/* Recent Balls Bubbles */}
            <div className="flex justify-center md:justify-start gap-2 mb-2 animate-slide-up">
              {(match.recentBalls || []).map((ball, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 md:w-11 md:h-11 rounded-full flex items-center justify-center font-black text-xs md:text-sm shadow-2xl transition-all duration-300 ${
                    ball === "W"
                      ? "bg-red-600 text-white animate-bounce"
                      : ["4", "6"].includes(ball)
                        ? "bg-orange-500 text-black scale-110"
                        : "bg-black/60 backdrop-blur-md text-zinc-400 border border-white/10"
                  }`}
                >
                  {ball}
                </div>
              ))}
            </div>

            <div className="pointer-events-auto">
              <Scoreboard
                scoreData={match}
                overs={currentBattingTeam?.overs}
                totalRuns={currentBattingTeam?.totalScore}
                wickets={currentBattingTeam?.totalWickets}
                currentBattingTeam={currentBattingTeam}
                currentBowlingTeam={currentBowlingTeam}
                battingPairs={
                  currentBattingTeam?.playing11?.filter(
                    ({ hasBatted, batting }) => hasBatted && !batting?.isOut,
                  ) || []
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreamingPage;
