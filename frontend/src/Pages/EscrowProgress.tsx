import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Shield, 
  Copy,
  DollarSign,
  CreditCard,
  User,
  ArrowRight
} from 'lucide-react'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import type { TradeDetails } from '../Services/escrow.service'

const EscrowProgress = () => {
  const [searchParams] = useSearchParams()
  const [trade, setTrade] = useState<TradeDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [paymentSent, setPaymentSent] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(1800)
  const navigate = useNavigate()

  // Mock exchange rates and bank details 
  const EXCHANGE_RATES = {
    USDT: 1650,  // 1 USDT = 1650 NGN
    BTC: 95000000,  // 1 BTC = 95M NGN
    ETH: 5200000,   // 1 ETH = 5.2M NGN
    BNB: 850000,    // 1 BNB = 850k NGN
    USDC: 1645      // 1 USDC = 1645 NGN
  }

  const bankDetails = {
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "John Doe",
    sortCode: "044"
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const checkWalletConnection = () => {
    const walletState = multiWalletService.getState()
    setIsWalletConnected(walletState.isConnected)
  }

  const loadTradeData = useCallback(async () => {
    const tradeId = searchParams.get('tradeId')
    if (!tradeId) {
      setError('Trade ID not provided')
      setIsLoading(false)
      return
    }

    try {
      const tradeData = await escrowService.getTrade(tradeId)
      if (!tradeData) {
        setError('Trade not found')
      } else {
        setTrade(tradeData)
      }
    } catch (error) {
      console.error('Failed to load trade:', error)
      setError('Failed to load trade data')
    } finally {
      setIsLoading(false)
    }
  }, [searchParams])

  useEffect(() => {
    checkWalletConnection()
    loadTradeData()
    
    // Start countdown timer
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [loadTradeData])

  const handlePaymentSent = () => {
    setPaymentSent(true)
  }

  const handlePaymentReceived = async () => {
    if (!trade) return
    
    setActionLoading('confirm')
    try {
      await escrowService.confirmTrade(trade.id)
      await loadTradeData()
    } catch (error) {
      console.error('Failed to confirm payment:', error)
      setError(error instanceof Error ? error.message : 'Failed to confirm payment')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReleaseCrypto = async () => {
    if (!trade) return
    
    setActionLoading('release')
    try {
      await escrowService.releaseFunds(trade.id)
      navigate(`/rate-trader?tradeId=${trade.id}&traderAddress=${getCurrentUserAddress() === trade.buyer ? trade.seller : trade.buyer}`)
    } catch (error) {
      console.error('Failed to release crypto:', error)
      setError(error instanceof Error ? error.message : 'Failed to release crypto')
    } finally {
      setActionLoading(null)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const getCurrentUserAddress = () => {
    const walletState = multiWalletService.getState()
    return walletState.primaryWallet?.address || ''
  }

  const isUserBuyer = () => {
    return getCurrentUserAddress() === trade?.buyer
  }

  const isUserSeller = () => {
    return getCurrentUserAddress() === trade?.seller
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              className="w-24 h-24 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
            >
              <Shield className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-kansas-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent mb-3"
            >
              Wallet Required
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 font-kansas-light mb-10 text-lg leading-relaxed"
            >
              Connect your wallet to view your <span className="text-purple-400 font-kansas-medium">secure trade progress</span>
            </motion.p>
            <Link to="/login">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px -12px rgba(168, 85, 247, 0.4), 0 0 30px rgba(168, 85, 247, 0.3)",
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white font-kansas-bold py-4 px-6 rounded-2xl transition-all duration-300 border border-purple-400/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                <span className="relative z-10">Connect Wallet</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 2, repeat: Infinity } }}
            >
              <motion.svg 
                className="w-12 h-12 text-white" 
                fill="none" 
                viewBox="0 0 24 24"
                animate={{ rotate: -360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </motion.svg>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-kansas-black bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent mb-4"
            >
              Loading Trade
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-xl text-slate-300 font-kansas-light"
            >
              Fetching your <span className="text-cyan-400 font-kansas-medium">secure trade details</span>...
            </motion.p>
          </motion.div>
        </div>
      </div>
    )
  }

  if (error || !trade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50 text-center"
          >
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-24 h-24 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(239,68,68,0.4)]"
            >
              <AlertCircle className="w-12 h-12 text-white" />
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-3xl font-kansas-bold bg-gradient-to-r from-white to-red-300 bg-clip-text text-transparent mb-3"
            >
              Trade Error
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-slate-300 font-kansas-light mb-10 text-lg leading-relaxed"
            >
              {error}
            </motion.p>
            <Link to="/">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px -12px rgba(239, 68, 68, 0.4), 0 0 30px rgba(239, 68, 68, 0.3)",
                  y: -2
                }}
                whileTap={{ scale: 0.98 }}
                className="group relative w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-kansas-bold py-4 px-6 rounded-2xl transition-all duration-300 border border-red-400/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                <span className="relative z-10">Back to Dashboard</span>
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  // Calculate Naira amount based on crypto amount and currency
  const currency = trade.currency || 'USDT'
  const exchangeRate = EXCHANGE_RATES[currency as keyof typeof EXCHANGE_RATES] || 1650
  const nairaAmount = parseFloat(trade.amount) * exchangeRate

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-start items-center mb-12"
          >
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(168, 85, 247, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center space-x-3 text-slate-400 hover:text-purple-300 transition-all duration-300 bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-xl p-3 rounded-2xl border border-slate-700/50 hover:border-purple-500/30"
            >
              <svg className="w-6 h-6 group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="font-kansas-medium">Back to Dashboard</span>
            </motion.button>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-kansas-black bg-gradient-to-r from-white via-purple-200 to-cyan-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Escrow <span className="bg-gradient-to-r from-emerald-400 to-cyan-500 bg-clip-text">In Progress</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-400 font-kansas-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Your P2P trade is being processed with <span className="text-emerald-400 font-kansas-medium">military-grade security</span>
            </motion.p>
          </motion.div>

          {/* Timer */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-3xl p-8 text-center backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
              <div className="flex items-center justify-center mb-6">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl flex items-center justify-center mr-4"
                >
                  <Clock className="w-4 h-4 text-white" />
                </motion.div>
                <h3 className="text-xl font-kansas-bold text-orange-400">Time Remaining</h3>
              </div>
              <motion.div 
                className="text-5xl font-kansas-black text-white mb-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {formatTime(timeRemaining)}
              </motion.div>
              <p className="text-slate-300 font-kansas-light">Complete the payment before the timer expires</p>
            </div>
          </motion.div>

          {/* Trade Summary */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50 mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-4"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.div>
                <h2 className="text-2xl font-kansas-bold text-white">Trade Summary</h2>
              </div>
              <motion.div 
                className="bg-emerald-500/10 border border-emerald-500/20 px-6 py-3 rounded-full"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-emerald-400 font-kansas-medium">🟢 Active</span>
              </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                >
                  <p className="text-slate-400 text-sm mb-2 font-kansas-medium">{currency} Amount</p>
                  <p className="text-white text-3xl font-kansas-black">{trade.amount} {currency}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 rounded-2xl p-6 border border-emerald-500/20"
                >
                  <p className="text-slate-400 text-sm mb-2 font-kansas-medium">Naira Equivalent</p>
                  <p className="text-emerald-400 text-2xl font-kansas-bold">₦{nairaAmount.toLocaleString()}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                >
                  <p className="text-slate-400 text-sm mb-2 font-kansas-medium">Exchange Rate</p>
                  <p className="text-white font-kansas-medium">1 {currency} = ₦{exchangeRate.toLocaleString()}</p>
                </motion.div>
              </div>
              <div className="space-y-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                >
                  <p className="text-slate-400 text-sm mb-2 font-kansas-medium">Trade Type</p>
                  <p className="text-white font-kansas-medium">{trade.tradeType === 'buy' ? `Buy ${currency}` : `Sell ${currency}`}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                >
                  <p className="text-slate-400 text-sm mb-2 font-kansas-medium">Payment Method</p>
                  <p className="text-white font-kansas-medium capitalize">{trade.paymentMethod?.replace('_', ' ')}</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                >
                  <p className="text-slate-400 text-sm mb-2 font-kansas-medium">Trade ID</p>
                  <p className="text-cyan-400 font-mono text-sm font-kansas-light">{trade.id}</p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Buyer Instructions */}
            {isUserBuyer() && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50"
              >
                <div className="flex items-center mb-8">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4"
                  >
                    <User className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-kansas-bold text-white">Buyer Instructions</h3>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-3xl p-6 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="text-blue-400 font-kansas-bold mb-4 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      Payment Details
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-kansas-medium">Bank Name:</span>
                        <span className="text-white font-kansas-bold">{bankDetails.bankName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-kansas-medium">Account Number:</span>
                        <div className="flex items-center">
                          <span className="text-white font-mono mr-3 font-kansas-bold">{bankDetails.accountNumber}</span>
                          <motion.button
                            onClick={() => copyToClipboard(bankDetails.accountNumber)}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="text-blue-400 hover:text-blue-300 p-1 rounded-lg hover:bg-blue-400/10 transition-all"
                          >
                            <Copy className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-kansas-medium">Account Name:</span>
                        <span className="text-white font-kansas-bold">{bankDetails.accountName}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-kansas-medium">Amount to Pay:</span>
                        <span className="text-emerald-400 font-kansas-black text-lg">₦{nairaAmount.toLocaleString()}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-5 backdrop-blur-sm"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="flex items-start">
                      <AlertCircle className="w-6 h-6 text-yellow-400 mr-4 mt-0.5" />
                      <div>
                        <p className="text-yellow-400 font-kansas-bold mb-2">⚠️ Important</p>
                        <p className="text-slate-300 text-sm font-kansas-light">
                          Send exactly ₦{nairaAmount.toLocaleString()} to the account above. 
                          Use "{trade.id}" as the payment reference.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.button
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.4), 0 0 30px rgba(16, 185, 129, 0.3)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePaymentSent}
                    disabled={paymentSent}
                    className="group relative w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-slate-600 disabled:to-slate-500 text-white font-kansas-bold py-4 px-6 rounded-3xl transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden"
                  >
                    {!paymentSent && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                      {paymentSent ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Payment Sent ✓
                        </>
                      ) : (
                        <>
                          <DollarSign className="w-5 h-5" />
                          I Have Sent Payment
                        </>
                      )}
                    </span>
                  </motion.button>

                  {paymentSent && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl p-5 backdrop-blur-sm"
                    >
                      <div className="flex items-center">
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <CheckCircle className="w-6 h-6 text-emerald-400 mr-4" />
                        </motion.div>
                        <div>
                          <p className="text-emerald-400 font-kansas-bold">Payment Confirmed</p>
                          <p className="text-slate-300 text-sm font-kansas-light">Waiting for seller to confirm receipt and release {currency}...</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Seller Instructions */}
            {isUserSeller() && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
                className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50"
              >
                <div className="flex items-center mb-8">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4"
                  >
                    <CreditCard className="w-5 h-5 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-kansas-bold text-white">Seller Instructions</h3>
                </div>

                <div className="space-y-6">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-3xl p-6 backdrop-blur-sm"
                    whileHover={{ scale: 1.02 }}
                  >
                    <h4 className="text-purple-400 font-kansas-bold mb-4 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2" />
                      Expected Payment
                    </h4>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-kansas-medium">Amount Expected:</span>
                        <span className="text-emerald-400 font-kansas-black text-lg">₦{nairaAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-kansas-medium">Payment Reference:</span>
                        <span className="text-cyan-400 font-mono font-kansas-light">{trade.id}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-300 font-kansas-medium">Your Bank Account:</span>
                        <span className="text-white font-kansas-bold">{bankDetails.accountNumber}</span>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-5 backdrop-blur-sm"
                    animate={{ opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-start">
                      <Clock className="w-6 h-6 text-orange-400 mr-4 mt-0.5" />
                      <div>
                        <p className="text-orange-400 font-kansas-bold mb-2">⏰ Waiting for Payment</p>
                        <p className="text-slate-300 text-sm font-kansas-light">
                          The buyer has {formatTime(timeRemaining)} to send the payment. 
                          Check your bank account and confirm once received.
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  <div className="space-y-4">
                    <motion.button
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.4), 0 0 30px rgba(16, 185, 129, 0.3)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handlePaymentReceived}
                      disabled={actionLoading === 'confirm'}
                      className="group relative w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 disabled:from-slate-600 disabled:to-slate-500 text-white font-kansas-bold py-4 px-6 rounded-3xl transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden"
                    >
                      {actionLoading !== 'confirm' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        {actionLoading === 'confirm' ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Confirming...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Payment Received
                          </>
                        )}
                      </span>
                    </motion.button>

                    <motion.button
                      whileHover={{ 
                        scale: 1.02, 
                        boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleReleaseCrypto}
                      disabled={actionLoading === 'release'}
                      className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-500 text-white font-kansas-bold py-4 px-6 rounded-3xl transition-all duration-300 shadow-lg flex items-center justify-center overflow-hidden"
                    >
                      {actionLoading !== 'release' && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                      )}
                      <span className="relative z-10 flex items-center gap-3">
                        {actionLoading === 'release' ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Releasing...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-5 h-5" />
                            Release {currency}
                          </>
                        )}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Info */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50"
            >
              <div className="flex items-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-4"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-xl font-kansas-bold text-white">Security & Protection</h3>
              </div>

              <div className="space-y-6">
                <motion.div 
                  className="flex items-start group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 mt-0.5" />
                  </motion.div>
                  <div>
                    <p className="text-white font-kansas-bold mb-1">🔐 Escrow Protection</p>
                    <p className="text-slate-300 text-sm font-kansas-light">Your {trade.amount} {currency} is safely locked in smart contract escrow</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 mt-0.5" />
                  </motion.div>
                  <div>
                    <p className="text-white font-kansas-bold mb-1">⚡ Automated Release</p>
                    <p className="text-slate-300 text-sm font-kansas-light">{currency} is released automatically when payment is confirmed</p>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start group"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                  >
                    <CheckCircle className="w-6 h-6 text-emerald-400 mr-4 mt-0.5" />
                  </motion.div>
                  <div>
                    <p className="text-white font-kansas-bold mb-1">🛡️ Dispute Resolution</p>
                    <p className="text-slate-300 text-sm font-kansas-light">24/7 support team available for any disputes</p>
                  </div>
                </motion.div>
              </div>

              <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-3xl backdrop-blur-sm"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <p className="text-emerald-400 text-sm font-kansas-medium text-center flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="mr-2 text-lg"
                  >
                    🔒
                  </motion.span>
                  Your funds are protected by TrustPeer's secure escrow system
                </p>
              </motion.div>
            </motion.div>
          </div>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6 }}
            className="mt-16 text-center"
          >
            <Link to="/">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.4)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center text-purple-400 hover:text-purple-300 font-kansas-medium transition-all duration-300 mx-auto"
              >
                <motion.svg 
                  className="w-5 h-5 mr-2 group-hover:text-purple-300 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </motion.svg>
                Back to Dashboard
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default EscrowProgress