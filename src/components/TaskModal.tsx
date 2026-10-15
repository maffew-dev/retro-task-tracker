import React, { useState, useEffect } from 'react';
import {
  X,
  Trash2,
  Zap
} from 'lucide-react';

import { useApp } from '../context/AppContext';
import type { Priority } from '../types';
import { calculateTaskXp, PRIORITY_XP, SUBTASK_BONUS_XP } from '../utils/xp';
import { RetroDatePicker } from './Calendar/RetroDatePicker';


export const TaskModal: React.FC = () => {
  const {
    isTaskModalOpen,
    modalTargetColumnId,
    editingTask,
    closeTaskModal,
    addTask,
    updateTask,
    columns
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [columnId, setColumnId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [tag, setTag] = useState('CREATIVE');
  const [xp, setXp] = useState<number>(calculateTaskXp('medium', 0));
  const [isAutoXp, setIsAutoXp] = useState<boolean>(true);
  const [dueDate, setDueDate] = useState('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const PRESET_TAGS = [
    'BOSS FIGHT',
    'CREATIVE',
    'VIBING',
    'BUG',
    'SIDE QUEST',
    'STUDY',
    'DEADLINE',
    'CHORE',
  ];

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description);
      setColumnId(editingTask.columnId);
      setPriority(editingTask.priority);
      setTag(editingTask.tag);
      const calculated = calculateTaskXp(editingTask.priority, editingTask.subtasks?.length ?? 0);
      setXp(editingTask.xp || calculated);
      // If task XP matches the auto calculation, keep auto enabled
      setIsAutoXp(!editingTask.xp || editingTask.xp === calculated);
      setDueDate(editingTask.dueDate || '');
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setColumnId(modalTargetColumnId || columns[0]?.id || 'col-backlog');
      setPriority('medium');
      setTag('CREATIVE');
      setXp(calculateTaskXp('medium', 0));
      setIsAutoXp(true);
      setDueDate('');
      setSubtasks([]);
    }
  }, [editingTask, modalTargetColumnId, columns]);

  if (!isTaskModalOpen) return null;

  const handlePriorityChange = (newPriority: Priority) => {
    setPriority(newPriority);
    if (isAutoXp) {
      setXp(calculateTaskXp(newPriority, subtasks.length));
    }
  };

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const updated = [
      ...subtasks,
      {
        id: `sub-${Date.now()}`,
        title: newSubtaskTitle.trim(),
        completed: false,
      },
    ];
    setSubtasks(updated);
    if (isAutoXp) {
      setXp(calculateTaskXp(priority, updated.length));
    }
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    const updated = subtasks.filter((s) => s.id !== id);
    setSubtasks(updated);
    if (isAutoXp) {
      setXp(calculateTaskXp(priority, updated.length));
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim(),
        columnId,
        priority,
        tag: tag.toUpperCase(),
        xp,
        dueDate: dueDate || undefined,
        subtasks,
      });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim(),
        columnId,
        priority,
        tag: tag.toUpperCase(),
        xp,
        dueDate: dueDate || undefined,
        subtasks,
      });
    }

    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs select-none">
      {/* 90s OS Window Container */}
      <div className="w-full max-w-lg bg-neutral-900 border-4 border-black retro-shadow-lg text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Window Title Bar */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 px-3 py-1.5 flex items-center justify-between border-b-2 border-black">
          <div className="flex items-center gap-2">
            <span className="font-pixel text-xs text-yellow-300">
              {editingTask ? 'EDIT_QUEST.EXE' : 'NEW_QUEST.EXE'}
            </span>
          </div>

          <button
            onClick={closeTaskModal}
            className="w-5 h-5 bg-rose-600 hover:bg-rose-500 border border-black flex items-center justify-center font-bold text-white text-xs cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 max-h-[85vh] overflow-y-auto">
          {/* Quest Title */}
          <div>
            <label className="block font-pixel text-[10px] text-cyan-300 mb-1">
              QUEST TITLE *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Defeat Physics Midterm / Record Synth Pad"
              className="w-full bg-black border-2 border-neutral-700 focus:border-cyan-400 p-2 text-sm font-display text-white outline-none"
              autoFocus
            />
          </div>

          {/* Description */}
          <div>
            <label className="block font-pixel text-[10px] text-cyan-300 mb-1">
              NOTES & LORE
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key context, links, or loot details..."
              className="w-full bg-black border-2 border-neutral-700 focus:border-cyan-400 p-2 text-xs font-sans text-neutral-200 outline-none resize-none"
            />
          </div>

          {/* Column & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-pixel text-[10px] text-cyan-300 mb-1">
                BOARD COLUMN
              </label>
              <select
                value={columnId}
                onChange={(e) => setColumnId(e.target.value)}
                className="w-full bg-black border-2 border-neutral-700 focus:border-cyan-400 p-2 text-xs font-mono text-white outline-none cursor-pointer"
              >
                {columns.map((col) => (
                  <option key={col.id} value={col.id}>
                    {col.emoji} {col.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-pixel text-[10px] text-cyan-300 mb-1 flex items-center justify-between">
                <span>PRIORITY</span>
                <span className="font-mono text-[10px] text-yellow-300">
                  {priority === 'boss' ? '250 XP' : priority === 'medium' ? '100 XP' : '50 XP'} BASE
                </span>
              </label>
              <div className="flex gap-1.5">
                {(['chill', 'medium', 'boss'] as Priority[]).map((p) => {
                  const xpVal = PRIORITY_XP[p];
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePriorityChange(p)}
                      className={`flex-1 py-1.5 px-1 text-center font-pixel text-[9px] uppercase border border-black cursor-pointer transition-all flex flex-col items-center justify-center gap-0.5 ${
                        priority === p
                          ? p === 'boss'
                            ? 'bg-rose-500 text-white font-bold ring-2 ring-white scale-105'
                            : p === 'medium'
                            ? 'bg-amber-400 text-black font-bold ring-2 ring-white scale-105'
                            : 'bg-teal-400 text-black font-bold ring-2 ring-white scale-105'
                          : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      }`}
                    >
                      <span>{p === 'boss' ? 'BOSS' : p}</span>
                      <span className="text-[8px] font-mono opacity-90">
                        {xpVal}XP
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stickers / Tags Selector */}
          <div>
            <label className="block font-pixel text-[10px] text-cyan-300 mb-1.5">
              STICKER BADGE
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {PRESET_TAGS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTag(t)}
                  className={`px-2 py-1 text-[10px] font-mono border border-black cursor-pointer transition-colors ${
                    tag === t
                      ? 'bg-pink-500 text-white font-bold retro-shadow-sm'
                      : 'bg-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  #{t}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="Or write custom tag..."
              className="w-full bg-black border border-neutral-700 p-1.5 text-xs font-mono text-pink-300 outline-none"
            />
          </div>

          {/* Due Date & Automated XP Reward Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-pixel text-[10px] text-cyan-300 mb-1">
                DEADLINE (CALENDAR)
              </label>
              <RetroDatePicker value={dueDate} onChange={setDueDate} />
            </div>


            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-pixel text-[10px] text-cyan-300 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-yellow-300" />
                  <span>XP REWARD</span>
                </label>
                <span className="font-pixel text-xs text-yellow-300 bg-black px-1.5 py-0.5 border border-yellow-500/50">
                  +{xp} XP
                </span>
              </div>

              {/* Automated XP Calculation Breakdown Box */}
              <div className="bg-black/90 border border-neutral-700 p-2 text-[10px] font-mono space-y-1">
                <div className="flex items-center justify-between text-neutral-300">
                  <span>Priority Base ({priority.toUpperCase()}):</span>
                  <span className="text-cyan-300 font-bold">+{PRIORITY_XP[priority]} XP</span>
                </div>
                {subtasks.length > 0 && (
                  <div className="flex items-center justify-between text-neutral-400">
                    <span>Subtasks ({subtasks.length} × {SUBTASK_BONUS_XP} XP):</span>
                    <span className="text-emerald-400 font-bold">+{subtasks.length * SUBTASK_BONUS_XP} XP</span>
                  </div>
                )}
                <div className="pt-1 border-t border-neutral-800 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-neutral-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAutoXp}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setIsAutoXp(checked);
                        if (checked) {
                          setXp(calculateTaskXp(priority, subtasks.length));
                        }
                      }}
                      className="accent-cyan-400 cursor-pointer"
                    />
                    <span className="text-[9px]">Auto-scaled by Priority</span>
                  </label>
                </div>
              </div>

              {/* Manual Override Slider (only shown if Auto-scaled is unchecked) */}
              {!isAutoXp && (
                <div className="mt-1.5">
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="25"
                    value={xp}
                    onChange={(e) => setXp(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="text-[9px] font-mono text-neutral-500 text-right">
                    Manual override enabled
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Subtasks Checklist Builder */}
          <div>
            <label className="block font-pixel text-[10px] text-cyan-300 mb-1">
              SUBTASKS ({subtasks.length})
            </label>

            <div className="space-y-1.5 mb-2 max-h-32 overflow-y-auto">
              {subtasks.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between bg-black p-1.5 border border-neutral-800 text-xs font-sans"
                >
                  <span className="truncate pr-2">{sub.title}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubtask(sub.id)}
                    className="text-neutral-500 hover:text-rose-400 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add checklist subtask..."
                className="flex-1 bg-black border border-neutral-700 p-1.5 text-xs font-sans text-white outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="bg-neutral-800 hover:bg-neutral-700 text-cyan-300 font-pixel text-[9px] px-3 border border-black cursor-pointer"
              >
                + ADD
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 border-t-2 border-black flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={closeTaskModal}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-pixel text-xs px-4 py-2 border-2 border-black cursor-pointer"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="bg-emerald-400 hover:bg-emerald-300 text-black font-pixel text-xs px-5 py-2 border-2 border-black retro-shadow font-bold cursor-pointer"
            >
              {editingTask ? 'SAVE CHANGES' : 'CREATE QUEST'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
