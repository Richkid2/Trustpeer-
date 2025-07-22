import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MessageCircle, CheckCircle, ArrowRight, User, ExternalLink, Shield } from 'lucide-react'

interface LocationState {
  email?: string
  username?: string
  fromEmailConfirmation?: boolean
}

const TelegramSetup = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { email, username } = (location.state as LocationState) || {}
  
  const [telegramHandle, setTelegramHandle] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!telegramHandle.trim()) return

    setIsLoading(true)

    try {
      // TODO: Replace with actual API call when backend is ready
      console.log('Saving Telegram handle:', telegramHandle, 'for user:', username, 'email:', email)
      
      // Simulate save process
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      navigate('/dashboard', {
        state: {
          username,
          onboardingComplete: true,
          telegramAdded: true,
          telegramHandle
        }
      })
    } catch (error) {
      console.error('Failed to save Telegram handle:', error)
      alert('Failed to save Telegram handle. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkip = () => {
    navigate('/dashboard', {
      state: {
        username,
        onboardingComplete: true,
        telegramSkipped: true
      }
    })
  }

  const formatTelegramHandle = (value: string) => {
    // Remove any existing @ and add it back
    let formatted = value.replace(/^@/, '')
    return formatted
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTelegramHandle(formatTelegramHandle(value))
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
                  <MessageCircle size={32} className="text-white" />
                </motion.div>
              </div>
            </div>

            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-kansas-bold bg-gradient-to-r from-white via-orange-100 to-[#ee5f0a] bg-clip-text text-transparent mb-2"
            >
              Connect Telegram
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-gray-400 text-sm mb-6"
            >
              Add your Telegram handle so other traders can find and verify you
            </motion.p>
          </motion.div>

          {/* Why Telegram Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6 p-4 bg-gradient-to-r from-[#ee5f0a]/10 to-[#ff7722]/10 border border-[#ee5f0a]/20 rounded-2xl"
          >
            <div className="flex items-center gap-3 mb-3">
              <Shield size={18} className="text-[#ee5f0a]" />
              <span className="text-white font-medium text-sm">Why Telegram?</span>
            </div>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>Other traders can verify your identity</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>Direct communication for trade coordination</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle size={14} className="text-green-400 mt-0.5 flex-shrink-0" />
                <span>Build trust within the community</span>
              </li>
            </ul>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-6"
          >
            {/* Telegram Handle Input */}
            <div className="space-y-2">
              <label className="text-white text-sm font-medium">Telegram Handle</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <span className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">@</span>
                <input
                  type="text"
                  value={telegramHandle}
                  onChange={handleInputChange}
                  placeholder="your_telegram_handle"
                  className="w-full pl-16 pr-4 py-4 bg-black/60 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-transparent transition-all duration-300"
                />
              </div>
              <p className="text-xs text-gray-500">
                Your Telegram username (without the @)
              </p>
            </div>

            {/* Preview */}
            {telegramHandle && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="p-3 bg-black/30 rounded-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle size={16} className="text-[#ee5f0a]" />
                    <span className="text-white text-sm">@{telegramHandle}</span>
                  </div>
                  <a
                    href={`https://t.me/${telegramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-[#ee5f0a] hover:text-[#ff7722] text-xs transition-colors"
                  >
                    <ExternalLink size={12} />
                    Test
                  </a>
                </div>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading || !telegramHandle.trim()}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] hover:from-[#d54e09] hover:to-[#ee5f0a] text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Connect Telegram
                  <ArrowRight size={20} />
                </>
              )}
            </motion.button>

            {/* Skip Button */}
            <motion.button
              type="button"
              onClick={handleSkip}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full text-gray-400 hover:text-white font-medium py-3 px-6 rounded-2xl transition-all duration-300 border border-gray-700/50 hover:border-gray-600"
            >
              Skip for Now
            </motion.button>
          </motion.form>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="text-center mt-6 pt-6 border-t border-gray-700/50"
          >
            <p className="text-gray-500 text-xs">
              You can always add or change your Telegram handle later in settings
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default TelegramSetup
