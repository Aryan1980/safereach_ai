'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ArrowUpRight, 
  Send,
  Radio
} from 'lucide-react';
import { Coordinates } from '@/types/places';
import { TrustedContact } from '@/types/contact';
import { 
  getPrimaryContact, 
  getLastKnownLocation,
  saveLastKnownLocation 
} from '@/services/contactsStorage';
import { reverseGeocode } from '@/services/geocodingService';
import HelplineGrid from '@/components/Emergency/HelplineGrid';

export default function DashboardPage() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [primaryContact, setPrimaryContact] = useState<TrustedContact | null>(null);
  const [gpsStatus, setGpsStatus] = useState<'checking' | 'active' | 'denied' | 'idle'>('checking');

  useEffect(() => {
    const cached = getLastKnownLocation();
    if (cached) {
      setCoords(cached);
      if (cached.address) setAddress(cached.address);
    }

    setPrimaryContact(getPrimaryContact());

    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setGpsStatus('active');
          const newCoords: Coordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };
          setCoords(newCoords);
          saveLastKnownLocation(newCoords);

          const addr = await reverseGeocode(newCoords);
          if (addr) {
            setAddress(addr);
            newCoords.address = addr;
            saveLastKnownLocation(newCoords);
          }
        },
        (err) => {
          if (err.code === 1) setGpsStatus('denied');
          else setGpsStatus('idle');
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setGpsStatus('idle');
    }
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-zinc-100">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            TELEMETRY &amp; READINESS
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Safety Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
            Real-time status of your GPS signal, SOS target, verified safe havens, and emergency dialers.
          </p>
        </div>

        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center space-x-3 border border-white/[0.08] font-mono text-xs">
          <Radio className={`w-3.5 h-3.5 ${gpsStatus === 'active' ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
          <span className="text-zinc-500 uppercase">GPS:</span>
          <span className="text-white font-bold">
            {gpsStatus === 'active' ? 'CALIBRATED' : gpsStatus === 'denied' ? 'MANUAL SEARCH' : 'ACQUIRING'}
          </span>
        </div>
      </div>

      {/* 3 Large Telemetry Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: GPS Coordinates */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/[0.08] space-y-6">
          <div className="space-y-3 font-mono">
            <span className="text-[10px] tracking-widest2 uppercase text-zinc-500 block">
              01 // LIVE POSITION
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans line-clamp-2">
              {address ? address.split(',')[0] : (coords ? `${coords.lat.toFixed(4)}°, ${coords.lng.toFixed(4)}°` : 'CALIBRATING')}
            </div>
            <p className="text-xs text-zinc-400 font-light font-sans line-clamp-2">
              {address || 'Awaiting live coordinate fix from browser GPS sensor.'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <Link
              href="/safe-places"
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-all"
            >
              <span>SCAN SAFE HAVENS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 2: SOS Recipient */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/[0.08] space-y-6">
          <div className="space-y-3 font-mono">
            <span className="text-[10px] tracking-widest2 uppercase text-zinc-500 block">
              02 // SOS RECIPIENT
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              {primaryContact ? primaryContact.name : 'UNCONFIGURED'}
            </div>
            <p className="text-xs text-zinc-400 font-light font-sans">
              {primaryContact ? `Direct target: ${primaryContact.phone}` : 'Configure family or partner for 1-tap WhatsApp alert.'}
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <Link
              href="/emergency"
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-all"
            >
              <span>{primaryContact ? 'MANAGE CONTACTS' : 'ADD CONTACT'}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Card 3: AI Safety Advisor */}
        <div className="glass-panel rounded-3xl p-8 flex flex-col justify-between border border-white/[0.08] space-y-6">
          <div className="space-y-3 font-mono">
            <span className="text-[10px] tracking-widest2 uppercase text-zinc-500 block">
              03 // AI ASSISTANT
            </span>
            <div className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-sans">
              ONLINE &amp; READY
            </div>
            <p className="text-xs text-zinc-400 font-light font-sans">
              Pre-loaded with cab verification checks, stalking defenses, and de-escalation models.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06]">
            <Link
              href="/assistant"
              className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl font-mono text-xs font-bold uppercase tracking-wider bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] transition-all"
            >
              <span>OPEN CONSOLE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick SOS Trigger Strip */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-white/[0.12] relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            RAPID ACTION
          </span>
          <h3 className="text-2xl font-bold text-white tracking-tight">Need Immediate Assistance?</h3>
          <p className="text-xs text-zinc-400 font-light">
            Transmit pre-filled WhatsApp emergency coordinates or dial national law enforcement.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 font-mono text-xs">
          <Link
            href="/emergency"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-black font-bold py-3.5 px-6 rounded-xl uppercase tracking-wider transition-all shadow-xl shadow-white/5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>TRIGGER SOS</span>
          </Link>

          <a
            href="tel:112"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-black hover:bg-zinc-900 text-white border border-white/20 font-bold py-3.5 px-6 rounded-xl uppercase tracking-wider transition-all"
          >
            <span>CALL 112</span>
          </a>
        </div>
      </div>

      {/* Direct Helplines Section */}
      <div className="space-y-6 pt-4 border-t border-white/[0.08]">
        <div className="space-y-1">
          <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            VERIFIED DIRECT TELEPHONY
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">Emergency Phone Network</h3>
        </div>
        <HelplineGrid />
      </div>
    </div>
  );
}
