import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Tv,
  Save,
  Plus,
  Flame,
  Columns3,
  Calendar as CalendarIcon,
  BarChart3,
  Timer,
  Palette,
  RotateCcw
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import type { ThemeId } from '../types';

interface HeaderProps {
  onOpenFloppyModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenFloppyModal }) => {
  const {
    theme,
    setTheme,
    crtEnabled,
    setCrtEnabled,
    isMuted,
    setIsMuted,
    activeTab,
    setActiveTab,
    stats,
    openNewTaskModal,
    resetAllData
  } = useApp();


  // Digital retro clock
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const themes: { id: ThemeId; name: string; icon: string }[] = [
    { id: 'cyberpunk', name: 'CYBERPUNK', icon: '🌆' },
    { id: 'windows98', name: 'WIN 98 OS', icon: '💾' },
    { id: 'lofi', name: 'LO-FI MATCHA', icon: '🍵' },
    { id: 'arcade', name: '8-BIT ARCADE', icon: '🕹️' },
  ];

  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  // Gamification level progress
  const xpInCurrentLevel = stats.xp % 120;
  const xpPercent = Math.min(100, Math.round((xpInCurrentLevel / 120) * 100));

  const getRankTitle = (lvl: number) => {
    if (lvl <= 1) return 'NOVICE';
    if (lvl <= 2) return 'APPRENTICE';
    if (lvl <= 3) return 'CODE RUNNER';
    if (lvl <= 4) return 'CYBER PRO';
    if (lvl <= 6) return 'TASK SLAYER';
    return 'TASK WIZARD';
  };

  return (
    <header className="border-b-4 border-black bg-neutral-900 text-white select-none relative z-40">
      {/* 1. Classic Windows 98 / Arcade Top Title Bar */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-950 px-3 py-1.5 flex items-center justify-between border-b-2 border-black text-xs">
        <div className="flex items-center gap-2">
          <span className="font-pixel text-[11px] text-cyan-300 tracking-wider flex items-center gap-1.5">
            <span className="inline-block w-2.5 h-2.5 bg-green-400 rounded-full animate-pulse" />
            RETROVIBE_OS.EXE
          </span>
          <span className="hidden sm:inline bg-black/40 px-2 py-0.5 rounded text-[10px] font-mono text-pink-300 border border-pink-500/30">
            BUILD 2026.04 // STABLE
          </span>
        </div>

        {/* Center LCD Digital Clock */}
        <div className="font-vt text-lg tracking-widest text-emerald-400 bg-black px-3 py-0.5 border border-emerald-500/50 rounded shadow-inner">
          SYS_TIME: {timeStr || '12:00:00'}
        </div>

        {/* Right mini window buttons */}
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-yellow-400 border border-black text-[9px] flex items-center justify-center font-bold text-black cursor-pointer hover:bg-yellow-300">
            _
          </div>
          <div className="w-4 h-4 bg-cyan-400 border border-black text-[9px] flex items-center justify-center font-bold text-black cursor-pointer hover:bg-cyan-300">
            □
          </div>
          <div className="w-4 h-4 bg-rose-500 border border-black text-[9px] flex items-center justify-center font-bold text-white cursor-pointer hover:bg-rose-400">
            ×
          </div>
        </div>
      </div>

      {/* 2. Main Navigation & Stats Control Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 bg-neutral-900">
        {/* Brand & Gamification Player Card */}
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer">
            <div className="w-11 h-11 bg-pink-500 border-2 border-black retro-shadow flex items-center justify-center text-xl font-pixel hover:scale-105 transition-transform">
              👾
            </div>
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-black text-[9px] font-pixel px-1 border border-black font-bold">
              LV{stats.level}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-pixel text-xs text-yellow-300 tracking-wider">
                {getRankTitle(stats.level)}
              </span>
              <span className="bg-pink-600/90 text-white text-[10px] font-pixel px-1.5 py-0.5 border border-black rounded-sm flex items-center gap-1">
                <Flame className="w-3 h-3 text-yellow-300 animate-bounce" />
                {stats.currentStreak}D STREAK
              </span>
            </div>

            {/* XP Bar */}
            <div className="flex items-center gap-2 mt-1">
              <div className="w-28 sm:w-36 h-3 bg-black border border-neutral-700 rounded-none overflow-hidden relative">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-pink-500 to-yellow-400 transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="font-mono text-[10px] text-neutral-400">
                {stats.xp} XP ({xpPercent}%)
              </span>
            </div>
          </div>
        </div>

        {/* Tab Switchers (Kanban, Dashboard, Focus) */}
        <div className="flex items-center bg-black p-1 border-2 border-black retro-shadow">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel transition-all ${
              activeTab === 'kanban'
                ? 'bg-cyan-400 text-black border-2 border-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Columns3 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">KANBAN</span> BOARD
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel transition-all ${
              activeTab === 'calendar'
                ? 'bg-emerald-400 text-black border-2 border-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            CALENDAR
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel transition-all ${
              activeTab === 'dashboard'
                ? 'bg-pink-500 text-white border-2 border-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            DASHBOARD
          </button>


          <button
            onClick={() => setActiveTab('focus')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-pixel transition-all ${
              activeTab === 'focus'
                ? 'bg-yellow-400 text-black border-2 border-white font-bold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            LO-FI FOCUS
          </button>
        </div>

        {/* Right Action Controls: Quick Add, Theme, Sound, CRT, Floppy */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Add Button */}
          <button
            onClick={() => openNewTaskModal()}
            className="flex items-center gap-1.5 bg-emerald-400 hover:bg-emerald-300 text-black font-pixel text-xs px-3 py-2 border-2 border-black retro-shadow hover:translate-x-0.5 hover:translate-y-0.5 transition-all font-bold cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>NEW TASK</span>
          </button>

          {/* Theme Switcher Button */}
          <div className="relative">
            <button
              onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
              className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 text-white border-2 border-black retro-shadow px-2.5 py-2 text-xs font-pixel cursor-pointer"
              title="Select Retro Aesthetic Theme"
            >
              <Palette className="w-3.5 h-3.5 text-pink-400" />
              <span className="hidden md:inline uppercase text-[10px]">
                {theme}
              </span>
            </button>

            {themeDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-neutral-900 border-2 border-black retro-shadow-lg z-50 p-1 flex flex-col gap-1">
                <div className="text-[9px] font-pixel text-neutral-400 px-2 py-1 border-b border-neutral-700">
                  CHOOSE AESTHETIC:
                </div>
                {themes.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => {
                      setTheme(t.id);
                      setThemeDropdownOpen(false);
                    }}
                    className={`flex items-center justify-between px-2.5 py-1.5 text-left text-xs font-mono font-bold cursor-pointer transition-colors ${
                      theme === t.id
                        ? 'bg-pink-500 text-white'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span>
                      {t.icon} {t.name}
                    </span>
                    {theme === t.id && <span className="font-pixel text-[9px]">●</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Audio SFX Toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 border-2 border-black retro-shadow text-xs cursor-pointer transition-colors ${
              isMuted
                ? 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                : 'bg-yellow-400 text-black hover:bg-yellow-300'
            }`}
            title={isMuted ? 'Unmute 8-Bit SFX' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* CRT Scanline Toggle */}
          <button
            onClick={() => setCrtEnabled(!crtEnabled)}
            className={`p-2 border-2 border-black retro-shadow text-xs cursor-pointer transition-colors ${
              crtEnabled
                ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
            }`}
            title={crtEnabled ? 'Disable CRT Scanlines' : 'Enable CRT Scanlines'}
          >
            <Tv className="w-4 h-4" />
          </button>

          {/* Floppy Cartridge Save / Load Modal */}
          <button
            onClick={onOpenFloppyModal}
            className="flex items-center gap-1 bg-purple-600 hover:bg-purple-500 text-white border-2 border-black retro-shadow px-2.5 py-2 text-xs font-pixel cursor-pointer"
            title="Backup to Floppy Disk / Load Cartridge"
          >
            <Save className="w-3.5 h-3.5" />
            <span className="hidden xl:inline text-[10px]">SAVE/LOAD</span>
          </button>

          {/* Quick Demo Reset */}
          <button
            onClick={() => {
              if (window.confirm('Reset all demo tasks and sample data?')) {
                resetAllData();
              }
            }}
            className="p-2 bg-neutral-800 hover:bg-rose-900/50 text-neutral-400 hover:text-rose-300 border-2 border-black retro-shadow cursor-pointer text-xs"
            title="Reset to default sample tasks"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
