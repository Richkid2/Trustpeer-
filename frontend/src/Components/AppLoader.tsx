import { motion } from 'framer-motion'
import { useState } from 'react'
import trustpeerLogo from '../assets/images/trustpeer-logo.png'

const AppLoader = () => {
  const [imageError, setImageError] = useState(false)
  
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!e.currentTarget.src.includes('/trustpeer-logo.png')) {
      e.currentTarget.src = '/trustpeer-logo.png'
    } else {
      setImageError(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 flex items-center justify-center z-50 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo with enhanced animations */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0, rotateY: -180 }}
          animate={{ scale: 1, opacity: 1, rotateY: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          {!imageError ? (
            <motion.div className="relative">
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl scale-150"></div>
              
              <motion.img
                src={trustpeerLogo}
                alt="TrustPeer Logo"
                onError={handleImageError}
                className="relative w-32 h-32 mx-auto rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-white/10"
                animate={{ 
                  scale: [1, 1.08, 1],
                  rotateY: [0, 10, -10, 0],
                  boxShadow: [
                    "0 20px 60px rgba(0,0,0,0.4)",
                    "0 25px 80px rgba(59, 130, 246, 0.3), 0 0 40px rgba(147, 51, 234, 0.2)",
                    "0 20px 60px rgba(0,0,0,0.4)"
                  ]
                }}
                transition={{ 
                  scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                  rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                  boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                }}
              />
            </motion.div>
          ) : (
            // Enhanced fallback with futuristic styling
            <motion.div
              className="relative w-32 h-32 mx-auto rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] bg-gradient-to-br from-blue-600 via-purple-600 to-cyan-500 flex items-center justify-center border border-white/10 overflow-hidden"
              animate={{ 
                scale: [1, 1.08, 1],
                rotateY: [0, 10, -10, 0],
                boxShadow: [
                  "0 20px 60px rgba(0,0,0,0.4)",
                  "0 25px 80px rgba(59, 130, 246, 0.4), 0 0 40px rgba(147, 51, 234, 0.3)",
                  "0 20px 60px rgba(0,0,0,0.4)"
                ]
              }}
              transition={{ 
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotateY: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
            >
              {/* Animated background gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 animate-pulse"></div>
              <span className="relative text-white font-kansas-black text-3xl">TP</span>
            </motion.div>
          )}
        </motion.div>

        {/* Brand name with gradient text */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
          className="text-5xl font-kansas-black mb-3 tracking-wide"
        >
          <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-400 bg-clip-text text-transparent">
            TrustPeer
          </span>
        </motion.h1>

        {/* Tagline with enhanced styling */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
          className="text-slate-300 text-xl mb-12 font-kansas-light max-w-md mx-auto leading-relaxed"
        >
          Next-Generation P2P Trading Platform
        </motion.p>

        {/* Enhanced loading animation */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col items-center justify-center space-y-6"
        >
          {/* Modern loading indicator */}
          <div className="flex items-center space-x-3">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                className="w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 1, 0.3],
                  boxShadow: [
                    "0 0 0 rgba(59, 130, 246, 0)",
                    "0 0 20px rgba(59, 130, 246, 0.6)",
                    "0 0 0 rgba(59, 130, 246, 0)"
                  ]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  delay: index * 0.3,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
          
          {/* Loading text */}
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-slate-400 font-kansas-light text-sm tracking-wide"
          >
            Initializing secure connections...
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-slate-700/30">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-400"
              animate={{ 
                x: ["-100%", "100%"],
                opacity: [0.6, 1, 0.6]
              }}
              transition={{ 
                x: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default AppLoader
