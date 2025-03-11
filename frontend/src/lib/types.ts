
export type HabitCategory = 'Health' | 'Work' | 'Study' | 'Personal' | 'Fitness' | 'Mindfulness' | 'Creativity' | 'Other';

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: HabitCategory;
  active: boolean;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly';
    days?: number[]; // For weekly habits, days of week (0-6, 0 = Sunday)
    dates?: number[]; // For monthly habits, dates of month (1-31)
  };
  icon?: string;
  createdAt: string;
  color?: string;
}

export interface HabitCompletion {
  id: string;
  habitId: string;
  date: string; // ISO string
  completed: boolean;
}

export interface DailyHabitStatus {
  habit: Habit;
  completed: boolean;
  completionId?: string;
}

export interface WeeklyProgress {
  totalHabits: number;
  completedHabits: number;
  progress: number; // 0-100
  dailyProgress: {
    day: string; // Day name (e.g., "Mon")
    date: string; // ISO date
    completed: number;
    total: number;
    percentage: number;
  }[];
}

export interface HabitStatistics {
  activeHabits: number;
  completedToday: number;
  totalToday: number;
  weeklyProgress: WeeklyProgress;
  streaks: {
    habitId: string;
    title: string;
    currentStreak: number;
    longestStreak: number;
  }[];
}
