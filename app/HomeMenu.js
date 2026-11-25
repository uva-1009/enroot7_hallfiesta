"use client";
// The home page menu, styled like the poster's numbered postage stamps. Plain <a> links, so each opens as a completely new page.
import { PAGES } from "../data/pages";
import { useProgress } from "./progress";

const NUM = ["#F6C343", "#E0453A", "#27A549", "#1FA1B3", "#F39B2E"];

const Stamp = ({ children }) => (
  <span className="stamp block h-full">
    <span className="flex h-full flex-col justify-center rounded bg-bubble px-5 py-5 text-center text-bone">{children}</span>
  </span>
);

export default function HomeMenu() {
  const { count } = useProgress();
  const extra = { "/booths": `${count}/3 stamps collected`, "/reel": count === 3 ? "Badge unlocked!" : `${3 - count} more for the badge` };
  return (
    <nav aria-label="Pages" className="mx-auto max-w-5xl px-5 pt-16">
      <h2 className="text-2xl font-medium">Join us for...</h2>
      <ul className="mt-8 grid gap-x-10 gap-y-10 sm:grid-cols-2">
        {PAGES.slice(1).map((p, i) => (
          <li key={p.href} className="relative pl-12 sm:pl-14">
            <span aria-hidden="true" className="absolute -left-1 top-1/2 -translate-y-1/2 font-display text-7xl sm:text-8xl"
              style={{ color: NUM[i], textShadow: "4px 4px 0 #1E2350" }}>{i + 1}</span>
            <a href={p.href} className="block h-full transition hover:-translate-y-1 hover:rotate-[-1deg]">
              <Stamp>
                <span className="font-display text-2xl leading-tight sm:text-3xl">{p.label}</span>
                <span className="mt-2 leading-snug">{p.blurb}</span>
                {extra[p.href] && <span className="mx-auto mt-3 rounded-full bg-bone px-3 py-0.5 text-sm font-semibold text-ink">{extra[p.href]}</span>}
              </Stamp>
            </a>
          </li>
        ))}
        <li className="relative pl-12 sm:pl-14">
          <Stamp>
            <span className="font-display text-2xl leading-tight sm:text-3xl">Win prizes!!</span>
            <span className="mt-2 text-xl font-bold leading-snug text-ink">Snacks, drinks, squishies and more!</span>
          </Stamp>
        </li>
      </ul>
    </nav>
  );
}
