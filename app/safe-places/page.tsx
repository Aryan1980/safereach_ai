'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { 
  AlertCircle, 
  Loader2, 
  RefreshCw, 
  SlidersHorizontal,
  Compass,
  MapPin,
  Info,
  Map as MapIcon,
  List as ListIcon
} from 'lucide-react';
import { Coordinates, SafePlace, PlaceCategoryFilter } from '@/types/places';
import { fetchNearbySafePlaces } from '@/services/overpassService';
import { reverseGeocode } from '@/services/geocodingService';
import { saveLastKnownLocation, getLastKnownLocation } from '@/services/contactsStorage';
import PlaceCard from '@/components/Places/PlaceCard';
import PlaceFilter from '@/components/Places/PlaceFilter';
import LocationSearch from '@/components/Map/LocationSearch';
import ScoreExplanationModal from '@/components/Places/ScoreExplanationModal';

// Dynamically import Leaflet Map to prevent SSR issues
const SafeMap = dynamic(() => import('@/components/Map/SafeMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[420px] bg-[#07070a] border border-white/[0.08] rounded-2xl flex flex-col items-center justify-center text-zinc-400 space-y-3 font-mono">
      <Loader2 className="w-6 h-6 animate-spin text-white" />
      <span className="text-[11px] tracking-widest uppercase">INITIALIZING MAP MESH...</span>
    </div>
  ),
});

export default function SafePlacesPage() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [mapCenter, setMapCenter] = useState<Coordinates | null>(null);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  
  const [places, setPlaces] = useState<SafePlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<SafePlace | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<PlaceCategoryFilter>('all');
  
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'error' | 'idle'>('prompt');
  const [isLoadingLocation, setIsLoadingLocation] = useState<boolean>(true);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [radiusMeters, setRadiusMeters] = useState<number>(5000);
  const [mobileViewTab, setMobileViewTab] = useState<'map' | 'list'>('map');
  const [isScoreModalOpen, setIsScoreModalOpen] = useState(false);

  const loadPlacesForCoords = useCallback(async (coords: Coordinates, radius: number = 5000) => {
    setIsLoadingPlaces(true);
    setErrorMessage(null);

    try {
      let results: SafePlace[] = [];
      try {
        const res = await fetch('/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ lat: coords.lat, lng: coords.lng, radius }),
        });
        if (res.ok) {
          const data = await res.json();
          results = data.places || [];
        } else {
          throw new Error('API route fallback');
        }
      } catch {
        results = await fetchNearbySafePlaces(coords, radius);
      }

      setPlaces(results);
    } catch (err: unknown) {
      console.error('Failed to load nearby safe places:', err);
      setErrorMessage('Unable to retrieve places from map servers. Please check your connection or search for a specific landmark.');
    } finally {
      setIsLoadingPlaces(false);
    }
  }, []);

  const requestCurrentLocation = useCallback(() => {
    if (typeof window === 'undefined' || !('geolocation' in navigator)) {
      setIsLoadingLocation(false);
      setPermissionState('error');
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setIsLoadingLocation(false);
        setPermissionState('granted');
        const coords: Coordinates = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          timestamp: pos.timestamp,
        };

        setUserLocation(coords);
        setMapCenter(coords);
        saveLastKnownLocation(coords);

        reverseGeocode(coords).then((addr) => {
          if (addr) {
            setCurrentAddress(addr);
            coords.address = addr;
            saveLastKnownLocation(coords);
          }
        });

        loadPlacesForCoords(coords, radiusMeters);
      },
      (err) => {
        setIsLoadingLocation(false);
        if (err.code === 1) {
          setPermissionState('denied');
        } else {
          setPermissionState('error');
          setErrorMessage('Unable to obtain live GPS fix. Please ensure location services are enabled on your device, or search manually below.');
        }

        const cached = getLastKnownLocation();
        if (cached) {
          setMapCenter(cached);
          setUserLocation(cached);
          if (cached.address) setCurrentAddress(cached.address);
          loadPlacesForCoords(cached, radiusMeters);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [loadPlacesForCoords, radiusMeters]);

  useEffect(() => {
    const cached = getLastKnownLocation();
    if (cached) {
      setMapCenter(cached);
      setUserLocation(cached);
      if (cached.address) setCurrentAddress(cached.address);
      loadPlacesForCoords(cached, radiusMeters);
    }

    requestCurrentLocation();
  }, [loadPlacesForCoords, radiusMeters, requestCurrentLocation]);

  const handleManualLocationSelect = (coords: Coordinates, label: string) => {
    setMapCenter(coords);
    setUserLocation(coords);
    setCurrentAddress(label);
    saveLastKnownLocation({ ...coords, address: label });
    loadPlacesForCoords(coords, radiusMeters);
  };

  const filteredPlaces = places.filter((p) => {
    if (selectedFilter === 'all') return true;
    return p.type === selectedFilter;
  });

  const filterCounts = {
    all: places.length,
    transit: places.filter((p) => p.type === 'transit').length,
    commercial: places.filter((p) => p.type === 'commercial').length,
    police: places.filter((p) => p.type === 'police').length,
    hospital: places.filter((p) => p.type === 'hospital').length,
    fuel_station: places.filter((p) => p.type === 'fuel_station').length,
    hotel: places.filter((p) => p.type === 'hotel').length,
    pharmacy: places.filter((p) => p.type === 'pharmacy').length,
    fire_station: places.filter((p) => p.type === 'fire_station').length,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-zinc-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-500 block">
              RADAR DISCOVERY
            </span>
            <span className="text-zinc-600 font-mono text-[11px]">•</span>
            <button
              onClick={() => setIsScoreModalOpen(true)}
              className="text-[11px] font-mono text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 underline underline-offset-4"
            >
              <Info className="w-3.5 h-3.5" />
              <span>How Safe Score is Calculated</span>
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Safe Place Locator
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
            Real-time geospatial discovery of safe havens with transparent, data-backed Safe Scores based on facility security, crowd footfall, and live proximity.
          </p>
        </div>

        {/* Current Location Badge */}
        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center space-x-3 border border-white/[0.08] font-mono text-xs">
          <span className={`w-2 h-2 rounded-full ${userLocation ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></span>
          <span className="text-zinc-500">ORIGIN:</span>
          <span className="text-white font-bold max-w-[200px] truncate">
            {currentAddress ? currentAddress : mapCenter ? `${mapCenter.lat.toFixed(4)}°, ${mapCenter.lng.toFixed(4)}°` : 'ACQUIRING GPS...'}
          </span>
        </div>
      </div>

      {/* Permission Denied Notice */}
      {permissionState === 'denied' && (
        <div className="glass-panel rounded-2xl p-6 border border-amber-500/30 text-xs space-y-3">
          <div className="flex items-center space-x-2 font-mono font-bold text-amber-400 uppercase tracking-wider">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Browser Location Access Needed</span>
          </div>
          <p className="text-zinc-300 font-light leading-relaxed">
            SafeReach AI needs your device location to calculate distances and safe scores for places directly around you.
            If your browser blocked location, please allow Location access, or search your city/neighborhood below.
          </p>
          <div className="pt-1">
            <button
              onClick={requestCurrentLocation}
              className="inline-flex items-center space-x-1.5 bg-white text-black px-4 py-2 rounded-xl font-mono font-bold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Allow My GPS Location</span>
            </button>
          </div>
        </div>
      )}

      {/* Location Acquisition Loading State for First-Time Users */}
      {isLoadingLocation && !mapCenter && (
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/[0.08] space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-white mx-auto" />
          <div className="space-y-1 font-mono">
            <h3 className="font-bold text-base text-white uppercase tracking-wider">Acquiring Your Live GPS Position...</h3>
            <p className="text-xs text-zinc-400 font-sans font-light max-w-sm mx-auto">
              Please click &quot;Allow&quot; when prompted by your browser to locate safe havens near your exact location.
            </p>
          </div>
        </div>
      )}

      {/* Search & GPS Bar */}
      <LocationSearch
        onLocationSelect={handleManualLocationSelect}
        onRequestCurrentLocation={requestCurrentLocation}
        isLoadingLocation={isLoadingLocation}
      />

      {/* If mapCenter is available, show the full Map & List interface */}
      {mapCenter ? (
        <>
          {/* Filter Tabs & Radius Control */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <PlaceFilter
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
              counts={filterCounts}
            />

            <div className="flex items-center space-x-3 self-end sm:self-auto font-mono text-xs">
              {/* Mobile Map / List toggle */}
              <div className="flex lg:hidden glass-panel rounded-xl p-1 border border-white/[0.08]">
                <button
                  onClick={() => setMobileViewTab('map')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    mobileViewTab === 'map' ? 'bg-white text-black' : 'text-zinc-400'
                  }`}
                >
                  <MapIcon className="w-3.5 h-3.5" />
                  <span>MAP</span>
                </button>
                <button
                  onClick={() => setMobileViewTab('list')}
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                    mobileViewTab === 'list' ? 'bg-white text-black' : 'text-zinc-400'
                  }`}
                >
                  <ListIcon className="w-3.5 h-3.5" />
                  <span>LIST ({filteredPlaces.length})</span>
                </button>
              </div>

              <div className="hidden sm:flex items-center space-x-2 text-[11px] text-zinc-400 glass-panel px-3 py-1.5 rounded-xl border border-white/[0.08]">
                <SlidersHorizontal className="w-3 h-3 text-zinc-500" />
                <span className="uppercase text-zinc-500">Radius:</span>
                <select
                  value={radiusMeters}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    setRadiusMeters(r);
                    loadPlacesForCoords(mapCenter, r);
                  }}
                  className="bg-black border border-white/[0.12] text-white rounded-md px-2 py-0.5 text-xs focus:outline-none font-mono"
                >
                  <option value="3000">3 KM</option>
                  <option value="5000">5 KM</option>
                  <option value="8000">8 KM</option>
                  <option value="12000">12 KM</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Layout: Map + Places List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Map Container */}
            <div
              className={`lg:col-span-7 h-[440px] sm:h-[540px] lg:h-[700px] sticky top-24 ${
                mobileViewTab === 'list' ? 'hidden lg:block' : 'block'
              }`}
            >
              <SafeMap
                center={mapCenter}
                userLocation={userLocation}
                places={filteredPlaces}
                selectedPlace={selectedPlace}
                onSelectPlace={(place) => setSelectedPlace(place)}
                zoom={14}
              />
            </div>

            {/* Places List Container */}
            <div
              className={`lg:col-span-5 space-y-4 ${
                mobileViewTab === 'map' ? 'hidden lg:block' : 'block'
              }`}
            >
              <div className="flex items-center justify-between font-mono text-[11px] text-zinc-500 uppercase tracking-wider">
                <span>{filteredPlaces.length} VERIFIED HAVENS</span>
                {isLoadingPlaces && (
                  <div className="flex items-center space-x-1.5 text-white">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>CALCULATING SCORES...</span>
                  </div>
                )}
              </div>

              {/* Error notice */}
              {errorMessage && (
                <div className="glass-panel border border-rose-500/30 text-rose-300 p-4 rounded-xl text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* List or Empty State */}
              {isLoadingPlaces && places.length === 0 ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((n) => (
                    <div key={n} className="glass-panel rounded-2xl p-5 border border-white/[0.06] animate-pulse space-y-3">
                      <div className="h-3 bg-white/[0.06] rounded w-1/4"></div>
                      <div className="h-5 bg-white/[0.06] rounded w-3/4"></div>
                      <div className="h-3 bg-white/[0.06] rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : filteredPlaces.length === 0 ? (
                <div className="glass-panel rounded-2xl p-10 text-center space-y-4 border border-white/[0.08]">
                  <div className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-400 mx-auto">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 font-mono">
                    <h4 className="font-bold text-white text-sm uppercase">No Havens In Current Filter</h4>
                    <p className="text-xs text-zinc-500 max-w-xs mx-auto font-sans font-light">
                      Select &quot;ALL HAVENS&quot; or expand the radius parameter to see more locations.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFilter('all');
                    }}
                    className="inline-flex items-center space-x-1.5 bg-white hover:bg-zinc-200 text-black font-mono font-bold text-xs uppercase px-4 py-2.5 rounded-xl transition-all"
                  >
                    <span>SHOW ALL HAVENS</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-[660px] overflow-y-auto pr-1">
                  {filteredPlaces.map((place) => (
                    <PlaceCard
                      key={place.id}
                      place={place}
                      isSelected={selectedPlace?.id === place.id}
                      onOpenScoreExplanation={() => setIsScoreModalOpen(true)}
                      onSelect={(p) => {
                        setSelectedPlace(p);
                        setMapCenter({ lat: p.lat, lng: p.lng });
                        if (window.innerWidth < 1024) {
                          setMobileViewTab('map');
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      ) : !isLoadingLocation ? (
        /* Prompt user to search or grant GPS */
        <div className="glass-panel rounded-3xl p-12 text-center border border-white/[0.08] space-y-4">
          <MapPin className="w-8 h-8 text-zinc-400 mx-auto" />
          <div className="space-y-1 font-mono">
            <h3 className="font-bold text-base text-white uppercase tracking-wider">Search Any Location to Begin</h3>
            <p className="text-xs text-zinc-400 font-sans font-light max-w-sm mx-auto">
              Type your locality, street, or landmark in the search box above to discover nearby safe havens and calculate live Safe Scores.
            </p>
          </div>
        </div>
      ) : null}

      {/* Methodology Modal */}
      <ScoreExplanationModal
        isOpen={isScoreModalOpen}
        onClose={() => setIsScoreModalOpen(false)}
      />
    </div>
  );
}
