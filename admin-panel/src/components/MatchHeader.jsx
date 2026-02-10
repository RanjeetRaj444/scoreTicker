import React from "react";

const MatchHeader = ({ match, totalRuns, wickets, overs }) => {
  const currentBattingTeam = match.teams?.find(
    (team) => team._id === match.currentTeamBatting,
  );

  return (
    <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 md:mb-10 bg-white p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] shadow-sm border border-zinc-100 gap-6">
      <div className="flex items-center gap-4 md:gap-6">
        <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-zinc-900 flex items-center justify-center text-xl md:text-3xl font-black text-orange-500 shadow-xl shrink-0">
          {currentBattingTeam?.name?.[0] || "M"}
        </div>
        <div>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none whitespace-normal md:whitespace-nowrap">
            {currentBattingTeam?.name}{" "}
            <span className="text-zinc-400 text-sm md:text-xl font-bold lowercase italic px-1">
              vs
            </span>{" "}
            {match.teams?.find((t) => t._id !== match.currentTeamBatting)?.name}
          </h1>
          <p className="text-zinc-500 text-[8px] md:text-[10px] font-black tracking-[0.2em] md:tracking-[0.3em] uppercase mt-2">
            {match.matchTitle} • {match.venue?.name}
          </p>
          {match.currentInnings > 1 && match.targetScore > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                Target: {match.targetScore}
              </span>
              <span className="text-[9px] md:text-[10px] font-bold text-zinc-400">
                Need {match.targetScore - totalRuns} off{" "}
                {match.totalOvers * 6 -
                  (Math.floor(overs) * 6 + (overs % 1) * 10)}{" "}
                balls
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 md:gap-10 bg-zinc-50 px-4 md:px-8 py-4 rounded-3xl border border-zinc-100 w-full lg:w-auto">
        <div className="text-center flex-1 lg:flex-none">
          <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
            CRR
          </span>
          <span className="text-lg md:text-xl font-black text-zinc-900">
            {overs > 0
              ? (totalRuns / (Math.floor(overs) + (overs % 1) * 1.666)).toFixed(
                  2,
                )
              : "0.00"}
          </span>
        </div>
        <div className="hidden sm:block h-10 w-px bg-zinc-200" />
        <div className="text-center flex-1 lg:flex-none">
          <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
            Innings Score
          </span>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-3xl md:text-5xl font-black text-zinc-900 tracking-tighter tabular-nums">
              {totalRuns}-{wickets}
            </span>
            <span className="text-base md:text-xl text-zinc-400 font-bold">
              ({overs})
            </span>
          </div>
        </div>
        <div className="hidden lg:block h-12 w-px bg-zinc-200" />
        <div className="text-center hidden lg:block">
          <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
            Recent
          </span>
          <div className="flex gap-1">
            {(match.recentBalls || [])
              .slice(0, 5)
              .reverse()
              .map((b, i) => (
                <span
                  key={i}
                  className={`text-[10px] font-black px-2 py-0.5 rounded-md ${b === "W" ? "bg-red-500 text-white" : ["4", "6"].includes(b) ? "bg-orange-500 text-black" : "text-zinc-400 border border-zinc-200"}`}
                >
                  {b}
                </span>
              ))}
          </div>
        </div>
        <div className="hidden lg:block h-12 w-px bg-zinc-200" />
        <div className="text-center flex-1 lg:flex-none">
          <span className="text-[9px] md:text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">
            Status
          </span>
          <div className="flex items-center justify-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${match.matchStatus === "Ongoing" ? "bg-red-500 animate-pulse" : "bg-zinc-400"}`}
            />
            <span className="text-xs md:text-sm font-black uppercase tracking-widest text-zinc-900">
              {match.matchStatus}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MatchHeader;
