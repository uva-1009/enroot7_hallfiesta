import Mascot from "./Mascot";

const INK = "#231815", RED = "#B3202A", CREAM = "#F4E8C8", GOLD = "#E3A93B";
const star = (cx, cy, R, r, n) =>
  Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2, rad = i % 2 ? r : R;
    return `${(cx + Math.cos(a) * rad).toFixed(1)},${(cy + Math.sin(a) * rad).toFixed(1)}`;
  }).join(" ");
const stripe = (i) => {
  const t = (k) => [10 + 100 * (k / 8), 24 + 72 * (k / 8)];
  const [a, b] = [t(i), t(i + 1)];
  return `${a[0]},60 ${b[0]},60 ${b[1]},150 ${a[1]},150`;
};

// Vintage poster composition: mustard disc, ringmaster, popcorn bucket, admit-one ticket, starburst sticker.
export default function HeroArt() {
  return (
    <div className="relative mx-auto aspect-[500/440] w-full max-w-md">
      <svg viewBox="0 0 500 440" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <circle cx="250" cy="214" r="196" fill={GOLD} stroke={INK} strokeWidth="7" />
        <circle cx="250" cy="214" r="176" fill="none" stroke={CREAM} strokeWidth="4" strokeDasharray="1 13" strokeLinecap="round" />
        {[[70, 330, 14], [440, 150, 12], [420, 60, 9], [96, 150, 8]].map(([x, y, r], i) => <polygon key={i} points={star(x, y, r, r * 0.45, 5)} fill={i % 2 ? CREAM : RED} stroke={INK} strokeWidth="3" strokeLinejoin="round" />)}
        <g transform="translate(18 270) scale(1.15)">
          {[[36, 40, 16], [58, 34, 18], [82, 42, 16], [48, 24, 14], [72, 22, 15], [96, 32, 13]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={i % 2 ? "#FFF6D8" : "#F8E7B0"} stroke={INK} strokeWidth="3" />)}
          <polygon points="10,60 110,60 96,150 24,150" fill={CREAM} />
          {[1, 3, 5, 7].map((i) => <polygon key={i} points={stripe(i)} fill={RED} />)}
          <polygon points="10,60 110,60 96,150 24,150" fill="none" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <rect x="4" y="54" width="112" height="12" rx="3" fill={RED} stroke={INK} strokeWidth="3.5" />
        </g>
        <g transform="translate(335 342) rotate(-11)">
          <rect width="136" height="62" rx="7" fill={CREAM} stroke={INK} strokeWidth="4" />
          <line x1="96" y1="6" x2="96" y2="56" stroke={INK} strokeWidth="2.5" strokeDasharray="4 4" />
          <text x="48" y="26" textAnchor="middle" fontSize="13" fill={RED} style={{ fontFamily: "var(--font-slab)" }}>ADMIT ONE</text>
          <text x="48" y="46" textAnchor="middle" fontSize="11" fill={INK} style={{ fontFamily: "var(--font-type)" }}>3 BOOTHS</text>
          <text x="116" y="38" textAnchor="middle" fontSize="9" fill={INK} style={{ fontFamily: "var(--font-type)" }}>Nº 007</text>
        </g>
        <g className="pulse">
          <polygon points={star(88, 84, 62, 44, 12)} fill={RED} stroke={INK} strokeWidth="4" strokeLinejoin="round" />
          <text x="88" y="82" textAnchor="middle" fontSize="17" fill={CREAM} style={{ fontFamily: "var(--font-display)" }}>EXTRA</text>
          <text x="88" y="102" textAnchor="middle" fontSize="17" fill={CREAM} style={{ fontFamily: "var(--font-display)" }}>DRINK!</text>
        </g>
      </svg>
      <div className="absolute bottom-[1%] left-1/2 w-[56%] -translate-x-1/2"><Mascot /></div>
    </div>
  );
}
