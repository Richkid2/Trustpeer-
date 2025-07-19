import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { authService } from '../Services/auth.service'
import { multiWalletService, WalletType } from '../Services/wallet.service'
import type { AuthState } from '../Services/auth.service'
import type { MultiWalletState } from '../Services/wallet.service'

const Login = () => {
  const [loadingWallet, setLoadingWallet] = useState<WalletType | null>(null)
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    principal: null,
    identity: null
  })
  const [walletState, setWalletState] = useState<MultiWalletState>(multiWalletService.getState())
  const navigate = useNavigate()

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

  const handleWalletConnect = async (walletType: WalletType) => {
    setLoadingWallet(walletType)
    
    try {
      await multiWalletService.connectWallet(walletType)
      setWalletState(multiWalletService.getState())
      
      if (walletType === WalletType.INTERNET_IDENTITY) {
        const state = await authService.getAuthState()
        setAuthState(state)
      }
      
      navigate('/')
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert(`Failed to connect ${walletType}: ${error}`)
    } finally {
      setLoadingWallet(null)
    }
  }

  const handleWalletDisconnect = async () => {
    try {
      await multiWalletService.disconnectAll()
      setWalletState(multiWalletService.getState())
      setAuthState({
        isAuthenticated: false,
        principal: null,
        identity: null
      })
      alert('Wallet disconnected successfully!')
    } catch (error) {
      console.error('Wallet disconnection failed:', error)
      alert('Failed to disconnect wallet')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
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
          className="max-w-md w-full bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50"
        >
          {/* Header */}
          <motion.div 
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <motion.div 
              className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(6,182,212,0.4)]"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            >
              <motion.img 
                src="/trustpeer-logo.png" 
                alt="TrustPeer" 
                className="w-14 h-14 object-contain"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </motion.div>
            <motion.h1 
              className="text-4xl font-kansas-black bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              Welcome to TrustPeer
            </motion.h1>
          </motion.div>

          {/* Connected Status */}
          {walletState.isConnected && (
            <motion.div 
              className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-3xl p-6 mb-8 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center mr-3"
                >
                  <svg className="w-4 h-4 text-green-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <span className="text-green-300 font-kansas-bold text-lg">
                  Wallet Connected{authState.isAuthenticated ? ' & Authenticated' : ''}!
                </span>
              </div>
              <motion.div 
                className="bg-green-500/10 rounded-2xl p-4 mb-6 border border-green-500/20"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-kansas-medium text-sm">Wallet Type</span>
                  <span className="text-green-200 font-kansas-bold">{walletState.primaryWallet?.type}</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-green-400 font-kansas-medium text-sm">Address</span>
                  <span className="text-green-200 font-kansas-bold font-mono text-xs">
                    {walletState.primaryWallet?.address?.slice(0, 8)}...{walletState.primaryWallet?.address?.slice(-6)}
                  </span>
                </div>
              </motion.div>
              <div className="flex gap-3">
                <Link to="/" className="flex-1">
                  <motion.button
                    whileHover={{ 
                      scale: 1.02, 
                      boxShadow: "0 20px 40px -12px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.3)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-kansas-bold py-4 px-6 rounded-2xl transition-all duration-300 border border-cyan-400/20 overflow-hidden"
                  >
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        🚀
                      </motion.span>
                      Continue to TrustPeer
                    </span>
                  </motion.button>
                </Link>
                <motion.button
                  onClick={handleWalletDisconnect}
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 15px 30px -12px rgba(148, 163, 184, 0.3)",
                    y: -1
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl hover:from-slate-600/70 hover:to-slate-700/90 text-slate-200 font-kansas-medium py-4 px-6 rounded-2xl transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70"
                >
                  Disconnect
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Wallet Connection Form */}
          {!walletState.isConnected && (
            <motion.div 
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/30 rounded-3xl p-6 mb-8 backdrop-blur-sm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <div className="flex items-center mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="w-6 h-6 mr-3"
                  >
                    <svg className="w-6 h-6 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <span className="text-lg font-kansas-bold text-white">Connect Your Wallet</span>
                </div>
                <p className="text-slate-300 font-kansas-light">
                  Choose your preferred wallet to access TrustPeer and start <span className="text-cyan-400 font-kansas-medium">secure trading</span>.
                </p>
              </motion.div>

              <div className="space-y-4">
                {/* Internet Identity */}
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)",
                    y: -2
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWalletConnect(WalletType.INTERNET_IDENTITY)}
                  disabled={loadingWallet === WalletType.INTERNET_IDENTITY}
                  className="group relative w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-kansas-bold py-5 px-6 rounded-3xl transition-all duration-300 border border-blue-400/20 overflow-hidden"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  {!loadingWallet && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                  )}
                  <div className="relative z-10 flex items-center justify-center">
                    {loadingWallet === WalletType.INTERNET_IDENTITY ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full mr-3"
                        />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="mr-3"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                        </motion.div>
                        Internet Identity
                      </>
                    )}
                  </div>
                </motion.button>

                {/* Plug Wallet */}
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 15px 30px -12px rgba(234, 179, 8, 0.3)",
                    y: -1
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWalletConnect(WalletType.PLUG)}
                  disabled={loadingWallet === WalletType.PLUG}
                  className="w-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl hover:from-yellow-600/20 hover:to-yellow-700/30 text-slate-200 hover:text-white font-kansas-bold py-5 px-6 rounded-3xl transition-all duration-300 border border-slate-600/50 hover:border-yellow-500/50 flex items-center justify-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  {loadingWallet === WalletType.PLUG ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-slate-200 border-t-transparent rounded-full mr-3"
                      />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <motion.div 
                        className="w-7 h-7 mr-3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      >
                        <span className="text-white text-sm font-kansas-black">P</span>
                      </motion.div>
                      Plug Wallet
                    </>
                  )}
                </motion.button>

                {/* MetaMask */}
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 15px 30px -12px rgba(249, 115, 22, 0.3)",
                    y: -1
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWalletConnect(WalletType.METAMASK)}
                  disabled={loadingWallet === WalletType.METAMASK}
                  className="w-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl hover:from-orange-600/20 hover:to-orange-700/30 text-slate-200 hover:text-white font-kansas-bold py-5 px-6 rounded-3xl transition-all duration-300 border border-slate-600/50 hover:border-orange-500/50 flex items-center justify-center"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.3 }}
                >
                  {loadingWallet === WalletType.METAMASK ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-slate-200 border-t-transparent rounded-full mr-3"
                      />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <motion.div 
                        className="w-7 h-7 mr-3 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        <span className="text-white text-sm font-kansas-black">M</span>
                      </motion.div>
                      MetaMask
                    </>
                  )}
                </motion.button>

                {/* Trust Wallet */}
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 15px 30px -12px rgba(59, 130, 246, 0.3)",
                    y: -1
                  }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleWalletConnect(WalletType.TRUST_WALLET)}
                  disabled={loadingWallet === WalletType.TRUST_WALLET}
                  className="w-full bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl hover:from-blue-600/20 hover:to-blue-700/30 text-slate-200 hover:text-white font-kansas-bold py-5 px-6 rounded-3xl transition-all duration-300 border border-slate-600/50 hover:border-blue-500/50 flex items-center justify-center"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  {loadingWallet === WalletType.TRUST_WALLET ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-6 h-6 border-2 border-slate-200 border-t-transparent rounded-full mr-3"
                      />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <motion.div 
                        className="w-7 h-7 mr-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg"
                        animate={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <span className="text-white text-sm font-kansas-black">T</span>
                      </motion.div>
                      Trust Wallet
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Back to Home */}
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7 }}
          >
            <Link to="/">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center justify-center text-cyan-400 hover:text-cyan-300 font-kansas-medium transition-all duration-300 mx-auto"
              >
                <motion.svg 
                  className="w-5 h-5 mr-2 group-hover:text-cyan-300 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </motion.svg>
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
