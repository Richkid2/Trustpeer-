import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { multiWalletService } from '../Services/wallet.service'
import { ratingService } from '../Services/rating.service'
import { escrowService } from '../Services/escrow.service'
import TrustScoreCard from '../Components/TrustScoreCard'
import StarRating from '../Components/StarRating'
import type { TraderProfile, Rating } from '../Services/rating.service'
import type { TradeDetails } from '../Services/escrow.service'

const Dashboard = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<TraderProfile | null>(null)
  const [recentTrades, setRecentTrades] = useState<TradeDetails[]>([])
  const [recentRatings, setRecentRatings] = useState<Rating[]>([])
  const [walletState, setWalletState] = useState(multiWalletService.getState())
  const [activeTab, setActiveTab] = useState<'overview' | 'trades' | 'ratings' | 'settings'>('overview')

  const handleDisconnect = async () => {
    try {
      await multiWalletService.disconnectAll()
      setWalletState(multiWalletService.getState())
      navigate('/login')
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  useEffect(() => {
    const checkWalletAndLoadData = async () => {
      const state = multiWalletService.getState()
      setWalletState(state)
      
      if (state.isConnected && state.primaryWallet?.address) {
        try {
          // Load trader profile
          const traderProfile = await ratingService.getTraderProfile(state.primaryWallet.address)
          setProfile(traderProfile)
          
          // Load recent trades
          const trades = await escrowService.getAllTrades()
          const userTrades = trades.filter((trade: TradeDetails) => 
            trade.buyer === state.primaryWallet?.address || 
            trade.seller === state.primaryWallet?.address
          )
          setRecentTrades(userTrades.slice(0, 5)) // Show last 5 trades
          
          // Load recent ratings
          const ratings = await ratingService.getTraderRatings(state.primaryWallet.address)
          setRecentRatings(ratings.slice(0, 5)) // Show last 5 ratings
          
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        }
      }
      setLoading(false)
    }

    checkWalletAndLoadData()
    
    // Listen for wallet changes with a longer interval to avoid rapid checks
    const interval = setInterval(() => {
      const newState = multiWalletService.getState()
      if (newState.isConnected !== walletState.isConnected) {
        setWalletState(newState)
        if (newState.isConnected) {
          checkWalletAndLoadData()
        }
      }
    }, 2000) // Check every 2 seconds instead of 1

    return () => clearInterval(interval)
  }, [walletState.isConnected])

  const getTradeStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'active': return 'text-blue-400'
      case 'disputed': return 'text-red-400'
      default: return 'text-yellow-400'
    }
  }

  const getTradeStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅'
      case 'active': return '🔄'
      case 'disputed': return '⚠️'
      default: return '⏳'
    }
  }

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatAmount = (amount: number | string) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(numAmount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <div className="text-white font-medium">Loading dashboard...</div>
        </div>
      </div>
    )
  }

  if (!walletState.isConnected) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="max-w-md mx-auto mt-20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Connect Your Wallet</h1>
            <p className="text-slate-400">Please connect your wallet to access your dashboard</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-4 px-8 rounded-xl transition-colors"
          >
            Go to Login
          </motion.button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="p-2 bg-slate-800/50 hover:bg-slate-700 rounded-xl border border-slate-700/50 transition-colors"
            >
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Dashboard</h1>
              <p className="text-slate-400 text-sm md:text-base">Welcome back, trader!</p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex space-x-1 bg-slate-800/50 backdrop-blur-xl rounded-2xl p-1 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'trades', label: 'Trades', icon: '💼' },
              { id: 'ratings', label: 'Ratings', icon: '⭐' },
              { id: 'settings', label: 'Settings', icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 min-w-0 flex items-center justify-center gap-2 py-3 px-2 sm:px-4 rounded-xl font-medium transition-colors text-sm sm:text-base ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <span className="text-base sm:text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-slate-400 text-sm md:text-base">Total Trades</div>
                  <div className="text-xl md:text-2xl">💼</div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{profile?.totalTrades || 0}</div>
                <div className="text-green-400 text-xs md:text-sm">+{recentTrades.length} this month</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-slate-400 text-sm md:text-base">Trust Score</div>
                  <div className="text-xl md:text-2xl">⭐</div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{profile?.trustScore || 0}</div>
                <div className="text-blue-400 text-xs md:text-sm">Based on {profile?.totalRatings || 0} ratings</div>
              </div>

              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-slate-700/50 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3 md:mb-4">
                  <div className="text-slate-400 text-sm md:text-base">Total Volume</div>
                  <div className="text-xl md:text-2xl">💰</div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{formatAmount(profile?.totalTrades ? profile.totalTrades * 1000 : 0)}</div>
                <div className="text-purple-400 text-xs md:text-sm">All time</div>
              </div>
            </div>

            {/* Trust Score Card */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Your Trust Score</h3>
                {profile && (
                  <TrustScoreCard
                    profile={profile}
                  />
                )}
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/start-trade')}
                    className="w-full p-3 md:p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl text-white font-medium hover:from-blue-600 hover:to-purple-600 transition-colors text-sm md:text-base"
                  >
                    Start New Trade
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/search-trader')}
                    className="w-full p-3 md:p-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl text-white font-medium transition-colors text-sm md:text-base"
                  >
                    Find Traders
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Recent Trades</h3>
                <div className="space-y-3">
                  {recentTrades.length > 0 ? (
                    recentTrades.map((trade) => (
                      <div key={trade.id} className="p-3 md:p-4 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-sm md:text-base">{getTradeStatusIcon(trade.status)}</span>
                            <span className="text-white font-medium text-sm md:text-base">Trade #{trade.id.slice(0, 8)}</span>
                          </div>
                          <span className={`text-xs md:text-sm font-medium ${getTradeStatusColor(trade.status)}`}>
                            {trade.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs md:text-sm text-slate-400">
                          <span>{formatAmount(trade.amount)}</span>
                          <span>{formatDate(trade.createdAt)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 md:py-8 text-slate-400">
                      <div className="text-3xl md:text-4xl mb-2">📋</div>
                      <div className="text-sm md:text-base">No trades yet</div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-semibold text-white mb-4">Recent Ratings</h3>
                <div className="space-y-3">
                  {recentRatings.length > 0 ? (
                    recentRatings.map((rating) => (
                      <div key={rating.id} className="p-3 md:p-4 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700/50">
                        <div className="flex items-center justify-between mb-2">
                          <StarRating rating={rating.rating} interactive={false} size="sm" />
                          <span className="text-xs text-slate-400">{formatDate(rating.timestamp)}</span>
                        </div>
                        {rating.comment && (
                          <p className="text-xs md:text-sm text-slate-300 italic">"{rating.comment}"</p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 md:py-8 text-slate-400">
                      <div className="text-3xl md:text-4xl mb-2">⭐</div>
                      <div className="text-sm md:text-base">No ratings yet</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                  <div>
                    <h4 className="text-white font-medium">Wallet Address</h4>
                    <p className="text-slate-400 text-sm">
                      {walletState.primaryWallet?.address?.slice(0, 6)}...{walletState.primaryWallet?.address?.slice(-4)}
                    </p>
                  </div>
                  <div className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-400 text-sm">
                    Connected
                  </div>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-slate-700/50">
                  <div>
                    <h4 className="text-white font-medium">Wallet Type</h4>
                    <p className="text-slate-400 text-sm capitalize">{walletState.primaryWallet?.type}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <h4 className="text-white font-medium">Logout</h4>
                    <p className="text-slate-400 text-sm">Disconnect your wallet and logout</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDisconnect}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    Logout
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Other tabs content */}
        {activeTab !== 'overview' && activeTab !== 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50 text-center"
          >
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
            <p className="text-slate-400">The {activeTab} section is under development and will be available soon.</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
