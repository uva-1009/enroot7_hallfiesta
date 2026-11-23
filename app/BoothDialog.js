"use client";
// The booth pop-up: rules, tips, safety, and the stamp-code form. Used on /booths and /map.
import { useEffect, useState } from "react";
import Link from "next/link";
import Scene from "./Scene";
import { QUEUE } from "../lib/queue";

export const QueuePill = ({ level, className = "" }) =>
  level ? <span className={`rounded-full border-2 border-ink px-2.5 py-0.5 font-slab text-xs ${className}`} style={{ backgroundColor: QUEUE[level].color, color: QUEUE[level].text }}>{QUEUE[level].short}</span> : null;

export default function BoothDialog({ booth: b, stamped, hasPhoto, level, onClose, onStamp, onPhoto }) {
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const k = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim() || checking) return;
    setChecking(true); setErr("");
    try {
      const r = await fetch("/api/stamp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booth: b.id, code }) });
      const j = await r.json().catch(() => ({}));
      if (j.ok) { onStamp(b.id); setCode(""); }
      else setErr(j.error || "That didn't work. Try again.");
    } catch { setErr("No connection. Check your signal and try again."); }
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-label={b.name} onClick={(e) => e.stopPropagation()}
        className="panel shade max-h-[92vh] w-full max-w-2xl overflow-y-auto p-5 text-ink" style={{ backgroundColor: b.color }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="font-type text-xs tracking-[.3em]">ADMIT ONE</p>
            <h2 className="font-display text-3xl leading-tight sm:text-4xl">{b.name}</h2>
            {level && <p className="mt-2 text-sm font-semibold">Queue right now: <QueuePill level={level} /></p>}
          </div>
          <button onClick={onClose} aria-label="Close" className="btn !px-4 !py-0 text-2xl">X</button>
        </div>
        <div className="mt-4"><Scene id={b.id} /></div>
        <p className="mt-4 text-lg font-semibold leading-snug">{b.summary}</p>
        <p className="mt-2 font-type text-sm">{b.players} / Gear: {b.gear}</p>
        <div className="mt-4 rounded-xl border-4 border-ink bg-bone p-4">
          <h3 className="font-display text-xl">How it works</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5">{b.how.map((s) => <li key={s}>{s}</li>)}</ol>
        </div>
        <div className="mt-4 rounded-xl border-4 border-ink bg-bone p-4">
          <h3 className="font-display text-xl">Team tips</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5">{b.tips.map((s) => <li key={s}>{s}</li>)}</ul>
        </div>
        {b.safety && (
          <div className="mt-4 rounded-xl border-4 border-ink bg-mustard p-4">
            <h3 className="font-display text-xl">Safety rules</h3>
            <ul className="mt-2 list-disc space-y-1 pl-5">{b.safety.map((s) => <li key={s}>{s}</li>)}</ul>
          </div>
        )}
        <div className="mt-5 rounded-xl border-4 border-ink bg-grape p-4 text-bone">
          {stamped ? (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="font-display text-2xl">Stamp collected!</p>
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className="btn !py-1 text-base" onClick={() => onPhoto(b.id)}>{hasPhoto ? "Retake my photo" : "Add my photo"}</button>
                <Link href="/reel" className="text-sm font-semibold underline">See my film strip</Link>
              </div>
            </div>
          ) : (
            <form onSubmit={submit}>
              <label htmlFor="code" className="font-display text-xl">Played it? Enter the facilitator's code</label>
              <div className="mt-2 flex gap-2">
                <input id="code" value={code} onChange={(e) => setCode(e.target.value)} inputMode="text" autoComplete="off" autoCapitalize="characters"
                  className="min-w-0 flex-1 rounded-lg border-4 border-ink bg-bone px-3 py-2 text-lg font-bold text-ink" />
                <button disabled={checking} className="btn !px-4">{checking ? "Checking..." : "Stamp"}</button>
              </div>
              <p role="alert" className="mt-2 min-h-5 text-sm font-semibold text-mustard">{err}</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
