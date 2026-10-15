import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import confetti from 'canvas-confetti';
import type { Column, Priority, Task, ThemeId, UserStats, VibeMood, ActiveTab } from '../types';

import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadColumnsFromStorage,
  saveColumnsToStorage,
  loadStatsFromStorage,
  saveStatsToStorage,
  INITIAL_COLUMNS,
  INITIAL_TASKS,
  INITIAL_STATS,
} from '../utils/storage';
import { retroAudio } from '../utils/retroAudio';
import { calculateTaskXp } from '../utils/xp';


interface AppContextType {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
  crtEnabled: boolean;
  setCrtEnabled: (enabled: boolean) => void;
  isMuted: boolean;
  setIsMuted: (muted: boolean) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  tasks: Task[];
  columns: Column[];
  stats: UserStats;

  // Filter & Search
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  tagFilter: string | null;
  setTagFilter: (t: string | null) => void;
  priorityFilter: Priority | null;
  setPriorityFilter: (p: Priority | null) => void;

  // Task Actions
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  moveTask: (taskId: string, targetColumnId: string, targetIndex?: number) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  completeTask: (taskId: string) => void;

  // Column Actions
  addColumn: (title: string, emoji: string, color: string) => void;
  updateColumn: (id: string, title: string, emoji: string, color: string) => void;
  deleteColumn: (id: string) => void;

  // User & Gamification
  setMood: (mood: VibeMood) => void;
  addFocusSession: (minutes: number) => void;
  resetAllData: () => void;
  importCartridgeData: (importedTasks: Task[], importedCols: Column[], importedStats: UserStats) => void;

  // Modal
  isTaskModalOpen: boolean;
  modalTargetColumnId: string | null;
  editingTask: Task | null;
  openNewTaskModal: (columnId?: string) => void;
  openEditTaskModal: (task: Task) => void;
  closeTaskModal: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState<ThemeId>(() => {
    return (localStorage.getItem('retrovibe_theme_v1') as ThemeId) || 'cyberpunk';
  });
  const [crtEnabled, setCrtEnabledState] = useState<boolean>(() => {
    return localStorage.getItem('retrovibe_crt_enabled_v1') !== 'false';
  });
  const [isMuted, setIsMutedState] = useState<boolean>(() => {
    return localStorage.getItem('retrovibe_sound_muted_v1') === 'true';
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('kanban');

  // Tasks, Columns, and Gamified Stats
  const [tasks, setTasks] = useState<Task[]>(() => loadTasksFromStorage());
  const [columns, setColumns] = useState<Column[]>(() => loadColumnsFromStorage());
  const [stats, setStats] = useState<UserStats>(() => loadStatsFromStorage());

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [tagFilter, setTagFilter] = useState<string | null>(null);
  const [priorityFilter, setPriorityFilter] = useState<Priority | null>(null);

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [modalTargetColumnId, setModalTargetColumnId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sync state to storage
  useEffect(() => {
    saveTasksToStorage(tasks);
  }, [tasks]);

  useEffect(() => {
    saveColumnsToStorage(columns);
  }, [columns]);

  useEffect(() => {
    saveStatsToStorage(stats);
  }, [stats]);

  const setTheme = (newTheme: ThemeId) => {
    setThemeState(newTheme);
    localStorage.setItem('retrovibe_theme_v1', newTheme);
    retroAudio.playClick();
  };

  const setCrtEnabled = (val: boolean) => {
    setCrtEnabledState(val);
    localStorage.setItem('retrovibe_crt_enabled_v1', String(val));
    retroAudio.playClick();
  };

  const setIsMuted = (muted: boolean) => {
    setIsMutedState(muted);
    retroAudio.setMuted(muted);
    localStorage.setItem('retrovibe_sound_muted_v1', String(muted));
    if (!muted) {
      retroAudio.playClick();
    }
  };

  // Helper for Level calculation
  const calculateLevel = (currentXp: number): number => {
    return Math.floor(currentXp / 120) + 1;
  };

  // Gamification: Award XP
  const awardXp = (amount: number) => {
    setStats((prev) => {
      const newXp = prev.xp + amount;
      const oldLevel = prev.level;
      const newLevel = calculateLevel(newXp);

      const todayStr = new Date().toISOString().split('T')[0];
      const todayCount = (prev.activityHistory[todayStr] || 0) + 1;

      if (newLevel > oldLevel) {
        retroAudio.playLevelUp();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f3ff', '#ff007f', '#ffe600', '#00ff66', '#ffffff'],
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        totalTasksCompleted: prev.totalTasksCompleted + 1,
        activityHistory: {
          ...prev.activityHistory,
          [todayStr]: todayCount,
        },
      };
    });
  };

  // Task Actions
  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const calculatedXp = taskData.xp || calculateTaskXp(taskData.priority, taskData.subtasks?.length ?? 0);
    const newTask: Task = {
      ...taskData,
      xp: calculatedXp,
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setTasks((prev) => [newTask, ...prev]);
    retroAudio.playDrop();
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const newPriority = updates.priority ?? t.priority;
        const newSubtasks = updates.subtasks ?? t.subtasks;
        // If priority or subtasks changed and xp is not explicitly overwritten, recalculate xp
        const newXp = updates.xp ?? (
          (updates.priority !== undefined || updates.subtasks !== undefined)
            ? calculateTaskXp(newPriority, newSubtasks.length)
            : t.xp
        );
        return { ...t, ...updates, xp: newXp };
      })
    );
    retroAudio.playClick();
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    retroAudio.playDelete();
  };

  const moveTask = (taskId: string, targetColumnId: string, targetIndex?: number) => {
    setTasks((prev) => {
      const taskIndex = prev.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return prev;

      const task = prev[taskIndex];
      const taskXp = task.xp || calculateTaskXp(task.priority, task.subtasks.length);
      const updatedTask = { ...task, xp: taskXp, columnId: targetColumnId };

      // If moving to "col-done", mark complete
      if (targetColumnId === 'col-done' && task.columnId !== 'col-done') {
        updatedTask.completedAt = new Date().toISOString().split('T')[0];
        awardXp(taskXp);
        retroAudio.playComplete();
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
        });
      } else {
        retroAudio.playDrop();
      }


      const rest = prev.filter((t) => t.id !== taskId);
      if (targetIndex !== undefined) {
        rest.splice(targetIndex, 0, updatedTask);
        return rest;
      }
      return [...rest, updatedTask];
    });
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const updatedSubtasks = t.subtasks.map((s) =>
          s.id === subtaskId ? { ...s, completed: !s.completed } : s
        );
        return { ...t, subtasks: updatedSubtasks };
      })
    );
    retroAudio.playClick();
  };

  const completeTask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (task.columnId === 'col-done') {
      // Reopen to queued
      updateTask(taskId, { columnId: 'col-todo', completedAt: undefined });
      retroAudio.playClick();
    } else {
      // Complete
      moveTask(taskId, 'col-done');
    }
  };

  // Column Actions
  const addColumn = (title: string, emoji: string, color: string) => {
    const newCol: Column = {
      id: `col-${Date.now()}`,
      title: title.toUpperCase(),
      emoji,
      color,
      order: columns.length,
    };
    setColumns((prev) => [...prev, newCol]);
    retroAudio.playClick();
  };

  const updateColumn = (id: string, title: string, emoji: string, color: string) => {
    setColumns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: title.toUpperCase(), emoji, color } : c))
    );
    retroAudio.playClick();
  };

  const deleteColumn = (id: string) => {
    if (columns.length <= 1) return;
    setColumns((prev) => prev.filter((c) => c.id !== id));
    // Move tasks in that column to the first remaining column
    const fallbackCol = columns.find((c) => c.id !== id);
    if (fallbackCol) {
      setTasks((prev) =>
        prev.map((t) => (t.columnId === id ? { ...t, columnId: fallbackCol.id } : t))
      );
    }
    retroAudio.playDelete();
  };

  const setMood = (mood: VibeMood) => {
    setStats((prev) => ({ ...prev, todayMood: mood }));
    retroAudio.playClick();
  };

  const addFocusSession = (minutes: number) => {
    setStats((prev) => ({
      ...prev,
      focusMinutes: prev.focusMinutes + minutes,
      xp: prev.xp + Math.floor(minutes * 2),
    }));
    retroAudio.playPomodoroDing();
  };

  const resetAllData = () => {
    setTasks(INITIAL_TASKS);
    setColumns(INITIAL_COLUMNS);
    setStats(INITIAL_STATS);
    retroAudio.playDelete();
  };

  const importCartridgeData = (
    importedTasks: Task[],
    importedCols: Column[],
    importedStats: UserStats
  ) => {
    if (Array.isArray(importedTasks)) setTasks(importedTasks);
    if (Array.isArray(importedCols)) setColumns(importedCols);
    if (importedStats) setStats(importedStats);
    retroAudio.playLevelUp();
  };

  // Modal Handlers
  const openNewTaskModal = (columnId?: string) => {
    setEditingTask(null);
    setModalTargetColumnId(columnId || (columns[0]?.id ?? 'col-backlog'));
    setIsTaskModalOpen(true);
    retroAudio.playPickup();
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setModalTargetColumnId(task.columnId);
    setIsTaskModalOpen(true);
    retroAudio.playClick();
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    setModalTargetColumnId(null);
    retroAudio.playClick();
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        setTheme,
        crtEnabled,
        setCrtEnabled,
        isMuted,
        setIsMuted,
        activeTab,
        setActiveTab,
        tasks,
        columns,
        stats,
        searchQuery,
        setSearchQuery,
        tagFilter,
        setTagFilter,
        priorityFilter,
        setPriorityFilter,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleSubtask,
        completeTask,
        addColumn,
        updateColumn,
        deleteColumn,
        setMood,
        addFocusSession,
        resetAllData,
        importCartridgeData,
        isTaskModalOpen,
        modalTargetColumnId,
        editingTask,
        openNewTaskModal,
        openEditTaskModal,
        closeTaskModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
