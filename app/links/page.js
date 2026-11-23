// /links: the page the poster QR code opens. One scan, every link.
import Sky from "../Sky";
import Mascot from "../Mascot";
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
      className={`block rounded-2xl border-4 border-ink px-5 py-4 text-ink shadow-[5px_5px_0_#231815] transition hover:-translate-y-0.5 active:translate-x-[3px] active:translate-y-[3px] active:shadow-[1px_1px_0_#231815] ${primary ? "bg-mustard" : "bg-bone"}`}>
      <span className="block font-display text-xl leading-tight">{title}</span>
      <span className="mt-0.5 block text-sm">{sub}</span>
    </a>
  );
}

export default function Links() {
  return (
    <main className="relative min-h-screen px-5 py-10">
      <Sky />
      <div className="poster paper mx-auto max-w-md px-6 pb-8 pt-6 text-center text-ink sm:px-8">
        <div className="mx-auto w-32"><Mascot /></div>
        <p className="font-type text-sm tracking-[.3em]">{event.presenter.toUpperCase()} PRESENTS</p>
        <h1 className="titleprint mt-1 font-display text-5xl leading-none">{event.name}</h1>
        <p className="mt-3 font-slab">{event.shortDate.toUpperCase()} / 7PM TO 9PM</p>
        <p className="font-type text-sm">{event.venue}, {event.venueDetail}</p>

        <nav className="mt-7 space-y-4 text-left" aria-label="Hall Fiesta links">
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
