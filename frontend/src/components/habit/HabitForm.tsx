
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { api } from '@/lib/api';
import { HabitCategory, Habit } from '@/lib/types';
import { FrequencySelector, FrequencyType } from './FrequencySelector';
import { DaySelector } from './DaySelector';
import { DateSelector } from './DateSelector';
import { CategorySelector } from './CategorySelector';
import { IconSelector } from './IconSelector';

interface HabitFormProps {
  onSubmit: (habit: Omit<Habit, 'id' | 'createdAt'>) => Promise<void>;
  initialData?: Partial<Habit>;
  className?: string;
}

export const HabitForm: React.FC<HabitFormProps> = ({
  onSubmit,
  initialData,
  className,
}) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<HabitCategory>(initialData?.category || 'Personal');
  const [active] = useState(initialData?.active !== false);
  const [frequencyType, setFrequencyType] = useState<FrequencyType>(
    initialData?.frequency?.type || 'daily'
  );
  const [selectedDays, setSelectedDays] = useState<number[]>(
    initialData?.frequency?.days || []
  );
  const [selectedDates, setSelectedDates] = useState<number[]>(
    initialData?.frequency?.dates || []
  );
  const [icon, setIcon] = useState(initialData?.icon || 'Circle');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Array<{ name: HabitCategory; color: string; icon: string }>>([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      const categoriesData = await api.getCategories();
      setCategories(categoriesData);
    };
    
    fetchCategories();
  }, []);

  const handleDayToggle = (day: number) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const handleDateToggle = (date: number) => {
    setSelectedDates(prev =>
      prev.includes(date)
        ? prev.filter(d => d !== date)
        : [...prev, date]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;
    
    try {
      setLoading(true);
      
      const selectedCategory = category || 'Other';
      const selectedCategoryData = categories.find(c => c.name === selectedCategory);
      
      const habit: Omit<Habit, 'id' | 'createdAt'> = {
        title: title.trim(),
        description: description.trim() || undefined,
        category: selectedCategory,
        active,
        frequency: {
          type: frequencyType,
          ...(frequencyType === 'weekly' && { days: selectedDays.length ? selectedDays : [1, 2, 3, 4, 5] }),
          ...(frequencyType === 'monthly' && { dates: selectedDates.length ? selectedDates : [1] }),
        },
        icon,
        color: selectedCategoryData?.color,
      };
      
      await onSubmit(habit);
      navigate('/');
    } catch (error) {
      console.error('Error creating habit:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex items-center mb-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {initialData ? 'Editar Hábito' : 'Criar Novo Hábito'}
        </h1>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            placeholder="Qual hábito você gostaria de acompanhar?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição (opcional)</Label>
          <Textarea
            id="description"
            placeholder="Adicione detalhes sobre seu hábito"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Categoria</Label>
            <CategorySelector
              category={category}
              setCategory={setCategory}
              categories={categories}
              isCategoryOpen={isCategoryOpen}
              setIsCategoryOpen={setIsCategoryOpen}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Ícone</Label>
            <IconSelector
              icon={icon}
              setIcon={setIcon}
              isIconOpen={isIconOpen}
              setIsIconOpen={setIsIconOpen}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Frequência</Label>
          <FrequencySelector
            frequencyType={frequencyType}
            setFrequencyType={setFrequencyType}
          />
        </div>
        
        {frequencyType === 'weekly' && (
          <div className="space-y-2">
            <Label>Dias da Semana</Label>
            <DaySelector
              selectedDays={selectedDays}
              handleDayToggle={handleDayToggle}
            />
          </div>
        )}
        
        {frequencyType === 'monthly' && (
          <div className="space-y-2">
            <Label>Dias do Mês</Label>
            <DateSelector
              selectedDates={selectedDates}
              handleDateToggle={handleDateToggle}
            />
          </div>
        )}
      </div>
      
      <Button
        type="submit"
        className="w-full mt-6"
        disabled={!title.trim() || loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <motion.div
              className="h-4 w-4 rounded-full border-2 border-current border-r-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            Salvando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Salvar Hábito
          </span>
        )}
      </Button>
    </form>
  );
};

export default HabitForm;
