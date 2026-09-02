'use client';

import React, { useEffect, useRef } from 'react';
import { Coordinates, SafePlace } from '@/types/places';
import 'leaflet/dist/leaflet.css';

interface SafeMapProps {
  center: Coordinates;
  userLocation: Coordinates | null;
  places: SafePlace[];
  selectedPlace: SafePlace | null;
  onSelectPlace: (place: SafePlace) => void;
  zoom?: number;
}

export default function SafeMap({
  center,
  userLocation,
  places,
  selectedPlace,
  onSelectPlace,
  zoom = 14,
}: SafeMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markersGroupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userMarkerRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      const L = await import('leaflet');

      if (!isMounted) return;

      if (!mapInstanceRef.current) {
        // Initialize Map
        const map = L.map(mapContainerRef.current, {
          center: [center.lat, center.lng],
          zoom,
          zoomControl: false,
          scrollWheelZoom: true,
        });

        // Add sleek CartoDB Dark Matter tiles
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 19,
        }).addTo(map);

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);
        markersGroupRef.current = markersLayer;
        mapInstanceRef.current = map;
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update center
  useEffect(() => {
    if (mapInstanceRef.current && center) {
      mapInstanceRef.current.flyTo([center.lat, center.lng], zoom, {
        duration: 1.2,
      });
    }
  }, [center, zoom]);

  // Update Markers
  useEffect(() => {
    const updateMarkers = async () => {
      if (!mapInstanceRef.current || !markersGroupRef.current) return;
      const L = await import('leaflet');

      const layer = markersGroupRef.current;
      layer.clearLayers();

      // Render User Location Marker if available
      if (userLocation) {
        const userHtml = `
          <div class="relative flex items-center justify-center">
            <div class="absolute w-10 h-10 bg-white/20 rounded-full animate-ping"></div>
            <div class="relative w-6 h-6 bg-white border-2 border-black rounded-full shadow-2xl flex items-center justify-center text-black">
              <div class="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
        `;
        const userIcon = L.divIcon({
          html: userHtml,
          className: 'custom-user-marker',
          iconSize: [36, 36],
          iconAnchor: [18, 18],
        });

        const uMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: userIcon,
          zIndexOffset: 1000,
        }).bindPopup(`
          <div style="font-family: system-ui, sans-serif; min-width: 160px; padding: 2px;">
            <div style="font-weight: 700; font-size: 11px; font-family: monospace; letter-spacing: 0.1em; color: #ededed; text-transform: uppercase; margin-bottom: 2px;">YOUR POSITION</div>
            <div style="font-size: 11px; font-family: monospace; color: #a1a1aa;">${userLocation.lat.toFixed(4)}° N, ${userLocation.lng.toFixed(4)}° E</div>
          </div>
        `);
        layer.addLayer(uMarker);
        userMarkerRef.current = uMarker;
      }

      // Render Safe Places Markers
      places.forEach((place) => {
        let tag = 'HAVEN';
        let dotColor = 'bg-white';

        if (place.type === 'transit') {
          tag = 'METRO';
          dotColor = 'bg-cyan-400';
        } else if (place.type === 'commercial') {
          tag = 'MALL';
          dotColor = 'bg-purple-400';
        } else if (place.type === 'police') {
          tag = 'POLICE';
          dotColor = 'bg-blue-400';
        } else if (place.type === 'hospital') {
          tag = 'HOSPITAL';
          dotColor = 'bg-rose-400';
        } else if (place.type === 'fuel_station') {
          tag = 'FUEL';
          dotColor = 'bg-amber-400';
        } else if (place.type === 'hotel') {
          tag = 'HOTEL';
          dotColor = 'bg-indigo-400';
        } else if (place.type === 'bank_atm') {
          tag = 'ATM';
          dotColor = 'bg-emerald-400';
        } else if (place.type === 'pharmacy') {
          tag = 'PHARMACY';
          dotColor = 'bg-emerald-400';
        } else if (place.type === 'fire_station') {
          tag = 'FIRE';
          dotColor = 'bg-orange-400';
        }

        const isSelected = selectedPlace?.id === place.id;
        const markerHtml = `
          <div class="relative group cursor-pointer transition-transform ${isSelected ? 'scale-125 z-50' : 'hover:scale-110'}">
            <div class="px-2 py-1 rounded-md bg-[#0a0a0f] border ${isSelected ? 'border-white bg-white text-black' : 'border-white/20 text-white'} shadow-xl flex items-center space-x-1 font-mono text-[9px] font-bold uppercase tracking-wider">
              <span class="w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-black' : dotColor}"></span>
              <span>${tag}</span>
            </div>
            <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 border-r border-b ${isSelected ? 'border-white bg-white' : 'border-white/20 bg-[#0a0a0f]'}"></div>
          </div>
        `;

        const icon = L.divIcon({
          html: markerHtml,
          className: 'custom-safe-place-marker',
          iconSize: [48, 28],
          iconAnchor: [24, 28],
          popupAnchor: [0, -28],
        });

        const marker = L.marker([place.lat, place.lng], { icon });

        const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; min-width: 200px; padding: 4px;">
            <div style="font-size: 9px; font-family: monospace; letter-spacing: 0.15em; color: #a1a1aa; text-transform: uppercase; margin-bottom: 3px;">
              ${tag} • ${place.distanceKm < 1 ? Math.round(place.distanceKm * 1000) + ' M' : place.distanceKm.toFixed(2) + ' KM'}
            </div>
            <div style="font-weight: 700; font-size: 13px; color: #ffffff; margin-bottom: 4px;">${place.name}</div>
            ${place.securityFeature ? `<div style="font-size: 10px; font-family: monospace; color: #34d399; margin-bottom: 6px;">${place.securityFeature}</div>` : ''}
            ${place.address ? `<div style="font-size: 11px; color: #a1a1aa; margin-bottom: 8px; line-height: 1.3;">${place.address}</div>` : ''}
            <a href="${directionsUrl}" target="_blank" rel="noopener noreferrer" style="display: block; text-align: center; background: #ffffff; color: #000000; padding: 6px 10px; border-radius: 8px; font-family: monospace; font-weight: 700; font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; text-decoration: none; margin-top: 4px;">
              Get Directions &rarr;
            </a>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('click', () => {
          onSelectPlace(place);
        });

        layer.addLayer(marker);
      });
    };

    updateMarkers();
  }, [places, selectedPlace, userLocation, onSelectPlace]);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#060609]">
      <div ref={mapContainerRef} className="w-full h-full z-10" />
    </div>
  );
}
