import React from 'react';
import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { VibeMood } from '../../types';

export const VibeWidget: React.FC = () => {
  const { stats, setMood } = useApp();

  const moods: Record<
    VibeMood,
    {
      id: VibeMood;
      label: string;
      emoji: string;
      color: string;
      quote: string;
      mascot: string;
    }
  > = {
    locked_in: {
      id: 'locked_in',
      label: 'LOCKED IN',
      emoji: '⚡',
      color: 'bg-cyan-400 text-black',
      quote: 'Maximum overclock initiated. Zero distractions, total victory.',
      mascot: '(•̀ᴗ•́)و ̑̑',
    },
    chill: {
      id: 'chill',
      label: 'CHILL MODE',
      emoji: '🍵',
      color: 'bg-emerald-400 text-black',
      quote: 'Sip your matcha, play lo-fi hip hop, and take it one step at a time.',
      mascot: '( ˘ ³˘)♥',
    },
    chaos: {
      id: 'chaos',
      label: 'CHAOS CRUNCH',
      emoji: '👾',
      color: 'bg-rose-500 text-white',
      quote: 'Emergency boss battle engaged. Code hard, panic later!',
      mascot: 'ヽ(ﾟДﾟ)ﾉ',
    },
    creative: {
      id: 'creative',
      label: 'CREATIVE FLOW',
      emoji: '🎨',
      color: 'bg-purple-400 text-black',
      quote: 'Synthesizing ideas into art. The groove is unstoppable.',
      mascot: '~(˘▾˘~)',
    },
    slump: {
      id: 'slump',
      label: 'LOW BATTERY',
      emoji: '😴',
      color: 'bg-amber-400 text-black',
      quote: 'Energy level low. Hydrate, stretch, and check off small easy wins.',
      mascot: '(-_-)zzz',
    },
  };

  const currentMood = moods[stats.todayMood || 'locked_in'];


  const moodList: { id: VibeMood; label: string; emoji: string }[] = [
    { id: 'locked_in', label: 'LOCKED IN', emoji: '⚡' },
    { id: 'chill', label: 'CHILL', emoji: '🍵' },
    { id: 'creative', label: 'CREATIVE', emoji: '🎨' },
    { id: 'chaos', label: 'CHAOS', emoji: '👾' },
    { id: 'slump', label: 'LOW BATT', emoji: '😴' },
  ];

  return (
    <div className="bg-neutral-900 border-2 border-black retro-shadow p-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <h3 className="font-pixel text-xs text-white">
            TODAY'S VIBE CHECK-IN
          </h3>
        </div>
        <div className="font-mono text-xs text-pink-400 font-bold">
          STATUS: {currentMood.label}
        </div>
      </div>

      {/* Mood Selector Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {moodList.map((m) => (
          <button
            key={m.id}
            onClick={() => setMood(m.id)}
            className={`px-3 py-1.5 font-pixel text-[10px] border border-black cursor-pointer transition-all ${
              stats.todayMood === m.id
                ? 'bg-pink-500 text-white font-bold ring-2 ring-white retro-shadow-sm scale-105'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            {m.emoji} {m.label}
          </button>
        ))}
      </div>

      {/* Mascot Card & Motivational Lore */}
      <div className="bg-black/80 border border-neutral-800 p-3 flex items-center gap-4">
        <div className="w-14 h-14 bg-neutral-900 border-2 border-pink-500 flex items-center justify-center font-mono text-lg text-cyan-300 font-bold select-none retro-shadow-sm">
          {currentMood.mascot}
        </div>

        <div>
          <div className="font-pixel text-[10px] text-yellow-300 mb-1">
            TERMINAL FORTUNE //
          </div>
          <div className="font-sans text-xs text-neutral-200 italic leading-relaxed">
            "{currentMood.quote}"
          </div>
        </div>
      </div>
    </div>
  );
};
