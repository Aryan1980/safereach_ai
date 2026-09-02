'use client';

import React from 'react';
import { PlaceCategoryFilter } from '@/types/places';

interface PlaceFilterProps {
  selectedFilter: PlaceCategoryFilter;
  onFilterChange: (filter: PlaceCategoryFilter) => void;
  counts: {
    all: number;
    transit: number;
    commercial: number;
    police: number;
    hospital: number;
    fuel_station: number;
    hotel: number;
    pharmacy: number;
    fire_station: number;
  };
}

export default function PlaceFilter({ selectedFilter, onFilterChange, counts }: PlaceFilterProps) {
  const tabs: Array<{
    id: PlaceCategoryFilter;
    label: string;
    count: number;
  }> = [
    { id: 'all', label: 'ALL HAVENS', count: counts.all },
    { id: 'transit', label: 'METRO & TRANSIT', count: counts.transit },
    { id: 'commercial', label: 'MALLS & STORES', count: counts.commercial },
    { id: 'police', label: 'POLICE STATIONS', count: counts.police },
    { id: 'hospital', label: 'HOSPITALS & CARE', count: counts.hospital },
    { id: 'fuel_station', label: '24/7 FUEL STATIONS', count: counts.fuel_station },
    { id: 'hotel', label: 'HOTELS & LOBBIES', count: counts.hotel },
    { id: 'pharmacy', label: 'PHARMACIES', count: counts.pharmacy },
    { id: 'fire_station', label: 'FIRE STATIONS', count: counts.fire_station },
  ];

  return (
    <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none font-mono">
      {tabs.map((tab) => {
        const isActive = selectedFilter === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onFilterChange(tab.id)}
            className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-[11px] tracking-wider font-bold whitespace-nowrap transition-all border shrink-0 uppercase ${
              isActive
                ? 'bg-white text-black border-white shadow-lg shadow-white/5'
                : 'bg-white/[0.02] text-zinc-400 border-white/[0.07] hover:bg-white/[0.05] hover:text-white'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                isActive ? 'bg-zinc-200 text-black' : 'bg-white/[0.06] text-zinc-400'
              }`}
            >
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
