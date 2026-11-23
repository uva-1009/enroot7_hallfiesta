// Google Calendar "add event" link, shared by the info board and /links.
import { event } from "../data/event";

const utc = (iso) => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export const googleCalUrl = () =>
  "https://calendar.google.com/calendar/render?action=TEMPLATE" +
  `&text=${encodeURIComponent(`${event.name} (${event.presenter})`)}` +
  `&dates=${utc(event.start)}/${utc(event.end)}` +
  `&details=${encodeURIComponent(`${event.pitch}\n\nBooths, stamps and live queue times: ${event.siteUrl}`)}` +
  `&location=${encodeURIComponent(`${event.venue}, ${event.venueDetail}`)}`;
