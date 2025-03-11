
import React from 'react';
import { Button } from '@/components/ui/button';

interface DaySelectorProps {
  selectedDays: number[];
  handleDayToggle: (day: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  selectedDays,
  handleDayToggle,
}) => {
  const daysOfWeek = [
    { value: 0, label: 'Dom' },
    { value: 1, label: 'Seg' },
    { value: 2, label: 'Ter' },
    { value: 3, label: 'Qua' },
    { value: 4, label: 'Qui' },
    { value: 5, label: 'Sex' },
    { value: 6, label: 'Sáb' },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {daysOfWeek.map((day) => (
        <Button
          key={day.value}
          type="button"
          variant={selectedDays.includes(day.value) ? "default" : "outline"}
          onClick={() => handleDayToggle(day.value)}
          className="w-12 h-12"
        >
          {day.label}
        </Button>
      ))}
    </div>
  );
};
