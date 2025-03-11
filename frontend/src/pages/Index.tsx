import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { HabitList } from '@/components/habit/HabitList';
import { HabitProgress } from '@/components/habit/HabitProgress';
import { PageTransition } from '@/components/animations/PageTransition';
import { api } from '@/lib/api';
import { DailyHabitStatus, HabitStatistics } from '@/lib/types';

const Index = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [habits, setHabits] = useState<DailyHabitStatus[]>([]);
  const [stats, setStats] = useState<HabitStatistics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const habitsData = await api.getHabitsForDate(dateStr);
      const statsData = await api.getStatistics();
      
      setHabits(habitsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast('Failed to load habits', {
        description: 'There was an error loading your habits. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [selectedDate]);

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleToggleHabit = async (habitId: string) => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      await api.toggleHabitCompletion(habitId, dateStr);
      
      setHabits(prev => 
        prev.map(item => 
          item.habit.id === habitId 
            ? { ...item, completed: !item.completed }
            : item
        )
      );
      
      const statsData = await api.getStatistics();
      setStats(statsData);
      
      toast('Habit updated', {
        description: 'Your progress has been saved.',
      });
    } catch (error) {
      console.error('Error toggling habit:', error);
      toast('Failed to update habit', {
        description: 'There was an error updating your habit. Please try again.',
      });
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <Layout>
      <PageTransition>
        <header className="mb-8">
          <motion.h1 
            className="text-3xl font-bold tracking-tight"
            custom={0}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Habit Tracker
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            custom={1}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            Track your daily habits and build consistency
          </motion.p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            className="md:col-span-2 space-y-6"
            custom={2}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-pulse flex space-x-4">
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-secondary rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-secondary rounded"></div>
                      <div className="h-4 bg-secondary rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <HabitList
                habits={habits}
                date={selectedDate}
                onDateChange={handleDateChange}
                onToggleHabit={handleToggleHabit}
              />
            )}
          </motion.div>

          <motion.div 
            className="space-y-6"
            custom={3}
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
          >
            <div className="glass-card rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Statistics</h2>
              
              {stats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Active Habits</p>
                      <p className="text-2xl font-bold">{stats.activeHabits}</p>
                    </div>
                    <div className="bg-secondary/50 rounded-lg p-4 text-center">
                      <p className="text-sm text-muted-foreground">Completed Today</p>
                      <p className="text-2xl font-bold">{stats.completedToday}/{stats.totalToday}</p>
                    </div>
                  </div>
                  
                  {stats.weeklyProgress && (
                    <HabitProgress progress={stats.weeklyProgress} />
                  )}
                </div>
              ) : (
                <div className="animate-pulse space-y-4">
                  <div className="h-20 bg-secondary rounded"></div>
                  <div className="h-40 bg-secondary rounded"></div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={() => navigate('/create')}
              className="w-full gap-2"
              size="lg"
            >
              <Plus className="h-5 w-5" />
              Add New Habit
            </Button>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Index;
