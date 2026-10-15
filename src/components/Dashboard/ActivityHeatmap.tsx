import React, { useState } from 'react';
import { Calendar, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ActivityHeatmap: React.FC = () => {
  const { stats } = useApp();
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  // Generate 28 days array (past 4 weeks)
  const days: { date: string; dayOfWeek: number; count: number; label: string }[] = [];
  const now = new Date();

  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const count = stats.activityHistory[dateStr] || 0;
    days.push({
      date: dateStr,
      dayOfWeek: d.getDay(),
      count,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    });
  }

  // Get color for pixel block
  const getPixelColor = (count: number) => {
    if (count === 0) return 'bg-neutral-800 border-neutral-700';
    if (count === 1) return 'bg-teal-700 border-teal-500 shadow-sm';
    if (count === 2) return 'bg-cyan-400 border-cyan-300 shadow-sm';
    if (count === 3) return 'bg-pink-500 border-pink-400 shadow-sm';
    return 'bg-yellow-400 border-yellow-200 animate-pulse'; // 4+
  };

  return (
    <div className="bg-neutral-900 border-2 border-black retro-shadow p-4">
      <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-400" />
          <h3 className="font-pixel text-xs text-white tracking-wide">
            ACTIVITY PIXEL MATRIX (PAST 28 DAYS)
          </h3>
        </div>

        {/* Dynamic Hover Status */}
        <div className="font-mono text-xs text-neutral-300">
          {hoveredDay ? (
            <span className="text-yellow-300">
              {hoveredDay.date}: {hoveredDay.count} quest(s) cleared
            </span>
          ) : (
            <span className="text-neutral-500">Hover over pixels</span>
          )}
        </div>
      </div>

      {/* Grid of Pixels */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-flow-col grid-rows-4 gap-2 w-max">
          {days.map((day, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setHoveredDay({ date: day.label, count: day.count })}
              onMouseLeave={() => setHoveredDay(null)}
              className={`w-7 h-7 sm:w-8 sm:h-8 border-2 ${getPixelColor(
                day.count
              )} flex items-center justify-center font-mono text-[10px] font-bold text-black transition-transform hover:scale-110 cursor-pointer select-none`}
            >
              {day.count > 0 ? day.count : ''}
            </div>
          ))}
        </div>
      </div>

      {/* Legend & Summary */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-800 text-[10px] font-mono text-neutral-400">
        <div className="flex items-center gap-1.5">
          <span>LESS</span>
          <div className="w-3 h-3 bg-neutral-800 border border-neutral-700" />
          <div className="w-3 h-3 bg-teal-700 border border-teal-500" />
          <div className="w-3 h-3 bg-cyan-400 border border-cyan-300" />
          <div className="w-3 h-3 bg-pink-500 border border-pink-400" />
          <div className="w-3 h-3 bg-yellow-400 border border-yellow-200" />
          <span>MORE (BOSS TIER)</span>
        </div>

        <div className="flex items-center gap-1 text-pink-400 font-pixel text-[9px]">
          <Flame className="w-3 h-3" />
          <span>{stats.totalTasksCompleted} TOTAL QUESTS SMASHED</span>
        </div>
      </div>
    </div>
  );
};
