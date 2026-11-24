import PageBg from "../../PageBg";
import FilmStrip from "../../FilmStrip";

export const metadata = { title: "Film strip | Hall Fiesta" };

export default function ReelPage() {
  return (
    <>
      <PageBg kind="cinema" />
      <FilmStrip />
    </>
  );
}
