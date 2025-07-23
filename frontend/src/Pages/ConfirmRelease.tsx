import { useState, useEffect, useCallback } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Shield,
  AlertTriangle,
  ArrowRight,
  Lock,
  Unlock,
  Zap,
  Clock,
  User,
  Eye
} from 'lucide-react'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import DashboardLayout from '../Components/Layout/DashboardLayout'
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
  }, [loadTradeData])

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
      <DashboardLayout>
        <div className="relative overflow-hidden flex items-center justify-center min-h-[80vh] p-4">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full bg-[#0f1011] rounded-3xl shadow-lg p-8 border border-gray-800 text-center relative z-10"
          >
            <motion.div 
              className="w-20 h-20 bg-[#ee5f0a] rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h2 
              className="text-2xl font-bold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Connect Wallet
            </motion.h2>
            
            <motion.p 
              className="text-gray-300 mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              You need to connect your wallet to confirm fund release
            </motion.p>
            
            <div className="space-y-4">
              <Link to="/dashboard">
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    y: -2 
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#ee5f0a] hover:bg-[#d54f08] text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg"
                >
                  Connect Wallet
                </motion.button>
              </Link>
              
              <Link to="/escrow-progress">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-800/60 hover:bg-gray-700/70 text-gray-200 font-medium py-4 px-6 rounded-2xl transition-all duration-300 border border-gray-600/50"
                >
                  Back to Progress
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="relative overflow-hidden flex items-center justify-center min-h-[80vh] p-4">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center relative z-10"
          >
            <motion.div 
              className="w-16 h-16 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full"
              />
            </motion.div>
            
            <motion.h2 
              className="text-xl font-kansas-bold text-white mb-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Loading Trade
            </motion.h2>
            
            <p className="text-slate-400 font-kansas-light">Please wait while we load your trade details...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !trade) {
    return (
      <DashboardLayout>
        <div className="relative overflow-hidden flex items-center justify-center min-h-[80vh] p-4">
          {/* Animated background */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-md w-full bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50 text-center relative z-10"
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <AlertTriangle className="w-10 h-10 text-white" />
            </motion.div>
            
            <h2 className="text-2xl font-kansas-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent mb-2">Error</h2>
            <p className="text-slate-300 font-kansas-light mb-8">{error}</p>
            
            <div className="space-y-4">
              <motion.button
                onClick={loadTradeData}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px -12px rgba(239, 68, 68, 0.4)",
                  y: -2 
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white font-kansas-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg"
              >
                Try Again
              </motion.button>
              
              <Link to="/escrow-progress">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl hover:from-slate-600/70 hover:to-slate-700/90 text-slate-200 font-kansas-medium py-4 px-6 rounded-2xl transition-all duration-300 border border-slate-600/50"
                >
                  Back to Progress
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 py-12 px-4">
          <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-kansas-black bg-gradient-to-r from-white via-green-200 to-emerald-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Confirm <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text">Release</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-400 font-kansas-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Final step: <span className="text-green-400 font-kansas-medium">Release escrowed funds</span> to complete the trade
            </motion.p>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50 mb-8"
          >
            {/* Trade Summary */}
            <div className="mb-8">
              <div className="flex items-center mb-6">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4"
                >
                  <Eye className="w-4 h-4 text-white" />
                </motion.div>
                <h2 className="text-2xl font-kansas-bold text-white">Trade Summary</h2>
              </div>
              
              <motion.div 
                className="bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl p-6 border border-slate-600/50"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 }}
                    className="group"
                  >
                    <div className="text-slate-400 text-sm mb-2 font-kansas-medium">Trade ID</div>
                    <div className="font-kansas-bold font-mono text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      {trade?.id || '#TR001'}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 }}
                  >
                    <div className="text-slate-400 text-sm mb-2 font-kansas-medium">Amount</div>
                    <div className="text-white font-kansas-black text-lg flex items-center">
                      <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                        {trade?.amount || '0.5'}
                      </span>
                      <span className="ml-2 text-slate-300">{trade?.currency || 'ETH'}</span>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 }}
                  >
                    <div className="text-slate-400 text-sm mb-2 font-kansas-medium">Trading Partner</div>
                    <div className="text-white font-kansas-bold font-mono flex items-center">
                      <User className="w-4 h-4 mr-2 text-cyan-400" />
                      {trade?.seller || '0x1234...5678'}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 }}
                  >
                    <div className="text-slate-400 text-sm mb-2 font-kansas-medium">Escrow Fee</div>
                    <div className="text-white font-kansas-bold flex items-center">
                      <Zap className="w-4 h-4 mr-2 text-yellow-400" />
                      0.01 ETH
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>

            {/* Warning Section */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div 
                className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm"
                whileHover={{ scale: 1.01, borderColor: 'rgba(245, 158, 11, 0.5)' }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-start gap-4">
                  <motion.div 
                    className="w-8 h-8 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-full flex items-center justify-center flex-shrink-0"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <AlertTriangle className="w-5 h-5 text-yellow-400" />
                  </motion.div>
                  <div>
                    <h3 className="text-yellow-300 font-kansas-bold mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Critical Warning
                    </h3>
                    <p className="text-yellow-200 font-kansas-light leading-relaxed">
                      Once you confirm the release, the funds will be <span className="font-kansas-bold text-yellow-100">immediately transferred</span> to your trading partner. 
                      This action is <span className="font-kansas-bold text-red-300">irreversible</span> and cannot be undone.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Confirmation Checkbox */}
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4 }}
            >
              <motion.label
                whileHover={{ scale: 1.01 }}
                className="flex items-start gap-4 cursor-pointer p-6 bg-gradient-to-br from-slate-700/30 to-slate-800/50 rounded-2xl border border-slate-600/50 hover:border-green-500/30 transition-all duration-300 group"
              >
                <motion.input
                  type="checkbox"
                  checked={isConfirmed}
                  onChange={(e) => setIsConfirmed(e.target.checked)}
                  animate={{ scale: isConfirmed ? 1.1 : 1 }}
                  className="w-5 h-5 text-green-500 bg-slate-600 border-slate-500 rounded focus:ring-green-500 focus:ring-2 mt-1"
                />
                <div>
                  <div className="text-white font-kansas-bold mb-2 flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-green-400" />
                    Confirmation Required
                  </div>
                  <div className="text-slate-300 font-kansas-light text-sm leading-relaxed">
                    I confirm that I have <span className="font-kansas-medium text-green-300">received the agreed goods/services</span> and want to release the escrowed funds to my trading partner.
                  </div>
                </div>
              </motion.label>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-5 flex items-center backdrop-blur-sm"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-3" />
                </motion.div>
                <span className="text-red-300 font-kansas-medium">{error}</span>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div 
              className="flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6 }}
            >
              <motion.button
                onClick={handleConfirmRelease}
                disabled={!isConfirmed || isReleasing}
                whileHover={!isReleasing && isConfirmed ? { 
                  scale: 1.02, 
                  boxShadow: "0 20px 40px -12px rgba(16, 185, 129, 0.4), 0 0 30px rgba(16, 185, 129, 0.3)",
                  y: -2 
                } : {}}
                whileTap={{ scale: 0.98 }}
                className="group flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-kansas-bold py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg flex items-center justify-center border border-green-400/20 disabled:border-slate-600/20 overflow-hidden"
              >
                {!isReleasing && isConfirmed && (
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                )}
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {isReleasing ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Releasing Funds...
                    </>
                  ) : (
                    <>
                      {isConfirmed ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      Confirm & Release Funds
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </motion.button>
              
              <Link to={`/escrow-progress?tradeId=${trade?.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl hover:from-slate-600/70 hover:to-slate-700/90 text-slate-200 font-kansas-medium py-4 px-6 rounded-2xl transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70"
                >
                  Back to Progress
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Back Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8 }}
            className="text-center"
          >
            <Link to="/dashboard">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center text-[#ee5f0a] hover:text-[#d54f08] font-medium transition-all duration-300 mx-auto"
              >
                <motion.svg 
                  className="w-5 h-5 mr-2 group-hover:text-cyan-300 transition-colors" 
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
    </DashboardLayout>
  )
}

export default ConfirmRelease
