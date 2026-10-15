import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { retroAudio } from '../../utils/retroAudio';

export const PomodoroTimer: React.FC = () => {
  const { addFocusSession } = useApp();

  const [mode, setMode] = useState<'focus' | 'break' | 'speedrun'>('focus');
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);

  const PRESETS = {
    focus: { label: '25M FOCUS', seconds: 25 * 60, xp: 50 },
    break: { label: '5M CHILL', seconds: 5 * 60, xp: 10 },
    speedrun: { label: '15M SPEEDRUN', seconds: 15 * 60, xp: 30 },
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      retroAudio.playPomodoroDing();
      const mins = Math.floor(PRESETS[mode].seconds / 60);
      addFocusSession(mins);
      setCompletedSessions((prev) => prev + 1);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, mode, addFocusSession]);

  const handleStartPause = () => {
    retroAudio.playClick();
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    retroAudio.playClick();
    setIsRunning(false);
    setTimeLeft(PRESETS[mode].seconds);
  };

  const switchMode = (newMode: 'focus' | 'break' | 'speedrun') => {
    retroAudio.playClick();
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(PRESETS[newMode].seconds);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const percentLeft = 100 - (timeLeft / PRESETS[mode].seconds) * 100;

  return (
    <div className="flex-1 p-4 sm:p-6 flex flex-col items-center justify-center select-none">
      <div className="w-full max-w-md bg-neutral-900 border-4 border-black retro-shadow-lg text-white">
        {/* Title Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-rose-600 px-3 py-1.5 flex items-center justify-between border-b-2 border-black text-black">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-black font-bold">
              LO_FI_FOCUS_STATION.EXE
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-pixel text-[9px] bg-black text-yellow-300 px-1.5 py-0.5 border border-black">
              SESSIONS: {completedSessions}
            </span>
          </div>
        </div>

        <div className="p-6 flex flex-col items-center space-y-6">
          {/* Mode Switcher */}
          <div className="flex gap-2">
            {(['focus', 'break', 'speedrun'] as const).map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`px-3 py-1.5 font-pixel text-[10px] border border-black cursor-pointer transition-all ${
                  mode === m
                    ? 'bg-yellow-400 text-black font-bold ring-2 ring-white retro-shadow-sm'
                    : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                }`}
              >
                {PRESETS[m].label}
              </button>
            ))}
          </div>

          {/* Retro Pixel Mascot Frame */}
          <div className="w-full bg-black border-2 border-neutral-700 p-4 flex flex-col items-center justify-center">
            <div className="text-3xl mb-2 font-mono text-cyan-300 animate-pulse">
              {isRunning
                ? mode === 'break'
                  ? '( ˘ ³˘)旦~'
                  : 'ヽ(⌐■_■)ノ♪♬'
                : '(・_・;)'}
            </div>
            <div className="font-mono text-xs text-neutral-400">
              {isRunning
                ? mode === 'break'
                  ? 'CHILLING & RECHARGING...'
                  : 'SYNTHESIZING DEEP WORK...'
                : 'STATION STANDBY... READY FOR INPUT'}
            </div>
          </div>

          {/* Retro Green LCD Digital Clock */}
          <div className="w-full bg-black border-4 border-neutral-800 p-4 text-center retro-shadow">
            <div className="font-vt text-7xl sm:text-8xl tracking-widest text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.8)] font-bold">
              {formatTime(timeLeft)}
            </div>

            {/* LCD Progress Bar */}
            <div className="w-full h-2 bg-neutral-900 border border-neutral-800 mt-3 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-500"
                style={{ width: `${percentLeft}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleStartPause}
              className={`flex items-center gap-2 px-6 py-3 font-pixel text-xs border-2 border-black retro-shadow cursor-pointer transition-all font-bold ${
                isRunning
                  ? 'bg-amber-400 hover:bg-amber-300 text-black'
                  : 'bg-emerald-400 hover:bg-emerald-300 text-black'
              }`}
            >
              {isRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>PAUSE</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>START FOCUS</span>
                </>
              )}
            </button>

            <button
              onClick={handleReset}
              className="p-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border-2 border-black retro-shadow cursor-pointer transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Lo-Fi Beats Aesthetic Quote */}
          <div className="font-mono text-xs text-center text-neutral-400 italic">
            "Now playing: 24/7 Lo-Fi Chill Beats to grind code & finish tasks to."
          </div>
        </div>
      </div>
    </div>
  );
};
