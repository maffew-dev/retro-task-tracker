import {
  Flame,
  CheckCircle2,
  Clock,
  Award
} from 'lucide-react';

import { useApp } from '../../context/AppContext';

export const StatsCards: React.FC = () => {
  const { stats, tasks } = useApp();

  const completedCount = tasks.filter((t) => t.columnId === 'col-done').length;
  const inProgressCount = tasks.filter((t) => t.columnId === 'col-progress').length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const cards = [
    {
      title: 'PLAYER LEVEL',
      val: `LV.${stats.level}`,
      subtitle: `${stats.xp} Total XP Accumulated`,
      icon: <Award className="w-5 h-5 text-yellow-300" />,
      bg: 'bg-neutral-900 border-yellow-500/80',
      accent: 'text-yellow-300',
    },
    {
      title: 'DAILY STREAK',
      val: `${stats.currentStreak} DAYS`,
      subtitle: 'Keep the momentum burning 🔥',
      icon: <Flame className="w-5 h-5 text-rose-500 animate-pulse" />,
      bg: 'bg-neutral-900 border-rose-500/80',
      accent: 'text-rose-400',
    },
    {
      title: 'COMPLETION RATE',
      val: `${completionRate}%`,
      subtitle: `${completedCount} of ${totalCount} quests conquered`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      bg: 'bg-neutral-900 border-emerald-500/80',
      accent: 'text-emerald-400',
    },
    {
      title: 'FOCUS CLOCKED',
      val: `${stats.focusMinutes} MINS`,
      subtitle: `${inProgressCount} quests actively cooking`,
      icon: <Clock className="w-5 h-5 text-cyan-400" />,
      bg: 'bg-neutral-900 border-cyan-500/80',
      accent: 'text-cyan-400',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c, idx) => (
        <div
          key={idx}
          className={`p-4 border-2 border-black retro-shadow ${c.bg} flex flex-col justify-between`}
        >
          <div className="flex items-start justify-between">
            <span className="font-pixel text-[10px] text-neutral-400 tracking-wider">
              {c.title}
            </span>
            <div className="p-1.5 bg-black border border-neutral-700">
              {c.icon}
            </div>
          </div>

          <div className="my-2">
            <div className={`font-pixel text-2xl font-bold tracking-wide ${c.accent}`}>
              {c.val}
            </div>
            <div className="font-mono text-xs text-neutral-400 mt-1">
              {c.subtitle}
            </div>
          </div>

          <div className="w-full h-1 bg-black overflow-hidden mt-1">
            <div
              className={`h-full ${
                idx === 0
                  ? 'bg-yellow-400'
                  : idx === 1
                  ? 'bg-rose-500'
                  : idx === 2
                  ? 'bg-emerald-400'
                  : 'bg-cyan-400'
              }`}
              style={{ width: '100%' }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
