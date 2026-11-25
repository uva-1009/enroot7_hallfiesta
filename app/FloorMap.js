"use client";
import { booths } from "../data/booths";
import { QUEUE } from "../lib/queue";

// Multi-Purpose Hall, drawn from the team's floor-plan sketch (updated 18 Nov). Units are arbitrary (viewBox 1000 x 650).
const INK = "#1E2350", CREAM = "#F4E8C8", WOOD = "#C98F55", DARKWOOD = "#8F5A2B";
const color = Object.fromEntries(booths.map((b) => [b.id, b.color]));

const Table = ({ x, y, w, h }) => <rect x={x} y={y} width={w} height={h} rx="3" fill={WOOD} stroke={INK} strokeWidth="3" />;
const Chair = ({ x, y }) => <rect x={x} y={y} width="14" height="14" rx="2" fill={DARKWOOD} stroke={INK} strokeWidth="2.5" />;
const People = ({ pts }) => pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="11" fill={CREAM} stroke={INK} strokeWidth="2.5" />);
const ring = (cx, cy, n, r, start = -90) =>
  Array.from({ length: n }, (_, i) => { const a = ((start + (360 / n) * i) * Math.PI) / 180; return [Math.round((cx + Math.cos(a) * r) * 100) / 100, Math.round((cy + Math.sin(a) * r) * 100) / 100]; });

function Plate({ cx, cy, lines, fill, size = 34, queue }) {
  const w = Math.max(...lines.map((l) => l.length)) * size * 0.62 + 36;
  const h = lines.length * size * 1.1 + 22;
  return (
    <g>
      <rect x={cx - w / 2 + 5} y={cy - h / 2 + 5} width={w} height={h} rx="10" fill={INK} />
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx="10" fill={fill} stroke={INK} strokeWidth="4" />
      {lines.map((l, i) => (
        <text key={l} x={cx} y={cy - h / 2 + 11 + size * 0.92 + i * size * 1.1} textAnchor="middle" fontSize={size} fill={INK} style={{ fontFamily: "var(--font-display)" }}>{l}</text>
      ))}
      {queue && (
        <g>
          <rect x={cx - 64} y={cy + h / 2 - 4} width="128" height="32" rx="16" fill={QUEUE[queue].color} stroke={INK} strokeWidth="3" />
          <text x={cx} y={cy + h / 2 + 19} textAnchor="middle" fontSize="19" fill={QUEUE[queue].text} style={{ fontFamily: "var(--font-slab)" }}>{QUEUE[queue].short}</text>
        </g>
      )}
    </g>
  );
}

function Zone({ id, x, y, w, h, onPick, children }) {
  const b = booths.find((z) => z.id === id);
  return (
    <g className="zone" role="button" tabIndex={0} aria-label={`${b.name}: open booth rules`}
      onClick={() => onPick(id)} onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onPick(id))}>
      <rect className="zfill" x={x} y={y} width={w} height={h} fill={color[id]} opacity=".32" />
      {children}
    </g>
  );
}

function Door({ x, w, arrows = [] }) {
  return (
    <g>
      <rect x={x} y="551" width={w} height="18" fill={CREAM} stroke={INK} strokeWidth="3" />
      {arrows.map((ax) => (
        <g key={ax}>
          <path d={`M${ax} 618 V578`} stroke={INK} strokeWidth="5" strokeLinecap="round" />
          <path d={`M${ax - 11} 590 L${ax} 576 L${ax + 11} 590`} fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ))}
    </g>
  );
}

export default function FloorMap({ onPick, queue = {}, showQueue = false }) {
  const q = (id) => (showQueue && queue[id]?.level) || null;
  return (
    <svg viewBox="0 0 1000 650" className="h-auto w-full" role="group" aria-label="Floor plan of the Multi-Purpose Hall">
      <defs>
        <pattern id="planks" width="60" height="30" patternUnits="userSpaceOnUse">
          <rect width="60" height="30" fill="#F1E2BD" />
          <path d="M0 30H60M30 0V15M0 15H60M0 15V30M60 15V30" stroke="#D9C495" strokeWidth="1.5" />
        </pattern>
      </defs>

      <rect x="20" y="20" width="960" height="540" fill="url(#planks)" />

      {/* Registration and prizes: the middle column (not a booth) */}
      <rect x="344" y="25" width="304" height="530" fill="#B3202A" opacity=".12" />

      {/* Dividers from the sketch (drawn first so signs and badges sit on top) */}
      <g stroke={INK} strokeWidth="4" strokeDasharray="16 12" strokeLinecap="round">
        <path d="M344 25 V555" /><path d="M648 25 V555" /><path d="M25 268 H344" />
      </g>

      {/* Booth zones (tappable) */}
      <Zone id="nerf" x={25} y={25} w={319} h={243} onPick={onPick}>
        <Chair x={110} y={30} /><Chair x={163} y={30} /><Chair x={215} y={30} />
        <Table x={97} y={50} w={52} h={30} /><Table x={149} y={50} w={52} h={30} /><Table x={201} y={50} w={52} h={30} />
        <Table x={62} y={92} w={40} h={33} /><Table x={62} y={125} w={40} h={33} />
        <Chair x={112} y={98} /><Chair x={112} y={134} />
        <path d="M176 124 H140 M152 113 L139 124 L152 135" fill="none" stroke={INK} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <People pts={[[192, 102], [226, 112], [264, 118], [196, 138], [232, 146]]} />
        <Plate cx={178} cy={203} lines={["Target", "Blast"]} fill={color.nerf} size={24} queue={q("nerf")} />
      </Zone>
      <Zone id="pasta" x={25} y={268} w={319} h={287} onPick={onPick}>
        <Chair x={60} y={330} /><Chair x={60} y={384} />
        <Table x={84} y={322} w={40} h={42} /><Table x={84} y={364} w={40} h={42} />
        <Table x={218} y={300} w={38} h={38} /><People pts={ring(237, 319, 5, 36, -90)} />
        <text x="237" y="377" textAnchor="middle" fontSize="22" fill={INK} style={{ fontFamily: "var(--font-display)" }}>vs</text>
        <Table x={220} y={412} w={38} h={38} /><People pts={ring(239, 431, 5, 36, 90)} />
        <Plate cx={110} cy={468} lines={["Pasta Tower", "Challenge"]} fill={color.pasta} size={19} queue={q("pasta")} />
      </Zone>
      <Zone id="ball" x={648} y={25} w={327} h={530} onPick={onPick}>
        <Chair x={768} y={30} /><Chair x={817} y={30} />
        <Table x={749} y={50} w={60} h={32} /><Table x={811} y={50} w={60} h={32} />
        <Table x={898} y={50} w={56} h={34} />
        <People pts={[[781, 124], [826, 124], [871, 126], [805, 160], [850, 160]]} />
        <text x="928" y="118" textAnchor="middle" fontSize="22" fill={INK} style={{ fontFamily: "var(--font-slab)" }}>START</text>
        <path d="M827 190 V346" stroke={INK} strokeWidth="6" strokeDasharray="14 10" strokeLinecap="round" />
        <path d="M809 334 L827 358 L845 334" fill="none" stroke={INK} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="745" y="372" width="162" height="62" rx="8" fill={CREAM} stroke={INK} strokeWidth="4" strokeDasharray="14 9" />
        <text x="826" y="412" textAnchor="middle" fontSize="26" fill={INK} style={{ fontFamily: "var(--font-slab)" }}>END</text>
        <Plate cx={811} cy={488} lines={["Ball Transfer"]} fill={color.ball} size={28} queue={q("ball")} />
      </Zone>

      {/* Registration and prize collection furniture */}
      <Chair x={430} y={224} /><Chair x={483} y={224} /><Chair x={535} y={224} />
      <Table x={413} y={244} w={54} h={40} /><Table x={467} y={244} w={54} h={40} /><Table x={521} y={244} w={54} h={40} />
      <Plate cx={494} cy={342} lines={["Registration", "& prizes"]} fill={CREAM} size={24} />

      {/* Walls and doors */}
      <rect x="20" y="20" width="960" height="540" fill="none" stroke={INK} strokeWidth="10" />
      <Door x={69} w={121} />
      <Door x={368} w={138} arrows={[417]} />
      <Door x={524} w={122} arrows={[575]} />
      <Door x={810} w={113} />
      <text x="496" y="636" textAnchor="middle" fontSize="22" fill={INK} style={{ fontFamily: "var(--font-type)" }}>entry</text>
    </svg>
  );
}

export function MapKey() {
  return (
    <ul className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 font-type text-sm text-ink">
      <li className="flex items-center gap-2"><span className="inline-block h-4 w-6 rounded-sm border-[3px] border-ink bg-[#C98F55]" />table</li>
      <li className="flex items-center gap-2"><span className="inline-block h-3.5 w-3.5 rounded-sm border-[3px] border-ink bg-[#8F5A2B]" />chair</li>
      <li className="flex items-center gap-2"><span className="inline-block h-4 w-4 rounded-full border-[3px] border-ink bg-bone" />players</li>
      <li className="flex items-center gap-2"><span className="inline-block w-8 border-t-4 border-dashed border-ink" />zone divider</li>
    </ul>
  );
}
