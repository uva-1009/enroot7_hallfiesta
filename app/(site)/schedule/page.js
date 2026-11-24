import PageBg from "../../PageBg";
import { RunOfShow } from "../../Schedule";

export const metadata = { title: "Run of show | Hall Fiesta" };

export default function SchedulePage() {
  return (
    <>
      <PageBg kind="curtain" />
      <RunOfShow />
    </>
  );
}
