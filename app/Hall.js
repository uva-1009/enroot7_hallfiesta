"use client";
import { useEffect, useRef, useState } from "react";
import { booths } from "../data/booths";
import { event } from "../data/event";
import { QUEUE } from "../lib/queue";
import { queueIsRelevant } from "../lib/time";
import Scene from "./Scene";
import Sky from "./Sky";
import HeroArt from "./HeroArt";
import EventInfo from "./EventInfo";
import FloorMap, { MapKey } from "./FloorMap";
import { RunOfShow, Faq } from "./Schedule";
import { drawReel, CW, CH, WIN } from "./Reel";
import { drawStory } from "./Story";

const KEY = "enroot7-hw-v2";
const COLORS = ["#B3202A", "#4F9D96", "#E3A93B", "#F4E8C8"];
const BOT = process.env.NEXT_PUBLIC_BOT_USERNAME || "";

const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });

// Crop and shrink so three photos fit comfortably in localStorage.
async function shrink(file) {
  const url = URL.createObjectURL(file);
  try {
    const img = await loadImg(url);
    const W = 480, H = 450, ratio = W / H;
    let sw = img.width, sh = img.height;
    if (sw / sh > ratio) sw = sh * ratio; else sh = sw / ratio;
    const c = document.createElement("canvas"); c.width = W; c.height = H;
    c.getContext("2d").drawImage(img, (img.width - sw) / 2, (img.height - sh) / 2, sw, sh, 0, 0, W, H);
    return c.toDataURL("image/jpeg", 0.82);
  } finally { URL.revokeObjectURL(url); }
}

// Share sheet on phones, download everywhere else.
async function shareOrDownload(blob, filename, title) {
  const file = new File([blob], filename, { type: "image/png" });
  if (navigator.canShare?.({ files: [file] })) {
    try { await navigator.share({ files: [file], title }); return "shared"; }
    catch (e) { if (e.name === "AbortError") return "cancelled"; }
  }
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  return "downloaded";
}

const QueuePill = ({ level, className = "" }) =>
  level ? <span className={`rounded-full border-2 border-ink px-2.5 py-0.5 font-slab text-xs ${className}`} style={{ backgroundColor: QUEUE[level].color, color: QUEUE[level].text }}>{QUEUE[level].short}</span> : null;

export default function Hall() {
  const [st, setSt] = useState({ stamps: {}, photos: {}, redeemed: false });
  const [open, setOpen] = useState(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");
  const [checking, setChecking] = useState(false);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(null);
  const [queue, setQueue] = useState({});
  const [live, setLive] = useState(false);
  const fileRef = useRef(null);
  const canvasRef = useRef(null);
  const target = useRef(null);

  const persist = (fn) => setSt((p) => { const n = fn(p); try { localStorage.setItem(KEY, JSON.stringify(n)); } catch {} return n; });

  useEffect(() => { try { const v = JSON.parse(localStorage.getItem(KEY)); if (v) setSt({ stamps: {}, photos: {}, ...v }); } catch {} }, []);
  useEffect(() => { const k = (e) => e.key === "Escape" && close(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  // Live queue: only polled around the event, every 30 seconds while the tab is visible.
  useEffect(() => {
    let stopped = false;
    const tick = async () => {
      const rel = queueIsRelevant();
      setLive(rel);
      if (!rel || document.visibilityState !== "visible") return;
      try { const r = await fetch("/api/queue", { cache: "no-store" }); const j = await r.json(); if (!stopped) setQueue(j.queue || {}); } catch {}
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => { stopped = true; clearInterval(t); };
  }, []);

  const close = () => { setOpen(null); setCode(""); setErr(""); };
  const count = booths.filter((b) => st.stamps[b.id]).length;
  const done = count === booths.length;
  const b = booths.find((x) => x.id === open);
  const photos = st.photos || {};
  const photoCount = booths.filter((x) => photos[x.id]).length;
  const level = (id) => (live && queue[id]?.level) || null;

  const pick = (id) => { target.current = id; setMsg(""); fileRef.current?.click(); };
  const onFile = async (e) => {
    const f = e.target.files?.[0]; e.target.value = "";
    const id = target.current;
    if (!f || !id) return;
    try { const data = await shrink(f); persist((p) => ({ ...p, photos: { ...(p.photos || {}), [id]: data } })); }
    catch { setMsg("Couldn't read that photo. Try again."); }
  };

  const save = async (kind) => {
    setSaving(kind); setMsg("");
    try {
      let blob, name;
      if (kind === "story") { blob = await drawStory(booths, photos); name = "hall-fiesta-story.png"; }
      else {
        const c = document.createElement("canvas");
        await drawReel(c, booths, photos, st.stamps, true);
        blob = await new Promise((res) => c.toBlob(res, "image/png")); name = "hall-fiesta-film-strip.png";
      }
      const how = await shareOrDownload(blob, name, "My Hall Fiesta film strip");
      if (how === "downloaded") setMsg("Saved to your downloads!");
    } catch { setMsg("Something went wrong saving that. Try again."); }
    setSaving(null);
  };
  useEffect(() => { if (canvasRef.current) drawReel(canvasRef.current, booths, photos, st.stamps); }, [st.photos, st.stamps]);

  const submit = async (e) => {
    e.preventDefault();
    if (!code.trim() || checking) return;
    setChecking(true); setErr("");
    try {
      const r = await fetch("/api/stamp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ booth: b.id, code }) });
      const j = await r.json().catch(() => ({}));
      if (j.ok) { const id = b.id; persist((p) => ({ ...p, stamps: { ...p.stamps, [id]: true } })); setCode(""); }
      else setErr(j.error || "That didn't work. Try again.");
    } catch { setErr("No connection. Check your signal and try again."); }
    setChecking(false);
  };
  const redeem = () => { if (window.confirm("Only tap this in front of a facilitator. Redeem the extra drink now?")) persist((p) => ({ ...p, redeemed: true })); };

  const nav = [["#info", "Info"], ["#booths", "Booths"], ["#map", "Map"], ["#schedule", "Schedule"], ["#faq", "FAQ"], ["#reel", "Film reel"]];

  return (
    <main className="relative">
      <Sky />
      <input ref={fileRef} type="file" accept="image/*" capture="user" className="hidden" onChange={onFile} />
      <header className="sticky top-0 z-40 bg-ink text-bone">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2">
          <a href="#top" className="font-display text-xl text-mustard">Hall Fiesta</a>
          <nav className="hidden gap-5 font-type text-sm md:flex">
            {nav.map(([href, label]) => <a key={href} href={href} className="hover:text-mustard">{label}</a>)}
          </nav>
          <span className="rounded-md border-2 border-mustard px-3 font-slab text-sm text-mustard" aria-live="polite">{count}/3 STAMPS</span>
        </div>
        <div className="bulbs" />
      </header>

      <section id="top" className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-14 pt-12 md:grid-cols-[1.1fr_1fr]">
        <div className="poster paper -rotate-1 p-8 text-center text-ink sm:p-10">
          <p className="font-type text-sm tracking-[.3em]">ENROOT 7 PRESENTS</p>
          <h1 className="titleprint mt-3 font-display text-6xl leading-[.95] sm:text-7xl">Hall<br />Fiesta</h1>
          <p className="mt-4 font-slab text-lg tracking-wide">THE GREATEST GAME SHOW IN THE HALL</p>
          <p className="mx-auto mt-4 max-w-xs font-semibold leading-snug">{event.pitch}</p>
          <p className="mt-4 font-type">{event.shortDate} / {event.timeLabel} / {event.venueDetail}</p>
          <a href={event.registerUrl} target="_blank" rel="noopener noreferrer" className="arrowbtn mt-6">Register now</a>
          <p className="mt-3 text-sm"><a href="#booths" className="font-semibold underline">or see the booths first</a></p>
        </div>
        <HeroArt />
      </section>

      <EventInfo />

      <div className="island pb-20 pt-16">
        <section id="booths" className="mx-auto max-w-5xl scroll-mt-20 px-5 py-10">
          <h2 className="label text-3xl sm:text-4xl">Step right up</h2>
          <ul className="mt-10 grid gap-9 md:grid-cols-3">
            {booths.map((x, i) => (
              <li key={x.id} style={{ rotate: `${x.tilt}deg` }} className="ticketwrap transition hover:!rotate-0">
                <button onClick={() => setOpen(x.id)} aria-haspopup="dialog"
                  className="ticket paper wobble relative block w-full text-left text-ink transition hover:-translate-y-1" style={{ backgroundColor: x.color }}>
                  <div className="flex h-[34px] items-center justify-between border-b-4 border-dashed border-ink/60 px-4 font-type text-xs tracking-widest">
                    <span>ADMIT ONE</span>
                    {level(x.id) ? <QueuePill level={level(x.id)} /> : <span>Nº 00{i + 1}</span>}
                  </div>
                  <div className="p-4 pb-5">
                    <Scene id={x.id} />
                    <h3 className="mt-4 font-display text-2xl leading-tight">{x.name}</h3>
                    <p className="mt-1 font-semibold">{x.tagline}</p>
                    <p className="mt-3 flex items-center justify-between text-sm font-bold">
                      <span>{x.players}</span>
                      <span className="rounded-full border-2 border-ink bg-bone px-3 py-0.5 font-slab text-xs">TAP TO PLAY</span>
                    </p>
                  </div>
                  {st.stamps[x.id] && (
                    <span className="absolute right-3 top-14 rotate-12 rounded-md border-4 border-bubble bg-bone/90 px-3 py-1 font-display text-xl text-bubble">PLAYED</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-5xl px-5 py-10">
          <h2 className="label text-3xl sm:text-4xl">How you get stamped</h2>
          <ol className="mt-8 grid gap-5 sm:grid-cols-3">
            {["Play the booth with your team.", "Ask the facilitator for the booth code.", "Open the booth here and type the code."].map((t, i) => (
              <li key={t} className="panel flex items-center gap-4 bg-bone p-4 font-semibold text-ink">
                <span className="font-slab text-5xl text-bubble">{i + 1}</span>{t}
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section id="map" className="mx-auto max-w-5xl scroll-mt-20 px-5 pt-16">
        <h2 className="label text-3xl sm:text-4xl">Find your way</h2>
        <div className="poster paper mt-8 p-4 sm:p-8">
          <p className="mb-4 text-center font-type text-ink">{event.venue}, {event.venueDetail}. Tap a booth to see its rules.</p>
          <FloorMap onPick={setOpen} queue={queue} showQueue={live} />
          <MapKey />
        </div>
      </section>

      <RunOfShow />
      <Faq />

      <section id="reel" className="mx-auto max-w-4xl scroll-mt-20 px-5 pb-16 pt-6">
        <div className="poster paper marquee p-6 text-center text-ink sm:p-10">
          <h2 className="titleprint font-display text-4xl sm:text-5xl">Your film reel</h2>
          <div className="relative mx-auto mt-8 w-full max-w-sm">
            <canvas ref={canvasRef} width={CW} height={CH} className="block h-auto w-full" role="img" aria-label="Your Hall Fiesta film strip" />
            {booths.map((x, i) => (
              <button key={x.id} onClick={() => pick(x.id)} aria-label={`${photos[x.id] ? "Retake" : "Take"} your photo for ${x.name}`}
                className="absolute rounded-sm hover:bg-white/10"
                style={{ left: `${(WIN.x / CW) * 100}%`, width: `${(WIN.w / CW) * 100}%`, top: `${(WIN.y[i] / CH) * 100}%`, height: `${(WIN.h / CH) * 100}%` }} />
            ))}
          </div>
          <div className="mt-6">
            {photoCount === booths.length ? (
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => save("strip")} disabled={!!saving} className="btn">{saving === "strip" ? "Developing..." : "Save my film reel"}</button>
                <button onClick={() => save("story")} disabled={!!saving} className="pill">{saving === "story" ? "Developing..." : "Save Instagram story version"}</button>
              </div>
            ) : (
              <p className="font-type">Tap each frame to snap your photo ({photoCount}/{booths.length}). Photos stay on your phone.</p>
            )}
            <p role="status" className="mt-2 min-h-5 text-sm font-semibold text-bubble">{msg}</p>
          </div>
          {done ? (
            <div className="mt-8">
              <svg viewBox="0 0 200 200" className="mx-auto w-44" role="img" aria-label="Hall Fiesta Legend badge">
                <polygon className="spin-slow" points="100,4 118,32 150,18 154,52 188,56 172,88 198,110 168,128 178,162 144,162 132,194 104,174 74,196 62,164 28,168 38,134 6,114 34,92 18,60 52,56 56,24 86,34" fill="#E3A93B" stroke="#231815" strokeWidth="5" strokeLinejoin="round" />
                <circle cx="100" cy="100" r="56" fill="#B3202A" stroke="#231815" strokeWidth="5" />
                <text x="100" y="94" textAnchor="middle" fontSize="20" fill="#F4E8C8" style={{ fontFamily: "var(--font-display)" }}>HALL FIESTA</text>
                <text x="100" y="118" textAnchor="middle" fontSize="20" fill="#F4E8C8" style={{ fontFamily: "var(--font-display)" }}>LEGEND</text>
              </svg>
              <p className="mt-4 font-display text-3xl">{st.redeemed ? "Drink redeemed. Cheers!" : "You earned an extra drink!"}</p>
              {!st.redeemed && <p className="mt-1">Show this at the registration and prize table.</p>}
              {!st.redeemed && <button onClick={redeem} className="btn mt-4">Redeem with a facilitator</button>}
              {Array.from({ length: 28 }).map((_, i) => (
                <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, background: COLORS[i % 4], animationDelay: `${(i % 7) * 0.15}s` }} />
              ))}
            </div>
          ) : (
            <p className="mt-6 font-type text-lg">{3 - count} more {3 - count === 1 ? "booth" : "booths"} to unlock the badge and the extra drink.</p>
          )}
        </div>
      </section>

      {BOT && (
        <section id="telegram" className="mx-auto max-w-4xl scroll-mt-20 px-5 pb-20">
          <div className="poster paper grid gap-6 p-6 text-ink sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <h2 className="titleprint font-display text-3xl sm:text-4xl">Hall Fiesta on Telegram</h2>
              <p className="mt-3 max-w-md leading-snug">Get a reminder on the day, check live queue times on the night, and tell us how it went afterwards.</p>
            </div>
            <div className="flex flex-col gap-3">
              <a href={`https://t.me/${BOT}`} target="_blank" rel="noopener noreferrer" className="btn text-center">Open the bot</a>
              <a href={`https://t.me/${BOT}?start=feedback`} target="_blank" rel="noopener noreferrer" className="pill text-center">Give feedback</a>
            </div>
          </div>
        </section>
      )}

      <p className="label mx-auto mb-16 block w-fit text-sm">{event.shortDate} / {event.timeLabel} / {event.venue}, {event.venueDetail}</p>

      {b && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-6" onClick={close}>
          <div role="dialog" aria-modal="true" aria-label={b.name} onClick={(e) => e.stopPropagation()}
            className="panel shade max-h-[92vh] w-full max-w-2xl overflow-y-auto p-5 text-ink" style={{ backgroundColor: b.color }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-type text-xs tracking-[.3em]">ADMIT ONE</p>
                <h2 className="font-display text-3xl leading-tight sm:text-4xl">{b.name}</h2>
                {level(b.id) && <p className="mt-2 text-sm font-semibold">Queue right now: <QueuePill level={level(b.id)} /></p>}
              </div>
              <button onClick={close} aria-label="Close" className="btn !px-4 !py-0 text-2xl">X</button>
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
              {st.stamps[b.id] ? (
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-display text-2xl">Stamp collected!</p>
                  <button type="button" className="btn !py-1 text-base" onClick={() => pick(b.id)}>{photos[b.id] ? "Retake my photo" : "Add my photo"}</button>
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
      )}
    </main>
  );
}
