import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { CRTOverlay } from './components/CRTOverlay';
import { KanbanBoard } from './components/Kanban/KanbanBoard';
import { CalendarView } from './components/Calendar/CalendarView';
import { Dashboard } from './components/Dashboard/Dashboard';
import { PomodoroTimer } from './components/Pomodoro/PomodoroTimer';
import { TaskModal } from './components/TaskModal';
import { FloppyCartridgeModal } from './components/FloppyCartridgeModal';
import { Wifi, Disc3 } from 'lucide-react';



const MainApp: React.FC = () => {
  const { theme, activeTab } = useApp();
  const [isFloppyOpen, setIsFloppyOpen] = useState(false);


  // Background style based on active theme
  const getThemeBackgroundClass = () => {
    switch (theme) {
      case 'windows98':
        return 'bg-[#008080] text-black font-sans-clean';
      case 'lofi':
        return 'bg-[#f4efe4] text-[#2c2b29] font-sans-clean';
      case 'arcade':
        return 'bg-[#181425] text-white font-mono';
      case 'cyberpunk':
      default:
        return 'bg-[#0c051a] text-white font-sans-clean';
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 relative ${getThemeBackgroundClass()}`}
    >
      {/* 1. CRT Scanline Overlay */}
      <CRTOverlay />

      {/* 2. Top Header and Navigation */}
      <Header onOpenFloppyModal={() => setIsFloppyOpen(true)} />

      {/* 3. Main Workspace Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {activeTab === 'kanban' && <KanbanBoard />}
        {activeTab === 'calendar' && <CalendarView />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'focus' && <PomodoroTimer />}
      </main>


      {/* 4. Retro OS Bottom Taskbar */}
      <footer className="border-t-2 border-black bg-neutral-900 text-white px-3 py-1.5 flex items-center justify-between text-xs select-none z-30">
        <div className="flex items-center gap-2">
          {/* Start Menu Button */}
          <button
            onClick={() => setIsFloppyOpen(true)}
            className="flex items-center gap-1.5 bg-neutral-200 hover:bg-white text-black font-pixel text-[10px] px-2.5 py-1 border-2 border-black retro-shadow-sm font-bold cursor-pointer"
          >
            <span className="text-pink-600 font-extrabold">❖</span>
            <span>START</span>
          </button>

          {/* Active Process Tab in Taskbar */}
          <div className="hidden sm:flex items-center gap-1.5 bg-black/70 px-2.5 py-1 border border-neutral-700 text-[10px] font-mono text-cyan-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span>PROCESS: {activeTab.toUpperCase()}_WINDOW.EXE</span>
          </div>
        </div>

        {/* System Tray */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-400">
          <span className="hidden md:inline text-yellow-300 font-pixel text-[9px]">
            MEM: 640KB OK
          </span>
          <div className="flex items-center gap-1 text-emerald-400">
            <Wifi className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[10px]">CONNECTED</span>
          </div>
          <div className="flex items-center gap-1 text-cyan-400">
            <Disc3 className="w-3.5 h-3.5 animate-spin" />
            <span className="hidden sm:inline text-[10px]">A:\ READY</span>
          </div>
        </div>
      </footer>

      {/* 5. Modals */}
      <TaskModal />
      <FloppyCartridgeModal
        isOpen={isFloppyOpen}
        onClose={() => setIsFloppyOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
