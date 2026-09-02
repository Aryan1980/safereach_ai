'use client';

import React, { useState } from 'react';
import { 
  Car, 
  Moon, 
  Shield, 
  Laptop, 
  Check, 
  ChevronDown, 
  ChevronUp,
  FileText
} from 'lucide-react';
import Link from 'next/link';

interface TipCategory {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  tips: Array<{
    heading: string;
    points: string[];
    priority?: boolean;
  }>;
}

const CATEGORIES: TipCategory[] = [
  {
    id: 'public_transport',
    code: 'SEC-01',
    title: 'PUBLIC TRANSIT & CAB VERIFICATION',
    subtitle: 'Ride verification, driver checks, and route monitoring for taxis, autos, and buses.',
    icon: Car,
    tips: [
      {
        heading: '1. Three-Point Ride Verification Before Boarding',
        points: [
          'Verify the vehicle license plate matches your booking app EXACTLY before touching the door handle.',
          'Ask the driver "Who are you picking up?" rather than saying "Are you for [My Name]?" to ensure they know the booking details.',
          'Check that the child locks are disengaged on rear doors before sitting inside.',
        ],
        priority: true,
      },
      {
        heading: '2. Route Deviation & Active Monitoring',
        points: [
          'Keep your navigation open (Google Maps or SafeReach AI Safe Places) with volume audible to ensure the driver knows you are tracking the route.',
          'If the vehicle turns into an isolated or unfamiliar shortcut, immediately ask firmly: "Why are we taking this route? Please stick to the main road."',
          'If the driver refuses or turns off headlights, dial 112 immediately and trigger your SafeReach AI emergency siren.',
        ],
      },
      {
        heading: '3. Strategic Decoy Calls',
        points: [
          'Make an audible phone call upon entering: "Hey, I just boarded the auto/cab number [Speak Number Loudly]. I shared my live location with you, see you in 15 minutes."',
          'This establishes to the driver that your trip is actively monitored by people who expect you promptly.',
        ],
      },
    ],
  },
  {
    id: 'night_safety',
    code: 'SEC-02',
    title: 'NIGHT-TIME & WALKING PROTOCOLS',
    subtitle: 'Situational awareness, path selection, and defense postures when walking after dusk.',
    icon: Moon,
    tips: [
      {
        heading: '1. One-Earbud / Zero-Distraction Rule',
        points: [
          'Never wear noise-cancelling headphones or both earbuds when walking at night.',
          'Keep your ears open to hear approaching footsteps, slow-moving vehicles, or sudden noises behind you.',
        ],
        priority: true,
      },
      {
        heading: '2. Illumination & Commercial Thoroughfares',
        points: [
          'Always choose longer, well-lit commercial streets with open shops over dark shortcuts or park pathways.',
          'Walk facing oncoming traffic so vehicles cannot pull up behind you unnoticed.',
          'If you notice someone pacing behind you, cross the street deliberately. If they cross too, immediately enter the nearest open pharmacy, restaurant, or hotel lobby.',
        ],
      },
      {
        heading: '3. Body Posture & Key Grip',
        points: [
          'Walk with upright posture, brisk pace, and head held high. Stalkers look for individuals who appear disoriented or distracted on phones.',
          'Keep your keys gripped between your fingers inside your pocket ready for defensive use if needed.',
        ],
      },
    ],
  },
  {
    id: 'travel_safety',
    code: 'SEC-03',
    title: 'SOLO TRAVEL & NEW CITY PLANNING',
    subtitle: 'Hotel verification, neighborhood checks, and transit planning in unfamiliar cities.',
    icon: Shield,
    tips: [
      {
        heading: '1. Accommodation Safety Protocol',
        points: [
          'Request hotel rooms between the 2nd and 4th floors (accessible to fire truck ladders, but out of reach for street intruders).',
          'Inspect the door deadbolt, peephole, and window latches upon entering the room.',
          'Never state your room number loudly at reception or in public areas.',
        ],
      },
      {
        heading: '2. Digital Itinerary Sync',
        points: [
          'Share your hotel address, booking confirmation, and train/flight PNR with a trusted contact.',
          'Establish a scheduled check-in time (e.g. 9:00 PM daily). If you do not check in, your contact knows to attempt contact or alert local services.',
        ],
      },
    ],
  },
  {
    id: 'digital_safety',
    code: 'SEC-04',
    title: 'ONLINE & DIGITAL SECURITY',
    subtitle: 'Protecting your digital footprint, preventing stalking, and gathering legal evidence.',
    icon: Laptop,
    tips: [
      {
        heading: '1. Delayed Social Media Posting',
        points: [
          'Never post "Live" check-ins or real-time photos of cafes, hotels, or gyms that pinpoint your exact physical location.',
          'Post photos after leaving the establishment.',
          'Disable location metadata (EXIF geotags) on your mobile camera app.',
        ],
      },
      {
        heading: '2. Preserving Evidence in Harassment Cases',
        points: [
          'Take full-screen screenshots of abusive messages including the timestamp, sender phone number, and profile URL.',
          'Do not delete voice notes or messages before reporting.',
          'Report immediately to the National Cyber Crime Reporting Portal (cybercrime.gov.in) or call helpline 1930.',
        ],
        priority: true,
      },
    ],
  },
  {
    id: 'emergency_prep',
    code: 'SEC-05',
    title: 'ZERO FIR & LEGAL RIGHTS (INDIA)',
    subtitle: 'Device battery rules, Zero FIR rights in India, and offline emergency plans.',
    icon: FileText,
    tips: [
      {
        heading: '1. Zero FIR Legal Right (India)',
        points: [
          'Under Indian law (Section 154 CrPC), you can register a "Zero FIR" at ANY police station regardless of whether the incident occurred in their jurisdiction.',
          'No police station can refuse to take your complaint on grounds of jurisdiction.',
          'Women can also request their statements to be recorded by a female police officer or at their residence.',
        ],
        priority: true,
      },
      {
        heading: '2. Power Bank & Offline Readiness',
        points: [
          'Keep your mobile battery above 30% before stepping out at night.',
          'Keep physical cash and a small emergency card with family contact numbers in your wallet.',
          'Bookmark SafeReach AI on your mobile home screen for 1-tap browser access.',
        ],
      },
    ],
  },
];

export default function SafetyTipsPage() {
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    public_transport: true,
    night_safety: true,
    emergency_prep: true,
  });

  const toggleCategory = (id: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12 text-zinc-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            FIELD MANUAL
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Safety Protocols &amp; Directives
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
            De-escalation tactics, transit verification checklists, solo travel preparation, and legal rights.
          </p>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <Link
            href="/emergency"
            className="bg-white hover:bg-zinc-200 text-black font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-all"
          >
            SOS HUB
          </Link>
        </div>
      </div>

      {/* Categories Accordion */}
      <div className="space-y-4 font-mono">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isExpanded = expandedCategories[category.id] ?? false;

          return (
            <div
              key={category.id}
              className="glass-panel rounded-2xl overflow-hidden border border-white/[0.08] transition-all"
            >
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.id)}
                className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-zinc-500 tracking-wider uppercase">
                        {category.code}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-white tracking-wide uppercase mt-0.5">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white/[0.04] text-zinc-400">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Category Content */}
              {isExpanded && (
                <div className="p-6 sm:p-7 pt-2 border-t border-white/[0.06] space-y-4 bg-black/40 font-sans">
                  {category.tips.map((tip, idx) => (
                    <div
                      key={idx}
                      className={`p-5 rounded-xl border ${
                        tip.priority
                          ? 'bg-white/[0.03] border-white/20'
                          : 'bg-white/[0.01] border-white/[0.06]'
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-3">
                        {tip.priority && (
                          <span className="border border-white/20 bg-white/[0.08] text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            CRITICAL
                          </span>
                        )}
                        <h4 className="font-mono font-bold text-xs sm:text-sm text-white uppercase tracking-wider">
                          {tip.heading}
                        </h4>
                      </div>

                      <ul className="space-y-2 text-xs text-zinc-300 font-light">
                        {tip.points.map((pt, pIdx) => (
                          <li key={pIdx} className="flex items-start space-x-2.5">
                            <Check className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
