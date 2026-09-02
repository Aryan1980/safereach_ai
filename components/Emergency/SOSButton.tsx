'use client';

import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Send, 
  Copy, 
  Check, 
  Share2, 
  PhoneCall, 
  ShieldAlert
} from 'lucide-react';
import { Coordinates } from '@/types/places';
import { TrustedContact } from '@/types/contact';
import { 
  getPrimaryContact, 
  getLastKnownLocation, 
  saveLastKnownLocation,
  logEmergencyEvent 
} from '@/services/contactsStorage';
import { 
  generateEmergencyPayload, 
  shareEmergencyAlert,
  GeneratedEmergencyMessage 
} from '@/services/emergencyMessage';
import { reverseGeocode } from '@/services/geocodingService';

interface SOSButtonProps {
  currentCoords?: Coordinates | null;
  onLocationUpdate?: (coords: Coordinates) => void;
}

export default function SOSButton({ currentCoords, onLocationUpdate }: SOSButtonProps) {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [primaryContact, setPrimaryContact] = useState<TrustedContact | null>(null);
  const [payload, setPayload] = useState<GeneratedEmergencyMessage | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [customNote, setCustomNote] = useState('');

  useEffect(() => {
    const contact = getPrimaryContact();
    setPrimaryContact(contact);
    const cached = currentCoords || getLastKnownLocation();
    const initialPayload = generateEmergencyPayload(cached, contact, customNote);
    setPayload(initialPayload);

    if (cached && !cached.address) {
      reverseGeocode(cached).then((addr) => {
        if (addr) {
          cached.address = addr;
          setPayload(generateEmergencyPayload(cached, contact, customNote));
        }
      });
    }
  }, [currentCoords, customNote]);

  const acquireAccurateLocation = (): Promise<Coordinates | null> => {
    return new Promise((resolve) => {
      if (typeof window === 'undefined' || !navigator.geolocation) {
        resolve(getLastKnownLocation());
        return;
      }

      setLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          setLoadingLocation(false);
          const coords: Coordinates = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            accuracy: pos.coords.accuracy,
            timestamp: pos.timestamp,
          };
          saveLastKnownLocation(coords);
          if (onLocationUpdate) onLocationUpdate(coords);

          const addr = await reverseGeocode(coords);
          if (addr) coords.address = addr;

          resolve(coords);
        },
        (err) => {
          console.warn('Geolocation acquisition error during SOS:', err);
          setLoadingLocation(false);
          resolve(getLastKnownLocation());
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 10000 }
      );
    });
  };

  const handleTriggerSOS = async () => {
    const contact = getPrimaryContact();
    setPrimaryContact(contact);

    const coords = await acquireAccurateLocation();
    const generated = generateEmergencyPayload(coords, contact, customNote);
    setPayload(generated);
    setActiveModal(true);

    if (coords && contact) {
      logEmergencyEvent({
        id: `alert_${Date.now()}`,
        timestamp: Date.now(),
        contactName: contact.name,
        contactPhone: contact.phone,
        lat: coords.lat,
        lng: coords.lng,
        mapsUrl: generated.mapsUrl,
        status: 'dispatched_whatsapp',
      });
    }
  };

  const handleCopyMessage = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleNativeShare = async () => {
    if (!payload) return;
    await shareEmergencyAlert(payload.text, 'SafeReach AI Emergency SOS Alert');
  };

  const updateNote = (text: string) => {
    setCustomNote(text);
    const cached = currentCoords || getLastKnownLocation();
    setPayload(generateEmergencyPayload(cached, primaryContact, text));
  };

  return (
    <>
      <div className="glass-panel rounded-3xl p-8 sm:p-10 text-center border border-white/[0.1] relative overflow-hidden shadow-2xl">
        {/* Ambient Subtle Radial Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/[0.03] rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-md mx-auto space-y-6">
          <div className="inline-flex items-center space-x-2 border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 rounded-full font-mono text-[10px] tracking-widest text-zinc-400 uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
            <span>CRISIS DISPATCH PROTOCOL</span>
          </div>

          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              One-Tap Emergency SOS
            </h2>
            <p className="text-xs text-zinc-400 font-light mt-2 leading-relaxed">
              Acquires instant live coordinates, compiles an emergency payload with a Google Maps pin, and prepares WhatsApp dispatch.
            </p>
          </div>

          {/* Futuristic Monochrome / Crimson Ring Trigger Button */}
          <div className="py-6 flex justify-center">
            <button
              onClick={handleTriggerSOS}
              disabled={loadingLocation}
              className="group relative w-44 h-44 sm:w-48 sm:h-48 rounded-full bg-black text-white font-mono font-bold tracking-widest2 shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center p-4 border border-white/20 hover:border-white/50"
            >
              {/* Outer pulsing ring */}
              <div className="absolute inset-0 rounded-full border border-white/10 animate-ping opacity-25"></div>
              <div className="absolute -inset-2 rounded-full border border-white/[0.04]"></div>

              <ShieldAlert className="w-8 h-8 mb-2 text-rose-500 group-hover:scale-110 transition-transform" />
              <span className="uppercase font-extrabold text-lg text-white">
                {loadingLocation ? 'LOCATING...' : 'DISPATCH SOS'}
              </span>
              <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
                WHATSAPP TRIGGER
              </span>
            </button>
          </div>

          {/* Target Contact Display Bar */}
          <div className="glass-panel rounded-xl p-3.5 flex items-center justify-between font-mono text-xs border border-white/[0.06]">
            <div className="flex items-center space-x-2 text-zinc-400">
              <span className="text-zinc-600 uppercase">RECIPIENT:</span>
              <span className="font-bold text-white uppercase">
                {primaryContact ? primaryContact.name : 'NO CONTACT SAVED'}
              </span>
            </div>
            {primaryContact && (
              <span className="text-zinc-400 text-[11px]">
                {primaryContact.phone}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Emergency Modal Dialog */}
      {activeModal && payload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="glass-panel rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl text-white relative border border-white/[0.14]">
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-white/[0.06] border border-white/[0.12] flex items-center justify-center text-white">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500">PAYLOAD COMPILED</span>
                  <h3 className="text-lg font-bold text-white tracking-tight">Emergency Dispatch Ready</h3>
                </div>
              </div>
            </div>

            {/* Custom note option */}
            <div className="mb-4 font-mono text-xs">
              <label className="block text-[11px] text-zinc-400 mb-1 uppercase tracking-wider">
                Optional Situation Note:
              </label>
              <input
                type="text"
                placeholder="e.g. In auto KA01AB1234, driver deviated from route"
                value={customNote}
                onChange={(e) => updateNote(e.target.value)}
                className="w-full bg-black/70 border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/30 font-sans"
              />
            </div>

            {/* Message Preview Box */}
            <div className="bg-black/80 border border-white/[0.08] rounded-xl p-4 mb-5 space-y-2 font-mono text-xs">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">
                PRE-FILLED WHATSAPP MESSAGE:
              </span>
              <p className="text-zinc-300 whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto font-light">
                {payload.text}
              </p>
            </div>

            {/* Primary Action Buttons */}
            <div className="space-y-3 font-mono text-xs">
              <a
                href={payload.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveModal(false)}
                className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-black font-bold py-3.5 px-5 rounded-xl uppercase tracking-wider shadow-lg transition-all"
              >
                <Send className="w-4 h-4" />
                <span>
                  {primaryContact ? `SEND VIA WHATSAPP (${primaryContact.name})` : 'OPEN WHATSAPP'}
                </span>
              </a>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyMessage}
                  className="flex items-center justify-center space-x-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-semibold py-2.5 px-3 rounded-xl border border-white/[0.08] transition-colors uppercase"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'COPIED' : 'COPY TEXT'}</span>
                </button>

                <button
                  onClick={handleNativeShare}
                  className="flex items-center justify-center space-x-1.5 bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 font-semibold py-2.5 px-3 rounded-xl border border-white/[0.08] transition-colors uppercase"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>SHARE / SMS</span>
                </button>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <a
                  href="tel:112"
                  className="flex items-center space-x-1.5 text-zinc-300 hover:text-white font-bold"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-rose-400" />
                  <span>CALL 112 (POLICE)</span>
                </a>

                <button
                  onClick={() => setActiveModal(false)}
                  className="text-zinc-500 hover:text-zinc-300 px-3 py-1 uppercase"
                >
                  DISMISS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
