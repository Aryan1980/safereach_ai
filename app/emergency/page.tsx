'use client';

import React, { useState, useEffect } from 'react';
import { 
  History, 
  ArrowUpRight
} from 'lucide-react';
import SOSButton from '@/components/Emergency/SOSButton';
import TrustedContacts from '@/components/Emergency/TrustedContacts';
import AudioSiren from '@/components/Emergency/AudioSiren';
import HelplineGrid from '@/components/Emergency/HelplineGrid';
import { Coordinates } from '@/types/places';
import { EmergencyLog } from '@/types/contact';
import { getEmergencyLogs, getLastKnownLocation } from '@/services/contactsStorage';

export default function EmergencyPage() {
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const [recentLogs, setRecentLogs] = useState<EmergencyLog[]>([]);

  useEffect(() => {
    const cached = getLastKnownLocation();
    if (cached) setCoords(cached);
    setRecentLogs(getEmergencyLogs());
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-zinc-100">
      {/* Top Banner with High-Contrast Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/15 pb-8">
        <div className="space-y-3">
          <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-200 font-bold block drop-shadow-sm">
            CRISIS CONSOLE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight text-shadow-hero">
            Emergency SOS &amp; Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-zinc-100 font-normal max-w-xl leading-relaxed text-shadow-subtle drop-shadow-sm">
            Rapid WhatsApp coordinate transmission, acoustic alarms, trusted contact circles, and national emergency lines.
          </p>
        </div>

        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center space-x-3 border border-white/15 font-mono text-xs shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-zinc-300 font-bold">SYSTEM:</span>
          <span className="text-white font-bold text-shadow-subtle">READY TO DISPATCH</span>
        </div>
      </div>

      {/* Main Grid: SOS Button & Trusted Contacts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Big SOS Action Trigger */}
        <div className="lg:col-span-5 space-y-6">
          <SOSButton
            currentCoords={coords}
            onLocationUpdate={(newCoords) => setCoords(newCoords)}
          />

          <AudioSiren />
        </div>

        {/* Right Column: Trusted Circle Registry */}
        <div className="lg:col-span-7 space-y-6">
          <TrustedContacts />
        </div>
      </div>

      {/* Direct Helplines Section */}
      <div className="space-y-6 pt-6 border-t border-white/15">
        <div className="space-y-1">
          <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-200 font-bold block">
            VERIFIED DIRECT TELEPHONY
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight text-shadow-subtle">Emergency Phone Network</h3>
        </div>
        <HelplineGrid />
      </div>

      {/* Recent Local SOS Logs */}
      {recentLogs.length > 0 && (
        <div className="glass-panel rounded-2xl p-6 border border-white/15 space-y-4">
          <div className="flex items-center space-x-2 text-white font-mono text-xs uppercase font-bold tracking-wider">
            <History className="w-4 h-4 text-emerald-400" />
            <span>Recent Device Emergency Transmissions</span>
          </div>

          <div className="divide-y divide-white/10 font-mono text-xs">
            {recentLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between gap-4">
                <div>
                  <span className="text-white font-bold">SOS ALERT ({log.contactName || 'CONTACT'})</span>
                  <span className="text-zinc-300 ml-2 font-normal">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {log.contactPhone && (
                    <span className="text-zinc-200 block text-[11px] mt-0.5">Target: {log.contactPhone}</span>
                  )}
                </div>
                {log.mapsUrl && (
                  <a
                    href={log.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:underline text-[11px] flex items-center space-x-1"
                  >
                    <span>Maps Pin</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
