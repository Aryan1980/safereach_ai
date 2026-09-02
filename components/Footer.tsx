import React from 'react';
import Link from 'next/link';
import { Lock, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#050508] text-zinc-400 text-xs font-mono selection:bg-white selection:text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center space-x-2.5">
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-black font-black text-xs">
                SR
              </div>
              <span className="font-bold text-white tracking-wider uppercase">
                SAFEREACH.AI
              </span>
            </Link>
            <p className="text-xs text-zinc-500 font-sans font-light leading-relaxed">
              Decentralized geospatial safety, WhatsApp coordinate transmission, and tactical AI safety companion.
            </p>
            <div className="inline-flex items-center space-x-2 text-[10px] text-zinc-400 border border-white/[0.08] px-3 py-1.5 rounded-lg bg-white/[0.02]">
              <Lock className="w-3 h-3 text-zinc-500" />
              <span>ZERO CLOUD TRACKING</span>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest block">
              ARCHITECTURE
            </span>
            <ul className="space-y-2 text-zinc-500">
              <li>
                <Link href="/safe-places" className="hover:text-white transition-colors">
                  SAFE PLACE LOCATOR
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="hover:text-white transition-colors">
                  EMERGENCY SOS HUB
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="hover:text-white transition-colors">
                  AI SAFETY ASSISTANT
                </Link>
              </li>
              <li>
                <Link href="/safety-tips" className="hover:text-white transition-colors">
                  TACTICAL DIRECTIVES
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  TELEMETRY DASHBOARD
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: 24/7 Helplines */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest block">
              NATIONAL HELPLINES
            </span>
            <ul className="space-y-2 text-zinc-500">
              <li className="flex items-center justify-between">
                <span>NATIONAL EMERGENCY:</span>
                <a href="tel:112" className="text-white hover:underline font-bold">
                  112
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>WOMEN HELPLINE:</span>
                <a href="tel:181" className="text-white hover:underline font-bold">
                  181
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>WOMEN IN DISTRESS:</span>
                <a href="tel:1091" className="text-white hover:underline font-bold">
                  1091
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>MEDICAL AMBULANCE:</span>
                <a href="tel:108" className="text-white hover:underline font-bold">
                  108
                </a>
              </li>
              <li className="flex items-center justify-between">
                <span>CYBER CRIME:</span>
                <a href="tel:1930" className="text-white hover:underline font-bold">
                  1930
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Protocols */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest block">
              CRISIS DIRECTIVE
            </span>
            <p className="text-xs text-zinc-500 font-sans font-light leading-relaxed">
              If actively threatened, dial 112 immediately. If walking in low-visibility or suspected pursuit, navigate directly towards the nearest 24/7 medical room or police post.
            </p>
            <div className="pt-1">
              <a
                href="https://ncw.nic.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-zinc-400 hover:text-white text-[11px]"
              >
                <span>NCW INDIA PORTAL</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/[0.06] pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-zinc-600 gap-4">
          <p>&copy; {new Date().getFullYear()} SAFEREACH AI. PRIVACY FIRST PERSONAL SAFETY INFRASTRUCTURE.</p>
          <div className="flex items-center space-x-6 text-zinc-500">
            <Link href="/about" className="hover:text-white">
              PRIVACY &amp; SECURITY
            </Link>
            <Link href="/safety-tips" className="hover:text-white">
              DIRECTIVES
            </Link>
            <Link href="/emergency" className="text-white hover:underline">
              EMERGENCY CONSOLE
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
