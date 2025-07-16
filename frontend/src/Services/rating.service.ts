export interface Rating {
  id: string
  fromAddress: string
  toAddress: string
  tradeId: string
  rating: number // 1-5 stars
  comment: string
  timestamp: Date
  helpful: number // number of helpful votes
  verified: boolean // if rating is from completed trade
}

export interface TraderProfile {
  address: string
  username?: string
  totalRatings: number
  averageRating: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
  totalTrades: number
  completedTrades: number
  joinDate: Date
  lastActive: Date
  trustScore: number // 0-100 calculated score
  badges: string[]
}

export interface RatingState {
  ratings: Rating[]
  profiles: Map<string, TraderProfile>
  isLoading: boolean
  error: string | null
}

class RatingService {
  private state: RatingState = {
    ratings: [],
    profiles: new Map(),
    isLoading: false,
    error: null
  }

  private listeners: Array<(state: RatingState) => void> = []

  constructor() {
    this.loadMockData()
  }

  // Subscribe to state changes
  subscribe(listener: (state: RatingState) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.state))
  }

  private updateState(updates: Partial<RatingState>) {
    this.state = { ...this.state, ...updates }
    this.notifyListeners()
  }

  getState(): RatingState {
    return { 
      ...this.state, 
      profiles: new Map(this.state.profiles) 
    }
  }

  // Submit a rating for a completed trade
  async submitRating(
    tradeId: string,
    toAddress: string,
    rating: number,
    comment: string,
    fromAddress: string
  ): Promise<Rating> {
    this.updateState({ isLoading: true, error: null })

    try {
      // Validate rating
      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5 stars')
      }

      if (comment.length < 10) {
        throw new Error('Comment must be at least 10 characters long')
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newRating: Rating = {
        id: `R${Date.now()}`,
        fromAddress,
        toAddress,
        tradeId,
        rating,
        comment,
        timestamp: new Date(),
        helpful: 0,
        verified: true
      }

      const ratings = [...this.state.ratings, newRating]
      this.updateState({ ratings, isLoading: false })

      // Update trader profile
      await this.updateTraderProfile(toAddress)

      return newRating
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to submit rating' 
      })
      throw error
    }
  }

  // Get ratings for a specific trader
  async getTraderRatings(address: string): Promise<Rating[]> {
    return this.state.ratings
      .filter(rating => rating.toAddress === address)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  // Get trader profile with calculated metrics
  async getTraderProfile(address: string): Promise<TraderProfile | null> {
    let profile = this.state.profiles.get(address)
    
    if (!profile) {
      // Create new profile if not exists
      profile = await this.createTraderProfile(address)
    }

    return profile
  }

  // Search traders by username or address
  async searchTraders(query: string): Promise<TraderProfile[]> {
    this.updateState({ isLoading: true, error: null })

    try {
      await new Promise(resolve => setTimeout(resolve, 500))

      const results = Array.from(this.state.profiles.values())
        .filter(profile => 
          profile.address.toLowerCase().includes(query.toLowerCase()) ||
          profile.username?.toLowerCase().includes(query.toLowerCase())
        )
        .sort((a, b) => b.trustScore - a.trustScore)

      this.updateState({ isLoading: false })
      return results
    } catch (error) {
      this.updateState({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Search failed' 
      })
      throw error
    }
  }

  // Get top traders by trust score
  async getTopTraders(limit: number = 10): Promise<TraderProfile[]> {
    return Array.from(this.state.profiles.values())
      .sort((a, b) => b.trustScore - a.trustScore)
      .slice(0, limit)
  }

  // Mark rating as helpful
  async markRatingHelpful(ratingId: string): Promise<void> {
    const ratings = this.state.ratings.map(rating => 
      rating.id === ratingId 
        ? { ...rating, helpful: rating.helpful + 1 }
        : rating
    )

    this.updateState({ ratings })
  }

  // Calculate trust score based on various factors
  private calculateTrustScore(profile: TraderProfile): number {
    const { averageRating, totalRatings, completedTrades, totalTrades } = profile

    // Base score from average rating (0-50 points)
    const ratingScore = (averageRating / 5) * 50

    // Volume bonus (0-25 points)
    const volumeScore = Math.min(totalRatings / 10, 1) * 25

    // Completion rate bonus (0-20 points)
    const completionRate = totalTrades > 0 ? completedTrades / totalTrades : 0
    const completionScore = completionRate * 20

    // Activity bonus (0-5 points)
    const daysSinceJoin = (Date.now() - profile.joinDate.getTime()) / (1000 * 60 * 60 * 24)
    const activityScore = Math.min(daysSinceJoin / 30, 1) * 5

    return Math.round(ratingScore + volumeScore + completionScore + activityScore)
  }

  // Create new trader profile
  private async createTraderProfile(address: string): Promise<TraderProfile> {
    const profile: TraderProfile = {
      address,
      username: `trader_${address.slice(-4)}`,
      totalRatings: 0,
      averageRating: 0,
      ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      totalTrades: 0,
      completedTrades: 0,
      joinDate: new Date(),
      lastActive: new Date(),
      trustScore: 0,
      badges: []
    }

    this.state.profiles.set(address, profile)
    return profile
  }

  // Update trader profile with latest ratings
  private async updateTraderProfile(address: string): Promise<void> {
    const traderRatings = await this.getTraderRatings(address)
    let profile = this.state.profiles.get(address)

    if (!profile) {
      profile = await this.createTraderProfile(address)
    }

    // Calculate new metrics
    const totalRatings = traderRatings.length
    const averageRating = totalRatings > 0 
      ? traderRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
      : 0

    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    traderRatings.forEach(rating => {
      ratingDistribution[rating.rating as keyof typeof ratingDistribution]++
    })

    // Update badges based on achievements
    const badges = []
    if (totalRatings >= 10) badges.push('Experienced Trader')
    if (averageRating >= 4.5) badges.push('Top Rated')
    if (profile.completedTrades >= 50) badges.push('Veteran')
    if (profile.trustScore >= 90) badges.push('Trusted')

    const updatedProfile: TraderProfile = {
      ...profile,
      totalRatings,
      averageRating,
      ratingDistribution,
      lastActive: new Date(),
      badges
    }

    updatedProfile.trustScore = this.calculateTrustScore(updatedProfile)

    this.state.profiles.set(address, updatedProfile)
    this.notifyListeners()
  }

  // Load mock data for development
  private loadMockData() {
    const mockRatings: Rating[] = [
      {
        id: 'R1',
        fromAddress: '0x1234567890123456789012345678901234567890',
        toAddress: '0x9876543210987654321098765432109876543210',
        tradeId: 'TR1704067200000',
        rating: 5,
        comment: 'Excellent trader! Very professional and responsive. Transaction completed smoothly.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        helpful: 3,
        verified: true
      },
      {
        id: 'R2',
        fromAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
        toAddress: '0x9876543210987654321098765432109876543210',
        tradeId: 'TR1704067100000',
        rating: 4,
        comment: 'Good experience overall. Quick payment and good communication.',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        helpful: 1,
        verified: true
      },
      {
        id: 'R3',
        fromAddress: '0x5555555555555555555555555555555555555555',
        toAddress: '0x9876543210987654321098765432109876543210',
        tradeId: 'TR1704067000000',
        rating: 5,
        comment: 'Outstanding trader with excellent reputation. Highly recommended!',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
        helpful: 5,
        verified: true
      }
    ]

    const mockProfile: TraderProfile = {
      address: '0x9876543210987654321098765432109876543210',
      username: 'CryptoTrader_Pro',
      totalRatings: 3,
      averageRating: 4.67,
      ratingDistribution: { 5: 2, 4: 1, 3: 0, 2: 0, 1: 0 },
      totalTrades: 15,
      completedTrades: 15,
      joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
      lastActive: new Date(),
      trustScore: 85,
      badges: ['Experienced Trader', 'Top Rated']
    }

    this.state.profiles.set(mockProfile.address, mockProfile)
    this.updateState({ ratings: mockRatings })
  }
}

export const ratingService = new RatingService()
