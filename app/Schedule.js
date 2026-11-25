import { event } from "../data/event";

export function RunOfShow() {
  return (
    <section id="schedule" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-14">
      <h1 className="label text-3xl sm:text-4xl">Run of show</h1>
      <ol className="poster paper mt-8 p-6 text-ink sm:p-8">
        {event.schedule.map((s, i) => (
          <li key={s.time} className="relative grid grid-cols-[5.5rem_1fr] gap-4 pb-6 last:pb-0 sm:grid-cols-[7rem_1fr]">
            {i < event.schedule.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[5.5rem] top-7 -ml-px w-0.5 bg-ink/30 sm:left-[7rem]" />}
            <span className="pt-0.5 text-right font-slab text-lg text-bubble sm:text-xl">{s.time}</span>
            <div className="relative pl-5">
              <span aria-hidden="true" className="absolute -left-[7px] top-2 h-3.5 w-3.5 rounded-full border-[3px] border-ink bg-mustard" />
              <h3 className="font-display text-xl leading-tight sm:text-2xl">{s.title}</h3>
              <p className="mt-1 leading-snug">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Faq() {
  return (
    <section id="faq" className="mx-auto max-w-3xl scroll-mt-20 px-5 py-14">
      <h1 className="label text-3xl sm:text-4xl">Questions</h1>
      <div className="mt-8 space-y-3">
        {event.faq.map((f) => (
          <details key={f.q} className="faq group rounded-xl border-4 border-ink bg-bone text-ink shadow-[5px_5px_0_#1E2350]">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 text-lg font-bold leading-tight sm:text-xl">
              {f.q}
              <span aria-hidden="true" className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-mustard font-slab text-lg transition group-open:rotate-45">+</span>
            </summary>
            <p className="px-4 pb-4 leading-snug">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
