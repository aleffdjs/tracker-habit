
import React from 'react';
import { Button } from '@/components/ui/button';

export type FrequencyType = 'daily' | 'weekly' | 'monthly';

interface FrequencySelectorProps {
  frequencyType: FrequencyType;
  setFrequencyType: (type: FrequencyType) => void;
}

export const FrequencySelector: React.FC<FrequencySelectorProps> = ({
  frequencyType,
  setFrequencyType,
}) => {
  return (
    <div className="flex space-x-2">
      {[
        { type: 'daily', label: 'Diário' },
        { type: 'weekly', label: 'Semanal' },
        { type: 'monthly', label: 'Mensal' }
      ].map((item) => (
        <Button
          key={item.type}
          type="button"
          variant={frequencyType === item.type ? "default" : "outline"}
          onClick={() => setFrequencyType(item.type as FrequencyType)}
          className="flex-1"
        >
          {item.label}
        </Button>
      ))}
    </div>
  );
};
