import { AlertTriangle, Layers, Calendar as CalendarIcon } from 'lucide-react';

import { useApp } from '../../context/AppContext';

export const DistributionCharts: React.FC = () => {
  const { tasks, columns, openEditTaskModal, setActiveTab } = useApp();


  // Column distribution
  const colStats = columns.map((col) => {
    const count = tasks.filter((t) => t.columnId === col.id).length;
    const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;
    return {
      id: col.id,
      title: col.title,
      emoji: col.emoji,
      color: col.color,
      count,
      pct,
    };
  });

  // Priority distribution
  const chillCount = tasks.filter((t) => t.priority === 'chill').length;
  const medCount = tasks.filter((t) => t.priority === 'medium').length;
  const bossCount = tasks.filter((t) => t.priority === 'boss').length;

  // Upcoming radar / deadlines
  const today = new Date().toISOString().split('T')[0];
  const upcomingTasks = tasks
    .filter((t) => t.dueDate && t.columnId !== 'col-done')
    .sort((a, b) => (a.dueDate! > b.dueDate! ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Pipeline Distribution */}
      <div className="bg-neutral-900 border-2 border-black retro-shadow p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 mb-3">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h3 className="font-pixel text-xs text-white">
              PIPELINE DISTRIBUTION
            </h3>
          </div>

          {/* Segmented Bar Meter */}
          <div className="w-full h-6 bg-black border-2 border-neutral-700 flex overflow-hidden mb-4">
            {colStats.map((c) => (
              <div
                key={c.id}
                style={{ width: `${c.pct}%`, backgroundColor: c.color }}
                title={`${c.title}: ${c.count} (${c.pct}%)`}
                className="h-full border-r border-black relative group transition-all"
              />
            ))}
          </div>

          {/* Legend Items */}
          <div className="space-y-2">
            {colStats.map((c) => (
              <div
                key={c.id}
                className="flex items-center justify-between text-xs font-mono p-1.5 bg-black/50 border border-neutral-800"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 border border-black"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-white font-bold">
                    {c.emoji} {c.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 font-pixel text-[10px]">
                    {c.count} quests
                  </span>
                  <span className="text-cyan-400 font-bold">({c.pct}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority breakdown mini pill strip */}
        <div className="mt-4 pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-pixel text-[10px]">
          <span className="text-teal-400">CHILL: {chillCount}</span>
          <span className="text-amber-400">MED: {medCount}</span>
          <span className="text-rose-400">BOSS FIGHTS: {bossCount}</span>
        </div>
      </div>

      {/* 2. Upcoming Deadlines Radar */}
      <div className="bg-neutral-900 border-2 border-black retro-shadow p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 animate-bounce" />
              <h3 className="font-pixel text-xs text-white">
                UPCOMING DEADLINES RADAR
              </h3>
            </div>
            <button
              onClick={() => setActiveTab('calendar')}
              className="flex items-center gap-1 px-2 py-1 bg-black hover:bg-neutral-800 text-cyan-300 border border-neutral-700 font-mono text-[10px] cursor-pointer transition-colors"
            >
              <CalendarIcon className="w-3 h-3 text-cyan-400" />
              <span>FULL CALENDAR</span>
            </button>
          </div>


          {upcomingTasks.length === 0 ? (
            <div className="h-44 border border-dashed border-neutral-800 flex flex-col items-center justify-center text-center p-4">
              <span className="text-2xl mb-1">🎉</span>
              <span className="font-pixel text-[10px] text-emerald-400">
                RADAR CLEAR!
              </span>
              <span className="font-mono text-xs text-neutral-500 mt-1">
                No impending deadlines or all urgent quests conquered.
              </span>
            </div>
          ) : (
            <div className="space-y-2">
              {upcomingTasks.map((t) => {
                const isOverdue = t.dueDate! < today;
                const isToday = t.dueDate! === today;

                return (
                  <div
                    key={t.id}
                    onClick={() => openEditTaskModal(t)}
                    className="p-2.5 bg-black/60 border border-neutral-800 hover:border-cyan-400 cursor-pointer flex items-center justify-between transition-colors group"
                  >
                    <div className="truncate pr-2">
                      <div className="font-display text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                        {t.title}
                      </div>
                      <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                        #{t.tag} • {t.priority.toUpperCase()}
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 border ${
                          isOverdue
                            ? 'bg-rose-950 text-rose-300 border-rose-500 font-bold animate-pulse'
                            : isToday
                            ? 'bg-amber-950 text-amber-300 border-amber-500 font-bold'
                            : 'bg-neutral-800 text-neutral-300 border-neutral-700'
                        }`}
                      >
                        {isOverdue ? 'OVERDUE!' : isToday ? 'TODAY!' : t.dueDate}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-800 text-[10px] font-mono text-neutral-400 text-right">
          Click any deadline to inspect or modify quest
        </div>
      </div>
    </div>
  );
};
