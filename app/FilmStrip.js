"use client";
// /reel: the photo film strip, saving it (and the Instagram story version), the badge and extra drink, and the Telegram bot.
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { booths } from "../data/booths";
import { drawReel, CW, CH, WIN } from "./Reel";
import { drawStory } from "./Story";
import { useProgress, usePhotoPicker } from "./progress";

const COLORS = ["#B3202A", "#4F9D96", "#E3A93B", "#F4E8C8"];

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

export default function FilmStrip() {
  const { st, persist, count, done, photos } = useProgress();
  const { input, pick, photoMsg } = usePhotoPicker(persist);
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(null);
  const canvasRef = useRef(null);
  const photoCount = booths.filter((x) => photos[x.id]).length;

  useEffect(() => { if (canvasRef.current) drawReel(canvasRef.current, booths, photos, st.stamps); }, [st.photos, st.stamps]);

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
  const redeem = () => { if (window.confirm("Only tap this in front of a facilitator. Redeem the extra drink now?")) persist((p) => ({ ...p, redeemed: true })); };

  return (
    <>
      {input}
      <section className="mx-auto max-w-4xl px-5 pb-10 pt-14">
        <div className="poster paper marquee p-6 text-center text-ink sm:p-10">
          <h1 className="titleprint font-display text-4xl sm:text-5xl">Your film strip</h1>
          <p className="mx-auto mt-3 max-w-md leading-snug">Snap a photo at each booth to fill the strip, then save it as a keepsake.</p>
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
                <button onClick={() => save("strip")} disabled={!!saving} className="btn">{saving === "strip" ? "Developing..." : "Save my film strip"}</button>
                <button onClick={() => save("story")} disabled={!!saving} className="pill">{saving === "story" ? "Developing..." : "Save Instagram story version"}</button>
              </div>
            ) : (
              <p className="font-type">Tap each frame to snap your photo ({photoCount}/{booths.length}). Photos stay on your phone.</p>
            )}
            <p role="status" className="mt-2 min-h-5 text-sm font-semibold text-bubble">{msg || photoMsg}</p>
          </div>

          <div className="mt-6 border-t-4 border-dashed border-ink/40 pt-8">
            {done ? (
              <>
                <svg viewBox="0 0 200 200" className="mx-auto w-44" role="img" aria-label="Hall Fiesta Legend badge">
                  <polygon className="spin-slow" points="100,4 118,32 150,18 154,52 188,56 172,88 198,110 168,128 178,162 144,162 132,194 104,174 74,196 62,164 28,168 38,134 6,114 34,92 18,60 52,56 56,24 86,34" fill="#E3A93B" stroke="#231815" strokeWidth="5" strokeLinejoin="round" />
                  <circle cx="100" cy="100" r="56" fill="#B3202A" stroke="#231815" strokeWidth="5" />
                  <text x="100" y="92" textAnchor="middle" fontSize="17" textLength="92" lengthAdjust="spacingAndGlyphs" fill="#F4E8C8" style={{ fontFamily: "var(--font-display)" }}>HALL FIESTA</text>
                  <text x="100" y="118" textAnchor="middle" fontSize="20" fill="#F4E8C8" style={{ fontFamily: "var(--font-display)" }}>LEGEND</text>
                </svg>
                <p className="mt-4 font-display text-3xl">{st.redeemed ? "Drink redeemed. Cheers!" : "You earned an extra drink!"}</p>
                {!st.redeemed && <p className="mt-1">Show this at the registration and prize table.</p>}
                {!st.redeemed && <button onClick={redeem} className="btn mt-4">Redeem with a facilitator</button>}
                {Array.from({ length: 28 }).map((_, i) => (
                  <span key={i} className="confetti" style={{ left: `${(i * 37) % 100}%`, background: COLORS[i % 4], animationDelay: `${(i % 7) * 0.15}s` }} />
                ))}
              </>
            ) : (
              <>
                <p className="font-display text-2xl">Stamps: {count} of 3</p>
                <p className="mt-1 font-type">{3 - count} more {3 - count === 1 ? "booth" : "booths"} to unlock the badge and the extra drink.</p>
                <Link href="/booths" className="btn mt-4 inline-block">Collect stamps</Link>
              </>
            )}
          </div>
        </div>
      </section>

    </>
  );
}
