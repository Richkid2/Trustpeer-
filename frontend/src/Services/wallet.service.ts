export const WalletType = {
  INTERNET_IDENTITY: 'internet-identity',
  PLUG: 'plug',
  METAMASK: 'metamask',
  TRUST_WALLET: 'trust-wallet',
  STOIC: 'stoic'
} as const

export type WalletType = typeof WalletType[keyof typeof WalletType]

export interface WalletConnection {
  type: WalletType
  address: string
  balance?: string
  network?: string
}

export interface MultiWalletState {
  isConnected: boolean
  primaryWallet: WalletConnection | null
  connectedWallets: WalletConnection[]
  icpIdentity?: any
}

class MultiWalletService {
  private state: MultiWalletState = {
    isConnected: false,
    primaryWallet: null,
    connectedWallets: []
  }

  private getEthereumProvider(preferredWallet: WalletType): any {
    if (typeof window === 'undefined') return null
    
    const ethereum = (window as any).ethereum
    if (!ethereum) return null

    // If there are multiple providers, try to select the preferred one
    if (ethereum.providers && ethereum.providers.length > 0) {
      const provider = ethereum.providers.find((p: any) => {
        if (preferredWallet === WalletType.METAMASK) {
          return p.isMetaMask && !p.isTrust && !p.isTrustWallet
        } else if (preferredWallet === WalletType.TRUST_WALLET) {
          return p.isTrust || p.isTrustWallet
        }
        return false
      })
      return provider || ethereum.providers[0]
    }

    return ethereum
  }

  async connectWallet(type: WalletType): Promise<WalletConnection> {
    switch (type) {
      case WalletType.INTERNET_IDENTITY:
        return this.connectInternetIdentity()
      case WalletType.PLUG:
        return this.connectPlug()
      case WalletType.METAMASK:
        return this.connectMetaMask()
      case WalletType.TRUST_WALLET:
        return this.connectTrustWallet()
      case WalletType.STOIC:
        return this.connectStoic()
      default:
        throw new Error(`Unsupported wallet type: ${type}`)
    }
  }

  private async connectInternetIdentity(): Promise<WalletConnection> {
    const { authService } = await import('./auth.service')
    const authState = await authService.login()
    
    if (authState.isAuthenticated && authState.principal) {
      const connection: WalletConnection = {
        type: WalletType.INTERNET_IDENTITY,
        address: authState.principal.toString(),
        network: 'ICP'
      }
      
      this.state.primaryWallet = connection
      this.state.connectedWallets.push(connection)
      this.state.isConnected = true
      this.state.icpIdentity = authState.identity
      
      return connection
    }
    
    throw new Error('Internet Identity connection failed')
  }

  private async connectPlug(): Promise<WalletConnection> {
    if (typeof window !== 'undefined' && (window as any).ic?.plug) {
      try {
        const isConnected = await (window as any).ic.plug.isConnected()
        if (!isConnected) {
          await (window as any).ic.plug.requestConnect()
        }
        
        const principal = await (window as any).ic.plug.agent.getPrincipal()
        const connection: WalletConnection = {
          type: WalletType.PLUG,
          address: principal.toString(),
          network: 'ICP'
        }
        
        this.state.connectedWallets.push(connection)
        if (!this.state.primaryWallet) {
          this.state.primaryWallet = connection
          this.state.isConnected = true
        }
        
        return connection
      } catch (error) {
        console.error('Plug wallet connection error:', error)
        throw new Error(`Plug wallet connection failed: ${error}`)
      }
    }
    
    throw new Error('Plug wallet not found. Please install Plug wallet extension from https://plugwallet.ooo/')
  }

  private async connectMetaMask(): Promise<WalletConnection> {
    const provider = this.getEthereumProvider(WalletType.METAMASK)
    
    if (!provider) {
      throw new Error('MetaMask not found. Please install MetaMask extension from https://metamask.io/')
    }

    try {
      // Check if MetaMask is specifically available
      if (!provider.isMetaMask) {
        throw new Error('MetaMask not detected. Please install MetaMask extension.')
      }

      // Check if Trust Wallet is also present and prioritize MetaMask
      if (provider.isTrust || provider.isTrustWallet) {
        throw new Error('Both MetaMask and Trust Wallet detected. Please disable one of them or use Trust Wallet button instead.')
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.')
      }

      const chainId = await provider.request({
        method: 'eth_chainId'
      })

      const networkName = this.getNetworkName(chainId)
      
      const connection: WalletConnection = {
        type: WalletType.METAMASK,
        address: accounts[0],
        network: networkName
      }
      
      this.state.connectedWallets.push(connection)
      if (!this.state.primaryWallet) {
        this.state.primaryWallet = connection
        this.state.isConnected = true
      }
      
      return connection
    } catch (error: any) {
      console.error('MetaMask connection error:', error)
      throw new Error(`MetaMask connection failed: ${error.message}`)
    }
  }

  private async connectTrustWallet(): Promise<WalletConnection> {
    const provider = this.getEthereumProvider(WalletType.TRUST_WALLET)
    
    if (!provider) {
      throw new Error('Trust Wallet not found. Please install Trust Wallet browser extension from https://trustwallet.com/browser-extension')
    }

    try {
      // Check if Trust Wallet is specifically available
      const isTrustWallet = provider.isTrust || 
                           provider.isTrustWallet ||
                           (window as any).trustWallet

      if (!isTrustWallet) {
        if (provider.isMetaMask) {
          throw new Error('Trust Wallet not detected. MetaMask is installed instead. Please install Trust Wallet browser extension.')
        }
        // If no specific wallet detected, try to use any ethereum provider as Trust Wallet
        console.warn('Trust Wallet not specifically detected, attempting connection with available ethereum provider')
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      })

      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock Trust Wallet.')
      }

      const chainId = await provider.request({
        method: 'eth_chainId'
      })

      const networkName = this.getNetworkName(chainId)
      
      const connection: WalletConnection = {
        type: WalletType.TRUST_WALLET,
        address: accounts[0],
        network: networkName
      }
      
      this.state.connectedWallets.push(connection)
      if (!this.state.primaryWallet) {
        this.state.primaryWallet = connection
        this.state.isConnected = true
      }
      
      return connection
    } catch (error: any) {
      console.error('Trust Wallet connection error:', error)
      throw new Error(`Trust Wallet connection failed: ${error.message}`)
    }
  }

  private async connectStoic(): Promise<WalletConnection> {
    throw new Error('Stoic wallet integration coming soon!')
  }

  async disconnectWallet(type: WalletType): Promise<void> {
    this.state.connectedWallets = this.state.connectedWallets.filter(
      wallet => wallet.type !== type
    )
    
    if (this.state.primaryWallet?.type === type) {
      this.state.primaryWallet = this.state.connectedWallets[0] || null
      this.state.isConnected = this.state.connectedWallets.length > 0
    }
    
    if (type === WalletType.INTERNET_IDENTITY) {
      const { authService } = await import('./auth.service')
      await authService.logout()
      this.state.icpIdentity = null
    }
  }

  async disconnectAll(): Promise<void> {
    for (const wallet of this.state.connectedWallets) {
      await this.disconnectWallet(wallet.type)
    }
    
    this.state = {
      isConnected: false,
      primaryWallet: null,
      connectedWallets: []
    }
  }

  getState(): MultiWalletState {
    return { ...this.state }
  }

  isWalletConnected(type: WalletType): boolean {
    return this.state.connectedWallets.some(wallet => wallet.type === type)
  }

  getWalletConnection(type: WalletType): WalletConnection | null {
    return this.state.connectedWallets.find(wallet => wallet.type === type) || null
  }

  isWalletAvailable(type: WalletType): boolean {
    if (typeof window === 'undefined') return false
    
    switch (type) {
      case WalletType.INTERNET_IDENTITY:
        return true
      case WalletType.PLUG:
        return !!(window as any).ic?.plug
      case WalletType.METAMASK:
        return !!((window as any).ethereum?.isMetaMask)
      case WalletType.TRUST_WALLET:
        const provider = (window as any).ethereum
        return !!(provider?.isTrust || provider?.isTrustWallet || (window as any).trustWallet)
      case WalletType.STOIC:
        return false
      default:
        return false
    }
  }

  getAvailableWallets(): WalletType[] {
    return Object.values(WalletType).filter(type => this.isWalletAvailable(type))
  }

  private getNetworkName(chainId: string): string {
    switch (chainId) {
      case '0x1':
        return 'Ethereum Mainnet'
      case '0x5':
        return 'Goerli Testnet'
      case '0xaa36a7':
        return 'Sepolia Testnet'
      case '0x89':
        return 'Polygon Mainnet'
      case '0x38':
        return 'BSC Mainnet'
      default:
        return `Chain ${chainId}`
    }
  }
}

export const multiWalletService = new MultiWalletService()