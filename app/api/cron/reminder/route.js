// Runs on the morning of the event (see vercel.json) and sends the "tonight!" reminder to bot subscribers.
// Vercel calls it with "Authorization: Bearer <CRON_SECRET>". It sends at most once (key "reminder").
import * as db from "../../../../lib/db";
import { tg, botConfigured } from "../../../../lib/telegram";
import { REMINDER } from "../../../../lib/bot";
import { broadcastOnce } from "../../../../lib/broadcast";
import { safeEqual } from "../../../../lib/auth";
import { event } from "../../../../data/event";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req) {
  const auth = req.headers.get("authorization") || "";
  if (!safeEqual(auth.replace(/^Bearer /, ""), process.env.CRON_SECRET)) return new Response("unauthorized", { status: 401 });
  if (!botConfigured() || !db.dbConfigured()) return Response.json({ skipped: "not configured" });

  // Only on the event day itself (Singapore date), in case the schedule fires on another day.
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Singapore" });
  if (today !== event.start.slice(0, 10)) return Response.json({ skipped: `not event day (${today})` });

  const result = await broadcastOnce("reminder", REMINDER, { db, tg });
  return Response.json(result);
}
