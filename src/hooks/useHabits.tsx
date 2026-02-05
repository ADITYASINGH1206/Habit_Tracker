import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  color: string;
  created_at: string;
}

export interface HabitCompletion {
  id: string;
  habit_id: string;
  completed_date: string;
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completions, setCompletions] = useState<HabitCompletion[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchHabits = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to load habits', variant: 'destructive' });
    } else {
      setHabits(data || []);
    }
  };

  const fetchCompletions = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('habit_completions')
      .select('*');
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to load completions', variant: 'destructive' });
    } else {
      setCompletions(data || []);
    }
  };

  useEffect(() => {
    if (user) {
      setLoading(true);
      Promise.all([fetchHabits(), fetchCompletions()]).finally(() => setLoading(false));
    }
  }, [user]);

  const addHabit = async (name: string, description: string, color: string) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('habits')
      .insert({ name, description, color, user_id: user.id })
      .select()
      .single();
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to add habit', variant: 'destructive' });
    } else {
      setHabits(prev => [...prev, data]);
      toast({ title: 'Success', description: 'Habit created!' });
    }
  };

  const deleteHabit = async (id: string) => {
    const { error } = await supabase.from('habits').delete().eq('id', id);
    
    if (error) {
      toast({ title: 'Error', description: 'Failed to delete habit', variant: 'destructive' });
    } else {
      setHabits(prev => prev.filter(h => h.id !== id));
      setCompletions(prev => prev.filter(c => c.habit_id !== id));
      toast({ title: 'Deleted', description: 'Habit removed' });
    }
  };

  const toggleCompletion = async (habitId: string, date: string) => {
    if (!user) return;
    
    const existing = completions.find(
      c => c.habit_id === habitId && c.completed_date === date
    );
    
    if (existing) {
      const { error } = await supabase.from('habit_completions').delete().eq('id', existing.id);
      if (!error) {
        setCompletions(prev => prev.filter(c => c.id !== existing.id));
      }
    } else {
      const { data, error } = await supabase
        .from('habit_completions')
        .insert({ habit_id: habitId, completed_date: date, user_id: user.id })
        .select()
        .single();
      
      if (!error && data) {
        setCompletions(prev => [...prev, data]);
      }
    }
  };

  const isCompleted = (habitId: string, date: string) => {
    return completions.some(c => c.habit_id === habitId && c.completed_date === date);
  };

  return {
    habits,
    completions,
    loading,
    addHabit,
    deleteHabit,
    toggleCompletion,
    isCompleted,
  };
}
