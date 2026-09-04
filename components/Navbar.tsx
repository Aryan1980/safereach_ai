'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  X, 
  Radio, 
  PhoneCall, 
  AlertTriangle 
} from 'lucide-react';
import { getPrimaryContact, getLastKnownLocation } from '@/services/contactsStorage';
import { generateEmergencyPayload } from '@/services/emergencyMessage';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'active' | 'denied' | 'idle'>('idle');
  const [quickSosModal, setQuickSosModal] = useState(false);
  const [emergencyText, setEmergencyText] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      if (navigator.permissions && navigator.permissions.query) {
        navigator.permissions.query({ name: 'geolocation' }).then((result) => {
          if (result.state === 'granted') setGpsStatus('active');
          else if (result.state === 'denied') setGpsStatus('denied');
          else setGpsStatus('idle');

          result.onchange = () => {
            if (result.state === 'granted') setGpsStatus('active');
            else if (result.state === 'denied') setGpsStatus('denied');
            else setGpsStatus('idle');
          };
        }).catch(() => setGpsStatus('idle'));
      }
    }
  }, []);

  const handleQuickSosClick = () => {
    const contact = getPrimaryContact();
    const lastLoc = getLastKnownLocation();

    if (navigator.geolocation) {
      setGpsStatus('checking');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsStatus('active');
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
          };
          const payload = generateEmergencyPayload(coords, contact);
          setEmergencyText(payload.text);
          setWhatsappUrl(payload.whatsappUrl);
          setQuickSosModal(true);
        },
        () => {
          const payload = generateEmergencyPayload(lastLoc, contact);
          setEmergencyText(payload.text);
          setWhatsappUrl(payload.whatsappUrl);
          setQuickSosModal(true);
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    } else {
      const payload = generateEmergencyPayload(lastLoc, contact);
      setEmergencyText(payload.text);
      setWhatsappUrl(payload.whatsappUrl);
      setQuickSosModal(true);
    }
  };

  const navLinks = [
    { name: 'SAFE PLACES', href: '/safe-places' },
    { name: 'EMERGENCY', href: '/emergency' },
    { name: 'AI ASSISTANT', href: '/assistant' },
    { name: 'SAFETY TIPS', href: '/safety-tips' },
    { name: 'DASHBOARD', href: '/dashboard' },
    { name: 'ABOUT', href: '/about' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#06060c]/92 backdrop-blur-2xl border-b border-white/10 text-white shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2.5 group">
              <div className="w-7 h-7 rounded-lg bg-white flex items-center justify-center text-black font-black text-xs tracking-tighter group-hover:bg-zinc-200 transition-colors shadow-md">
                SR
              </div>
              <div className="flex items-center space-x-1.5 font-mono text-sm tracking-wider uppercase">
                <span className="font-extrabold text-white text-shadow-subtle">SAFEREACH</span>
                <span className="text-zinc-400 font-medium">/</span>
                <span className="text-zinc-200 text-xs font-semibold">AI</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3 font-mono text-[11px] tracking-widest text-zinc-200 uppercase">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      isActive
                        ? 'text-white font-bold bg-white/[0.12] border border-white/20 shadow-md'
                        : 'hover:text-white hover:bg-white/[0.06]'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Right Side Actions: GPS badge & SOS Trigger */}
            <div className="flex items-center space-x-3">
              {/* GPS status pill */}
              <div 
                className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full text-[10px] font-mono tracking-wider border bg-black/60 border-white/15 text-zinc-200 backdrop-blur-md"
              >
                <Radio className={`w-3 h-3 ${
                  gpsStatus === 'active' 
                    ? 'text-emerald-400 animate-pulse' 
                    : gpsStatus === 'denied' 
                    ? 'text-amber-400' 
                    : 'text-zinc-400'
                }`} />
                <span className="font-semibold">
                  {gpsStatus === 'active' ? 'GPS: SYNCED' : gpsStatus === 'denied' ? 'GPS: MANUAL' : 'GPS: READY'}
                </span>
              </div>

              {/* Quick SOS Trigger Button */}
              <button
                onClick={handleQuickSosClick}
                className="relative flex items-center space-x-2 bg-white hover:bg-zinc-200 text-black px-3.5 py-1.5 rounded-lg font-mono font-bold text-xs uppercase tracking-widest shadow-xl shadow-white/20 active:scale-95 transition-all"
              >
                <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse"></span>
                <span>SOS</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                aria-label="Toggle navigation menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#07070e]/98 px-5 pt-3 pb-6 space-y-1 font-mono text-xs tracking-widest backdrop-blur-2xl">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'text-white font-bold bg-white/[0.12] border border-white/20'
                      : 'text-zinc-200 hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <div className="pt-3 mt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] text-zinc-400 uppercase font-bold">Emergency Helpline:</span>
              <a
                href="tel:112"
                className="inline-flex items-center space-x-1.5 text-white font-bold text-xs"
              >
                <PhoneCall className="w-3 h-3 text-rose-400" />
                <span>DIAL 112</span>
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Quick SOS Modal */}
      {quickSosModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl text-white relative border border-white/20">
            <button
              onClick={() => setQuickSosModal(false)}
              className="absolute top-5 right-5 text-zinc-300 hover:text-white p-1 rounded-lg hover:bg-white/[0.08]"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-300 font-bold">RAPID ALERT</span>
                <h3 className="text-lg font-bold text-white tracking-tight">Emergency SOS Dispatch</h3>
              </div>
            </div>

            <div className="bg-black/80 border border-white/15 rounded-xl p-4 mb-5 text-xs text-zinc-100 font-mono whitespace-pre-wrap leading-relaxed">
              {emergencyText}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setQuickSosModal(false)}
                className="flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-black font-mono font-bold py-3 px-4 rounded-xl shadow-lg transition-all text-xs uppercase tracking-wider"
              >
                <span>Open in WhatsApp</span>
              </a>

              <a
                href="tel:112"
                className="flex items-center justify-center space-x-2 bg-zinc-900 hover:bg-zinc-800 text-white font-mono font-bold py-3 px-4 rounded-xl border border-white/20 transition-all text-xs uppercase tracking-wider"
              >
                <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                <span>Call 112 (Police)</span>
              </a>
            </div>

            <div className="mt-4 text-center">
              <Link
                href="/emergency"
                onClick={() => setQuickSosModal(false)}
                className="text-[11px] font-mono text-zinc-300 hover:text-white uppercase tracking-wider underline underline-offset-4"
              >
                Emergency Console &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
