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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-gray-900/90 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-[#f5762c]/20"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <img 
              src="/trustpeer-logo.png" 
              alt="TrustPeer" 
              className="w-12 h-12 object-contain"
            />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome to TrustPeer</h2>
          <p className="text-gray-400 text-sm">Secure P2P trading on the Internet Computer</p>
        </div>

        {/* Show connected status if wallet is connected */}
        {walletState.isConnected && (
          <div className="bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-xl p-6 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-300 font-semibold">
                Wallet Connected{authState.isAuthenticated ? ' & Authenticated' : ''}!
              </span>
            </div>
            <p className="text-green-400 text-sm mt-2">
              {walletState.primaryWallet?.type} - {walletState.primaryWallet?.address?.slice(0, 6)}...{walletState.primaryWallet?.address?.slice(-4)}
            </p>
            <div className="flex gap-3 mt-4">
              <Link 
                to="/"
                className="bg-gradient-to-r from-[#f5762c] to-[#e53825] hover:from-[#e53825] hover:to-[#f5762c] text-white font-semibold py-3 px-6 rounded-xl transition duration-300 shadow-lg"
              >
                Continue to TrustPeer
              </Link>
              <button
                onClick={handleWalletDisconnect}
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-xl transition duration-300"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Show wallet connection form if not connected */}
        {!walletState.isConnected && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-[#f5762c]/10 to-[#e53825]/10 border border-[#f5762c]/30 rounded-xl p-6 mb-6">
              <div className="flex items-center mb-3">
                <svg className="w-5 h-5 text-[#f5762c] mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-semibold text-white">Connect Your Wallet</span>
              </div>
              <p className="text-sm text-gray-400">
                Choose your preferred wallet to access TrustPeer and start trading securely.
              </p>
            </div>

            <div className="space-y-4">
              {/* Internet Identity */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.INTERNET_IDENTITY)}
                disabled={loadingWallet === WalletType.INTERNET_IDENTITY}
                className="w-full bg-gradient-to-r from-[#f5762c] to-[#e53825] hover:from-[#e53825] hover:to-[#f5762c] disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl transition duration-300 shadow-lg flex items-center justify-center"
              >
                {loadingWallet === WalletType.INTERNET_IDENTITY ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Internet Identity
                  </>
                )}
              </motion.button>

              {/* Plug Wallet */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.PLUG)}
                disabled={loadingWallet === WalletType.PLUG}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 flex items-center justify-center border border-gray-700 hover:border-[#f5762c]/50"
              >
                {loadingWallet === WalletType.PLUG ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 mr-3 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">P</span>
                    </div>
                    Plug Wallet
                  </>
                )}
              </motion.button>

              {/* MetaMask */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.METAMASK)}
                disabled={loadingWallet === WalletType.METAMASK}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 flex items-center justify-center border border-gray-700 hover:border-[#f5762c]/50"
              >
                {loadingWallet === WalletType.METAMASK ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 mr-3 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">M</span>
                    </div>
                    MetaMask
                  </>
                )}
              </motion.button>

              {/* Trust Wallet */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.TRUST_WALLET)}
                disabled={loadingWallet === WalletType.TRUST_WALLET}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-4 px-6 rounded-xl transition duration-300 flex items-center justify-center border border-gray-700 hover:border-[#f5762c]/50"
              >
                {loadingWallet === WalletType.TRUST_WALLET ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <div className="w-6 h-6 mr-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">T</span>
                    </div>
                    Trust Wallet
                  </>
                )}
              </motion.button>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link 
            to="/" 
            className="text-[#f5762c] hover:text-[#e53825] text-sm font-semibold transition duration-300 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
