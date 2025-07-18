import { motion } from 'framer-motion'
import { useState } from 'react'
import trustpeerLogo from '../assets/images/trustpeer-logo.png'

const AppLoader = () => {
  const [imageError, setImageError] = useState(false)
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Try fallback to public folder first
    if (!e.currentTarget.src.includes('/trustpeer-logo.png')) {
      e.currentTarget.src = '/trustpeer-logo.png'
    } else {
      // If both sources fail, show text logo
      setImageError(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo with pulse animation */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          {!imageError ? (
            <motion.img
              src={trustpeerLogo}
              alt="TrustPeer Logo"
              onError={handleImageError}
              className="w-24 h-24 mx-auto rounded-2xl shadow-2xl"
              animate={{ 
                scale: [1, 1.05, 1],
                rotateY: [0, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          ) : (
            // Fallback text logo with gradient background
            <motion.div
              className="w-24 h-24 mx-auto rounded-2xl shadow-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
              animate={{ 
                scale: [1, 1.05, 1],
                rotateY: [0, 360]
              }}
              transition={{ 
                scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              <span className="text-white font-bold text-2xl">TP</span>
            </motion.div>
          )}
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-4xl font-bold text-white mb-2 tracking-wide"
        >
          TrustPeer
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-slate-300 text-lg mb-8"
        >
          Secure P2P Trading Platform
        </motion.p>

        {/* Loading animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.4 }}
          className="flex items-center justify-center space-x-2"
        >
          {/* Animated dots */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-3 h-3 bg-blue-500 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.4 }}
          className="text-slate-400 text-sm mt-4"
        >
          Loading your trading experience...
        </motion.p>

        {/* Progress bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
          className="w-64 h-1 bg-slate-700 rounded-full mx-auto mt-6 overflow-hidden"
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }}
          />
        </motion.div>
      </div>
    </div>
  )
}

export default AppLoader
