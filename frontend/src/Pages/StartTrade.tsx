import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Shield, 
  ArrowDownLeft, 
  ArrowUpRight, 
  DollarSign, 
  ArrowDown,
  AlertTriangle,
  User,
  CheckCircle,
  Star,
  Search
} from 'lucide-react'
import DashboardLayout from '../Components/Layout/DashboardLayout'

interface Trader {
  id: string
  username: string
  fullName: string
  rating: number
  totalTrades: number
  rate: number
  isVerified: boolean
}

const StartTrade = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  
  // Form states
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [amountUSD, setAmountUSD] = useState('')
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT')
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Supported crypto currencies
  const cryptoCurrencies = [
    { value: 'USDT', label: 'Tether', icon: '₮' },
    { value: 'BTC', label: 'Bitcoin', icon: '₿' },
    { value: 'ETH', label: 'Ethereum', icon: 'Ξ' },
    { value: 'USDC', label: 'USD Coin', icon: '$' },
  ]

  // Calculate naira amount based on trader rate
  const nairaAmount = selectedTrader && amountUSD ? 
    (parseFloat(amountUSD) * selectedTrader.rate).toFixed(2) : ''

  // Load trader from URL params
  useEffect(() => {
    const traderId = searchParams.get('traderId')
    const username = searchParams.get('username')
    const fullName = searchParams.get('fullName')
    const rating = searchParams.get('rating')
    const totalTrades = searchParams.get('totalTrades')
    const rate = searchParams.get('rate')
    const isVerified = searchParams.get('isVerified')

    // Also check for the Dashboard verification params
    const traderUsername = searchParams.get('traderUsername')
    const traderRating = searchParams.get('traderRating')
    const traderTrades = searchParams.get('traderTrades')

    if (traderId && username && fullName && rating && totalTrades && rate && isVerified) {
      setSelectedTrader({
        id: traderId,
        username,
        fullName,
        rating: parseFloat(rating),
        totalTrades: parseInt(totalTrades),
        rate: parseFloat(rate),
        isVerified: isVerified === 'true'
      })
    } else if (traderUsername && traderRating && traderTrades) {
      // Handle Dashboard verification params
      setSelectedTrader({
        id: traderUsername,
        username: traderUsername,
        fullName: traderUsername,
        rating: parseFloat(traderRating),
        totalTrades: parseInt(traderTrades),
        rate: 1650, // Default rate
        isVerified: true
      })
    }
  }, [searchParams])

  // Handle send to escrow
  const handleSendToEscrow = async () => {
    if (!selectedTrader || !amountUSD || !cryptoCurrency) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // For now, simulate the trade creation since the service expects different parameters
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Generate a mock trade ID
      const tradeId = 'TR' + Date.now()
      
      // Create URL parameters with trade details
      const params = new URLSearchParams({
        tradeId,
        amount: amountUSD,
        currency: cryptoCurrency,
        tradeType: tradeType,
        nairaAmount: nairaAmount,
        traderName: selectedTrader.fullName,
        traderId: selectedTrader.id,
        rate: selectedTrader.rate.toString()
      })
      
      // Navigate to escrow progress with trade details
      navigate(`/escrow-progress?${params.toString()}`)
    } catch (error) {
      console.error('Error creating trade:', error)
      setError('Failed to create trade. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout 
      pageTitle="Trade" 
      pageDescription="Start a Secure Trade"
    >
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
        >
          {!selectedTrader ? (
            /* No Trader Selected - Show Navigation Options */
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-16 h-16 bg-[#ee5f0a] rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Search className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white mb-4">Select a Trader First</h1>
              <p className="text-white/70 text-sm mb-8 leading-relaxed">
                To start a trade, you need to first select a trader. You can either verify a trader's credentials or browse available traders.
              </p>

              <div className="space-y-4">
                <motion.button
                  onClick={() => navigate('/dashboard')}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 10px 25px -8px rgba(238, 95, 10, 0.4)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] hover:from-[#d54f08] hover:to-[#ee5f0a] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg border border-[#ee5f0a]/20 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                  <div className="relative flex items-center justify-center gap-3">
                    <Shield className="w-5 h-5" />
                    <span>Verify Trader on Dashboard</span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => navigate('/browse')}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 8px 20px -8px rgba(148, 163, 184, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center gap-3">
                    <Search className="w-5 h-5" />
                    <span>Browse Available Traders</span>
                  </div>
                </motion.button>
              </div>

              <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div className="text-left">
                    <p className="text-blue-400 font-medium text-sm mb-1">Why verify first?</p>
                    <p className="text-white/70 text-xs">
                      Verifying traders helps ensure safe transactions and builds trust in our community.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Trader Selected - Show Trade Form */
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="w-16 h-16 bg-[#ee5f0a] rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Start a Secure Trade</h1>
                <p className="text-white/50 text-sm">Choose your trade type and enter the amount</p>
              </div>

              {/* Trade Form */}
              <div className="bg-[#0f1011] rounded-2xl p-6 border border-white/10">
                {/* Selected Trader Display */}
                <div className="mb-6">
                  <label className="block text-white/70 text-sm font-medium mb-3">Trading with</label>
                  <div className="p-4 bg-[#1a1b1c] rounded-xl border border-white/10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-[#ee5f0a] rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-white font-medium">{selectedTrader.fullName}</p>
                          {selectedTrader.isVerified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                        <p className="text-white/50 text-sm">@{selectedTrader.username}</p>
                      </div>
                      <motion.button
                        onClick={() => {
                          setSelectedTrader(null)
                          setError('')
                          navigate('/start-trade') // Remove URL params
                        }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="text-white/50 hover:text-white"
                        title="Change trader"
                      >
                        ✕
                      </motion.button>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-medium">{selectedTrader.rating}</span>
                        </div>
                        <p className="text-white/50 text-xs">Rating</p>
                      </div>
                      <div>
                        <p className="text-white font-medium mb-1">{selectedTrader.totalTrades}</p>
                        <p className="text-white/50 text-xs">Trades</p>
                      </div>
                      <div>
                        <p className="text-[#ee5f0a] font-medium mb-1">₦{selectedTrader.rate.toLocaleString()}</p>
                        <p className="text-white/50 text-xs">Rate/USD</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Buy/Sell Toggle */}
                <div className="mb-6">
                  <label className="block text-white/70 text-sm font-medium mb-3">Trade Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      onClick={() => setTradeType('buy')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                        tradeType === 'buy'
                          ? 'bg-green-500/20 border-green-500/50 text-green-400'
                          : 'bg-[#1a1b1c] border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <ArrowDownLeft className="w-5 h-5" />
                      <span className="font-medium">Buy Crypto</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setTradeType('sell')}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border transition-all duration-300 flex items-center justify-center gap-2 ${
                        tradeType === 'sell'
                          ? 'bg-red-500/20 border-red-500/50 text-red-400'
                          : 'bg-[#1a1b1c] border-white/10 text-white/70 hover:border-white/20'
                      }`}
                    >
                      <ArrowUpRight className="w-5 h-5" />
                      <span className="font-medium">Sell Crypto</span>
                    </motion.button>
                  </div>
                </div>

                {/* Amount in USD */}
                <div className="mb-4">
                  <label className="block text-white/70 text-sm font-medium mb-3">
                    Amount (USD) {tradeType === 'buy' ? 'you want to spend' : 'you want to receive'}
                  </label>
                  <div className="flex">
                    <div className="flex-1 relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <DollarSign className="w-5 h-5 text-white/50" />
                      </div>
                      <input
                        type="number"
                        value={amountUSD}
                        onChange={(e) => setAmountUSD(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-[#1a1b1c] text-white text-xl font-bold p-4 pl-12 rounded-l-xl border border-white/10 border-r-0 focus:outline-none focus:border-[#ee5f0a]/50"
                      />
                    </div>
                    <div className="px-4 py-4 bg-[#1a1b1c] border border-white/10 border-l-0 rounded-r-xl flex items-center">
                      <span className="text-white font-medium">USD</span>
                    </div>
                  </div>
                </div>

                {/* Crypto Currency Selection */}
                <div className="mb-4">
                  <label className="block text-white/70 text-sm font-medium mb-3">
                    Cryptocurrency {tradeType === 'buy' ? 'to receive' : 'to send'}
                  </label>
                  <select
                    value={cryptoCurrency}
                    onChange={(e) => setCryptoCurrency(e.target.value)}
                    className="w-full bg-[#1a1b1c] text-white font-medium p-4 rounded-xl border border-white/10 focus:outline-none focus:border-[#ee5f0a]/50"
                  >
                    {cryptoCurrencies.map(currency => (
                      <option key={currency.value} value={currency.value}>
                        {currency.label} ({currency.icon})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Conversion Display */}
                {selectedTrader && amountUSD && (
                  <div className="mb-6">
                    <div className="flex items-center justify-center py-3">
                      <div className="flex items-center gap-2 text-white/50 text-sm">
                        <span>Exchange rate</span>
                        <span className="text-[#ee5f0a] font-medium">₦{selectedTrader.rate.toLocaleString()}/USD</span>
                      </div>
                    </div>
                    <div className="flex justify-center mb-3">
                      <motion.div
                        animate={{ rotate: 180 }}
                        transition={{ duration: 0.5 }}
                        className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center"
                      >
                        <ArrowDown className="w-4 h-4 text-white/70" />
                      </motion.div>
                    </div>
                    
                    {/* Naira Amount */}
                    <div className="p-4 bg-[#1a1b1c] rounded-xl border border-white/10">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70 text-sm">
                          {tradeType === 'buy' ? 'You pay' : 'You receive'}
                        </span>
                        <span className="text-white text-xl font-bold">₦{nairaAmount ? parseFloat(nairaAmount).toLocaleString() : '0'}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400 text-sm">{error}</span>
                  </motion.div>
                )}

                {/* Start Trade Button */}
                <motion.button
                  onClick={handleSendToEscrow}
                  disabled={isLoading || !amountUSD || !selectedTrader || !cryptoCurrency}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#ee5f0a] hover:bg-[#d54f08] disabled:bg-white/10 disabled:text-white/50 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Creating Trade...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      {tradeType === 'buy' ? 'Buy' : 'Sell'} {cryptoCurrency}
                    </>
                  )}
                </motion.button>

                {/* Security Info */}
                <div className="mt-6 p-4 bg-[#ee5f0a]/10 border border-[#ee5f0a]/20 rounded-xl">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-[#ee5f0a] mt-0.5" />
                    <div>
                      <p className="text-[#ee5f0a] font-medium text-sm mb-1">Secure Escrow Protection</p>
                      <p className="text-white/70 text-xs">
                        {tradeType === 'buy' 
                          ? `Your ₦${nairaAmount || '0'} will be held securely until you receive your ${cryptoCurrency}.`
                          : `Your ${cryptoCurrency} will be held securely until payment is confirmed.`
                        } Funds are only released when both parties confirm the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default StartTrade
