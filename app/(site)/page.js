// Home (/): the poster as a web page. Title, tagline, date, register, countdown, then the menu of pages.
import QRCode from "qrcode";
import PageBg from "../PageBg";
import EventInfo from "../EventInfo";
import HomeMenu from "../HomeMenu";
import { event } from "../../data/event";

function Ticket({ className = "" }) {
  return (
    <svg viewBox="0 0 80 60" className={className} aria-hidden="true">
      <g transform="rotate(-18 40 30)">
        <rect x="6" y="10" width="68" height="40" rx="6" fill="#E0453A" />
        <rect x="14" y="17" width="52" height="26" rx="3" fill="#F1EADB" />
        <path d="M40 22 l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z" fill="#F6C343" />
        <circle cx="6" cy="30" r="5" fill="#262B57" /><circle cx="74" cy="30" r="5" fill="#262B57" />
      </g>
    </svg>
  );
}

export default async function Home() {
  // The joint QR (opens /links: registration form + event site), built from data/event.js.
  const shareQr = await QRCode.toString(event.linksUrl, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#FFFFFF" } });

  return (
    <>
      <PageBg kind="night" />
      <section className="mx-auto max-w-4xl px-5 pb-10 pt-28 text-center sm:pt-36">
        <h1 className="relative inline-block font-display leading-[.86] tracking-tight" style={{ fontSize: "clamp(4.2rem, 17vw, 10rem)" }}>
          <span className="block -rotate-2 text-white [text-shadow:0_6px_0_#1E2350]">Hall</span>
          <span className="block rotate-1 text-lav [text-shadow:0_6px_0_#1E2350]">Fiesta</span>
          <Ticket className="absolute -right-6 bottom-0 w-14 sm:-right-12 sm:w-24" />
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg font-medium leading-snug sm:text-xl">
          Need a break from the long week? Grab your friends, win prizes and have fun!
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 font-display text-white">
          <span className="text-4xl sm:text-5xl">26</span>
          <span className="rounded-lg bg-purple px-3 py-1 text-3xl shadow-[0_5px_0_#1E2350] sm:text-4xl">Nov</span>
          <span className="text-2xl sm:text-3xl">@MPH 7-9pm</span>
        </div>
        <p className="mt-2 text-sm text-bone/80">{event.venue}, {event.venueDetail}</p>

        <a href={event.registerUrl} target="_blank" rel="noopener noreferrer" className="arrowbtn mt-8">Sign up now</a>

        <div className="mx-auto mt-10 grid max-w-xl gap-5 sm:grid-cols-2">
          <p className="note -rotate-1">Come in groups of 4 to 5</p>
          <p className="note rotate-1">No team? We'll help you form one</p>
        </div>
      </section>

      <EventInfo shareQr={shareQr} />
      <HomeMenu />
    </>
  );
}
