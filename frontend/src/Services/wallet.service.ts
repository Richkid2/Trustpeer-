export enum WalletType {
  INTERNET_IDENTITY = 'internet-identity',
  PLUG = 'plug',
  METAMASK = 'metamask',
  TRUST_WALLET = 'trust-wallet',
  STOIC = 'stoic'
}

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
    // This will use the existing auth service
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
    // Check if Plug is installed
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
        throw new Error('Plug wallet connection failed')
      }
    }
    
    throw new Error('Plug wallet not found. Please install Plug wallet extension.')
  }

  private async connectMetaMask(): Promise<WalletConnection> {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        const connection: WalletConnection = {
          type: WalletType.METAMASK,
          address: accounts[0],
          network: 'Ethereum'
        }
        
        this.state.connectedWallets.push(connection)
        if (!this.state.primaryWallet) {
          this.state.primaryWallet = connection
          this.state.isConnected = true
        }
        
        return connection
      } catch (error) {
        throw new Error('MetaMask connection failed')
      }
    }
    
    throw new Error('MetaMask not found. Please install MetaMask extension.')
  }

  private async connectTrustWallet(): Promise<WalletConnection> {
    // Trust Wallet uses the same interface as MetaMask
    if (typeof window !== 'undefined' && (window as any).ethereum?.isTrust) {
      try {
        const accounts = await (window as any).ethereum.request({
          method: 'eth_requestAccounts'
        })
        
        const connection: WalletConnection = {
          type: WalletType.TRUST_WALLET,
          address: accounts[0],
          network: 'Ethereum'
        }
        
        this.state.connectedWallets.push(connection)
        if (!this.state.primaryWallet) {
          this.state.primaryWallet = connection
          this.state.isConnected = true
        }
        
        return connection
      } catch (error) {
        throw new Error('Trust Wallet connection failed')
      }
    }
    
    throw new Error('Trust Wallet not found. Please install Trust Wallet.')
  }

  private async connectStoic(): Promise<WalletConnection> {
    // Stoic wallet implementation would go here
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
}

export const multiWalletService = new MultiWalletService()
