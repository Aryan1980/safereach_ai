'use client';

import React from 'react';
import { X, ShieldCheck, MapPin, Clock, Phone, Building, Info, AlertTriangle } from 'lucide-react';

interface ScoreExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ScoreExplanationModal({ isOpen, onClose }: ScoreExplanationModalProps) {
  if (!isOpen) return null;

  const pillars = [
    {
      title: '1. Facility Security & Public Footfall',
      weight: 'Max 35 Points',
      icon: ShieldCheck,
      description:
        'Higher scores for active law enforcement stations (police), guarded transit stations (metro with CISF/CCTV), 24/7 hospital emergency triage, and commercial centers with entry guards and active crowds.',
    },
    {
      title: '2. Proximity & Rapid Walking Reach',
      weight: 'Max 30 Points',
      icon: MapPin,
      description:
        'Calculated from your current GPS coordinates. Places within walking reach (< 500m / ~5 min) receive top points for fast emergency refuge.',
    },
    {
      title: '3. 24/7 Operating Hours & Illumination',
      weight: 'Max 15 Points',
      icon: Clock,
      description:
        'Facilities with verified 24/7 round-the-clock operation and illuminated forecourts (petrol pumps, emergency rooms, police outposts) receive full night-time accessibility points.',
    },
    {
      title: '4. Verified Contact & Operating Body',
      weight: 'Max 10 Points',
      icon: Phone,
      description:
        'Direct listed public telephone lines and verification by formal municipal or corporate operators (e.g., Delhi Police, DMRC, Apollo, Indian Oil) contribute to organizational reliability.',
    },
    {
      title: '5. Road Accessibility & Physical Entry',
      weight: 'Max 10 Points',
      icon: Building,
      description:
        'Locations situated directly on mapped main thoroughfares with step-free wheelchair physical accessibility receive full infrastructure verification points.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono">
      <div className="glass-panel rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl text-white relative border border-white/[0.14] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] tracking-widest2 uppercase text-zinc-500">TRANSPARENT METHODOLOGY</span>
            <h3 className="text-xl font-bold text-white tracking-tight font-sans">How Safe Score is Calculated</h3>
          </div>
        </div>

        {/* Introduction */}
        <p className="text-xs text-zinc-300 font-sans font-light leading-relaxed mb-6">
          Every Safe Score (0 - 100) is calculated <strong className="text-white">dynamically relative to your current live GPS position</strong> using real, verified infrastructure data from OpenStreetMap. We do not use arbitrary or simulated numbers.
        </p>

        {/* 5 Pillars */}
        <div className="space-y-3.5 mb-6">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div key={p.title} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h4 className="font-bold text-xs text-white uppercase tracking-wider">{p.title}</h4>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                    {p.weight}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 font-sans font-light pl-6 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Transparent Disclaimer */}
        <div className="bg-amber-500/10 border border-amber-500/25 rounded-xl p-4 text-xs text-amber-200 font-sans flex items-start space-x-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong className="font-mono uppercase font-bold text-amber-300">Safety Notice: </strong>
            Safe Scores are data-derived indicators designed to help users identify accessible, well-lit, and public facilities nearby. They do not constitute a legal guarantee of safety. In any emergency or active threat, immediately dial <strong className="text-white font-mono">112</strong> or activate your <strong className="text-white font-mono">Emergency SOS</strong>.
          </p>
        </div>

        {/* Close Button Footer */}
        <div className="mt-6 pt-4 border-t border-white/[0.06] flex justify-end">
          <button
            onClick={onClose}
            className="bg-white hover:bg-zinc-200 text-black font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
