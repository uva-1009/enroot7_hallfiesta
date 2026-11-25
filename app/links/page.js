// /links: the page the poster QR code opens. One scan, every link.
import Sky from "../Sky";
import Bunting from "../Bunting";
import { event } from "../../data/event";
import { googleCalUrl } from "../../lib/calendar";

export const metadata = {
  title: "Hall Fiesta | Links",
  description: `${event.name} by ${event.presenter}: register, booths, floor map and more.`,
};

const BOT = process.env.NEXT_PUBLIC_BOT_USERNAME || "";

function LinkButton({ href, title, sub, primary, external = true }) {
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`block rounded-2xl border-[3px] border-ink px-5 py-4 shadow-[0_5px_0_#1E2350] transition hover:-translate-y-0.5 active:translate-y-[3px] active:shadow-[0_2px_0_#1E2350] ${primary ? "bg-bubble text-white" : "bg-bone text-ink"}`}>
      <span className="block font-display text-xl leading-tight">{title}</span>
      <span className="mt-0.5 block text-sm">{sub}</span>
    </a>
  );
}

export default function Links() {
  return (
    <main className="relative min-h-screen px-5 pb-10 pt-28">
      <Sky />
      <Bunting />
      <header className="mx-auto max-w-md text-center">
        <h1 className="font-display text-7xl leading-[.86]">
          <span className="block -rotate-2 text-white [text-shadow:0_5px_0_#1E2350]">Hall</span>
          <span className="block rotate-1 text-lav [text-shadow:0_5px_0_#1E2350]">Fiesta</span>
        </h1>
        <p className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-display text-white">
          <span className="text-3xl">26</span>
          <span className="rounded-lg bg-purple px-2.5 py-0.5 text-2xl shadow-[0_4px_0_#1E2350]">Nov</span>
          <span className="text-xl">@MPH 7-9pm</span>
        </p>
        <p className="mt-1 text-sm text-bone/80">{event.venue}, {event.venueDetail}</p>
      </header>
      <div className="poster mx-auto mt-8 max-w-md px-6 pb-8 pt-6 text-center text-ink sm:px-8">
        <nav className="space-y-4 text-left" aria-label="Hall Fiesta links">
          <LinkButton primary href={event.registerUrl} title="Register" sub="Sign up for Hall Fiesta (registration form)" />
          <LinkButton href="/" external={false} title="Event site" sub="Countdown, booths, floor map, run of show and FAQ" />
          <LinkButton href="/booths" external={false} title="Booths and stamps" sub="The three games and where you collect stamps" />
          <LinkButton href="/map" external={false} title="Floor map" sub={`${event.venue}, ${event.venueDetail}`} />
          <LinkButton href={googleCalUrl()} title="Add to Google Calendar" sub={`${event.dateLabel}, ${event.timeLabel}`} />
          <LinkButton href="/calendar" external={false} title="Add to Apple or Outlook" sub="Downloads a calendar file with a 1-hour reminder" />
          {BOT && <LinkButton href={`https://t.me/${BOT}`} title="Hall Fiesta on Telegram" sub="Reminders, live queue times and feedback" />}
        </nav>
      </div>
    </main>
  );
}
