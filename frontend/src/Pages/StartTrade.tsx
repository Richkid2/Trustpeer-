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
      <div className="min-h-screen bg-[#080909] relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(238,95,10,0.3) 1px, transparent 0)',
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
            {/* Card */}
            <div className="bg-[#0f1011] rounded-3xl shadow-2xl border border-gray-800/50 p-8 text-center relative overflow-hidden">
              {/* Content */}
              <div className="relative z-10">
                {/* Animated Wallet Icon */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  className="w-24 h-24 bg-[#ee5f0a]/10 border border-[#ee5f0a]/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <Wallet className="w-12 h-12 text-[#ee5f0a]" />
                </motion.div>

                {/* Title */}
                <h2 className="text-3xl font-bold mb-3 text-white">
                  Connect Wallet
                </h2>
                
                <p className="text-gray-400 font-medium mb-8 leading-relaxed">
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
                      className="w-full bg-[#ee5f0a] hover:bg-[#d54f08] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg block text-center"
                    >
                      <div className="flex items-center justify-center">
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
                      to="/dashboard"
                      className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium py-4 px-6 rounded-xl transition-all duration-300 block text-center"
                    >
                      <div className="flex items-center justify-center">
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to Dashboard
                      </div>
                    </Link>
                  </motion.div>
                </div>

                {/* Security Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 flex items-center justify-center text-[#ee5f0a] font-medium text-sm"
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
    <div className="min-h-screen bg-[#080909] relative overflow-hidden">
      {/* Animated background elements with brand colors */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(238,95,10,0.3) 1px, transparent 0)',
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
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05, x: -5 }}
              whileTap={{ scale: 0.95 }}
              className="group flex items-center space-x-3 text-gray-400 hover:text-white transition-all duration-300 bg-[#0f1011] border border-gray-800 rounded-full px-4 py-2"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="font-medium">Back to Dashboard</span>
            </motion.button>
          </motion.div>

          {/* Title Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl font-bold mb-4 text-white">
              Start New Trade
            </h1>
            
            {/* Feature Badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {[
                { icon: Shield, text: "Escrow Protected" },
                { icon: Zap, text: "Instant Setup" },
                { icon: Lock, text: "Multi-Chain" }
              ].map((feature, index) => (
                <motion.div
                  key={feature.text}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center space-x-2 bg-[#0f1011] border border-gray-800 rounded-full px-4 py-2"
                >
                  <feature.icon className="w-4 h-4 text-[#ee5f0a]" />
                  <span className="text-gray-300 font-medium text-sm">{feature.text}</span>
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
            {/* Card */}
            <div className="bg-[#0f1011] rounded-3xl shadow-2xl border border-gray-800 p-8 relative overflow-hidden">
              <div className="relative z-10">
                <form onSubmit={handleStartTrade}>
                  {/* Error Display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mb-8 bg-red-500/10 border border-red-500/20 rounded-2xl p-6"
                    >
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mr-4">
                          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="text-red-300 font-medium mb-1">Transaction Error</h4>
                          <p className="text-red-200 text-sm">{error}</p>
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
                        <label className="block text-lg font-medium text-white mb-4">
                          Trade Type
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { 
                              type: 'buy' as TradeType, 
                              icon: TrendingUp, 
                              label: `Buy ${formData.currency}`, 
                              description: `Purchase ${formData.currency} with Naira`
                            },
                            { 
                              type: 'sell' as TradeType, 
                              icon: TrendingDown, 
                              label: `Sell ${formData.currency}`, 
                              description: `Sell ${formData.currency} for Naira`
                            }
                          ].map((option) => (
                            <motion.button
                              key={option.type}
                              type="button"
                              onClick={() => setFormData(prev => ({ ...prev, tradeType: option.type }))}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                                formData.tradeType === option.type
                                  ? 'border-[#ee5f0a] bg-[#ee5f0a]/5'
                                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                                  formData.tradeType === option.type 
                                    ? 'bg-[#ee5f0a]/20 border border-[#ee5f0a]/30' 
                                    : 'bg-gray-700/30 border border-gray-600/30'
                                }`}>
                                  <option.icon className={`w-6 h-6 ${
                                    formData.tradeType === option.type 
                                      ? 'text-[#ee5f0a]' 
                                      : 'text-gray-400'
                                  }`} />
                                </div>
                                <div className={`font-medium mb-1 ${
                                  formData.tradeType === option.type 
                                    ? 'text-[#ee5f0a]' 
                                    : 'text-white'
                                }`}>
                                  {option.label}
                                </div>
                                <div className="text-xs text-gray-400">
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
                        <label className="block text-lg font-medium text-white mb-4">
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
                              className={`p-4 rounded-2xl border-2 transition-all duration-300 ${
                                formData.currency === currency.symbol
                                  ? 'border-[#ee5f0a] bg-[#ee5f0a]/5'
                                  : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                              }`}
                            >
                              <div className="text-center">
                                <div className={`text-2xl mb-2 font-bold ${
                                  formData.currency === currency.symbol 
                                    ? 'text-[#ee5f0a]' 
                                    : 'text-gray-400'
                                }`}>
                                  {currency.icon}
                                </div>
                                <div className={`font-medium text-sm ${
                                  formData.currency === currency.symbol 
                                    ? 'text-[#ee5f0a]' 
                                    : 'text-white'
                                }`}>
                                  {currency.symbol}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">
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
                        <label className="block text-lg font-medium text-white mb-4">
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
                            className="w-full px-6 py-4 pr-20 bg-gray-800/50 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-[#ee5f0a] transition-all duration-300 text-white text-2xl font-bold placeholder-gray-400"
                            placeholder="0.00"
                          />
                          <div className="absolute right-6 top-1/2 transform -translate-y-1/2">
                            <div className="bg-[#ee5f0a]/20 border border-[#ee5f0a]/30 rounded-full px-3 py-1">
                              <span className="text-[#ee5f0a] font-medium text-sm">USD</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Crypto Amount Display */}
                        {formData.usdAmount && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-[#0f1011] border border-gray-800 rounded-2xl"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Crypto Amount</span>
                              <span className="font-bold text-xl text-[#ee5f0a]">
                                {cryptoAmount} {formData.currency}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
                              Rate: 1 {formData.currency} = ${CRYPTO_PRICES_USD[formData.currency as keyof typeof CRYPTO_PRICES_USD]?.toLocaleString() || 'N/A'} USD
                            </div>
                          </motion.div>
                        )}

                        {/* Naira Conversion Display */}
                        {formData.usdAmount && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mt-4 p-4 bg-[#0f1011] border border-gray-800 rounded-2xl"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Naira Equivalent</span>
                              <span className="text-white font-bold text-xl">
                                ₦{nairaAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-2">
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
                        <label className="block text-lg font-medium text-white mb-4">
                          Payment Method
                        </label>
                        <motion.button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'bank_transfer' as PaymentMethod }))}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full p-6 rounded-2xl border-2 border-[#ee5f0a]/50 bg-[#ee5f0a]/10 transition-all duration-300 relative overflow-hidden group"
                        >
                          <div className="absolute inset-0 bg-[#ee5f0a]/10 group-hover:bg-[#ee5f0a]/20 transition-all duration-300"></div>
                          <div className="relative flex items-center justify-center space-x-4">
                            <div className="w-12 h-12 bg-[#ee5f0a]/20 border border-[#ee5f0a]/30 rounded-full flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-[#ee5f0a]" />
                            </div>
                            <div className="text-left">
                              <div className="text-[#ee5f0a] font-medium text-lg">Bank Transfer</div>
                              <div className="text-gray-300 text-sm">Secure Nigerian bank transfer</div>
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
                        <label className="block text-lg font-medium text-white mb-4">
                          {formData.tradeType === 'buy' ? "Seller's Wallet Address" : "Buyer's Wallet Address"}
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="buyerAddress"
                            value={formData.buyerAddress}
                            onChange={handleInputChange}
                            className="w-full px-6 py-4 pl-14 bg-gray-800/50 border border-gray-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-[#ee5f0a] transition-all duration-300 text-white placeholder-gray-400"
                            placeholder="0x1234...abcd (Wallet address)"
                          />
                          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                            <div className="w-8 h-8 bg-[#ee5f0a]/20 border border-[#ee5f0a]/30 rounded-full flex items-center justify-center">
                              <Wallet className="w-4 h-4 text-[#ee5f0a]" />
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
                          <div className="bg-[#0f1011] border border-gray-800 rounded-2xl p-6 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#080909]/50"></div>
                            
                            <div className="relative z-10">
                              <div className="flex items-center mb-6">
                                <div className="w-10 h-10 bg-[#ee5f0a]/20 border border-[#ee5f0a]/30 rounded-full flex items-center justify-center mr-3">
                                  <CheckCircle className="w-5 h-5 text-[#ee5f0a]" />
                                </div>
                                <h3 className="text-[#ee5f0a] font-medium text-lg">Trade Summary</h3>
                              </div>

                              <div className="space-y-4">
                                {[
                                  { label: "Type", value: `${formData.tradeType.toUpperCase()} ${formData.currency}` },
                                  { label: "USD Amount", value: `$${formData.usdAmount}` },
                                  { label: "Crypto Amount", value: `${cryptoAmount} ${formData.currency}` },
                                  { label: "Naira Value", value: `₦${nairaAmount.toLocaleString()}` },
                                  { label: "Payment", value: "Bank Transfer" },
                                ].map((item) => (
                                  <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-700/50 last:border-b-0">
                                    <span className="text-gray-300">{item.label}:</span>
                                    <span className="text-white font-medium">{item.value}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Security Features */}
                              <div className="mt-6 p-4 bg-gray-800/50 rounded-xl border border-gray-700/50">
                                <div className="space-y-3">
                                  <div className="flex items-center text-[#ee5f0a] text-sm">
                                    <Zap className="w-4 h-4 mr-2" />
                                    <span>Escrow will be created automatically when you start the trade</span>
                                  </div>
                                  <div className="flex items-center text-white text-sm">
                                    <Lock className="w-4 h-4 mr-2" />
                                    <span>{formData.currency} will be locked safely until payment is confirmed</span>
                                  </div>
                                  <div className="flex items-center text-gray-300 text-sm">
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
                      className="group relative w-full bg-[#ee5f0a] hover:bg-[#d54f08] disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-5 px-8 rounded-2xl transition-all duration-300 shadow-lg overflow-hidden"
                    >
                      {/* Button Background Glow */}
                      <div className="absolute inset-0 bg-[#ee5f0a]/10 group-hover:bg-[#ee5f0a]/20 transition-all duration-300"></div>
                      
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
              to="/dashboard"
              className="group inline-flex items-center gap-3 text-gray-400 hover:text-gray-300 font-medium transition-all duration-300 bg-gray-800/50 border border-gray-700 rounded-full px-6 py-3"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
              <span>Back to Dashboard</span>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default StartTrade
