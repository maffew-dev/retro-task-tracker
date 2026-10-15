import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  X,
  CheckCircle2,
  ListTodo
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { KanbanColumn } from './KanbanColumn';
import type { Priority } from '../../types';


export const KanbanBoard: React.FC = () => {
  const {
    columns,
    tasks,
    searchQuery,
    setSearchQuery,
    tagFilter,
    setTagFilter,
    priorityFilter,
    setPriorityFilter,
    addColumn
  } = useApp();

  const [isAddingCol, setIsAddingCol] = useState(false);
  const [newColTitle, setNewColTitle] = useState('');
  const [newColEmoji, setNewColEmoji] = useState('📌');
  const [newColColor, setNewColColor] = useState('#00f3ff');

  // Filter tasks based on search, tag, priority
  const filteredTasks = tasks.filter((t) => {
    // Search match
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.tag.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    // Tag match
    if (tagFilter && t.tag.toLowerCase() !== tagFilter.toLowerCase()) {
      return false;
    }
    // Priority match
    if (priorityFilter && t.priority !== priorityFilter) {
      return false;
    }
    return true;
  });

  // Unique tags across tasks
  const allTags = Array.from(
    new Set(tasks.map((t) => t.tag).filter(Boolean))
  );

  const handleCreateColumn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColTitle.trim()) return;
    addColumn(newColTitle.trim(), newColEmoji, newColColor);
    setNewColTitle('');
    setIsAddingCol(false);
  };

  const completedCount = tasks.filter((t) => t.columnId === 'col-done').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  return (
    <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-hidden">
      {/* 1. Retro Search, Filter & Quick Stats Bar */}
      <div className="mb-4 bg-neutral-900 border-2 border-black retro-shadow p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="flex items-center gap-2 bg-black border border-neutral-700 px-3 py-1.5 w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="SEARCH QUESTS..."
            className="bg-transparent text-white placeholder-neutral-500 font-mono text-xs outline-none w-full"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tag Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-pixel text-[9px] text-neutral-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-cyan-400" /> TAGS:
          </span>
          <button
            onClick={() => setTagFilter(null)}
            className={`px-2 py-1 font-mono text-[11px] border border-black cursor-pointer transition-colors ${
              tagFilter === null
                ? 'bg-cyan-400 text-black font-bold'
                : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
            }`}
          >
            ALL
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setTagFilter(tagFilter === tag ? null : tag)}
              className={`px-2 py-1 font-mono text-[11px] border border-black cursor-pointer transition-colors ${
                tagFilter === tag
                  ? 'bg-pink-500 text-white font-bold'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              #{tag}
            </button>
          ))}
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-1.5">
          <span className="font-pixel text-[9px] text-neutral-400 mr-1">
            PRIORITY:
          </span>
          {(['chill', 'medium', 'boss'] as Priority[]).map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(priorityFilter === p ? null : p)}
              className={`px-2 py-1 font-pixel text-[9px] border border-black uppercase cursor-pointer transition-colors ${
                priorityFilter === p
                  ? 'bg-yellow-400 text-black font-bold'
                  : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Quick Board Summary */}
        <div className="flex items-center gap-3 font-mono text-[11px] text-neutral-300 bg-black/60 px-2.5 py-1 border border-neutral-800">
          <span className="flex items-center gap-1 text-cyan-300">
            <ListTodo className="w-3.5 h-3.5" />
            {tasks.length} QUESTS
          </span>
          <span>|</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {completedCount} DONE ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* 2. Columns Horizontal Carousel Container */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4 items-start select-none">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.columnId === col.id);
          return <KanbanColumn key={col.id} column={col} tasks={colTasks} />;
        })}

        {/* Add Column Button / In-place Creator */}
        <div className="w-72 sm:w-80 flex-shrink-0">
          {isAddingCol ? (
            <div className="bg-neutral-900 border-2 border-black retro-shadow p-3">
              <div className="font-pixel text-xs text-cyan-300 mb-2">
                NEW COLUMN
              </div>
              <form onSubmit={handleCreateColumn} className="space-y-3">
                <input
                  type="text"
                  placeholder="COLUMN NAME (e.g. TESTING)"
                  value={newColTitle}
                  onChange={(e) => setNewColTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-700 text-white font-mono text-xs p-2 outline-none"
                  autoFocus
                />

                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs text-neutral-400">
                    EMOJI:
                  </span>
                  <input
                    type="text"
                    value={newColEmoji}
                    onChange={(e) => setNewColEmoji(e.target.value)}
                    className="w-12 bg-black border border-neutral-700 text-center text-sm p-1"
                    maxLength={2}
                  />
                  <span className="font-mono text-xs text-neutral-400 ml-2">
                    COLOR:
                  </span>
                  <input
                    type="color"
                    value={newColColor}
                    onChange={(e) => setNewColColor(e.target.value)}
                    className="w-8 h-8 cursor-pointer bg-transparent border-0"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black font-pixel text-[10px] py-1.5 border border-black retro-shadow-sm font-bold cursor-pointer"
                  >
                    ADD
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCol(false)}
                    className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-pixel text-[10px] py-1.5 px-3 border border-black cursor-pointer"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCol(true)}
              className="w-full h-28 border-2 border-dashed border-neutral-700 hover:border-cyan-400 bg-neutral-900/40 hover:bg-neutral-900/80 text-neutral-400 hover:text-cyan-300 font-pixel text-xs flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
            >
              <Plus className="w-5 h-5 group-hover:scale-125 transition-transform" />
              <span>+ ADD COLUMN</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
