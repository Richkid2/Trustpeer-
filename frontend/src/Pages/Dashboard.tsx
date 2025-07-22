import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { 
  Star, 
  DollarSign, 
  Search, 
  CheckCircle, 
  AlertTriangle,
  Filter,
  ChevronDown,
  Eye,
  Briefcase
} from 'lucide-react'
import { multiWalletService } from '../Services/wallet.service'
import { ratingService } from '../Services/rating.service'
import { escrowService } from '../Services/escrow.service'
import type { TradeDetails } from '../Services/escrow.service'
import DashboardLayout from '../Components/Layout/DashboardLayout'

interface LocationState {
  username?: string
  onboardingComplete?: boolean
  telegramAdded?: boolean
  telegramHandle?: string
  telegramSkipped?: boolean
  skippedTelegram?: boolean
}

interface VerificationResult {
  found: boolean
  trader: string
  trustScore: string
  totalTrades: number
  completedTrades: number
  memberSince: string
}

const Dashboard = () => {
  const location = useLocation()
  const locationState = (location.state as LocationState) || {}
  const [loading, setLoading] = useState(true)
  const [username] = useState(locationState.username || 'John Doe')
  const [telegramHandle, setTelegramHandle] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)

  // Mock data for the design
  const mockTrades = [
    { id: 'UM65921', trader: 'David Michael', tradeAmount: 500000, payAmount: 50.25, status: 'In Progress', date: '11th Nov 2025', timestamp: new Date('2025-11-11').getTime() },
    { id: 'KJR5754', trader: 'David Michael', tradeAmount: 500000, payAmount: 50.25, status: 'Completed', date: '5th May 2025', timestamp: new Date('2025-05-05').getTime() },
    { id: 'QRT5534', trader: 'David Michael', tradeAmount: 500000, payAmount: 50.25, status: 'Cancelled', date: '20th Oct 2025', timestamp: new Date('2025-10-20').getTime() },
    { id: 'TL22931', trader: 'David Michael', tradeAmount: 500000, payAmount: 50.25, status: 'Completed', date: '5th Nov 2025', timestamp: new Date('2025-11-05').getTime() },
    { id: 'XY44981', trader: 'Sarah Johnson', tradeAmount: 750000, payAmount: 75.30, status: 'In Progress', date: '15th Nov 2025', timestamp: new Date('2025-11-15').getTime() },
    { id: 'AB78654', trader: 'Mike Wilson', tradeAmount: 250000, payAmount: 25.10, status: 'Completed', date: '8th Nov 2025', timestamp: new Date('2025-11-08').getTime() }
  ]

  // Filter and sort trades
  const filteredTrades = mockTrades
    .filter(trade => {
      const matchesSearch = !searchQuery || 
        trade.trader.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trade.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesFilter = filterStatus === 'all' || 
        trade.status.toLowerCase().replace(' ', '') === filterStatus.toLowerCase()
      return matchesSearch && matchesFilter
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
        default:
          return 0
      }
    })

  // Verify trader handler
  const handleVerifyTrader = async () => {
    if (!telegramHandle.trim()) return

    setIsVerifying(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Mock verification result
    const mockResult: VerificationResult = {
      found: Math.random() > 0.3,
      trader: telegramHandle,
      trustScore: (4.0 + Math.random() * 1.0).toFixed(1),
      totalTrades: Math.floor(50 + Math.random() * 200),
      completedTrades: Math.floor(45 + Math.random() * 180),
      memberSince: ['Jan 2024', 'Mar 2024', 'May 2024', 'Aug 2023'][Math.floor(Math.random() * 4)]
    }
    
    setVerificationResult(mockResult)
    setIsVerifying(false)
  }

  // Calculate dynamic stats
  const completedTrades = mockTrades.filter(trade => trade.status === 'Completed').length
  const totalVolume = mockTrades.reduce((sum, trade) => sum + trade.payAmount, 0)
  const averageRating = 4.5

  // Clear verification result when input changes
  useEffect(() => {
    if (verificationResult) {
      setVerificationResult(null)
    }
  }, [telegramHandle])

  useEffect(() => {
    const checkWalletAndLoadData = async () => {
      const state = multiWalletService.getState()
      
      if (state.isConnected && state.primaryWallet?.address) {
        try {
          const traderProfile = await ratingService.getTraderProfile(state.primaryWallet.address)
          console.log('Trader profile loaded:', traderProfile)
          
          const trades = await escrowService.getAllTrades()
          const userTrades = trades.filter((trade: TradeDetails) => 
            trade.buyer === state.primaryWallet?.address || 
            trade.seller === state.primaryWallet?.address
          )
          console.log('User trades loaded:', userTrades)
        } catch (error) {
          console.log('Error loading data:', error)
        }
      }
      
      setLoading(false)
    }

    checkWalletAndLoadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080909] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ee5f0a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout 
      pageTitle="Dashboard" 
      pageDescription={`Welcome back, ${username}`}
    >
      {/* Mobile-responsive Content */}
      <div className="flex-1 p-4 lg:p-8">
          {/* Mobile-responsive grid: 1 column on mobile, 4 columns on xl+ */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
            {/* Left Side - Stats and Trade History: Full width on mobile, 3/4 on xl+ */}
            <div className="xl:col-span-3 space-y-6 lg:space-y-8">
              {/* Stats Cards - Responsive grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Completed Trades</p>
                      <p className="text-white text-xl lg:text-2xl font-bold">{completedTrades}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
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
                  transition={{ delay: 0.2 }}
                  className="bg-[#0f1011] rounded-xl p-4 lg:p-6 sm:col-span-2 lg:col-span-1"
                >
                  <div className="flex items-center gap-3 lg:gap-4">
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                      <Star className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 text-sm">Average Rating</p>
                      <div className="flex items-center gap-2">
                        <p className="text-white text-xl lg:text-2xl font-bold">{averageRating}</p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star} 
                              className={`w-3 h-3 lg:w-4 lg:h-4 ${
                                star <= Math.floor(averageRating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Trade History - Mobile responsive */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h2 className="text-lg lg:text-xl font-semibold text-white">Recent Trades</h2>
                  {/* Mobile-responsive filters */}
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search trades..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full sm:w-auto bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#ee5f0a]"
                      />
                    </div>
                    <div className="flex gap-2">
                      <div className="relative flex-1 sm:flex-none">
                        <select
                          value={filterStatus}
                          onChange={(e) => setFilterStatus(e.target.value)}
                          className="appearance-none w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                        >
                          <option value="all">All Status</option>
                          <option value="completed">Completed</option>
                          <option value="inprogress">In Progress</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                      <div className="relative flex-1 sm:flex-none">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="appearance-none w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                        >
                          <option value="date">Sort by Date</option>
                          <option value="amount">Sort by Amount</option>
                          <option value="trader">Sort by Trader</option>
                          <option value="status">Sort by Status</option>
                        </select>
                        <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile-responsive table */}
                <div className="overflow-x-auto">
                  <div className="min-w-full">
                    {/* Desktop table header - hidden on mobile */}
                    <div className="hidden sm:grid grid-cols-6 gap-4 p-3 text-xs font-medium text-gray-400 border-b border-gray-800 mb-4">
                      <div>Trade ID</div>
                      <div>Trader</div>
                      <div>Amount (USDT)</div>
                      <div>Status</div>
                      <div>Date</div>
                      <div>Action</div>
                    </div>
                    
                    <div className="space-y-3">
                      {filteredTrades.length > 0 ? filteredTrades.map((trade) => (
                        <motion.div
                          key={trade.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="sm:grid grid-cols-6 gap-4 p-3 sm:p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors"
                        >
                          {/* Mobile Layout - Show on mobile only */}
                          <div className="sm:hidden space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-gradient-to-br from-[#ee5f0a] to-[#d54f08] rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs font-bold">
                                    {trade.trader.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{trade.trader}</p>
                                  <p className="text-gray-400 text-xs">#{trade.id}</p>
                                </div>
                              </div>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                trade.status === 'Completed' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : trade.status === 'In Progress'
                                  ? 'bg-blue-500/20 text-blue-500'
                                  : 'bg-red-500/20 text-red-500'
                              }`}>
                                {trade.status}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-white font-medium">${trade.payAmount} USDT</p>
                                <p className="text-gray-400 text-xs">{trade.date}</p>
                              </div>
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>

                          {/* Desktop Layout - Hidden on mobile */}
                          <div className="hidden sm:contents">
                            <div className="flex items-center">
                              <span className="text-gray-300 font-mono text-sm">#{trade.id}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-gradient-to-br from-[#ee5f0a] to-[#d54f08] rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">
                                  {trade.trader.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <span className="text-white">{trade.trader}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="text-white font-medium">${trade.payAmount}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                trade.status === 'Completed' 
                                  ? 'bg-green-500/20 text-green-500' 
                                  : trade.status === 'In Progress'
                                  ? 'bg-blue-500/20 text-blue-500'
                                  : 'bg-red-500/20 text-red-500'
                              }`}>
                                {trade.status}
                              </span>
                            </div>
                            
                            <div className="flex items-center">
                              <span className="text-gray-400">{trade.date}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-700"
                              >
                                <Eye className="w-4 h-4" />
                              </motion.button>
                            </div>
                          </div>
                        </motion.div>
                      )) : (
                        <div className="text-center py-8">
                          <Briefcase className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 mb-2">No trades found</p>
                          <p className="text-gray-500 text-sm">Your trade history will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right Side - Verify Trader: Full width on mobile, 1/4 on xl+ */}
            <div className="xl:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-[#0f1011] rounded-xl p-4 lg:p-6 xl:sticky xl:top-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Verify Trader</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Enter a trader's Telegram handle to check their reputation and trading history.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-gray-400 text-sm mb-2 block">Telegram Handle</label>
                    <input
                      type="text"
                      placeholder="@username"
                      value={telegramHandle}
                      onChange={(e) => setTelegramHandle(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#ee5f0a]"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: isVerifying ? 1 : 1.02 }}
                    whileTap={{ scale: isVerifying ? 1 : 0.98 }}
                    onClick={handleVerifyTrader}
                    disabled={isVerifying || !telegramHandle.trim()}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      isVerifying || !telegramHandle.trim()
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-[#ee5f0a] hover:bg-[#d54f08] text-white'
                    }`}
                  >
                    {isVerifying ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify Trader'
                    )}
                  </motion.button>
                </div>

                {verificationResult && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-4 p-4 rounded-lg border ${
                      verificationResult.found
                        ? 'bg-green-500/10 border-green-500/30 text-green-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {verificationResult.found ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Trader Found</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <p><span className="text-gray-400">Username:</span> {verificationResult.trader}</p>
                          <p><span className="text-gray-400">Trust Score:</span> {verificationResult.trustScore}/5.0</p>
                          <p><span className="text-gray-400">Total Trades:</span> {verificationResult.totalTrades}</p>
                          <p><span className="text-gray-400">Completed:</span> {verificationResult.completedTrades}</p>
                          <p><span className="text-gray-400">Member Since:</span> {verificationResult.memberSince}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Trader not found or not verified</span>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
    </DashboardLayout>
  )
}

export default Dashboard
