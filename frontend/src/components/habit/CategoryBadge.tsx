
import React from 'react';
import { cn } from '@/lib/utils';
import { HabitCategory } from '@/lib/types';

interface CategoryBadgeProps {
  category: HabitCategory;
  color?: string;
  className?: string;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ 
  category, 
  color, 
  className 
}) => {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        className
      )}
      style={{ backgroundColor: `${color}20`, color }}
    >
      {category}
    </div>
  );
};

export default CategoryBadge;
