'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Lightbulb } from 'lucide-react';
import { audioSiren } from '@/utils/audioAlarm';

export default function AudioSiren() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [strobeActive, setStrobeActive] = useState(false);

  useEffect(() => {
    return () => {
      audioSiren.stop();
    };
  }, []);

  const toggleSiren = () => {
    if (isPlaying) {
      audioSiren.stop();
      setIsPlaying(false);
    } else {
      const started = audioSiren.start();
      if (started) setIsPlaying(true);
    }
  };

  const toggleStrobe = () => {
    setStrobeActive((prev) => !prev);
  };

  return (
    <>
      <div className="glass-panel rounded-3xl p-6 sm:p-7 border border-white/[0.08] space-y-4">
        <div>
          <span className="text-[10px] font-mono tracking-widest2 uppercase text-zinc-500 block">
            DEFENSIVE COUNTERMEASURES
          </span>
          <h3 className="font-bold text-base text-white mt-1">Audible Siren &amp; Optical Beacon</h3>
          <p className="text-xs text-zinc-400 font-light mt-0.5">
            Synthesizes an immediate high-decibel deterrent alarm and visual distress strobe.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
          {/* Siren Button */}
          <button
            onClick={toggleSiren}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold transition-all border ${
              isPlaying
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/30'
                : 'bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 border-white/[0.08]'
            }`}
          >
            {isPlaying ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-zinc-400" />}
            <span>{isPlaying ? 'STOP SIREN ALARM' : 'TRIGGER AUDIO SIREN'}</span>
          </button>

          {/* Strobe Beacon Button */}
          <button
            onClick={toggleStrobe}
            className={`flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold transition-all border ${
              strobeActive
                ? 'bg-white text-black border-white shadow-xl shadow-white/20'
                : 'bg-white/[0.03] hover:bg-white/[0.07] text-zinc-300 border-white/[0.08]'
            }`}
          >
            <Lightbulb className={`w-4 h-4 ${strobeActive ? 'text-black' : 'text-zinc-400'}`} />
            <span>{strobeActive ? 'STOP STROBE' : 'FLASH STROBE BEACON'}</span>
          </button>
        </div>
      </div>

      {/* Fullscreen Strobe Modal if active */}
      {strobeActive && (
        <div
          onClick={() => setStrobeActive(false)}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          style={{
            animation: 'strobeAnimation 0.22s infinite alternate',
          }}
        >
          <div className="glass-panel p-8 rounded-3xl border border-white/20 text-center max-w-sm mx-4 shadow-2xl">
            <h2 className="text-xl font-mono font-black text-white uppercase tracking-widest">
              OPTICAL BEACON ACTIVE
            </h2>
            <p className="text-xs font-mono text-zinc-400 mt-2 uppercase">
              Tap anywhere on screen to disengage
            </p>
          </div>

          <style jsx global>{`
            @keyframes strobeAnimation {
              0% {
                background-color: #050508;
              }
              100% {
                background-color: #ffffff;
              }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
