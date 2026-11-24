// Draft A: no shared header. The home page is the menu; every other page stands alone with a "Back to home" button.
// (The brackets in "(site)" mean this folder doesn't appear in the URL.)
import BackHome from "../BackHome";

export default function SiteLayout({ children }) {
  return (
    <div className="relative">
      <BackHome />
      <main className="pb-16">{children}</main>
    </div>
  );
}
