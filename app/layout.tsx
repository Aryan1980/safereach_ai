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
  themeColor: '#0f172a',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 antialiased selection:bg-rose-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
