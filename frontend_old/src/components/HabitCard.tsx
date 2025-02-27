import { Check, Clock } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

interface HabitCardProps {
  title: string;
  category: string;
  isCompleted: boolean;
  onComplete: () => void;
}

export const HabitCard = ({ title, category, isCompleted, onComplete }: HabitCardProps) => {
  return (
    <Card
      className={cn(
        "group relative flex items-center justify-between p-4 transition-all hover:shadow-md animate-fadeIn",
        isCompleted && "bg-success/10"
      )}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={onComplete}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
            isCompleted
              ? "border-success bg-success text-success-foreground"
              : "border-gray-300 hover:border-success/50"
          )}
        >
          {isCompleted ? <Check size={14} /> : <Clock size={14} />}
        </button>
        <div className="flex flex-col gap-1">
          <span className={cn("font-medium", isCompleted && "text-success")}>{title}</span>
          <Badge variant="outline" className="w-fit">{category}</Badge>
        </div>
      </div>
    </Card>
  );
};
