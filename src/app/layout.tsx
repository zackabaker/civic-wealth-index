import type { Metadata } from "next";
import { Geist, Geist_Mono, Fraunces } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "@/components/Chrome";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://civicwealthindex.org"),
  title: {
    default: "Civic Wealth Index — measuring what a place has built to last",
    template: "%s · Civic Wealth Index",
  },
  description:
    "Scores for the accumulated public wealth of American places — infrastructure, parks, schools, health, safety — from public data. All 92 Indiana counties. Open data and method.",
  openGraph: {
    type: "website",
    siteName: "Civic Wealth Index",
    title: "Civic Wealth Index",
    description:
      "Accumulated public wealth, scored from public data. All 92 Indiana counties.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
