import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_Georgian, Noto_Serif_Georgian } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const georgian = Noto_Sans_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-georgian",
  display: "swap",
});

// Used by the "Elegant" CV template (name and section headings).
const serif = Noto_Serif_Georgian({
  subsets: ["georgian", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const latin = Manrope({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-latin",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CV ბილდერი — უფასო CV ქართულად და ინგლისურად",
  description:
    "შექმენი პროფესიონალური CV რამდენიმე წუთში, რეგისტრაციის გარეშე. ქართული შრიფტებით PDF, ATS-ზე მეგობრული შაბლონები და AI დახმარება.",
};

export const viewport: Viewport = {
  themeColor: "#06201F",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ka" className={`${georgian.variable} ${serif.variable} ${latin.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
