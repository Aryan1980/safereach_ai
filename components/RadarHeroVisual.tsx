'use client';

import React, { useState, useEffect } from 'react';
import { Shield, MapPin, Radio, Activity, Navigation, Lock } from 'lucide-react';
import Link from 'next/link';

export default function RadarHeroVisual() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [activeNode, setActiveNode] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setCoords({ lat: 28.6139, lng: 77.2090 }),
        { timeout: 5000 }
      );
    } else {
      setCoords({ lat: 28.6139, lng: 77.2090 });
    }

    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % 4);
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  const nodes = [
    { label: 'CENTRAL METRO STATION', dist: '0.35 KM', type: 'TRANSIT & GUARDS', angle: 45, radius: 110, icon: Shield },
    { label: 'METROPOLIS MALL & PLAZA', dist: '0.85 KM', type: 'CROWD & GUARDS', angle: 135, radius: 155, icon: MapPin },
    { label: 'POLICE HEADQUARTERS', dist: '0.45 KM', type: 'POLICE POST', angle: 225, radius: 95, icon: Radio },
    { label: '24/7 EMERGENCY HOSPITAL', dist: '1.20 KM', type: 'MEDICAL & SECURITY', angle: 315, radius: 175, icon: Navigation },
  ];

  return (
    <div className="relative w-full max-w-4xl mx-auto mt-8 mb-4">
      {/* Outer Glow Halo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent rounded-3xl blur-2xl -z-10 pointer-events-none"></div>

      {/* Main Glass Console Panel */}
      <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-white/[0.08] shadow-2xl relative overflow-hidden">
        {/* Top HUD Telemetry Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.06] pb-5 text-[11px] font-mono tracking-wider text-zinc-400 uppercase">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-zinc-200 font-semibold">RADAR TELEMETRY // ACTIVE</span>
          </div>

          <div className="hidden sm:flex items-center space-x-6">
            <div>
              <span className="text-zinc-500">COORDINATES: </span>
              <span className="text-zinc-300">
                {coords ? `${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E` : 'CALIBRATING...'}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">ENCRYPTION: </span>
              <span className="text-emerald-400">E2E LOCAL</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-white/[0.04] px-3 py-1 rounded-full border border-white/[0.06]">
            <Activity className="w-3.5 h-3.5 text-zinc-300" />
            <span className="text-zinc-300 text-[10px]">OSM MESH 2.0</span>
          </div>
        </div>

        {/* Center Futuristic Radar Graphic & Node Mesh */}
        <div className="relative h-[300px] sm:h-[360px] flex items-center justify-center my-4 overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-grid-subtle opacity-30"></div>

          {/* Concentric Range Rings */}
          <div className="absolute w-72 h-72 rounded-full border border-white/[0.04]"></div>
          <div className="absolute w-56 h-56 rounded-full border border-white/[0.06]"></div>
          <div className="absolute w-40 h-40 rounded-full border border-white/[0.08]"></div>
          <div className="absolute w-24 h-24 rounded-full border border-white/[0.12] bg-white/[0.01]"></div>

          {/* Crosshairs */}
          <div className="absolute w-full h-[1px] bg-white/[0.04]"></div>
          <div className="absolute h-full w-[1px] bg-white/[0.04]"></div>

          {/* Radar Sweeping Beam */}
          <div className="absolute w-72 h-72 rounded-full animate-radar-sweep pointer-events-none">
            <div className="w-1/2 h-1/2 bg-gradient-to-br from-white/[0.15] to-transparent rounded-tl-full"></div>
          </div>

          {/* Center User Beacon Node */}
          <div className="relative z-20 flex flex-col items-center justify-center">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-10 h-10 rounded-full bg-white/20 animate-ping"></div>
              <div className="w-5 h-5 rounded-full bg-white border-2 border-zinc-900 flex items-center justify-center shadow-lg shadow-white/30">
                <div className="w-1.5 h-1.5 rounded-full bg-zinc-950"></div>
              </div>
            </div>
            <span className="mt-2 text-[10px] font-mono tracking-widest text-white/90 bg-zinc-950/80 border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-md">
              YOU (ORIGIN)
            </span>
          </div>

          {/* Ambient Detected Safety Nodes */}
          {nodes.map((node, i) => {
            const rad = (node.angle * Math.PI) / 180;
            const x = Math.cos(rad) * node.radius;
            const y = Math.sin(rad) * node.radius;
            const isActive = activeNode === i;

            return (
              <div
                key={node.label}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className={`absolute z-10 flex items-center space-x-2 transition-all duration-500 cursor-pointer ${
                  isActive ? 'scale-110 opacity-100' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full border flex items-center justify-center ${
                    isActive
                      ? 'bg-white border-white shadow-lg shadow-white/50 animate-pulse'
                      : 'bg-zinc-800 border-white/30'
                  }`}
                ></div>
                <div className="hidden sm:block text-left bg-zinc-950/90 border border-white/10 px-2.5 py-1 rounded-lg backdrop-blur-md shadow-xl">
                  <p className="text-[10px] font-mono font-bold text-white tracking-wide">{node.label}</p>
                  <p className="text-[9px] font-mono text-zinc-400">{node.type} • {node.dist}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Interactive Terminal Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/[0.06] pt-5 text-xs text-zinc-400">
          <div className="flex items-center space-x-3 text-[11px] font-mono">
            <Lock className="w-3.5 h-3.5 text-zinc-500" />
            <span>Guarded transit hubs, commercial centers, police posts &amp; 24/7 havens.</span>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              href="/safe-places"
              className="text-xs font-mono font-semibold text-white hover:text-zinc-300 transition-colors flex items-center space-x-1 underline underline-offset-4"
            >
              <span>EXPLORE LIVE MESH</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
