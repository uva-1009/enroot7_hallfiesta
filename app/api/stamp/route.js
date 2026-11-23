// POST /api/stamp  { booth: "nerf", code: "..." }  ->  { ok: true } or { ok: false, error }
// Codes are checked here on the server, so they never ship in the site's JavaScript.
import { getBoothCode, dbConfigured } from "../../../lib/db";
import { booths } from "../../../data/booths";

export const dynamic = "force-dynamic";
const ids = new Set(booths.map((b) => b.id));
const norm = (s) => String(s ?? "").trim().toUpperCase().replace(/\s+/g, "");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function POST(req) {
  if (!dbConfigured()) return Response.json({ ok: false, error: "Stamping isn't switched on yet. Ask a facilitator." }, { status: 503 });

  let body;
  try { body = await req.json(); } catch { return Response.json({ ok: false, error: "Bad request." }, { status: 400 }); }
  const { booth, code } = body || {};
  if (!ids.has(booth) || !code || String(code).length > 40) return Response.json({ ok: false, error: "Bad request." }, { status: 400 });

  try {
    const real = await getBoothCode(booth);
    if (real && norm(real) === norm(code)) return Response.json({ ok: true });
    await sleep(600); // slows down guessing
    return Response.json({ ok: false, error: "That code doesn't match. Ask the booth facilitator." });
  } catch (e) {
    console.error("stamp check failed", e);
    return Response.json({ ok: false, error: "Couldn't check the code right now. Try again in a moment." }, { status: 500 });
  }
}
