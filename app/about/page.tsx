import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  MapPin, 
  Lock, 
  Bot, 
  PhoneCall, 
  Layers,
  ArrowUpRight
} from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20 space-y-16 text-zinc-100 selection:bg-white selection:text-black">
      {/* Header */}
      <div className="space-y-4 max-w-3xl">
        <div className="inline-flex items-center space-x-2 border border-white/[0.08] bg-white/[0.02] px-3.5 py-1.5 rounded-full text-[10px] font-mono tracking-widest2 text-zinc-400 uppercase">
          <Shield className="w-3.5 h-3.5 text-zinc-400" />
          <span>MISSION &amp; ARCHITECTURE</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.05]">
          About SafeReach AI
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 font-light leading-relaxed">
          SafeReach AI was engineered to eliminate friction in moments of crisis. By pairing decentralized OpenStreetMap geospatial intelligence with instant WhatsApp coordinate dispatch and Gemini AI situational reasoning, we provide rapid, private personal safety infrastructure.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
            <MapPin className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">01 // GEOSPATIAL</span>
          <h3 className="text-base font-mono font-bold text-white uppercase">Real-World Havens Only</h3>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            We query the global OpenStreetMap Overpass mesh in real time to locate verified police stations, 24/7 emergency rooms, and pharmacies within walking range.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
            <PhoneCall className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">02 // DISPATCH</span>
          <h3 className="text-base font-mono font-bold text-white uppercase">Instant WhatsApp SOS</h3>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            When triggered, our engine builds an exact Google Maps coordinate pin and opens a pre-addressed WhatsApp deep link for 1-tap transmission to your trusted contact.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">03 // ARTIFICIAL INTELLIGENCE</span>
          <h3 className="text-base font-mono font-bold text-white uppercase">Gemini Safety Companion</h3>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Trained with structured safety triage prompts to guide transit verification, stalking de-escalation, and solo travel defense, with automatic 112 prioritization in physical danger.
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-8 border border-white/[0.08] space-y-4">
          <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white flex items-center justify-center">
            <Lock className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">04 // PRIVACY</span>
          <h3 className="text-base font-mono font-bold text-white uppercase">Zero Cloud Logging</h3>
          <p className="text-xs text-zinc-400 font-light leading-relaxed">
            Your emergency contact list and location history remain 100% strictly inside your device&apos;s local storage. We maintain zero databases of your personal coordinates.
          </p>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="border-t border-white/[0.08] pt-12 space-y-6">
        <h2 className="text-xl font-mono font-bold text-white uppercase flex items-center space-x-2">
          <Layers className="w-4 h-4 text-zinc-400" />
          <span>Technology Stack</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
          <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-2">
            <span className="font-bold text-white uppercase block">Cartography</span>
            <p className="text-zinc-400 font-light leading-relaxed">
              OpenStreetMap Overpass QL, Nominatim Geocoding, CartoDB Dark Matter, and Leaflet.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-2">
            <span className="font-bold text-white uppercase block">AI Engine</span>
            <p className="text-zinc-400 font-light leading-relaxed">
              Google Gemini API (`@google/genai`) hosted on server-side Next.js routes.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-white/[0.08] space-y-2">
            <span className="font-bold text-white uppercase block">Audio &amp; Dispatch</span>
            <p className="text-zinc-400 font-light leading-relaxed">
              Web Audio API dual-oscillator acoustic synthesizer, WhatsApp universal deep links.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="glass-panel rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border border-white/[0.08]">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-white">Find Nearby Safe Havens</h3>
          <p className="text-xs text-zinc-400 font-light">
            Locate police stations and 24/7 hospitals around your current position.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <Link
            href="/safe-places"
            className="bg-white hover:bg-zinc-200 text-black font-bold px-5 py-3 rounded-xl uppercase tracking-wider transition-all flex items-center space-x-1.5"
          >
            <span>OPEN MAP MESH</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
