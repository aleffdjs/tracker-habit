
import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { WeeklyProgress } from '@/lib/types';

interface HabitProgressProps {
  progress: WeeklyProgress;
  className?: string;
}

export const HabitProgress: React.FC<HabitProgressProps> = ({ 
  progress, 
  className 
}) => {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress.progress / 100) * circumference;
  
  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative w-[100px] h-[100px]">
        <svg width="100" height="100" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle 
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="hsl(var(--secondary))" 
            strokeWidth="4"
          />
          
          {/* Progress circle */}
          <motion.circle 
            className="progress-ring-circle"
            cx="50" 
            cy="50" 
            r={radius} 
            fill="none" 
            stroke="hsl(var(--primary))" 
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress.progress)}%
          </motion.span>
          <span className="text-xs text-muted-foreground">Weekly</span>
        </div>
      </div>
      
      <div className="w-full mt-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Daily Progress</span>
          <span className="text-sm text-muted-foreground">
            {progress.completedHabits}/{progress.totalHabits}
          </span>
        </div>
        
        <div className="flex items-center justify-between gap-1">
          {progress.dailyProgress.map((day, index) => (
            <DayProgress key={index} day={day} />
          ))}
        </div>
      </div>
    </div>
  );
};

interface DayProgressProps {
  day: {
    day: string;
    percentage: number;
    completed: number;
    total: number;
  };
}

const DayProgress: React.FC<DayProgressProps> = ({ day }) => {
  const height = Math.max(day.percentage, 5); // Minimum height for visibility
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-8 h-24 bg-secondary rounded-full overflow-hidden">
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-primary rounded-full"
          initial={{ height: 0 }}
          animate={{ height: `${height}%` }}
          transition={{ duration: 1, delay: 0.1 }}
        />
      </div>
      <span className="text-xs mt-2">{day.day}</span>
      <span className="text-xs text-muted-foreground">
        {day.completed}/{day.total}
      </span>
    </div>
  );
};

export default HabitProgress;
