// /calendar downloads an .ics file that Apple Calendar, Outlook and most phones can add directly.
import { event } from "../../data/event";

export const dynamic = "force-static";

const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const esc = (s) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function GET() {
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EnROOT 7//Hall Fiesta//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:hall-fiesta-2026@enroot7-hallwars.vercel.app",
    `DTSTAMP:${utc("2026-11-18T00:00:00Z")}`,
    `DTSTART:${utc(event.start)}`,
    `DTEND:${utc(event.end)}`,
    `SUMMARY:${esc(`${event.name} (${event.presenter})`)}`,
    `LOCATION:${esc(`${event.venue}, ${event.venueDetail}`)}`,
    `DESCRIPTION:${esc(`${event.pitch}\nBooths, stamps and live queue times: ${event.siteUrl}`)}`,
    `URL:${event.siteUrl}`,
    "BEGIN:VALARM",
    "TRIGGER:-PT1H",
    "ACTION:DISPLAY",
    `DESCRIPTION:${esc(`${event.name} starts in 1 hour`)}`,
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="hall-fiesta.ics"',
    },
  });
}
