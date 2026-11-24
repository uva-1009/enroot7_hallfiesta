import PageBg from "../../PageBg";
import MapView from "../../MapView";

export const metadata = { title: "Floor map | Hall Fiesta" };

export default function MapPage() {
  return (
    <>
      <PageBg kind="blueprint" />
      <MapView />
    </>
  );
}
