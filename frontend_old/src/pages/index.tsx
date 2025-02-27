'use client';

import { useState, useEffect } from 'react';
import { HabitCard } from '@/components/HabitCard';
import { NewHabitForm } from '@/components/NewHabitForm';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import axios from 'axios';

interface Habit {
  id: string;
  name: string;
  category: string;
}

interface Record {
  id: string;
  habitId: string;
  completed: boolean;
  date: string;
}

interface DailyStatus {
  habit: Habit;
  completed: boolean;
  record: Record | null;
}

export default function Home() {
  const [habits, setHabits] = useState<DailyStatus[]>([]);
  const [filter, setFilter] = useState<'pending' | 'completed'>('pending');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/records/daily`, {
        params: {
          date: format(selectedDate, 'yyyy-MM-dd'),
          status: filter
        }
      });
      setHabits(response.data);
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, [filter, selectedDate]);

  const handleAddHabit = async (data: { name: string; category: string }) => {
    try {
      await axios.post('http://localhost:5000/habits', data);
      fetchHabits();
    } catch (error) {
      console.error('Erro ao criar hábito:', error);
    }
  };

  const handleCompleteHabit = async (habitId: string) => {
    try {
      await axios.post(`http://localhost:5000/records/toggle/${habitId}`, {
        date: format(selectedDate, 'yyyy-MM-dd'),
        completed: true
      });
      fetchHabits();
    } catch (error) {
      console.error('Erro ao completar hábito:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">Meus Hábitos</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={16} />
            <span>
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
            </span>
          </div>
        </div>
        <NewHabitForm onSubmit={handleAddHabit} />
      </div>

      <div className="mb-6 flex gap-2">
        <Button
          variant={filter === "pending" ? "default" : "outline"}
          onClick={() => setFilter("pending")}
        >
          Pendentes
        </Button>
        <Button
          variant={filter === "completed" ? "default" : "outline"}
          onClick={() => setFilter("completed")}
        >
          Concluídos
        </Button>
      </div>

      <div className="space-y-3">
        {habits.length === 0 ? (
          <p className="text-center text-muted-foreground">
            {filter === "pending"
              ? "Nenhum hábito pendente para hoje!"
              : "Nenhum hábito concluído hoje."}
          </p>
        ) : (
          habits.map((item) => (
            <HabitCard
              key={item.habit.id}
              title={item.habit.name}
              category={item.habit.category}
              isCompleted={item.completed}
              onComplete={() => handleCompleteHabit(item.habit.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}