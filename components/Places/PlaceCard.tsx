'use client';

import React from 'react';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  Clock, 
  ArrowUpRight,
  ShieldCheck,
  Users,
  Building,
  Flame,
  Zap,
  Hotel
} from 'lucide-react';
import { SafePlace, SafePlaceType } from '@/types/places';

interface PlaceCardProps {
  place: SafePlace;
  onSelect?: (place: SafePlace) => void;
  isSelected?: boolean;
}

export default function PlaceCard({ place, onSelect, isSelected }: PlaceCardProps) {
  const getTypeMeta = (type: SafePlaceType) => {
    switch (type) {
      case 'transit':
        return { label: 'METRO / TRANSIT', icon: Users, badgeStyle: 'border-cyan-500/30 text-cyan-300 bg-cyan-500/10' };
      case 'commercial':
        return { label: 'MALL / STORE', icon: Building, badgeStyle: 'border-purple-500/30 text-purple-300 bg-purple-500/10' };
      case 'police':
        return { label: 'POLICE OUTPOST', icon: ShieldCheck, badgeStyle: 'border-blue-500/30 text-blue-300 bg-blue-500/10' };
      case 'hospital':
        return { label: 'HOSPITAL / CLINIC', icon: ShieldCheck, badgeStyle: 'border-rose-500/30 text-rose-300 bg-rose-500/10' };
      case 'fuel_station':
        return { label: '24/7 FUEL STATION', icon: Zap, badgeStyle: 'border-amber-500/30 text-amber-300 bg-amber-500/10' };
      case 'hotel':
        return { label: 'HOTEL LOBBY', icon: Hotel, badgeStyle: 'border-indigo-500/30 text-indigo-300 bg-indigo-500/10' };
      case 'bank_atm':
        return { label: 'BANK / ATM', icon: ShieldCheck, badgeStyle: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' };
      case 'pharmacy':
        return { label: 'PHARMACY', icon: ShieldCheck, badgeStyle: 'border-emerald-500/30 text-emerald-300 bg-emerald-500/10' };
      case 'fire_station':
        return { label: 'FIRE & RESCUE', icon: Flame, badgeStyle: 'border-orange-500/30 text-orange-300 bg-orange-500/10' };
      default:
        return { label: 'SAFE HAVEN', icon: ShieldCheck, badgeStyle: 'border-white/20 text-zinc-300 bg-white/[0.04]' };
    }
  };

  const meta = getTypeMeta(place.type);
  const googleMapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;

  return (
    <div
      onClick={() => onSelect && onSelect(place)}
      className={`glass-panel rounded-2xl p-5 transition-all cursor-pointer border flex flex-col justify-between ${
        isSelected
          ? 'border-white/40 bg-white/[0.06] shadow-xl ring-1 ring-white/20'
          : 'border-white/[0.07] hover:border-white/20 hover:bg-white/[0.03]'
      }`}
    >
      <div className="space-y-3">
        {/* Top Header: Category Tag + Distance */}
        <div className="flex items-center justify-between gap-2 font-mono text-[10px] tracking-wider">
          <div className="flex items-center space-x-2">
            <span className={`px-2.5 py-0.5 rounded-full border font-semibold uppercase ${meta.badgeStyle}`}>
              {meta.label}
            </span>
            {place.is24x7 && (
              <span className="text-emerald-400 font-bold">
                24/7 OPEN
              </span>
            )}
          </div>

          <div className="flex items-center space-x-1 text-white font-bold bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 rounded-md">
            <Navigation className="w-3 h-3" />
            <span>
              {place.distanceKm < 1
                ? `${Math.round(place.distanceKm * 1000)} M`
                : `${place.distanceKm.toFixed(2)} KM`}
            </span>
          </div>
        </div>

        {/* Place Title */}
        <div>
          <h4 className="font-bold text-white text-sm sm:text-base leading-snug line-clamp-2">
            {place.name}
          </h4>
          {place.operator && (
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5 uppercase">{place.operator}</p>
          )}
        </div>

        {/* Security & Public Presence Banner */}
        {place.securityFeature && (
          <div className="flex items-center space-x-1.5 bg-white/[0.03] border border-white/[0.06] px-2.5 py-1.5 rounded-lg text-[11px] font-mono text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">{place.securityFeature}</span>
          </div>
        )}

        {/* Address */}
        {place.address && (
          <div className="flex items-start space-x-2 text-xs text-zinc-400">
            <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0 mt-0.5" />
            <span className="line-clamp-2 font-light leading-relaxed">{place.address}</span>
          </div>
        )}

        {/* Metadata Details */}
        {place.openingHours && (
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-500">
            <Clock className="w-3.5 h-3.5 text-zinc-600" />
            <span>{place.openingHours}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-5 pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2 font-mono text-xs">
        {place.phone ? (
          <a
            href={`tel:${place.phone}`}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/[0.08] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>CALL</span>
          </a>
        ) : (
          <span className="text-[10px] font-mono text-zinc-600 uppercase">OSM VERIFIED</span>
        )}

        <a
          href={googleMapsDirectionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex-1 flex items-center justify-center space-x-1.5 py-2 px-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold uppercase tracking-wider transition-all"
        >
          <span>DIRECTIONS</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
