import React from 'react';
import Link from 'next/link';
import { 
  Shield, 
  MapPin, 
  Bot, 
  ArrowUpRight, 
  Share2
} from 'lucide-react';
import RadarHeroVisual from '@/components/RadarHeroVisual';
import HelplineGrid from '@/components/Emergency/HelplineGrid';

export default function HomePage() {
  const capabilities = [
    {
      label: 'SAFE PLACES',
      description: 'Find nearby police stations, hospitals, pharmacies and other useful safe locations.',
      href: '/safe-places',
      icon: MapPin,
      code: 'CAP-01',
    },
    {
      label: 'EMERGENCY',
      description: 'Quickly activate an emergency response and prepare a location-sharing message.',
      href: '/emergency',
      icon: Shield,
      code: 'CAP-02',
    },
    {
      label: 'TRUSTED CONTACT',
      description: 'Reach your trusted person quickly through WhatsApp with your location.',
      href: '/emergency',
      icon: Share2,
      code: 'CAP-03',
    },
    {
      label: 'AI SAFETY ASSISTANT',
      description: 'Get intelligent safety guidance when you need it.',
      href: '/assistant',
      icon: Bot,
      code: 'CAP-04',
    },
  ];

  return (
    <div className="space-y-28 sm:space-y-40 pb-24 text-zinc-100 selection:bg-white selection:text-black">
      {/* 1. Hero Section */}
      <section className="relative pt-20 sm:pt-28 pb-10 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Small uppercase label above heading */}
          <div className="inline-flex items-center space-x-2 border border-white/20 bg-black/60 px-4 py-1.5 rounded-full text-[11px] font-mono tracking-widest2 text-zinc-200 uppercase backdrop-blur-md shadow-lg shadow-black/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-white">SAFEREACH AI</span>
          </div>

          {/* Large centered hero typography */}
          <div className="space-y-6 max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white tracking-tight leading-[1.05] text-shadow-hero">
              Intelligent safety, <br />
              <span className="text-zinc-200 font-normal">when you need it most.</span>
            </h1>
            <p className="text-base sm:text-lg text-zinc-200 max-w-2xl mx-auto font-light leading-relaxed text-shadow-subtle">
              Autonomous safe-haven discovery, instant WhatsApp coordinate dispatch, and real-time AI safety guidance designed with zero compromise on privacy.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 font-mono text-xs tracking-wider uppercase">
            <Link
              href="/safe-places"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white hover:bg-zinc-200 text-black font-bold px-8 py-4 rounded-xl shadow-2xl shadow-white/20 active:scale-95 transition-all group"
            >
              <span>Find Safe Places</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            <Link
              href="/emergency"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-black/80 hover:bg-zinc-900 text-white border border-white/25 hover:border-white/40 font-bold px-7 py-4 rounded-xl backdrop-blur-md shadow-xl transition-all"
            >
              <span>Emergency SOS</span>
            </Link>

            <Link
              href="/assistant"
              className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/15 text-zinc-100 hover:text-white border border-white/20 font-semibold px-6 py-4 rounded-xl backdrop-blur-md transition-all"
            >
              <span>AI Advisor</span>
            </Link>
          </div>

          {/* Futuristic Radar Mesh Visual */}
          <RadarHeroVisual />
        </div>
      </section>

      {/* 2. Core Capabilities Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/[0.12] pt-16 sm:pt-24 space-y-12">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-300 block">
                CORE ARCHITECTURE
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-shadow-subtle">
                Engineered Capabilities
              </h2>
            </div>
            <p className="text-xs font-mono text-zinc-300 max-w-sm">
              PRECISION TOOLS FOR RAPID TRANSIT, PHYSICAL CRISES, AND UNFAMILIAR LOCALITIES.
            </p>
          </div>

          {/* 4 Major Capability Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-white/[0.12] bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden shadow-2xl">
            {capabilities.map((cap) => {
              const Icon = cap.icon;
              return (
                <Link
                  key={cap.label}
                  href={cap.href}
                  className="group relative border-r border-b border-white/[0.12] p-8 sm:p-10 flex flex-col justify-between hover:bg-white/[0.05] transition-colors min-h-[260px]"
                >
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-white/[0.08] border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black group-hover:border-white transition-all shadow-md">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-mono tracking-wider text-zinc-400 font-bold">
                        {cap.code}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-sm font-mono font-bold tracking-widest text-white uppercase mb-2 group-hover:text-emerald-300 transition-colors">
                        {cap.label}
                      </h3>
                      <p className="text-xs text-zinc-300 font-light leading-relaxed">
                        {cap.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 flex items-center justify-between text-[11px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                    <span className="font-bold">ACCESS &rarr;</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Operational Integrity Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/[0.12] pt-16 sm:pt-24 space-y-12">
          <div className="space-y-2 text-center max-w-2xl mx-auto">
            <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-300 block">
              OPERATIONAL INTEGRITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight text-shadow-subtle">
              Decentralized, Verified Safety
            </h2>
            <p className="text-xs sm:text-sm text-zinc-200 font-light mt-2">
              Every data point is derived directly from live public infrastructure maps and native system interfaces without intermediary logging.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="glass-panel rounded-2xl p-8 border border-white/15 space-y-4 shadow-2xl">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">01 // GEODATA</div>
              <h3 className="text-base font-mono font-bold text-white uppercase">Live OpenStreetMap</h3>
              <p className="text-xs text-zinc-200 font-light leading-relaxed">
                Queries the global Overpass QL mesh in real time to locate verified police stations, 24/7 emergency rooms, and licensed pharmacies within walking distance.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-8 border border-white/15 space-y-4 shadow-2xl">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">02 // DISPATCH</div>
              <h3 className="text-base font-mono font-bold text-white uppercase">Direct WhatsApp Pin</h3>
              <p className="text-xs text-zinc-200 font-light leading-relaxed">
                Generates a pre-formatted emergency message with your exact Google Maps coordinate pin and triggers native WhatsApp for instantaneous 1-tap transmission.
              </p>
            </div>

            <div className="glass-panel rounded-2xl p-8 border border-white/15 space-y-4 shadow-2xl">
              <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider font-bold">03 // PRIVACY</div>
              <h3 className="text-base font-mono font-bold text-white uppercase">Zero Cloud Tracking</h3>
              <p className="text-xs text-zinc-200 font-light leading-relaxed">
                Your emergency contact list and location history remain 100% strictly inside your device&apos;s local storage. We maintain zero databases of your location.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Direct Emergency Telephony Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-t border-white/[0.12] pt-16 sm:pt-24 space-y-8">
          <div className="space-y-2">
            <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-300 block">
              24/7 HELPLINE DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-shadow-subtle">
              Verified Emergency Services
            </h2>
          </div>

          <HelplineGrid />
        </div>
      </section>
    </div>
  );
}
