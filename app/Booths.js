"use client";
// /booths: the three booth tickets, how stamping works, and the booth pop-up.
// /booths?b=nerf opens that booth straight away (used by links from the map and bot).
import { useCallback, useEffect, useState } from "react";
import { booths } from "../data/booths";
import Scene from "./Scene";
import BoothDialog, { QueuePill } from "./BoothDialog";
import { useProgress, useQueue, usePhotoPicker } from "./progress";

export default function Booths() {
  const { st, persist, photos } = useProgress();
  const { level } = useQueue();
  const { input, pick, photoMsg } = usePhotoPicker(persist);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("b");
    if (booths.some((x) => x.id === id)) setOpen(id);
  }, []);
  const close = useCallback(() => setOpen(null), []);
  const b = booths.find((x) => x.id === open);

  return (
    <div className="island mt-10 pb-16 pt-14">
      {input}
      <section className="mx-auto max-w-5xl px-5 py-8">
        <h1 className="label text-3xl sm:text-4xl">Step right up</h1>
        <p className="panel mt-6 max-w-xl bg-bone p-4 font-semibold leading-snug text-ink">
          Three booths, play them in any order. Tap a ticket for the rules, then collect your stamp there once you've played.
        </p>
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
                  <h2 className="mt-4 font-display text-2xl leading-tight">{x.name}</h2>
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
        {photoMsg && <p role="status" className="mt-6 font-semibold text-bubble">{photoMsg}</p>}
      </section>

      <section className="mx-auto max-w-5xl px-5 py-8">
        <h2 className="label text-3xl sm:text-4xl">How you get stamped</h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-3">
          {["Play the booth with your team.", "Ask the facilitator for the booth code.", "Open the booth here and type the code."].map((t, i) => (
            <li key={t} className="panel flex items-center gap-4 bg-bone p-4 font-semibold text-ink">
              <span className="font-slab text-5xl text-bubble">{i + 1}</span>{t}
            </li>
          ))}
        </ol>
      </section>

      {b && (
        <BoothDialog booth={b} stamped={!!st.stamps[b.id]} hasPhoto={!!photos[b.id]} level={level(b.id)} onClose={close}
          onStamp={(id) => persist((p) => ({ ...p, stamps: { ...p.stamps, [id]: true } }))} onPhoto={pick} />
      )}
    </div>
  );
}
