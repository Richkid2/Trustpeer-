import { useState } from 'react'
import { motion } from 'framer-motion'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  showNumber?: boolean
  showCount?: boolean
  count?: number
  onChange?: (rating: number) => void
  className?: string
}

const StarRating = ({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  showNumber = false,
  showCount = false,
  count = 0,
  onChange,
  className = ''
}: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const handleStarClick = (starRating: number) => {
    if (interactive && onChange) {
      onChange(starRating)
    }
  }

  const handleStarHover = (starRating: number) => {
    if (interactive) {
      setHoverRating(starRating)
      setIsHovering(true)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
      setIsHovering(false)
    }
  }

  const displayRating = isHovering ? hoverRating : rating
  const fullStars = Math.floor(displayRating)
  const hasPartialStar = displayRating % 1 !== 0
  const partialStarWidth = (displayRating % 1) * 100

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="flex items-center gap-1"
        onMouseLeave={handleMouseLeave}
      >
        {[...Array(maxRating)].map((_, index) => {
          const starNumber = index + 1
          const isFull = starNumber <= fullStars
          const isPartial = starNumber === fullStars + 1 && hasPartialStar
          
          return (
            <div
              key={index}
              className="relative"
              onMouseEnter={() => handleStarHover(starNumber)}
              onClick={() => handleStarClick(starNumber)}
            >
              <motion.div
                whileHover={interactive ? { scale: 1.1 } : {}}
                whileTap={interactive ? { scale: 0.9 } : {}}
                className={`${sizeClasses[size]} ${
                  interactive ? 'cursor-pointer' : ''
                } transition-colors duration-200`}
              >
                {/* Background star (empty) */}
                <svg
                  className={`${sizeClasses[size]} text-gray-300`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>

                {/* Filled star overlay */}
                {(isFull || isPartial) && (
                  <div
                    className="absolute inset-0 overflow-hidden"
                    style={{
                      width: isPartial ? `${partialStarWidth}%` : '100%'
                    }}
                  >
                    <svg
                      className={`${sizeClasses[size]} text-yellow-400`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}

                {/* Hover effect for interactive stars */}
                {interactive && hoverRating >= starNumber && (
                  <div className="absolute inset-0">
                    <svg
                      className={`${sizeClasses[size]} text-yellow-500`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                )}
              </motion.div>
            </div>
          )
        })}
      </div>

      {/* Rating number */}
      {showNumber && (
        <span className={`font-medium text-gray-700 ${textSizeClasses[size]}`}>
          {rating.toFixed(1)}
        </span>
      )}

      {/* Rating count */}
      {showCount && count > 0 && (
        <span className={`text-gray-500 ${textSizeClasses[size]}`}>
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}

      {/* Interactive rating display */}
      {interactive && isHovering && (
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`text-yellow-600 font-medium ${textSizeClasses[size]}`}
        >
          {hoverRating} star{hoverRating !== 1 ? 's' : ''}
        </motion.span>
      )}
    </div>
  )
}

export default StarRating
