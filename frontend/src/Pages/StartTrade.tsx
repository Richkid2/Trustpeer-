import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  ArrowDown,
  Shield,
  User,
  CheckCircle,
  AlertTriangle,
  Search,
  ArrowUpRight,
  ArrowDownLeft,
  Star,
  DollarSign
} from 'lucide-react'
import { escrowService } from '../Services/escrow.service'
import DashboardLayout from '../Components/Layout/DashboardLayout'
import type { CreateTradeRequest } from '../Services/escrow.service'

// Mock trader data - this would come from API
interface Trader {
  id: string
  username: string
  fullName: string
  rating: number
  totalTrades: number
  rate: number // NGN per USD
  isVerified: boolean
  avatar?: string
}

const mockTraders: Trader[] = [
  {
    id: '1',
    username: 'cryptoking_ng',
    fullName: 'Ahmed Musa',
    rating: 4.8,
    totalTrades: 245,
    rate: 1650,
    isVerified: true
  },
  {
    id: '2',
    username: 'naira_master',
    fullName: 'Chioma Okafor',
    rating: 4.9,
    totalTrades: 189,
    rate: 1655,
    isVerified: true
  },
  {
    id: '3',
    username: 'fast_trader',
    fullName: 'Ibrahim Yusuf',
    rating: 4.7,
    totalTrades: 156,
    rate: 1648,
    isVerified: true
  }
]

const StartTrade = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Form state
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [selectedTrader, setSelectedTrader] = useState<Trader | null>(null)
  const [usernameInput, setUsernameInput] = useState('')
  const [amountUSD, setAmountUSD] = useState('')
  const [cryptoCurrency, setCryptoCurrency] = useState('USDT')
  const [nairaAmount, setNairaAmount] = useState('')

  // Mock exchange rates
  const cryptoCurrencies = [
    { value: 'USDT', label: 'USDT', icon: '₮' },
    { value: 'BTC', label: 'BTC', icon: '₿' },
    { value: 'ETH', label: 'ETH', icon: 'Ξ' },
    { value: 'BNB', label: 'BNB', icon: 'BNB' },
    { value: 'USDC', label: 'USDC', icon: '$' }
  ]

  // Get trader from URL params (from Browse page)
  useEffect(() => {
    const traderId = searchParams.get('traderId')
    if (traderId) {
      const trader = mockTraders.find(t => t.id === traderId)
      if (trader) {
        setSelectedTrader(trader)
      }
    }
  }, [searchParams])

  // Calculate Naira amount when USD amount or trader changes
  useEffect(() => {
    if (amountUSD && selectedTrader) {
      const naira = (parseFloat(amountUSD) * selectedTrader.rate).toFixed(2)
      setNairaAmount(naira)
    } else {
      setNairaAmount('')
    }
  }, [amountUSD, selectedTrader])

  const handleUsernameSearch = () => {
    if (!usernameInput.trim()) return
    
    // Mock search - in real app, this would be an API call
    const trader = mockTraders.find(t => 
      t.username.toLowerCase().includes(usernameInput.toLowerCase())
    )
    
    if (trader) {
      setSelectedTrader(trader)
      setUsernameInput('')
      setError('')
    } else {
      setError('Trader not found. Please check the username.')
    }
  }

  const handleBrowseTraders = () => {
    navigate('/browse')
  }

  const handleSendToEscrow = async () => {
    if (!selectedTrader || !amountUSD || !cryptoCurrency) {
      setError('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      // Create the trade
      const tradeRequest: CreateTradeRequest = {
        partnerAddress: selectedTrader.id, // In real app, this would be trader's wallet address
        amount: amountUSD,
        currency: cryptoCurrency,
        tradeType: tradeType,
        paymentMethod: 'bank_transfer',
        terms: `${tradeType === 'buy' ? 'Buy' : 'Sell'} $${amountUSD} worth of ${cryptoCurrency} for ₦${nairaAmount} via bank transfer`
      }

      const trade = await escrowService.createTrade(tradeRequest)
      
      // Navigate to escrow progress page
      navigate(`/escrow-progress?tradeId=${trade.id}`)
    } catch (error) {
      console.error('Failed to create trade:', error)
      setError(error instanceof Error ? error.message : 'Failed to create trade')
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
            <p className="text-white/50 text-sm">Choose your trade type and select a trader</p>
          </div>

          {/* Trade Form */}
          <div className="bg-[#0f1011] rounded-2xl p-6 border border-white/10">
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

            {/* Trader Selection */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm font-medium mb-3">Select Trader</label>
              
              {!selectedTrader ? (
                <div className="space-y-3">
                  {/* Browse Traders Button */}
                  <motion.button
                    onClick={handleBrowseTraders}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 bg-[#1a1b1c] border border-white/10 rounded-xl text-white hover:border-[#ee5f0a]/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    <span>Browse Available Traders</span>
                  </motion.button>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-white/50 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>
                  
                  {/* Username Input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={usernameInput}
                      onChange={(e) => setUsernameInput(e.target.value)}
                      placeholder="Enter trader username"
                      className="flex-1 bg-[#1a1b1c] text-white p-3 rounded-xl border border-white/10 focus:outline-none focus:border-[#ee5f0a]/50"
                    />
                    <motion.button
                      onClick={handleUsernameSearch}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 bg-[#ee5f0a] text-white rounded-xl hover:bg-[#d54f08] transition-colors"
                    >
                      <Search className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              ) : (
                /* Selected Trader Display */
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
                      }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-white/50 hover:text-white"
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
              )}
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
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

export default StartTrade
