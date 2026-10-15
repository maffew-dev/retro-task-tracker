export type ThemeId = 'cyberpunk' | 'windows98' | 'lofi' | 'arcade';

export type Priority = 'chill' | 'medium' | 'boss';

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export type VibeMood = 'locked_in' | 'chill' | 'chaos' | 'slump' | 'creative';

export interface Task {
  id: string;
  title: string;
  description: string;
  columnId: string;
  priority: Priority;
  tag: string;
  subtasks: SubTask[];
  dueDate?: string;
  xp: number;
  createdAt: string;
  completedAt?: string;
}

export interface Column {
  id: string;
  title: string;
  color: string;
  emoji: string;
  order: number;
}

export interface UserStats {
  xp: number;
  level: number;
  currentStreak: number;
  lastActiveDate: string;
  totalTasksCompleted: number;
  focusMinutes: number;
  activityHistory: Record<string, number>; // "YYYY-MM-DD" -> count
  todayMood: VibeMood;
}

export type ActiveTab = 'kanban' | 'calendar' | 'dashboard' | 'focus';

