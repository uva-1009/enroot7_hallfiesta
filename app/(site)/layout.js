// No shared header: the home page is the menu; every other page stands alone with a "Back to home" button.
// Bunting hangs across the top of every page, like the poster.
// (The brackets in "(site)" mean this folder doesn't appear in the URL.)
import BackHome from "../BackHome";
import Bunting from "../Bunting";

export default function SiteLayout({ children }) {
  return (
    <div className="relative">
      <Bunting />
      <BackHome />
      <main className="pb-16">{children}</main>
    </div>
  );
}
