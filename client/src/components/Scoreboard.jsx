import React from "react";

const Scoreboard = ({
  scoreData,
  overs,
  totalRuns,
  wickets,
  currentBattingTeam,
  currentBowlingTeam,
  battingPairs,
}) => {
  const currentBatter = scoreData?.currentBatter;
  const partner = battingPairs?.find(
    (p) => p.player?._id !== currentBatter?.player?._id,
  );

  return (
    <div className="w-full select-none animate-slide-up">
      <div className="glass-effect rounded-t-3xl border-x-0 border-b-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch">
          {/* Left Section: Score Focus */}
          <div className="bg-orange-500 text-black p-4 flex items-center justify-between gap-6 min-w-[300px] md:rounded-tl-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1 opacity-70">
                Batting
              </span>
              <h2 className="text-xl font-black truncate max-w-[150px] tracking-tighter">
                {currentBattingTeam?.name}
              </h2>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black tabular-nums tracking-tighter">
                {totalRuns}-{wickets}
              </span>
              <span className="text-sm font-bold opacity-80">({overs})</span>
            </div>
          </div>

          {/* Middle Section: Active Players */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* Batters */}
            <div className="flex items-center gap-6 justify-center md:justify-start">
              <div className="flex flex-col">
                <span className="text-white text-sm font-black tracking-tight">
                  {currentBatter?.player?.name}{" "}
                  <span className="text-orange-500">*</span>
                </span>
                <span className="text-zinc-400 text-xs font-mono font-bold tracking-widest">
                  {currentBatter?.batting?.runs}(
                  {currentBatter?.batting?.ballFaced})
                </span>
              </div>
              {partner && (
                <div className="flex flex-col opacity-60">
                  <span className="text-white text-sm font-bold tracking-tight">
                    {partner?.player?.name}
                  </span>
                  <span className="text-zinc-400 text-xs font-mono font-bold tracking-widest">
                    {partner?.batting?.runs}({partner?.batting?.ballFaced})
                  </span>
                </div>
              )}
            </div>

            {/* Bowler & Last Balls */}
            <div className="flex items-center justify-between md:justify-end gap-6">
              <div className="flex flex-col items-end">
                <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest mb-1">
                  Bowling
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold">
                    {scoreData?.currentBowler?.player?.name}
                  </span>
                  <span className="bg-zinc-800 text-zinc-400 font-mono text-xs px-2 py-0.5 rounded border border-zinc-700">
                    {scoreData?.currentBowler?.bowling?.wickets}-
                    {scoreData?.currentBowler?.bowling?.runGiven} (
                    {scoreData?.currentBowler?.bowling?.oversBowled})
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scoreboard;
