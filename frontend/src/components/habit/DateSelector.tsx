
import React from 'react';
import { Button } from '@/components/ui/button';

interface DateSelectorProps {
  selectedDates: number[];
  handleDateToggle: (date: number) => void;
}

export const DateSelector: React.FC<DateSelectorProps> = ({
  selectedDates,
  handleDateToggle,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Array.from({ length: 31 }, (_, i) => i + 1).map((date) => (
        <Button
          key={date}
          type="button"
          variant={selectedDates.includes(date) ? "default" : "outline"}
          onClick={() => handleDateToggle(date)}
          className="w-10 h-10"
        >
          {date}
        </Button>
      ))}
    </div>
  );
};
