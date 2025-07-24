import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Mail, Lock, Eye, EyeOff, Wallet, ArrowRight, Shield, CheckCircle } from 'lucide-react'

interface LocationState {
  walletAddress?: string
  walletType?: string
}

interface RegisterForm {
  username: string
  email: string
  password: string
  confirmPassword: string
}

const Register = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { walletAddress, walletType } = (location.state as LocationState) || {}

  const [formData, setFormData] = useState<RegisterForm>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [registrationType, setRegistrationType] = useState<'email' | 'wallet'>(
    walletAddress ? 'wallet' : 'email'
  )

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEmailRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match')
        return
      }

  
      console.log('Email registration:', formData)
      
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      navigate('/email-confirmation', {
        state: {
          email: formData.email,
          username: formData.username,
          fromRegistration: true
        }
      })
    } catch (error) {
      console.error('Registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWalletRegistration = async () => {
    if (!walletAddress) {
      alert('No wallet address provided')
      return
    }

    setIsLoading(true)

    try {
      // Validate username
      console.log('Wallet registration:', {
        username: formData.username,
        walletAddress,
        walletType
      })
      
      // Simulate registration process
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      alert('Registration successful!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Wallet registration failed:', error)
      alert('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConnectWallet = async (type: 'metamask' | 'trustwallet') => {
    try {
    
      console.log('Connecting wallet:', type)
      alert('Wallet connection will be implemented with backend integration')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert('Failed to connect wallet')
    }
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
            <div className="flex items-center justify-center mb-4">
              <div className="relative group">
                <motion.img
                  src="/trustpeer-logo.png"
                  alt="TrustPeer"
                  className="h-12 w-auto relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ee5f0a]/30 to-[#ff7722]/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
              </div>
            </div>
            <h1 className="text-3xl font-kansas-bold bg-gradient-to-r from-white via-orange-100 to-[#ee5f0a] bg-clip-text text-transparent mb-2">
              Join TrustPeer
            </h1>
            <p className="text-gray-400 text-sm">
              Create your account to start secure crypto trading
            </p>
          </motion.div>

          {/* Registration Type Toggle */}
          {!walletAddress && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex rounded-2xl bg-black/60 p-1 mb-6"
            >
              <button
                onClick={() => setRegistrationType('email')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  registrationType === 'email'
                    ? 'bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Email & Password
              </button>
              <button
                onClick={() => setRegistrationType('wallet')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-300 ${
                  registrationType === 'wallet'
                    ? 'bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] text-white shadow-lg'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Connect Wallet
              </button>
            </motion.div>
          )}

          {/* Wallet Address Display */}
          {walletAddress && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6 p-4 bg-gradient-to-r from-[#ee5f0a]/20 to-[#ff7722]/20 border border-[#ee5f0a]/30 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} className="text-[#ee5f0a]" />
                <span className="text-[#ee5f0a] font-medium">Wallet Connected</span>
              </div>
              <div className="text-sm text-gray-300">
                <div className="font-medium mb-1">{walletType?.toUpperCase()}</div>
                <div className="font-mono text-xs bg-black/50 p-2 rounded-lg break-all">
                  {walletAddress}
                </div>
              </div>
            </motion.div>
          )}

          {/* Email Registration Form */}
          {registrationType === 'email' && (
            <motion.form
              onSubmit={handleEmailRegistration}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {/* Username */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-black/60 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-black/60 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-transparent transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors z-10"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] hover:from-[#d54e09] hover:to-[#ee5f0a] text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={20} />
                  </>
                )}
              </motion.button>
            </motion.form>
          )}

          {/* Wallet Registration */}
          {registrationType === 'wallet' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-4"
            >
              {/* Username for wallet registration */}
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Choose a username"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/60 border border-gray-600/50 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee5f0a] focus:border-transparent transition-all duration-300"
                />
              </div>

              {walletAddress ? (
                /* Complete Registration Button */
                <motion.button
                  onClick={handleWalletRegistration}
                  disabled={isLoading || !formData.username}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] hover:from-[#d54e09] hover:to-[#ee5f0a] text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Shield size={20} />
                      Complete Registration
                    </>
                  )}
                </motion.button>
              ) : (
                /* Wallet Connection Buttons */
                <div className="space-y-3">
                  <motion.button
                    onClick={() => handleConnectWallet('metamask')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-[#ee5f0a] to-[#ff7722] hover:from-[#d54e09] hover:to-[#ee5f0a] text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Wallet size={20} />
                    Connect MetaMask
                  </motion.button>

                  <motion.button
                    onClick={() => handleConnectWallet('trustwallet')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                  >
                    <Wallet size={20} />
                    Connect Trust Wallet
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center mt-8 pt-6 border-t border-gray-700/50"
          >
            <p className="text-gray-400 text-sm">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-[#ee5f0a] hover:text-[#ff7722] font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Register
