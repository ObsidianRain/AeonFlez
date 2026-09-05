export interface User {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
}

export interface FinancialTransaction {
  id: string;
  user_id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  description: string;
  date: string;
  account?: string;
  created_at: string;
}

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  limit: number;
  spent: number;
  period: 'monthly' | 'weekly';
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tags?: string[];
  mood?: string;
  audio_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  due_date?: string;
  priority: 'low' | 'medium' | 'high';
  project_id?: string;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  status: 'active' | 'completed' | 'archived';
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  name: string;
  streak: number;
  completed_dates: string[];
  goal: number;
  unit: string;
  created_at: string;
}

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  notes?: string;
  created_at: string;
}

export interface FileItem {
  id: string;
  user_id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  created_at: string;
}

export interface DashboardMetric {
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'neutral';
  data: number[];
}
