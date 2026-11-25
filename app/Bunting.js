// Strings of triangle flags across the top of every page, like the poster's corners.
const COLORS = ["#1FA1B3", "#E0453A", "#F39B2E", "#F6C343"];
const r1 = (n) => Math.round(n * 10) / 10;

// Flags hung along a curved string from (x0,y0) to (x1,y1) sagging to depth `sag`.
function strand(x0, y0, x1, y1, sag, n, size, offset = 0) {
  const pt = (t) => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * ((x0 + x1) / 2) + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * ((y0 + y1) / 2 + sag) + t * t * y1];
  const flags = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n, [x, y] = pt(t), [xa, ya] = pt(t - 0.02), [xb, yb] = pt(t + 0.02);
    const ang = (Math.atan2(yb - ya, xb - xa) * 180) / Math.PI;
    return { x: r1(x), y: r1(y), ang: r1(ang), c: COLORS[(i + offset) % COLORS.length] };
  });
  return { d: `M${x0} ${y0} Q${(x0 + x1) / 2} ${(y0 + y1) / 2 + sag * 2} ${x1} ${y1}`, flags, size };
}

export default function Bunting() {
  const strands = [strand(-40, 10, 620, 30, 70, 7, 64), strand(560, 24, 1240, 0, 80, 7, 64, 2)];
  return (
    <svg aria-hidden="true" viewBox="0 0 1200 190" preserveAspectRatio="xMidYMin slice" className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-[150px] w-full sm:h-[190px]">
      {strands.map((s, si) => (
        <g key={si}>
          <path d={s.d} fill="none" stroke="#C9A77A" strokeWidth="4" />
          {s.flags.map((f, i) => (
            <g key={i} transform={`translate(${f.x} ${f.y}) rotate(${f.ang})`}>
              <path d={`M${-s.size / 2} 0 L${s.size / 2} 0 L0 ${s.size * 1.3} Z`} fill={f.c} />
              <path d={`M${-s.size / 2} 0 L0 0 L0 ${s.size * 1.3} Z`} fill="#000" opacity=".08" />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
