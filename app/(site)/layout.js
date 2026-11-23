// Shared frame for the public pages: sunburst background and the header with page links.
// (The brackets in "(site)" mean this folder doesn't appear in the URL.)
import Sky from "../Sky";
import SiteNav from "../SiteNav";

export default function SiteLayout({ children }) {
  return (
    <div className="relative">
      <Sky />
      <SiteNav />
      <main className="pb-16">{children}</main>
    </div>
  );
}
