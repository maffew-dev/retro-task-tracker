import type { Column, Task, UserStats } from '../types';
import { calculateTaskXp } from './xp';

export const INITIAL_COLUMNS: Column[] = [
  { id: 'col-backlog', title: 'BRAIN DUMP', emoji: '💡', color: '#ff007f', order: 0 },
  { id: 'col-todo', title: 'QUEUED UP', emoji: '⏳', color: '#ffe600', order: 1 },
  { id: 'col-progress', title: 'COOKING', emoji: '🔥', color: '#00f3ff', order: 2 },
  { id: 'col-done', title: 'SMASHED IT', emoji: '🎉', color: '#00ff66', order: 3 },
];

// Generate dynamic past dates for the activity heatmap
const getRecentDate = (daysAgo: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split('T')[0];
};

const getFutureDate = (daysAhead: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
};

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Defeat Calculus / Math Midterm Exam 👾',
    description: 'Master differential equations and double check the formula cheat sheet before the test.',
    columnId: 'col-progress',
    priority: 'boss',
    tag: 'BOSS FIGHT',
    subtasks: [
      { id: 'sub-1', title: 'Review chapter 4 integrals', completed: true },
      { id: 'sub-2', title: 'Solve 10 practice problems', completed: true },
      { id: 'sub-3', title: 'Create laminated cheat sheet', completed: false },
    ],
    dueDate: getFutureDate(1),
    xp: calculateTaskXp('boss', 3), // 280 XP
    createdAt: getRecentDate(3),
  },
  {
    id: 'task-2',
    title: 'Finish Lo-Fi synthwave soundtrack beat 🎹',
    description: 'Arranging the vintage Roland Juno pads and sidechaining the 808 kick drum for the EP release.',
    columnId: 'col-todo',
    priority: 'medium',
    tag: 'CREATIVE',
    subtasks: [
      { id: 'sub-4', title: 'Record vinyl crackle overlay', completed: true },
      { id: 'sub-5', title: 'Mix EQ on vintage synth lead', completed: false },
    ],
    dueDate: getFutureDate(3),
    xp: calculateTaskXp('medium', 2), // 120 XP
    createdAt: getRecentDate(2),
  },
  {
    id: 'task-3',
    title: 'Pixel Game Jam: Draw character sprite sheet 🕹️',
    description: 'Design 16-bit run, jump, and idle animation frames for the cyberpunk raccoon hero.',
    columnId: 'col-backlog',
    priority: 'chill',
    tag: 'SIDE QUEST',
    subtasks: [
      { id: 'sub-6', title: 'Sketch idle 4-frame bounce', completed: false },
      { id: 'sub-7', title: 'Export PNG sprite sheet', completed: false },
    ],
    dueDate: getFutureDate(7),
    xp: calculateTaskXp('chill', 2), // 70 XP
    createdAt: getRecentDate(4),
  },
  {
    id: 'task-4',
    title: 'Fix responsive navigation bug on personal portfolio 💻',
    description: 'Mobile burger menu animation stutters on Chromium on low refresh rate screens.',
    columnId: 'col-progress',
    priority: 'medium',
    tag: 'BUG',
    subtasks: [
      { id: 'sub-8', title: 'Inspect CSS transform matrix', completed: true },
      { id: 'sub-9', title: 'Test on mobile device viewport', completed: false },
    ],
    dueDate: getFutureDate(2),
    xp: calculateTaskXp('medium', 2), // 120 XP
    createdAt: getRecentDate(1),
  },
  {
    id: 'task-5',
    title: 'Build custom mechanical keyboard ⌨️',
    description: 'Lubed Boba U4T tactile switches and soldered custom RGB underglow PCB.',
    columnId: 'col-done',
    priority: 'boss',
    tag: 'VIBING',
    subtasks: [
      { id: 'sub-10', title: 'Lube all 68 switches with Krytox 205g0', completed: true },
      { id: 'sub-11', title: 'Flash QMK / VIA firmware', completed: true },
      { id: 'sub-12', title: 'Sound test on foam deskmat', completed: true },
    ],
    dueDate: getRecentDate(1),
    xp: calculateTaskXp('boss', 3), // 280 XP
    createdAt: getRecentDate(6),
    completedAt: getRecentDate(1),
  },
  {
    id: 'task-6',
    title: 'Thrift store run: Hunt for vintage jackets & vinyl 🧥',
    description: 'Found a retro 90s windbreaker and a Japanese city pop record in mint condition!',
    columnId: 'col-done',
    priority: 'chill',
    tag: 'SIDE QUEST',
    subtasks: [
      { id: 'sub-13', title: 'Hit downtown thrift alley', completed: true },
    ],
    dueDate: getRecentDate(2),
    xp: calculateTaskXp('chill', 1), // 60 XP
    createdAt: getRecentDate(5),
    completedAt: getRecentDate(2),
  },
];

export const INITIAL_STATS: UserStats = {
  xp: 380,
  level: 4,
  currentStreak: 5,
  lastActiveDate: getRecentDate(0),
  totalTasksCompleted: 14,
  focusMinutes: 125,
  activityHistory: {
    [getRecentDate(13)]: 1,
    [getRecentDate(12)]: 0,
    [getRecentDate(11)]: 2,
    [getRecentDate(10)]: 3,
    [getRecentDate(9)]: 1,
    [getRecentDate(8)]: 0,
    [getRecentDate(7)]: 2,
    [getRecentDate(6)]: 1,
    [getRecentDate(5)]: 3,
    [getRecentDate(4)]: 2,
    [getRecentDate(3)]: 4,
    [getRecentDate(2)]: 1,
    [getRecentDate(1)]: 3,
    [getRecentDate(0)]: 2,
  },
  todayMood: 'locked_in',
};

const STORAGE_KEYS = {
  TASKS: 'retrovibe_tasks_v1',
  COLUMNS: 'retrovibe_columns_v1',
  STATS: 'retrovibe_stats_v1',
  THEME: 'retrovibe_theme_v1',
  SOUND_MUTED: 'retrovibe_sound_muted_v1',
  CRT_ENABLED: 'retrovibe_crt_enabled_v1',
};

export const loadTasksFromStorage = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load tasks from localStorage', err);
  }
  return INITIAL_TASKS;
};

export const saveTasksToStorage = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error('Failed to save tasks', err);
  }
};

export const loadColumnsFromStorage = (): Column[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.COLUMNS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load columns from localStorage', err);
  }
  return INITIAL_COLUMNS;
};

export const saveColumnsToStorage = (columns: Column[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COLUMNS, JSON.stringify(columns));
  } catch (err) {
    console.error('Failed to save columns', err);
  }
};

export const loadStatsFromStorage = (): UserStats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STATS);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load stats', err);
  }
  return INITIAL_STATS;
};

export const saveStatsToStorage = (stats: UserStats): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } catch (err) {
    console.error('Failed to save stats', err);
  }
};

// Floppy Disk Export / Cartridge Save
export const exportDataCartridge = (tasks: Task[], columns: Column[], stats: UserStats) => {
  const data = {
    app: 'RetroVibe Tasks',
    version: '1.0',
    exportDate: new Date().toISOString(),
    tasks,
    columns,
    stats,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `RetroVibe-SaveCartridge-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
};

export const clearAllData = () => {
  Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
};
