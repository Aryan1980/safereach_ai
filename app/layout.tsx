import type { Metadata, Viewport } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'SafeReach AI — Women’s Safety & Emergency Navigation Platform',
  description:
    'Find real-time nearby safe places (police stations, hospitals, pharmacies), trigger instant WhatsApp emergency SOS with live GPS coordinates, and access tactical AI safety guidance.',
  keywords: [
    'womens safety',
    'safe places locator',
    'emergency SOS',
    'police stations nearby',
    'live location sharing',
    'AI safety assistant',
    'India women helpline 181',
    'emergency 112',
  ],
  authors: [{ name: 'SafeReach AI Team' }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#050508',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#050508] text-zinc-100 antialiased selection:bg-rose-500 selection:text-white relative">
        {/* Crisp & Bright Animated Background */}
        <div className="fixed inset-0 pointer-events-none -z-30 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/background.gif"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-85 filter brightness-110 saturate-125 contrast-110"
          />
        </div>

        {/* Diagonal Scanline / Hatch Texture Layer (as in the reference design) */}
        <div className="fixed inset-0 pointer-events-none -z-20 bg-diagonal-stripes"></div>

        {/* Smooth Vignette for Content Contrast */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-gradient-to-b from-black/40 via-transparent to-black/70"></div>

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
