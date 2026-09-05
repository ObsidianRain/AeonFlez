import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTasks, addTask, updateTask, deleteTask } from '../lib/api'
import type { Task } from '../types'

export function useTasks() {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTasks() {
      if (!user) {
        setTasks([])
        setLoading(false)
        return
      }

      try {
        const data = await getTasks(user.id)
        setTasks(data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [user])

  const add = async (task: Omit<Task, 'id' | 'created_at'>) => {
    if (!user) throw new Error('Not authenticated')
    const newTask = await addTask({ ...task, user_id: user.id })
    setTasks(prev => [newTask, ...prev])
    return newTask
  }

  const update = async (id: string, updates: Partial<Task>) => {
    const updated = await updateTask(id, updates)
    setTasks(prev => prev.map(t => t.id === id ? updated : t))
    return updated
  }

  const remove = async (id: string) => {
    await deleteTask(id)
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  return { tasks, loading, error, add, update, remove }
}
