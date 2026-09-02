'use client';

import React from 'react';
import { Shield, Car, Footprints, Scale, ArrowUpRight } from 'lucide-react';
import { QuickPrompt } from '@/types/chat';

const SAFETY_PROMPTS: QuickPrompt[] = [
  {
    id: 'stalking_help',
    category: 'immediate_concern',
    title: 'BEING FOLLOWED ON STREET',
    prompt: 'I feel like someone is walking behind me and following me. What should I do right now to stay safe?',
    icon: 'Footprints',
  },
  {
    id: 'cab_safety',
    category: 'transit_safety',
    title: 'CAB & AUTO SAFETY CHECKS',
    prompt: 'I am taking a cab late at night. What safety checks should I perform and what if the driver takes a wrong turn?',
    icon: 'Car',
  },
  {
    id: 'solo_travel',
    category: 'planning',
    title: 'SOLO TRAVEL SAFETY PLAN',
    prompt: 'I am traveling alone to a new city for work/college. How do I prepare a robust personal safety plan?',
    icon: 'Shield',
  },
  {
    id: 'harassment_rights',
    category: 'legal_rights',
    title: 'ZERO FIR & LEGAL RIGHTS',
    prompt: 'What are my legal rights regarding Zero FIR, women police stations, and reporting harassment in India?',
    icon: 'Scale',
  },
];

interface SafetyPromptChipsProps {
  onSelectPrompt: (promptText: string) => void;
  disabled?: boolean;
}

export default function SafetyPromptChips({ onSelectPrompt, disabled }: SafetyPromptChipsProps) {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Footprints':
        return <Footprints className="w-3.5 h-3.5 text-zinc-300" />;
      case 'Car':
        return <Car className="w-3.5 h-3.5 text-zinc-300" />;
      case 'Scale':
        return <Scale className="w-3.5 h-3.5 text-zinc-300" />;
      default:
        return <Shield className="w-3.5 h-3.5 text-zinc-300" />;
    }
  };

  return (
    <div className="space-y-2.5 font-mono">
      <span className="text-[10px] tracking-widest2 uppercase text-zinc-500 block">
        TACTICAL QUERY PRESETS:
      </span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {SAFETY_PROMPTS.map((item) => (
          <button
            key={item.id}
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-white/20 text-left transition-all disabled:opacity-40 group"
          >
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.06] flex items-center justify-center shrink-0">
                {getIcon(item.icon)}
              </div>
              <span className="text-xs font-bold text-zinc-300 group-hover:text-white truncate uppercase tracking-wider">
                {item.title}
              </span>
            </div>
            <ArrowUpRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white shrink-0 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
