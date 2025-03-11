import { Check, Clock } from "lucide-react";

interface HabitCardProps {
  title: string;
  category: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export const HabitCard = ({ title, category, isCompleted, onComplete }: HabitCardProps) => {
  return (
    <div className={`p-4 border rounded-lg ${isCompleted ? 'bg-green-50' : ''}`}>
      <div className="flex items-center gap-3">
        <button
          onClick={onComplete}
          className={`w-6 h-6 rounded-full border flex items-center justify-center
            ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300'}`}
        >
          {isCompleted ? <Check size={14} /> : <Clock size={14} />}
        </button>
        <div>
          <h3 className="font-medium">{title}</h3>
          <span className="text-sm text-gray-500">{category}</span>
        </div>
      </div>
    </div>
  );
};