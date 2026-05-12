import type { Metadata } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { TopNav } from "@/components/top-nav";
import { SideRail } from "@/components/side-rail";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lopes Capital — Operators since 2017",
  description:
    "A Scottsdale multi-family office. Operator-built. Capital-deployed. Direct investments and operational support across capital markets, real estate, education, healthcare, and media.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <TopNav />
        <SideRail />
        <div className="hidden md:block fixed bottom-6 left-6 z-40 font-mono text-[11px] text-paper-faint">
          SCOTTSDALE · AZ
        </div>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
