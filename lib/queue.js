// Queue levels facilitators can pick on /staff. The site and the bot show these labels.
export const QUEUE = {
  none: { label: "No wait", short: "No wait", color: "#4F9D96", text: "#231815" },
  short: { label: "About 5 min", short: "~5 min", color: "#E3A93B", text: "#231815" },
  long: { label: "10 min or more", short: "10+ min", color: "#B3202A", text: "#F4E8C8" },
  closed: { label: "Closed", short: "Closed", color: "#231815", text: "#F4E8C8" },
};
export const QUEUE_LEVELS = Object.keys(QUEUE);
