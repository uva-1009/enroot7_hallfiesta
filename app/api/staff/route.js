// Facilitator API. Every request must carry the x-staff-pin header matching STAFF_PIN.
//   GET                                          -> booths (with codes), queue, bot stats, feedback summary
//   POST { action: "queue", booth, level }       -> set a booth's queue
//   POST { action: "code", booth, code }         -> change a booth's stamp code
//   POST { action: "broadcast", kind }           -> send the "reminder" or "feedback" bot message (once each)
import * as db from "../../../lib/db";
import { tg, botConfigured } from "../../../lib/telegram";
import { REMINDER, FEEDBACK_ASK } from "../../../lib/bot";
import { broadcastOnce } from "../../../lib/broadcast";
import { staffOk } from "../../../lib/auth";
import { QUEUE_LEVELS } from "../../../lib/queue";
import { booths } from "../../../data/booths";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const ids = new Set(booths.map((b) => b.id));
const deny = () => Response.json({ error: "Wrong PIN." }, { status: 401 });
const bad = (error) => Response.json({ error }, { status: 400 });

export async function GET(req) {
  if (!process.env.STAFF_PIN) return Response.json({ error: "STAFF_PIN isn't set on the server." }, { status: 503 });
  if (!(await staffOk(req))) return deny();
  if (!db.dbConfigured()) return Response.json({ error: "Supabase isn't connected yet." }, { status: 503 });
  try {
    const [rows, broadcasts, feedback] = await Promise.all([db.getBooths(), db.getBroadcasts(), db.feedbackSummary()]);
    const subscribers = botConfigured() ? await db.countSubscribers() : null;
    return Response.json({ booths: rows, broadcasts, feedback, subscribers, botReady: botConfigured() });
  } catch (e) {
    console.error("staff GET failed", e);
    return Response.json({ error: "Couldn't load data from Supabase." }, { status: 500 });
  }
}

export async function POST(req) {
  if (!process.env.STAFF_PIN) return Response.json({ error: "STAFF_PIN isn't set on the server." }, { status: 503 });
  if (!(await staffOk(req))) return deny();
  if (!db.dbConfigured()) return Response.json({ error: "Supabase isn't connected yet." }, { status: 503 });

  let body;
  try { body = await req.json(); } catch { return bad("Bad request."); }
  const { action } = body || {};

  try {
    if (action === "queue") {
      if (!ids.has(body.booth) || !QUEUE_LEVELS.includes(body.level)) return bad("Unknown booth or level.");
      await db.setQueue(body.booth, body.level);
      return Response.json({ ok: true });
    }
    if (action === "code") {
      const code = String(body.code ?? "").trim();
      if (!ids.has(body.booth)) return bad("Unknown booth.");
      if (!/^[A-Za-z0-9-]{4,30}$/.test(code)) return bad("Use 4 to 30 letters, numbers or dashes.");
      await db.setCode(body.booth, code);
      return Response.json({ ok: true });
    }
    if (action === "broadcast") {
      if (!botConfigured()) return bad("The Telegram bot isn't connected yet.");
      const msg = body.kind === "reminder" ? REMINDER : body.kind === "feedback" ? FEEDBACK_ASK : null;
      if (!msg) return bad("Unknown message.");
      const result = await broadcastOnce(body.kind, msg, { db, tg });
      return Response.json({ ok: true, ...result });
    }
    return bad("Unknown action.");
  } catch (e) {
    console.error("staff POST failed", e);
    return Response.json({ error: "That didn't save. Try again." }, { status: 500 });
  }
}
