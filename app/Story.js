// Instagram story version of the film strip: 1080 x 1920, strip centred on a sunburst.
// Instagram covers roughly the top and bottom 250px with its own UI, so the strip and title stay inside that.
import { drawReel, CW, CH } from "./Reel";
import { event } from "../data/event";

const W = 1080, H = 1920;

export async function drawStory(booths, photos) {
  const reel = document.createElement("canvas");
  await drawReel(reel, booths, photos, {}, true);

  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  const css = getComputedStyle(document.documentElement);
  const disp = css.getPropertyValue("--font-display") || "serif";
  const typ = css.getPropertyValue("--font-type") || "monospace";

  // Sunburst: 36 alternating rays from the strip's centre.
  const cx = W / 2, cy = 975, R = 2400, n = 36;
  g.fillStyle = "#EBDDB8"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#B3202A";
  for (let i = 0; i < n; i += 2) {
    const a1 = (i / n) * Math.PI * 2, a2 = ((i + 1) / n) * Math.PI * 2;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a1) * R, cy + Math.sin(a1) * R); g.lineTo(cx + Math.cos(a2) * R, cy + Math.sin(a2) * R); g.closePath(); g.fill();
  }
  const v = g.createRadialGradient(cx, cy, 300, cx, cy, 1300);
  v.addColorStop(0, "rgba(35,24,21,0)"); v.addColorStop(1, "rgba(35,24,21,.65)");
  g.fillStyle = v; g.fillRect(0, 0, W, H);

  // Title
  g.textAlign = "center"; g.textBaseline = "alphabetic";
  g.font = `112px ${disp}`;
  g.lineJoin = "round"; g.lineWidth = 18; g.strokeStyle = "#231815"; g.strokeText(event.name.toUpperCase(), cx, 336, 960);
  g.fillStyle = "#F4E8C8"; g.fillText(event.name.toUpperCase(), cx, 336, 960);

  // Strip, slightly tilted, with a hard shadow
  const h = 1180, w = (CW / CH) * h;
  g.save(); g.translate(cx, cy + 12); g.rotate(-0.035);
  g.shadowColor = "rgba(35,24,21,.6)"; g.shadowOffsetX = 16; g.shadowOffsetY = 16;
  g.drawImage(reel, -w / 2, -h / 2, w, h);
  g.restore();

  // Footer tag
  const tag = `${event.presenter.toUpperCase()} / ${event.shortDate.toUpperCase()} 2026`;
  g.font = `40px ${typ}`;
  const tw = g.measureText(tag).width + 60;
  g.fillStyle = "#231815"; g.fillRect(cx - tw / 2, 1590, tw, 64);
  g.fillStyle = "#E3A93B"; g.fillText(tag, cx, 1636);

  return new Promise((res) => c.toBlob(res, "image/png"));
}
