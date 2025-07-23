import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react'
import { ratingService } from '../Services/rating.service'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import StarRating from '../Components/StarRating'
import type { TradeDetails } from '../Services/escrow.service'

const RateTrader = () => {
  const [searchParams] = useSearchParams()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [trade, setTrade] = useState<TradeDetails | null>(null)
  const [traderAddress, setTraderAddress] = useState('')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const navigate = useNavigate()

  const checkWalletConnection = () => {
    const walletState = multiWalletService.getState()
    setIsWalletConnected(walletState.isConnected)

  }

  const loadTradeData = useCallback(async () => {
    const tradeId = searchParams.get('tradeId')
    const traderAddr = searchParams.get('traderAddress')
    
    if (!tradeId || !traderAddr) {
      setError('Missing trade information')
      return
    }

    setTraderAddress(traderAddr)

    try {
      const tradeData = await escrowService.getTrade(tradeId)
      if (tradeData) {
        setTrade(tradeData)
      }
    } catch (error) {
      console.error('Failed to load trade data:', error)
    }
  }, [searchParams])

  useEffect(() => {
    checkWalletConnection()
    loadTradeData()
  }, [loadTradeData])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    setError('')
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value)
    setError('')
  }

  const validateForm = () => {
    if (rating === 0) {
      setError('Please select a rating')
      return false
    }

    if (comment.trim().length < 10) {
      setError('Please provide a comment with at least 10 characters')
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    if (!isWalletConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!trade) {
      setError('Trade information not available')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      const walletState = multiWalletService.getState()
      const currentUserAddress = walletState.connectedWallets[0]?.address || ''

      await ratingService.submitRating(
        trade.id,
        traderAddress,
        rating,
        comment,
        currentUserAddress
      )

      setSuccess(true)
      
      // Navigate to home after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (error) {
      console.error('Failed to submit rating:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit rating')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Poor'
      case 2: return 'Fair'
      case 3: return 'Good'
      case 4: return 'Very Good'
      case 5: return 'Excellent'
      default: return 'Select a rating'
    }
  }

  const getRatingColor = (rating: number) => {
    switch (rating) {
      case 1: return 'text-red-400'
      case 2: return 'text-orange-400'
      case 3: return 'text-yellow-400'
      case 4: return 'text-white'
      case 5: return 'text-[#ee5f0a]'
      default: return 'text-slate-400'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Wallet connection screen
  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-[#080909] relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
              className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(168,85,247,0.4)]"
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
              Connect your wallet to rate your trading partner and build <span className="text-purple-400 font-kansas-medium">community trust</span>
            </motion.p>
            
            <div className="space-y-4">
              <Link to="/login">
                <motion.button
                  whileHover={{ 
                    scale: 1.05, 
                    boxShadow: "0 20px 40px -12px rgba(168, 85, 247, 0.4), 0 0 30px rgba(168, 85, 247, 0.3)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-kansas-bold py-4 px-6 rounded-2xl transition-all duration-300 border border-purple-400/20 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                  <span className="relative z-10">Connect Wallet</span>
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  // Success screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-green-950 relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_30px_rgba(34,197,94,0.4)]"
            >
              <CheckCircle className="w-12 h-12 text-white" />
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-kansas-bold bg-gradient-to-r from-white to-green-300 bg-clip-text text-transparent mb-3"
            >
              Rating Submitted!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="text-slate-300 font-kansas-light mb-4 text-lg"
            >
              Thank you for helping build a trusted trading community
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="text-green-400 font-kansas-medium mb-6"
            >
              Redirecting to dashboard...
            </motion.div>

            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full mx-auto"
            />
          </motion.div>
        </div>
      </div>
    )
  }

  // Main rating form
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
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
              className="text-5xl md:text-6xl font-kansas-black bg-gradient-to-r from-white via-yellow-200 to-purple-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Rate Your Trader
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-400 font-kansas-light max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Help build trust in our community by sharing your <span className="text-purple-400 font-kansas-medium">trading experience</span>
            </motion.p>
          </motion.div>

          {/* Trade Info Card */}
          {trade && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 mb-8 border border-slate-700/50"
            >
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mr-4"
                >
                  <Shield className="w-5 h-5 text-white" />
                </motion.div>
                <h3 className="text-lg font-kansas-bold text-white">Trade Completed</h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400 font-kansas-medium">Amount:</span>
                  <div className="text-white font-kansas-bold">{trade.amount} USDT</div>
                </div>
                <div>
                  <span className="text-slate-400 font-kansas-medium">Trader:</span>
                  <div className="text-white font-kansas-bold font-mono">{formatAddress(traderAddress)}</div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Rating Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50"
          >
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-5 flex items-center backdrop-blur-sm"
                >
                  <svg className="w-6 h-6 text-red-400 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-300 font-kansas-medium">{error}</span>
                </motion.div>
              )}

              {/* Rating Section */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center mb-6">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-3"
                  >
                    <Star className="w-4 h-4 text-white" />
                  </motion.div>
                  <label className="text-lg font-kansas-bold text-slate-200">
                    Rate Your Experience
                  </label>
                </div>

                <div className="text-center mb-6">
                  <StarRating 
                    rating={rating} 
                    interactive={true}
                    onChange={handleRatingChange} 
                    size="lg"
                  />
                  <motion.div 
                    className={`mt-4 text-2xl font-kansas-bold ${getRatingColor(rating)}`}
                    animate={rating > 0 ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    {getRatingText(rating)}
                  </motion.div>
                </div>
              </motion.div>

              {/* Comment Section */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.4 }}
              >
                <div className="flex items-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                  </motion.div>
                  <label className="text-lg font-kansas-bold text-slate-200">
                    Share Your Experience
                  </label>
                </div>

                <motion.textarea
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Tell the community about your trading experience... (minimum 10 characters)"
                  rows={5}
                  whileFocus={{ scale: 1.01, boxShadow: "0 0 30px rgba(168, 85, 247, 0.3)" }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-slate-700/30 to-slate-800/50 border border-slate-600/50 rounded-3xl focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 text-white font-kansas-medium placeholder-slate-500 backdrop-blur-sm resize-none"
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-slate-500 text-sm font-kansas-light">
                    {comment.length}/500 characters
                  </span>
                  <span className="text-slate-400 text-sm font-kansas-medium">
                    {comment.length >= 10 ? '✓' : `${10 - comment.length} more needed`}
                  </span>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 }}
              >
                <motion.button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || comment.length < 10}
                  whileHover={!isSubmitting && rating > 0 && comment.length >= 10 ? { 
                    scale: 1.02, 
                    boxShadow: "0 25px 50px -12px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.3)",
                    y: -3
                  } : {}}
                  whileTap={{ scale: 0.98 }}
                  className={`group relative w-full py-6 px-8 rounded-3xl font-kansas-bold text-xl transition-all duration-500 overflow-hidden ${
                    isSubmitting || rating === 0 || comment.length < 10
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white border border-purple-400/20'
                  }`}
                >
                  {!isSubmitting && rating > 0 && comment.length >= 10 && (
                    <>
                      {/* Animated background */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                    </>
                  )}
                  
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-slate-500 border-t-transparent rounded-full"
                        />
                        Submitting Rating...
                      </>
                    ) : (
                      <>
                        <motion.span
                          animate={rating > 0 && comment.length >= 10 ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                          className="text-2xl"
                        >
                          ⭐
                        </motion.span>
                        Submit Rating
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
                      </>
                    )}
                  </div>
                  
                  {/* Particle effects */}
                  {!isSubmitting && rating > 0 && comment.length >= 10 && (
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute top-2 right-6 w-1 h-1 bg-white rounded-full animate-ping"></div>
                      <div className="absolute bottom-3 left-8 w-1 h-1 bg-purple-200 rounded-full animate-ping delay-300"></div>
                    </div>
                  )}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default RateTrader
