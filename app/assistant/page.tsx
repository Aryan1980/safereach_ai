'use client';

import React from 'react';
import { Lock } from 'lucide-react';
import ChatWindow from '@/components/Assistant/ChatWindow';

export default function AssistantPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-8 text-zinc-100">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            INTELLIGENCE AGENT
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            AI Safety Companion
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-light max-w-xl leading-relaxed">
            Real-time tactical safety reasoning, cab ride checks, emergency de-escalation, and situational preparation.
          </p>
        </div>

        <div className="glass-panel px-4 py-2.5 rounded-xl flex items-center space-x-2 border border-white/[0.08] font-mono text-xs text-zinc-400">
          <Lock className="w-3.5 h-3.5 text-zinc-500" />
          <span>ZERO-RETENTION PRIVATE</span>
        </div>
      </div>

      {/* Main Chat Interface */}
      <ChatWindow />
    </div>
  );
}
