import type { Priority } from '../types';

export const PRIORITY_XP: Record<Priority, number> = {
  chill: 50,
  medium: 100,
  boss: 250,
};

export const SUBTASK_BONUS_XP = 10;

/**
 * Calculates automated XP based on task priority and subtask count.
 * Higher priority grants significantly higher base XP.
 * - Chill: 50 XP
 * - Medium: 100 XP
 * - Boss Fight: 250 XP
 * + 10 XP bonus per subtask checklist item.
 */
export const calculateTaskXp = (
  priority: Priority,
  subtasksCount: number = 0
): number => {
  const base = PRIORITY_XP[priority] ?? 50;
  const subtasksBonus = Math.max(0, subtasksCount) * SUBTASK_BONUS_XP;
  return base + subtasksBonus;
};

export const getPriorityLabel = (priority: Priority): string => {
  switch (priority) {
    case 'boss':
      return 'BOSS FIGHT';
    case 'medium':
      return 'MEDIUM';
    case 'chill':
    default:
      return 'CHILL';
  }
};
