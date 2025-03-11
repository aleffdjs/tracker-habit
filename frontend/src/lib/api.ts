
import { Habit, HabitCategory, HabitCompletion, DailyHabitStatus, HabitStatistics, WeeklyProgress } from './types';
import { format, subDays, addDays } from 'date-fns';

// Mock data
const categories: HabitCategory[] = ['Health', 'Work', 'Study', 'Personal', 'Fitness', 'Mindfulness', 'Creativity', 'Other'];

const categoryColors: Record<HabitCategory, string> = {
  Health: '#38BDF8', // sky-400
  Work: '#818CF8', // indigo-400
  Study: '#A78BFA', // violet-400
  Personal: '#FB7185', // rose-400
  Fitness: '#34D399', // emerald-400
  Mindfulness: '#F472B6', // pink-400
  Creativity: '#FBBF24', // amber-400
  Other: '#94A3B8', // slate-400
};

const categoryIcons: Record<HabitCategory, string> = {
  Health: 'heart',
  Work: 'briefcase',
  Study: 'book',
  Personal: 'user',
  Fitness: 'dumbbell',
  Mindfulness: 'brain',
  Creativity: 'palette',
  Other: 'star',
};

const mockHabits: Habit[] = [
  {
    id: '1',
    title: 'Drink 2L of water',
    description: 'Stay hydrated throughout the day',
    category: 'Health',
    active: true,
    frequency: { type: 'daily' },
    icon: 'droplet',
    createdAt: new Date().toISOString(),
    color: categoryColors.Health,
  },
  {
    id: '2',
    title: 'Read for 30 minutes',
    description: 'Read a book to expand knowledge',
    category: 'Personal',
    active: true,
    frequency: { type: 'daily' },
    icon: 'book-open',
    createdAt: new Date().toISOString(),
    color: categoryColors.Personal,
  },
  {
    id: '3',
    title: 'Exercise',
    description: 'Go for a run or workout',
    category: 'Fitness',
    active: true,
    frequency: { type: 'weekly', days: [1, 3, 5] }, // Mon, Wed, Fri
    icon: 'dumbbell',
    createdAt: new Date().toISOString(),
    color: categoryColors.Fitness,
  },
  {
    id: '4',
    title: 'Meditate',
    description: '10 minutes of mindfulness meditation',
    category: 'Mindfulness',
    active: true,
    frequency: { type: 'daily' },
    icon: 'brain',
    createdAt: new Date().toISOString(),
    color: categoryColors.Mindfulness,
  },
  {
    id: '5',
    title: 'Study programming',
    description: 'Work on coding projects',
    category: 'Study',
    active: true,
    frequency: { type: 'daily' },
    icon: 'code',
    createdAt: new Date().toISOString(),
    color: categoryColors.Study,
  },
  {
    id: '6',
    title: 'Write journal',
    description: 'Record thoughts and reflections',
    category: 'Personal',
    active: false,
    frequency: { type: 'daily' },
    icon: 'edit-3',
    createdAt: new Date().toISOString(),
    color: categoryColors.Personal,
  },
];

// Mock completions for last 7 days
let mockCompletions: HabitCompletion[] = [];

// Generate some random completions
for (let i = 0; i < 7; i++) {
  const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
  mockHabits.forEach(habit => {
    if (Math.random() > 0.3) { // 70% chance of completion
      mockCompletions.push({
        id: `${habit.id}-${date}`,
        habitId: habit.id,
        date,
        completed: true,
      });
    }
  });
}

export const api = {
  // Get all habits
  getHabits: async (): Promise<Habit[]> => {
    return Promise.resolve([...mockHabits]);
  },

  // Get habits for a specific date
  getHabitsForDate: async (date: string): Promise<DailyHabitStatus[]> => {
    const habits = await api.getHabits();
    const completions = mockCompletions.filter(c => c.date === date);
    
    return habits
      .filter(habit => habit.active)
      .map(habit => ({
        habit,
        completed: completions.some(c => c.habitId === habit.id),
        completionId: completions.find(c => c.habitId === habit.id)?.id,
      }));
  },

  // Create a new habit
  createHabit: async (habit: Omit<Habit, 'id' | 'createdAt'>): Promise<Habit> => {
    const newHabit: Habit = {
      ...habit,
      id: `${mockHabits.length + 1}`,
      createdAt: new Date().toISOString(),
    };
    
    mockHabits.push(newHabit);
    return Promise.resolve(newHabit);
  },

  // Toggle habit completion for a specific date
  toggleHabitCompletion: async (habitId: string, date: string): Promise<HabitCompletion> => {
    const existingIndex = mockCompletions.findIndex(
      c => c.habitId === habitId && c.date === date
    );
    
    if (existingIndex >= 0) {
      // Toggle existing completion
      mockCompletions[existingIndex].completed = !mockCompletions[existingIndex].completed;
      return Promise.resolve(mockCompletions[existingIndex]);
    } else {
      // Create new completion
      const newCompletion: HabitCompletion = {
        id: `${habitId}-${date}-${new Date().getTime()}`,
        habitId,
        date,
        completed: true,
      };
      
      mockCompletions.push(newCompletion);
      return Promise.resolve(newCompletion);
    }
  },

  // Update a habit
  updateHabit: async (habitId: string, updates: Partial<Habit>): Promise<Habit> => {
    const habitIndex = mockHabits.findIndex(h => h.id === habitId);
    
    if (habitIndex >= 0) {
      mockHabits[habitIndex] = {
        ...mockHabits[habitIndex],
        ...updates,
      };
      
      return Promise.resolve(mockHabits[habitIndex]);
    }
    
    throw new Error('Habit not found');
  },

  // Get weekly progress
  getWeeklyProgress: async (): Promise<WeeklyProgress> => {
    const today = new Date();
    const startOfWeek = subDays(today, 6); // Last 7 days
    
    const dailyProgress = [];
    let totalCompleted = 0;
    let totalHabits = 0;
    
    for (let i = 0; i < 7; i++) {
      const currentDate = format(addDays(startOfWeek, i), 'yyyy-MM-dd');
      const dayName = format(addDays(startOfWeek, i), 'EEE');
      
      const habitsForDay = mockHabits.filter(h => h.active);
      const completionsForDay = mockCompletions.filter(
        c => c.date === currentDate && c.completed
      );
      
      const completed = completionsForDay.length;
      const total = habitsForDay.length;
      
      totalCompleted += completed;
      totalHabits += total;
      
      dailyProgress.push({
        day: dayName,
        date: currentDate,
        completed,
        total,
        percentage: total > 0 ? (completed / total) * 100 : 0,
      });
    }
    
    return Promise.resolve({
      totalHabits,
      completedHabits: totalCompleted,
      progress: totalHabits > 0 ? (totalCompleted / totalHabits) * 100 : 0,
      dailyProgress,
    });
  },

  // Get all statistics
  getStatistics: async (): Promise<HabitStatistics> => {
    const activeHabits = mockHabits.filter(h => h.active).length;
    const today = format(new Date(), 'yyyy-MM-dd');
    const habitsToday = await api.getHabitsForDate(today);
    const completedToday = habitsToday.filter(h => h.completed).length;
    const weeklyProgress = await api.getWeeklyProgress();
    
    // Calculate streaks (simplified version)
    const streaks = mockHabits.map(habit => ({
      habitId: habit.id,
      title: habit.title,
      currentStreak: Math.floor(Math.random() * 10), // Mock data
      longestStreak: Math.floor(Math.random() * 20 + 5), // Mock data
    }));
    
    return Promise.resolve({
      activeHabits,
      completedToday,
      totalToday: habitsToday.length,
      weeklyProgress,
      streaks,
    });
  },

  // Get available categories with their colors and icons
  getCategories: async (): Promise<{ name: HabitCategory; color: string; icon: string }[]> => {
    return Promise.resolve(
      categories.map(category => ({
        name: category,
        color: categoryColors[category],
        icon: categoryIcons[category],
      }))
    );
  },

  // Toggle habit active status
  toggleHabitActiveStatus: async (habitId: string): Promise<Habit> => {
    const habitIndex = mockHabits.findIndex(h => h.id === habitId);
    
    if (habitIndex >= 0) {
      mockHabits[habitIndex].active = !mockHabits[habitIndex].active;
      return Promise.resolve(mockHabits[habitIndex]);
    }
    
    throw new Error('Habit not found');
  },
};
