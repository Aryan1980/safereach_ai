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
        {/* Ambient Animated GIF Background */}
        <div className="fixed inset-0 pointer-events-none -z-30 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/background.gif"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover opacity-25 mix-blend-screen filter saturate-150 contrast-125"
          />
        </div>

        {/* Dark Vignette & Mesh Overlays for Premium Readability */}
        <div className="fixed inset-0 pointer-events-none -z-20 bg-gradient-to-b from-[#050508]/85 via-[#050508]/75 to-[#050508]/95 backdrop-blur-[2px]"></div>
        <div className="fixed inset-0 pointer-events-none -z-10 bg-grid-subtle opacity-40"></div>

        <Navbar />
        <main className="flex-1 relative z-10">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
