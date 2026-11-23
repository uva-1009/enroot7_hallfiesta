import { timingSafeEqual, createHash } from "node:crypto";

// Constant-time string comparison (hashing first makes lengths equal).
export function safeEqual(a, b) {
  if (!a || !b) return false;
  const h = (s) => createHash("sha256").update(String(s)).digest();
  return timingSafeEqual(h(a), h(b));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// For /api/staff: checks the x-staff-pin header against STAFF_PIN.
export async function staffOk(req) {
  const ok = safeEqual(req.headers.get("x-staff-pin"), process.env.STAFF_PIN);
  if (!ok) await sleep(800); // slows down guessing
  return ok;
}
