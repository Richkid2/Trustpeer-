import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import { TradeStatus } from '../Services/escrow.service'
import type { TradeDetails } from '../Services/escrow.service'

const EscrowProgress = () => {
  const [searchParams] = useSearchParams()
  const [trade, setTrade] = useState<TradeDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
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

  const handleDepositFunds = async () => {
    if (!trade) return
    
    setActionLoading('deposit')
    try {
      await escrowService.depositFunds(trade.id)
      await loadTradeData() // Refresh data
    } catch (error) {
      console.error('Failed to deposit funds:', error)
      setError(error instanceof Error ? error.message : 'Failed to deposit funds')
    } finally {
      setActionLoading(null)
    }
  }

  const handleConfirmTrade = async () => {
    if (!trade) return
    
    setActionLoading('confirm')
    try {
      await escrowService.confirmTrade(trade.id)
      await loadTradeData() // Refresh data
    } catch (error) {
      console.error('Failed to confirm trade:', error)
      setError(error instanceof Error ? error.message : 'Failed to confirm trade')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReleaseFunds = async () => {
    if (!trade) return
    
    setActionLoading('release')
    try {
      await escrowService.releaseFunds(trade.id)
      // Navigate to rating page after successful release
      navigate(`/rate-trader?tradeId=${trade.id}&traderAddress=${trade.buyer === getCurrentUserAddress() ? trade.seller : trade.buyer}`)
    } catch (error) {
      console.error('Failed to release funds:', error)
      setError(error instanceof Error ? error.message : 'Failed to release funds')
    } finally {
      setActionLoading(null)
    }
  }

  const handleCancelTrade = async () => {
    if (!trade) return
    
    if (!confirm('Are you sure you want to cancel this trade? This action cannot be undone.')) {
      return
    }

    setActionLoading('cancel')
    try {
      await escrowService.cancelTrade(trade.id)
      navigate('/')
    } catch (error) {
      console.error('Failed to cancel trade:', error)
      setError(error instanceof Error ? error.message : 'Failed to cancel trade')
    } finally {
      setActionLoading(null)
    }
  }

  const getCurrentUserAddress = () => {
    const walletState = multiWalletService.getState()
    return walletState.connectedWallets[0]?.address || ''
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case TradeStatus.CREATED:
        return 'text-blue-600 bg-blue-100'
      case TradeStatus.FUNDS_DEPOSITED:
        return 'text-yellow-600 bg-yellow-100'
      case TradeStatus.AWAITING_CONFIRMATION:
        return 'text-orange-600 bg-orange-100'
      case TradeStatus.COMPLETED:
        return 'text-green-600 bg-green-100'
      case TradeStatus.CANCELLED:
        return 'text-red-600 bg-red-100'
      case TradeStatus.DISPUTED:
        return 'text-purple-600 bg-purple-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case TradeStatus.CREATED:
        return 'Created'
      case TradeStatus.FUNDS_DEPOSITED:
        return 'Funds Deposited'
      case TradeStatus.AWAITING_CONFIRMATION:
        return 'Awaiting Confirmation'
      case TradeStatus.COMPLETED:
        return 'Completed'
      case TradeStatus.CANCELLED:
        return 'Cancelled'
      case TradeStatus.DISPUTED:
        return 'Disputed'
      default:
        return 'Unknown'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const canDepositFunds = trade?.status === TradeStatus.CREATED
  const canConfirmTrade = trade?.status === TradeStatus.FUNDS_DEPOSITED
  const canReleaseFunds = trade?.status === TradeStatus.AWAITING_CONFIRMATION
  const canCancelTrade = trade?.status === TradeStatus.CREATED || trade?.status === TradeStatus.FUNDS_DEPOSITED

  if (!isWalletConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Wallet Required</h2>
          <p className="text-gray-600 mb-6">Connect your wallet to view trade progress</p>
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg block text-center"
          >
            Connect Wallet
          </Link>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Loading Trade</h2>
          <p className="text-gray-600">Please wait while we load your trade details...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !trade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg block text-center"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Trade Progress</h1>
          <p className="text-gray-600">Track your escrow trade status</p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center max-w-2xl mx-auto"
          >
            <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trade Details */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Trade Details</h2>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trade.status)}`}>
                  {getStatusText(trade.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Trade ID</p>
                  <p className="font-medium font-mono">{trade.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Amount</p>
                  <p className="font-medium text-xl">{trade.amount} {trade.currency}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Buyer</p>
                  <p className="font-medium font-mono">{formatAddress(trade.buyer)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Seller</p>
                  <p className="font-medium font-mono">{formatAddress(trade.seller)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Created</p>
                  <p className="font-medium">{formatDate(trade.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Last Updated</p>
                  <p className="font-medium">{formatDate(trade.updatedAt)}</p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Description</p>
                <p className="text-gray-800 bg-gray-50 rounded-lg p-3">{trade.description}</p>
              </div>

              {trade.escrowAddress && (
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Escrow Address</p>
                  <p className="font-medium font-mono bg-gray-50 rounded-lg p-3 break-all">{trade.escrowAddress}</p>
                </div>
              )}

              {trade.releaseConditions && trade.releaseConditions.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Release Conditions</p>
                  <ul className="space-y-2">
                    {trade.releaseConditions.map((condition, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-gray-700">{condition}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </motion.div>

          {/* Progress Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-gray-800 mb-6">Progress Timeline</h3>
              
              <div className="space-y-4">
                {trade.timeline?.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-4 mt-1 ${
                      step.completed ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      {step.completed ? (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${step.completed ? 'text-green-600' : 'text-gray-500'}`}>
                        {step.name}
                      </p>
                      {step.timestamp && (
                        <p className="text-sm text-gray-500 mt-1">{formatDate(step.timestamp)}</p>
                      )}
                      {step.description && (
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              {canDepositFunds && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDepositFunds}
                  disabled={actionLoading === 'deposit'}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg flex items-center justify-center"
                >
                  {actionLoading === 'deposit' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Depositing...
                    </>
                  ) : (
                    'Deposit Funds'
                  )}
                </motion.button>
              )}

              {canConfirmTrade && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleConfirmTrade}
                  disabled={actionLoading === 'confirm'}
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg flex items-center justify-center"
                >
                  {actionLoading === 'confirm' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Confirming...
                    </>
                  ) : (
                    'Confirm Trade'
                  )}
                </motion.button>
              )}

              {canReleaseFunds && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReleaseFunds}
                  disabled={actionLoading === 'release'}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg flex items-center justify-center"
                >
                  {actionLoading === 'release' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Releasing...
                    </>
                  ) : (
                    'Release Funds'
                  )}
                </motion.button>
              )}

              {canCancelTrade && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleCancelTrade}
                  disabled={actionLoading === 'cancel'}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg flex items-center justify-center"
                >
                  {actionLoading === 'cancel' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Trade'
                  )}
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link 
            to="/" 
            className="text-blue-600 hover:text-blue-700 font-medium transition duration-200 flex items-center justify-center gap-2"
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

export default EscrowProgress
