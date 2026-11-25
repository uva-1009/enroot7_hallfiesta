// Booth content for the site. Stamp codes are NOT here: they live in the database
// and facilitators set them on /staff, so they never appear in the public code.
export const booths = [
  {
    id: "nerf", name: "Target Blast", tagline: "Aim, fire, dodge the barriers.",
    color: "#E0453A", tilt: -2.5, players: "Teams of 5", gear: "1 Nerf blaster per team",
    summary: "Five teammates share one blaster to bring down a whole structure of cups. Barriers stand in the way, and hitting one costs you, so every shot needs a plan, not just a trigger finger.",
    how: [
      "Your team of 5 lines up behind the firing line and receives one Nerf blaster.",
      "A cup structure waits at the far end, with barriers placed in between.",
      "Take turns shooting. Everyone gets a go, so pass the blaster and talk each other through it.",
      "Knock down every cup to clear the booth. Hitting a barrier adds a penalty.",
      "A facilitator tracks your shots and penalties, then resets the lane for the next team.",
    ],
    tips: ["Let your steadiest shooter go first to read the lane.", "Call out the barrier layout before each shooter steps up.", "Aim low on the structure so falling cups take their neighbours with them."],
    safety: ["Foam-dart blasters only", "One shooter at a time", "Stay behind the safety line", "Facilitators handle the blasters", "Never aim at people", "Collect darts only after the round ends"],
  },
  {
    id: "pasta", name: "Pasta Tower Challenge", tagline: "Spaghetti. Tape. Gravity.",
    color: "#1FA1B3", tilt: 1.5, players: "2 teams face off", gear: "Raw pasta + limited tape",
    summary: "Two teams go head to head, racing the clock to build the tallest freestanding tower from raw pasta and a little tape. Everyone earns a stamp, and the winning team takes snacks too.",
    how: [
      "Two teams face each other, each with the same pile of raw pasta and a limited amount of tape.",
      "You have 5 minutes to build the tallest tower you can.",
      "When time is up, hands off. The tower must stand on its own to count.",
      "The tallest stable tower wins snacks for the team.",
      "Win or lose, both teams receive a stamp.",
    ],
    tips: ["Triangles hold up better than squares.", "Build a wide base first, then go tall.", "Save some tape for the top, where towers usually fail."],
  },
  {
    id: "ball", name: "Ball Transfer", tagline: "Get it across. Don't hold it.",
    color: "#F39B2E", tilt: -1.5, players: "Whole team", gear: "Cups, paper, cardboard, string",
    summary: "Move a ball from the start line to the end without carrying it. The twist: it can't stay on any one surface, tool or person for more than 3 to 4 seconds, so your team has to keep it moving.",
    how: [
      "Collect materials from the materials table: cups, paper, cardboard and string.",
      "Start at the start line and get the ball to the end zone.",
      "Nobody may carry the ball the normal way.",
      "The ball can't stay on the same surface, tool or teammate for more than 3 to 4 seconds. Think relay, not shelf.",
      "Reach the end zone to complete the booth.",
    ],
    tips: ["Chutes, tracks, funnels and scoops all work. Mix them.", "Give one person the job of counting the seconds out loud.", "Practise one hand-off before you start the real run."],
  },
];
