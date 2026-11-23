// Intro page (/): hero, countdown, register and calendar.
import QRCode from "qrcode";
import HeroArt from "../HeroArt";
import EventInfo from "../EventInfo";
import { event } from "../../data/event";

export default async function Intro() {
  // The joint QR (opens /links: registration form + event site), built from data/event.js.
  const shareQr = await QRCode.toString(event.linksUrl, { type: "svg", margin: 1, errorCorrectionLevel: "M", color: { dark: "#000000", light: "#FFFFFF" } });

  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-5 pb-14 pt-12 md:grid-cols-[1.1fr_1fr]">
        <div className="poster paper -rotate-1 p-8 text-center text-ink sm:p-10">
          <p className="font-type text-sm tracking-[.3em]">ENROOT 7 PRESENTS</p>
          <h1 className="titleprint mt-3 font-display text-6xl leading-[.95] sm:text-7xl">Hall<br />Fiesta</h1>
          <p className="mt-4 font-slab text-lg tracking-wide">THE GREATEST GAME SHOW IN THE HALL</p>
          <p className="mx-auto mt-4 max-w-xs font-semibold leading-snug">{event.pitch}</p>
          <p className="mt-4 font-type">{event.shortDate} / {event.timeLabel} / {event.venueDetail}</p>
          <a href={event.registerUrl} target="_blank" rel="noopener noreferrer" className="arrowbtn mt-6">Register now</a>
        </div>
        <HeroArt />
      </section>

      <EventInfo shareQr={shareQr} />
    </>
  );
}
