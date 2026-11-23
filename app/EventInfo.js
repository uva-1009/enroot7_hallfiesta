"use client";
import { useEffect, useState } from "react";
import { event } from "../data/event";
import { START, END, parts } from "../lib/time";
import { googleCalUrl } from "../lib/calendar";

const BOT = process.env.NEXT_PUBLIC_BOT_USERNAME || "";

function Countdown() {
  // Render nothing until mounted so the server and browser clocks never disagree.
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (now === null) return <div className="h-[104px]" aria-hidden="true" />;
  if (now >= END) return <p className="py-6 font-display text-3xl text-mustard sm:text-4xl">That's a wrap. Thanks for coming!</p>;
  if (now >= START) return <p className="py-6 font-display text-3xl text-mustard sm:text-4xl">The show is on! Come on in.</p>;

  const p = parts(START - now);
  const cells = [["days", p.days], ["hrs", p.hours], ["mins", p.minutes], ["secs", p.seconds]];
  return (
    <div className="flex justify-center gap-2 sm:gap-4" role="timer" aria-label={`${p.days} days, ${p.hours} hours and ${p.minutes} minutes until ${event.name}`}>
      {cells.map(([label, n]) => (
        <div key={label} className="w-[4.4rem] rounded-lg border-4 border-mustard bg-[#2a1d1a] py-2 sm:w-24">
          <p className="font-slab text-3xl tabular-nums text-bone sm:text-5xl">{String(n).padStart(2, "0")}</p>
          <p className="font-type text-xs text-mustard sm:text-sm">{label}</p>
        </div>
      ))}
    </div>
  );
}

export default function EventInfo({ shareQr }) {
  return (
    <section id="info" className="mx-auto max-w-5xl scroll-mt-20 px-5">
      <div className="overflow-hidden rounded-[1.25rem] border-4 border-ink bg-ink shadow-[8px_8px_0_#231815]">
        <div className="bulbs" />
        <div className="px-4 py-6 text-center sm:px-8">
          <p className="font-type text-sm tracking-[.3em] text-bone/80">THE SHOW STARTS IN</p>
          <div className="mt-3"><Countdown /></div>
        </div>
        <div className="bulbs" />
      </div>

      <div className="poster paper mt-8 grid gap-8 p-6 text-ink sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <dl className="grid gap-4 sm:grid-cols-3">
            {[["When", event.dateLabel], ["Time", event.timeLabel], ["Where", `${event.venue}, ${event.venueDetail}`]].map(([k, v]) => (
              <div key={k}>
                <dt className="font-slab text-sm text-bubble">{k.toUpperCase()}</dt>
                <dd className="mt-1 text-lg font-semibold leading-snug">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={event.registerUrl} target="_blank" rel="noopener noreferrer" className="btn">Register now</a>
            <a href={googleCalUrl()} target="_blank" rel="noopener noreferrer" className="pill">Add to Google Calendar</a>
            <a href="/calendar" className="pill">Apple / Outlook calendar</a>
            <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="pill">Directions</a>
            {BOT && <a href={`https://t.me/${BOT}`} target="_blank" rel="noopener noreferrer" className="pill">Telegram bot</a>}
          </div>
        </div>
        {shareQr && (
          <figure className="hidden w-44 text-center md:block">
            <div className="relative z-[61] rounded-lg border-4 border-ink bg-white p-2 [&_svg]:h-auto [&_svg]:w-full" dangerouslySetInnerHTML={{ __html: shareQr }} />
            <figcaption className="mt-2 leading-tight">
              <span className="block font-slab text-sm">SHARE HALL FIESTA</span>
              <span className="block font-type text-xs">Registration + event site in one scan</span>
            </figcaption>
          </figure>
        )}
      </div>
    </section>
  );
}
