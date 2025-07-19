import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  Search,
  Filter,
  Star,
  Shield,
  TrendingUp,
  Users,
  Award,
  Zap,
  Eye
} from 'lucide-react'
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
  const [selectedFilter, setSelectedFilter] = useState('All')

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

  const filters = [
    { name: 'All', icon: Users },
    { name: 'High Rating', icon: Star },
    { name: 'New Traders', icon: TrendingUp },
    { name: 'Verified', icon: Shield },
    { name: 'Active', icon: Zap }
  ]

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

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <motion.h1 
              className="text-5xl md:text-6xl font-kansas-black bg-gradient-to-r from-white via-cyan-200 to-purple-400 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Find <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text">Traders</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-400 font-kansas-light max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Discover trusted traders and explore the <span className="text-cyan-400 font-kansas-medium">decentralized marketplace</span>
            </motion.p>
          </motion.div>

          {/* Search Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="max-w-4xl mx-auto mb-16"
          >
            <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-8 border border-slate-700/50">
              <form onSubmit={handleSearch} className="space-y-8">
                {/* Search Input */}
                <div className="relative group">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-y-0 left-6 flex items-center pointer-events-none"
                  >
                    <Search className="w-6 h-6 text-cyan-400" />
                  </motion.div>
                  <motion.input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    whileFocus={{ scale: 1.01, boxShadow: "0 0 30px rgba(6, 182, 212, 0.3)" }}
                    className="w-full pl-16 pr-6 py-5 bg-gradient-to-r from-slate-700/30 to-slate-800/50 border border-slate-600/50 rounded-3xl focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-white text-lg font-kansas-medium placeholder-slate-500 backdrop-blur-sm"
                    placeholder="Search by username, wallet address, or skill..."
                  />
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-focus-within:from-cyan-500/5 group-focus-within:to-blue-500/5 transition-all duration-500 pointer-events-none"></div>
                </div>

                {/* Filters */}
                <motion.div 
                  className="space-y-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center mb-4">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-3"
                    >
                      <Filter className="w-3 h-3 text-white" />
                    </motion.div>
                    <span className="text-lg font-kansas-bold text-slate-200">Filter Traders</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-3">
                    {filters.map((filter, index) => {
                      const IconComponent = filter.icon
                      return (
                        <motion.button
                          key={filter.name}
                          type="button"
                          onClick={() => setSelectedFilter(filter.name)}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.9 + index * 0.1 }}
                          className={`group relative px-6 py-3 rounded-2xl font-kansas-medium transition-all duration-300 flex items-center space-x-2 ${
                            selectedFilter === filter.name
                              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)] border border-cyan-400/20'
                              : 'bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl text-slate-300 hover:text-white border border-slate-600/50 hover:border-cyan-500/30'
                          }`}
                        >
                          {selectedFilter === filter.name && (
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-2xl animate-pulse"></div>
                          )}
                          <IconComponent className="w-4 h-4 relative z-10" />
                          <span className="relative z-10">{filter.name}</span>
                        </motion.button>
                      )
                    })}
                  </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-5 flex items-center backdrop-blur-sm"
                  >
                    <motion.svg 
                      className="w-6 h-6 text-red-400 mr-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </motion.svg>
                    <span className="text-red-300 font-kansas-medium">{error}</span>
                  </motion.div>
                )}

                {/* Search Actions */}
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={!isLoading ? { 
                      scale: 1.02, 
                      boxShadow: "0 20px 40px -12px rgba(6, 182, 212, 0.4), 0 0 30px rgba(6, 182, 212, 0.3)",
                      y: -2
                    } : {}}
                    whileTap={{ scale: 0.98 }}
                    className="group relative flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-600 disabled:to-slate-700 text-white font-kansas-bold py-4 px-6 rounded-2xl transition-all duration-300 border border-cyan-400/20 overflow-hidden"
                  >
                    {!isLoading && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Searching...
                        </>
                      ) : (
                        <>
                          <Search className="w-5 h-5" />
                          Search Traders
                        </>
                      )}
                    </span>
                  </motion.button>
                  
                  {hasSearched && (
                    <motion.button
                      type="button"
                      onClick={clearSearch}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-br from-slate-700/60 to-slate-800/80 backdrop-blur-xl hover:from-slate-600/70 hover:to-slate-700/90 text-slate-200 font-kansas-medium py-4 px-6 rounded-2xl transition-all duration-300 border border-slate-600/50 hover:border-slate-500/70"
                    >
                      Clear
                    </motion.button>
                  )}
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Results Section */}
          {hasSearched ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center mb-8">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mr-4"
                >
                  <Eye className="w-4 h-4 text-white" />
                </motion.div>
                <h2 className="text-2xl font-kansas-bold text-white">
                  Search Results ({searchResults.length})
                </h2>
              </div>

              {searchResults.length > 0 ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {searchResults.map((trader, index) => (
                    <motion.div
                      key={trader.address}
                      variants={itemVariants}
                      whileHover={{ scale: 1.02, y: -5 }}
                      className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="text-center">
                        <motion.div 
                          className="w-16 h-16 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                          animate={{ rotate: [0, 5, -5, 0] }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                        >
                          <span className="text-white text-xl font-kansas-black">
                            {trader.address.slice(0, 2).toUpperCase()}
                          </span>
                        </motion.div>
                        <h3 className="font-kansas-bold text-white text-lg mb-2">
                          {formatAddress(trader.address)}
                        </h3>
                        <div className="flex items-center justify-center space-x-2 mb-4">
                          <Star className="w-4 h-4 text-yellow-400" />
                          <span className="text-yellow-400 font-kansas-bold">{trader.averageRating.toFixed(1)}</span>
                          <span className="text-slate-400 text-sm">({trader.totalRatings} reviews)</span>
                        </div>
                        <TrustScoreCard profile={trader} compact={true} />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mt-4 w-full bg-gradient-to-r from-cyan-600/20 to-blue-600/20 hover:from-cyan-600/30 hover:to-blue-600/30 text-cyan-300 font-kansas-medium py-2 px-4 rounded-xl transition-all duration-300 border border-cyan-500/30"
                        >
                          View Profile
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="w-12 h-12 text-slate-500" />
                  </div>
                  <h3 className="text-xl font-kansas-bold text-slate-300 mb-2">No traders found</h3>
                  <p className="text-slate-500 font-kansas-light">Try adjusting your search terms or filters</p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            /* Top Traders Section */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex items-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mr-4"
                >
                  <Award className="w-4 h-4 text-white" />
                </motion.div>
                <h2 className="text-2xl font-kansas-bold text-white">Top Rated Traders</h2>
              </div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {topTraders.map((trader, index) => (
                  <motion.div
                    key={trader.address}
                    variants={itemVariants}
                    whileHover={{ scale: 1.02, y: -5 }}
                    className="group bg-gradient-to-br from-slate-800/40 to-slate-900/60 backdrop-blur-2xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-6 border border-slate-700/50 hover:border-yellow-500/30 transition-all duration-300 relative overflow-hidden"
                  >
                    {index < 3 && (
                      <div className="absolute top-4 right-4">
                        <motion.div 
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            index === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                            index === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-400' :
                            'bg-gradient-to-r from-orange-400 to-orange-500'
                          } shadow-lg`}
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        >
                          <span className="text-white text-sm font-kansas-black">#{index + 1}</span>
                        </motion.div>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <motion.div 
                        className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                      >
                        <span className="text-white text-xl font-kansas-black">
                          {trader.address.slice(0, 2).toUpperCase()}
                        </span>
                      </motion.div>
                      <h3 className="font-kansas-bold text-white text-lg mb-2">
                        {formatAddress(trader.address)}
                      </h3>
                      <div className="flex items-center justify-center space-x-2 mb-4">
                        <motion.div
                          animate={{ rotate: [0, 360] }}
                          transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
                        >
                          <Star className="w-4 h-4 text-yellow-400" />
                        </motion.div>
                        <span className="text-yellow-400 font-kansas-bold">{trader.averageRating.toFixed(1)}</span>
                        <span className="text-slate-400 text-sm">({trader.totalRatings} reviews)</span>
                      </div>
                      <TrustScoreCard profile={trader} compact={true} />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="mt-4 w-full bg-gradient-to-r from-yellow-600/20 to-orange-600/20 hover:from-yellow-600/30 hover:to-orange-600/30 text-yellow-300 font-kansas-medium py-2 px-4 rounded-xl transition-all duration-300 border border-yellow-500/30"
                      >
                        View Profile
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-16"
          >
            <Link to="/">
              <motion.button
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)",
                  y: -2
                }}
                whileTap={{ scale: 0.95 }}
                className="group flex items-center text-cyan-400 hover:text-cyan-300 font-kansas-medium transition-all duration-300 mx-auto"
              >
                <motion.svg 
                  className="w-5 h-5 mr-2 group-hover:text-cyan-300 transition-colors" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </motion.svg>
                Back to Dashboard
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default SearchTrader
