export interface Habit {
  id: number;
  name: string;
  completedDates?: string[];
  currentStreak?: number;
  longestStreak?: number;
}
