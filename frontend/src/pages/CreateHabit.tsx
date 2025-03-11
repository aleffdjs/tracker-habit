
import React from 'react';
import { toast } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { HabitForm } from '@/components/habit/HabitForm';
import { PageTransition } from '@/components/animations/PageTransition';
import { api } from '@/lib/api';
import { Habit } from '@/lib/types';

const CreateHabit = () => {
  const handleCreateHabit = async (habit: Omit<Habit, 'id' | 'createdAt'>) => {
    try {
      await api.createHabit(habit);
      toast('Hábito criado', {
        description: 'Seu novo hábito foi criado com sucesso.',
      });
    } catch (error) {
      console.error('Error creating habit:', error);
      toast('Falha ao criar hábito', {
        description: 'Ocorreu um erro ao criar seu hábito. Por favor, tente novamente.',
      });
      throw error;
    }
  };

  return (
    <Layout>
      <PageTransition>
        <div className="max-w-2xl mx-auto">
          <HabitForm onSubmit={handleCreateHabit} />
        </div>
      </PageTransition>
    </Layout>
  );
};

export default CreateHabit;
