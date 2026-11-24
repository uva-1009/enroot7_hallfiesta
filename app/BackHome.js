"use client";
// Top of every page except home: a "Back to home" button and the stamp count. Plain <a> links, so each page is a full page load.
import { usePathname } from "next/navigation";
import { useProgress } from "./progress";

export default function BackHome() {
  const path = usePathname();
  const { count } = useProgress();
  if (path === "/") return null;
  return (
    <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 pt-6">
      <a href="/" className="pill">Back to home</a>
      <span className="rounded-md border-2 border-ink bg-bone px-3 py-1 font-slab text-sm text-ink shadow-[3px_3px_0_#231815]">{count}/3 STAMPS</span>
    </div>
  );
}
