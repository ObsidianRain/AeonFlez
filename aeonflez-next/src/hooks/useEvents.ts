import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getEvents, addEvent, updateEvent, deleteEvent } from '../lib/api'
import type { Event as CalendarEvent } from '../types'

export function useEvents() {
  const { user } = useAuth()
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadEvents() {
      if (!user) {
        setEvents([])
        setLoading(false)
        return
      }

      try {
        const data = await getEvents(user.id)
        setEvents(data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [user])

  const add = async (event: Omit<CalendarEvent, 'id' | 'created_at'>) => {
    if (!user) throw new Error('Not authenticated')
    const newEvent = await addEvent({ ...event, user_id: user.id })
    setEvents(prev => [newEvent, ...prev])
    return newEvent
  }

  const update = async (id: string, updates: Partial<CalendarEvent>) => {
    const updated = await updateEvent(id, updates)
    setEvents(prev => prev.map(e => e.id === id ? updated : e))
    return updated
  }

  const remove = async (id: string) => {
    await deleteEvent(id)
    setEvents(prev => prev.filter(e => e.id !== id))
  }

  return { events, loading, error, add, update, remove }
}
