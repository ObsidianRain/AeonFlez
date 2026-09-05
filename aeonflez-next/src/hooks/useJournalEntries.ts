import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from '../lib/api'
import type { JournalEntry } from '../types'

export function useJournalEntries() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadEntries() {
      if (!user) {
        setEntries([])
        setLoading(false)
        return
      }

      try {
        const data = await getJournalEntries(user.id)
        setEntries(data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadEntries()
  }, [user])

  const add = async (entry: Omit<JournalEntry, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('Not authenticated')
    const newEntry = await addJournalEntry({ ...entry, user_id: user.id })
    setEntries(prev => [newEntry, ...prev])
    return newEntry
  }

  const update = async (id: string, updates: Partial<JournalEntry>) => {
    const updated = await updateJournalEntry(id, updates)
    setEntries(prev => prev.map(e => e.id === id ? updated : e))
    return updated
  }

  const remove = async (id: string) => {
    await deleteJournalEntry(id)
    setEntries(prev => prev.filter(e => e.id !== id))
  }

  return { entries, loading, error, add, update, remove }
}
