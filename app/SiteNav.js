"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "./progress";
import { PAGES } from "../data/pages";

export default function SiteNav() {
  const path = usePathname();
  const { count } = useProgress();
  const isOn = (href) => (href === "/" ? path === "/" : path.startsWith(href));
  const row = useRef(null);

  // On phones the page links scroll sideways: keep the current page's link in view.
  useEffect(() => {
    const el = row.current?.querySelector('[aria-current="page"]');
    if (el && row.current) row.current.scrollTo({ left: el.offsetLeft - row.current.clientWidth / 2 + el.clientWidth / 2, behavior: "instant" });
  }, [path]);

  const link = (p, extra = "") => (
    <Link key={p.href} href={p.href} aria-current={isOn(p.href) ? "page" : undefined}
      className={`shrink-0 rounded-full px-3 py-1 transition ${isOn(p.href) ? "bg-mustard text-ink" : "hover:text-mustard"} ${extra}`}>
      {p.label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-40 bg-ink text-bone">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-2">
        <Link href="/" className="font-display text-xl text-mustard">Hall Fiesta</Link>
        <nav aria-label="Pages" className="hidden gap-1 font-type text-sm lg:flex">{PAGES.map((p) => link(p))}</nav>
        <Link href="/reel" className="rounded-md border-2 border-mustard px-3 font-slab text-sm text-mustard" aria-live="polite">{count}/3 STAMPS</Link>
      </div>
      <nav ref={row} aria-label="Pages" className="no-scrollbar fade-edges flex gap-1 overflow-x-auto px-3 pb-2 font-type text-sm lg:hidden">
        {PAGES.map((p) => link(p))}
      </nav>
      <div className="bulbs" />
    </header>
  );
}
