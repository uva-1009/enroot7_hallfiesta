"use client";
// /map: the floor plan. Tapping a booth zone opens that booth's pop-up right here.
import { useCallback, useState } from "react";
import { booths } from "../data/booths";
import { event } from "../data/event";
import FloorMap, { MapKey } from "./FloorMap";
import BoothDialog from "./BoothDialog";
import { useProgress, useQueue, usePhotoPicker } from "./progress";

export default function MapView() {
  const { st, persist, photos } = useProgress();
  const { queue, live, level } = useQueue();
  const { input, pick } = usePhotoPicker(persist);
  const [open, setOpen] = useState(null);
  const close = useCallback(() => setOpen(null), []);
  const b = booths.find((x) => x.id === open);

  return (
    <section className="mx-auto max-w-5xl px-5 pt-14">
      {input}
      <h1 className="label text-3xl sm:text-4xl">Find your way</h1>
      <div className="poster paper mt-8 p-4 sm:p-8">
        <p className="mb-4 text-center font-type text-ink">{event.venue}, {event.venueDetail}. Come in through the middle doors. Tap a booth to see its rules.</p>
        <p className="mb-2 text-center font-type text-sm text-ink sm:hidden">Swipe sideways to see the whole hall.</p>
        <div className="-mx-2 overflow-x-auto px-2 pb-2">
          <div className="min-w-[640px] sm:min-w-0"><FloorMap onPick={setOpen} queue={queue} showQueue={live} /></div>
        </div>
        <MapKey />
      </div>
      {b && (
        <BoothDialog booth={b} stamped={!!st.stamps[b.id]} hasPhoto={!!photos[b.id]} level={level(b.id)} onClose={close}
          onStamp={(id) => persist((p) => ({ ...p, stamps: { ...p.stamps, [id]: true } }))} onPhoto={pick} />
      )}
    </section>
  );
}
