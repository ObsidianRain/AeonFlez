import { createClient } from '../lib/supabase/client'
import type { 
  FinancialTransaction, 
  Budget, 
  JournalEntry, 
  Task, 
  Project, 
  Habit, 
  Event as CalendarEvent,
  FileItem,
  DashboardMetric 
} from '../types'

const supabase = createClient()

// Financial Transactions
export async function getTransactions(userId: string) {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  
  if (error) throw error
  return data as FinancialTransaction[]
}

export async function addTransaction(transaction: Omit<FinancialTransaction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert([transaction])
    .select()
    .single()
  
  if (error) throw error
  return data as FinancialTransaction
}

export async function updateTransaction(id: string, updates: Partial<FinancialTransaction>) {
  const { data, error } = await supabase
    .from('transactions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as FinancialTransaction
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Budgets
export async function getBudgets(userId: string) {
  const { data, error } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data as Budget[]
}

export async function updateBudget(id: string, updates: Partial<Budget>) {
  const { data, error } = await supabase
    .from('budgets')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Budget
}

// Journal Entries
export async function getJournalEntries(userId: string) {
  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as JournalEntry[]
}

export async function addJournalEntry(entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .insert([{ ...entry, updated_at: new Date().toISOString() }])
    .select()
    .single()
  
  if (error) throw error
  return data as JournalEntry
}

export async function updateJournalEntry(id: string, updates: Partial<JournalEntry>) {
  const { data, error } = await supabase
    .from('journal_entries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as JournalEntry
}

export async function deleteJournalEntry(id: string) {
  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Tasks
export async function getTasks(userId: string) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as Task[]
}

export async function addTask(task: Omit<Task, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single()
  
  if (error) throw error
  return data as Task
}

export async function updateTask(id: string, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Task
}

export async function deleteTask(id: string) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Projects
export async function getProjects(userId: string) {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data as Project[]
}

export async function addProject(project: Omit<Project, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single()
  
  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Project
}

// Habits
export async function getHabits(userId: string) {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', userId)
  
  if (error) throw error
  return data as Habit[]
}

export async function addHabit(habit: Omit<Habit, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('habits')
    .insert([habit])
    .select()
    .single()
  
  if (error) throw error
  return data as Habit
}

export async function updateHabit(id: string, updates: Partial<Habit>) {
  const { data, error } = await supabase
    .from('habits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as Habit
}

export async function completeHabit(habitId: string, date: string) {
  const { data: habit, error: fetchError } = await supabase
    .from('habits')
    .select('completed_dates, streak')
    .eq('id', habitId)
    .single()
  
  if (fetchError) throw fetchError
  
  const completedDates = habit.completed_dates || []
  if (!completedDates.includes(date)) {
    const newDates = [...completedDates, date]
    const { data, error } = await supabase
      .from('habits')
      .update({ 
        completed_dates: newDates,
        streak: (habit.streak || 0) + 1
      })
      .eq('id', habitId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
  
  return habit
}

// Events
export async function getEvents(userId: string, startDate?: string, endDate?: string) {
  let query = supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('start_time', { ascending: true })
  
  if (startDate) {
    query = query.gte('start_time', startDate)
  }
  if (endDate) {
    query = query.lte('end_time', endDate)
  }
  
  const { data, error } = await query
  
  if (error) throw error
  return data as CalendarEvent[]
}

export async function addEvent(event: Omit<CalendarEvent, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single()
  
  if (error) throw error
  return data as CalendarEvent
}

export async function updateEvent(id: string, updates: Partial<CalendarEvent>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  
  if (error) throw error
  return data as CalendarEvent
}

export async function deleteEvent(id: string) {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Files
export async function getFiles(userId: string) {
  const { data, error } = await supabase
    .from('files')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as FileItem[]
}

export async function addFile(file: Omit<FileItem, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('files')
    .insert([file])
    .select()
    .single()
  
  if (error) throw error
  return data as FileItem
}

export async function deleteFile(id: string) {
  const { error } = await supabase
    .from('files')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}

// Dashboard Metrics
export async function getDashboardMetrics(_userId: string): Promise<DashboardMetric[]> {
  // This would typically aggregate data from multiple tables
  // For now, return mock structure - you'd implement real aggregation logic
  return [
    { label: 'Total Income', value: 0, change: 0, trend: 'neutral', data: [] },
    { label: 'Total Expenses', value: 0, change: 0, trend: 'neutral', data: [] },
    { label: 'Tasks Completed', value: 0, change: 0, trend: 'neutral', data: [] },
    { label: 'Habit Streaks', value: 0, change: 0, trend: 'neutral', data: [] },
  ]
}
