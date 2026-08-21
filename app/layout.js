import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  weight: ["500", "700"]
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-plex-mono",
  weight: ["400", "500"]
});

export const metadata = {
  title: "Khidmat — Twin Cities Local Services Directory",
  description:
    "Find verified plumbers, electricians, AC technicians, tutors and more in Islamabad & Rawalpindi. Search or let the matcher find your top 3 near G-9, F-7, Bahria Town and beyond.",
  keywords: [
    "plumber Islamabad",
    "electrician Rawalpindi",
    "AC technician Islamabad",
    "home tutor Islamabad",
    "verified services twin cities"
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${grotesk.variable} ${inter.variable} ${plexMono.variable}`}>
      <body className="font-body min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
