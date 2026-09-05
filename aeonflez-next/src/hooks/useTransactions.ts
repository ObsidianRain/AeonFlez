import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { getTransactions, addTransaction, updateTransaction, deleteTransaction } from '../lib/api'
import type { FinancialTransaction } from '../types'

export function useTransactions() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadTransactions() {
      if (!user) {
        setTransactions([])
        setLoading(false)
        return
      }

      try {
        const data = await getTransactions(user.id)
        setTransactions(data)
        setError(null)
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    loadTransactions()
  }, [user])

  const add = async (transaction: Omit<FinancialTransaction, 'id' | 'created_at'>) => {
    if (!user) throw new Error('Not authenticated')
    const newTransaction = await addTransaction({ ...transaction, user_id: user.id })
    setTransactions(prev => [newTransaction, ...prev])
    return newTransaction
  }

  const update = async (id: string, updates: Partial<FinancialTransaction>) => {
    const updated = await updateTransaction(id, updates)
    setTransactions(prev => prev.map(t => t.id === id ? updated : t))
    return updated
  }

  const remove = async (id: string) => {
    await deleteTransaction(id)
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  return { transactions, loading, error, add, update, remove }
}
