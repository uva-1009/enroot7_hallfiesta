// Draws the red glitter film strip (Hollywood-style) onto a canvas. Used for the on-page preview and the saved image.
export const CW = 560, CH = 1140;
export const WIN = { x: 120, w: 320, h: 300, y: [100, 420, 740] };

const RED = "#A31D26", GOLD = "#E8C879", CREAM = "#F4E8C8", INK = "#231815";
const rnd = (seed) => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
const rr = (g, x, y, w, h, r) => { g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h); };
const starPath = (g, cx, cy, R, r, rot = 0) => {
  g.beginPath();
  for (let i = 0; i < 10; i++) {
    const a = rot + (i * Math.PI) / 5 - Math.PI / 2, d = i % 2 ? r : R, x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d;
    i ? g.lineTo(x, y) : g.moveTo(x, y);
  }
  g.closePath();
};

function glitterStar(g, cx, cy, R, rot, seed) {
  starPath(g, cx, cy, R, R * 0.45, rot); g.fillStyle = "#B3202A"; g.fill();
  g.save(); g.clip();
  const r = rnd(seed);
  for (let i = 0; i < 70; i++) { g.fillStyle = r() > 0.5 ? "rgba(255,205,180,.85)" : "rgba(70,0,8,.4)"; g.beginPath(); g.arc(cx + (r() - 0.5) * 2 * R, cy + (r() - 0.5) * 2 * R, 0.8 + r() * 1.3, 0, 7); g.fill(); }
  g.restore();
  starPath(g, cx, cy, R, R * 0.45, rot); g.lineJoin = "round"; g.lineWidth = Math.max(3, R * 0.14); g.strokeStyle = GOLD; g.stroke();
}

function disco(g, cx, cy, R) {
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 7); g.clip();
  const t = 9;
  for (let gy = -R; gy < R; gy += t) for (let gx = -R; gx < R; gx += t) {
    const v = ((Math.round(gx / t) * 7 + Math.round(gy / t) * 13) % 5 + 5) % 5;
    g.fillStyle = `hsl(40,6%,${42 + v * 11}%)`; g.fillRect(cx + gx, cy + gy, t - 1, t - 1);
  }
  const sh = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R);
  sh.addColorStop(0, "rgba(255,255,255,.6)"); sh.addColorStop(0.6, "rgba(0,0,0,0)"); sh.addColorStop(1, "rgba(0,0,0,.5)");
  g.fillStyle = sh; g.fillRect(cx - R, cy - R, 2 * R, 2 * R); g.restore();
  g.strokeStyle = CREAM; g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, R, 0, 7); g.stroke();
}

function ribbon(g, y0, y1) {
  const sx = (y) => 516 + 26 * Math.sin(y / 46);
  const trace = () => { g.beginPath(); g.moveTo(sx(y0), y0); for (let y = y0; y <= y1; y += 4) g.lineTo(sx(y), y); };
  g.save(); g.lineJoin = "round"; g.lineCap = "butt";
  trace(); g.setLineDash([]); g.strokeStyle = "#15100f"; g.lineWidth = 30; g.stroke();
  trace(); g.setLineDash([4, 7]); g.strokeStyle = CREAM; g.lineWidth = 26; g.stroke();
  trace(); g.setLineDash([]); g.strokeStyle = "#15100f"; g.lineWidth = 21; g.stroke();
  trace(); g.setLineDash([14, 6]); g.strokeStyle = "#D5CDB5"; g.lineWidth = 15; g.stroke();
  g.restore();
}

function sign(g, disp) {
  g.save(); g.translate(158, 76); g.rotate(-0.16);
  rr(g, -128, -38, 256, 76, 10); g.fillStyle = "#A81F27"; g.fill(); g.strokeStyle = GOLD; g.lineWidth = 4; g.stroke();
  g.fillStyle = "#FFE9A8";
  for (let x = -116; x <= 116; x += 17) for (const y of [-30, 30]) { g.beginPath(); g.arc(x, y, 3.6, 0, 7); g.fill(); }
  for (const y of [-14, 0, 14]) for (const x of [-119, 119]) { g.beginPath(); g.arc(x, y, 3.6, 0, 7); g.fill(); }
  rr(g, -104, -21, 208, 42, 5); g.fillStyle = CREAM; g.fill(); g.strokeStyle = GOLD; g.lineWidth = 2; g.stroke();
  g.fillStyle = RED; g.font = `25px ${disp}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("HALL FIESTA", 0, 2, 196); // shrinks to fit the sign
  g.restore();
}

function clapper(g, typ) {
  g.save(); g.translate(130, 1040); g.rotate(-0.12);
  g.fillStyle = "#17110f"; g.strokeStyle = CREAM; g.lineWidth = 2; rr(g, -92, -4, 184, 86, 4); g.fill(); g.stroke();
  g.fillStyle = CREAM; g.font = `11px ${typ}`; g.textAlign = "left"; g.textBaseline = "alphabetic";
  ["PRODUCTION", "DIRECTOR", "CAMERA", "DATE   SCENE   TAKE"].forEach((t, i) => {
    const y = 16 + i * 19; g.fillText(t, -84, y);
    g.beginPath(); g.moveTo(-84, y + 4); g.lineTo(84, y + 4); g.lineWidth = 1; g.strokeStyle = "rgba(244,232,200,.5)"; g.stroke();
  });
  g.save(); g.translate(-92, -32); g.rotate(-0.22);
  g.fillStyle = "#17110f"; g.fillRect(0, 0, 184, 26);
  g.beginPath(); g.rect(0, 0, 184, 26); g.clip(); g.fillStyle = CREAM;
  for (let x = -20; x < 190; x += 40) { g.beginPath(); g.moveTo(x, 26); g.lineTo(x + 20, 26); g.lineTo(x + 40, 0); g.lineTo(x + 20, 0); g.closePath(); g.fill(); }
  g.restore();
  g.restore();
}

function ticket(g, slab) {
  g.save(); g.translate(424, 1066); g.rotate(-0.1);
  rr(g, -96, -46, 192, 92, 10); g.fillStyle = CREAM; g.fill(); g.strokeStyle = RED; g.lineWidth = 4; g.stroke();
  g.setLineDash([5, 4]); rr(g, -86, -36, 172, 72, 6); g.lineWidth = 2; g.stroke(); g.setLineDash([]);
  g.fillStyle = RED; starPath(g, -70, 0, 9, 4, 0); g.fill(); starPath(g, 70, 0, 9, 4, 0); g.fill();
  g.font = `30px ${slab}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText("ADMIT", 0, -14); g.fillText("ONE", 0, 18);
  g.restore();
}

export async function drawReel(canvas, booths, photos, stamps = {}, clean = false) {
  canvas._tok = (canvas._tok || 0) + 1;
  const tok = canvas._tok;
  await document.fonts?.ready;
  const imgs = await Promise.all(booths.map((b) => (photos[b.id] ? loadImg(photos[b.id]).catch(() => null) : null)));
  if (canvas._tok !== tok) return;

  canvas.width = CW; canvas.height = CH;
  const g = canvas.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  const disp = css.getPropertyValue("--font-display") || "serif";
  const slab = css.getPropertyValue("--font-slab") || "serif";
  const typ = css.getPropertyValue("--font-type") || "monospace";
  const S = { x: 50, y: 60, w: 460, h: 1020 };

  g.fillStyle = "#fff"; rr(g, S.x - 14, S.y - 14, S.w + 28, S.h + 28, 26); g.fill();
  const grad = g.createLinearGradient(S.x, 0, S.x + S.w, 0);
  grad.addColorStop(0, "#8F141C"); grad.addColorStop(0.5, "#B0222B"); grad.addColorStop(1, "#8A1119");
  g.fillStyle = grad; rr(g, S.x, S.y, S.w, S.h, 14); g.fill();
  g.save(); rr(g, S.x, S.y, S.w, S.h, 14); g.clip();
  const r = rnd(7);
  for (let i = 0; i < 900; i++) { g.fillStyle = r() > 0.55 ? "rgba(255,196,170,.65)" : "rgba(60,0,5,.35)"; g.beginPath(); g.arc(S.x + r() * S.w, S.y + r() * S.h, 0.6 + r() * 1.4, 0, 7); g.fill(); }
  g.restore();
  g.fillStyle = "#F8EFD8";
  for (let y = S.y + 34; y < S.y + S.h - 30; y += 52) { rr(g, S.x + 22, y, 26, 30, 4); g.fill(); rr(g, S.x + S.w - 48, y, 26, 30, 4); g.fill(); }

  booths.forEach((b, i) => {
    const wy = WIN.y[i], img = imgs[i];
    g.save(); g.shadowColor = "rgba(0,0,0,.45)"; g.shadowBlur = 10; g.fillStyle = "#1b110f"; g.fillRect(WIN.x, wy, WIN.w, WIN.h); g.restore();
    if (img) {
      const k = Math.max(WIN.w / img.width, WIN.h / img.height), dw = img.width * k, dh = img.height * k;
      g.save(); g.beginPath(); g.rect(WIN.x, wy, WIN.w, WIN.h); g.clip();
      g.drawImage(img, WIN.x + (WIN.w - dw) / 2, wy + (WIN.h - dh) / 2, dw, dh); g.restore();
    } else {
      const cx = WIN.x + WIN.w / 2, cy = wy + WIN.h / 2 - 18;
      g.save(); g.setLineDash([8, 8]); g.strokeStyle = "rgba(244,232,200,.5)"; g.lineWidth = 2; g.strokeRect(WIN.x + 10, wy + 10, WIN.w - 20, WIN.h - 20); g.restore();
      g.strokeStyle = CREAM; g.lineWidth = 4; g.lineJoin = "round";
      rr(g, cx - 34, cy - 20, 68, 46, 8); g.stroke(); rr(g, cx - 14, cy - 30, 28, 10, 3); g.stroke();
      g.beginPath(); g.arc(cx, cy + 3, 13, 0, 7); g.stroke();
      g.fillStyle = CREAM; g.textAlign = "center"; g.textBaseline = "alphabetic";
      g.font = `20px ${slab}`; g.fillText("TAP TO SNAP", cx, cy + 62);
      g.font = `14px ${typ}`; g.fillStyle = "rgba(244,232,200,.8)"; g.fillText(`${i + 1}. ${b.name}`, cx, cy + 86);
    }
    g.strokeStyle = "#D8473F"; g.lineWidth = 4; g.strokeRect(WIN.x, wy, WIN.w, WIN.h);
    if (!clean) {
      const bx = WIN.x + WIN.w - 24, by = wy + 24;
      g.beginPath(); g.arc(bx, by, 16, 0, 7); g.fillStyle = stamps[b.id] ? "#E3A93B" : CREAM; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke();
      if (stamps[b.id]) { g.beginPath(); g.moveTo(bx - 7, by + 1); g.lineTo(bx - 2, by + 6); g.lineTo(bx + 8, by - 6); g.lineWidth = 4; g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = INK; g.stroke(); }
      else { g.fillStyle = INK; g.textAlign = "center"; g.textBaseline = "middle"; g.font = `17px ${slab}`; g.fillText(String(i + 1), bx, by + 1); }
    }
  });

  ribbon(g, 150, 340); ribbon(g, 470, 950);
  disco(g, 498, 402, 44);
  [[84, 372, 46, 0.2, 3], [70, 640, 30, -0.3, 5], [60, 862, 38, 0.4, 9], [476, 90, 52, 0.25, 11], [510, 600, 28, 0.1, 13], [506, 1004, 44, -0.2, 17], [172, 346, 14, 0, 19], [112, 722, 12, 0.5, 23], [300, 1096, 22, 0.2, 29]]
    .forEach(([x, y, R, rot, seed]) => glitterStar(g, x, y, R, rot, seed));
  sign(g, disp); clapper(g, typ); ticket(g, slab);
}
