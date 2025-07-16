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
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-blue-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-emerald-500'
    if (score >= 70) return 'from-blue-500 to-cyan-500'
    if (score >= 50) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  const getScoreBackgroundColor = (score: number) => {
    if (score >= 90) return 'bg-green-500/10'
    if (score >= 70) return 'bg-blue-500/10'
    if (score >= 50) return 'bg-yellow-500/10'
    return 'bg-red-500/10'
  }

  const getScoreBorderColor = (score: number) => {
    if (score >= 90) return 'border-green-500/30'
    if (score >= 70) return 'border-blue-500/30'
    if (score >= 50) return 'border-yellow-500/30'
    return 'border-red-500/30'
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
        whileHover={{ scale: 1.02 }}
        className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 ${className}`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                {profile.username?.charAt(0) || profile.address.charAt(2)}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-white">
                {profile.username || formatAddress(profile.address)}
              </h3>
              <p className="text-sm text-slate-400 font-mono">{formatAddress(profile.address)}</p>
            </div>
          </div>
          <div className={`px-3 py-2 rounded-xl text-sm font-bold ${getScoreBackgroundColor(profile.trustScore)} ${getScoreColor(profile.trustScore)} border ${getScoreBorderColor(profile.trustScore)}`}>
            {profile.trustScore}
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <StarRating
            rating={profile.averageRating}
            size="sm"
            showNumber={true}
            showCount={true}
            count={profile.totalRatings}
          />
          <span className="text-sm text-slate-400">
            {profile.completedTrades} trades
          </span>
        </div>

        {profile.badges.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {profile.badges.slice(0, 2).map((badge, index) => (
              <span
                key={index}
                className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full border border-blue-500/30"
              >
                {badge}
              </span>
            ))}
            {profile.badges.length > 2 && (
              <span className="text-xs text-slate-500">+{profile.badges.length - 2}</span>
            )}
          </div>
        )}

        {/* Action Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-lg"
        >
          Start Trade
        </motion.button>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      className={`bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">
              {profile.username?.charAt(0) || profile.address.charAt(2)}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {profile.username || 'Anonymous Trader'}
            </h2>
            <p className="text-sm text-slate-400 font-mono">
              {formatAddress(profile.address)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-4xl font-bold ${getScoreColor(profile.trustScore)}`}>
            {profile.trustScore}
          </div>
          <div className="text-sm text-slate-400">Trust Score</div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <StarRating
            rating={profile.averageRating}
            size="lg"
            showNumber={true}
            showCount={true}
            count={profile.totalRatings}
          />
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map((stars) => (
            <div key={stars} className="flex items-center gap-4">
              <span className="text-sm text-slate-300 w-8">{stars}★</span>
              <div className="flex-1 bg-slate-700/50 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: profile.totalRatings > 0 
                      ? `${(profile.ratingDistribution[stars as keyof typeof profile.ratingDistribution] / profile.totalRatings) * 100}%`
                      : '0%'
                  }}
                ></div>
              </div>
              <span className="text-sm text-slate-300 w-8">
                {profile.ratingDistribution[stars as keyof typeof profile.ratingDistribution]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Trading Stats */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
          <div className="text-3xl font-bold text-white mb-2">
            {profile.completedTrades}
          </div>
          <div className="text-sm text-slate-400">Completed Trades</div>
        </div>
        <div className="bg-slate-700/30 rounded-2xl p-6 border border-slate-600">
          <div className="text-3xl font-bold text-white mb-2">
            {profile.totalTrades > 0 ? Math.round((profile.completedTrades / profile.totalTrades) * 100) : 0}%
          </div>
          <div className="text-sm text-slate-400">Success Rate</div>
        </div>
      </div>

      {/* Badges */}
      {profile.badges.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-slate-200 mb-4">Achievements</h3>
          <div className="flex flex-wrap gap-3">
            {profile.badges.map((badge, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-gradient-to-r ${getScoreGradient(profile.trustScore)} text-white text-xs px-4 py-2 rounded-full font-medium shadow-lg`}
              >
                {badge}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {/* Member Info */}
      <div className="flex items-center justify-between text-sm text-slate-400 pt-6 border-t border-slate-700">
        <span>Member since {formatDate(profile.joinDate)}</span>
        <span>Last active {formatDate(profile.lastActive)}</span>
      </div>

      {/* Action Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-2xl transition duration-200 shadow-lg"
      >
        Start Trade with {profile.username || 'Trader'}
      </motion.button>
    </motion.div>
  )
}

export default TrustScoreCard
