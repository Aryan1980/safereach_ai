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
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            CRISIS CONSOLE
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Emergency SOS &amp; Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
            Rapid WhatsApp coordinate transmission, acoustic alarms, trusted contact circles, and national emergency lines.
          </p>
        </div>

        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center space-x-3 border border-white/[0.08] font-mono text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-zinc-500">SYSTEM:</span>
          <span className="text-white font-bold">READY TO DISPATCH</span>
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

        {/* Right Column: Trusted Contacts Manager & Fast Direct Helpline */}
        <div className="lg:col-span-7 space-y-8">
          <TrustedContacts />

          {/* Direct Dial Helplines */}
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-mono tracking-widest2 uppercase text-zinc-500 block">
                NATIONAL HELPLINES
              </span>
              <h3 className="text-xl font-bold text-white tracking-tight">
                One-Touch Emergency Dialing
              </h3>
            </div>
            <HelplineGrid />
          </div>
        </div>
      </div>

      {/* Recent Alerts Log if available */}
      {recentLogs.length > 0 && (
        <div className="glass-panel rounded-3xl p-6 sm:p-8 space-y-4 border border-white/[0.08]">
          <div className="flex items-center space-x-2 text-white font-mono">
            <History className="w-4 h-4 text-zinc-400" />
            <span className="text-xs uppercase tracking-wider font-bold">Dispatch History on This Node</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300 font-mono">
              <thead className="border-b border-white/[0.06] text-zinc-500 text-[10px] uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">TIMESTAMP</th>
                  <th className="py-3 px-4">RECIPIENT</th>
                  <th className="py-3 px-4">PHONE</th>
                  <th className="py-3 px-4">COORDINATES</th>
                  <th className="py-3 px-4 text-right">PAYLOAD PIN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentLogs.slice(0, 5).map((log) => (
                  <tr key={log.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4 text-zinc-400">
                      {new Date(log.timestamp).toLocaleString([], {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-4 font-bold text-white uppercase">{log.contactName}</td>
                    <td className="py-3 px-4 text-zinc-300">{log.contactPhone}</td>
                    <td className="py-3 px-4 text-zinc-400">
                      {log.lat.toFixed(4)}°, {log.lng.toFixed(4)}°
                    </td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={log.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white hover:underline inline-flex items-center space-x-1 uppercase text-[11px]"
                      >
                        <span>VIEW PIN</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
