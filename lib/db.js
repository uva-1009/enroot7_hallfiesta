// Server-only data layer. Every database read and write goes through here.
// Uses the Supabase service role key, so never import this file into a "use client" component.
import { createClient } from "@supabase/supabase-js";

let client = null;
export const dbConfigured = () => Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

function sb() {
  if (!dbConfigured()) throw new Error("Supabase is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY).");
  if (!client) client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
  return client;
}

const check = ({ data, error }) => { if (error) throw new Error(error.message); return data; };

// ---------- booths ----------
export async function getBooths() {
  return check(await sb().from("booths").select("id, name, code, queue, updated_at").order("id"));
}

export async function getQueue() {
  const rows = check(await sb().from("booths").select("id, queue, updated_at"));
  return Object.fromEntries(rows.map((r) => [r.id, { level: r.queue, updatedAt: r.updated_at }]));
}

export async function getBoothCode(id) {
  const row = check(await sb().from("booths").select("code").eq("id", id).maybeSingle());
  return row?.code ?? null;
}

export async function setQueue(id, level) {
  check(await sb().from("booths").update({ queue: level, updated_at: new Date().toISOString() }).eq("id", id));
}

export async function setCode(id, code) {
  check(await sb().from("booths").update({ code }).eq("id", id));
}

// ---------- telegram subscribers ----------
export async function upsertSubscriber(chatId, firstName) {
  check(await sb().from("subscribers").upsert({ chat_id: chatId, first_name: firstName ?? null }, { onConflict: "chat_id", ignoreDuplicates: false }));
}

export async function removeSubscriber(chatId) {
  check(await sb().from("subscribers").delete().eq("chat_id", chatId));
}

export async function getSubscriber(chatId) {
  return check(await sb().from("subscribers").select("chat_id, feedback_done, session").eq("chat_id", chatId).maybeSingle());
}

export async function setSession(chatId, session) {
  check(await sb().from("subscribers").update({ session }).eq("chat_id", chatId));
}

export async function subscriberIds() {
  return check(await sb().from("subscribers").select("chat_id")).map((r) => r.chat_id);
}

export async function countSubscribers() {
  const { count, error } = await sb().from("subscribers").select("chat_id", { count: "exact", head: true });
  if (error) throw new Error(error.message);
  return count ?? 0;
}

// ---------- feedback ----------
export async function saveFeedback(chatId, answers) {
  const row = {
    nerf: answers.nerf ?? null, pasta: answers.pasta ?? null, ball: answers.ball ?? null,
    overall: answers.overall ?? null, come_again: answers.again ?? null,
    change: answers.change ? String(answers.change).slice(0, 500) : null,
  };
  check(await sb().from("feedback").insert(row));
  check(await sb().from("subscribers").update({ feedback_done: true, session: null }).eq("chat_id", chatId));
}

export async function feedbackSummary() {
  const rows = check(await sb().from("feedback").select("nerf, pasta, ball, overall, come_again, change, created_at").order("created_at", { ascending: false }));
  const avg = (k) => { const v = rows.map((r) => r[k]).filter((n) => n != null); return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null; };
  const again = { yes: 0, maybe: 0, no: 0 };
  rows.forEach((r) => { if (r.come_again in again) again[r.come_again]++; });
  return {
    count: rows.length,
    averages: { nerf: avg("nerf"), pasta: avg("pasta"), ball: avg("ball"), overall: avg("overall") },
    again,
    comments: rows.filter((r) => r.change).slice(0, 20).map((r) => ({ text: r.change, at: r.created_at })),
  };
}

// ---------- broadcasts (each announcement is sent once) ----------
export async function getBroadcasts() {
  const rows = check(await sb().from("broadcasts").select("key, sent_at, sent_count"));
  return Object.fromEntries(rows.map((r) => [r.key, { sentAt: r.sent_at, count: r.sent_count }]));
}

// Returns true if this caller claimed the key, false if it was already sent.
export async function claimBroadcast(key) {
  const { error } = await sb().from("broadcasts").insert({ key });
  if (!error) return true;
  if (error.code === "23505") return false; // unique violation: already sent
  throw new Error(error.message);
}

export async function finishBroadcast(key, count) {
  check(await sb().from("broadcasts").update({ sent_count: count }).eq("key", key));
}
