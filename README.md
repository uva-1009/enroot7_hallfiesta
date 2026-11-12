# EnROOT 7: Hall Wars

Next.js 14 (App Router) + Tailwind CSS. No backend.

```bash
npm install
npm run dev   # http://localhost:3000
```

- `data/booths.js`: booth text, rules and the facilitator stamp codes (CHANGE THE CODES before the event)
- `app/Hall.js`: page, booth dialog, stamp and badge logic (saved in localStorage)
- `app/Scene.js`: the animated SVG scene for each booth; timings are in `app/globals.css`
- `app/Mascot.js`: hero character whose eyes follow the cursor
