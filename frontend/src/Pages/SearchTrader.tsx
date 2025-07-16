import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ratingService } from '../Services/rating.service'
import TrustScoreCard from '../Components/TrustScoreCard'
import type { TraderProfile } from '../Services/rating.service'

const SearchTrader = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<TraderProfile[]>([])
  const [topTraders, setTopTraders] = useState<TraderProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSearched, setHasSearched] = useState(false)

  useEffect(() => {
    loadTopTraders()
  }, [])

  const loadTopTraders = async () => {
    try {
      const traders = await ratingService.getTopTraders(6)
      setTopTraders(traders)
    } catch (error) {
      console.error('Failed to load top traders:', error)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim()) {
      setError('Please enter a search term')
      return
    }

    setIsLoading(true)
    setError('')
    setHasSearched(true)

    try {
      const results = await ratingService.searchTraders(searchQuery)
      setSearchResults(results)
      
      if (results.length === 0) {
        setError('No traders found matching your search')
      }
    } catch (error) {
      console.error('Search failed:', error)
      setError(error instanceof Error ? error.message : 'Search failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    setError('')
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setError('')
    setHasSearched(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Find <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Traders</span>
          </h1>
          <p className="text-xl text-slate-300">Discover trusted traders and explore the marketplace</p>
        </motion.div>

        {/* Search Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-16"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-700/50">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  className="w-full pl-14 pr-4 py-4 bg-slate-700/50 border border-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 text-white text-lg placeholder-slate-400"
                  placeholder="Search by username, wallet address, or skill..."
                />
              </div>

              {/* Search Filters */}
              <div className="flex flex-wrap gap-3">
                {['All', 'High Rating', 'New Traders', 'Verified', 'Active'].map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className="px-4 py-2 bg-slate-700/50 hover:bg-slate-600 border border-slate-600 rounded-full text-sm text-slate-300 hover:text-white transition duration-200"
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center"
                >
                  <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-red-300">{error}</span>
                </motion.div>
              )}

              {/* Search Button */}
              <div className="flex gap-4">
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-slate-600 disabled:to-slate-500 text-white font-semibold py-4 px-8 rounded-2xl transition duration-200 shadow-lg flex items-center justify-center text-lg"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Searching...
                    </>
                  ) : (
                    <>
                      <svg className="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Search Traders
                    </>
                  )}
                </motion.button>

                {hasSearched && (
                  <motion.button
                    type="button"
                    onClick={clearSearch}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-8 py-4 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold rounded-2xl transition duration-200"
                  >
                    Clear
                  </motion.button>
                )}
              </div>
            </form>
          </div>
        </motion.div>

        {/* Search Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-16"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Search Results
                {searchResults.length > 0 && (
                  <span className="text-blue-400 ml-3">({searchResults.length})</span>
                )}
              </h2>
              <div className="flex items-center gap-4">
                <span className="text-slate-400">Sort by:</span>
                <select className="bg-slate-700/50 border border-slate-600 rounded-lg px-3 py-2 text-white">
                  <option>Trust Score</option>
                  <option>Recent Activity</option>
                  <option>Trade Volume</option>
                </select>
              </div>
            </div>

            {searchResults.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {searchResults.map((trader) => (
                  <motion.div key={trader.address} variants={itemVariants}>
                    <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200">
                      <TrustScoreCard profile={trader} compact={true} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : !isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No traders found</h3>
                <p className="text-slate-400 text-lg">Try adjusting your search terms or explore our top traders below</p>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Top Traders */}
        {!hasSearched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-white">
                Top <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Traders</span>
              </h2>
              <div className="flex items-center gap-2 text-slate-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Ranked by trust score</span>
              </div>
            </div>

            {topTraders.length > 0 ? (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {topTraders.map((trader, index) => (
                  <motion.div key={trader.address} variants={itemVariants}>
                    <div className="relative bg-slate-800/50 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 transition-all duration-200">
                      {/* Rank Badge */}
                      {index < 3 && (
                        <div className="absolute -top-3 -right-3 z-10">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' : 
                            index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-500' : 
                            'bg-gradient-to-r from-orange-400 to-orange-500'
                          }`}>
                            {index + 1}
                          </div>
                        </div>
                      )}
                      
                      {/* Premium Badge for top trader */}
                      {index === 0 && (
                        <div className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-pulse"></div>
                      )}
                      
                      <TrustScoreCard profile={trader} compact={true} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-20 h-20 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No traders yet</h3>
                <p className="text-slate-400 text-lg mb-6">Be the first to start trading on TrustPeer!</p>
                <Link
                  to="/start-trade"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition duration-200 shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create First Trade
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 bg-slate-800/30 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50"
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">1,234</div>
              <div className="text-slate-400">Active Traders</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">$2.5M</div>
              <div className="text-slate-400">Total Volume</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">5,678</div>
              <div className="text-slate-400">Completed Trades</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-2">99.8%</div>
              <div className="text-slate-400">Success Rate</div>
            </div>
          </div>
        </motion.div>

        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link 
            to="/" 
            className="text-slate-400 hover:text-slate-300 font-medium transition duration-200 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  )
}

export default SearchTrader
