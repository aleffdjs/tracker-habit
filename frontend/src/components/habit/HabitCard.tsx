
import React from 'react';
import { Check, LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Habit } from '@/lib/types';
import { CategoryBadge } from './CategoryBadge';

interface HabitCardProps {
  habit: Habit;
  completed?: boolean;
  onClick?: () => void;
  className?: string;
}

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  completed = false,
  onClick,
  className,
}) => {
  // Use a simpler approach to get icons
  const renderIcon = () => {
    try {
      const iconName = habit.icon || 'circle';
      // Dynamically import the specific icon
      const IconComponent = require(`lucide-react`)[iconName];
      return IconComponent ? <IconComponent size={18} /> : <Check size={18} />;
    } catch (error) {
      console.error('Error loading icon:', error);
      return <Check size={18} />;
    }
  };

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className={cn(
        "glass-card relative rounded-xl p-4 cursor-pointer transition-all duration-200",
        completed ? "border-l-4 border-l-green-500" : "",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div 
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
            completed 
              ? "bg-green-500 text-white" 
              : "bg-secondary text-foreground"
          )}
        >
          {completed ? (
            <Check size={18} />
          ) : renderIcon()}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base leading-tight mb-1 text-balance">
              {habit.title}
            </h3>
          </div>
          
          {habit.description && (
            <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
              {habit.description}
            </p>
          )}
          
          <div className="flex items-center gap-2 mt-1">
            <CategoryBadge 
              category={habit.category} 
              color={habit.color} 
            />
            
            {!habit.active && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                Inativo
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;
