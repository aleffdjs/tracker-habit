import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Edit, Power, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Layout } from '@/components/layout/Layout';
import { HabitCard } from '@/components/habit/HabitCard';
import { PageTransition } from '@/components/animations/PageTransition';
import { api } from '@/lib/api';
import { Habit } from '@/lib/types';

const ManageHabits = () => {
  const navigate = useNavigate();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const habitsData = await api.getHabits();
      setHabits(habitsData);
    } catch (error) {
      console.error('Error fetching habits:', error);
      toast('Failed to load habits', {
        description: 'There was an error loading your habits. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  useEffect(() => {
    let filtered = habits;
    
    if (showActiveOnly) {
      filtered = filtered.filter(habit => habit.active);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        habit => 
          habit.title.toLowerCase().includes(term) || 
          (habit.description && habit.description.toLowerCase().includes(term)) ||
          habit.category.toLowerCase().includes(term)
      );
    }
    
    setFilteredHabits(filtered);
  }, [habits, searchTerm, showActiveOnly]);

  const handleToggleActive = async (habit: Habit) => {
    try {
      await api.toggleHabitActiveStatus(habit.id);
      
      // Update local state
      setHabits(prev => 
        prev.map(h => 
          h.id === habit.id ? { ...h, active: !h.active } : h
        )
      );
      
      toast(`Habit ${habit.active ? 'deactivated' : 'activated'}`, {
        description: `"${habit.title}" has been ${habit.active ? 'deactivated' : 'activated'}.`,
      });
    } catch (error) {
      console.error('Error toggling habit active status:', error);
      toast('Failed to update habit', {
        description: 'There was an error updating your habit. Please try again.',
      });
    }
  };

  return (
    <Layout>
      <PageTransition>
        <header className="mb-6">
          <h1 className="text-2xl font-bold">Manage Habits</h1>
          <p className="text-muted-foreground">Activate, edit, or filter your habits</p>
        </header>

        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search habits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={showActiveOnly}
                onCheckedChange={setShowActiveOnly}
                id="active-switch"
              />
              <label
                htmlFor="active-switch"
                className="text-sm cursor-pointer"
              >
                Active only
              </label>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-secondary rounded-xl"></div>
                  ))}
                </div>
              ) : filteredHabits.length > 0 ? (
                filteredHabits.map((habit) => (
                  <motion.div
                    key={habit.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center"
                  >
                    <div className="flex-1">
                      <HabitCard habit={habit} className="mb-0" />
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleToggleActive(habit)}
                        className={habit.active ? "text-primary" : "text-muted-foreground"}
                      >
                        <Power className="h-5 w-5" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-muted-foreground">
                    {habits.length === 0
                      ? "You haven't created any habits yet"
                      : "No habits match your search"}
                  </p>
                  {habits.length === 0 && (
                    <Button
                      onClick={() => navigate('/create')}
                      variant="outline"
                      className="mt-4"
                    >
                      Create your first habit
                    </Button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default ManageHabits;
