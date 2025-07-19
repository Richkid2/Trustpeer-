import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-[#f5762c]/20 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
          <p className="text-gray-400 mb-6">Connect your wallet to rate your trading partner</p>
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-[#f5762c] to-[#e53825] hover:from-[#e53825] hover:to-[#f5762c] text-white font-bold py-4 px-6 rounded-xl transition duration-300 shadow-lg block text-center"
          >
            Connect Wallet
          </Link>
        </motion.div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-[#f5762c]/20 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Rating Submitted!</h2>
          <p className="text-gray-400 mb-4">Thank you for rating your trading partner</p>
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center mb-2">
              <StarRating rating={rating} size="lg" />
            </div>
            <p className="text-green-400 text-sm font-semibold">Your {getRatingText(rating)} rating has been recorded</p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to home...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Rate Your Trading Partner</h1>
          <p className="text-gray-400">Help build trust in the TrustPeer community</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-[#f5762c]/20 mb-8"
        >
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-green-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-green-300 font-semibold">Trade Completed Successfully!</p>
                <p className="text-green-400 text-sm">Funds have been released and the trade is complete</p>
              </div>
            </div>
          </div>
        </motion.div>

        {trade && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-[#f5762c]/20 mb-8"
          >
            <h2 className="text-xl font-bold text-white mb-4">Trade Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400 mb-1">Trade ID</p>
                <p className="font-medium font-mono text-white">{trade.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Amount</p>
                <p className="font-medium text-lg text-[#f5762c]">{trade.amount} {trade.currency}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Trading Partner</p>
                <p className="font-medium font-mono text-white">{formatAddress(traderAddress)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Trade Type</p>
                <p className="font-medium capitalize text-white">{trade.type}</p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-[#f5762c]/20"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-4 flex items-center"
              >
                <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="text-red-300">{error}</span>
              </motion.div>
            )}

            <div>
              <label className="block text-sm font-semibold text-white mb-4">
                How would you rate your experience?
              </label>
              <div className="flex flex-col items-center space-y-4">
                <StarRating
                  rating={rating}
                  size="lg"
                  interactive={true}
                  onChange={handleRatingChange}
                />
                <p className="text-lg font-medium text-[#f5762c]">
                  {getRatingText(rating)}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Share your experience
              </label>
              <textarea
                value={comment}
                onChange={handleCommentChange}
                rows={5}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#f5762c] focus:border-[#f5762c] transition duration-300"
                placeholder="Describe your trading experience. Was communication good? Did they follow through on their commitments? Be specific and helpful to other traders."
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                {comment.length}/10 characters minimum
              </p>
            </div>

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#f5762c] to-[#e53825] hover:from-[#e53825] hover:to-[#f5762c] disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition duration-300 shadow-lg flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting Rating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                  Submit Rating
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Link 
            to="/" 
            className="text-[#f5762c] hover:text-[#e53825] font-semibold transition duration-300 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default RateTrader
