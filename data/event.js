// Everything about the event lives here. The site, the calendar file and the Telegram bot all read from this file,
// so a change here (a time, a link, an FAQ answer) shows up everywhere after the next push.

export const event = {
  name: "Hall Fiesta",
  presenter: "EnROOT 7",
  pitch: "Three booths. Three stamps. Collect them all for a badge and an extra drink.",

  // Times are Singapore time (+08:00). The countdown, calendar and bot use these.
  start: "2026-11-26T19:00:00+08:00",
  end: "2026-11-26T21:00:00+08:00",
  boothsOpen: "2026-11-26T19:25:00+08:00",
  boothsClose: "2026-11-26T20:55:00+08:00",

  dateLabel: "Thursday 26 November 2026",
  shortDate: "Thu 26 Nov",
  timeLabel: "7pm to 9pm",
  venue: "Multi-Purpose Hall",
  venueDetail: "Block 57, Level 2",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=SUTD%20Block%2057",

  registerUrl: "https://forms.cloud.microsoft/r/QVYTbNSmmn",
  siteUrl: "https://enroot7-hallwars.vercel.app",
  linksUrl: "https://enroot7-hallwars.vercel.app/links", // the one QR on posters points here

  schedule: [
    { time: "6:30pm", title: "Registration and team assembly", detail: "Check in at the registration table and get into your team of five." },
    { time: "7:10pm", title: "Opening", detail: "A welcome from Area Management and what tonight is about." },
    { time: "7:15pm", title: "Safety briefing", detail: "Venue safety, emergency exits and the rules for each booth. Everyone attends before playing." },
    { time: "7:25pm", title: "Booths open", detail: "Play Nerf Cup Knockdown, Pasta Tower Challenge and Ball Transfer in any order." },
    { time: "8:55pm", title: "Closing", detail: "Thank-yous from the organising team. Last call for prizes." },
    { time: "9:00pm", title: "That's a wrap", detail: "We clear the hall together. See you at the next one." },
  ],

  // Drafts: check every answer with your team before the event.
  faq: [
    { q: "Do I need to register?", a: "Yes. Fill in the registration form before the event so we can plan teams and snacks." },
    { q: "Do I need to bring a team?", a: "No. Come with friends or come alone. Everyone is grouped into teams of five at 7pm." },
    { q: "What time should I arrive?", a: "By 7pm. The safety briefing at 7:15pm is required before you play any booth." },
    { q: "What should I bring?", a: "A charged phone for your stamps and photos, and clothes you can move around in." },
    { q: "How do stamps work?", a: "Play a booth, get the code from its facilitator, then open that booth on this site and type the code in. You need an internet connection for this." },
    { q: "How do I get my extra drink?", a: "Collect all three stamps, then show your phone at the registration and prize table before 9pm." },
    { q: "Is the Nerf booth safe?", a: "It uses foam darts only, one shooter at a time, from behind a safety line. Facilitators handle the blasters, and nobody aims at people." },
    { q: "I have a food allergy.", a: "The Pasta Tower uses raw spaghetti (wheat). Tell us at registration and we will sort out an alternative snack or role for you." },
    { q: "What if my phone dies?", a: "Stamps and photos you've already collected stay saved on your phone. If anything goes wrong, talk to a facilitator at the prize table." },
    { q: "Are my photos uploaded anywhere?", a: "No. Your film strip photos never leave your phone unless you share them yourself." },
  ],
};
