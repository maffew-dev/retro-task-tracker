import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { retroAudio } from '../../utils/retroAudio';


export const CalendarView: React.FC = () => {
  const { tasks, columns, openNewTaskModal, openEditTaskModal } = useApp();

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth()); // 0-11


  const MONTH_NAMES = [
    'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
    'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
  ];

  const DAYS_OF_WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  const handlePrevMonth = () => {
    retroAudio.playClick();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    retroAudio.playClick();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleGoToday = () => {
    retroAudio.playClick();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Build Calendar Matrix
  const firstDay = new Date(currentYear, currentMonth, 1);
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  let startDayIndex = firstDay.getDay() - 1;
  if (startDayIndex === -1) startDayIndex = 6;

  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays: {
    day: number;
    month: number;
    year: number;
    isCurrentMonth: boolean;
    dateStr: string;
  }[] = [];

  // Trailing previous month days
  for (let i = startDayIndex - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const m = currentMonth === 0 ? 11 : currentMonth - 1;
    const y = currentMonth === 0 ? currentYear - 1 : currentYear;
    calendarDays.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true,
      dateStr: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Leading next month days
  const remaining = (7 - (calendarDays.length % 7)) % 7;
  for (let d = 1; d <= remaining; d++) {
    const m = currentMonth === 11 ? 0 : currentMonth + 1;
    const y = currentMonth === 11 ? currentYear + 1 : currentYear;
    calendarDays.push({
      day: d,
      month: m,
      year: y,
      isCurrentMonth: false,
      dateStr: `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`,
    });
  }

  // Monthly stats
  const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
  const monthTasks = tasks.filter((t) => t.dueDate && t.dueDate.startsWith(monthPrefix));
  const bossFightsThisMonth = monthTasks.filter((t) => t.priority === 'boss').length;
  const overdueCount = tasks.filter(
    (t) => t.dueDate && t.dueDate < todayStr && t.columnId !== 'col-done'
  ).length;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto select-none space-y-4">
      {/* 1. Header Window Control Bar */}
      <div className="bg-neutral-900 border-2 border-black retro-shadow p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Navigation buttons */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-black border border-neutral-700">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-neutral-800 text-cyan-300 font-pixel text-xs border-r border-neutral-700 cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-neutral-800 text-cyan-300 font-pixel text-xs cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="font-pixel text-xs sm:text-sm text-yellow-300 tracking-wider">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </h2>

          <button
            onClick={handleGoToday}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-pixel text-[10px] border border-black cursor-pointer"
          >
            TODAY
          </button>
        </div>

        {/* Month Summary Pills */}
        <div className="flex items-center gap-2.5 flex-wrap text-xs font-mono">
          <div className="flex items-center gap-1.5 bg-black px-2.5 py-1 border border-neutral-800 text-cyan-300">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>{monthTasks.length} DEADLINES</span>
          </div>

          {bossFightsThisMonth > 0 && (
            <div className="flex items-center gap-1 bg-rose-950/80 text-rose-300 px-2.5 py-1 border border-rose-500 font-bold">
              <span>👾 {bossFightsThisMonth} BOSS FIGHTS</span>
            </div>
          )}

          {overdueCount > 0 && (
            <div className="flex items-center gap-1 bg-amber-950/80 text-amber-300 px-2.5 py-1 border border-amber-500 font-bold animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{overdueCount} OVERDUE</span>
            </div>
          )}

          <button
            onClick={() => openNewTaskModal()}
            className="flex items-center gap-1 bg-emerald-400 hover:bg-emerald-300 text-black font-pixel text-[10px] px-3 py-1.5 border border-black retro-shadow-sm font-bold cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ QUEST</span>
          </button>
        </div>
      </div>

      {/* 2. Visual Calendar Grid Container */}
      <div className="bg-neutral-900 border-2 border-black retro-shadow p-3">
        {/* Weekday Columns Header */}
        <div className="grid grid-cols-7 gap-2 mb-2 text-center font-pixel text-[9px] sm:text-[10px] text-neutral-400 border-b border-neutral-800 pb-2">
          {DAYS_OF_WEEK.map((day, i) => (
            <div
              key={day}
              className={i >= 5 ? 'text-rose-400 font-bold' : 'text-neutral-400'}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 7-column Calendar Matrix */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {calendarDays.map((cell, idx) => {
            const dayTasks = tasks.filter((t) => t.dueDate === cell.dateStr);
            const isToday = cell.dateStr === todayStr;
            const isPast = cell.dateStr < todayStr;

            return (
              <div
                key={idx}
                className={`min-h-[90px] sm:min-h-[110px] p-1.5 sm:p-2 border flex flex-col justify-between transition-colors relative group ${
                  isToday
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'
                    : !cell.isCurrentMonth
                    ? 'bg-black/30 border-neutral-800/50 opacity-40'
                    : isPast
                    ? 'bg-black/50 border-neutral-800'
                    : 'bg-black/80 border-neutral-800 hover:border-neutral-600'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isToday
                        ? 'bg-emerald-400 text-black px-1.5 py-0.2 rounded-xs'
                        : cell.isCurrentMonth
                        ? 'text-white'
                        : 'text-neutral-500'
                    }`}
                  >
                    {cell.day}
                  </span>

                  {/* Add task for this day shortcut */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openNewTaskModal();
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 bg-neutral-800 hover:bg-cyan-400 hover:text-black text-neutral-400 border border-neutral-700 text-[9px] transition-opacity cursor-pointer"
                    title={`Add task for ${cell.dateStr}`}
                  >
                    <Plus className="w-2.5 h-2.5" />
                  </button>
                </div>

                {/* Task Badges on this day */}
                <div className="space-y-1 flex-1 overflow-y-auto max-h-24">
                  {dayTasks.map((task) => {
                    const isDone = task.columnId === 'col-done';
                    const col = columns.find((c) => c.id === task.columnId);

                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditTaskModal(task);
                        }}
                        className={`px-1.5 py-1 text-[10px] font-mono border cursor-pointer transition-transform hover:scale-[1.02] flex items-center justify-between gap-1 truncate ${
                          isDone
                            ? 'bg-neutral-900 border-neutral-800 text-neutral-500 line-through'
                            : task.priority === 'boss'
                            ? 'bg-rose-950/90 text-rose-200 border-rose-500 font-bold shadow-[0_0_6px_rgba(244,63,94,0.4)]'
                            : task.priority === 'medium'
                            ? 'bg-amber-950/80 text-amber-200 border-amber-600'
                            : 'bg-neutral-800 text-teal-200 border-teal-700'
                        }`}
                        title={`${task.title} (+${task.xp} XP)`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <span
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: col?.color || '#00f3ff' }}
                          />
                          <span className="text-[9px]">
                            {task.priority === 'boss' ? '👾' : task.priority === 'medium' ? '⚡' : '🍃'}
                          </span>
                          <span className="truncate">{task.title}</span>
                        </div>

                        {isDone && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 flex-shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                {/* Day footer summary tag */}
                {dayTasks.length > 0 && (
                  <div className="text-[9px] font-pixel text-neutral-500 text-right mt-1">
                    {dayTasks.length} {dayTasks.length === 1 ? 'QUEST' : 'QUESTS'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
