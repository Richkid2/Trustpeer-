import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Copy,
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

  // States
  const [currentStep, setCurrentStep] = useState(2) // Start at step 2 (payment/deposit step)
  const [timeRemaining, setTimeRemaining] = useState(1800) // 30 minutes
  const [copied, setCopied] = useState('')
  const [autoProgressCountdown, setAutoProgressCountdown] = useState<number | null>(null)

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

  // Auto-progress for demo purposes (remove when using real API)
  useEffect(() => {
    let autoProgressTimer: number
    let countdownTimer: number

    // For sellers, auto-progress from step 2 to step 3 after 5 seconds
    if (tradeType === 'sell' && currentStep === 2) {
      setAutoProgressCountdown(5)
      countdownTimer = window.setInterval(() => {
        setAutoProgressCountdown(prev => {
          if (prev && prev > 1) {
            return prev - 1
          }
          return null
        })
      }, 1000)

      autoProgressTimer = window.setTimeout(() => {
        setCurrentStep(3)
        setAutoProgressCountdown(null)
      }, 5000)
    }

    // For buyers, auto-progress from step 3 to step 4 after 8 seconds (simulating trader confirmation)
    if (tradeType === 'buy' && currentStep === 3) {
      setAutoProgressCountdown(8)
      countdownTimer = window.setInterval(() => {
        setAutoProgressCountdown(prev => {
          if (prev && prev > 1) {
            return prev - 1
          }
          return null
        })
      }, 1000)

      autoProgressTimer = window.setTimeout(() => {
        setCurrentStep(4)
        setAutoProgressCountdown(null)
        // Navigate to rating page after completing
        setTimeout(() => {
          navigate(`/rate-trader?tradeId=${tradeId}&traderName=${traderName}`)
        }, 3000)
      }, 8000)
    }

    return () => {
      if (autoProgressTimer) {
        clearTimeout(autoProgressTimer)
      }
      if (countdownTimer) {
        clearInterval(countdownTimer)
      }
    }
  }, [currentStep, tradeType, navigate, tradeId, traderName])

  const handlePaymentSent = () => {
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
      pageTitle="Escrow" 
      pageDescription={`${tradeId}`}
    >
      <div className="flex flex-col lg:flex-row h-full">
        {/* Left Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-80 bg-[#0f1011] border-b lg:border-b-0 lg:border-r border-white/10 p-4 lg:p-6 flex flex-col"
        >
          {/* Action Buttons - Moved to top */}
          <div className="flex gap-2 mb-6">
            <button className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 py-2 px-2 lg:px-3 rounded-lg hover:bg-red-500/20 transition-colors flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <AlertCircle className="w-4 h-4" />
              <span className="hidden sm:inline lg:hidden xl:inline">End Transaction</span>
              <span className="sm:hidden lg:inline xl:hidden">End</span>
            </button>
            <button className="flex-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 py-2 px-2 lg:px-3 rounded-lg hover:bg-yellow-500/20 transition-colors flex items-center justify-center gap-1 lg:gap-2 text-xs lg:text-sm">
              <Info className="w-4 h-4" />
              <span className="hidden sm:inline lg:hidden xl:inline">Report Dispute</span>
              <span className="sm:hidden lg:inline xl:hidden">Report</span>
            </button>
          </div>

          {/* Trade ID */}
          <div className="mb-4">
            <h1 className="text-xl lg:text-2xl font-bold text-white">{tradeId}</h1>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-green-500 text-sm font-medium">Ongoing</span>
            </div>
          </div>

          {/* Timer */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Timer className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-sm">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            {/* Trade Info Header */}
            <h2 className="text-xl font-semibold text-white mb-6">Trade Info</h2>

            {/* Trade Details */}
            <div className="bg-[#0f1011] rounded-xl p-6 border border-white/10 mb-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-white/70 text-sm">Amount {tradeType === 'buy' ? 'to Receive' : 'Sent'}</span>
                  <span className="text-white font-medium">{amount} {currency}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-white/70 text-sm">Amount {tradeType === 'buy' ? 'to Send' : 'to Receive'}</span>
                  <span className="text-white font-medium">₦ {parseFloat(nairaAmount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/70 text-sm">Escrow Fee</span>
                  <span className="text-white font-medium">0.5% (₦ 720)</span>
                </div>
              </div>
            </div>

            {/* Bank Details for Buyer */}
            {tradeType === 'buy' && currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                  <h4 className="text-blue-400 font-medium mb-2">Payment Instructions</h4>
                  <ul className="text-blue-300 text-sm space-y-1">
                    <li>• Make payment to the bank details below using the EXACT amount</li>
                    <li>• Use your registered name when sending payment</li>
                    <li>• Do not mention "crypto" or "Bitcoin" in payment reference</li>
                    <li>• Click "I've Sent the Payment" only after successful transfer</li>
                  </ul>
                </div>

                <h3 className="text-white font-medium mb-4">Send payment to:</h3>
                <div className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-white/10 space-y-4">
                  <div>
                    <label className="text-white/50 text-sm">Bank Name</label>
                    <div className="flex items-center justify-between bg-[#1a1b1c] p-3 rounded-lg mt-1">
                      <span className="text-white text-sm lg:text-base">{bankDetails.bankName}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.bankName, 'bank')}
                        className="text-[#ee5f0a] hover:text-[#d54f08] transition-colors p-1"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-sm">Account Number</label>
                    <div className="flex items-center justify-between bg-[#1a1b1c] p-3 rounded-lg mt-1">
                      <span className="text-white font-mono text-sm lg:text-base">{bankDetails.accountNumber}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountNumber, 'account')}
                        className="text-[#ee5f0a] hover:text-[#d54f08] transition-colors p-1"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-sm">Account Name</label>
                    <div className="flex items-center justify-between bg-[#1a1b1c] p-3 rounded-lg mt-1">
                      <span className="text-white text-sm lg:text-base">{bankDetails.accountName}</span>
                      <button
                        onClick={() => copyToClipboard(bankDetails.accountName, 'name')}
                        className="text-[#ee5f0a] hover:text-[#d54f08] transition-colors p-1"
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
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 border border-green-500/30 text-green-400 text-sm p-3 rounded-lg mt-3"
                  >
                    ✓ {copied === 'bank' ? 'Bank name' : copied === 'account' ? 'Account number' : 'Account name'} copied to clipboard!
                  </motion.div>
                )}

                <motion.button
                  onClick={handlePaymentSent}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#ee5f0a] hover:bg-[#d54f08] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 mt-4"
                >
                  I've Sent the Payment
                </motion.button>

                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-3">
                  <p className="text-green-400 text-xs text-center">
                    🚀 Demo Mode: Click button above to advance, or it will auto-advance when trader confirms
                  </p>
                </div>
              </motion.div>
            )}

            {/* Seller Step 2: Wait for Buyer Payment */}
            {tradeType === 'sell' && currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6"
              >
                <div className="bg-[#0f1011] rounded-xl p-6 border border-white/10">
                  <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-blue-400 animate-pulse" />
                  </div>
                  <h3 className="text-white font-medium mb-2">Waiting for Buyer Payment</h3>
                  <p className="text-white/70 text-sm mb-6">
                    The buyer is sending ₦{parseFloat(nairaAmount).toLocaleString()} to your account. You will be notified when payment is received.
                  </p>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                    <p className="text-blue-400 text-sm">
                      💡 Your {amount} {currency} is safely held in escrow and will be released once you confirm payment.
                    </p>
                  </div>
                  <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                    <p className="text-green-400 text-xs">
                      🚀 Demo Mode: Auto-advancing to next step in {autoProgressCountdown || 5} seconds...
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Waiting for Confirmation */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <div className="bg-[#0f1011] rounded-xl p-6 border border-white/10 text-center">
                  <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-amber-400 animate-pulse" />
                  </div>
                  
                  {tradeType === 'buy' ? (
                    <>
                      <h3 className="text-white font-medium mb-2">Payment Sent - Waiting for Confirmation</h3>
                      <p className="text-white/70 text-sm mb-4">
                        The trader will confirm your payment and release the {amount} {currency} to your wallet.
                      </p>
                      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
                        <p className="text-amber-400 text-sm">
                          ⏳ Please wait while the trader confirms your payment. This usually takes a few minutes.
                        </p>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                        <p className="text-green-400 text-xs">
                          🚀 Demo Mode: Auto-completing trade in {autoProgressCountdown || 8} seconds...
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <h3 className="text-white font-medium mb-2">Confirm Payment Received</h3>
                      <p className="text-white/70 text-sm mb-6">
                        Did you receive ₦{parseFloat(nairaAmount).toLocaleString()} from the buyer?
                      </p>
                      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                        <p className="text-yellow-400 text-sm">
                          ⚠️ Only confirm if you have received the full payment amount. Once confirmed, the {amount} {currency} will be released to the buyer.
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <motion.button
                          onClick={handleConfirmPayment}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-[#ee5f0a] hover:bg-[#d54f08] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          Yes, Release Crypto
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 font-medium py-3 px-6 rounded-xl transition-all duration-300"
                        >
                          No, Dispute
                        </motion.button>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}

            {/* Trade Completed */}
            {currentStep === 4 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-white font-medium mb-2">Trade Completed Successfully!</h3>
                <p className="text-white/70 text-sm mb-6">
                  Your trade has been completed. You will be redirected to rate your trading partner.
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EscrowProgress
