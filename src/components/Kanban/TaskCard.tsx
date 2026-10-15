import React, { useState } from 'react';
import {
  CheckCircle,

  Calendar,
  Sparkles,
  MoreVertical,
  CheckSquare,
  Square,
  Trash2,
  Edit2,
  GripVertical
} from 'lucide-react';
import type { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { retroAudio } from '../../utils/retroAudio';

interface TaskCardProps {
  task: Task;
  index: number;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, index }) => {
  const {
    toggleSubtask,
    completeTask,
    deleteTask,
    openEditTaskModal
  } = useApp();


  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState(false);

  // Subtask calculation
  const totalSubtasks = task.subtasks.length;
  const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
  const isDone = task.columnId === 'col-done';

  // Priority color config
  const getPriorityBadge = (priority: Task['priority']) => {
    switch (priority) {
      case 'boss':
        return {
          bg: 'bg-rose-500 text-white',
          label: 'BOSS FIGHT 👾',
          border: 'border-rose-700',
        };
      case 'medium':
        return {
          bg: 'bg-amber-400 text-black',
          label: 'MED ⚡',
          border: 'border-amber-600',
        };
      case 'chill':
      default:
        return {
          bg: 'bg-teal-400 text-black',
          label: 'CHILL 🍃',
          border: 'border-teal-600',
        };
    }
  };

  const priorityStyle = getPriorityBadge(task.priority);

  // Due date status
  const getDueDateStatus = (dueDateStr?: string) => {
    if (!dueDateStr) return null;
    const today = new Date().toISOString().split('T')[0];
    if (dueDateStr < today) {
      return { text: 'OVERDUE 💀', color: 'text-rose-400 bg-rose-950/80 border-rose-500' };
    }
    if (dueDateStr === today) {
      return { text: 'DUE TODAY ⚡', color: 'text-amber-300 bg-amber-950/80 border-amber-500' };
    }
    return { text: dueDateStr, color: 'text-neutral-300 bg-black/40 border-neutral-700' };
  };

  const dueStatus = getDueDateStatus(task.dueDate);

  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    retroAudio.playPickup();
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className={`group relative mb-3 bg-neutral-900 text-neutral-100 border-2 border-black retro-shadow transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#000000] cursor-grab active:cursor-grabbing ${
        isDone ? 'opacity-85 bg-neutral-950' : ''
      }`}
    >
      {/* Retro Card Header Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-neutral-800/90 border-b border-black text-xs">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-neutral-500 group-hover:text-cyan-400" />
          <span
            className={`px-1.5 py-0.5 text-[9px] font-pixel font-bold border border-black ${priorityStyle.bg}`}
          >
            {priorityStyle.label}
          </span>
          {task.tag && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-black/60 text-pink-300 border border-neutral-700 rounded-sm">
              #{task.tag}
            </span>
          )}
        </div>

        {/* XP Badge */}
        <div
          className={`flex items-center gap-1 text-[10px] font-pixel px-1.5 py-0.5 border ${
            task.priority === 'boss'
              ? 'text-yellow-300 bg-rose-950/80 border-yellow-500 shadow-[0_0_8px_rgba(254,231,97,0.3)] animate-pulse'
              : task.priority === 'medium'
              ? 'text-amber-300 bg-amber-950/60 border-amber-500/60'
              : 'text-teal-300 bg-teal-950/60 border-teal-500/60'
          }`}
          title={`${task.priority.toUpperCase()} Priority: Automated +${task.xp || 50} XP reward`}
        >
          <Sparkles className="w-2.5 h-2.5" />
          <span>+{task.xp || 50}XP</span>
        </div>
      </div>


      {/* Card Body */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={`font-display text-sm font-bold leading-snug tracking-wide ${
              isDone ? 'line-through text-neutral-500' : 'text-white'
            }`}
          >
            {task.title}
          </h4>

          {/* Quick Menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {isMenuOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-6 w-36 bg-black border-2 border-neutral-700 retro-shadow z-30 p-1 flex flex-col gap-1 text-xs"
              >
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    openEditTaskModal(task);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-neutral-200 hover:bg-cyan-500 hover:text-black font-mono text-left cursor-pointer"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>EDIT TASK</span>
                </button>
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    deleteTask(task.id);
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 text-rose-400 hover:bg-rose-500 hover:text-white font-mono text-left cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>DELETE</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {task.description && (
          <p className="mt-1.5 text-xs text-neutral-300 font-sans line-clamp-2 leading-relaxed">
            {task.description}
          </p>
        )}

        {/* Subtasks Progress */}
        {totalSubtasks > 0 && (
          <div className="mt-3 pt-2 border-t border-neutral-800">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSubtasks(!showSubtasks);
              }}
              className="flex items-center justify-between w-full text-[11px] font-mono text-neutral-400 hover:text-cyan-300"
            >
              <span className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3 text-cyan-400" />
                <span>SUBTASKS</span>
              </span>
              <span>
                {completedSubtasks}/{totalSubtasks}
              </span>
            </button>

            {/* Mini Progress Bar */}
            <div className="w-full h-1.5 bg-neutral-800 border border-neutral-700 mt-1 overflow-hidden">
              <div
                className="h-full bg-cyan-400 transition-all duration-300"
                style={{
                  width: `${(completedSubtasks / totalSubtasks) * 100}%`,
                }}
              />
            </div>

            {/* Expandable Subtask List */}
            {showSubtasks && (
              <div className="mt-2 space-y-1 pl-1">
                {task.subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSubtask(task.id, sub.id);
                    }}
                    className="flex items-center gap-2 text-xs font-sans text-neutral-300 cursor-pointer hover:text-white select-none py-0.5"
                  >
                    {sub.completed ? (
                      <CheckSquare className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <Square className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    )}
                    <span
                      className={
                        sub.completed ? 'line-through text-neutral-500' : ''
                      }
                    >
                      {sub.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Card Footer */}
        <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px]">
          {/* Due date badge */}
          {dueStatus ? (
            <div
              className={`flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.5 border ${dueStatus.color}`}
            >
              <Calendar className="w-3 h-3" />
              <span>{dueStatus.text}</span>
            </div>
          ) : (
            <div className="text-[10px] font-mono text-neutral-500">
              #{index + 1}
            </div>
          )}

          {/* Quick Complete / Reopen Action Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              completeTask(task.id);
            }}
            className={`flex items-center gap-1 font-pixel text-[9px] px-2 py-1 border border-black cursor-pointer transition-all ${
              isDone
                ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                : 'bg-emerald-400 text-black hover:bg-emerald-300 retro-shadow-sm hover:translate-x-0.5'
            }`}
          >
            <CheckCircle className="w-3 h-3" />
            <span>{isDone ? 'REOPEN' : 'FINISH'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
