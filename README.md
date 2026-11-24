# EnROOT 7: Hall Fiesta

Event site and Telegram bot for **Hall Fiesta**, the EnROOT 7 carnival for SUTD Term 1 freshmen. Teams play three booths, collect a stamp at each, fill a photo film strip, and earn a badge plus an extra drink. A companion Telegram bot sends reminders, shows live queue times on the night, and collects feedback afterwards.

**Live site:** https://enroot7-hallwars.vercel.app
**Repo:** https://github.com/uva1009/enroot7_hallwars

<!-- TODO: add team name / group number and members -->

## The event

| | |
|---|---|
| Event | Hall Fiesta, an indoor carnival of game booths |
| Theme | Stress relieving / low cortisol |
| When | Thursday 26 November 2026, 7pm to 9pm |
| Where | Multi-Purpose Hall, Block 57, Level 2 |
| Who | Term 1 freshmen, about 200 to 300 people |
| Register | https://forms.cloud.microsoft/r/QVYTbNSmmn |
| Rewards | A stamp per booth; all 3 stamps earn the badge and an extra drink |

### Run of show

| Time | |
|---|---|
| 7:00pm | Registration and team assembly |
| 7:10pm | Opening by Area Management |
| 7:15pm | Safety briefing (required) |
| 7:25pm | Booths open |
| 8:55pm | Closing statement |
| 9:00pm | End, venue clear-out |

### The booths

**1. Nerf Cup Knockdown.** Squads of five share one Nerf blaster to knock down a cup structure. Barriers stand in the way, and hitting one is a penalty. Safety rules are shown inside the booth card.

**2. Pasta Tower Challenge.** Two teams race the clock to build the tallest freestanding tower from raw pasta and limited tape. Both teams get a stamp; the winners also get snacks.

**3. Ball Transfer.** Move a ball from the start line to the end without carrying it. It can't stay on any one surface, tool or person for more than 3 to 4 seconds.

## Features

### Website

The site is six separate pages. The home page is the menu: it has the countdown and registration, then a "Step inside" list of big buttons, one per page. Each button loads a completely new page with its own background (harlequin, blueprint, curtain, polka dots or cinema) and only that page's content. There is no shared menu bar; each page has a "Back to home" button and the stamp count at the top.

| Page | What's on it |
|---|---|
| `/` Home | The poster hero, a marquee countdown to 7pm, date, time and venue, Register, Add to Google Calendar, Apple/Outlook calendar (`/calendar` serves an `.ics` with a 1-hour reminder), Directions, Telegram bot, the "Share Hall Fiesta" QR on larger screens, and the menu of pages |
| `/booths` | The three booth tickets with looping animations. Tapping one opens its rules, tips, safety notes and the stamp-code form. `/booths?b=nerf` opens a booth directly |
| `/map` | The Multi-Purpose Hall floor plan, redrawn from the team's sketch. Tapping a booth opens its rules right there. On phones the map scrolls sideways so the labels stay readable |
| `/schedule` | The run of show as a timeline |
| `/faq` | Expandable answers to common questions |
| `/reel` | The photo film strip, saving it (or a 1080 x 1920 Instagram story version), the badge and extra drink |

- **Stamps, checked on the server.** After playing, the facilitator gives the team the booth's code, and typing it in collects the stamp. Codes are checked by `/api/stamp` against the database, so they never appear in the site's code or this repo.
- **Shared progress.** Stamps and photos are saved on the phone and shared by every page, so a stamp collected on `/booths` immediately updates the header and `/reel`.
- **Live queue times.** During the event, each ticket and the floor map show the current wait at that booth, updated every 30 seconds.
- **One QR for everything (`/links`).** A link-tree page with Register, Event site, Booths, Floor map, calendar and Telegram buttons. The poster QR opens it.

### Facilitator page (`/staff`)

Protected by a PIN. Built for a phone held at a booth:

- Each booth's **stamp code** in large type, with a way to change it (for example if a code leaks).
- **Queue buttons** for each booth. The site and the bot update from these.
- **Bot announcements:** the "tonight" reminder (also sent automatically in the morning) and the post-event feedback request. Each can only be sent once.
- **Feedback summary:** number of responses, average ratings per booth and overall, "come again?" counts and the latest comments.
- **Printable QR codes** as SVG: the joint one for posters (opens `/links`), plus site-only and registration-only codes.

### Telegram bot

| Command | What it does |
|---|---|
| `/start` | Welcome message and a button menu. Subscribes the person to reminders |
| `/countdown` | Time until the show. During the event it says what's happening now |
| `/queue` | Live wait at each booth and the shortest line, from 30 minutes before the start until booths close |
| `/info` | Date, venue, run of show, register and site links |
| `/feedback` | Six quick questions with tap buttons: a 1 to 5 rating per booth (or "didn't play"), overall rating, "would you come again?", and an optional comment |
| `/stop` | Unsubscribes from reminders |

- **Reminder:** at about 9am on 26 November, a scheduled job sends "Hall Fiesta is tonight!" to everyone who started the bot.
- **Feedback request:** sent from `/staff` after the closing statement. The site's "Give feedback" button opens the bot with the questions already started (`t.me/<bot>?start=feedback`), so people who never opened the bot can still answer.
- **Privacy:** feedback answers are stored without a name or Telegram ID. The subscriber list only holds the chat ID and first name needed to send reminders, and `/stop` deletes it.

## How it fits together

```
 Browser (site)            Vercel (Next.js)                     Supabase (Postgres)
 ───────────────           ───────────────────────────           ─────────────────────
 stamps, photos  ──POST──▶ /api/stamp      checks code   ──────▶ booths (code, queue)
 (localStorage)  ──GET───▶ /api/queue      public levels ──────▶
 /staff page     ──PIN───▶ /api/staff      codes, queue, ──────▶ subscribers
                                           broadcasts            feedback
 Telegram ──webhook──────▶ /api/telegram/webhook ─────────────▶ broadcasts
 Vercel cron ────────────▶ /api/cron/reminder (26 Nov, ~9am)
```

- The browser never talks to Supabase directly. Row Level Security is on with no policies, so the public key can read nothing; only the server routes, using the secret service role key, can.
- Event details live in `data/event.js` and booth content in `data/booths.js`. The site, the calendar file and the bot all read from them, so a change there shows up everywhere.
- The bot's logic (`lib/bot.js`) takes the database and Telegram client as parameters, so it was tested end to end against a stand-in database and Telegram server before deploying.

## Project structure

```
app/
  (site)/              The six public pages (the folder name doesn't appear in URLs)
    layout.js          Adds the "Back to home" bar to every page except home
    page.js            / Home (builds the joint QR, shows the menu)
    booths/ map/ schedule/ faq/ reel/   One folder per page
  HomeMenu.js          The home page menu of pages
  BackHome.js          "Back to home" button and stamp count
  PageBg.js            Each page's full-screen background
  progress.js          Shared stamps, photos, queue polling and camera picker
  Booths.js            /booths content
  BoothDialog.js       Booth pop-up (rules + stamp form), used on /booths and /map
  MapView.js           /map content
  FloorMap.js          SVG floor plan with tappable booth zones and queue badges
  FilmStrip.js         /reel content
  EventInfo.js         Countdown, details, register/calendar/directions buttons
  Schedule.js          Run of show and FAQ
  Story.js             Instagram story export (1080 x 1920)
  Reel.js              Canvas drawing of the film strip
  Scene.js             Animated SVG scene for each booth
  HeroArt.js Mascot.js Sky.js   Illustrations and background
  links/page.js        /links link-tree page (the poster QR opens this)
  calendar/route.js    /calendar .ics download
  staff/               /staff facilitator page
  api/stamp            Code check
  api/queue            Public queue levels
  api/staff            PIN-protected facilitator actions
  api/telegram/webhook Receives bot messages
  api/cron/reminder    Event-day reminder
data/
  event.js             Date, venue, links, run of show, FAQ
  pages.js             The list of pages, their order and descriptions (used by the home menu)
  booths.js            Booth text, rules, colours (no codes)
lib/
  db.js                All database reads and writes (server only)
  bot.js               Bot replies and the feedback flow
  broadcast.js         Send-once announcements
  telegram.js  time.js  queue.js  auth.js  calendar.js
supabase/schema.sql    Database tables
vercel.json            Reminder schedule
.env.example           Settings the server needs
```

## Setup

The public pages work on their own. Stamping, queues, `/staff` and the bot need Supabase and a few settings. Do steps 1 to 4 **before** pushing this version, or stamping will be off on the live site until they're done.

### 1. Supabase (database)

1. Create a free project at [supabase.com](https://supabase.com). Pick the Singapore region.
2. Open **SQL Editor > New query**, paste all of `supabase/schema.sql`, and click **Run**.
3. Open **Project Settings > API** (or **Data API**) and copy the **Project URL** and the **service_role** secret key.

### 2. Telegram bot

1. In Telegram, message **@BotFather**, send `/newbot`, choose a name and a username ending in `bot`. Copy the **token** it gives you.
2. Still in BotFather, send `/setcommands`, choose the bot, and paste:
   ```
   countdown - Time until Hall Fiesta
   queue - Live wait at each booth
   info - Date, venue and run of show
   feedback - Tell us how it went
   stop - Stop reminders
   ```

### 3. Settings on Vercel

In the Vercel project, open **Settings > Environment Variables** and add these for **Production**:

| Name | Value |
|---|---|
| `SUPABASE_URL` | Project URL from step 1 |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key from step 1 (secret) |
| `STAFF_PIN` | A passphrase for `/staff`, longer than 4 digits |
| `TELEGRAM_BOT_TOKEN` | Token from BotFather |
| `TELEGRAM_WEBHOOK_SECRET` | Any long random string (letters, numbers, `-`, `_`) |
| `NEXT_PUBLIC_BOT_USERNAME` | The bot's username, without `@` |
| `CRON_SECRET` | Any long random string |

Then push the code (or click **Redeploy**) so the new settings take effect.

### 4. Connect the bot to the site

Open this link in a browser once, with your token and webhook secret filled in:

```
https://api.telegram.org/bot<TOKEN>/setWebhook?url=https://enroot7-hallwars.vercel.app/api/telegram/webhook&secret_token=<TELEGRAM_WEBHOOK_SECRET>
```

It should reply `"Webhook was set"`. Then send `/start` to your bot.

### 5. Before the event

- Open `/staff`, enter the PIN, and **replace the three placeholder stamp codes** (`change-me-...`). Short words are easiest to say out loud, e.g. `POPCORN7`.
- Try the full flow on a phone: register button, stamp each booth, take three photos, save the strip and the story version, `/queue` and `/feedback` in the bot.
- Print the joint QR from `/staff` ("All links") for posters. It opens `/links`, so the QR never needs reprinting if a link changes: just edit `data/event.js`.

### On the night

- Each facilitator keeps `/staff` open and taps the queue buttons as lines change.
- After the closing statement, press **Send now** on "Feedback request".
- Feedback can be exported from Supabase: **Table Editor > feedback > Export to CSV**.

## Run locally

Needs Node.js 20.9 or newer.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # the same check Vercel runs
```

For stamping, `/staff` and the bot locally, copy `.env.example` to `.env.local` and fill it in. The bot itself only works on the deployed site, because Telegram needs a public URL to send messages to.

On Windows PowerShell, if `npm` is blocked by the execution policy, use Command Prompt or run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once.

## Editing

- **Event details, links, run of show, FAQ:** `data/event.js`
- **Booth text, rules, tips, colours:** `data/booths.js`
- **Stamp codes and queue:** `/staff` (no code change or redeploy needed)
- **Bot wording:** `lib/bot.js`
- **Reminder time:** `vercel.json`. The schedule is in UTC, so `0 1 26 11 *` is 9am Singapore time on 26 November.

## Design

The look is a vintage circus poster, built from a moodboard of old carnival signage, cinema tickets, sunburst prints and harlequin patterns.

| Element | How it is done |
|---|---|
| Sunburst background | CSS `repeating-conic-gradient` with a dark vignette |
| Harlequin booth section | Tiled SVG in `public/harlequin.svg` |
| Aged paper and print specks | SVG turbulence textures in `public/paper.svg` and `public/grunge.svg` |
| Ticket cards | CSS masks for the punched notches, dashed perforation line |
| Marquee bulbs and countdown | Radial-gradient dots with a stepped twinkle animation |
| Floor map | Hand-written SVG from the team's floor-plan sketch |
| Booth animations | Hand-written SVG scenes driven by CSS keyframes (no animation library) |
| Mascot and hero art | Hand-written SVG, drawn in code |
| Film strip and story | Drawn on a `<canvas>`, so the page and the saved images are the same drawing |

**Palette:** brick red `#B3202A`, mustard `#E3A93B`, teal `#4F9D96`, cream `#F4E8C8`, warm black `#231815`, slate blue `#2C4A68`, rust `#7A3418`.

**Type:** Rye (titles), Alfa Slab One (labels and numbers), Special Elite (ticket-style small print), Archivo (body), loaded with `next/font/google`.

## Responsive behaviour

| Width | Layout |
|---|---|
| Phone | Single column. Countdown and info stacked, booth tickets stacked, booth details open as a bottom sheet |
| Tablet | Info details in three columns, how-to steps in a row |
| Desktop | Hero in two columns, three tickets in a row, header navigation |

SVGs and canvases scale with their containers. Animations are switched off for visitors with `prefers-reduced-motion` set.

<!-- TODO: add screenshots at phone, tablet and desktop widths -->

## Stack

- **Next.js 16** (App Router) with **React 19**
- **Tailwind CSS 3** plus custom classes in `app/globals.css`
- **Supabase** (Postgres) for stamp codes, queue, bot subscribers and feedback
- **Telegram Bot API** over plain `fetch`, using a webhook
- **Vercel** for hosting, the API routes, and the scheduled reminder
- `qrcode` for QR codes, `@supabase/supabase-js` for the database

## Testing

Before release, every API route and the whole bot conversation were run against a stand-in Supabase and Telegram server: wrong and right stamp codes, changing a code, PIN checks, queue updates, every bot command, the feedback flow (including "didn't play", Skip, stale button taps and double submission), broadcasts (including people who blocked the bot) and the reminder job's checks. The bot's replies were also checked at simulated times before, during and after the event.

## Process

1. **Proposal to first site.** Started from the twelve-station proposal and built a calm landing page with a station guide and a tap-to-stamp card.
2. **Scope cut.** The booths were finalized as three. The site was rebuilt around three booth cards, each with rules and an animation, plus the badge and extra-drink reward.
3. **Finding the look.** Tried a neon punk style, then a painted "island" style. Both read as unfinished and were dropped.
4. **Vintage carnival.** Rebuilt the visuals from a moodboard of circus posters, tickets, sunbursts and harlequin patterns.
5. **Photo film strip.** Added per-booth photos and a saved keepsake drawn on canvas.
6. **Mascot.** Replaced the ringmaster with a clown in the style of old amusement-park posters.
7. **Deploy.** GitHub repo, Vercel deployment.
8. **Event features.** Added the countdown, calendar, directions, floor map from the team's sketch, run of show and FAQ. A single "link tree" QR (`/links`) replaced separate QR codes for the form and the site. The floor map was redrawn when the hall layout changed.
9. **Separate pages.** Split the single long page into six pages (intro, booths, floor map, run of show, FAQ, film strip), each a completely separate page with its own background. The home page acts as the menu, and every page has a "Back to home" button. Links are plain page loads rather than in-app navigation, so each click opens a new page.
10. **Backend and bot.** Moved stamp codes to Supabase, added the facilitator page and live queue times, built the Telegram bot with reminders and feedback, and the Instagram story export. Upgraded to Next.js 16 for security fixes.

### AI usage

The site was built with AI assistance (Claude) for code generation, then directed and revised over several rounds. The event, booth rules, floor plan, scope, visual direction and reference images, the photo-strip idea and the decision to collect feedback through the bot came from the team. Each generated version was reviewed, rejected or reshaped against those.

<!-- TODO: list the parts you wrote or changed by hand, e.g. copy, colours, codes, layout tweaks -->

## Known limitations

- **Stamps are per device.** Progress lives on one phone. There is no shared team state.
- **Stamping needs a connection.** Codes are checked on the server, so a phone with no signal can't collect a stamp until it reconnects.
- **Drink redemption is on trust.** The redeem button should be tapped in front of a facilitator.
- **Photos stay on the phone.** Clearing browser data or switching phones removes them, so save the strip before leaving. Photos are also not tied to stamps.
- **Reminder timing is approximate.** On Vercel's free plan, scheduled jobs run at some point within the scheduled hour, so the reminder arrives between 9am and 10am.
- **The bot only reaches people who started it.** Telegram doesn't allow bots to message anyone first.
- **`npm audit` warning.** It reports `picomatch`, which Tailwind uses only during the build. It never reaches visitors, and fixing it would mean moving to Tailwind 4.

## Possible next steps

- A live leaderboard across the 11 classes
- Verified team stamps (a facilitator scans a team QR)
- An opt-in gallery of film strips for a slideshow at the end
