import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import { Habit, HabitCompletion } from '@/hooks/useHabits';

interface HabitChartProps {
  habits: Habit[];
  completions: HabitCompletion[];
}

export function HabitChart({ habits, completions }: HabitChartProps) {
  const weeklyData = useMemo(() => {
    const today = new Date();
    const start = startOfWeek(today, { weekStartsOn: 1 });
    const end = endOfWeek(today, { weekStartsOn: 1 });
    const days = eachDayOfInterval({ start, end });

    return days.map(day => {
      const dateStr = format(day, 'yyyy-MM-dd');
      const completed = completions.filter(c => c.completed_date === dateStr).length;
      return {
        name: format(day, 'EEE'),
        completed,
        total: habits.length,
        date: dateStr,
      };
    });
  }, [habits, completions]);

  const monthlyData = useMemo(() => {
    const today = new Date();
    const weeks: { name: string; completed: number; total: number }[] = [];
    
    for (let i = 3; i >= 0; i--) {
      const weekStart = startOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
      const weekEnd = endOfWeek(subDays(today, i * 7), { weekStartsOn: 1 });
      const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
      
      let completed = 0;
      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        completed += completions.filter(c => c.completed_date === dateStr).length;
      });
      
      weeks.push({
        name: `Week ${4 - i}`,
        completed,
        total: habits.length * 7,
      });
    }
    
    return weeks;
  }, [habits, completions]);

  const allTimeData = useMemo(() => {
    const today = new Date();
    const months: { name: string; completed: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const start = startOfMonth(monthDate);
      const end = endOfMonth(monthDate);
      const days = eachDayOfInterval({ start, end });
      
      let completed = 0;
      days.forEach(day => {
        const dateStr = format(day, 'yyyy-MM-dd');
        completed += completions.filter(c => c.completed_date === dateStr).length;
      });
      
      months.push({
        name: format(monthDate, 'MMM'),
        completed,
      });
    }
    
    return months;
  }, [completions]);

  if (habits.length === 0) {
    return (
      <Card className="glass">
        <CardHeader>
          <CardTitle className="font-display text-lg">Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            Add some habits to see your progress charts
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle className="font-display text-lg">Progress Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="week">
          <TabsList className="mb-4">
            <TabsTrigger value="week">This Week</TabsTrigger>
            <TabsTrigger value="month">Monthly</TabsTrigger>
            <TabsTrigger value="all">6 Months</TabsTrigger>
          </TabsList>
          
          <TabsContent value="week">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} habits`, 'Completed']}
                />
                <Bar dataKey="completed" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="month">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} completions`, 'Total']}
                />
                <Bar dataKey="completed" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="all">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={allTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value} completions`, 'Total']}
                />
                <Bar dataKey="completed" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
