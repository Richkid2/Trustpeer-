import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { escrowService } from '../Services/escrow.service'
import { multiWalletService } from '../Services/wallet.service'
import type { CreateTradeRequest } from '../Services/escrow.service'

const StartTrade = () => {
  const [formData, setFormData] = useState<CreateTradeRequest>({
    partnerAddress: '',
    amount: '',
    currency: 'ETH',
    description: '',
    type: 'buy',
    releaseConditions: []
  })
  const [customCondition, setCustomCondition] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const navigate = useNavigate()

  const totalSteps = 3

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = () => {
    const walletState = multiWalletService.getState()
    setIsWalletConnected(walletState.isConnected)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const addReleaseCondition = () => {
    if (customCondition.trim()) {
      setFormData(prev => ({
        ...prev,
        releaseConditions: [...(prev.releaseConditions || []), customCondition.trim()]
      }))
      setCustomCondition('')
    }
  }

  const removeReleaseCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      releaseConditions: (prev.releaseConditions || []).filter((_, i) => i !== index)
    }))
  }

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        if (!formData.type) return 'Please select a trade type'
        if (!formData.partnerAddress.trim()) return 'Partner address is required'
        if (!formData.partnerAddress.startsWith('0x') || formData.partnerAddress.length !== 42) {
          return 'Please enter a valid wallet address'
        }
        return null
      case 2:
        if (!formData.amount || parseFloat(formData.amount) <= 0) return 'Please enter a valid amount'
        if (!formData.currency) return 'Please select a currency'
        return null
      case 3:
        if (!formData.description.trim()) return 'Trade description is required'
        if (formData.description.length < 10) return 'Description must be at least 10 characters'
        return null
      default:
        return null
    }
  }

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
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError('')
    }
  }

  const resetForm = () => {
    setCurrentStep(1)
    setShowPreview(false)
    setError('')
  }

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
      navigate(`/escrow-progress?tradeId=${trade.id}`)
    } catch (error) {
      console.error('Failed to create trade:', error)
      setError(error instanceof Error ? error.message : 'Failed to create trade')
    } finally {
      setIsLoading(false)
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
              <p className="text-slate-300">Choose your trade type and partner</p>
            </div>

            {/* Trade Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                What do you want to do?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'buy', label: 'Buy', icon: '📈', color: 'from-green-500 to-emerald-500' },
                  { value: 'sell', label: 'Sell', icon: '📉', color: 'from-red-500 to-pink-500' },
                  { value: 'exchange', label: 'Swap', icon: '🔄', color: 'from-blue-500 to-cyan-500' }
                ].map((option) => (
                  <motion.button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: option.value as any }))}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-200 ${
                      formData.type === option.value
                        ? `border-blue-500 bg-gradient-to-r ${option.color}`
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{option.icon}</div>
                    <div className="text-sm font-medium text-white">{option.label}</div>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Partner Address */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Trading Partner Address
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="partnerAddress"
                  value={formData.partnerAddress}
                  onChange={handleInputChange}
                  className="w-full px-4 py-4 pl-12 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white placeholder-slate-400"
                  placeholder="0x1234...abcd"
                />
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Enter the wallet address of the person you want to trade with
              </p>
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
              <h2 className="text-2xl font-bold text-white mb-2">Amount & Currency</h2>
              <p className="text-slate-300">Set your trade amount and currency</p>
            </div>

            {/* Amount */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Amount
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

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Currency
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'ETH', label: 'Ethereum', icon: '⟠' },
                  { value: 'BTC', label: 'Bitcoin', icon: '₿' },
                  { value: 'ICP', label: 'Internet Computer', icon: '∞' },
                  { value: 'USDC', label: 'USD Coin', icon: '$' },
                  { value: 'USDT', label: 'Tether', icon: '₮' },
                  { value: 'MATIC', label: 'Polygon', icon: '◇' }
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
                      <div className="text-xs text-slate-400">{currency.label}</div>
                    </div>
                  </motion.button>
                ))}
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
              <h2 className="text-2xl font-bold text-white mb-2">Trade Details</h2>
              <p className="text-slate-300">Add description and conditions</p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Trade Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white placeholder-slate-400 resize-none"
                placeholder="Describe what you're trading, terms, and any additional details..."
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-slate-400">
                  Be specific about your trade terms
                </p>
                <p className="text-xs text-slate-400">
                  {formData.description.length}/10 minimum
                </p>
              </div>
            </div>

            {/* Release Conditions */}
            <div>
              <label className="block text-sm font-semibold text-slate-200 mb-3">
                Release Conditions
                <span className="text-slate-400 font-normal ml-2">(Optional)</span>
              </label>
              
              {(formData.releaseConditions || []).length > 0 && (
                <div className="space-y-2 mb-4">
                  {(formData.releaseConditions || []).map((condition, index) => (
                    <div key={index} className="flex items-center gap-3 bg-slate-700/50 rounded-xl p-3 border border-slate-600">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="flex-1 text-sm text-white">{condition}</span>
                      <button
                        type="button"
                        onClick={() => removeReleaseCondition(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <input
                  type="text"
                  value={customCondition}
                  onChange={(e) => setCustomCondition(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white placeholder-slate-400"
                  placeholder="Add release condition"
                />
                <button
                  type="button"
                  onClick={addReleaseCondition}
                  disabled={!customCondition.trim()}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl transition duration-200 font-medium"
                >
                  Add
                </button>
              </div>
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
        <h2 className="text-2xl font-bold text-white mb-2">Review Trade</h2>
        <p className="text-slate-300">Please review your trade details before creating</p>
      </div>

      <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-slate-400 text-sm mb-1">Trade Type</div>
            <div className="text-white font-medium capitalize">{formData.type}</div>
          </div>
          <div>
            <div className="text-slate-400 text-sm mb-1">Amount</div>
            <div className="text-white font-medium">{formData.amount} {formData.currency}</div>
          </div>
        </div>
        
        <div>
          <div className="text-slate-400 text-sm mb-1">Trading Partner</div>
          <div className="text-white font-mono text-sm">{formData.partnerAddress}</div>
        </div>
        
        <div>
          <div className="text-slate-400 text-sm mb-1">Description</div>
          <div className="text-white text-sm">{formData.description}</div>
        </div>
        
        {(formData.releaseConditions || []).length > 0 && (
          <div>
            <div className="text-slate-400 text-sm mb-2">Release Conditions</div>
            <div className="space-y-1">
              {(formData.releaseConditions || []).map((condition, index) => (
                <div key={index} className="flex items-center gap-2 text-white text-sm">
                  <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                  {condition}
                </div>
              ))}
            </div>
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
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Create Trade
            </>
          )}
        </button>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-2">Create Trade</h1>
          <p className="text-slate-300">Secure peer-to-peer trading with escrow protection</p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((step) => (
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
            ))}
          </div>
          <div className="flex justify-between text-sm text-slate-400">
            <span>Setup</span>
            <span>Amount</span>
            <span>Details</span>
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
