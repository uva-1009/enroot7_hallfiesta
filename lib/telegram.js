// Minimal Telegram Bot API client (no library needed).
export const botConfigured = () => Boolean(process.env.TELEGRAM_BOT_TOKEN);

export class TelegramError extends Error {
  constructor(code, description, retryAfter) { super(`Telegram ${code}: ${description}`); this.code = code; this.retryAfter = retryAfter; }
}

export async function tg(method, payload = {}) {
  const base = process.env.TELEGRAM_API_URL || "https://api.telegram.org"; // override only for local testing
  const res = await fetch(`${base}/bot${process.env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) throw new TelegramError(data.error_code ?? res.status, data.description ?? "unknown error", data.parameters?.retry_after);
  return data.result;
}

// Escape user-provided text for parse_mode HTML.
export const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
