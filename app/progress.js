"use client";
// Shared state for every page: stamps, photos and the live booth queue.
// Saved in this phone's browser (localStorage). Every page that uses useProgress()
// stays in sync, so a stamp collected on /booths shows up straight away in the header and on /reel.
import { useCallback, useEffect, useRef, useState } from "react";
import { booths } from "../data/booths";
import { queueIsRelevant } from "../lib/time";

const KEY = "enroot7-hw-v2";
const EVT = "hw-progress";
const EMPTY = { stamps: {}, photos: {}, redeemed: false };

const read = () => {
  try { return { ...EMPTY, ...(JSON.parse(localStorage.getItem(KEY)) || {}) }; } catch { return EMPTY; }
};

export function useProgress() {
  const [st, setSt] = useState(EMPTY);
  useEffect(() => {
    const sync = () => setSt(read());
    sync();
    window.addEventListener(EVT, sync);
    window.addEventListener("storage", sync); // other tabs
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener("storage", sync); };
  }, []);

  const persist = useCallback((fn) => {
    const next = fn(read());
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    setSt(next);
    window.dispatchEvent(new Event(EVT));
  }, []);

  const count = booths.filter((b) => st.stamps[b.id]).length;
  return { st, persist, count, done: count === booths.length, photos: st.photos || {} };
}

// Live queue: polled only around the event, every 30 seconds while the tab is visible.
export function useQueue() {
  const [queue, setQueue] = useState({});
  const [live, setLive] = useState(false);
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
  return { queue, live, level: (id) => (live && queue[id]?.level) || null };
}

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

// Opens the camera for one booth's photo. Render `input` once on the page and call pick(boothId).
export function usePhotoPicker(persist) {
  const ref = useRef(null);
  const target = useRef(null);
  const [photoMsg, setPhotoMsg] = useState("");
  const pick = (id) => { target.current = id; setPhotoMsg(""); ref.current?.click(); };
  const onChange = async (e) => {
    const f = e.target.files?.[0]; e.target.value = "";
    const id = target.current;
    if (!f || !id) return;
    try { const data = await shrink(f); persist((p) => ({ ...p, photos: { ...(p.photos || {}), [id]: data } })); }
    catch { setPhotoMsg("Couldn't read that photo. Try again."); }
  };
  const input = <input ref={ref} type="file" accept="image/*" capture="user" className="hidden" onChange={onChange} />;
  return { input, pick, photoMsg, setPhotoMsg };
}
