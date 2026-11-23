// Sends one message to every bot subscriber, once per key (e.g. "reminder", "feedback").
import { TelegramError } from "./telegram";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function broadcastOnce(key, message, { db, tg }) {
  const claimed = await db.claimBroadcast(key);
  if (!claimed) return { alreadySent: true, sent: 0, failed: 0 };

  const ids = await db.subscriberIds();
  let sent = 0, failed = 0;
  for (const chatId of ids) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", ...message });
        sent++;
        break;
      } catch (e) {
        if (e instanceof TelegramError && e.code === 429 && attempt === 0) { await sleep((e.retryAfter ?? 1) * 1000); continue; }
        if (e instanceof TelegramError && (e.code === 403 || e.code === 400)) await db.removeSubscriber(chatId).catch(() => {}); // blocked the bot or chat gone
        failed++;
        break;
      }
    }
    await sleep(40); // stay well under Telegram's ~30 messages/second limit
  }
  await db.finishBroadcast(key, sent);
  return { alreadySent: false, sent, failed };
}
