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
    "GDP measures what an economy produces this year. The Civic Wealth Index measures what a community has actually built and maintained — roads, parks, schools, safe streets — and can hand to people it will never know.",
  openGraph: {
    type: "website",
    siteName: "Civic Wealth Index",
    title: "Civic Wealth Index",
    description:
      "A balance sheet for American places. Measuring accumulated public wealth, not annual output.",
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
