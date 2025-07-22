import { useState } from 'react'
import { motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { 
  Star, 
  Edit,
  Mail,
  MapPin,
  Shield,
  Award,
  Phone,
  Globe,
  Copy,
  ExternalLink
} from 'lucide-react'
import DashboardLayout from '../Components/Layout/DashboardLayout'

interface LocationState {
  username?: string
  onboardingComplete?: boolean
  telegramAdded?: boolean
  telegramHandle?: string
  telegramSkipped?: boolean
  skippedTelegram?: boolean
  email?: string
  registrationMethod?: 'email' | 'wallet'
}

interface UserProfile {
  username: string
  email?: string
  walletAddress?: string
  telegramHandle?: string
  joinedDate: string
  location: string
  timezone: string
  registrationMethod: 'email' | 'wallet'
  verified: boolean
  trustScore: number
  totalTrades: number
  completedTrades: number
  disputeRate: number
  avgRating: number
  totalRatings: number
  badges: string[]
  languages: string[]
  preferredPaymentMethods: string[]
  bio: string
}

const Profile = () => {
  const location = useLocation()
  const locationState = (location.state as LocationState) || {}
  const [username] = useState(locationState.username || 'John Doe')

  // Mock user profile data based on registration method
  const userProfile: UserProfile = {
    username: username,
    email: locationState.email || 'john.doe@example.com',
    walletAddress: locationState.registrationMethod === 'wallet' ? '0x742d35Cc6634C0532925a3b8D404e0DbE3f7dc90' : undefined,
    telegramHandle: locationState.telegramHandle || (locationState.telegramAdded ? '@johndoe_trader' : undefined),
    joinedDate: 'November 2025',
    location: 'Lagos, Nigeria',
    timezone: 'GMT+1',
    registrationMethod: locationState.registrationMethod || 'email',
    verified: true,
    trustScore: 4.5,
    totalTrades: 47,
    completedTrades: 45,
    disputeRate: 2.1,
    avgRating: 4.8,
    totalRatings: 38,
    badges: ['Verified Trader', 'Quick Responder', 'Trusted Member'],
    languages: ['English', 'Yoruba'],
    preferredPaymentMethods: ['Bank Transfer', 'Mobile Money', 'PayPal'],
    bio: 'Experienced crypto trader with a focus on secure and fast transactions. Been trading for over 2 years with excellent reputation.'
  }

  // Copy to clipboard
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      console.log(`${label} copied to clipboard`)
      // Here you could show a toast notification
    })
  }

  // Calculate completion rate
  const completionRate = userProfile.totalTrades > 0 
    ? ((userProfile.completedTrades / userProfile.totalTrades) * 100).toFixed(1)
    : '0'

  return (
    <DashboardLayout 
      pageTitle="Profile" 
      pageDescription="Manage your account and trading preferences"
    >
      <div className="p-4 lg:p-8 space-y-6 lg:space-y-8">
        {/* Profile Header */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Profile Info */}
          <div className="xl:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl lg:text-2xl font-bold">
                      {userProfile.username.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h1 className="text-lg lg:text-2xl font-bold text-white">{userProfile.username}</h1>
                      {userProfile.verified && (
                        <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-blue-500" />
                      )}
                    </div>
                    <p className="text-gray-400 text-sm lg:text-base">Member since {userProfile.joinedDate}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-3 h-3 lg:w-4 lg:h-4 text-gray-500" />
                      <span className="text-gray-400 text-xs lg:text-sm">{userProfile.location}</span>
                    </div>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => console.log('Edit profile clicked')}
                  className="flex items-center gap-2 px-3 py-2 lg:px-4 lg:py-2 bg-[#ee5f0a] hover:bg-[#d54f08] text-white rounded-lg transition-colors text-sm w-full sm:w-auto justify-center"
                >
                  <Edit className="w-4 h-4" />
                  Edit Profile
                </motion.button>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-white">Contact Information</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-400 text-xs lg:text-sm">Email</p>
                        <p className="text-white text-sm lg:text-base truncate">{userProfile.email}</p>
                      </div>
                      <button
                        onClick={() => copyToClipboard(userProfile.email || '', 'Email')}
                        className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    {userProfile.telegramHandle && (
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-400 text-xs lg:text-sm">Telegram</p>
                          <p className="text-white text-sm lg:text-base truncate">{userProfile.telegramHandle}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(userProfile.telegramHandle || '', 'Telegram')}
                          className="p-2 text-gray-400 hover:text-white transition-colors flex-shrink-0"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    {userProfile.walletAddress && (
                      <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                        <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-400 text-xs lg:text-sm">Wallet Address</p>
                          <p className="text-white font-mono text-xs lg:text-sm truncate">
                            {userProfile.walletAddress}
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={() => copyToClipboard(userProfile.walletAddress || '', 'Wallet Address')}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <Copy className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => window.open(`https://etherscan.io/address/${userProfile.walletAddress}`, '_blank')}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-lg">
                      <Globe className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-400 text-xs lg:text-sm">Timezone</p>
                        <p className="text-white text-sm lg:text-base">{userProfile.timezone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio Section */}
              <div className="mt-6 pt-6 border-t border-gray-800">
                <h3 className="text-base lg:text-lg font-semibold text-white mb-3">About</h3>
                <p className="text-gray-300 text-sm lg:text-base leading-relaxed">
                  {userProfile.bio}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Trust Score & Stats */}
          <div className="space-y-6">
            {/* Trust Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <div className="text-center mb-4">
                <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-3">
                  <span className="text-white text-xl lg:text-2xl font-bold">
                    {userProfile.trustScore.toFixed(1)}
                  </span>
                </div>
                <h3 className="text-base lg:text-lg font-semibold text-white">Trust Score</h3>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 lg:w-4 lg:h-4 ${
                        i < Math.floor(userProfile.trustScore)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-xs lg:text-sm ml-2">
                    ({userProfile.totalRatings})
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Trading Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Trading Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm lg:text-base">Total Trades</span>
                  <span className="text-white font-semibold text-sm lg:text-base">{userProfile.totalTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm lg:text-base">Completed</span>
                  <span className="text-green-500 font-semibold text-sm lg:text-base">{userProfile.completedTrades}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm lg:text-base">Success Rate</span>
                  <span className="text-white font-semibold text-sm lg:text-base">{completionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm lg:text-base">Dispute Rate</span>
                  <span className="text-red-400 font-semibold text-sm lg:text-base">{userProfile.disputeRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400 text-sm lg:text-base">Avg Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold text-sm lg:text-base">{userProfile.avgRating}</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
            >
              <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Achievements</h3>
              <div className="space-y-3">
                {userProfile.badges.map((badge, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 lg:w-8 lg:h-8 bg-yellow-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Award className="w-3 h-3 lg:w-4 lg:h-4 text-yellow-500" />
                    </div>
                    <span className="text-white text-xs lg:text-sm">{badge}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Additional Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Languages */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
          >
            <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.languages.map((language, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs lg:text-sm"
                >
                  {language}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Payment Methods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6"
          >
            <h3 className="text-base lg:text-lg font-semibold text-white mb-4">Preferred Payment Methods</h3>
            <div className="flex flex-wrap gap-2">
              {userProfile.preferredPaymentMethods.map((method, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs lg:text-sm"
                >
                  {method}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Profile
