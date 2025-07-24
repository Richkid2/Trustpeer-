import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, CheckCircle, RefreshCw, ArrowRight, Clock } from 'lucide-react'

interface LocationState {
  email?: string
  username?: string
  fromRegistration?: boolean
}

const EmailConfirmation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, username } = (location.state as LocationState) || {}
  
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleResendEmail = async () => {
    if (resendCooldown > 0) return

    setIsResending(true)
    
    try {
      
      console.log('Resending confirmation email to:', email)
      
      // Simulate resend process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setResendCooldown(60) // 60 second cooldown
    } catch (error) {
      console.error('Failed to resend email:', error)
      alert('Failed to resend email. Please try again.')
    } finally {
      setIsResending(false)
    }
  }

  const handleContinueToTelegram = () => {
    navigate('/telegram-setup', { 
      state: { 
        email,
        username,
        fromEmailConfirmation: true 
      } 
    })
  }

  const handleSkipForNow = () => {
    navigate('/dashboard', {
      state: {
        username,
        onboardingComplete: true,
        skippedTelegram: true
      }
    })
  }

  return (
    <div className="min-h-screen bg-[#080909] relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#ee5f0a]/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full bg-gradient-to-br from-black/40 to-gray-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] p-8 border border-gray-800/50"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] rounded-full flex items-center justify-center"
                >
                  <Mail size={32} className="text-white" />
                </motion.div>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center"
                >
                  <CheckCircle size={16} className="text-white" />
                </motion.div>
              </div>
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-kansas-bold bg-gradient-to-r from-white via-orange-100 to-[#ee5f0a] bg-clip-text text-transparent mb-2"
            >
              Account Created!
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 text-sm mb-6"
            >
              Welcome to TrustPeer! We've sent a confirmation email to verify your account.
            </motion.p>
          </motion.div>

          {/* Email Display */}
          {email && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 p-4 bg-gradient-to-r from-[#ee5f0a]/10 to-[#ff7722]/10 border border-[#ee5f0a]/20 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <Mail size={18} className="text-[#ee5f0a]" />
                <span className="text-white font-medium text-sm">Confirmation sent to:</span>
              </div>
              <div className="text-[#ee5f0a] font-mono text-sm break-all">
                {email}
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 space-y-4"
          >
            <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl">
              <div className="w-6 h-6 bg-[#ee5f0a]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#ee5f0a] text-xs font-bold">1</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Check your email</p>
                <p className="text-gray-400 text-xs">Look for our confirmation email in your inbox</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl">
              <div className="w-6 h-6 bg-[#ee5f0a]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#ee5f0a] text-xs font-bold">2</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Click the verification link</p>
                <p className="text-gray-400 text-xs">This will activate your TrustPeer account</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-black/30 rounded-xl">
              <div className="w-6 h-6 bg-[#ee5f0a]/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[#ee5f0a] text-xs font-bold">3</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Complete your profile</p>
                <p className="text-gray-400 text-xs">Add your Telegram handle for trader verification</p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-3"
          >
            {/* Continue to Telegram Setup */}
            <motion.button
              onClick={handleContinueToTelegram}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] hover:from-[#d54e09] hover:to-[#ee5f0a] text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              Continue Setup
              <ArrowRight size={20} />
            </motion.button>

            {/* Resend Email */}
            <motion.button
              onClick={handleResendEmail}
              disabled={isResending || resendCooldown > 0}
              whileHover={resendCooldown === 0 ? { scale: 1.02 } : {}}
              whileTap={resendCooldown === 0 ? { scale: 0.98 } : {}}
              className="w-full bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isResending ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  Sending...
                </>
              ) : resendCooldown > 0 ? (
                <>
                  <Clock size={18} />
                  Resend in {resendCooldown}s
                </>
              ) : (
                <>
                  <RefreshCw size={18} />
                  Resend Email
                </>
              )}
            </motion.button>

            {/* Skip for Now */}
            <motion.button
              onClick={handleSkipForNow}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-gray-400 hover:text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
            >
              Skip for Now
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default EmailConfirmation
