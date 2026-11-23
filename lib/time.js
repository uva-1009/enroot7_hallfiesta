// Countdown maths shared by the website and the Telegram bot.
import { event } from "../data/event";

export const START = new Date(event.start).getTime();
export const END = new Date(event.end).getTime();
export const BOOTHS_OPEN = new Date(event.boothsOpen).getTime();
export const BOOTHS_CLOSE = new Date(event.boothsClose).getTime();

// "before" until 7pm, "live" during the event, "after" once it ends.
export function phase(now = Date.now()) {
  if (now < START) return "before";
  if (now < END) return "live";
  return "after";
}

export function boothsAreOpen(now = Date.now()) {
  return now >= BOOTHS_OPEN && now < BOOTHS_CLOSE;
}

// Show live queue times from 30 minutes before the start until the booths close.
export function queueIsRelevant(now = Date.now()) {
  return now >= START - 30 * 60 * 1000 && now < BOOTHS_CLOSE;
}

export function parts(ms) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
}

const plural = (n, word) => `${n} ${word}${n === 1 ? "" : "s"}`;

// "6 days, 4 hours and 12 minutes"
export function humanCountdown(now = Date.now()) {
  const { days, hours, minutes } = parts(START - now);
  const bits = [];
  if (days) bits.push(plural(days, "day"));
  if (hours) bits.push(plural(hours, "hour"));
  if (minutes || bits.length === 0) bits.push(plural(minutes, "minute"));
  return bits.length > 1 ? `${bits.slice(0, -1).join(", ")} and ${bits[bits.length - 1]}` : bits[0];
}

// "3 min ago" for queue updates.
export function ago(iso, now = Date.now()) {
  const m = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60000));
  if (m < 1) return "just now";
  if (m < 60) return `${m} min ago`;
  return `${Math.round(m / 60)} h ago`;
}
