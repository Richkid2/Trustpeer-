import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Wallet, ArrowLeft } from 'lucide-react'
import { authService } from '../Services/auth.service'
import { multiWalletService, WalletType } from '../Services/wallet.service'
import type { AuthState } from '../Services/auth.service'
import type { MultiWalletState } from '../Services/wallet.service'

const Login = () => {
  const [loadingWallet, setLoadingWallet] = useState<WalletType | null>(null)
  const [loginMethod, setLoginMethod] = useState<'credentials' | 'wallet'>('credentials')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    emailOrUsername: '',
    password: ''
  })
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    principal: null,
    identity: null
  })
  const [walletState, setWalletState] = useState<MultiWalletState>(multiWalletService.getState())
  const navigate = useNavigate()

  // Remove unused variables and functions to clean up
  console.log('Auth state:', authState)
  console.log('Wallet state:', walletState)

  useEffect(() => {
    checkAuthentication()
  }, [])

  const checkAuthentication = async () => {
    try {
      const state = await authService.getAuthState()
      setAuthState(state)
      setWalletState(multiWalletService.getState())
      console.log('Authentication state:', state)
    } catch (error) {
      console.error('Authentication check failed:', error)
    }
  }

  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Mock successful login
      setAuthState({
        isAuthenticated: true,
        principal: null, 
        identity: null
      })
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Login failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleWalletConnect = async (walletType: WalletType) => {
    setLoadingWallet(walletType)
    
    try {
      await multiWalletService.connectWallet(walletType)
      setWalletState(multiWalletService.getState())
      
      const state = await authService.getAuthState()
      setAuthState(state)
      
      navigate('/dashboard')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert(`Failed to connect ${walletType}: ${error}`)
    } finally {
      setLoadingWallet(null)
    }
  }


  return (
    <div className="min-h-screen bg-[#080909] relative overflow-hidden">
      {/* Animated background elements with brand colors */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-md w-full bg-[#0f1011]/80 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-gray-800/50"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="w-20 h-20 bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(238,95,10,0.3)]"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              <motion.img 
                src="/trustpeer-logo.png" 
                alt="TrustPeer" 
                className="w-12 h-12 object-contain"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#ee5f0a] bg-clip-text text-transparent mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Welcome Back
            </motion.h1>
            <motion.p 
              className="text-gray-400 text-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              Sign in to continue trading securely
            </motion.p>
          </motion.div>

          {/* Login Method Toggle */}
          <motion.div 
            className="flex bg-gray-800/50 rounded-2xl p-1 mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              onClick={() => setLoginMethod('credentials')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                loginMethod === 'credentials'
                  ? 'bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Mail size={16} />
                <span className="text-sm">Email / Username</span>
              </div>
            </button>
            <button
              onClick={() => setLoginMethod('wallet')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                loginMethod === 'wallet'
                  ? 'bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] text-white shadow-lg'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Wallet size={16} />
                <span className="text-sm">Wallet</span>
              </div>
            </button>
          </motion.div>

          {/* Credentials Login Form */}
          {loginMethod === 'credentials' && (
            <motion.form
              onSubmit={handleCredentialLogin}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-6"
            >
              {/* Email/Username Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Email or Username
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    name="emailOrUsername"
                    value={formData.emailOrUsername}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-400 focus:border-[#ee5f0a] focus:ring-1 focus:ring-[#ee5f0a] transition-all duration-300"
                    placeholder="Enter your email or username"
                    required
                  />
                </div>
              </motion.div>

              {/* Password Input */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700/50 rounded-xl py-4 pl-12 pr-12 text-white placeholder-gray-400 focus:border-[#ee5f0a] focus:ring-1 focus:ring-[#ee5f0a] transition-all duration-300"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-right"
              >
                <Link
                  to="/forgot-password"
                  className="text-[#ee5f0a] hover:text-[#d54f08] text-sm font-medium transition-colors"
                >
                  Forgot Password?
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 10px 25px -8px rgba(238, 95, 10, 0.4)",
                }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="w-full bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] hover:from-[#d54f08] hover:to-[#ee5f0a] text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg border border-[#ee5f0a]/20 relative overflow-hidden group"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Signing in...
                  </div>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                    <span className="relative z-10">Sign In</span>
                  </>
                )}
              </motion.button>
            </motion.form>
          )}

          {/* Wallet Connection Options */}
          {loginMethod === 'wallet' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              <motion.div 
                className="bg-gradient-to-r from-[#ee5f0a]/10 to-[#d54f08]/10 border border-[#ee5f0a]/30 rounded-2xl p-4 mb-6 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center mb-2">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 mr-3"
                  >
                    <Wallet className="w-5 h-5 text-[#ee5f0a]" />
                  </motion.div>
                  <span className="text-lg font-bold text-white">Connect Your Wallet</span>
                </div>
                <p className="text-gray-400 text-sm">
                  Choose your preferred wallet to access TrustPeer securely.
                </p>
              </motion.div>

              {/* Plug Wallet */}
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 8px 20px -8px rgba(238, 95, 10, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.PLUG)}
                disabled={loadingWallet === WalletType.PLUG}
                className="w-full bg-gray-800/50 hover:bg-[#ee5f0a]/10 border border-gray-700/50 hover:border-[#ee5f0a]/30 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 }}
              >
                {loadingWallet === WalletType.PLUG ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Connecting...
                  </>
                ) : (
                  <>
                    <motion.div 
                      className="w-6 h-6 mr-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <span className="text-white text-xs font-bold">P</span>
                    </motion.div>
                    Plug Wallet
                  </>
                )}
              </motion.button>

              {/* MetaMask */}
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 8px 20px -8px rgba(249, 115, 22, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.METAMASK)}
                disabled={loadingWallet === WalletType.METAMASK}
                className="w-full bg-gray-800/50 hover:bg-orange-600/10 border border-gray-700/50 hover:border-orange-500/30 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
              >
                {loadingWallet === WalletType.METAMASK ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Connecting...
                  </>
                ) : (
                  <>
                    <motion.div 
                      className="w-6 h-6 mr-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    >
                      <span className="text-white text-xs font-bold">M</span>
                    </motion.div>
                    MetaMask
                  </>
                )}
              </motion.button>

              {/* Trust Wallet */}
              <motion.button
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 8px 20px -8px rgba(59, 130, 246, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.TRUST_WALLET)}
                disabled={loadingWallet === WalletType.TRUST_WALLET}
                className="w-full bg-gray-800/50 hover:bg-blue-600/10 border border-gray-700/50 hover:border-blue-500/30 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 }}
              >
                {loadingWallet === WalletType.TRUST_WALLET ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-3"
                    />
                    Connecting...
                  </>
                ) : (
                  <>
                    <motion.div 
                      className="w-6 h-6 mr-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                    >
                      <span className="text-white text-xs font-bold">T</span>
                    </motion.div>
                    Trust Wallet
                  </>
                )}
              </motion.button>
            </motion.div>
          )}

          {/* Register Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8 pt-6 border-t border-gray-800/50"
          >
            <p className="text-gray-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-[#ee5f0a] hover:text-[#d54f08] font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </motion.div>

          {/* Back to Home */}
          <motion.div 
            className="text-center mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
          >
            <Link to="/">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center text-gray-400 hover:text-[#ee5f0a] font-medium transition-all duration-300 mx-auto"
              >
                <motion.div
                  className="mr-2"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowLeft size={16} />
                </motion.div>
                Back to Home
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
