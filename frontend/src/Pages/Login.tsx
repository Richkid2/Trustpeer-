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
      
      // If it's Internet Identity, also update auth state
      if (walletType === WalletType.INTERNET_IDENTITY) {
        const state = await authService.getAuthState()
        setAuthState(state)
      }
      
      // Navigate to home on successful connection
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to TrustPeer</h2>
          <p className="text-gray-600 text-sm">Secure P2P trading on the Internet Computer</p>
        </div>

        {/* Show connected status if wallet is connected */}
        {walletState.isConnected && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">
                Wallet Connected{authState.isAuthenticated ? ' & Authenticated' : ''}!
              </span>
            </div>
            <p className="text-green-600 text-sm mt-1">
              {walletState.primaryWallet?.type} - {walletState.primaryWallet?.address?.slice(0, 6)}...{walletState.primaryWallet?.address?.slice(-4)}
            </p>
            <div className="flex gap-3 mt-3">
              <Link 
                to="/"
                className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Continue to TrustPeer
              </Link>
              <button
                onClick={handleWalletDisconnect}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                Disconnect
              </button>
            </div>
          </div>
        )}

        {/* Show wallet connection form if not connected */}
        {!walletState.isConnected && (
          <div className="mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center mb-2">
                <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-blue-800">Connect Your Wallet</span>
              </div>
              <p className="text-xs text-blue-700">
                Choose your preferred wallet to access TrustPeer and start trading securely.
              </p>
            </div>

            <div className="space-y-3">
              {/* Internet Identity */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleWalletConnect(WalletType.INTERNET_IDENTITY)}
                disabled={loadingWallet === WalletType.INTERNET_IDENTITY}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg flex items-center justify-center"
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
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center border border-gray-300"
              >
                {loadingWallet === WalletType.PLUG ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 mr-2 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">P</span>
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center border border-gray-300"
              >
                {loadingWallet === WalletType.METAMASK ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 mr-2 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
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
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition duration-200 flex items-center justify-center border border-gray-300"
              >
                {loadingWallet === WalletType.TRUST_WALLET ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Connecting...
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 mr-2 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">T</span>
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
            className="text-blue-600 hover:text-blue-700 text-sm font-medium transition duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Login
