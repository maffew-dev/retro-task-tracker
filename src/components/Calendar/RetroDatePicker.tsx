import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,

  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

import { retroAudio } from '../../utils/retroAudio';

interface RetroDatePickerProps {
  value: string; // "YYYY-MM-DD" or ""
  onChange: (val: string) => void;
}

export const RetroDatePicker: React.FC<RetroDatePickerProps> = ({
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Initialize view month/year based on value or today
  const initialDate = value ? new Date(value + 'T00:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const MONTH_NAMES = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const DAYS_OF_WEEK = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  // Navigate months
  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    retroAudio.playClick();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    retroAudio.playClick();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleSelectDay = (year: number, month: number, day: number) => {
    retroAudio.playClick();
    const formatted = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    onChange(formatted);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    retroAudio.playClick();
    onChange('');
    setIsOpen(false);
  };

  // Quick Presets
  const applyPreset = (daysFromToday: number) => {
    retroAudio.playClick();
    const target = new Date();
    target.setDate(target.getDate() + daysFromToday);
    const formatted = target.toISOString().split('T')[0];
    onChange(formatted);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  const applyNextWeekend = () => {
    retroAudio.playClick();
    const target = new Date();
    const day = target.getDay(); // 0 is Sun, 6 is Sat
    const diff = (6 - day + 7) % 7 || 7;
    target.setDate(target.getDate() + diff);
    const formatted = target.toISOString().split('T')[0];
    onChange(formatted);
    setViewYear(target.getFullYear());
    setViewMonth(target.getMonth());
    setIsOpen(false);
  };

  // Calculate Calendar Days Matrix
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1);
  const daysInCurrentMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  // Convert Sunday (0) to 6, Monday (1) to 0
  let startDayIndex = firstDayOfMonth.getDay() - 1;
  if (startDayIndex === -1) startDayIndex = 6;

  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells: {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }[] = [];

  // Trailing previous month days
  for (let i = startDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = viewMonth === 0 ? 11 : viewMonth - 1;
    const y = viewMonth === 0 ? viewYear - 1 : viewYear;
    calendarCells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    calendarCells.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true,
      dateStr: `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Leading next month days to make complete 35 or 42 cells
  const remaining = (7 - (calendarCells.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const m = viewMonth === 11 ? 0 : viewMonth + 1;
    const y = viewMonth === 11 ? viewYear + 1 : viewYear;
    calendarCells.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Friendly date label
  const getDisplayLabel = () => {
    if (!value) return 'SET DEADLINE...';
    if (value === todayStr) return '⚡ TODAY';
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (value === tomorrow.toISOString().split('T')[0]) return '🚀 TOMORROW';
    if (value < todayStr) return `💀 OVERDUE (${value})`;
    return `📅 ${value}`;
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      <div
        onClick={() => {
          retroAudio.playClick();
          setIsOpen(!isOpen);
        }}
        className={`w-full flex items-center justify-between p-2 bg-black border-2 cursor-pointer transition-colors ${
          isOpen
            ? 'border-cyan-400 ring-1 ring-cyan-400'
            : value
            ? 'border-neutral-600 hover:border-cyan-400'
            : 'border-neutral-700 hover:border-neutral-500'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="w-4 h-4 text-cyan-400 flex-shrink-0" />
          <span
            className={`font-mono text-xs truncate ${
              value ? 'text-white font-bold' : 'text-neutral-400'
            }`}
          >
            {getDisplayLabel()}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="text-neutral-500 hover:text-rose-400 p-0.5"
              title="Clear deadline"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="font-pixel text-[9px] bg-neutral-800 text-neutral-300 px-1 py-0.5 border border-neutral-700">
            {isOpen ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {/* Visual Calendar Popup Card */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 w-full sm:w-80 bg-neutral-900 border-2 border-black retro-shadow-lg z-50 p-3 animate-in fade-in zoom-in-95 duration-100 select-none">
          {/* Calendar Header with Retro OS controls */}
          <div className="flex items-center justify-between bg-black p-1.5 border border-neutral-800 mb-2">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-black font-pixel text-[10px] cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="font-pixel text-[10px] text-yellow-300 tracking-wider">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 bg-neutral-800 hover:bg-neutral-700 text-cyan-300 border border-black font-pixel text-[10px] cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Presets Pills */}
          <div className="flex flex-wrap gap-1 mb-2.5">
            <button
              type="button"
              onClick={() => applyPreset(0)}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-emerald-500 hover:text-black font-mono text-[9px] text-emerald-400 border border-neutral-700 cursor-pointer"
            >
              TODAY
            </button>
            <button
              type="button"
              onClick={() => applyPreset(1)}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-cyan-400 hover:text-black font-mono text-[9px] text-cyan-300 border border-neutral-700 cursor-pointer"
            >
              TOMORROW
            </button>
            <button
              type="button"
              onClick={() => applyPreset(3)}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-yellow-400 hover:text-black font-mono text-[9px] text-yellow-300 border border-neutral-700 cursor-pointer"
            >
              +3 DAYS
            </button>
            <button
              type="button"
              onClick={applyNextWeekend}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-purple-400 hover:text-black font-mono text-[9px] text-purple-300 border border-neutral-700 cursor-pointer"
            >
              WEEKEND
            </button>
            <button
              type="button"
              onClick={() => applyPreset(7)}
              className="px-1.5 py-0.5 bg-neutral-800 hover:bg-pink-400 hover:text-black font-mono text-[9px] text-pink-300 border border-neutral-700 cursor-pointer"
            >
              +7 DAYS
            </button>
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-1.5 py-0.5 bg-neutral-800 hover:bg-rose-500 hover:text-white font-mono text-[9px] text-rose-400 border border-neutral-700 cursor-pointer"
              >
                NO DEADLINE
              </button>
            )}
          </div>

          {/* Weekday Columns Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-pixel text-[8px] text-neutral-400 mb-1 border-b border-neutral-800 pb-1">
            {DAYS_OF_WEEK.map((d, i) => (
              <div
                key={d}
                className={i >= 5 ? 'text-rose-400' : 'text-neutral-400'}
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((cell, idx) => {
              const isSelected = value === cell.dateStr;
              const isToday = todayStr === cell.dateStr;
              const isPast = cell.dateStr < todayStr;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() =>
                    handleSelectDay(cell.year, cell.month, cell.day)
                  }
                  className={`h-7 sm:h-8 flex flex-col items-center justify-center font-mono text-xs border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-400 text-black font-bold border-white ring-1 ring-white shadow-[0_0_8px_rgba(0,243,255,0.6)]'
                      : isToday
                      ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500 font-bold'
                      : !cell.isCurrentMonth
                      ? 'text-neutral-600 bg-black/40 border-transparent hover:border-neutral-700'
                      : isPast
                      ? 'text-neutral-500 bg-black/60 border-neutral-800 hover:bg-neutral-800'
                      : 'text-neutral-200 bg-black/90 border-neutral-800 hover:bg-neutral-800 hover:border-neutral-600'
                  }`}
                >
                  <span>{cell.day}</span>
                  {isToday && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-emerald-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer Legend */}
          <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between font-mono text-[9px] text-neutral-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald-500 inline-block" /> Today
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-cyan-400 inline-block" /> Selected
            </span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-neutral-300 hover:text-white underline cursor-pointer"
            >
              CLOSE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
