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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Wallet Connection Test</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wallet Connection Buttons */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Connect Wallets</h2>
            <div className="space-y-3">
              <button
                onClick={() => testWallet('INTERNET_IDENTITY')}
                disabled={loading === 'INTERNET_IDENTITY'}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 px-4 rounded"
              >
                {loading === 'INTERNET_IDENTITY' ? 'Connecting...' : 'Internet Identity'}
              </button>
              
              <button
                onClick={() => testWallet('PLUG')}
                disabled={loading === 'PLUG'}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 text-white py-2 px-4 rounded"
              >
                {loading === 'PLUG' ? 'Connecting...' : 'Plug Wallet'}
              </button>
              
              <button
                onClick={() => testWallet('METAMASK')}
                disabled={loading === 'METAMASK'}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white py-2 px-4 rounded"
              >
                {loading === 'METAMASK' ? 'Connecting...' : 'MetaMask'}
              </button>
              
              <button
                onClick={() => testWallet('TRUST_WALLET')}
                disabled={loading === 'TRUST_WALLET'}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 px-4 rounded"
              >
                {loading === 'TRUST_WALLET' ? 'Connecting...' : 'Trust Wallet'}
              </button>
              
              <button
                onClick={disconnectAll}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
              >
                Disconnect All
              </button>
            </div>
          </div>

          {/* Connection Status */}
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className={`w-3 h-3 rounded-full mr-3 ${walletState.isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span>{walletState.isConnected ? 'Connected' : 'Disconnected'}</span>
              </div>
              
              <div>
                <strong>Primary Wallet:</strong> {walletState.primaryWallet?.type || 'None'}
              </div>
              
              <div>
                <strong>Connected Wallets:</strong> {walletState.connectedWallets.length}
              </div>
            </div>
          </div>
        </div>

        {/* Connected Wallets List */}
        {walletState.connectedWallets.length > 0 && (
          <div className="mt-8 bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Connected Wallets</h2>
            <div className="space-y-4">
              {walletState.connectedWallets.map((wallet, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold">{wallet.type}</h3>
                      <p className="text-sm text-gray-600">{wallet.network}</p>
                    </div>
                    {wallet.type === walletState.primaryWallet?.type && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Primary</span>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs font-mono break-all">{wallet.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <ul className="space-y-2 text-sm">
            <li>• <strong>Internet Identity:</strong> Should work immediately</li>
            <li>• <strong>Plug Wallet:</strong> Install from <a href="https://plugwallet.ooo/" className="text-blue-600">plugwallet.ooo</a></li>
            <li>• <strong>MetaMask:</strong> Install from <a href="https://metamask.io/" className="text-blue-600">metamask.io</a></li>
            <li>• <strong>Trust Wallet:</strong> Install Trust Wallet browser extension</li>
            <li>• Open browser console to see detailed connection logs</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WalletTest
