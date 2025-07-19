import { useState } from 'react'
import { multiWalletService, WalletType } from '../Services/wallet.service'
import type { MultiWalletState } from '../Services/wallet.service'

const WalletTest = () => {
  const [walletState, setWalletState] = useState<MultiWalletState>(multiWalletService.getState())
  const [loading, setLoading] = useState<string | null>(null)

  const testWallet = async (type: keyof typeof WalletType) => {
    setLoading(type)
    try {
      await multiWalletService.connectWallet(WalletType[type])
      setWalletState(multiWalletService.getState())
      console.log('Wallet connected successfully!')
    } catch (error) {
      console.error('Connection failed:', error)
      alert(`Connection failed: ${error}`)
    } finally {
      setLoading(null)
    }
  }

  const disconnectAll = async () => {
    try {
      await multiWalletService.disconnectAll()
      setWalletState(multiWalletService.getState())
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white text-center">Wallet Connection Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Connection Buttons */}
          <div className="bg-gray-900/90 rounded-2xl p-6 shadow-2xl border border-[#f5762c]/20">
            <h2 className="text-xl font-semibold mb-4 text-white">Connect Wallets</h2>
            <div className="space-y-3">
              <button
                onClick={() => testWallet('INTERNET_IDENTITY')}
                disabled={loading === 'INTERNET_IDENTITY'}
                className="w-full bg-gradient-to-r from-[#f5762c] to-[#e53825] hover:from-[#e53825] hover:to-[#f5762c] disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-300"
              >
                {loading === 'INTERNET_IDENTITY' ? 'Connecting...' : 'Internet Identity'}
              </button>
              
              <button
                onClick={() => testWallet('PLUG')}
                disabled={loading === 'PLUG'}
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl border border-gray-700 hover:border-[#f5762c]/50 transition duration-300"
              >
                {loading === 'PLUG' ? 'Connecting...' : 'Plug Wallet'}
              </button>
              
              <button
                onClick={() => testWallet('METAMASK')}
                disabled={loading === 'METAMASK'}
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl border border-gray-700 hover:border-[#f5762c]/50 transition duration-300"
              >
                {loading === 'METAMASK' ? 'Connecting...' : 'MetaMask'}
              </button>
              
              <button
                onClick={() => testWallet('TRUST_WALLET')}
                disabled={loading === 'TRUST_WALLET'}
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:bg-gray-600 text-white font-semibold py-3 px-4 rounded-xl border border-gray-700 hover:border-[#f5762c]/50 transition duration-300"
              >
                {loading === 'TRUST_WALLET' ? 'Connecting...' : 'Trust Wallet'}
              </button>
              
              <button
                onClick={disconnectAll}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-300"
              >
                Disconnect All
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-gray-900/90 rounded-2xl p-6 shadow-2xl border border-[#f5762c]/20">
            <h2 className="text-xl font-semibold mb-4 text-white">Connection Status</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-3 ${walletState.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className="text-white">{walletState.isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              <div className="text-white">
                <strong className="text-[#f5762c]">Primary Wallet:</strong> {walletState.primaryWallet?.type || 'None'}
              </div>
              
              <div className="text-white">
                <strong className="text-[#f5762c]">Connected Wallets:</strong> {walletState.connectedWallets.length}
              </div>
            </div>
          </div>
        </div>

        {/* Connected Wallets List */}
        {walletState.connectedWallets.length > 0 && (
          <div className="mt-8 bg-gray-900/90 rounded-2xl p-6 shadow-2xl border border-[#f5762c]/20">
            <h2 className="text-xl font-semibold mb-4 text-white">Connected Wallets</h2>
            <div className="space-y-4">
              {walletState.connectedWallets.map((wallet, index) => (
                <div key={index} className="border border-gray-700 rounded-xl p-4 bg-gray-800">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-white">{wallet.type}</h3>
                      <p className="text-sm text-gray-400">{wallet.network}</p>
                    </div>
                    {wallet.type === walletState.primaryWallet?.type && (
                      <span className="bg-gradient-to-r from-[#f5762c] to-[#e53825] text-white text-xs px-3 py-1 rounded-full font-semibold">Primary</span>
                    )}
                  </div>
                  <div className="bg-gray-700 rounded-lg p-3">
                    <p className="text-xs font-mono break-all text-gray-300">{wallet.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-[#f5762c]/10 to-[#e53825]/10 border border-[#f5762c]/30 rounded-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">Testing Instructions</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>• <strong className="text-[#f5762c]">Internet Identity:</strong> Should work immediately</li>
            <li>• <strong className="text-[#f5762c]">Plug Wallet:</strong> Install from <a href="https://plugwallet.ooo/" className="text-[#f5762c] hover:text-[#e53825]">plugwallet.ooo</a></li>
            <li>• <strong className="text-[#f5762c]">MetaMask:</strong> Install from <a href="https://metamask.io/" className="text-[#f5762c] hover:text-[#e53825]">metamask.io</a></li>
            <li>• <strong className="text-[#f5762c]">Trust Wallet:</strong> Install Trust Wallet browser extension</li>
            <li>• Open browser console to see detailed connection logs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WalletTest
