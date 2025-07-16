import { motion } from 'framer-motion'
import StarRating from './StarRating'
import type { TraderProfile } from '../Services/rating.service'

interface TrustScoreCardProps {
  profile: TraderProfile
  compact?: boolean
  className?: string
}

const TrustScoreCard = ({ profile, compact = false, className = '' }: TrustScoreCardProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-blue-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 70) return 'bg-blue-100'
    if (score >= 50) return 'bg-yellow-100'
    return 'bg-red-100'
  }

  const getScoreBorderColor = (score: number) => {
    if (score >= 90) return 'border-green-200'
    if (score >= 70) return 'border-blue-200'
    if (score >= 50) return 'border-yellow-200'
    return 'border-red-200'
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short'
    })
  }

  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-white rounded-lg shadow-md p-4 border border-gray-200 ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-gray-800">
              {profile.username || formatAddress(profile.address)}
            </h3>
            <p className="text-sm text-gray-500">{formatAddress(profile.address)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${getScoreBackgroundColor(profile.trustScore)} ${getScoreColor(profile.trustScore)}`}>
            {profile.trustScore}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <StarRating
            rating={profile.averageRating}
            size="sm"
            showNumber={true}
            showCount={true}
            count={profile.totalRatings}
          />
          <span className="text-sm text-gray-500">
            {profile.completedTrades} trades
          </span>
        </div>

        {profile.badges.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.badges.slice(0, 2).map((badge, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
              >
                {badge}
              </span>
            ))}
            {profile.badges.length > 2 && (
              <span className="text-xs text-gray-500">+{profile.badges.length - 2}</span>
            )}
          </div>
        )}
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-2xl shadow-lg p-6 border ${getScoreBorderColor(profile.trustScore)} ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {profile.username || 'Anonymous Trader'}
          </h2>
          <p className="text-sm text-gray-500 font-mono">
            {formatAddress(profile.address)}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-3xl font-bold ${getScoreColor(profile.trustScore)}`}>
            {profile.trustScore}
          </div>
          <div className="text-sm text-gray-500">Trust Score</div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <StarRating
            rating={profile.averageRating}
            size="lg"
            showNumber={true}
            showCount={true}
            count={profile.totalRatings}
          />
        </div>

        {/* Rating Distribution */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-2">
              <span className="text-sm text-gray-600 w-8">{stars}★</span>
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: profile.totalRatings > 0 
                      ? `${(profile.ratingDistribution[stars as keyof typeof profile.ratingDistribution] / profile.totalRatings) * 100}%`
                      : '0%'
                  }}
                ></div>
              </div>
              <span className="text-sm text-gray-600 w-8">
                {profile.ratingDistribution[stars as keyof typeof profile.ratingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-800">
            {profile.completedTrades}
          </div>
          <div className="text-sm text-gray-600">Completed Trades</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-2xl font-bold text-gray-800">
            {profile.totalTrades > 0 ? Math.round((profile.completedTrades / profile.totalTrades) * 100) : 0}%
          </div>
          <div className="text-sm text-gray-600">Success Rate</div>
        </div>
      </div>

      {/* Badges */}
      {profile.badges.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Achievements</h3>
          <div className="flex flex-wrap gap-2">
            {profile.badges.map((badge, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium"
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Member Info */}
      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
        <span>Member since {formatDate(profile.joinDate)}</span>
        <span>Last active {formatDate(profile.lastActive)}</span>
      </div>
    </motion.div>
  )
}

export default TrustScoreCard
