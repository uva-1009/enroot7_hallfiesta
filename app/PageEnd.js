// "Back" and "Up next" links at the bottom of each page.
import Link from "next/link";
import { PAGES } from "../data/pages";

export default function PageEnd({ current }) {
  const i = PAGES.findIndex((p) => p.href === current);
  const next = PAGES[(i + 1) % PAGES.length];
  const prev = i > 0 ? PAGES[i - 1] : null;
  return (
    <nav aria-label="More pages" className="mx-auto mt-4 flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 pb-16">
      {prev ? <Link href={prev.href} className="pill">Back: {prev.label}</Link> : <span />}
      <Link href={next.href} className="arrowbtn">{i === PAGES.length - 1 ? "Back to the start" : `Up next: ${next.label}`}</Link>
    </nav>
  );
}
