"use client";
import { useCallback, useEffect, useState } from "react";
import { booths } from "../../data/booths";
import { event } from "../../data/event";
import { QUEUE, QUEUE_LEVELS } from "../../lib/queue";
import { ago } from "../../lib/time";

const PIN_KEY = "hw-staff-pin";
const color = Object.fromEntries(booths.map((b) => [b.id, b.color]));
const when = (iso) => new Date(iso).toLocaleString("en-SG", { timeZone: "Asia/Singapore", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

function download(svg, name) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

function Panel({ title, children, className = "" }) {
  return (
    <section className={`rounded-[1.25rem] border-4 border-ink bg-bone p-5 text-ink shadow-[6px_6px_0_#1E2350] ${className}`}>
      <h2 className="font-display text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function BoothCard({ row, call, busy }) {
  const b = booths.find((x) => x.id === row.id);
  const [editing, setEditing] = useState(false);
  const [code, setCode] = useState("");
  const placeholder = row.code.startsWith("change-me");
  return (
    <div className="rounded-[1.25rem] border-4 border-ink p-5 text-ink shadow-[6px_6px_0_#1E2350]" style={{ backgroundColor: color[row.id] }}>
      <h2 className="font-display text-2xl leading-tight">{b?.name ?? row.name}</h2>

      <p className="mt-4 font-type text-sm">Stamp code</p>
      <p className="break-all font-slab text-4xl tracking-wider">{row.code}</p>
      {placeholder && <p className="mt-1 rounded bg-ink px-2 py-1 text-sm font-semibold text-bone">Still the placeholder. Set a real code.</p>}
      {editing ? (
        <form className="mt-2 flex gap-2" onSubmit={async (e) => { e.preventDefault(); if (await call({ action: "code", booth: row.id, code })) { setEditing(false); setCode(""); } }}>
          <input value={code} onChange={(e) => setCode(e.target.value)} autoFocus placeholder="e.g. POPCORN7" className="min-w-0 flex-1 rounded-lg border-[3px] border-ink bg-bone px-3 py-1.5 font-bold" />
          <button disabled={busy} className="btn !px-3 !py-1 text-base">Save</button>
          <button type="button" onClick={() => setEditing(false)} className="text-sm underline">Cancel</button>
        </form>
      ) : (
        <button onClick={() => setEditing(true)} className="mt-2 text-sm font-semibold underline">Change code</button>
      )}

      <p className="mt-5 font-type text-sm">Queue right now <span className="opacity-70">(updated {ago(row.updated_at)})</span></p>
      <div className="mt-2 grid grid-cols-2 gap-2">
        {QUEUE_LEVELS.map((lvl) => {
          const on = row.queue === lvl;
          return (
            <button key={lvl} disabled={busy} aria-pressed={on} onClick={() => call({ action: "queue", booth: row.id, level: lvl })}
              className={`rounded-lg border-[3px] border-ink px-2 py-2 font-slab text-sm transition ${on ? "shadow-[3px_3px_0_#1E2350]" : "bg-bone/80 hover:bg-bone"}`}
              style={on ? { backgroundColor: QUEUE[lvl].color, color: QUEUE[lvl].text } : undefined}>
              {QUEUE[lvl].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Broadcast({ kind, label, help, sent, botReady, call, busy }) {
  return (
    <div className="rounded-xl border-[3px] border-ink bg-white/60 p-4">
      <p className="font-display text-lg">{label}</p>
      <p className="mt-1 text-sm leading-snug">{help}</p>
      {sent ? (
        <p className="mt-3 font-semibold">Sent {when(sent.sentAt)} to {sent.count} {sent.count === 1 ? "person" : "people"}.</p>
      ) : (
        <button disabled={busy || !botReady} className="btn mt-3 !py-1 text-base"
          onClick={() => window.confirm(`Send "${label}" to everyone on the bot now? This can only be sent once.`) && call({ action: "broadcast", kind })}>
          Send now
        </button>
      )}
    </div>
  );
}

const Stars = ({ v }) => (v == null ? <span className="opacity-60">no ratings</span> : <span><b className="font-slab text-xl">{v}</b> / 5</span>);

export default function Staff({ linksQr, siteQr, registerQr }) {
  const [pin, setPin] = useState("");
  const [typed, setTyped] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async (p) => {
    const res = await fetch("/api/staff", { headers: { "x-staff-pin": p }, cache: "no-store" });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(json.error || "Something went wrong."); if (res.status === 401) { setPin(""); try { sessionStorage.removeItem(PIN_KEY); } catch {} } return false; }
    setErr(""); setData(json); return true;
  }, []);

  useEffect(() => { try { const p = sessionStorage.getItem(PIN_KEY); if (p) setPin(p); } catch {} }, []);
  useEffect(() => {
    if (!pin) return;
    load(pin);
    const t = setInterval(() => document.visibilityState === "visible" && load(pin), 20000);
    return () => clearInterval(t);
  }, [pin, load]);

  const call = async (body) => {
    setBusy(true); setNote("");
    try {
      const res = await fetch("/api/staff", { method: "POST", headers: { "Content-Type": "application/json", "x-staff-pin": pin }, body: JSON.stringify(body) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setNote(json.error || "That didn't work."); return false; }
      if (body.action === "broadcast") setNote(json.alreadySent ? "That message was already sent earlier." : `Sent to ${json.sent} people${json.failed ? `, ${json.failed} failed` : ""}.`);
      await load(pin);
      return true;
    } finally { setBusy(false); }
  };

  if (!pin) {
    return (
      <main className="grid min-h-screen place-items-center p-5">
        <form className="poster paper w-full max-w-sm p-8 text-center text-ink"
          onSubmit={async (e) => { e.preventDefault(); if (await load(typed)) { setPin(typed); try { sessionStorage.setItem(PIN_KEY, typed); } catch {} } }}>
          <h1 className="titleprint font-display text-4xl">Facilitator desk</h1>
          <label htmlFor="pin" className="mt-6 block font-type">Staff PIN</label>
          <input id="pin" type="password" value={typed} onChange={(e) => setTyped(e.target.value)} autoComplete="current-password"
            className="mt-2 w-full rounded-lg border-4 border-ink bg-bone px-3 py-2 text-center text-xl font-bold" />
          <button className="btn mt-4">Open the desk</button>
          <p role="alert" className="mt-3 min-h-5 text-sm font-semibold text-bubble">{err}</p>
        </form>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <header className="sticky top-0 z-10 -mx-4 mb-8 bg-ink text-bone">
        <div className="flex items-center justify-between px-4 py-3">
        <h1 className="font-display text-xl sm:text-2xl"><span className="text-white">Hall </span><span className="text-lav">Fiesta</span> <span className="text-mustard">/ Facilitator desk</span></h1>
        <div className="flex items-center gap-4 text-sm">
          <a href="/" className="underline">Public site</a>
          <button className="underline" onClick={() => { setPin(""); setData(null); try { sessionStorage.removeItem(PIN_KEY); } catch {} }}>Lock</button>
        </div>
        </div>
        <div className="bunting" />
      </header>

      {err && <p role="alert" className="mb-4 rounded-lg border-4 border-ink bg-mustard p-3 font-semibold text-ink">{err}</p>}
      {note && <p role="status" className="mb-4 rounded-lg border-4 border-ink bg-bone p-3 font-semibold text-ink">{note}</p>}
      {!data && !err && <p className="font-type text-bone">Loading...</p>}

      {data && (
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[...data.booths].sort((x, y) => booths.findIndex((z) => z.id === x.id) - booths.findIndex((z) => z.id === y.id)).map((row) => <BoothCard key={row.id} row={row} call={call} busy={busy} />)}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Telegram bot">
              {data.botReady ? (
                <p className="font-semibold">{data.subscribers} {data.subscribers === 1 ? "person has" : "people have"} started the bot.</p>
              ) : (
                <p className="font-semibold">The bot isn't connected yet. See the README.</p>
              )}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Broadcast kind="reminder" label="Tonight reminder" help="Sends automatically around 9am on the day. Use this only if it didn't go out." sent={data.broadcasts.reminder} botReady={data.botReady} call={call} busy={busy} />
                <Broadcast kind="feedback" label="Feedback request" help="Send right after the closing statement. Includes a button that starts the questions." sent={data.broadcasts.feedback} botReady={data.botReady} call={call} busy={busy} />
              </div>
            </Panel>

            <Panel title={`Feedback (${data.feedback.count})`}>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[["Overall", "overall"], ...booths.map((b) => [b.name.split(" ")[0], b.id])].map(([label, k]) => (
                  <div key={k} className="rounded-lg border-[3px] border-ink bg-white/60 p-2">
                    <dt className="font-type text-xs">{label}</dt>
                    <dd><Stars v={data.feedback.averages[k]} /></dd>
                  </div>
                ))}
              </dl>
              <p className="mt-3 text-sm">Come again? Yes {data.feedback.again.yes} / Maybe {data.feedback.again.maybe} / No {data.feedback.again.no}</p>
              {data.feedback.comments.length > 0 && (
                <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto pr-1 text-sm">
                  {data.feedback.comments.map((c) => <li key={c.at} className="rounded-lg bg-white/60 p-2">"{c.text}"</li>)}
                </ul>
              )}
              <p className="mt-3 text-xs opacity-80">Full export: Supabase &gt; Table Editor &gt; feedback &gt; Export to CSV.</p>
            </Panel>
          </div>

          <Panel title="QR codes for posters">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[["All links (use this on posters)", event.linksUrl, linksQr, "hall-fiesta-qr.svg"], ["This website only", event.siteUrl, siteQr, "hall-fiesta-site-qr.svg"], ["Registration form only", event.registerUrl, registerQr, "hall-fiesta-register-qr.svg"]].map(([label, url, svg, file]) => (
                <figure key={file} className="flex items-center gap-4">
                  <div className="relative z-[61] w-32 shrink-0 rounded-lg border-[3px] border-ink bg-white p-1 [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: svg }} />
                  <figcaption className="min-w-0">
                    <p className="font-display text-lg">{label}</p>
                    <p className="break-all text-xs">{url}</p>
                    <button onClick={() => download(svg, file)} className="mt-2 text-sm font-semibold underline">Download SVG for printing</button>
                  </figcaption>
                </figure>
              ))}
            </div>
          </Panel>
        </div>
      )}
    </main>
  );
}
