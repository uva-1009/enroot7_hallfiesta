import "./globals.css";
import { Rye, Alfa_Slab_One, Special_Elite, Archivo } from "next/font/google";

const display = Rye({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const slab = Alfa_Slab_One({ weight: "400", subsets: ["latin"], variable: "--font-slab" });
const type = Special_Elite({ weight: "400", subsets: ["latin"], variable: "--font-type" });
const body = Archivo({ subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Hall Wars | EnROOT 7",
  description: "Play the three booths, collect your stamps, earn the badge and an extra drink.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${slab.variable} ${type.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
