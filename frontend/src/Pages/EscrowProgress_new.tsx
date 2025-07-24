import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
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
  ArrowRight,
  Banknote,
  Timer,
  Info
} from 'lucide-react'
import DashboardLayout from '../Components/Layout/DashboardLayout'

const EscrowProgress = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Trade details from URL params
  const tradeId = searchParams.get('tradeId') || ''
  const amount = searchParams.get('amount') || '0'
  const currency = searchParams.get('currency') || 'USDT'
  const tradeType = searchParams.get('tradeType') || 'buy'
  const nairaAmount = searchParams.get('nairaAmount') || '0'
  const traderName = searchParams.get('traderName') || 'Trader'
  const rate = searchParams.get('rate') || '1650'

  // States
  const [currentStep, setCurrentStep] = useState(1)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [paymentSent, setPaymentSent] = useState(false)
  const [copied, setCopied] = useState('')

  // Mock bank details
  const bankDetails = {
    bankName: "Access Bank",
    accountNumber: "0123456789",
    accountName: "David Michael",
    sortCode: "044"
  }

  // Format time countdown
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Copy to clipboard function
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopied(field)
    setTimeout(() => setCopied(''), 2000)
  }

  // Timer effect
  useEffect(() => {
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
  }, [])

  // Trade steps based on type
  const getTradeSteps = () => {
    if (tradeType === 'buy') {
      return [
        { id: 1, title: 'Trade Created', description: 'Escrow has been initialized', completed: true },
        { id: 2, title: 'Send Payment', description: 'Transfer Naira to trader', completed: currentStep > 2 },
        { id: 3, title: 'Payment Confirmed', description: 'Trader confirms payment received', completed: currentStep > 3 },
        { id: 4, title: 'Crypto Released', description: 'Receive your cryptocurrency', completed: currentStep > 4 }
      ]
    } else {
      return [
        { id: 1, title: 'Trade Created', description: 'Escrow has been initialized', completed: true },
        { id: 2, title: 'Deposit Crypto', description: 'Send crypto to escrow', completed: currentStep > 2 },
        { id: 3, title: 'Payment Received', description: 'Confirm Naira payment received', completed: currentStep > 3 },
        { id: 4, title: 'Funds Released', description: 'Naira funds released to you', completed: currentStep > 4 }
      ]
    }
  }

  const steps = getTradeSteps()

  const handlePaymentSent = () => {
    setPaymentSent(true)
    setCurrentStep(3)
  }

  const handleConfirmPayment = () => {
    setCurrentStep(4)
    // Navigate to rating page after a short delay
    setTimeout(() => {
      navigate(`/rate-trader?tradeId=${tradeId}&traderName=${traderName}`)
    }, 2000)
  }

  return (
    <DashboardLayout 
      pageTitle="Escrow Progress" 
      pageDescription={`Trade ${tradeId}`}
    >
      <div className="flex-1 p-4 lg:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 bg-[#ee5f0a] rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Secure Escrow Trade</h1>
            <p className="text-white/70 text-sm">
              {tradeType === 'buy' ? 'Buying' : 'Selling'} {amount} {currency} • Trade ID: {tradeId}
            </p>
          </motion.div>

          {/* Timer Alert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8"
          >
            <div className="flex items-center gap-3">
              <Timer className="w-5 h-5 text-amber-400" />
              <div className="flex-1">
                <p className="text-amber-400 font-medium text-sm">Payment window expires in</p>
                <p className="text-white font-bold text-lg">{formatTime(timeRemaining)}</p>
              </div>
              {timeRemaining <= 300 && (
                <AlertCircle className="w-5 h-5 text-red-400" />
              )}
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Progress Steps */}
            <div className="lg:col-span-2">
              {/* Trade Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#0f1011] rounded-xl p-6 border border-white/10 mb-6"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Trade Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Amount</p>
                    <p className="text-white font-medium">{amount} {currency}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Naira Value</p>
                    <p className="text-white font-medium">₦{parseFloat(nairaAmount).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Exchange Rate</p>
                    <p className="text-white font-medium">₦{parseFloat(rate).toLocaleString()}/USD</p>
                  </div>
                  <div>
                    <p className="text-white/50 text-sm mb-1">Trading Partner</p>
                    <p className="text-white font-medium">{traderName}</p>
                  </div>
                </div>
              </motion.div>

              {/* Progress Steps */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0f1011] rounded-xl p-6 border border-white/10"
              >
                <h3 className="text-lg font-semibold text-white mb-6">Progress</h3>
                <div className="space-y-4">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.completed 
                          ? 'bg-green-500' 
                          : currentStep === step.id
                          ? 'bg-[#ee5f0a]'
                          : 'bg-gray-700'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <span className="text-white text-sm font-medium">{step.id}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          step.completed || currentStep === step.id ? 'text-white' : 'text-white/50'
                        }`}>
                          {step.title}
                        </h4>
                        <p className={`text-sm ${
                          step.completed || currentStep === step.id ? 'text-white/70' : 'text-white/40'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                      {currentStep === step.id && !step.completed && (
                        <Clock className="w-4 h-4 text-[#ee5f0a] animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Action Panel */}
            <div className="lg:col-span-1">
              {tradeType === 'buy' && currentStep === 2 && (
                /* Buy Flow - Payment Instructions */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0f1011] rounded-xl p-6 border border-white/10 mb-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-[#ee5f0a]" />
                    Send Payment
                  </h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="text-white/50 text-sm">Bank Name</label>
                      <div className="flex items-center justify-between bg-[#1a1b1c] p-3 rounded-lg mt-1">
                        <span className="text-white">{bankDetails.bankName}</span>
                        <button
                          onClick={() => copyToClipboard(bankDetails.bankName, 'bank')}
                          className="text-[#ee5f0a] hover:text-[#d54f08] transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/50 text-sm">Account Number</label>
                      <div className="flex items-center justify-between bg-[#1a1b1c] p-3 rounded-lg mt-1">
                        <span className="text-white font-mono">{bankDetails.accountNumber}</span>
                        <button
                          onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                          className="text-[#ee5f0a] hover:text-[#d54f08] transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/50 text-sm">Account Name</label>
                      <div className="flex items-center justify-between bg-[#1a1b1c] p-3 rounded-lg mt-1">
                        <span className="text-white">{bankDetails.accountName}</span>
                        <button
                          onClick={() => copyToClipboard(bankDetails.accountName, 'name')}
                          className="text-[#ee5f0a] hover:text-[#d54f08] transition-colors"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-white/50 text-sm">Amount to Send</label>
                      <div className="bg-[#ee5f0a]/10 border border-[#ee5f0a]/20 p-3 rounded-lg mt-1">
                        <span className="text-[#ee5f0a] font-bold text-lg">₦{parseFloat(nairaAmount).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {copied && (
                    <div className="text-green-400 text-sm mb-4">
                      ✓ {copied === 'bank' ? 'Bank name' : copied === 'account' ? 'Account number' : 'Account name'} copied!
                    </div>
                  )}

                  <motion.button
                    onClick={handlePaymentSent}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#ee5f0a] hover:bg-[#d54f08] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    I've Sent the Payment
                  </motion.button>
                </motion.div>
              )}

              {currentStep === 3 && (
                /* Waiting for Confirmation */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0f1011] rounded-xl p-6 border border-white/10 mb-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-amber-400" />
                    Waiting for {tradeType === 'buy' ? 'Trader' : 'Payment'} Confirmation
                  </h3>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                    </div>
                    <p className="text-white/70 text-sm mb-6">
                      {tradeType === 'buy' 
                        ? 'The trader will confirm once they receive your payment.'
                        : 'Please confirm once you receive the Naira payment.'
                      }
                    </p>
                    
                    {tradeType === 'sell' && (
                      <motion.button
                        onClick={handleConfirmPayment}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-[#ee5f0a] hover:bg-[#d54f08] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-5 h-5" />
                        Confirm Payment Received
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                /* Trade Completed */
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-[#0f1011] rounded-xl p-6 border border-white/10 mb-6"
                >
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    Trade Completed
                  </h3>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                    <p className="text-white/70 text-sm mb-6">
                      Your trade has been completed successfully! You will be redirected to rate your trading partner.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Security Info */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-[#ee5f0a]/10 border border-[#ee5f0a]/20 rounded-xl p-4"
              >
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#ee5f0a] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-[#ee5f0a] font-medium text-sm mb-1">Escrow Protection</p>
                    <p className="text-white/70 text-xs">
                      Your funds are secured in escrow and will only be released when both parties confirm the trade completion.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EscrowProgress
