"use client";
// The home page menu: one big ticket-style button per page. Plain <a> links, so each opens as a completely new page.
import { PAGES } from "../data/pages";
import { useProgress } from "./progress";

const COLORS = ["#E0584B", "#6FB3AC", "#B3202A", "#4F9D96", "#E8B04A"];

export default function HomeMenu() {
  const { count } = useProgress();
  const extra = { "/booths": `${count}/3 stamps collected`, "/reel": count === 3 ? "Badge unlocked!" : `${3 - count} to go for the badge` };
  return (
    <nav aria-label="Pages" className="mx-auto max-w-3xl px-5 pt-14">
      <h2 className="label text-3xl sm:text-4xl">Step inside</h2>
      <ul className="mt-8 space-y-5">
        {PAGES.slice(1).map((p, i) => (
          <li key={p.href} style={{ rotate: `${i % 2 ? 0.8 : -0.8}deg` }}>
            <a href={p.href}
              className="paper flex items-center justify-between gap-4 rounded-[1.25rem] border-4 border-ink px-6 py-5 text-ink shadow-[7px_7px_0_#231815] transition hover:-translate-y-1 hover:rotate-0"
              style={{ backgroundColor: COLORS[i], color: i === 2 ? "#F4E8C8" : undefined }}>
              <span>
                <span className="block font-display text-3xl leading-tight">{p.label}</span>
                <span className="mt-1 block leading-snug">{p.blurb}</span>
                {extra[p.href] && <span className="mt-2 block font-type text-sm">{extra[p.href]}</span>}
              </span>
              <span className="shrink-0 rounded-full border-[3px] border-ink bg-bone px-4 py-1 font-slab text-sm text-ink">ENTER</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
