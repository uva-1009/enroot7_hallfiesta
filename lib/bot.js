// The Hall Fiesta Telegram bot. handleUpdate() receives one update from Telegram's webhook.
// Dependencies (db, tg, now) are passed in so the logic can be tested without a real database or bot.
import { event } from "../data/event";
import { booths } from "../data/booths";
import { QUEUE } from "./queue";
import { phase, humanCountdown, queueIsRelevant, boothsAreOpen, BOOTHS_OPEN, BOOTHS_CLOSE, ago } from "./time";
import { esc } from "./telegram";

const kb = (rows) => ({ inline_keyboard: rows });
export const MENU = kb([
  [{ text: "⏳ Countdown", callback_data: "cmd:countdown" }, { text: "🎪 Queue", callback_data: "cmd:queue" }],
  [{ text: "📍 Event info", callback_data: "cmd:info" }, { text: "📝 Feedback", callback_data: "fb:start" }],
]);

const COMMANDS =
  "/countdown  time until the show\n" +
  "/queue  live wait at each booth\n" +
  "/info  date, venue and run of show\n" +
  "/feedback  tell us how it went\n" +
  "/stop  stop reminders";

// ---------- message texts ----------
export function countdownText(now) {
  const p = phase(now);
  if (p === "before") {
    return `⏳ <b>${event.name}</b> starts in <b>${humanCountdown(now)}</b>.\n\n` +
      `${event.dateLabel}, ${event.timeLabel}\n${event.venue}, ${event.venueDetail}`;
  }
  if (p === "live") {
    return boothsAreOpen(now)
      ? `🎪 <b>${event.name}</b> is on right now! Booths are open until 8:55pm.\nSend /queue to find the shortest line.`
      : now < BOOTHS_OPEN
        ? `🎪 <b>${event.name}</b> has started. Booths open at 7:25pm, right after the safety briefing.`
        : `🎪 Booths have closed for the night. Closing is happening now, see you there!`;
  }
  return `That's a wrap on <b>${event.name}</b>. Thanks for coming!\nSend /feedback to tell us how it went.`;
}

const DOT = { none: "🟢", short: "🟡", long: "🔴", closed: "⛔" };
export function queueText(queue, now) {
  if (!queueIsRelevant(now)) {
    return now >= BOOTHS_CLOSE
      ? "The booths are closed for the night. Thanks for playing!"
      : `Live queue times switch on during the event on ${event.shortDate}. Booths open at 7:25pm.`;
  }
  const lines = booths.map((b) => {
    const q = queue[b.id];
    if (!q) return `▫️ <b>${b.name}</b>: no update yet`;
    return `${DOT[q.level] ?? "▫️"} <b>${b.name}</b>: ${QUEUE[q.level]?.label ?? q.level} <i>(${ago(q.updatedAt, now)})</i>`;
  });
  const free = booths.find((b) => queue[b.id]?.level === "none");
  const head = now < BOOTHS_OPEN ? "🎪 <b>Live queue</b>\nBooths open at 7:25pm, right after the safety briefing." : "🎪 <b>Live queue</b>";
  return `${head}\n\n${lines.join("\n")}` + (free ? `\n\nShortest line right now: <b>${free.name}</b>` : "");
}

export function infoText() {
  const sched = event.schedule.map((s) => `${s.time}  ${s.title}`).join("\n");
  return `🎪 <b>${event.name}</b> by ${event.presenter}\n\n` +
    `📅 ${event.dateLabel}\n🕖 ${event.timeLabel}\n📍 ${event.venue}, ${event.venueDetail}\n\n` +
    `<b>Run of show</b>\n${sched}\n\n` +
    `Register: ${event.registerUrl}\nBooth rules: ${event.siteUrl}/booths\nFloor map: ${event.siteUrl}/map`;
}

export const REMINDER = {
  text: `🎪 <b>${event.name} is tonight!</b>\n\n${event.timeLabel} at the ${event.venue}, ${event.venueDetail}.\n` +
    `Come by 7pm for team assembly. The safety briefing at 7:15pm is required before you play.\n\n` +
    `Bring a charged phone for your stamps and photos.`,
  reply_markup: kb([[{ text: "Booth rules", url: `${event.siteUrl}/booths` }, { text: "Floor map", url: `${event.siteUrl}/map` }], [{ text: "Not registered yet?", url: event.registerUrl }]]),
};

export const FEEDBACK_ASK = {
  text: `Thanks for coming to <b>${event.name}</b>! 🎪\n\nGot 30 seconds? Tell us how it went. Six quick questions, and no names are stored with your answers.`,
  reply_markup: kb([[{ text: "📝 Give feedback", callback_data: "fb:start" }]]),
};

// ---------- feedback flow ----------
export const STEPS = [
  { key: "nerf", q: "How was <b>Nerf Cup Knockdown</b>?", type: "rate", skip: true },
  { key: "pasta", q: "How was <b>Pasta Tower Challenge</b>?", type: "rate", skip: true },
  { key: "ball", q: "How was <b>Ball Transfer</b>?", type: "rate", skip: true },
  { key: "overall", q: `Overall, how was <b>${event.name}</b>?`, type: "rate" },
  { key: "again", q: "Would you come to another hall event?", type: "choice", options: [["yes", "Yes!"], ["maybe", "Maybe"], ["no", "Probably not"]] },
  { key: "change", q: "Last one: what's one thing you'd change? Type your answer below, or tap Skip.", type: "text" },
];

function stepMessage(i) {
  const s = STEPS[i];
  const text = `<i>Question ${i + 1} of ${STEPS.length}</i>\n\n${s.q}` + (s.type === "rate" ? "\n1 = not great, 5 = loved it" : "");
  let rows;
  if (s.type === "rate") {
    rows = [[1, 2, 3, 4, 5].map((n) => ({ text: String(n), callback_data: `fb:${i}:${n}` }))];
    if (s.skip) rows.push([{ text: "Didn't play it", callback_data: `fb:${i}:x` }]);
  } else if (s.type === "choice") {
    rows = [s.options.map(([v, label]) => ({ text: label, callback_data: `fb:${i}:${v}` }))];
  } else {
    rows = [[{ text: "Skip", callback_data: `fb:${i}:skip` }]];
  }
  return { text, reply_markup: kb(rows) };
}

const THANKS = `Thank you! That's everything. 🎪\nYour answers help the next team plan an even better night.`;

async function startFeedback(chatId, firstName, { db, tg }) {
  await db.upsertSubscriber(chatId, firstName);
  const sub = await db.getSubscriber(chatId);
  if (sub?.feedback_done) return tg("sendMessage", { chat_id: chatId, text: "You've already shared your feedback. Thank you! 💛" });
  await db.setSession(chatId, { step: 0, answers: {} });
  const m = stepMessage(0);
  return tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", ...m });
}

async function answerStep(chatId, messageId, stepIdx, value, { db, tg }) {
  const sub = await db.getSubscriber(chatId);
  const session = sub?.session;
  if (!session || session.step !== stepIdx) return "That question has already been answered.";

  const s = STEPS[stepIdx];
  const answers = { ...session.answers };
  if (s.type === "rate") {
    if (value !== "x") {
      const n = Number(value);
      if (!(n >= 1 && n <= 5)) return "Hmm, that didn't work.";
      answers[s.key] = n;
    }
  } else if (s.type === "choice") {
    if (!s.options.some(([v]) => v === value)) return "Hmm, that didn't work.";
    answers[s.key] = value;
  }
  // value "skip" on the text step just moves on

  const next = stepIdx + 1;
  if (next >= STEPS.length) {
    await db.saveFeedback(chatId, answers);
    await tg("editMessageText", { chat_id: chatId, message_id: messageId, text: THANKS });
    return "Saved!";
  }
  await db.setSession(chatId, { step: next, answers });
  await tg("editMessageText", { chat_id: chatId, message_id: messageId, parse_mode: "HTML", ...stepMessage(next) });
  return null;
}

// ---------- entry point ----------
export async function handleUpdate(update, deps) {
  const { db, tg } = deps;
  const now = deps.now ?? Date.now();

  if (update.callback_query) {
    const cq = update.callback_query;
    const chatId = cq.message?.chat?.id;
    const data = cq.data || "";
    let toast = null;
    try {
      if (!chatId || cq.message.chat.type !== "private") return;
      if (data === "cmd:countdown") await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: countdownText(now) });
      else if (data === "cmd:queue") await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: queueText(await db.getQueue(), now) });
      else if (data === "cmd:info") await tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: infoText(), disable_web_page_preview: true });
      else if (data === "fb:start") await startFeedback(chatId, cq.from?.first_name, deps);
      else if (data.startsWith("fb:")) {
        const [, i, value] = data.split(":");
        toast = await answerStep(chatId, cq.message.message_id, Number(i), value, deps);
      }
    } finally {
      await tg("answerCallbackQuery", { callback_query_id: cq.id, ...(toast ? { text: toast } : {}) }).catch(() => {});
    }
    return;
  }

  const msg = update.message;
  if (!msg?.chat || msg.chat.type !== "private" || typeof msg.text !== "string") return;
  const chatId = msg.chat.id;
  const name = msg.from?.first_name;
  const text = msg.text.trim();

  if (text.startsWith("/")) {
    const [rawCmd, payload] = text.split(/\s+/, 2);
    const cmd = rawCmd.split("@")[0].toLowerCase();
    switch (cmd) {
      case "/start":
        await db.upsertSubscriber(chatId, name);
        if (payload === "feedback") return startFeedback(chatId, name, deps);
        return tg("sendMessage", {
          chat_id: chatId, parse_mode: "HTML", reply_markup: MENU,
          text: `🎪 Step right up${name ? `, ${esc(name)}` : ""}!\n\nI'm the <b>${event.name}</b> bot. I'll remind you on the day, show live queue times on the night, and collect your feedback after.\n\n${COMMANDS}`,
        });
      case "/countdown":
        return tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: countdownText(now) });
      case "/queue":
        return tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: queueText(await db.getQueue(), now) });
      case "/info":
        return tg("sendMessage", { chat_id: chatId, parse_mode: "HTML", text: infoText(), disable_web_page_preview: true });
      case "/feedback":
        return startFeedback(chatId, name, deps);
      case "/stop":
        await db.removeSubscriber(chatId);
        return tg("sendMessage", { chat_id: chatId, text: "Done. You won't get any more reminders. Send /start any time to come back." });
      default:
        return tg("sendMessage", { chat_id: chatId, reply_markup: MENU, text: `Here's what I can do:\n\n${COMMANDS}` });
    }
  }

  // Plain text: either the answer to the last feedback question, or a nudge towards the menu.
  const sub = await db.getSubscriber(chatId);
  const textStep = STEPS.length - 1;
  if (sub?.session?.step === textStep) {
    await db.saveFeedback(chatId, { ...sub.session.answers, change: text.slice(0, 500) });
    return tg("sendMessage", { chat_id: chatId, text: THANKS });
  }
  return tg("sendMessage", { chat_id: chatId, reply_markup: MENU, text: `I only understand a few commands:\n\n${COMMANDS}` });
}
