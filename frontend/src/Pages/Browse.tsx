import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Briefcase, 
  Star, 
  Settings, 
  Search, 
  AlertTriangle,
  LogOut,
  Filter,
  ChevronDown,
  User,
  Eye,
  Menu,
  X,
  Bell,
  Shield,
  Users,
  MapPin,
  MessageCircle,
  Activity
} from 'lucide-react'

interface LocationState {
  username?: string
  onboardingComplete?: boolean
  telegramAdded?: boolean
  telegramHandle?: string
  telegramSkipped?: boolean
  skippedTelegram?: boolean
}

interface Trader {
  id: string
  username: string
  trustScore: number
  totalTrades: number
  completedTrades: number
  completionRate: number
  avgResponseTime: string
  location: string
  languages: string[]
  paymentMethods: string[]
  lastSeen: string
  verified: boolean
  badges: string[]
  avatar: string
  isOnline: boolean
  rating: number
  totalRatings: number
  joinedDate: string
  bio: string
}

const Browse = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state as LocationState) || {}
  const [activeMenuItem, setActiveMenuItem] = useState('browse')
  const [username] = useState(locationState.username || 'John Doe')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterRating, setFilterRating] = useState('all')
  const [filterLocation, setFilterLocation] = useState('all')
  const [sortBy, setSortBy] = useState('rating')
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  // Mock traders data
  const mockTraders: Trader[] = [
    {
      id: 'trader001',
      username: 'CryptoKing',
      trustScore: 4.8,
      totalTrades: 156,
      completedTrades: 152,
      completionRate: 97.4,
      avgResponseTime: '2 mins',
      location: 'Lagos, Nigeria',
      languages: ['English', 'Yoruba'],
      paymentMethods: ['Bank Transfer', 'Mobile Money'],
      lastSeen: '2 hours ago',
      verified: true,
      badges: ['Verified Trader', 'Quick Responder', 'Top Seller'],
      avatar: '',
      isOnline: false,
      rating: 4.8,
      totalRatings: 89,
      joinedDate: 'Jan 2024',
      bio: 'Professional crypto trader with 3+ years experience. Fast and reliable transactions.'
    },
    {
      id: 'trader002',
      username: 'NairaExchange',
      trustScore: 4.9,
      totalTrades: 234,
      completedTrades: 231,
      completionRate: 98.7,
      avgResponseTime: '1 min',
      location: 'Abuja, Nigeria',
      languages: ['English', 'Hausa'],
      paymentMethods: ['Bank Transfer', 'Opay', 'Kuda'],
      lastSeen: 'Online',
      verified: true,
      badges: ['Verified Trader', 'Lightning Fast', 'Trusted Member', 'Elite Trader'],
      avatar: '',
      isOnline: true,
      rating: 4.9,
      totalRatings: 145,
      joinedDate: 'Nov 2023',
      bio: 'Highest rated trader on the platform. Specializing in large volume transactions.'
    },
    {
      id: 'trader003',
      username: 'SafeTrade247',
      trustScore: 4.6,
      totalTrades: 89,
      completedTrades: 87,
      completionRate: 97.8,
      avgResponseTime: '5 mins',
      location: 'Port Harcourt, Nigeria',
      languages: ['English'],
      paymentMethods: ['Bank Transfer', 'PayPal'],
      lastSeen: '1 hour ago',
      verified: true,
      badges: ['Verified Trader', 'Safe Trader'],
      avatar: '',
      isOnline: false,
      rating: 4.6,
      totalRatings: 67,
      joinedDate: 'Mar 2024',
      bio: 'Security-focused trader with emphasis on safe and secure transactions.'
    },
    {
      id: 'trader004',
      username: 'QuickCash',
      trustScore: 4.7,
      totalTrades: 112,
      completedTrades: 109,
      completionRate: 97.3,
      avgResponseTime: '3 mins',
      location: 'Kano, Nigeria',
      languages: ['English', 'Hausa'],
      paymentMethods: ['Bank Transfer', 'Mobile Money', 'Cash'],
      lastSeen: 'Online',
      verified: true,
      badges: ['Verified Trader', 'Quick Responder'],
      avatar: '',
      isOnline: true,
      rating: 4.7,
      totalRatings: 78,
      joinedDate: 'Feb 2024',
      bio: 'Fast cash transactions with multiple payment options available.'
    },
    {
      id: 'trader005',
      username: 'ReliableTrader',
      trustScore: 4.5,
      totalTrades: 67,
      completedTrades: 65,
      completionRate: 97.0,
      avgResponseTime: '4 mins',
      location: 'Ibadan, Nigeria',
      languages: ['English', 'Yoruba'],
      paymentMethods: ['Bank Transfer', 'Opay'],
      lastSeen: '30 mins ago',
      verified: false,
      badges: ['New Trader'],
      avatar: '',
      isOnline: false,
      rating: 4.5,
      totalRatings: 45,
      joinedDate: 'Jun 2024',
      bio: 'New but reliable trader. Building reputation with consistent quality service.'
    },
    {
      id: 'trader006',
      username: 'PremiumExchange',
      trustScore: 4.8,
      totalTrades: 198,
      completedTrades: 195,
      completionRate: 98.5,
      avgResponseTime: '2 mins',
      location: 'Lagos, Nigeria',
      languages: ['English'],
      paymentMethods: ['Bank Transfer', 'Wire Transfer', 'PayPal'],
      lastSeen: 'Online',
      verified: true,
      badges: ['Verified Trader', 'Premium Member', 'High Volume'],
      avatar: '',
      isOnline: true,
      rating: 4.8,
      totalRatings: 126,
      joinedDate: 'Oct 2023',
      bio: 'Premium trader specializing in high-volume transactions and international transfers.'
    }
  ]

  // Filter and sort traders
  const filteredTraders = mockTraders
    .filter(trader => {
      const matchesSearch = !searchQuery || 
        trader.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trader.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        trader.bio.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = filterCategory === 'all' || 
        (filterCategory === 'verified' && trader.verified) ||
        (filterCategory === 'online' && trader.isOnline) ||
        (filterCategory === 'new' && trader.joinedDate.includes('2024')) ||
        (filterCategory === 'elite' && trader.badges.includes('Elite Trader'))
      
      const matchesRating = filterRating === 'all' || 
        (filterRating === '4+' && trader.rating >= 4.0) ||
        (filterRating === '4.5+' && trader.rating >= 4.5) ||
        (filterRating === '4.8+' && trader.rating >= 4.8)
      
      const matchesLocation = filterLocation === 'all' || 
        trader.location.toLowerCase().includes(filterLocation.toLowerCase())
      
      return matchesSearch && matchesCategory && matchesRating && matchesLocation
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'trades':
          return b.totalTrades - a.totalTrades
        case 'completion':
          return b.completionRate - a.completionRate
        case 'response':
          const aTime = parseInt(a.avgResponseTime)
          const bTime = parseInt(b.avgResponseTime)
          return aTime - bTime
        case 'recent':
          if (a.isOnline && !b.isOnline) return -1
          if (!a.isOnline && b.isOnline) return 1
          return 0
        default:
          return 0
      }
    })

  // Navigation handler
  const handleNavigation = (itemId: string) => {
    setActiveMenuItem(itemId)
    setShowMobileMenu(false)
    
    switch (itemId) {
      case 'dashboard':
        navigate('/dashboard', { state: locationState })
        break
      case 'transactions':
        navigate('/transactions', { state: locationState })
        break
      case 'disputes':
        navigate('/disputes', { state: locationState })
        break
      case 'profile':
        navigate('/profile', { state: locationState })
        break
      case 'settings':
        console.log('Navigate to settings')
        break
      default:
        break
    }
  }

  // Notification handler
  const handleNotificationClick = () => {
    console.log('Opening notifications')
    setHasNewNotifications(false)
    setNotificationCount(0)
  }

  // Start trade with trader
  const handleStartTrade = (trader: Trader) => {
    navigate('/start-trade', { 
      state: { 
        ...locationState, 
        selectedTrader: trader 
      } 
    })
  }

  // View trader profile
  const handleViewProfile = (trader: Trader) => {
    console.log('View trader profile:', trader.id)
    // Here you would navigate to a detailed trader profile page
  }

  // Get badge color
  const getBadgeColor = (badge: string) => {
    switch (badge) {
      case 'Verified Trader':
        return 'bg-green-500/20 text-green-500 border-green-500/30'
      case 'Elite Trader':
        return 'bg-purple-500/20 text-purple-500 border-purple-500/30'
      case 'Quick Responder':
      case 'Lightning Fast':
        return 'bg-blue-500/20 text-blue-500 border-blue-500/30'
      case 'Top Seller':
      case 'Premium Member':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
      case 'New Trader':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30'
      default:
        return 'bg-[#ee5f0a]/20 text-[#ee5f0a] border-[#ee5f0a]/30'
    }
  }

  // Calculate browse stats
  const totalTraders = mockTraders.length
  const onlineTraders = mockTraders.filter(t => t.isOnline).length
  const verifiedTraders = mockTraders.filter(t => t.verified).length
  const avgRating = (mockTraders.reduce((sum, t) => sum + t.rating, 0) / mockTraders.length).toFixed(1)

  // Simulate new notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (!hasNewNotifications && Math.random() > 0.8) {
        setHasNewNotifications(true)
        setNotificationCount(prev => Math.min(prev + 1, 9))
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [hasNewNotifications])

  return (
    <div className="min-h-screen bg-[#080909] flex">
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#0a0b0c] border-r border-gray-800 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <img 
              src="/src/assets/images/trustpeer-logo.png" 
              alt="TrustPeer" 
              className="h-8 w-auto"
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-6">
          <nav className="space-y-2 px-4">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'browse', label: 'Browse', icon: Search, active: true },
              { id: 'transactions', label: 'Transactions', icon: Briefcase },
              { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
              { id: 'profile', label: 'Profile', icon: User }
            ].map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ x: 4 }}
                onClick={() => handleNavigation(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                  activeMenuItem === item.id
                    ? 'bg-[#ee5f0a] text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </motion.button>
            ))}
          </nav>
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-800 p-4 space-y-2">
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => handleNavigation('settings')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <Settings className="w-5 h-5" />
            Settings
          </motion.button>
          <motion.button
            whileHover={{ x: 4 }}
            onClick={() => navigate('/login')}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Disconnect Wallet
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setShowMobileMenu(false)}>
          <motion.div 
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="w-64 h-full bg-[#0a0b0c] border-r border-gray-800 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile Logo and Close */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center justify-center">
                <img 
                  src="/src/assets/images/trustpeer-logo.png" 
                  alt="TrustPeer" 
                  className="h-8 w-auto"
                />
              </div>
              <button 
                onClick={() => setShowMobileMenu(false)}
                className="p-2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Navigation */}
            <div className="flex-1 py-6">
              <nav className="space-y-2 px-4">
                {[
                  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
                  { id: 'browse', label: 'Browse', icon: Search, active: true },
                  { id: 'transactions', label: 'Transactions', icon: Briefcase },
                  { id: 'disputes', label: 'Disputes', icon: AlertTriangle },
                  { id: 'profile', label: 'Profile', icon: User }
                ].map((item) => (
                  <motion.button
                    key={item.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      activeMenuItem === item.id
                        ? 'bg-[#ee5f0a] text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </motion.button>
                ))}
              </nav>
            </div>

            {/* Mobile Bottom Menu */}
            <div className="border-t border-gray-800 p-4 space-y-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation('settings')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              >
                <Settings className="w-5 h-5" />
                Settings
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-400 hover:text-red-300 hover:bg-gray-800 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Disconnect Wallet
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-[#0a0b0c] border-b border-gray-800 px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button 
                onClick={() => setShowMobileMenu(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">Browse Traders</h1>
                <p className="text-gray-400 text-sm lg:text-base">
                  Find and connect with trusted crypto traders
                </p>
                <p className="text-gray-500 text-xs lg:text-sm mt-1">GMT+1: 4C:2D 📍</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 lg:gap-4">
              <div className="relative">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNotificationClick}
                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                >
                  <Bell className="w-5 h-5 lg:w-6 lg:h-6" />
                  {hasNewNotifications && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-[#ee5f0a] rounded-full flex items-center justify-center"
                    >
                      <span className="text-white text-xs font-medium">
                        {notificationCount > 9 ? '9+' : notificationCount}
                      </span>
                    </motion.div>
                  )}
                  {hasNewNotifications && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#ee5f0a] rounded-full animate-ping opacity-20"></div>
                  )}
                </motion.button>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 lg:w-8 lg:h-8 bg-gray-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs lg:text-sm font-medium">
                    {username.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm font-medium">{username}</p>
                  <p className="text-gray-400 text-xs">{username}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-8">
          {/* Browse Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Total Traders</p>
                  <p className="text-white text-xl lg:text-2xl font-bold">{totalTraders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Online Now</p>
                  <p className="text-white text-xl lg:text-2xl font-bold">{onlineTraders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Verified</p>
                  <p className="text-white text-xl lg:text-2xl font-bold">{verifiedTraders}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-10 h-10 lg:w-12 lg:h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Avg Rating</p>
                  <p className="text-white text-xl lg:text-2xl font-bold">{avgRating}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 mb-6 lg:mb-8"
          >
            <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 lg:gap-4">
                <h2 className="text-lg lg:text-xl font-semibold text-white">Find Traders</h2>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-[#ee5f0a] text-white' 
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    <Users className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-[#ee5f0a] text-white' 
                        : 'bg-gray-800 text-gray-400 hover:text-white'
                    }`}
                  >
                    ⋮⋮⋮
                  </motion.button>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              {/* Search Bar - Full Width on Mobile */}
              <div className="w-full">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search traders by name, location, or skills..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#ee5f0a]"
                  />
                </div>
              </div>
              
              {/* Filters - Stack on Mobile, Horizontal on Desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap gap-2">
                <div className="relative">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="all">All Traders</option>
                    <option value="verified">Verified Only</option>
                    <option value="online">Online Now</option>
                    <option value="new">New Traders</option>
                    <option value="elite">Elite Traders</option>
                  </select>
                  <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="all">All Ratings</option>
                    <option value="4+">4.0+ Stars</option>
                    <option value="4.5+">4.5+ Stars</option>
                    <option value="4.8+">4.8+ Stars</option>
                  </select>
                  <Star className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="all">All Locations</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="kano">Kano</option>
                    <option value="port harcourt">Port Harcourt</option>
                    <option value="ibadan">Ibadan</option>
                  </select>
                  <MapPin className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-gray-400 hover:text-white transition-colors text-sm pr-8"
                  >
                    <option value="rating">Sort by Rating</option>
                    <option value="trades">Sort by Trades</option>
                    <option value="completion">Sort by Completion Rate</option>
                    <option value="response">Sort by Response Time</option>
                    <option value="recent">Sort by Activity</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Traders Grid/List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            {filteredTraders.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6" 
                : "space-y-4"
              }>
                {filteredTraders.map((trader, index) => (
                  <motion.div
                    key={trader.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-[#0f1011] rounded-xl p-4 lg:p-6 hover:bg-gray-800/20 transition-colors ${
                      viewMode === 'list' ? 'flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6' : ''
                    }`}
                  >
                    {/* Trader Info */}
                    <div className={`flex-1 ${viewMode === 'grid' ? 'space-y-4' : 'space-y-3 sm:space-y-2'}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#ee5f0a] to-[#d54f08] rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm sm:text-base">
                                {trader.username.substring(0, 2).toUpperCase()}
                              </span>
                            </div>
                            {trader.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-[#0f1011]"></div>
                            )}
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-base sm:text-lg">{trader.username}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500" />
                                <span className="text-white font-medium text-sm sm:text-base">{trader.rating}</span>
                                <span className="text-gray-400 text-xs sm:text-sm">({trader.totalRatings})</span>
                              </div>
                              {trader.verified && (
                                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          trader.isOnline ? 'bg-green-500/20 text-green-500' : 'bg-gray-500/20 text-gray-500'
                        }`}>
                          {trader.isOnline ? 'Online' : trader.lastSeen}
                        </span>
                      </div>

                      <p className="text-gray-400 text-xs sm:text-sm line-clamp-2">{trader.bio}</p>

                      <div className="grid grid-cols-2 gap-3 sm:gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 text-xs">Trades</p>
                          <p className="text-white font-medium text-sm">{trader.totalTrades}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Completion</p>
                          <p className="text-white font-medium text-sm">{trader.completionRate}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Response</p>
                          <p className="text-white font-medium text-sm">{trader.avgResponseTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 text-xs">Location</p>
                          <p className="text-white font-medium text-sm truncate">{trader.location}</p>
                        </div>
                      </div>

                      {/* Badges */}
                      <div className="flex flex-wrap gap-1">
                        {trader.badges.slice(0, viewMode === 'list' ? 2 : 3).map((badge, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeColor(badge)}`}
                          >
                            {badge}
                          </span>
                        ))}
                        {trader.badges.length > (viewMode === 'list' ? 2 : 3) && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-500/20 text-gray-500 border border-gray-500/30">
                            +{trader.badges.length - (viewMode === 'list' ? 2 : 3)} more
                          </span>
                        )}
                      </div>

                      {/* Payment Methods */}
                      <div>
                        <p className="text-gray-400 text-xs mb-1">Payment Methods:</p>
                        <div className="flex flex-wrap gap-1">
                          {trader.paymentMethods.slice(0, 3).map((method, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300 truncate">
                              {method}
                            </span>
                          ))}
                          {trader.paymentMethods.length > 3 && (
                            <span className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-300">
                              +{trader.paymentMethods.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col sm:flex-row gap-2 pt-2">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleStartTrade(trader)}
                          className="flex-1 bg-[#ee5f0a] hover:bg-[#d54f08] text-white py-2 px-4 rounded-lg font-medium transition-colors text-sm"
                        >
                          Start Trade
                        </motion.button>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleViewProfile(trader)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 mx-auto sm:mx-0" />
                            <span className="sr-only sm:not-sr-only ml-0 sm:ml-2 text-sm">View</span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => console.log('Message trader:', trader.id)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
                          >
                            <MessageCircle className="w-4 h-4 mx-auto sm:mx-0" />
                            <span className="sr-only sm:not-sr-only ml-0 sm:ml-2 text-sm">Chat</span>
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-[#0f1011] rounded-xl p-8 text-center">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-white text-xl font-semibold mb-2">No Traders Found</h3>
                <p className="text-gray-400 mb-4">
                  No traders match your current search and filter criteria.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSearchQuery('')
                    setFilterCategory('all')
                    setFilterRating('all')
                    setFilterLocation('all')
                  }}
                  className="bg-[#ee5f0a] hover:bg-[#d54f08] text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Browse
