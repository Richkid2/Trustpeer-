import { Link } from 'react-router-dom'

const SearchTrader = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Search Trader</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search by Username or Address
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter trader username or wallet address"
            />
          </div>
          
          <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 mb-4">
            Search
          </button>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-4">Search Results</h3>
            <div className="space-y-2">
              <div className="p-3 border border-gray-200 rounded-md">
                <p className="font-medium">No traders found</p>
                <p className="text-sm text-gray-600">Try a different search term</p>
              </div>
            </div>
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

export default SearchTrader
