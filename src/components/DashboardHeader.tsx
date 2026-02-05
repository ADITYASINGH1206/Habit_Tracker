import { LogOut, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';

interface DashboardHeaderProps {
  completedToday: number;
  totalHabits: number;
}

export function DashboardHeader({ completedToday, totalHabits }: DashboardHeaderProps) {
  const { signOut, user } = useAuth();
  const today = new Date();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl gradient-success flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display font-bold text-lg text-foreground">HabitFlow</h1>
            <p className="text-sm text-muted-foreground">{format(today, 'EEEE, MMMM d')}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm text-muted-foreground">Today's progress</p>
            <p className="font-display font-semibold text-foreground">
              {completedToday}/{totalHabits} completed
            </p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={signOut} title="Sign out">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
