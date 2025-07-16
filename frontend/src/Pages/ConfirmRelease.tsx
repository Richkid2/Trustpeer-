import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import type { TradeDetails } from '../Services/escrow.service'

const ConfirmRelease = () => {
  const [searchParams] = useSearchParams()
  const [trade, setTrade] = useState<TradeDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isReleasing, setIsReleasing] = useState(false)
  const [error, setError] = useState('')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    checkWalletConnection()
    loadTradeData()
  }, [])

  const checkWalletConnection = () => {
    const walletState = multiWalletService.getState()
    setIsWalletConnected(walletState.isConnected)
  }

  const loadTradeData = async () => {
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
  }

  const handleConfirmRelease = async () => {
    if (!trade || !isConfirmed) return

    setIsReleasing(true)
    setError('')

    try {
      await escrowService.releaseFunds(trade.id)
      // Navigate to rating page
      navigate(`/rate-trader?tradeId=${trade.id}`)
    } catch (error) {
      console.error('Failed to release funds:', error)
      setError('Failed to release funds. Please try again.')
    } finally {
      setIsReleasing(false)
    }
  }

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Connect Wallet</h2>
          <p className="text-slate-300 mb-8">You need to connect your wallet to confirm fund release</p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow-lg block text-center"
            >
              Connect Wallet
            </Link>
            <Link
              to="/escrow-progress"
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-4 px-6 rounded-xl transition duration-200 block text-center"
            >
              Back to Progress
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Loading Trade</h2>
          <p className="text-slate-400">Please wait while we load your trade details...</p>
        </motion.div>
      </div>
    )
  }

  if (error && !trade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 text-center"
        >
          <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-300 mb-8">{error}</p>
          <div className="space-y-4">
            <button
              onClick={loadTradeData}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow-lg"
            >
              Try Again
            </button>
            <Link
              to="/escrow-progress"
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-4 px-6 rounded-xl transition duration-200 block text-center"
            >
              Back to Progress
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Confirm Release</h1>
          <p className="text-slate-300">Review and confirm the release of escrowed funds</p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50"
        >
          {/* Trade Summary */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Trade Summary</h2>
            <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Trade ID</div>
                  <div className="text-white font-mono text-lg">{trade?.id || '#TR001'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Amount</div>
                  <div className="text-white font-bold text-lg">{trade?.amount || '0.5'} {trade?.currency || 'ETH'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Trading Partner</div>
                  <div className="text-white font-mono">{trade?.seller || '0x1234...5678'}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Escrow Fee</div>
                  <div className="text-white font-medium">0.01 ETH</div>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Section */}
          <div className="mb-8">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-yellow-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-yellow-300 font-semibold mb-2">Important Warning</h3>
                  <p className="text-yellow-200">
                    Once you confirm the release, the funds will be immediately transferred to your trading partner. 
                    This action is <strong>irreversible</strong> and cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <div className="mb-8">
            <motion.label
              whileHover={{ scale: 1.01 }}
              className="flex items-start gap-4 cursor-pointer p-4 bg-slate-700/30 rounded-2xl border border-slate-600 hover:border-slate-500 transition-colors"
            >
              <input
                type="checkbox"
                checked={isConfirmed}
                onChange={(e) => setIsConfirmed(e.target.checked)}
                className="w-5 h-5 text-blue-500 bg-slate-600 border-slate-500 rounded focus:ring-blue-500 focus:ring-2 mt-1"
              />
              <div>
                <div className="text-white font-medium mb-1">Confirmation Required</div>
                <div className="text-slate-300 text-sm">
                  I confirm that I have received the agreed goods/services and want to release the escrowed funds to my trading partner.
                </div>
              </div>
            </motion.label>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center"
            >
              <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-red-300">{error}</span>
            </motion.div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConfirmRelease}
              disabled={!isConfirmed || isReleasing}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-2xl transition duration-200 shadow-lg flex items-center justify-center"
            >
              {isReleasing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Releasing Funds...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Confirm & Release Funds
                </>
              )}
            </motion.button>
            
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={`/escrow-progress?tradeId=${trade?.id}`}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-4 px-6 rounded-2xl transition duration-200 block text-center"
              >
                Back to Progress
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link 
            to="/" 
            className="text-slate-400 hover:text-slate-300 font-medium transition duration-200 flex items-center justify-center gap-2"
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

export default ConfirmRelease
