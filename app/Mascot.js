"use client";
import { useEffect, useRef, useState } from "react";

// Original vintage-poster clown: sailor cap, feather plume, lashes, huge grin and a ruffled collar. Eyes follow the cursor.
export default function Mascot() {
  const ref = useRef(null);
  const [p, setP] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const move = (e) => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 200) * 4;
      setP({ x: (dx / d) * k, y: (dy / d) * k });
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);
  const INK = "#231815", RED = "#B3202A", ORANGE = "#E8873A", CREAM = "#F4E8C8", TEAL = "#5BA8A0";
  const s = { stroke: INK, strokeLinejoin: "round", strokeLinecap: "round" };
  // Round trig output so server (Node) and browser render identical strings — avoids hydration mismatches.
  const r2 = (n) => Math.round(n * 100) / 100;
  const ts = Array.from({ length: 13 }, (_, i) => (20 + i * (140 / 12)) * (Math.PI / 180));
  const lashes = [-150, -130, -110, -90, -70, -50, -30];
  return (
    <svg ref={ref} viewBox="0 0 240 300" className="bob w-full" role="img" aria-label="A grinning vintage clown in a sailor cap and ruffled collar, his eyes following your cursor">
      <defs><clipPath id="mouth"><path d="M64 186 Q120 206 176 186 Q170 226 120 228 Q70 226 64 186 Z" /></clipPath></defs>
      {ts.map((t, i) => <rect key={"b" + i} x="-9" y="-12" width="18" height="24" rx="8" fill={CREAM} stroke={TEAL} strokeWidth="3" transform={`translate(${r2(120 + 114 * Math.cos(t + 0.06))} ${r2(204 + 84 * Math.sin(t + 0.06))}) rotate(${r2((t * 180) / Math.PI - 90)})`} />)}
      {ts.map((t, i) => <rect key={"a" + i} x="-12" y="-18" width="24" height="36" rx="10" fill={CREAM} stroke={INK} strokeWidth="3.5" transform={`translate(${r2(120 + 100 * Math.cos(t))} ${r2(200 + 72 * Math.sin(t))}) rotate(${r2((t * 180) / Math.PI - 90)})`} />)}
      <path d="M38 140 C24 20 216 20 202 140 Z" fill={INK} />
      <ellipse cx="42" cy="146" rx="10" ry="19" fill={CREAM} strokeWidth="4" {...s} /><ellipse cx="198" cy="146" rx="10" ry="19" fill={CREAM} strokeWidth="4" {...s} />
      <path d="M40 142 q4 6 0 12 M200 142 q-4 6 0 12" fill="none" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
      <path d="M44 132 C42 68 198 68 196 132 C200 192 162 238 120 238 C78 238 40 192 44 132 Z" fill={CREAM} strokeWidth="5" {...s} />
      <path d="M52 134 C50 80 190 80 188 134 C192 186 158 230 120 230 C82 230 48 186 52 134 Z" fill="none" stroke={ORANGE} strokeWidth="2" opacity=".7" />
      <g transform="translate(160 40) rotate(16)">
        <path d="M-36 2 L-32 38 C-10 48 18 48 32 38 L36 2 Z" fill={CREAM} strokeWidth="4" {...s} />
        <ellipse cx="0" cy="2" rx="36" ry="11" fill={CREAM} strokeWidth="4" {...s} />
        <ellipse cx="0" cy="3" rx="29" ry="7" fill="#E2D3AB" />
        <path d="M18 14 l2 6 l6 2 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -2 z" fill="#fff" opacity=".85" />
      </g>
      <path d="M50 162 C66 148 92 152 108 166" fill="none" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" /><path d="M50 162 C66 148 92 152 108 166" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <path d="M190 162 C174 148 148 152 132 166" fill="none" stroke={ORANGE} strokeWidth="7" strokeLinecap="round" /><path d="M190 162 C174 148 148 152 132 166" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <path d="M62 108 C74 86 104 88 112 112 C96 102 78 102 62 108 Z M178 108 C166 86 136 88 128 112 C144 102 162 102 178 108 Z" fill={RED} strokeWidth="2.5" {...s} />
      <path d="M120 60 C146 96 146 136 124 172 C106 138 104 94 120 60 Z" fill={ORANGE} strokeWidth="3.5" {...s} />
      <path d="M120 66 C124 100 124 136 124 168 M121 90 l-8 8 M122 110 l-10 8 M123 130 l-9 8 M121 90 l9 6 M122 110 l10 6 M123 130 l9 6" fill="none" stroke="#B8561A" strokeWidth="2" strokeLinecap="round" />
      {[84, 156].map((cx) => (
        <g key={cx}>
          <ellipse cx={cx} cy="128" rx="19" ry="11" fill="#fff" strokeWidth="3" {...s} />
          <circle cx={cx + p.x} cy={128 + p.y} r="5.5" fill={INK} /><circle cx={cx + p.x - 1.6} cy={128 + p.y - 1.8} r="1.6" fill="#fff" />
          {lashes.map((a) => { const r = (a * Math.PI) / 180; return <line key={a} x1={r2(cx + Math.cos(r) * 18)} y1={r2(128 + Math.sin(r) * 10)} x2={r2(cx + Math.cos(r) * 26)} y2={r2(128 + Math.sin(r) * 17)} stroke={INK} strokeWidth="2" strokeLinecap="round" />; })}
          <path d={`M${cx - 20} 134 Q${cx} 148 ${cx + 20} 134`} fill="none" stroke={RED} strokeWidth="4" strokeLinecap="round" />
        </g>
      ))}
      <ellipse cx="120" cy="176" rx="16" ry="12" fill={RED} strokeWidth="3" {...s} /><ellipse cx="114" cy="172" rx="5" ry="3" fill="#F7B7A8" />
      <path d="M64 186 Q120 206 176 186 Q170 226 120 228 Q70 226 64 186 Z" fill={INK} strokeWidth="4" {...s} />
      <text x="120" y="220" textAnchor="middle" textLength="76" lengthAdjust="spacingAndGlyphs" fontSize="28" fill={CREAM} clipPath="url(#mouth)" style={{ fontFamily: "var(--font-slab)" }}>PLAY!</text>
      <path d="M64 186 Q120 206 176 186" fill="none" stroke={RED} strokeWidth="3" strokeLinecap="round" />
      <path d="M54 176 Q56 190 66 198 M186 176 Q184 190 174 198" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
