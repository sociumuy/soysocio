export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import ClubTheme from "@/components/ClubTheme";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cormorant_Garamond, Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DelClub",
  description: "Tu club, en tu bolsillo",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'DelClub',
  },
  formatDetection: { telephone: false },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} ${cormorant.variable} ${syne.variable} ${dmSans.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#0D0D0D" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-full font-sans">
        <div className="phone-frame" style={{ background: '#0D0D0D' }}>
          <div className="phone-frame-scroll">
            <ClubTheme />
            {children}
          </div>
          <script dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`
          }} />
        </div>
      </body>
    </html>
  );
}
