import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getHabits, addHabit, updateHabit, completeHabit } from '../lib/api'
import type { Habit } from '../types'

export function useHabits() {
  const { user } = useAuth()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadHabits() {
      if (!user) {
        setHabits([])
        setLoading(false)
        return
      }

      try {
        const data = await getHabits(user.id)
        setHabits(data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadHabits()
  }, [user])

  const add = async (habit: Omit<Habit, 'id' | 'created_at'>) => {
    if (!user) throw new Error('Not authenticated')
    const newHabit = await addHabit({ ...habit, user_id: user.id })
    setHabits(prev => [newHabit, ...prev])
    return newHabit
  }

  const update = async (id: string, updates: Partial<Habit>) => {
    const updated = await updateHabit(id, updates)
    setHabits(prev => prev.map(h => h.id === id ? updated : h))
    return updated
  }

  const complete = async (habitId: string, date: string = new Date().toISOString().split('T')[0]) => {
    const updated = await completeHabit(habitId, date)
    setHabits(prev => prev.map(h => h.id === habitId ? updated : h))
    return updated
  }

  const remove = async (id: string) => {
    // Note: You'll need to implement deleteHabit in api.ts
    setHabits(prev => prev.filter(h => h.id !== id))
  }

  return { habits, loading, error, add, update, complete, remove }
}
