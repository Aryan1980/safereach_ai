'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Loader2, X } from 'lucide-react';
import { NominatimResult, Coordinates } from '@/types/places';
import { searchLocations } from '@/services/geocodingService';

interface LocationSearchProps {
  onLocationSelect: (coords: Coordinates, label: string) => void;
  onRequestCurrentLocation: () => void;
  isLoadingLocation?: boolean;
}

export default function LocationSearch({
  onLocationSelect,
  onRequestCurrentLocation,
  isLoadingLocation = false,
}: LocationSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchLocations(query);
        setSuggestions(results);
        setIsOpen(results.length > 0);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: NominatimResult) => {
    const lat = parseFloat(item.lat);
    const lng = parseFloat(item.lon);
    onLocationSelect({ lat, lng, address: item.display_name }, item.display_name);
    setQuery(item.display_name);
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative w-full font-mono">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search input */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-zinc-500">
            {isSearching ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Search className="w-4 h-4" />
            )}
          </div>

          <input
            type="text"
            placeholder="Search address, neighborhood, metro station, or landmark..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setIsOpen(true)}
            className="w-full bg-[#08080c] border border-white/[0.08] hover:border-white/20 focus:border-white/40 rounded-xl pl-11 pr-10 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all shadow-inner font-sans"
          />

          {query && (
            <button
              onClick={handleClear}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* GPS location button */}
        <button
          onClick={onRequestCurrentLocation}
          disabled={isLoadingLocation}
          className="flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 active:scale-95 text-black px-5 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all shrink-0 shadow-lg shadow-white/5"
        >
          {isLoadingLocation ? (
            <Loader2 className="w-4 h-4 animate-spin text-black" />
          ) : (
            <Navigation className="w-3.5 h-3.5 text-black" />
          )}
          <span>{isLoadingLocation ? 'ACQUIRING...' : 'USE MY GPS'}</span>
        </button>
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a0f] border border-white/[0.12] rounded-xl shadow-2xl z-50 overflow-hidden max-h-64 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              key={item.place_id}
              onClick={() => handleSelect(item)}
              className="w-full text-left px-4 py-3 hover:bg-white/[0.04] border-b border-white/[0.04] last:border-0 flex items-start space-x-3 transition-colors group"
            >
              <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5 group-hover:text-white transition-colors" />
              <div>
                <p className="text-xs font-mono font-bold text-white line-clamp-1">
                  {item.display_name.split(',')[0]}
                </p>
                <p className="text-[11px] text-zinc-400 font-sans line-clamp-1">{item.display_name}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
