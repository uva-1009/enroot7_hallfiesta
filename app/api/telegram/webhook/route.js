// Telegram sends every message and button tap for the bot here (see README: "Connect the bot").
import * as db from "../../../../lib/db";
import { tg, botConfigured } from "../../../../lib/telegram";
import { handleUpdate } from "../../../../lib/bot";
import { safeEqual } from "../../../../lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req) {
  // Only accept requests that carry the secret we gave Telegram in setWebhook.
  if (!safeEqual(req.headers.get("x-telegram-bot-api-secret-token"), process.env.TELEGRAM_WEBHOOK_SECRET)) {
    return new Response("forbidden", { status: 403 });
  }
  if (!botConfigured() || !db.dbConfigured()) return new Response("not configured", { status: 503 });

  try {
    const update = await req.json();
    await handleUpdate(update, { db, tg });
  } catch (e) {
    // Always answer 200 so Telegram doesn't keep retrying the same update.
    console.error("telegram update failed", e);
  }
  return new Response("ok");
}
