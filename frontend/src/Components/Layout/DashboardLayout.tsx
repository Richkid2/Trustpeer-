import { useState, useEffect } from 'react'
import { type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  Briefcase, 
  Settings, 
  Search, 
  AlertTriangle,
  LogOut,
  User,
  Menu,
  X,
  Bell,
  Shield
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
  pageTitle?: string
  pageDescription?: string
  setShowMobileMenu?: (show: boolean) => void
}

interface LocationState {
  username?: string
  onboardingComplete?: boolean
  telegramAdded?: boolean
  telegramHandle?: string
  telegramSkipped?: boolean
  skippedTelegram?: boolean
}

const DashboardLayout = ({ 
  children, 
  pageTitle = 'Dashboard', 
  pageDescription = 'Welcome to your trading dashboard',
  setShowMobileMenu 
}: DashboardLayoutProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = (location.state as LocationState) || {}
  
  const [activeMenuItem, setActiveMenuItem] = useState(() => {
    const path = location.pathname
    if (path.includes('browse')) return 'browse'
    if (path.includes('trade') || path.includes('escrow') || path.includes('start-trade')) return 'trade'
    if (path.includes('transactions')) return 'transactions'
    if (path.includes('disputes')) return 'disputes'
    if (path.includes('profile')) return 'profile'
    return 'dashboard'
  })
  
  const [username] = useState(locationState.username || 'John Doe')
  const [showMobileMenu, setShowMobileMenuInternal] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(true)
  const [notificationCount, setNotificationCount] = useState(3)

  
  const toggleMobileMenu = (show: boolean) => {
    if (setShowMobileMenu) {
      setShowMobileMenu(show)
    } else {
      setShowMobileMenuInternal(show)
    }
  }

  const currentShowMobileMenu = setShowMobileMenu ? false : showMobileMenu

  // Navigation handler
  const handleNavigation = (itemId: string) => {
    setActiveMenuItem(itemId)
    toggleMobileMenu(false)
    
    switch (itemId) {
      case 'dashboard':
        navigate('/dashboard', { state: locationState })
        break
      case 'browse':
        navigate('/browse', { state: locationState })
        break
      case 'trade':
        navigate('/start-trade', { state: locationState })
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

  // Update active menu item when route changes
  useEffect(() => {
    const path = location.pathname
    if (path.includes('browse')) setActiveMenuItem('browse')
    else if (path.includes('trade') || path.includes('escrow') || path.includes('start-trade')) setActiveMenuItem('trade')
    else if (path.includes('transactions')) setActiveMenuItem('transactions')
    else if (path.includes('disputes')) setActiveMenuItem('disputes')
    else if (path.includes('profile')) setActiveMenuItem('profile')
    else setActiveMenuItem('dashboard')
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-[#080909] flex">
      {/* Sidebar */}
      <div className="hidden lg:flex w-64 bg-[#0a0b0c] mt-7 border-r border-gray-900 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-900">
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
              { id: 'browse', label: 'Browse', icon: Search },
              { id: 'trade', label: 'Trade', icon: Shield },
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
        <div className="p-4 space-y-2">
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Disconnect Wallet
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {currentShowMobileMenu && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => toggleMobileMenu(false)}>
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
                onClick={() => toggleMobileMenu(false)}
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
                  { id: 'browse', label: 'Browse', icon: Search },
                  { id: 'trade', label: 'Trade', icon: Shield },
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
            <div className="p-4 space-y-2">
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
        <header className="bg-[#0a0b0c] border-b border-gray-900 px-4 lg:px-8 py-4 lg:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu button */}
              <button 
                onClick={() => toggleMobileMenu(true)}
                className="lg:hidden p-2 text-gray-400 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white mb-1">{pageTitle}</h1>
                <p className="text-gray-400 text-sm lg:text-base">{pageDescription}</p>
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

        {/* Page Content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
