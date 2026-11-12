// Looping SVG animations of each booth. Timings live in globals.css.
const INK = "#231815", BONE = "#F4E8C8", PASTA = "#E8C26A";
const Frame = ({ label, children }) => (
  <svg viewBox="0 0 320 200" className="h-auto w-full rounded-xl border-4 border-ink" role="img" aria-label={label}>
    <defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C98F55" /><stop offset="1" stopColor="#80522A" /></linearGradient></defs>
    <rect width="320" height="200" fill="#F4E8C8" />
    <polygon points="160,176 580,176 566,285" fill="#E8D3A0" /><polygon points="160,176 524,386 457,473" fill="#E8D3A0" /><polygon points="160,176 370,540 269,582" fill="#E8D3A0" /><polygon points="160,176 160,596 51,582" fill="#E8D3A0" /><polygon points="160,176 -50,540 -137,473" fill="#E8D3A0" /><polygon points="160,176 -204,386 -246,285" fill="#E8D3A0" /><polygon points="160,176 -260,176 -246,67" fill="#E8D3A0" /><polygon points="160,176 -204,-34 -137,-121" fill="#E8D3A0" /><polygon points="160,176 -50,-188 51,-230" fill="#E8D3A0" /><polygon points="160,176 160,-244 269,-230" fill="#E8D3A0" /><polygon points="160,176 370,-188 457,-121" fill="#E8D3A0" /><polygon points="160,176 524,-34 566,67" fill="#E8D3A0" />
    <path d="M0 0H20V6A10 10 0 0 1 0 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M20 0H40V6A10 10 0 0 1 20 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" /><path d="M40 0H60V6A10 10 0 0 1 40 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M60 0H80V6A10 10 0 0 1 60 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" /><path d="M80 0H100V6A10 10 0 0 1 80 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M100 0H120V6A10 10 0 0 1 100 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" /><path d="M120 0H140V6A10 10 0 0 1 120 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M140 0H160V6A10 10 0 0 1 140 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" /><path d="M160 0H180V6A10 10 0 0 1 160 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M180 0H200V6A10 10 0 0 1 180 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" /><path d="M200 0H220V6A10 10 0 0 1 200 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M220 0H240V6A10 10 0 0 1 220 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" /><path d="M240 0H260V6A10 10 0 0 1 240 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M260 0H280V6A10 10 0 0 1 260 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" /><path d="M280 0H300V6A10 10 0 0 1 280 6Z" fill="#B3202A" stroke={INK} strokeWidth="2" /><path d="M300 0H320V6A10 10 0 0 1 300 6Z" fill="#F4E8C8" stroke={INK} strokeWidth="2" />
    {children}
    <rect y="170" width="320" height="30" fill="url(#gr)" /><path d="M40 170V200M100 170V200M170 170V200M230 170V200M290 170V200M0 186H320" stroke={INK} strokeOpacity=".35" strokeWidth="2" /><line x1="0" y1="170" x2="320" y2="170" stroke={INK} strokeWidth="4" />
  </svg>
);

function Nerf() {
  const cups = []; let n = 0;
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5 - r; c++) cups.push({ x: 232 + r * 8 + c * 16, y: 154 - r * 16, r, i: n++ });
  return (
    <Frame label="A team fires a foam dart over an obstacle and knocks down a pyramid of cups">
      {[0, 1, 2, 3, 4].map((i) => <circle key={i} cx={16 + i * 15} cy="152" r="8" fill={["#B3202A", "#4F9D96", "#E3A93B", "#3DAE6B", "#B3202A"][i]} stroke={INK} strokeWidth="3" />)}
      <rect x="62" y="122" width="34" height="9" rx="3" fill={INK} />
      <line x1="100" y1="120" x2="100" y2="170" stroke="#B3202A" strokeWidth="3" strokeDasharray="5 4" />
      <rect x="166" y="105" width="12" height="65" fill="#E3A93B" stroke={INK} strokeWidth="3" />
      <rect className="a-dart" x="96" y="124" width="16" height="5" rx="2" fill="#B3202A" stroke={INK} strokeWidth="2" />
      {cups.map((c) => (
        <g key={c.i} className="a-cup" style={{ "--dx": `${((c.i * 7) % 5 - 1) * 16 + 10}px`, "--dy": `${c.r * 16}px`, "--r": `${(c.i * 37) % 80 - 40}deg` }}>
          <polygon points={`${c.x},${c.y} ${c.x + 16},${c.y} ${c.x + 13},${c.y + 16} ${c.x + 3},${c.y + 16}`} fill={c.i % 2 ? "#4F9D96" : "#F4E8C8"} stroke={INK} strokeWidth="2.5" strokeLinejoin="round" />
          <polygon points={`${c.x + 9},${c.y} ${c.x + 16},${c.y} ${c.x + 13},${c.y + 16} ${c.x + 8},${c.y + 16}`} fill={INK} opacity=".22" />
          <line x1={c.x + 3} y1={c.y + 4} x2={c.x + 5} y2={c.y + 10} stroke="#fff" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
        </g>
      ))}
      <g className="a-pow"><polygon points="225,60 238,70 252,52 258,72 276,66 266,84 282,92 262,96 266,112 248,102 236,114 232,96 214,98 226,84 212,74 230,72" fill="#E3A93B" stroke={INK} strokeWidth="3" /><text x="226" y="92" fontSize="17" fill={INK} style={{ fontFamily: "var(--font-display)" }}>POW</text></g>
    </Frame>
  );
}

function Tower({ x, cls }) {
  const hw = (y) => (16 * (y - 55)) / 115;
  const parts = (
    <>
      <line x1={x - 16} y1="170" x2={x} y2="55" /><line x1={x + 16} y1="170" x2={x} y2="55" />
      {[140, 110, 85].map((y) => <line key={y} x1={x - hw(y)} y1={y} x2={x + hw(y)} y2={y} />)}
      <line x1={x - 16} y1="170" x2={x + hw(140)} y2="140" /><line x1={x + 16} y1="170" x2={x - hw(140)} y2="140" />
    </>
  );
  return (
    <g className={cls} strokeLinecap="round">
      <g stroke={INK} strokeWidth="7">{parts}</g>
      <g stroke={PASTA} strokeWidth="3">{parts}</g>
    </g>
  );
}

function Pasta() {
  return (
    <Frame label="Two teams build spaghetti towers while a timer runs down, then the taller tower wins snacks and both get stamps">
      <circle cx="160" cy="42" r="14" fill="none" stroke={INK} strokeOpacity=".2" strokeWidth="6" />
      <circle className="a-ring" cx="160" cy="42" r="14" fill="none" stroke="#B3202A" strokeWidth="6" strokeDasharray="88" transform="rotate(-90 160 42)" />
      <text x="160" y="80" textAnchor="middle" fontSize="14" fill={INK} style={{ fontFamily: "var(--font-display)" }}>5 MIN</text>
      <Tower x={85} cls="a-growa" />
      <Tower x={235} cls="a-growb" />
      <g className="a-pop"><polygon points="70,48 76,34 85,44 94,34 100,48" fill="#E3A93B" stroke={INK} strokeWidth="3" strokeLinejoin="round" /></g>
      <g className="a-pop"><rect x="108" y="128" width="30" height="34" rx="5" fill="#B3202A" stroke={INK} strokeWidth="3" /><text x="123" y="150" textAnchor="middle" fontSize="9" fill={INK} style={{ fontFamily: "var(--font-display)" }}>SNACK</text></g>
      {[85, 235].map((x) => <g key={x} className="a-pop"><circle cx={x} cy="186" r="9" fill="#4F9D96" stroke={BONE} strokeWidth="2" /><text x={x} y="190" textAnchor="middle" fontSize="11" fill={INK} fontWeight="700">✓</text></g>)}
    </Frame>
  );
}

function Ball() {
  return (
    <Frame label="A ball hops from cup to cardboard to chute without being carried, with a timer ring on each surface">
      <text x="160" y="26" textAnchor="middle" fontSize="13" fill={INK} style={{ fontFamily: "var(--font-display)" }}>MAX 3-4 SEC PER SURFACE</text>
      <polygon points="62,150 100,150 94,170 68,170" fill="#4F9D96" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      <rect x="122" y="118" width="56" height="9" rx="2" fill={BONE} stroke={INK} strokeWidth="3" transform="rotate(-6 150 122)" />
      <path d="M190 128 L262 158" stroke={INK} strokeWidth="9" strokeLinecap="round" /><path d="M190 128 L262 158" stroke="#B3202A" strokeWidth="4" strokeLinecap="round" />
      {[[22, "A"], [298, "B"]].map(([x, t]) => (
        <g key={t}><line x1={x} y1="110" x2={x} y2="170" stroke={INK} strokeWidth="4" /><polygon points={`${x},110 ${x + (t === "A" ? 22 : -22)},120 ${x},130`} fill="#E3A93B" stroke={INK} strokeWidth="3" /><text x={x + (t === "A" ? 6 : -16)} y="127" fontSize="10" fill={INK} style={{ fontFamily: "var(--font-display)" }}>{t}</text></g>
      ))}
      <g className="a-ball">
        <circle r="13" fill="none" stroke="#B3202A" strokeWidth="3" strokeDasharray="82" transform="rotate(-90)" className="a-tring" />
        <circle r="8" fill="#E3A93B" stroke={INK} strokeWidth="3" />
      </g>
    </Frame>
  );
}

export default function Scene({ id }) {
  return id === "nerf" ? <Nerf /> : id === "pasta" ? <Pasta /> : <Ball />;
}
