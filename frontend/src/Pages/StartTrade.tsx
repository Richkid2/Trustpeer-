import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  CreditCard, 
  DollarSign, 
  Settings 
} from 'lucide-react'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import type { CreateTradeRequest } from '../Services/escrow.service'

// Helper functions for address formats
const getAddressPlaceholder = (currency: string): string => {
  switch (currency) {
    case 'ETH':
    case 'USDC':
    case 'USDT':
      return '0x1234...abcd (Ethereum address)'
    case 'BTC':
      return '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa (Bitcoin address)'
    case 'ICP':
      return 'rdmx6-jaaaa-aaaah-qcaiq-cai (Principal ID)'
    case 'MATIC':
      return '0x1234...abcd (Polygon address)'
    default:
      return '0x1234...abcd'
  }
}

const getAddressFormatInfo = (currency: string): string => {
  switch (currency) {
    case 'ETH':
      return 'Ethereum addresses start with 0x and are 42 characters long. Make sure your partner has an Ethereum wallet like MetaMask.'
    case 'USDC':
    case 'USDT':
      return 'These are ERC-20 tokens on Ethereum. Use an Ethereum address (0x...) that supports these tokens.'
    case 'BTC':
      return 'Bitcoin addresses can start with 1, 3, or bc1. Make sure your partner has a Bitcoin wallet.'
    case 'ICP':
      return 'Internet Computer Principal IDs are unique identifiers. Your partner needs an ICP wallet like Plug or Internet Identity.'
    case 'MATIC':
      return 'Polygon addresses are like Ethereum addresses (0x...) but on the Polygon network. Make sure your partner has Polygon network configured.'
    default:
      return 'Enter a valid wallet address for the selected currency.'
  }
}

const validateAddress = (address: string, currency: string): boolean => {
  if (!address || address.trim() === '') return false

  switch (currency) {
    case 'ETH':
    case 'USDC':
    case 'USDT':
    case 'MATIC':
      // Ethereum/EVM address validation
      return /^0x[a-fA-F0-9]{40}$/.test(address)
    case 'BTC':
      // Bitcoin address validation (simplified)
      return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) || /^bc1[a-z0-9]{39,59}$/.test(address)
    case 'ICP':
      // ICP Principal ID validation (simplified)
      return /^[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{5}-[a-z0-9]{3}$/.test(address)
    default:
      return address.length > 10
  }
}

const StartTrade = () => {
  const [formData, setFormData] = useState<CreateTradeRequest>({
    partnerAddress: '',
    amount: '',
    currency: 'ETH',
    tradeType: 'buy',
    paymentMethod: 'bank_transfer',
    terms: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const navigate = useNavigate();

  const totalSteps = 3;

  // Dynamic text based on trade type
  const isBuying = formData.tradeType === 'buy';
  const pageTitle = isBuying ? 'Start a New Purchase' : 'Create a Sell Offer';
  const pageSubtitle = isBuying
    ? 'Specify the details of the crypto you want to buy'
    : 'Provide the details of the crypto you are selling';

  useEffect(() => {
    checkWalletConnection()

    // Check wallet connection periodically
    const interval = setInterval(checkWalletConnection, 2000)
    return () => clearInterval(interval)
  }, [])

  const checkWalletConnection = () => {
    const walletState = multiWalletService.getState();
    setIsWalletConnected(walletState.isConnected);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.tradeType) return 'Please select a trade type'
        if (!formData.currency) return 'Please select a currency'
        return null
      case 2:
        if (!formData.partnerAddress.trim()) return 'Partner address is required'
        if (!validateAddress(formData.partnerAddress, formData.currency)) {
          return `Please enter a valid ${formData.currency} address.`
        }
        if (!formData.amount || parseFloat(formData.amount) <= 0) return 'Please enter a valid amount'
        return null
      case 3:
        if (!formData.paymentMethod) return 'Please select a payment method'
        return null
      default:
        return null
    }
  };

  const nextStep = () => {
    const validationError = validateStep(currentStep)
    if (validationError) {
      setError(validationError)
      return
    }
    setError('')
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    } else {
      setShowPreview(true)
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  };

  const resetForm = () => {
    setCurrentStep(1)
    setShowPreview(false)
    setError('')
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isWalletConnected) {
      setError('Please connect your wallet first')
      return
    }

    const finalValidation = validateStep(1) || validateStep(2) || validateStep(3)
    if (finalValidation) {
      setError(finalValidation)
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const trade = await escrowService.createTrade(formData)
      console.log('Trade created:', trade)

      // Navigate to escrow progress page
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Trade Setup</h2>
              <p className="text-slate-300">First, choose what you want to do and with which currency.</p>
            </div>

            {/* Trade Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                What do you want to do?
              </label>
              <div className="grid grid-cols-2 gap-3">
                { [
                  { value: 'buy', label: 'Buy', icon: TrendingUp, color: 'from-green-500 to-emerald-500' },
                  { value: 'sell', label: 'Sell', icon: TrendingDown, color: 'from-red-500 to-pink-500' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, tradeType: option.value as 'buy' | 'sell' }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                      formData.tradeType === option.value
                        ? `border-blue-500 bg-gradient-to-r ${option.color}`
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-2 flex justify-center">
                      <option.icon size={24} className="text-white" />
                    </div>
                    <div className="text-sm font-medium text-white">{option.label}</div>
                  </motion.button>
                )) }
              </div>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-3">
                { [
                  { value: 'ETH', label: 'Ethereum', icon: '⟠', network: 'Ethereum' },
                  { value: 'BTC', label: 'Bitcoin', icon: '₿', network: 'Bitcoin' },
                  { value: 'ICP', label: 'Internet Computer', icon: '∞', network: 'ICP' },
                  { value: 'USDC', label: 'USD Coin', icon: '$', network: 'Ethereum' },
                  { value: 'USDT', label: 'Tether', icon: '₮', network: 'Ethereum' },
                  { value: 'MATIC', label: 'Polygon', icon: '◇', network: 'Polygon' }
                ].map((currency) => (
                  <motion.button
                    key={currency.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, currency: currency.value }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                      formData.currency === currency.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl">{currency.icon}</div>
                    <div className="text-left">
                      <div className="text-sm font-bold text-white">{currency.value}</div>
                      <div className="text-xs text-slate-400">{currency.network}</div>
                    </div>
                  </motion.button>
                )) }
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">
                {isBuying ? 'Seller Information' : 'Buyer Information'}
              </h2>
              <p className="text-slate-300">
                {isBuying
                  ? "Enter the seller's address and the amount you wish to buy."
                  : "Enter the buyer's address and the amount you are selling."}
              </p>
            </div>

            {/* Partner Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                {isBuying ? "Seller's Wallet Address" : "Buyer's Wallet Address"}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="partnerAddress"
                  value={formData.partnerAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white placeholder-slate-400"
                  placeholder={getAddressPlaceholder(formData.currency)}
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="mt-2 p-3 bg-slate-700/30 rounded-xl border border-slate-600">
                <p className="text-xs text-slate-300 mb-1">
                  <span className="font-medium">Address Format for {formData.currency}:</span>
                </p>
                <p className="text-xs text-slate-400">
                  {getAddressFormatInfo(formData.currency)}
                </p>
              </div>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                {isBuying ? `Amount of ${formData.currency} to Buy` : `Amount of ${formData.currency} to Sell`}
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.001"
                  min="0"
                  className="w-full px-4 py-4 pr-20 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white text-2xl font-bold placeholder-slate-400"
                  placeholder="0.00"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  {formData.currency}
                </div>
              </div>
            </div>

            {/* Estimated Value */}
            {formData.amount && (
              <div className="bg-slate-700/30 rounded-2xl p-4 border border-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Estimated Value</span>
                  <span className="text-white font-bold">
                    ${(parseFloat(formData.amount) * 2000).toLocaleString()} USD
                  </span>
                </div>
              </div>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-white mb-2">Payment Details</h2>
              <p className="text-slate-300">
                {isBuying
                  ? 'How would you like to pay the seller?'
                  : 'How would you like the buyer to pay you?'}
              </p>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                { [
                  { value: 'bank_transfer', label: 'Bank Transfer', icon: Building2 },
                  { value: 'paypal', label: 'PayPal', icon: CreditCard },
                  { value: 'cash', label: 'Cash', icon: DollarSign },
                  { value: 'other', label: 'Other', icon: Settings }
                ].map((method) => (
                  <motion.button
                    key={method.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, paymentMethod: method.value as 'bank_transfer' | 'paypal' | 'cash' | 'other' }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-2xl border-2 transition-all duration-200 flex items-center space-x-3 ${
                      formData.paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-500/10'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl">
                      <method.icon size={20} className="text-white" />
                    </div>
                    <div className="text-sm font-bold text-white">{method.label}</div>
                  </motion.button>
                )) }
              </div>
            </div>

            {/* Trade Terms */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Trade Terms & Notes
              </label>
              <textarea
                name="terms"
                value={formData.terms}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white placeholder-slate-400 resize-none"
                placeholder="Enter any specific terms, conditions, or notes for this trade..."
              />
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  const renderTradePreview = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isBuying ? 'Review Your Purchase' : 'Review Your Sale'}
        </h2>
        <p className="text-slate-300">Please review your trade details before creating the escrow.</p>
      </div>

      <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 text-sm mb-1">You are</div>
            <div className="text-white font-medium capitalize">{formData.tradeType}ing</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Amount</div>
            <div className="text-white font-medium">{formData.amount} {formData.currency}</div>
          </div>
        </div>

        <div>
          <div className="text-slate-400 text-sm mb-1">
            {isBuying ? 'Sending to Seller' : 'Receiving from Buyer'}
          </div>
          <div className="text-white font-mono text-sm">{formData.partnerAddress}</div>
        </div>
        
        <div>
          <div className="text-slate-400 text-sm mb-1">Payment Method</div>
          <div className="text-white font-medium capitalize">{formData.paymentMethod.replace('_', ' ')}</div>
        </div>

        {formData.terms && (
          <div>
            <div className="text-slate-400 text-sm mb-1">Terms & Notes</div>
            <div className="text-white text-sm">{formData.terms}</div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={resetForm}
          className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-4 px-6 rounded-xl transition duration-200"
        >
          Edit Trade
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-4 px-6 rounded-xl transition duration-200 shadow-lg flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 100-16 8 8 0 000 16zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {isBuying ? 'Create Purchase' : 'Create Sale'}
            </>
          )}
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
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
          <h1 className="text-4xl font-bold text-white mb-2">{pageTitle}</h1>
          <p className="text-slate-300">{pageSubtitle}</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            { [
              { label: 'Setup' },
              { label: isBuying ? 'Seller & Amount' : 'Buyer & Amount' },
              { label: 'Payment' }
            ].map((_, index) => {
              const step = index + 1;
              return (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                    step <= currentStep || showPreview
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}>
                    {step <= currentStep || showPreview ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step
                    )}
                  </div>
                  {step < 3 && (
                    <div className={`w-20 h-1 mx-4 transition-all duration-200 ${
                      step < currentStep || showPreview ? 'bg-blue-500' : 'bg-slate-700'
                    }`} />
                  )}
                </div>
              );
            })}
          </div>
          <div className="flex justify-between text-sm text-slate-400">
            <span>Setup</span>
            <span>{isBuying ? 'Seller & Amount' : 'Buyer & Amount'}</span>
            <span>Payment</span>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50"
        >
          <form onSubmit={handleSubmit}>
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mb-6 bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center"
                >
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-300">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {showPreview ? renderTradePreview() : renderStepContent()}
            </AnimatePresence>

            {/* Navigation Buttons */}
            {!showPreview && (
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`px-6 py-3 rounded-xl font-medium transition duration-200 ${
                    currentStep === 1
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition duration-200"
                >
                  {currentStep === totalSteps ? 'Review' : 'Next'}
                </button>
              </div>
            )}
          </form>
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

export default StartTrade
