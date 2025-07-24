import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Star
} from 'lucide-react'
import DashboardLayout from '../Components/Layout/DashboardLayout'

const RateTrader = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  // Get trade details from URL params
  const tradeId = searchParams.get('tradeId') || 'TP1348A'
  const traderName = searchParams.get('traderName') || 'Cryptoface'
  
  // States
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showThankYou, setShowThankYou] = useState(false)

  const handleStarClick = (starValue: number) => {
    setRating(starValue)
  }

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  const handleSubmit = async () => {
    if (rating === 0) {
      return
    }

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setShowThankYou(true)
      
      // Auto-close thank you modal after 3 seconds
      setTimeout(() => {
        navigate('/dashboard')
      }, 3000)
    }, 2000)
  }

  const handleSkip = () => {
    navigate('/dashboard')
  }

  return (
    <DashboardLayout 
      pageTitle="Escrow" 
      pageDescription={tradeId}
    >
      {/* Rating Modal */}
      {!showThankYou && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f1011] rounded-xl border border-white/10 p-6 w-full max-w-md mx-4"
          >
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-lg font-semibold text-white mb-2">Rate this Trader</h2>
              <p className="text-white/70 text-sm">
                How was your transaction with {traderName}?<br />
                Your feedback helps build a trusted community.
              </p>
            </div>

            {/* Trader Info */}
            <div className="flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-[#ee5f0a] rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-medium">
                  {traderName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{traderName}</p>
                <p className="text-white/50 text-sm">@cryptoface</p>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex justify-center mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-[#ee5f0a] text-[#ee5f0a]'
                        : 'text-gray-400'
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Comment Section */}
            <div className="mb-6">
              <label className="block text-white/70 text-sm mb-2">
                Drop a review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Enter your review..."
                className="w-full bg-[#1a1b1c] border border-white/10 rounded-lg p-3 text-white placeholder-white/50 text-sm resize-none focus:outline-none focus:border-[#ee5f0a]/50"
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 bg-transparent border border-white/20 text-white/70 py-2.5 px-4 rounded-lg hover:bg-white/5 transition-colors text-sm"
              >
                Skip for Now
              </button>
              <motion.button
                onClick={handleSubmit}
                disabled={rating === 0 || isSubmitting}
                whileHover={{ scale: rating > 0 ? 1.02 : 1 }}
                whileTap={{ scale: rating > 0 ? 0.98 : 1 }}
                className={`flex-1 py-2.5 px-4 rounded-lg font-medium text-sm transition-all ${
                  rating > 0
                    ? 'bg-[#ee5f0a] hover:bg-[#d54f08] text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Review'}
              </motion.button>
            </div>

            {/* Footer */}
            <div className="text-center mt-4">
              <p className="text-white/50 text-xs">
                🔒Your rating will be visible on this trader’s profile.
              </p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Thank You Modal */}
      {showThankYou && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#0f1011] rounded-xl border border-white/10 p-8 w-full max-w-md mx-4 text-center"
          >
            {/* Success Icon */}
            <div className="w-16 h-16 bg-[#ee5f0a] rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            {/* Thank You Message */}
            <h2 className="text-xl font-semibold text-white mb-3">
              Thank You for Your Feedback!
            </h2>
            
            <p className="text-white/70 text-sm mb-6 leading-relaxed">
              Your rating helps us build a trust and help TrustPeer community on 
              Trust Peer We appreciate you taking the time to share your experience.
            </p>

            {/* Return to Dashboard Button */}
            <motion.button
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-[#ee5f0a] hover:bg-[#d54f08] text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Return to Dashboard
            </motion.button>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default RateTrader
