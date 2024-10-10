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
	return (
		<div className="relative bg-gray-900 text-white w-full py-2 shadow-lg rounded-lg">
			<div className="flex justify-between items-center px-4">
				{/* Left Team Section */}
				<div className="flex items-center">
					<img
						src="/path-to-left-team-logo.png"
						alt="Left Team Logo"
						className="h-12 w-12"
					/>
					<div className="ml-2">
						<h2 className="text-lg font-bold">{currentBattingTeam?.name}</h2>
						<p className="text-sm">
							{currentBattingTeam?.totalScore} - {currentBattingTeam?.totalWickets} (
							{currentBattingTeam?.overs})
						</p>
					</div>
				</div>

				{/* Middle Section - Players Info */}
				<div className="flex flex-col text-center">
					<div className="flex justify-between items-center mb-1">
						<div className="flex items-center mr-4">
							<span className="bg-yellow-600 px-2 py-1 text-xs font-bold mr-2 rounded-md">
								B1
							</span>
							<p className="text-sm">
								{battingPairs[0]?.player?.name}: {battingPairs[0]?.batting?.runs} (
								{battingPairs[0]?.batting?.ballFaced})
							</p>
						</div>
						<div className="flex items-center">
							<span className="bg-yellow-600 px-2 py-1 text-xs font-bold mr-2 rounded-md">
								B2
							</span>
							<p className="text-sm">
								{battingPairs[1]?.player?.name}: {battingPairs[1]?.batting?.runs} (
								{battingPairs[1]?.batting?.ballFaced})
							</p>
						</div>
					</div>
					<div className="text-sm flex items-center justify-center">
						<span className="font-semibold mr-1">Bowler:</span>
						<p className="mr-2">{scoreData?.currentBowler?.player?.name}</p>
						<p className="mr-1">{scoreData?.currentBowler?.bowling?.oversBowled}</p>(
						{scoreData?.currentBowler?.bowling?.runGiven} /
						<p className="ml-1">{scoreData?.currentBowler?.bowling?.wickets}</p>)
					</div>
				</div>

				{/* Right Team Section */}
				<div className="flex items-center">
					<div className="text-right mr-2">
						<h2 className="text-lg font-bold">{currentBowlingTeam?.name}</h2>
						{/* <p className="text-sm">10-0 (0.5)</p> */}
					</div>
					<img
						src="/path-to-right-team-logo.png"
						alt="Right Team Logo"
						className="h-12 w-12"
					/>
				</div>
			</div>

			{/* <div className="flex justify-between items-center px-4 mt-2 border-t border-gray-700 pt-1">
				<p className="text-sm">CRR: 12.3 | RRR: 10.5</p>
				<div className="flex items-center">
					<p className="text-sm mr-4">Projected: 112</p>

					<div className="flex items-center space-x-1">
						<div className="h-3 w-3 rounded-full bg-white"></div>
						<div className="h-3 w-3 rounded-full bg-red-500"></div>
						<div className="h-3 w-3 rounded-full bg-white"></div>
						<div className="h-3 w-3 rounded-full bg-red-500"></div>
						<div className="h-3 w-3 rounded-full bg-white"></div>
					</div>
				</div>
			</div> */}
		</div>
	);
};

export default Scoreboard;
