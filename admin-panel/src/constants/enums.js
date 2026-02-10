export const MatchStatus = Object.freeze({
  Scheduled: "Scheduled",
  TossDone: "Toss Done",
  Ongoing: "Ongoing",
  InningsBreak: "Innings Break",
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
  {
    name: "0",
    value: 0,
    category: ["dots", "ballFaced"],
    description: "Dot Ball",
  },
  {
    name: "1",
    value: 1,
    category: ["runs", "singles", "ballFaced"],
    description: "Single",
  },
  {
    name: "2",
    value: 2,
    category: ["runs", "twos", "ballFaced"],
    description: "Double",
  },
  {
    name: "3",
    value: 3,
    category: ["runs", "threes", "ballFaced"],
    description: "Triple",
  },
  {
    name: "4",
    value: 4,
    category: ["runs", "fours", "ballFaced"],
    description: "Boundary Four",
  },
  {
    name: "6",
    value: 6,
    category: ["runs", "sixes", "ballFaced"],
    description: "Boundary Six",
  },
  {
    name: "W",
    value: 0,
    category: ["wickets", "ballFaced"],
    description: "Wicket",
  },
];

export const ballExtras = [
  {
    name: "Wd",
    value: 1,
    type: "Wide",
    category: ["extras"],
    description: "Wide Ball",
  },
  {
    name: "Nb",
    value: 1,
    type: "NoBall",
    category: ["extras"],
    description: "No Ball",
  },
  {
    name: "Lb",
    value: 0,
    type: "LegBye",
    category: ["extras", "ballFaced"],
    description: "Leg Bye",
  },
  {
    name: "By",
    value: 0,
    type: "Bye",
    category: ["extras", "ballFaced"],
    description: "Bye",
  },
];

export const wicketTypes = [
  "Bowled",
  "Caught",
  "Run out",
  "Stumped",
  "LBW",
  "Hit wicket",
  "Retired hurt",
  "Timed out",
  "Handled ball",
  "Obstructing the field",
];
