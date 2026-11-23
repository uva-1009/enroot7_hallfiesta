import QRCode from "qrcode";
import Staff from "./Staff";
import { event } from "../../data/event";

export const metadata = { title: "Facilitator desk | Hall Fiesta", robots: { index: false, follow: false } };

const qr = (url) => QRCode.toString(url, { type: "svg", margin: 2, errorCorrectionLevel: "M", color: { dark: "#231815", light: "#FFFFFF" } });

export default async function StaffPage() {
  const [linksQr, siteQr, registerQr] = await Promise.all([qr(event.linksUrl), qr(event.siteUrl), qr(event.registerUrl)]);
  return <Staff linksQr={linksQr} siteQr={siteQr} registerQr={registerQr} />;
}
