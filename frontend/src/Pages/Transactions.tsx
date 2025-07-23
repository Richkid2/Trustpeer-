import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Briefcase, 
  Star, 
  DollarSign, 
  Search, 
  CheckCircle, 
  Filter,
  ChevronDown,
  Eye,
  ArrowUpRight,
  ArrowDownLeft,
  Calendar,
  Download
} from 'lucide-react'
import DashboardLayout from '../Components/Layout/DashboardLayout'

const Transactions = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterType, setFilterType] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [dateRange, setDateRange] = useState('all')

  // Extended mock data for transactions
  const mockTransactions = [
    { id: 'UM65921', trader: 'David Michael', type: 'Buy', tradeAmount: 500000, payAmount: 50.25, status: 'In Progress', date: '11th Nov 2025', timestamp: new Date('2025-11-11').getTime(), fee: 0.25 },
    { id: 'KJR5754', trader: 'David Michael', type: 'Sell', tradeAmount: 500000, payAmount: 50.25, status: 'Completed', date: '5th May 2025', timestamp: new Date('2025-05-05').getTime(), fee: 0.25 },
    { id: 'QRT5534', trader: 'Sarah Johnson', type: 'Buy', tradeAmount: 750000, payAmount: 75.30, status: 'Cancelled', date: '20th Oct 2025', timestamp: new Date('2025-10-20').getTime(), fee: 0.38 },
    { id: 'TL22931', trader: 'Mike Wilson', type: 'Sell', tradeAmount: 250000, payAmount: 25.10, status: 'Completed', date: '5th Nov 2025', timestamp: new Date('2025-11-05').getTime(), fee: 0.13 },
    { id: 'XY44981', trader: 'Sarah Johnson', type: 'Buy', tradeAmount: 750000, payAmount: 75.30, status: 'In Progress', date: '15th Nov 2025', timestamp: new Date('2025-11-15').getTime(), fee: 0.38 },
    { id: 'AB78654', trader: 'Mike Wilson', type: 'Sell', tradeAmount: 250000, payAmount: 25.10, status: 'Completed', date: '8th Nov 2025', timestamp: new Date('2025-11-08').getTime(), fee: 0.13 },
    { id: 'CD99123', trader: 'Emma Brown', type: 'Buy', tradeAmount: 1000000, payAmount: 100.50, status: 'Completed', date: '1st Nov 2025', timestamp: new Date('2025-11-01').getTime(), fee: 0.50 },
    { id: 'EF12456', trader: 'James Wilson', type: 'Sell', tradeAmount: 300000, payAmount: 30.15, status: 'Disputed', date: '28th Oct 2025', timestamp: new Date('2025-10-28').getTime(), fee: 0.15 },
    { id: 'GH78912', trader: 'Lisa Davis', type: 'Buy', tradeAmount: 850000, payAmount: 85.75, status: 'Completed', date: '25th Oct 2025', timestamp: new Date('2025-10-25').getTime(), fee: 0.43 },
    { id: 'IJ34567', trader: 'Robert Jones', type: 'Sell', tradeAmount: 450000, payAmount: 45.22, status: 'In Progress', date: '22nd Oct 2025', timestamp: new Date('2025-10-22').getTime(), fee: 0.23 }
  ]

  // Filter and sort transactions
  const filteredTransactions = mockTransactions
    .filter(transaction => {
      const matchesSearch = !searchQuery || 
        transaction.trader.toLowerCase().includes(searchQuery.toLowerCase()) ||
        transaction.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || 
        transaction.status.toLowerCase().replace(' ', '') === filterStatus.toLowerCase()
      const matchesType = filterType === 'all' || 
        transaction.type.toLowerCase() === filterType.toLowerCase()
      
      let matchesDate = true
      if (dateRange !== 'all') {
        const now = new Date()
        const transactionDate = new Date(transaction.timestamp)
        switch (dateRange) {
          case 'today':
            matchesDate = transactionDate.toDateString() === now.toDateString()
            break
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            matchesDate = transactionDate >= weekAgo
            break
          case 'month':
            const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
            matchesDate = transactionDate >= monthAgo
            break
        }
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDate
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.timestamp - a.timestamp
        case 'amount':
          return b.payAmount - a.payAmount
        case 'trader':
          return a.trader.localeCompare(b.trader)
        case 'status':
          return a.status.localeCompare(b.status)
        case 'type':
          return a.type.localeCompare(b.type)
        default:
          return 0
      }
    })

  // Calculate transaction stats
  const totalTransactions = mockTransactions.length
  const completedTransactions = mockTransactions.filter(t => t.status === 'Completed').length
  const totalVolume = mockTransactions.reduce((sum, t) => sum + t.payAmount, 0)
  const totalFees = mockTransactions.reduce((sum, t) => sum + t.fee, 0)

  // Export transactions
  const handleExportTransactions = () => {
    console.log('Exporting transactions...')
    // Here you would implement CSV/PDF export functionality
  }

  return (
    <DashboardLayout 
      pageTitle="Transactions" 
      pageDescription="View and manage all your trading transactions"
    >
      <div className="p-4 lg:p-8">
        {/* Transaction Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-900"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#ee5f0a]/10 rounded-xl flex items-center justify-center">
                <Briefcase className="w-5 h-5 lg:w-6 lg:h-6 text-[#ee5f0a]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Transactions</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{totalTransactions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-900"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#ee5f0a]/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-[#ee5f0a]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{completedTransactions}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-900"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-[#ee5f0a]/10 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-[#ee5f0a]" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Volume</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{totalVolume.toFixed(2)} USDT</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-900"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Star className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Fees</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{totalFees.toFixed(2)} USDT</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Transaction History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0f1011] rounded-xl border border-gray-900"
        >
          <div className="p-4 lg:p-6 border-b border-gray-900">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg lg:text-xl font-semibold text-white">Transaction History</h2>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleExportTransactions}
                className="flex items-center gap-2 px-4 py-2 bg-[#ee5f0a] hover:bg-[#d54f08] text-white rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-4">
              <div className="relative w-full sm:w-auto">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name and ID"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-auto bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#ee5f0a]"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-gray-900 border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="inprogress">In Progress</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="disputed">Disputed</option>
                  </select>
                  <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="appearance-none bg-gray-900 border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="all">All Types</option>
                    <option value="buy">Buy</option>
                    <option value="sell">Sell</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="appearance-none bg-gray-900 border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <Calendar className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-900 border border-gray-800 rounded-lg px-3 lg:px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="trader">Sort by Trader</option>
                    <option value="status">Sort by Status</option>
                    <option value="type">Sort by Type</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/30">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Trade Name</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Trade ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Trade Amount (₦)</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Amount (USDT)</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Fee</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Date</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-900">
                {filteredTransactions.length > 0 ? filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {transaction.type === 'Buy' ? (
                          <div className="w-6 h-6 bg-[#ee5f0a]/10 rounded-full flex items-center justify-center">
                            <ArrowDownLeft className="w-3 h-3 text-[#ee5f0a]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 bg-red-500/10 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="w-3 h-3 text-red-700" />
                          </div>
                        )}
                        <span className={`text-sm font-medium ${
                          transaction.type === 'Buy' ? 'text-[#ee5f0a]' : 'text-white'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {transaction.trader.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-white font-medium text-sm">{transaction.trader}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{transaction.id}</td>
                    <td className="px-6 py-4 text-white text-sm">₦{transaction.tradeAmount.toLocaleString()}</td>
                    <td className="px-6 py-4 text-white text-sm font-medium">{transaction.payAmount} USDT</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{transaction.fee} USDT</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        transaction.status === 'Completed' 
                          ? 'bg-[#ee5f0a]/10 text-[#ee5f0a]'
                          : transaction.status === 'In Progress'
                          ? 'bg-gray-700/20 text-gray-300'
                          : transaction.status === 'Disputed'
                          ? 'bg-gray-700/20 text-gray-300'
                          : 'bg-gray-700/20 text-gray-300'
                      }`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{transaction.date}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => console.log('View transaction details:', transaction.id)}
                        className="text-gray-400 hover:text-white transition-colors p-1"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No transactions found</p>
                        <p className="text-sm">No transactions match your current search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Cards */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredTransactions.length > 0 ? filteredTransactions.map((transaction) => (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-900/30 rounded-lg p-4 space-y-3 border border-gray-800/50"
              >
                {/* Header with Type and Status */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {transaction.type === 'Buy' ? (
                      <div className="w-8 h-8 bg-[#ee5f0a]/10 rounded-full flex items-center justify-center">
                        <ArrowDownLeft className="w-4 h-4 text-[#ee5f0a]" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-gray-700/20 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div>
                      <span className={`text-sm font-semibold ${
                        transaction.type === 'Buy' ? 'text-[#ee5f0a]' : 'text-white'
                      }`}>
                        {transaction.type}
                      </span>
                      <p className="text-xs text-gray-400">ID: {transaction.id}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    transaction.status === 'Completed' 
                      ? 'bg-[#ee5f0a]/10 text-[#ee5f0a]'
                      : transaction.status === 'In Progress'
                      ? 'bg-gray-700/20 text-gray-300'
                      : transaction.status === 'Disputed'
                      ? 'bg-gray-700/20 text-gray-300'
                      : 'bg-gray-700/20 text-gray-300'
                  }`}>
                    {transaction.status}
                  </span>
                </div>

                {/* Trader Info */}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {transaction.trader.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{transaction.trader}</p>
                    <p className="text-gray-400 text-xs">{transaction.date}</p>
                  </div>
                </div>

                {/* Amount Display */}
                <div className="bg-gray-800/50 rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-xs">USDT Amount</p>
                      <p className="text-white font-semibold text-lg">{transaction.payAmount} USDT</p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-xs">Naira Equivalent</p>
                      <p className="text-gray-300 text-sm">₦{transaction.tradeAmount.toLocaleString()}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                  <div className="text-xs text-gray-400">
                    Fee: {transaction.fee} USDT
                  </div>
                  <button 
                    onClick={() => console.log('View transaction details:', transaction.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-[#ee5f0a]/10 hover:bg-[#ee5f0a]/20 text-[#ee5f0a] rounded-lg transition-colors text-sm font-medium"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-12">
                <Search className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400 text-lg font-medium mb-2">No transactions found</p>
                <p className="text-gray-500 text-sm">No transactions match your current search criteria</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default Transactions
