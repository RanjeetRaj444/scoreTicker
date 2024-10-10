export const MatchStatus = Object.freeze({
	Scheduled: "Scheduled",
	Ongoing: "Ongoing",
	Completed: "Completed",
	Abandoned: "Abandoned",
	Postponed: "Postponed",
	Cancelled: "Cancelled",
	Delayed: "Delayed",
	Drawn: "Drawn",
});

export const PlayerRole = Object.freeze({
	Batter: "Batter",
	Bowler: "Bowler",
	Wicketkeeper: "Wicketkeeper",
	AllRounder: "All-rounder",
});

export const ballActions = [
	{ name: "4", value: 4, ballType: "legal", category: ["runs", "fours, ballFaced"] },
	{ name: "1", value: 1, ballType: "legal", category: ["runs", "singles, ballFaced"] },
	{ name: "6", value: 6, ballType: "legal", category: ["runs", "sixes, ballFaced"] },
	{ name: "2", value: 2, ballType: "legal", category: ["runs", "twos, ballFaced"] },
	{ name: "3", value: 3, ballType: "legal", category: ["runs", "threes, ballFaced"] },
	{ name: "Dot Ball", value: 0, ballType: "legal", category: ["dots, ballFaced"] },
	{ name: "Wicket", value: 0, ballType: "legal", category: ["wickets, ballFaced"] },
];

export const ballExtras = [
	{ name: "No Ball", value: 1, ballType: "not-legal", category: ["extras"] },
	{ name: "Wide", value: 1, ballType: "not-legal", category: ["extras"] },
];
