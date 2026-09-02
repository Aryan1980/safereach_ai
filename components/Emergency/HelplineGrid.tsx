import React from 'react';
import { PhoneCall, Shield, HeartPulse, Flame, Laptop, Users } from 'lucide-react';

interface HelplineItem {
  number: string;
  name: string;
  description: string;
  tag: string;
  icon: React.ComponentType<{ className?: string }>;
}

const HELPLINES: HelplineItem[] = [
  {
    number: '112',
    name: 'National Emergency',
    description: 'Unified emergency response (Police, Fire, Ambulance) across all states.',
    tag: 'UNIFIED 24/7',
    icon: Shield,
  },
  {
    number: '181',
    name: 'Women Helpline',
    description: '24/7 toll-free emergency response & rescue for women in distress or violence.',
    tag: 'TOLL-FREE',
    icon: Users,
  },
  {
    number: '1091',
    name: 'Women in Distress',
    description: 'Dedicated police assistance for stalking, threats, and physical harassment.',
    tag: 'POLICE DIRECT',
    icon: Shield,
  },
  {
    number: '108',
    name: 'Emergency Medical',
    description: 'Emergency ambulance dispatch, trauma care, and rapid medical transfer.',
    tag: 'AMBULANCE',
    icon: HeartPulse,
  },
  {
    number: '1930',
    name: 'Cyber Crime Defense',
    description: 'Reporting online harassment, digital stalking, blackmail, and unauthorized media.',
    tag: 'CYBER SECURITY',
    icon: Laptop,
  },
  {
    number: '101',
    name: 'Fire & Rescue',
    description: 'Emergency fire suppression, structural hazard response, and physical evacuation.',
    tag: 'FIRE & RESCUE',
    icon: Flame,
  },
];

export default function HelplineGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {HELPLINES.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.number}
            className="glass-panel rounded-2xl p-6 flex flex-col justify-between border border-white/[0.08] hover:border-white/20 transition-all group"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-zinc-300 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
                  {item.tag}
                </span>
              </div>

              <div>
                <h4 className="font-mono font-bold text-sm text-white tracking-wide">{item.name}</h4>
                <p className="text-xs text-zinc-400 font-light mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/[0.06]">
              <a
                href={`tel:${item.number}`}
                className="w-full flex items-center justify-between py-2.5 px-4 rounded-xl font-mono text-xs font-bold tracking-widest uppercase bg-white hover:bg-zinc-200 text-black shadow-md transition-all group-hover:shadow-white/10"
              >
                <span>CALL {item.number}</span>
                <PhoneCall className="w-3.5 h-3.5 text-black" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
