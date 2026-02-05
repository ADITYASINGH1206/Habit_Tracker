import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface HabitCardProps {
  id: string;
  name: string;
  description: string | null;
  color: string;
  isCompleted: boolean;
  onToggle: () => void;
  onDelete: () => void;
}

export function HabitCard({ 
  name, 
  description, 
  color, 
  isCompleted, 
  onToggle, 
  onDelete 
}: HabitCardProps) {
  return (
    <Card className={cn(
      "p-4 transition-all duration-300 hover:shadow-md group",
      isCompleted && "ring-2 ring-primary/30 bg-primary/5"
    )}>
      <div className="flex items-center gap-4">
        <button
          onClick={onToggle}
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0",
            isCompleted
              ? "bg-primary text-primary-foreground shadow-lg scale-105"
              : "border-2 border-muted-foreground/30 hover:border-primary hover:bg-primary/10"
          )}
          style={!isCompleted ? { borderColor: color } : { backgroundColor: color }}
        >
          {isCompleted && <Check className="h-5 w-5" />}
        </button>
        
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-medium text-foreground truncate transition-all",
            isCompleted && "line-through opacity-60"
          )}>
            {name}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground truncate">{description}</p>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}
