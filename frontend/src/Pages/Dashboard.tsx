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
          const traderProfile = await ratingService.getTraderProfile(state.primaryWallet.address)
          setProfile(traderProfile)
          
          const trades = await escrowService.getAllTrades()
          const userTrades = trades.filter((trade: TradeDetails) => 
            trade.buyer === state.primaryWallet?.address || 
            trade.seller === state.primaryWallet?.address
          )
          setRecentTrades(userTrades.slice(0, 5))
          
          const ratings = await ratingService.getTraderRatings(state.primaryWallet.address)
          setRecentRatings(ratings.slice(0, 5))
          
        } catch (error) {
          console.error('Error loading dashboard data:', error)
        }
      }
      setLoading(false)
    }

    checkWalletAndLoadData()
    
    const interval = setInterval(() => {
      const newState = multiWalletService.getState()
      if (newState.isConnected !== walletState.isConnected) {
        setWalletState(newState)
        if (newState.isConnected) {
          checkWalletAndLoadData()
        }
      }
    }, 2000) 

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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8 md:mb-12"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate('/')}
                  className="group p-3 bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-slate-700/50 rounded-2xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                >
                  <svg className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </motion.button>
                <div>
                  <motion.h1 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent mb-2"
                  >
                    Dashboard
                  </motion.h1>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-slate-400 text-lg"
                  >
                    Welcome back, <span className="text-cyan-400 font-medium">trader</span>
                  </motion.p>
                </div>
              </div>
              
              {/* Live status indicator */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-full"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-300 text-sm font-medium">Live</span>
              </motion.div>
            </div>
          </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mb-8 md:mb-12"
        >
          <div className="flex space-x-2 bg-gradient-to-r from-slate-800/30 to-slate-900/30 backdrop-blur-2xl rounded-3xl p-2 border border-slate-700/30 shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
              { id: 'trades', label: 'Trades', icon: '💼', gradient: 'from-purple-500 to-pink-500' },
              { id: 'ratings', label: 'Ratings', icon: '⭐', gradient: 'from-yellow-500 to-orange-500' },
              { id: 'settings', label: 'Settings', icon: '⚙️', gradient: 'from-green-500 to-emerald-500' }
            ].map((tab, index) => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5 }}
                onClick={() => setActiveTab(tab.id as 'overview' | 'trades' | 'ratings' | 'settings')}
                className={`group relative flex-1 min-w-0 flex items-center justify-center gap-3 py-4 px-6 rounded-2xl font-bold transition-all duration-500 text-sm sm:text-base ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.gradient} text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] transform scale-105`
                    : 'text-slate-400 hover:text-white hover:bg-gradient-to-r hover:from-slate-700/50 hover:to-slate-600/50 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-102'
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span 
                  className="text-lg sm:text-xl"
                  animate={activeTab === tab.id ? { rotate: [0, 10, -10, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {tab.icon}
                </motion.span>
                <span className="hidden sm:inline font-kansas-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-2xl border border-white/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-10"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[
                { 
                  label: 'Total Trades', 
                  value: profile?.totalTrades || 0, 
                  subtext: `+${recentTrades.length} this month`, 
                  icon: '💼', 
                  gradient: 'from-blue-600 to-cyan-500',
                  glowColor: 'blue'
                },
                { 
                  label: 'Trust Score', 
                  value: profile?.trustScore || 0, 
                  subtext: `Based on ${profile?.totalRatings || 0} ratings`, 
                  icon: '⭐', 
                  gradient: 'from-yellow-500 to-orange-500',
                  glowColor: 'yellow'
                },
                { 
                  label: 'Total Volume', 
                  value: formatAmount(profile?.totalTrades ? profile.totalTrades * 1000 : 0), 
                  subtext: 'All time', 
                  icon: '💰', 
                  gradient: 'from-purple-600 to-pink-500',
                  glowColor: 'purple'
                }
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 40, rotateX: 15 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.1 * index + 0.8, duration: 0.8 }}
                  whileHover={{ 
                    scale: 1.02, 
                    rotateY: 5,
                    boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(${stat.glowColor === 'blue' ? '59, 130, 246' : stat.glowColor === 'yellow' ? '245, 158, 11' : '168, 85, 247'}, 0.4)`
                  }}
                  className={`group relative bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl p-6 border border-slate-700/50 overflow-hidden cursor-pointer transform-gpu perspective-1000`}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {/* Animated background gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
                  
                  {/* Glow effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500"></div>
                  
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-slate-400 font-kansas-medium text-sm tracking-wide uppercase">{stat.label}</div>
                      <motion.div 
                        className="text-3xl"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        {stat.icon}
                      </motion.div>
                    </div>
                    <div className="text-4xl font-kansas-bold text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-200 group-hover:bg-clip-text transition-all duration-300">
                      {stat.value}
                    </div>
                    <div className={`text-sm font-kansas-medium bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                      {stat.subtext}
                    </div>
                  </div>
                  
                  {/* Particle effect overlay */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-4 right-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-6 left-6 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-300"></div>
                    <div className="absolute top-1/2 right-8 w-1 h-1 bg-blue-400 rounded-full animate-ping delay-700"></div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Score and Quick Actions */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-kansas-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  Your Trust Score
                </h3>
                <div className="relative">
                  {profile && (
                    <motion.div
                      whileHover={{ scale: 1.02, rotateY: 5 }}
                      className="transform-gpu perspective-1000"
                    >
                      <TrustScoreCard profile={profile} />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4, duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-kansas-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent">
                  Quick Actions
                </h3>
                <div className="space-y-4">
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.6, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.3)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/start-trade')}
                    className="group relative w-full p-6 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl text-white font-kansas-bold text-lg overflow-hidden transition-all duration-300 border border-blue-400/20 hover:border-cyan-400/40"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                    
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                        className="text-2xl"
                      >
                        🚀
                      </motion.span>
                      Start New Trade
                    </div>
                    
                    {/* Particle effects */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-3 left-6 w-1 h-1 bg-cyan-200 rounded-full animate-ping delay-300"></div>
                    </div>
                  </motion.button>
                  
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.8, duration: 0.6 }}
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 20px 40px -12px rgba(148, 163, 184, 0.3), 0 0 30px rgba(148, 163, 184, 0.2)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/search-trader')}
                    className="group relative w-full p-6 bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border border-slate-600/50 rounded-2xl text-white font-kansas-bold text-lg overflow-hidden transition-all duration-300 hover:border-slate-400/70"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <div className="relative z-10 flex items-center justify-center gap-3">
                      <motion.span
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                        className="text-2xl"
                      >
                        🔍
                      </motion.span>
                      Find Traders
                    </div>
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-kansas-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent">
                  Recent Trades
                </h3>
                <div className="space-y-4">
                  {recentTrades.length > 0 ? (
                    recentTrades.map((trade, index) => (
                      <motion.div
                        key={trade.id}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.2 + index * 0.1, duration: 0.6 }}
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(59, 130, 246, 0.2)" 
                        }}
                        className="group p-5 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-2xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <motion.span 
                              className="text-lg"
                              whileHover={{ scale: 1.2, rotate: 10 }}
                            >
                              {getTradeStatusIcon(trade.status)}
                            </motion.span>
                            <span className="text-white font-kansas-medium">Trade #{trade.id.slice(0, 8)}</span>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-kansas-bold uppercase tracking-wide ${getTradeStatusColor(trade.status)} bg-current/10`}>
                            {trade.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-slate-400">
                          <span className="font-kansas-bold text-lg text-white">{formatAmount(trade.amount)}</span>
                          <span className="text-sm">{formatDate(trade.createdAt)}</span>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.2, duration: 0.6 }}
                      className="text-center py-12 text-slate-400"
                    >
                      <motion.div 
                        className="text-6xl mb-4"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        📋
                      </motion.div>
                      <div className="font-kansas-medium">No trades yet</div>
                      <div className="text-sm text-slate-500 mt-2">Start trading to see your history here</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.8 }}
                className="space-y-6"
              >
                <h3 className="text-2xl font-kansas-bold bg-gradient-to-r from-white to-yellow-300 bg-clip-text text-transparent">
                  Recent Ratings
                </h3>
                <div className="space-y-4">
                  {recentRatings.length > 0 ? (
                    recentRatings.map((rating, index) => (
                      <motion.div
                        key={rating.id}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.4 + index * 0.1, duration: 0.6 }}
                        whileHover={{ 
                          scale: 1.02, 
                          boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(245, 158, 11, 0.2)" 
                        }}
                        className="group p-5 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-2xl border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <StarRating rating={rating.rating} interactive={false} size="sm" />
                          <span className="text-slate-400 text-sm">{formatDate(rating.timestamp)}</span>
                        </div>
                        {rating.comment && (
                          <p className="text-slate-300 italic font-kansas-light text-sm leading-relaxed">"{rating.comment}"</p>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 2.4, duration: 0.6 }}
                      className="text-center py-12 text-slate-400"
                    >
                      <motion.div 
                        className="text-6xl mb-4"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        ⭐
                      </motion.div>
                      <div className="font-kansas-medium">No ratings yet</div>
                      <div className="text-sm text-slate-500 mt-2">Complete trades to earn ratings</div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4)" }}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl p-8 border border-slate-700/50 shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
            >
              <h3 className="text-3xl font-kansas-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-8">
                Account Settings
              </h3>
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex items-center justify-between py-6 border-b border-slate-700/50 group"
                >
                  <div className="space-y-2">
                    <h4 className="text-white font-kansas-medium text-lg group-hover:text-cyan-300 transition-colors">Wallet Address</h4>
                    <p className="text-slate-400 font-mono text-sm bg-slate-800/50 px-3 py-2 rounded-lg">
                      {walletState.primaryWallet?.address?.slice(0, 6)}...{walletState.primaryWallet?.address?.slice(-4)}
                    </p>
                  </div>
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl text-green-300 text-sm font-kansas-medium backdrop-blur-sm"
                  >
                    ✅ Connected
                  </motion.div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 }}
                  className="flex items-center justify-between py-6 border-b border-slate-700/50 group"
                >
                  <div className="space-y-2">
                    <h4 className="text-white font-kansas-medium text-lg group-hover:text-purple-300 transition-colors">Wallet Type</h4>
                    <p className="text-slate-400 capitalize font-kansas-medium">{walletState.primaryWallet?.type}</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                  className="flex items-center justify-between py-6"
                >
                  <div className="space-y-2">
                    <h4 className="text-white font-kansas-medium text-lg">Disconnect Wallet</h4>
                    <p className="text-slate-400">Safely disconnect your wallet and logout</p>
                  </div>
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 40px -12px rgba(239, 68, 68, 0.4)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleDisconnect}
                    className="group relative bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-kansas-bold py-3 px-6 rounded-2xl transition-all duration-300 border border-red-500/30 overflow-hidden"
                  >
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-red-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative z-10 flex items-center gap-2">
                      <span>🚪</span>
                      Logout
                    </div>
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Other tabs content */}
        {activeTab !== 'overview' && activeTab !== 'settings' && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl p-12 border border-slate-700/50 text-center shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
          >
            <motion.div 
              className="text-8xl mb-6"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              🚧
            </motion.div>
            <h3 className="text-3xl font-kansas-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent mb-4">
              Coming Soon
            </h3>
            <p className="text-slate-400 text-lg font-kansas-light">
              The <span className="text-cyan-400 font-kansas-medium">{activeTab}</span> section is under development and will be available soon.
            </p>
            <motion.div
              className="mt-8 flex justify-center gap-2"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            </motion.div>
          </motion.div>
        )}
        
        </div>
      </div>
    </div>
  )
}

export default Dashboard
