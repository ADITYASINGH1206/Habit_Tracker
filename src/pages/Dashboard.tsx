import { format } from 'date-fns';
import { useHabits } from '@/hooks/useHabits';
import { DashboardHeader } from '@/components/DashboardHeader';
import { HabitCard } from '@/components/HabitCard';
import { AddHabitDialog } from '@/components/AddHabitDialog';
import { HabitChart } from '@/components/HabitChart';
import { Skeleton } from '@/components/ui/skeleton';
import { Target } from 'lucide-react';

export default function Dashboard() {
  const { habits, completions, loading, addHabit, deleteHabit, toggleCompletion, isCompleted } = useHabits();
  const today = format(new Date(), 'yyyy-MM-dd');
  
  const completedToday = habits.filter(h => isCompleted(h.id, today)).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-16 w-full" />
          <div className="grid gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader completedToday={completedToday} totalHabits={habits.length} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Habits Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-foreground">Today's Habits</h2>
                <p className="text-muted-foreground">Check off what you've accomplished</p>
              </div>
              <AddHabitDialog onAdd={addHabit} />
            </div>

            {habits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="h-20 w-20 rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <Target className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                  No habits yet
                </h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  Start building better habits by adding your first one. Track it daily and watch your progress grow!
                </p>
                <AddHabitDialog onAdd={addHabit} />
              </div>
            ) : (
              <div className="grid gap-3">
                {habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    id={habit.id}
                    name={habit.name}
                    description={habit.description}
                    color={habit.color}
                    isCompleted={isCompleted(habit.id, today)}
                    onToggle={() => toggleCompletion(habit.id, today)}
                    onDelete={() => deleteHabit(habit.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Analytics Section */}
          <div className="space-y-6">
            <HabitChart habits={habits} completions={completions} />
            
            {/* Stats Summary */}
            {habits.length > 0 && (
              <div className="grid grid-cols-2 gap-4">
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-3xl font-display font-bold text-primary">{habits.length}</p>
                  <p className="text-sm text-muted-foreground">Active Habits</p>
                </div>
                <div className="glass rounded-xl p-4 text-center">
                  <p className="text-3xl font-display font-bold text-accent">{completions.length}</p>
                  <p className="text-sm text-muted-foreground">Total Completions</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
