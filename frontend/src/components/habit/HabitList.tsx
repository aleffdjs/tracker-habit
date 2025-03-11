
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { DailyHabitStatus } from '@/lib/types';
import { HabitCard } from './HabitCard';

interface HabitListProps {
  habits: DailyHabitStatus[];
  date: Date;
  onDateChange: (date: Date) => void;
  onToggleHabit: (habitId: string) => void;
  className?: string;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  date,
  onDateChange,
  onToggleHabit,
  className,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const categories = [...new Set(habits.map(h => h.habit.category))];
  
  const filteredHabits = selectedCategory
    ? habits.filter(h => h.habit.category === selectedCategory)
    : habits;
    
  const completedCount = habits.filter(h => h.completed).length;
    
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Hábitos Diários</h2>
          <p className="text-sm text-muted-foreground">
            {completedCount} de {habits.length} concluídos
          </p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(date, 'd MMM, yyyy', { locale: ptBR })}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && onDateChange(date)}
              initialFocus
              className="pointer-events-auto"
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {categories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className="rounded-full"
          >
            Todos
          </Button>
          
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="rounded-full"
            >
              {category}
            </Button>
          ))}
        </div>
      )}
      
      <div className="space-y-3">
        <AnimatePresence initial={false}>
          {filteredHabits.length > 0 ? (
            filteredHabits.map((item) => (
              <motion.div
                key={item.habit.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HabitCard
                  habit={item.habit}
                  completed={item.completed}
                  onClick={() => onToggleHabit(item.habit.id)}
                />
              </motion.div>
            ))
          ) : (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <p className="text-muted-foreground">
                {habits.length === 0
                  ? "Nenhum hábito agendado para hoje"
                  : "Nenhum hábito encontrado nesta categoria"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HabitList;
