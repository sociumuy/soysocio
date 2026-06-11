export const dynamic = 'force-dynamic'

import type { Metadata } from "next";
import ClubTheme from "@/components/ClubTheme";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Cormorant_Garamond } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
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
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} ${cormorant.variable} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#0D0D0D" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body className="min-h-full font-sans" style={{ background: '#1a1a1a', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', minHeight: '100dvh', padding: '24px 0' }}>
        <div style={{ width: '100%', maxWidth: 430, minHeight: 'calc(100dvh - 48px)', position: 'relative', background: '#0D0D0D', borderRadius: 44, overflow: 'hidden', boxShadow: '0 0 0 8px #2a2a2a, 0 0 0 10px #111, 0 30px 80px rgba(0,0,0,0.6)' }}>
        <ClubTheme />
        {children}
        <script dangerouslySetInnerHTML={{
          __html: `if ('serviceWorker' in navigator) { navigator.serviceWorker.register('/sw.js') }`
        }} />
        </div>
      </body>
    </html>
  );
}
