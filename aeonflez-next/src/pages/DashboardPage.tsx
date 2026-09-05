import DashboardLayout from '../components/DashboardLayout'
import { useAuth } from '../context/AuthContext'
import { useTransactions, useTasks, useHabits } from '../hooks'
import { Wallet, CheckCircle, TrendingUp, BookOpen } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function DashboardPage() {
  const { user } = useAuth()
  const { transactions } = useTransactions()
  const { tasks } = useTasks()
  const { habits } = useHabits()

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const completedTasks = tasks.filter(t => t.completed).length
  const totalTasks = tasks.length

  const activeHabits = habits.filter(h => h.streak > 0).length

  const stats = [
    { icon: Wallet, label: 'Total Income', value: `$${totalIncome.toFixed(2)}`, color: 'from-green-500 to-emerald-600' },
    { icon: Wallet, label: 'Total Expenses', value: `$${totalExpenses.toFixed(2)}`, color: 'from-red-500 to-rose-600' },
    { icon: CheckCircle, label: 'Tasks Completed', value: `${completedTasks}/${totalTasks}`, color: 'from-blue-500 to-cyan-600' },
    { icon: TrendingUp, label: 'Active Habits', value: activeHabits.toString(), color: 'from-purple-500 to-pink-600' },
  ]

  // Mock chart data - you'd generate this from real transaction data
  const chartData = [
    { name: 'Mon', income: 4000, expenses: 2400 },
    { name: 'Tue', income: 3000, expenses: 1398 },
    { name: 'Wed', income: 2000, expenses: 9800 },
    { name: 'Thu', income: 2780, expenses: 3908 },
    { name: 'Fri', income: 1890, expenses: 4800 },
    { name: 'Sat', income: 2390, expenses: 3800 },
    { name: 'Sun', income: 3490, expenses: 4300 },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-white/60">Here's what's happening in your command center today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={24} className="text-white" />
              </div>
              <p className="text-white/60 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Weekly Overview</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.6)" />
                <YAxis stroke="rgba(255,255,255,0.6)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'income' ? 'bg-green-500/20' : 'bg-red-500/20'
                    }`}>
                      <Wallet size={18} className={transaction.type === 'income' ? 'text-green-400' : 'text-red-400'} />
                    </div>
                    <div>
                      <p className="text-white font-medium">{transaction.description}</p>
                      <p className="text-white/60 text-sm">{transaction.category}</p>
                    </div>
                  </div>
                  <p className={`font-semibold ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))}
              {transactions.length === 0 && (
                <p className="text-white/60 text-center py-8">No transactions yet. Start tracking!</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <BookOpen size={20} />
            New Journal Entry
          </button>
          <button className="p-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Wallet size={20} />
            Add Transaction
          </button>
          <button className="p-4 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <CheckCircle size={20} />
            Create Task
          </button>
          <button className="p-4 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <TrendingUp size={20} />
            Log Habit
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
