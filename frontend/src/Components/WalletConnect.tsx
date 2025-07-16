import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { multiWalletService, WalletType } from '../Services/wallet.service'
import type { MultiWalletState } from '../Services/wallet.service'

interface WalletConnectProps {
  onConnect?: (walletType: WalletType) => void
  onDisconnect?: () => void
  showDisconnect?: boolean
  className?: string
  variant?: 'default' | 'compact' | 'minimal'
}

const WalletConnect = ({ 
  onConnect, 
  onDisconnect, 
  showDisconnect = true, 
  className = '',
  variant = 'default'
}: WalletConnectProps) => {
  const [walletState, setWalletState] = useState<MultiWalletState>(multiWalletService.getState())
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    const handleStateChange = () => {
      setWalletState(multiWalletService.getState())
    }

    // Listen for wallet state changes
    const interval = setInterval(handleStateChange, 1000)
    return () => clearInterval(interval)
  }, [])

  const handleConnect = async (walletType: WalletType) => {
    setConnecting(walletType)
    try {
      await multiWalletService.connectWallet(walletType)
      const newState = multiWalletService.getState()
      setWalletState(newState)
      
      // Only trigger callback if wallet is actually connected
      if (newState.isConnected) {
        onConnect?.(walletType)
      }
    } catch (error) {
      console.error('Wallet connection failed:', error)
      alert(`Failed to connect ${walletType}: ${error}`)
    } finally {
      setConnecting(null)
    }
  }

  const handleDisconnect = async () => {
    try {
      await multiWalletService.disconnectAll()
      setWalletState(multiWalletService.getState())
      onDisconnect?.()
    } catch (error) {
      console.error('Wallet disconnection failed:', error)
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getWalletIcon = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.INTERNET_IDENTITY:
        return '∞'
      case WalletType.PLUG:
        return '🔌'
      case WalletType.METAMASK:
        return '🦊'
      case WalletType.TRUST_WALLET:
        return '💎'
      case WalletType.STOIC:
        return '🏛️'
      default:
        return '👛'
    }
  }

  const getWalletName = (walletType: WalletType) => {
    switch (walletType) {
      case WalletType.INTERNET_IDENTITY:
        return 'Internet Identity'
      case WalletType.PLUG:
        return 'Plug Wallet'
      case WalletType.METAMASK:
        return 'MetaMask'
      case WalletType.TRUST_WALLET:
        return 'Trust Wallet'
      case WalletType.STOIC:
        return 'Stoic Wallet'
      default:
        return 'Unknown Wallet'
    }
  }

  // If connected, show wallet info
  if (walletState.isConnected && variant !== 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl p-4 border border-slate-700/50 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">
                {getWalletIcon(walletState.primaryWallet?.type || WalletType.INTERNET_IDENTITY)}
              </span>
            </div>
            <div>
              <div className="text-white font-medium">
                {getWalletName(walletState.primaryWallet?.type || WalletType.INTERNET_IDENTITY)}
              </div>
              <div className="text-slate-400 text-sm font-mono">
                {formatAddress(walletState.primaryWallet?.address || '')}
              </div>
            </div>
          </div>
          
          {showDisconnect && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 text-sm font-medium rounded-lg transition-colors"
            >
              Disconnect
            </motion.button>
          )}
        </div>
      </motion.div>
    )
  }

  // If connected but minimal variant, show simple indicator
  if (walletState.isConnected && variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`inline-flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1 text-green-400 text-sm font-medium ${className}`}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        Connected
      </motion.div>
    )
  }

  // Show wallet connection options
  const walletOptions = [
    WalletType.INTERNET_IDENTITY,
    WalletType.PLUG,
    WalletType.METAMASK,
    WalletType.TRUST_WALLET
  ]

  if (variant === 'compact') {
    return (
      <div className={`space-y-2 ${className}`}>
        {walletOptions.map((wallet) => (
          <motion.button
            key={wallet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnect(wallet)}
            disabled={connecting === wallet}
            className="w-full flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-2xl">{getWalletIcon(wallet)}</span>
            <span className="flex-1 text-left text-white font-medium">
              {getWalletName(wallet)}
            </span>
            {connecting === wallet && (
              <svg className="w-5 h-5 text-blue-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
          </motion.button>
        ))}
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-white mb-4">Connect Your Wallet</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {walletOptions.map((wallet) => (
          <motion.button
            key={wallet}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleConnect(wallet)}
            disabled={connecting === wallet}
            className="p-6 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-2xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="text-center">
              <div className="text-4xl mb-3">{getWalletIcon(wallet)}</div>
              <div className="text-white font-medium mb-2">{getWalletName(wallet)}</div>
              {connecting === wallet ? (
                <div className="flex items-center justify-center gap-2 text-blue-400">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm">Connecting...</span>
                </div>
              ) : (
                <div className="text-slate-400 text-sm">Click to connect</div>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default WalletConnect
