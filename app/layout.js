import "./globals.css";
import { Bungee, Poppins } from "next/font/google";

// Poster look: chunky Bungee for titles, Poppins for everything else.
const display = Bungee({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const body = Poppins({ weight: ["400", "500", "600", "700", "800"], subsets: ["latin"], variable: "--font-body" });

export const metadata = {
  title: "Hall Fiesta | EnROOT 7",
  description: "Play the three booths, collect your stamps, earn the badge and an extra drink.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
