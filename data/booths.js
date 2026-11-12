// Edit everything about the booths here. CHANGE THE CODES before the event:
// facilitators tell each team its booth's code after they finish, and the team types it in to get the stamp.
export const booths = [
  {
    id: "nerf", name: "Nerf Cup Knockdown", tagline: "Aim, fire, dodge the junk.",
    color: "#E0584B", tilt: -2.5, code: "HALL", players: "Teams of 5", gear: "1 Nerf blaster per team",
    summary: "Five teammates, one blaster and a tower of 15 cups at the end of the lane. Obstacles sit in the way, so every shot needs a plan, not just a trigger finger.",
    how: [
      "Your team of 5 lines up behind the marked firing line and receives one Nerf blaster.",
      "A stack of 15 cups waits at the far end of the lane, with obstacles placed in between.",
      "One teammate shoots at a time. Everyone gets an attempt, so the whole team adds to the score and nobody gets benched.",
      "A shot counts when the dart brings cups down without hitting an obstacle.",
      "A facilitator counts the fallen cups, then resets the lane for the next team.",
    ],
    tips: ["Let your steadiest shooter go first to read the lane.", "Call out the obstacle layout before each shooter steps up.", "Aim at the middle of the stack so falling cups take their neighbours with them."],
    safety: ["Foam-dart blasters only", "One shooter at a time", "Stay behind the safety line", "Facilitators handle the blasters", "Never aim at people", "Collect darts only after the round ends"],
  },
  {
    id: "pasta", name: "Pasta Tower Challenge", tagline: "Spaghetti. Tape. Gravity.",
    color: "#6FB3AC", tilt: 1.5, code: "WARS", players: "2 teams face off", gear: "Raw spaghetti + tape",
    summary: "Two teams share a table and race to build the tallest tower out of raw spaghetti and tape. The winners get snacks, but both teams walk away with their stamp.",
    how: [
      "Two teams sit across from each other, each with the same pile of raw spaghetti and tape.",
      "You have 5 minutes to build the tallest tower you can.",
      "When time is up, hands off. Your tower must stand unsupported for 10 seconds to count.",
      "The tallest standing tower wins the snacks.",
      "Win or lose, both teams receive a stamp.",
    ],
    tips: ["Triangles hold up better than squares.", "Build a wide base first, then go tall.", "Test early. A tower that falls at second 9 scores nothing."],
  },
  {
    id: "ball", name: "Ball Transfer", tagline: "Get it across. Don't hold it.",
    color: "#E8B04A", tilt: -1.5, code: "2026", players: "Whole team", gear: "Cups, paper, cardboard, string",
    summary: "Move a ball from the start to the end point without ever carrying it. The twist: it can't rest on any one surface for more than 3 to 4 seconds, so your contraption has to keep it moving.",
    how: [
      "Your team gets simple materials such as cups, paper, cardboard and string.",
      "Design your own way to get the ball from the starting point to the endpoint.",
      "Nobody may carry the ball by hand.",
      "The ball cannot stay in contact with the same surface for more than 3 to 4 seconds, so think relay, not shelf.",
      "Reach the endpoint to complete the booth.",
    ],
    tips: ["Chutes, tracks, funnels and scoops all work. Mix them.", "Give one person the job of watching the clock on each surface.", "Test with the ball before you commit to a design."],
  },
];
