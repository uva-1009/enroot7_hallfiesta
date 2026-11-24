// The full-screen background for one page: sunburst, harlequin, blueprint, curtain, polka or cinema.
export default function PageBg({ kind }) {
  return <div aria-hidden="true" className={`pagebg pagebg-${kind}`} />;
}
