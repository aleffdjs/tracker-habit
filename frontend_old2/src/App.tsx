import { useState, useEffect } from 'react';
import { HabitCard } from './components/HabitCard';
import { NewHabitForm } from './components/NewHabitForm';
import axios from 'axios';

interface Habit {
  id: string;
  name: string;
  category: string;
}

interface DailyStatus {
  habit: Habit;
  completed: boolean;
}

function App() {
  const [habits, setHabits] = useState<DailyStatus[]>([]);
  const [filter, setFilter] = useState<'pending' | 'completed'>('pending');

  useEffect(() => {
    fetchHabits();
  }, [filter]);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/records/daily?status=${filter}`);
      setHabits(response.data);
    } catch (error) {
      console.error('Erro ao buscar hábitos:', error);
    }
  };

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
        completed: true
      });
      fetchHabits();
    } catch (error) {
      console.error('Erro ao completar hábito:', error);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Meus Hábitos</h1>
        <NewHabitForm onSubmit={handleAddHabit} />
      </div>
      
      <div className="mb-6 space-x-2">
        <button
          className={`px-4 py-2 rounded ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('pending')}
        >
          Pendentes
        </button>
        <button
          className={`px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setFilter('completed')}
        >
          Concluídos
        </button>
      </div>

      <div className="space-y-3">
        {habits.length === 0 ? (
          <p className="text-center text-gray-500">
            {filter === 'pending' ? 'Nenhum hábito pendente!' : 'Nenhum hábito concluído!'}
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

export default App;
