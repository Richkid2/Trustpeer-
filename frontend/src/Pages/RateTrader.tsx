import { Link } from 'react-router-dom'
import { useState } from 'react'

const RateTrader = () => {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleStarClick = (value: number) => {
    setRating(value)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Rate Your Trading Partner</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Trade Completed Successfully!</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-green-800">
                  Funds have been released and the trade is complete!
                </p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Rate Your Experience</h3>
            <div className="flex items-center justify-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  className={`text-3xl transition-colors duration-200 ${
                    star <= rating ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-600">
              {rating === 0 && 'Click a star to rate'}
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </p>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Leave a comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Share your experience with this trader..."
            />
          </div>
          
          <div className="space-y-3">
            <button 
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
              disabled={rating === 0}
            >
              Submit Rating
            </button>
            
            <Link 
              to="/"
              className="w-full bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 block text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default RateTrader
