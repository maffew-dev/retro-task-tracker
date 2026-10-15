import React, { useState } from 'react';
import { Plus, MoreHorizontal, Trash2 } from 'lucide-react';
import type { Column, Task } from '../../types';

import { TaskCard } from './TaskCard';
import { useApp } from '../../context/AppContext';

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({ column, tasks }) => {
  const {
    openNewTaskModal,
    moveTask,
    deleteColumn,
    columns
  } = useApp();

  const [isDragOver, setIsDragOver] = useState(false);
  const [showColMenu, setShowColMenu] = useState(false);

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only turn off if leaving column container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      moveTask(taskId, column.id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col w-72 sm:w-80 flex-shrink-0 bg-neutral-900/90 border-2 border-black retro-shadow transition-all duration-200 ${
        isDragOver
          ? 'ring-2 ring-cyan-400 bg-neutral-900 border-dashed border-cyan-400 scale-[1.01]'
          : ''
      }`}
    >
      {/* Column Window Header */}
      <div
        className="px-3 py-2 border-b-2 border-black flex items-center justify-between text-black font-pixel text-xs"
        style={{ backgroundColor: column.color || '#00f3ff' }}
      >
        <div className="flex items-center gap-2 truncate">
          <span className="text-base select-none">{column.emoji}</span>
          <span className="font-bold tracking-wider truncate">
            {column.title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Task count pill */}
          <span className="px-1.5 py-0.5 bg-black text-white font-mono text-[11px] font-bold border border-black">
            {tasks.length}
          </span>

          {/* Quick Add Button */}
          <button
            onClick={() => openNewTaskModal(column.id)}
            className="p-1 bg-white hover:bg-neutral-100 text-black border border-black cursor-pointer hover:scale-105 transition-transform"
            title={`Add task to ${column.title}`}
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
          </button>

          {/* Column menu if multiple columns */}
          {columns.length > 1 && (
            <div className="relative">
              <button
                onClick={() => setShowColMenu(!showColMenu)}
                className="p-1 bg-black/20 hover:bg-black/30 text-black border border-black cursor-pointer"
                title="Column settings"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {showColMenu && (
                <div className="absolute right-0 top-7 w-36 bg-black border-2 border-neutral-700 retro-shadow z-30 p-1 flex flex-col gap-1 text-xs">
                  <button
                    onClick={() => {
                      setShowColMenu(false);
                      if (
                        window.confirm(
                          `Delete column "${column.title}"? Tasks will move to another column.`
                        )
                      ) {
                        deleteColumn(column.id);
                      }
                    }}
                    className="flex items-center gap-2 px-2 py-1.5 text-rose-400 hover:bg-rose-600 hover:text-white font-mono text-left cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>DELETE COL</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Column Task Cards Body */}
      <div className="p-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-250px)] min-h-[300px]">
        {tasks.length === 0 ? (
          <div className="h-44 border-2 border-dashed border-neutral-800 flex flex-col items-center justify-center text-center p-4 text-neutral-600 select-none">
            <span className="text-2xl mb-1">💤</span>
            <span className="font-pixel text-[10px] text-neutral-500">
              NO ACTIVE QUESTS
            </span>
            <span className="font-mono text-xs text-neutral-600 mt-1">
              Drag cards here or press +
            </span>
          </div>
        ) : (
          tasks.map((task, idx) => (
            <TaskCard key={task.id} task={task} index={idx} />
          ))
        )}
      </div>

      {/* Quick Add Footer Bar */}
      <div className="p-2 border-t border-neutral-800 bg-neutral-950/60">
        <button
          onClick={() => openNewTaskModal(column.id)}
          className="w-full py-1.5 px-3 border border-dashed border-neutral-700 hover:border-cyan-400 text-neutral-400 hover:text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>ADD NEW CARD</span>
        </button>
      </div>
    </div>
  );
};
