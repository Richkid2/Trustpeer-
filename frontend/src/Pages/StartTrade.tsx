import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  ArrowRight,
  CheckCircle,
  Wallet,
  Shield,
  Zap,
  Lock,
  ArrowLeft
} from 'lucide-react'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import type { CreateTradeRequest } from '../Services/escrow.service'

type TradeType = 'buy' | 'sell'
type PaymentMethod = 'bank_transfer'

const StartTrade = () => {
  const [formData, setFormData] = useState({
    usdAmount: '',
    currency: 'USDT',
    tradeType: 'buy' as TradeType,
    paymentMethod: 'bank_transfer' as PaymentMethod,
    buyerAddress: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [nairaAmount, setNairaAmount] = useState(0);
  const [cryptoAmount, setCryptoAmount] = useState('0');
  const navigate = useNavigate();

  // USD to NGN rate and crypto prices in USD
  const USD_TO_NGN_RATE = 1650; // 1 USD = 1650 NGN
  const CRYPTO_PRICES_USD = {
    USDT: 1,      // 1 USDT = 1 USD
    BTC: 57575,   // 1 BTC = 57,575 USD
    ETH: 3152,    // 1 ETH = 3,152 USD  
    BNB: 515,     // 1 BNB = 515 USD
    USDC: 1       // 1 USDC = 1 USD
  };

  // Currency options
  const CURRENCY_OPTIONS = [
    { symbol: 'USDT', name: 'Tether USD', color: 'emerald', icon: '₮' },
    { symbol: 'BTC', name: 'Bitcoin', color: 'orange', icon: '₿' },
    { symbol: 'ETH', name: 'Ethereum', color: 'blue', icon: 'Ξ' },
    { symbol: 'BNB', name: 'BNB', color: 'yellow', icon: 'Ⓑ' },
    { symbol: 'USDC', name: 'USD Coin', color: 'cyan', icon: '◎' }
  ];

  useEffect(() => {
    checkWalletConnection()
    const interval = setInterval(checkWalletConnection, 2000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Calculate crypto amount and Naira amount whenever USD amount or currency changes
    const usdValue = parseFloat(formData.usdAmount) || 0;
    const cryptoPrice = CRYPTO_PRICES_USD[formData.currency as keyof typeof CRYPTO_PRICES_USD] || 1;
    
    // Calculate crypto amount with high precision
    const calculatedCryptoAmount = usdValue / cryptoPrice;
    setCryptoAmount(calculatedCryptoAmount.toFixed(12)); // High precision for small amounts
    
    // Calculate Naira amount
    setNairaAmount(usdValue * USD_TO_NGN_RATE);
  }, [formData.usdAmount, formData.currency])

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

    if (!formData.usdAmount || parseFloat(formData.usdAmount) <= 0) {
      setError('Please enter a valid USD amount')
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
        amount: cryptoAmount, // Use calculated crypto amount
        currency: formData.currency,
        tradeType: formData.tradeType,
        paymentMethod: formData.paymentMethod,
        terms: `${cryptoAmount} ${formData.currency} (${formData.usdAmount} USD) for ₦${nairaAmount.toLocaleString()} via ${formData.paymentMethod}`
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
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="max-w-md w-full"
          >
            {/* Glassmorphic Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 text-center relative overflow-hidden">
              {/* Card Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 rounded-3xl"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Animated Wallet Icon */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="w-24 h-24 bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6 relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-orange-500/10 blur-xl"></div>
                  <Wallet className="w-12 h-12 text-red-400 relative z-10" />
                </motion.div>

                {/* Title with Gradient */}
                <h2 className="text-3xl font-kansas-black mb-3">
                  <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                    Connect Wallet
                  </span>
                </h2>
                
                <p className="text-slate-300 font-kansas-light mb-8 leading-relaxed">
                  You need to connect your wallet to start trading on TrustPeer's secure P2P platform
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/login"
                      className="group w-full bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500/30 hover:to-purple-600/30 border border-blue-500/30 backdrop-blur-sm text-white font-kansas-medium py-4 px-6 rounded-2xl transition-all duration-300 shadow-lg block text-center relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-600/10 group-hover:from-blue-500/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                      <div className="relative flex items-center justify-center">
                        <Wallet className="w-5 h-5 mr-2" />
                        Connect Wallet
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Link
                      to="/"
                      className="group w-full bg-slate-700/20 hover:bg-slate-600/30 border border-slate-600/30 backdrop-blur-sm text-slate-200 font-kansas-medium py-4 px-6 rounded-2xl transition-all duration-300 block text-center relative overflow-hidden"
                    >
                      <div className="relative flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Home
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Security Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex items-center justify-center text-emerald-400 font-kansas-light text-sm"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  <span>Secured by Multi-Chain Technology</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start items-center mb-8"
          >
            <motion.button
              onClick={() => navigate('/')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center space-x-3 text-slate-400 hover:text-white transition-all duration-300 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-full px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-kansas-medium">Back to Home</span>
            </motion.button>
          </motion.div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-kansas-black mb-4">
              <span className="bg-gradient-to-r from-white via-purple-200 to-cyan-200 bg-clip-text text-transparent">
                Start New Trade
              </span>
            </h1>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: Shield, text: "Escrow Protected", color: "emerald" },
                { icon: Zap, text: "Instant Setup", color: "blue" },
                { icon: Lock, text: "Multi-Chain", color: "purple" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`flex items-center space-x-2 bg-${feature.color}-500/10 border border-${feature.color}-500/20 rounded-full px-4 py-2 backdrop-blur-sm`}
                >
                  <feature.icon className={`w-4 h-4 text-${feature.color}-400`} />
                  <span className={`text-${feature.color}-400 font-kansas-medium text-sm`}>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="relative"
          >
            {/* Glassmorphic Card */}
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/10 p-8 relative overflow-hidden">
              {/* Card Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 rounded-3xl"></div>
              <div className="absolute -top-1 -left-1 -right-1 -bottom-1 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-emerald-500/20 rounded-3xl blur-sm opacity-20"></div>
              
              <div className="relative z-10">
                <form onSubmit={handleStartTrade}>
                  {/* Error Display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-orange-500/5"></div>
                      <div className="relative flex items-center">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-red-300 font-kansas-medium mb-1">Transaction Error</h4>
                          <p className="text-red-200 font-kansas-light text-sm">{error}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-8">
                      {/* Trade Type Selection */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-lg font-kansas-medium text-white mb-4">
                          Trade Type
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { 
                              type: 'buy' as TradeType, 
                              icon: TrendingUp, 
                              label: `Buy ${formData.currency}`, 
                              color: 'emerald',
                              description: `Purchase ${formData.currency} with Naira`
                            },
                            { 
                              type: 'sell' as TradeType, 
                              icon: TrendingDown, 
                              label: `Sell ${formData.currency}`, 
                              color: 'rose',
                              description: `Sell ${formData.currency} for Naira`
                            }
                          ].map((option) => (
                            <motion.button
                              key={option.type}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, tradeType: option.type }))}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm overflow-hidden ${
                                formData.tradeType === option.type
                                  ? `border-${option.color}-500/50 bg-${option.color}-500/10`
                                  : 'border-slate-600/50 bg-slate-700/20 hover:border-slate-500/50'
                              }`}
                            >
                              {/* Background Glow */}
                              {formData.tradeType === option.type && (
                                <div className={`absolute inset-0 bg-gradient-to-br from-${option.color}-500/10 to-transparent`}></div>
                              )}
                              
                              <div className="relative z-10 text-center">
                                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                                  formData.tradeType === option.type 
                                    ? `bg-${option.color}-500/20 border border-${option.color}-500/30` 
                                    : 'bg-slate-600/30 border border-slate-500/30'
                                }`}>
                                  <option.icon className={`w-6 h-6 ${
                                    formData.tradeType === option.type 
                                      ? `text-${option.color}-400` 
                                      : 'text-slate-300'
                                  }`} />
                                </div>
                                <div className={`font-kansas-medium mb-1 ${
                                  formData.tradeType === option.type 
                                    ? `text-${option.color}-300` 
                                    : 'text-white'
                                }`}>
                                  {option.label}
                                </div>
                                <div className="text-xs text-slate-400 font-kansas-light">
                                  {option.description}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      {/* Cryptocurrency Selection */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label className="block text-lg font-kansas-medium text-white mb-4">
                          Select Cryptocurrency
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {CURRENCY_OPTIONS.map((currency) => (
                            <motion.button
                              key={currency.symbol}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, currency: currency.symbol }))}
                              whileHover={{ scale: 1.02, y: -1 }}
                              whileTap={{ scale: 0.98 }}
                              className={`group relative p-4 rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm overflow-hidden ${
                                formData.currency === currency.symbol
                                  ? `border-${currency.color}-500/50 bg-${currency.color}-500/10`
                                  : 'border-slate-600/50 bg-slate-700/20 hover:border-slate-500/50'
                              }`}
                            >
                              {/* Background Glow */}
                              {formData.currency === currency.symbol && (
                                <div className={`absolute inset-0 bg-gradient-to-br from-${currency.color}-500/10 to-transparent`}></div>
                              )}
                              
                              <div className="relative z-10 text-center">
                                <div className={`text-2xl mb-2 font-bold ${
                                  formData.currency === currency.symbol 
                                    ? `text-${currency.color}-400` 
                                    : 'text-slate-300'
                                }`}>
                                  {currency.icon}
                                </div>
                                <div className={`font-kansas-medium text-sm ${
                                  formData.currency === currency.symbol 
                                    ? `text-${currency.color}-300` 
                                    : 'text-white'
                                }`}>
                                  {currency.symbol}
                                </div>
                                <div className="text-xs text-slate-400 font-kansas-light mt-1">
                                  {currency.name}
                                </div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>

                      {/* USD Amount Input */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-lg font-kansas-medium text-white mb-4">
                          USD Amount
                        </label>
                        <div className="relative">
                          <input
                            type="number"
                            name="usdAmount"
                            value={formData.usdAmount}
                            onChange={handleInputChange}
                            step="0.01"
                            min="0"
                            className="w-full px-6 py-4 pr-20 bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-white text-2xl font-kansas-bold placeholder-slate-400"
                            placeholder="0.00"
                          />
                          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-full px-3 py-1">
                              <span className="text-green-400 font-kansas-medium text-sm">USD</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Crypto Amount Display */}
                        {formData.usdAmount && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-2xl backdrop-blur-sm"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300 font-kansas-light">Crypto Amount</span>
                              <span className={`font-kansas-bold text-xl ${
                                formData.currency === 'BTC' ? 'text-orange-400' :
                                formData.currency === 'ETH' ? 'text-blue-400' :
                                formData.currency === 'BNB' ? 'text-yellow-400' :
                                formData.currency === 'USDC' ? 'text-cyan-400' :
                                'text-emerald-400'
                              }`}>
                                {cryptoAmount} {formData.currency}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-2 font-kansas-light">
                              Rate: 1 {formData.currency} = ${CRYPTO_PRICES_USD[formData.currency as keyof typeof CRYPTO_PRICES_USD]?.toLocaleString() || 'N/A'} USD
                            </div>
                          </motion.div>
                        )}

                        {/* Naira Conversion Display */}
                        {formData.usdAmount && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-sm"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-slate-300 font-kansas-light">Naira Equivalent</span>
                              <span className="text-emerald-400 font-kansas-bold text-xl">
                                ₦{nairaAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-2 font-kansas-light">
                              Exchange Rate: 1 USD = ₦{USD_TO_NGN_RATE.toLocaleString()}
                            </div>
                          </motion.div>
                        )}
                      </motion.div>

                      {/* Payment Method */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block text-lg font-kansas-medium text-white mb-4">
                          Payment Method
                        </label>
                        <motion.button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank_transfer' as PaymentMethod }))}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-6 rounded-2xl border-2 border-blue-500/50 bg-blue-500/10 backdrop-blur-sm transition-all duration-300 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 group-hover:from-blue-500/20 group-hover:to-purple-500/20 transition-all duration-300"></div>
                          <div className="relative flex items-center justify-center space-x-4">
                            <div className="w-12 h-12 bg-blue-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-blue-400" />
                            </div>
                            <div className="text-left">
                              <div className="text-blue-300 font-kansas-medium text-lg">Bank Transfer</div>
                              <div className="text-blue-200/70 font-kansas-light text-sm">Secure Nigerian bank transfer</div>
                            </div>
                          </div>
                        </motion.button>
                      </motion.div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                      {/* Partner Address */}
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label className="block text-lg font-kansas-medium text-white mb-4">
                          {formData.tradeType === 'buy' ? "Seller's Wallet Address" : "Buyer's Wallet Address"}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="buyerAddress"
                            value={formData.buyerAddress}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 pl-14 bg-slate-700/30 backdrop-blur-sm border border-slate-600/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 text-white font-kansas-light placeholder-slate-400"
                            placeholder="0x1234...abcd (Wallet address)"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-full flex items-center justify-center">
                              <Wallet className="w-4 h-4 text-blue-400" />
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Trade Summary */}
                      {formData.usdAmount && formData.buyerAddress && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 }}
                          className="relative"
                        >
                          <div className="bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/20 rounded-2xl p-6 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-blue-500/5"></div>
                            
                            <div className="relative z-10">
                              <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h3 className="text-emerald-400 font-kansas-medium text-lg">Trade Summary</h3>
                              </div>

                              <div className="space-y-4">
                                {[
                                  { label: "Type", value: `${formData.tradeType.toUpperCase()} ${formData.currency}` },
                                  { label: "USD Amount", value: `$${formData.usdAmount}` },
                                  { label: "Crypto Amount", value: `${cryptoAmount} ${formData.currency}` },
                                  { label: "Naira Value", value: `₦${nairaAmount.toLocaleString()}` },
                                  { label: "Payment", value: "Bank Transfer" },
                                ].map((item) => (
                                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-slate-600/30 last:border-b-0">
                                    <span className="text-slate-300 font-kansas-light">{item.label}:</span>
                                    <span className="text-white font-kansas-medium">{item.value}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Security Features */}
                              <div className="mt-6 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30">
                                <div className="space-y-3">
                                  <div className="flex items-center text-emerald-400 text-sm font-kansas-light">
                                    <Zap className="w-4 h-4 mr-2" />
                                    <span>Escrow will be created automatically when you start the trade</span>
                                  </div>
                                  <div className="flex items-center text-blue-400 text-sm font-kansas-light">
                                    <Lock className="w-4 h-4 mr-2" />
                                    <span>{formData.currency} will be locked safely until payment is confirmed</span>
                                  </div>
                                  <div className="flex items-center text-purple-400 text-sm font-kansas-light">
                                    <Shield className="w-4 h-4 mr-2" />
                                    <span>Multi-signature protection ensures maximum security</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 }}
                    className="mt-12"
                  >
                    <motion.button
                      type="submit"
                      disabled={isLoading || !formData.usdAmount || !formData.buyerAddress}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative w-full bg-gradient-to-r from-emerald-500/20 to-blue-600/20 hover:from-emerald-500/30 hover:to-blue-600/30 disabled:from-slate-600/20 disabled:to-slate-500/20 border border-emerald-500/30 hover:border-emerald-400/50 disabled:border-slate-500/30 backdrop-blur-sm text-white font-kansas-medium py-5 px-8 rounded-2xl transition-all duration-300 shadow-lg overflow-hidden"
                    >
                      {/* Button Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-blue-600/10 group-hover:from-emerald-500/20 group-hover:to-blue-600/20 transition-all duration-300"></div>
                      
                      <div className="relative flex items-center justify-center text-lg">
                        {isLoading ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                              className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full mr-3"
                            />
                            <span>Creating Trade...</span>
                          </>
                        ) : (
                          <>
                            <ArrowRight className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300" />
                            <span>Start Trade</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Footer Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0 }}
            className="mt-12 text-center"
          >
            <Link
              to="/"
              className="group inline-flex items-center gap-3 text-slate-400 hover:text-slate-300 font-kansas-medium transition-all duration-300 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-full px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Home</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StartTrade
