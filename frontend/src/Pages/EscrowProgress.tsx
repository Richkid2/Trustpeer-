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

  // Mock exchange rate and bank details 
  const USDT_TO_NGN_RATE = 1650
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Wallet Required</h2>
          <p className="text-slate-300 mb-6">Connect your wallet to view trade progress</p>
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg block text-center"
          >
            Connect Wallet
          </Link>
        </motion.div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
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
          <h2 className="text-2xl font-bold text-white mb-2">Loading Trade</h2>
          <p className="text-slate-300">Please wait while we load your trade details...</p>
        </motion.div>
      </div>
    )
  }

  if (error || !trade) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 text-center"
        >
          <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Error</h2>
          <p className="text-slate-300 mb-6">{error}</p>
          <Link
            to="/"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg block text-center"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  // Calculate Naira amount based on USDT amount
  const nairaAmount = parseFloat(trade.amount) * USDT_TO_NGN_RATE

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start items-center mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Escrow In Progress</h1>
          <p className="text-slate-300">Your P2P trade is being processed securely</p>
        </motion.div>

        {/* Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-2xl p-6 mb-8 text-center"
        >
          <div className="flex items-center justify-center mb-3">
            <Clock className="w-6 h-6 text-orange-400 mr-2" />
            <h3 className="text-orange-400 font-semibold">Time Remaining</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">{formatTime(timeRemaining)}</div>
          <p className="text-slate-300 text-sm">Complete the payment before the timer expires</p>
        </motion.div>

        {/* Trade Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Trade Summary</h2>
            <div className="bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-full">
              <span className="text-emerald-400 font-medium">Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">USDT Amount</p>
                <p className="text-white text-2xl font-bold">{trade.amount} USDT</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Naira Equivalent</p>
                <p className="text-emerald-400 text-xl font-bold">₦{nairaAmount.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Exchange Rate</p>
                <p className="text-white font-medium">1 USDT = ₦{USDT_TO_NGN_RATE.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-slate-400 text-sm mb-1">Trade Type</p>
                <p className="text-white font-medium">Buy USDT</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Payment Method</p>
                <p className="text-white font-medium capitalize">{trade.paymentMethod?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-slate-400 text-sm mb-1">Trade ID</p>
                <p className="text-white font-mono text-sm">{trade.id}</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Buyer Instructions */}
          {isUserBuyer() && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50"
            >
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-blue-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Buyer Instructions</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
                  <h4 className="text-blue-400 font-semibold mb-3">Payment Details</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Bank Name:</span>
                      <span className="text-white font-medium">{bankDetails.bankName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Account Number:</span>
                      <div className="flex items-center">
                        <span className="text-white font-mono mr-2">{bankDetails.accountNumber}</span>
                        <button
                          onClick={() => copyToClipboard(bankDetails.accountNumber)}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Account Name:</span>
                      <span className="text-white font-medium">{bankDetails.accountName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Amount to Pay:</span>
                      <span className="text-emerald-400 font-bold text-lg">₦{nairaAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-4">
                  <div className="flex items-start">
                    <AlertCircle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-yellow-400 font-medium mb-1">Important</p>
                      <p className="text-slate-300 text-sm">
                        Send exactly ₦{nairaAmount.toLocaleString()} to the account above. 
                        Use "{trade.id}" as the payment reference.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePaymentSent}
                  disabled={paymentSent}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-2xl transition duration-200 shadow-lg flex items-center justify-center"
                >
                  {paymentSent ? (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Payment Sent ✓
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-5 h-5 mr-2" />
                      I Have Sent Payment
                    </>
                  )}
                </motion.button>

                {paymentSent && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4"
                  >
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-emerald-400 mr-3" />
                      <div>
                        <p className="text-emerald-400 font-medium">Payment Confirmed</p>
                        <p className="text-slate-300 text-sm">Waiting for seller to confirm receipt and release crypto...</p>
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
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50"
            >
              <div className="flex items-center mb-6">
                <CreditCard className="w-6 h-6 text-purple-400 mr-3" />
                <h3 className="text-xl font-bold text-white">Seller Instructions</h3>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl p-6">
                  <h4 className="text-purple-400 font-semibold mb-3">Expected Payment</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Amount Expected:</span>
                      <span className="text-emerald-400 font-bold text-lg">₦{nairaAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Payment Reference:</span>
                      <span className="text-white font-mono">{trade.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Your Bank Account:</span>
                      <span className="text-white font-medium">{bankDetails.accountNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-orange-500/10 border border-orange-500/20 rounded-2xl p-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-orange-400 mr-3 mt-0.5" />
                    <div>
                      <p className="text-orange-400 font-medium mb-1">Waiting for Payment</p>
                      <p className="text-slate-300 text-sm">
                        The buyer has {formatTime(timeRemaining)} to send the payment. 
                        Check your bank account and confirm once received.
                      </p>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePaymentReceived}
                  disabled={actionLoading === 'confirm'}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-2xl transition duration-200 shadow-lg flex items-center justify-center"
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
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Payment Received
                    </>
                  )}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReleaseCrypto}
                  disabled={actionLoading === 'release'}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-2xl transition duration-200 shadow-lg flex items-center justify-center"
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
                    <>
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Release Crypto
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Security Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50"
          >
            <div className="flex items-center mb-6">
              <Shield className="w-6 h-6 text-emerald-400 mr-3" />
              <h3 className="text-xl font-bold text-white">Security & Protection</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Escrow Protection</p>
                  <p className="text-slate-300 text-sm">Your {trade.amount} USDT is safely locked in smart contract escrow</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Automated Release</p>
                  <p className="text-slate-300 text-sm">Crypto is released automatically when payment is confirmed</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-5 h-5 text-emerald-400 mr-3 mt-0.5" />
                <div>
                  <p className="text-white font-medium">Dispute Resolution</p>
                  <p className="text-slate-300 text-sm">24/7 support team available for any disputes</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
              <p className="text-emerald-400 text-sm font-medium">
                🔒 Your funds are protected by TrustPeer's secure escrow system
              </p>
            </div>
          </motion.div>
        </div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
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

export default EscrowProgress
