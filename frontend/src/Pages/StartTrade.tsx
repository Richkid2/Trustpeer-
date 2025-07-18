import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  ArrowRight,
  CheckCircle
} from 'lucide-react'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import type { CreateTradeRequest } from '../Services/escrow.service'

type TradeType = 'buy' | 'sell'
type PaymentMethod = 'bank_transfer'

const StartTrade = () => {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USDT',
    tradeType: 'buy' as TradeType,
    paymentMethod: 'bank_transfer' as PaymentMethod,
    buyerAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [nairaAmount, setNairaAmount] = useState(0);
  const navigate = useNavigate();

  // Exchange rate (in a real app, this would come from an API)
  const USDT_TO_NGN_RATE = 1650; // 1 USDT = 1650 NGN

  useEffect(() => {
    checkWalletConnection()
    const interval = setInterval(checkWalletConnection, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate Naira amount whenever USDT amount changes
    const usdtAmount = parseFloat(formData.amount) || 0;
    setNairaAmount(usdtAmount * USDT_TO_NGN_RATE);
  }, [formData.amount])

  const checkWalletConnection = () => {
    const walletState = multiWalletService.getState();
    setIsWalletConnected(walletState.isConnected);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  };

  const handleStartTrade = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isWalletConnected) {
      setError('Please connect your wallet first')
      return
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError('Please enter a valid USDT amount')
      return
    }

    if (!formData.buyerAddress.trim()) {
      setError('Please enter the buyer\'s wallet address')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create trade with automatic escrow
      const tradeRequest: CreateTradeRequest = {
        partnerAddress: formData.buyerAddress,
        amount: formData.amount,
        currency: formData.currency,
        tradeType: formData.tradeType,
        paymentMethod: formData.paymentMethod,
        terms: `${formData.amount} USDT for ₦${nairaAmount.toLocaleString()} via ${formData.paymentMethod}`
      };

      const trade = await escrowService.createTrade(tradeRequest)
      console.log('Trade created with automatic escrow:', trade)

      navigate(`/escrow-progress?tradeId=${trade.id}`);
    } catch (err) {
      console.error('Failed to create trade:', err);
      setError(err instanceof Error ? err.message : 'Failed to create trade');
    } finally {
      setIsLoading(false);
    }
  };

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
          <p className="text-slate-300 mb-8">You need to connect your wallet to start trading on TrustPeer</p>
          <div className="space-y-4">
            <Link
              to="/login"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow-lg block text-center"
            >
              Connect Wallet
            </Link>
            <Link
              to="/"
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-4 px-6 rounded-xl transition duration-200 block text-center"
            >
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Start New Trade</h1>
          <p className="text-slate-300">Create a secure P2P crypto trade with automatic escrow</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50"
        >
          <form onSubmit={handleStartTrade}>
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

            <div className="space-y-6">
              {/* Trade Type */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  Trade Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tradeType: 'buy' as TradeType }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      formData.tradeType === 'buy'
                        ? 'border-green-500 bg-green-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-2 flex justify-center">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">Buy USDT</div>
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tradeType: 'sell' as TradeType }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 ${
                      formData.tradeType === 'sell'
                        ? 'border-red-500 bg-red-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-2 flex justify-center">
                      <TrendingDown size={24} className="text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">Sell USDT</div>
                  </motion.button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  USDT Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-4 pr-20 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white text-2xl font-bold placeholder-slate-400"
                    placeholder="0.00"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 font-medium">
                    USDT
                  </div>
                </div>
                {formData.amount && (
                  <div className="mt-3 p-3 bg-slate-700/30 rounded-xl border border-slate-600">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Naira Equivalent</span>
                      <span className="text-green-400 font-bold text-lg">
                        ₦{nairaAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1">
                      Rate: 1 USDT = ₦{USDT_TO_NGN_RATE.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {/* Buyer Address */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  {formData.tradeType === 'buy' ? "Seller's Wallet Address" : "Buyer's Wallet Address"}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="buyerAddress"
                    value={formData.buyerAddress}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white placeholder-slate-400"
                    placeholder="0x1234...abcd (Wallet address)"
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-3">
                  Payment Method
                </label>
                <div className="w-full">
                  <motion.button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank_transfer' as PaymentMethod }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-2xl border-2 transition-all duration-200 flex items-center justify-center space-x-3 ${
                      formData.paymentMethod === 'bank_transfer'
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <Building2 size={20} className="text-white" />
                    <div className="text-sm font-bold text-white">Bank Transfer</div>
                  </motion.button>
                </div>
              </div>

              {/* Trade Summary */}
              {formData.amount && formData.buyerAddress && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-2xl p-6"
                >
                  <div className="flex items-center mb-4">
                    <CheckCircle size={20} className="text-emerald-400 mr-2" />
                    <h3 className="text-emerald-400 font-semibold">Trade Summary</h3>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Type:</span>
                      <span className="text-white capitalize">{formData.tradeType} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Amount:</span>
                      <span className="text-white">{formData.amount} USDT</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Naira Value:</span>
                      <span className="text-white">₦{nairaAmount.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Payment:</span>
                      <span className="text-white capitalize">{formData.paymentMethod.replace('_', ' ')}</span>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-slate-800/50 rounded-xl">
                    <div className="text-xs text-slate-400 mb-1">
                      ⚡ Escrow will be created automatically when you start the trade
                    </div>
                    <div className="text-xs text-slate-400">
                      🔒 USDT will be locked safely until payment is confirmed
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-8">
              <motion.button
                type="submit"
                disabled={isLoading || !formData.amount || !formData.buyerAddress}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-2xl transition duration-200 shadow-lg flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 100-16 8 8 0 000 16zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Trade...
                  </>
                ) : (
                  <>
                    <ArrowRight size={20} className="mr-2" />
                    Start Trade & Open Escrow
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

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

export default StartTrade
