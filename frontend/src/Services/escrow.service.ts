import { multiWalletService } from './wallet.service'

export interface TradeDetails {
  id: string
  buyer: string
  seller: string
  amount: string
  currency: string
  description: string
  type: 'buy' | 'sell' | 'exchange'
  status: TradeStatus
  createdAt: Date
  updatedAt: Date
  escrowAddress?: string
  releaseConditions?: string[]
  timeline?: TradeStep[]
}

export interface TradeStep {
  name: string
  completed: boolean
  timestamp?: Date
  description?: string
}

export const TradeStatus = {
  CREATED: 'created',
  FUNDS_DEPOSITED: 'funds_deposited',
  AWAITING_CONFIRMATION: 'awaiting_confirmation',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  DISPUTED: 'disputed'
} as const

export type TradeStatus = typeof TradeStatus[keyof typeof TradeStatus]

export interface CreateTradeRequest {
  partnerAddress: string
  amount: string
  currency: string
  description: string
  type: 'buy' | 'sell' | 'exchange'
  releaseConditions?: string[]
}

export interface EscrowState {
  activeTrades: TradeDetails[]
  completedTrades: TradeDetails[]
  isLoading: boolean
  error: string | null
}

class EscrowService {
  private state: EscrowState = {
    activeTrades: [],
    completedTrades: [],
    isLoading: false,
    error: null
  }

  private listeners: Array<(state: EscrowState) => void> = []

  constructor() {
    this.loadMockData()
  }

  // Subscribe to state changes
  subscribe(listener: (state: EscrowState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  private updateState(updates: Partial<EscrowState>) {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  getState(): EscrowState {
    return { ...this.state }
  }

  // Create a new trade
  async createTrade(request: CreateTradeRequest): Promise<TradeDetails> {
    this.updateState({ isLoading: true, error: null })

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      const walletState = multiWalletService.getState()
      if (!walletState.isConnected) {
        throw new Error('Wallet not connected')
      }

      const currentUser = walletState.connectedWallets[0]?.address || 'Unknown'

      const newTrade: TradeDetails = {
        id: `TR${Date.now()}`,
        buyer: request.type === 'buy' ? currentUser : request.partnerAddress,
        seller: request.type === 'sell' ? currentUser : request.partnerAddress,
        amount: request.amount,
        currency: request.currency,
        description: request.description,
        type: request.type,
        status: TradeStatus.CREATED,
        createdAt: new Date(),
        updatedAt: new Date(),
        escrowAddress: `0x${Math.random().toString(16).substring(2, 42)}`,
        releaseConditions: request.releaseConditions || [
          'Both parties confirm trade completion',
          'Funds are released after confirmation'
        ],
        timeline: [
          { name: 'Trade Created', completed: true, timestamp: new Date() },
          { name: 'Funds Deposited', completed: false },
          { name: 'Awaiting Confirmation', completed: false },
          { name: 'Trade Complete', completed: false }
        ]
      }

      const activeTrades = [...this.state.activeTrades, newTrade]
      this.updateState({ activeTrades, isLoading: false })

      return newTrade
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create trade' 
      })
      throw error
    }
  }

  // Get trade by ID
  async getTrade(tradeId: string): Promise<TradeDetails | null> {
    const allTrades = [...this.state.activeTrades, ...this.state.completedTrades]
    return allTrades.find(trade => trade.id === tradeId) || null
  }

  // Deposit funds to escrow
  async depositFunds(tradeId: string): Promise<void> {
    this.updateState({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const trade = this.state.activeTrades.find(t => t.id === tradeId)
      if (!trade) {
        throw new Error('Trade not found')
      }

      const updatedTrade: TradeDetails = {
        ...trade,
        status: TradeStatus.FUNDS_DEPOSITED,
        updatedAt: new Date(),
        timeline: trade.timeline?.map(step => 
          step.name === 'Funds Deposited' 
            ? { ...step, completed: true, timestamp: new Date() }
            : step
        )
      }

      const activeTrades = this.state.activeTrades.map(t => 
        t.id === tradeId ? updatedTrade : t
      )

      this.updateState({ activeTrades, isLoading: false })
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to deposit funds' 
      })
      throw error
    }
  }

  // Confirm trade completion
  async confirmTrade(tradeId: string): Promise<void> {
    this.updateState({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 1500))

      const trade = this.state.activeTrades.find(t => t.id === tradeId)
      if (!trade) {
        throw new Error('Trade not found')
      }

      const updatedTrade: TradeDetails = {
        ...trade,
        status: TradeStatus.AWAITING_CONFIRMATION,
        updatedAt: new Date(),
        timeline: trade.timeline?.map(step => 
          step.name === 'Awaiting Confirmation' 
            ? { ...step, completed: true, timestamp: new Date() }
            : step
        )
      }

      const activeTrades = this.state.activeTrades.map(t => 
        t.id === tradeId ? updatedTrade : t
      )

      this.updateState({ activeTrades, isLoading: false })
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to confirm trade' 
      })
      throw error
    }
  }

  // Release funds and complete trade
  async releaseFunds(tradeId: string): Promise<void> {
    this.updateState({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))

      const trade = this.state.activeTrades.find(t => t.id === tradeId)
      if (!trade) {
        throw new Error('Trade not found')
      }

      const completedTrade: TradeDetails = {
        ...trade,
        status: TradeStatus.COMPLETED,
        updatedAt: new Date(),
        timeline: trade.timeline?.map(step => 
          step.name === 'Trade Complete' 
            ? { ...step, completed: true, timestamp: new Date() }
            : step
        )
      }

      const activeTrades = this.state.activeTrades.filter(t => t.id !== tradeId)
      const completedTrades = [...this.state.completedTrades, completedTrade]

      this.updateState({ activeTrades, completedTrades, isLoading: false })
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to release funds' 
      })
      throw error
    }
  }

  // Cancel trade
  async cancelTrade(tradeId: string): Promise<void> {
    this.updateState({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))

      const trade = this.state.activeTrades.find(t => t.id === tradeId)
      if (!trade) {
        throw new Error('Trade not found')
      }

      const cancelledTrade: TradeDetails = {
        ...trade,
        status: TradeStatus.CANCELLED,
        updatedAt: new Date()
      }

      const activeTrades = this.state.activeTrades.filter(t => t.id !== tradeId)
      const completedTrades = [...this.state.completedTrades, cancelledTrade]

      this.updateState({ activeTrades, completedTrades, isLoading: false })
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to cancel trade' 
      })
      throw error
    }
  }

  // Get user's trade history
  async getTradeHistory(): Promise<TradeDetails[]> {
    const walletState = multiWalletService.getState()
    if (!walletState.isConnected) {
      return []
    }

    const userAddress = walletState.connectedWallets[0]?.address || ''
    const allTrades = [...this.state.activeTrades, ...this.state.completedTrades]
    
    return allTrades.filter(trade => 
      trade.buyer === userAddress || trade.seller === userAddress
    ).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  }

  // Load mock data for development
  private loadMockData() {
    // Mock active trade
    const mockTrade: TradeDetails = {
      id: 'TR1704067200000',
      buyer: '0x1234567890123456789012345678901234567890',
      seller: '0x9876543210987654321098765432109876543210',
      amount: '0.5',
      currency: 'ETH',
      description: 'Trading ETH for service development',
      type: 'buy',
      status: TradeStatus.FUNDS_DEPOSITED,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
      escrowAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      releaseConditions: [
        'Both parties confirm trade completion',
        'Service delivery confirmed',
        'Funds are released after confirmation'
      ],
      timeline: [
        { name: 'Trade Created', completed: true, timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
        { name: 'Funds Deposited', completed: true, timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000) },
        { name: 'Awaiting Confirmation', completed: false },
        { name: 'Trade Complete', completed: false }
      ]
    }

    this.updateState({ activeTrades: [mockTrade] })
  }
}

export const escrowService = new EscrowService()
