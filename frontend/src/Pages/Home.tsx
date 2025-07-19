import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Zap, Shield, Lock, MessageCircle } from "lucide-react";
import { multiWalletService } from "../Services/wallet.service";
import type { MultiWalletState } from "../Services/wallet.service";

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [walletState, setWalletState] = useState<MultiWalletState>(
    multiWalletService.getState()
  );
  const fullText = "Trade Crypto";

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setDisplayText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTypingComplete(true);
        clearInterval(timer);
      }
    }, 100);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Check wallet connection status
    const checkWalletConnection = () => {
      setWalletState(multiWalletService.getState());
    };

    checkWalletConnection();

    // wallet connection changes
    const interval = setInterval(checkWalletConnection, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 border-b border-slate-700/30 backdrop-blur-2xl bg-slate-900/20"
      >
        <div className="w-full px-4 md:px-6 lg:px-16 xl:px-24">
          <div className="flex justify-between items-center py-6">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
              className="flex items-center space-x-4"
            >
              <div className="relative group">
                <motion.img
                  src="/trustpeer-logo.png"
                  alt="TrustPeer"
                  className="h-12 w-auto relative z-10"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-blue-600/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
              </div>
              <motion.span 
                className="text-3xl font-kansas-bold bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                TrustPeer
              </motion.span>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="hidden md:block"
            >
              {walletState.isConnected ? (
                <div className="flex items-center space-x-6">
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-900/50 to-emerald-900/50 border border-green-500/30 rounded-2xl backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div className="text-green-300 text-sm font-kansas-medium">
                      {walletState.primaryWallet?.type} Connected
                    </div>
                  </motion.div>
                  <Link to="/dashboard">
                    <motion.button
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)",
                        y: -2
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 border border-blue-400/20 overflow-hidden"
                    >
                      {/* Shine effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                      <span className="relative z-10">Dashboard</span>
                    </motion.button>
                  </Link>
                </div>
              ) : (
                <Link to="/login">
                  <motion.button
                    whileHover={{ 
                      scale: 1.05, 
                      boxShadow: "0 20px 40px -12px rgba(59, 130, 246, 0.4), 0 0 30px rgba(59, 130, 246, 0.3)",
                      y: -2
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-kansas-bold py-4 px-8 rounded-2xl transition-all duration-300 border border-blue-400/20 overflow-hidden"
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                    
                    <span className="relative z-10 flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      >
                        🚀
                      </motion.span>
                      Connect Wallet
                    </span>
                  </motion.button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>
      </motion.header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-600/20"
        />

        {/* Floating animation elements */}
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-4 h-4 bg-orange-500 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [20, -20, 20],
            rotate: [360, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-40 right-32 w-6 h-6 bg-red-600 rounded-full blur-sm"
        />
        <motion.div
          animate={{
            y: [-30, 30, -30],
            x: [-10, 10, -10],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-32 left-1/3 w-3 h-3 bg-white rounded-full blur-sm"
        />

        <motion.div
          animate={{
            y: [-40, 40, -40],
            x: [15, -15, 15],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-60 left-1/4 w-2 h-2 bg-emerald-400 rounded-full blur-sm opacity-60"
        />
        <motion.div
          animate={{
            y: [25, -25, 25],
            x: [-20, 20, -20],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-80 right-20 w-5 h-5 bg-purple-500 rounded-full blur-sm opacity-50"
        />
        <motion.div
          animate={{
            y: [-35, 35, -35],
            rotate: [180, 0, 180],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-60 right-1/4 w-3 h-3 bg-blue-400 rounded-full blur-sm opacity-70"
        />
        <motion.div
          animate={{
            y: [30, -30, 30],
            x: [10, -10, 10],
            scale: [1, 0.5, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/2 left-10 w-4 h-4 bg-yellow-400 rounded-full blur-sm opacity-40"
        />
        <motion.div
          animate={{
            y: [-25, 25, -25],
            x: [-15, 15, -15],
            rotate: [0, 270, 360],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/3 right-10 w-3 h-3 bg-pink-400 rounded-full blur-sm opacity-50"
        />
        <motion.div
          animate={{
            y: [40, -40, 40],
            scale: [0.6, 1.4, 0.6],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-80 left-1/2 w-2 h-2 bg-cyan-400 rounded-full blur-sm opacity-60"
        />
        <motion.div
          animate={{
            y: [-45, 45, -45],
            x: [20, -20, 20],
            rotate: [90, 270, 450],
          }}
          transition={{
            duration: 24,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-96 left-3/4 w-6 h-6 bg-indigo-400 rounded-full blur-sm opacity-30"
        />
        <motion.div
          animate={{
            y: [15, -15, 15],
            x: [-25, 25, -25],
            scale: [1.2, 0.8, 1.2],
          }}
          transition={{
            duration: 13,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-40 right-1/3 w-4 h-4 bg-teal-400 rounded-full blur-sm opacity-45"
        />
        <motion.div
          animate={{
            y: [-20, 20, -20],
            rotate: [0, 360, 720],
          }}
          transition={{
            duration: 19,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-72 left-1/2 w-3 h-3 bg-lime-400 rounded-full blur-sm opacity-55"
        />
        <motion.div
          animate={{
            y: [35, -35, 35],
            x: [12, -12, 12],
            scale: [0.7, 1.3, 0.7],
          }}
          transition={{
            duration: 17,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-96 left-20 w-5 h-5 bg-rose-400 rounded-full blur-sm opacity-40"
        />
        <motion.div
          animate={{
            y: [-50, 50, -50],
            x: [-30, 30, -30],
            rotate: [45, 225, 405],
          }}
          transition={{
            duration: 26,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-48 right-1/2 w-2 h-2 bg-amber-400 rounded-full blur-sm opacity-65"
        />
        <motion.div
          animate={{
            y: [22, -22, 22],
            scale: [1.1, 0.9, 1.1],
          }}
          transition={{
            duration: 21,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 left-2/3 w-3 h-3 bg-violet-400 rounded-full blur-sm opacity-50"
        />
        <motion.div
          animate={{
            y: [-28, 28, -28],
            x: [18, -18, 18],
            rotate: [120, 240, 360],
          }}
          transition={{
            duration: 23,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-36 left-3/5 w-4 h-4 bg-slate-400 rounded-full blur-sm opacity-35"
        />
        <motion.div
          animate={{
            y: [32, -32, 32],
            x: [-22, 22, -22],
            scale: [0.9, 1.1, 0.9],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-72 right-2/3 w-6 h-6 bg-orange-300 rounded-full blur-sm opacity-25"
        />

        <div className="relative z-10 w-full px-4 md:px-6 lg:px-16 xl:px-24">
          <div className="text-center max-w-6xl mx-auto">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-8 leading-tight"
            >
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
              <br />
              {isTypingComplete && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent"
                >
                  Safely
                </motion.span>
              )}
            </motion.h1>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-8 justify-center items-center mb-20"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.4), 0 0 40px rgba(59, 130, 246, 0.3)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  to="/search-trader"
                  className="relative block bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-kansas-bold py-6 px-12 rounded-2xl text-xl transition-all duration-500 shadow-2xl border border-blue-400/20 overflow-hidden min-w-[280px] text-center"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 group-hover:animate-pulse transition-all duration-700"></div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                      className="text-2xl"
                    >
                      🔍
                    </motion.span>
                    Find Traders
                  </div>
                  
                  {/* Particle effects */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-2 right-4 w-1 h-1 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-3 left-6 w-1 h-1 bg-cyan-200 rounded-full animate-ping delay-300"></div>
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 20px 40px -12px rgba(148, 163, 184, 0.3), 0 0 30px rgba(148, 163, 184, 0.2)",
                  y: -5
                }}
                whileTap={{ scale: 0.95 }}
                className="group"
              >
                <Link
                  to="/start-trade"
                  className="relative block bg-gradient-to-br from-slate-800/60 to-slate-900/80 backdrop-blur-xl border-2 border-slate-600/50 hover:border-slate-400/70 text-white font-kansas-bold py-6 px-12 rounded-2xl text-xl transition-all duration-500 shadow-lg min-w-[280px] text-center overflow-hidden"
                >
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 transition-all duration-700"></div>
                  
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    <motion.span
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="text-2xl"
                    >
                      🚀
                    </motion.span>
                    Start Trade
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="relative max-w-6xl mx-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-600/5 to-orange-500/5 rounded-3xl blur-3xl"></div>

              <div className="relative bg-gradient-to-r from-white/5 to-white/10 backdrop-blur-sm border border-white/10 rounded-3xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  {[
                    {
                      value: "<1s",
                      label: "Transaction Speed",
                      icon: Zap,
                      color: "from-emerald-400 to-emerald-600",
                      bgColor: "bg-emerald-500/10",
                      borderColor: "border-emerald-500/20",
                    },
                    {
                      value: "100%",
                      label: "Security Rate",
                      icon: Shield,
                      color: "from-orange-400 to-orange-600",
                      bgColor: "bg-orange-500/10",
                      borderColor: "border-orange-500/20",
                    },
                    {
                      value: "0",
                      label: "Scams Reported",
                      icon: Lock,
                      color: "from-red-400 to-red-600",
                      bgColor: "bg-red-500/10",
                      borderColor: "border-red-500/20",
                    },
                    {
                      value: "24/7",
                      label: "Live Support",
                      icon: MessageCircle,
                      color: "from-blue-400 to-blue-600",
                      bgColor: "bg-blue-500/10",
                      borderColor: "border-blue-500/20",
                    },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0, y: 50 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ delay: 1.2 + index * 0.1, duration: 0.6 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className={`relative group ${stat.bgColor} ${stat.borderColor} border rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-xl`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                        className="text-3xl mb-3 flex justify-center"
                      >
                        <stat.icon size={32} className="text-white" />
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                        className={`text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                      >
                        {stat.value}
                      </motion.div>

                      <div className="text-xs md:text-sm text-gray-300 font-medium">
                        {stat.label}
                      </div>

                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}
                      ></div>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 xl:px-24">
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-emerald-500/10 to-emerald-600/10 border border-emerald-500/20 backdrop-blur-sm mb-6">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-emerald-500 rounded-full mr-3"
              />
              <span className="text-sm font-medium text-emerald-400">
                What We Offer
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Fast & Secure
              </span>
              <br />
              <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
                Trading
              </span>
            </h2>

            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Three core features that make crypto trading safe and lightning
              fast
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                title: "Instant Escrow",
                description:
                  "Sub-second fund locking with military-grade encryption",
                delay: 0.2,
                illustration: (
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center relative">
                    <div className="w-8 h-8 bg-white rounded-lg relative">
                      <div className="absolute top-1 left-1 w-6 h-6 bg-emerald-500 rounded-md"></div>
                      <div className="absolute bottom-1 right-1 w-2 h-2 bg-yellow-400 rounded-full"></div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Real-Time Security",
                description: "Live monitoring and instant fraud detection",
                delay: 0.4,
                illustration: (
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center relative">
                    <div className="w-10 h-10 bg-white rounded-full relative">
                      <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full"></div>
                      <div className="absolute bottom-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ),
              },
              {
                title: "Zero-Delay Settlements",
                description: "Automated releases the moment payment confirms",
                delay: 0.6,
                illustration: (
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center relative">
                    <div className="w-10 h-10 bg-white rounded-full relative">
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-purple-500 rounded-full"></div>
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full"></div>
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-red-400 rounded-full"></div>
                    </div>
                  </div>
                ),
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: feature.delay, duration: 0.8 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="glass-effect border border-white/10 rounded-3xl p-8 text-center hover:border-white/20 transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay + 0.2, duration: 0.5 }}
                  className="flex justify-center mb-6"
                >
                  {feature.illustration}
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5762c] via-[#e53825] to-[#f5762c]"></div>
        <div className="absolute inset-0 bg-black/20"></div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        />

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 xl:px-24 text-center">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-white rounded-full mr-3"
              />
              <span className="text-sm font-medium text-white">
                Ready to Start?
              </span>
            </motion.div>

            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl md:text-6xl font-extrabold text-white mb-6"
            >
              Trade in Under
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-6xl md:text-7xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
              >
                60 Seconds
              </motion.span>
            </motion.h2>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-2xl text-white/90 mb-12 leading-relaxed"
            >
              Experience the fastest and most secure way to trade crypto
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-6 justify-center"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={walletState.isConnected ? "/dashboard" : "/login"}
                  className="bg-white hover:bg-gray-100 text-[#f5762c] font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 shadow-2xl hover:shadow-3xl min-w-[250px] block text-center"
                >
                  {walletState.isConnected
                    ? "Go to Dashboard"
                    : "Connect Wallet"}
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/search-trader"
                  className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 shadow-lg hover:shadow-xl min-w-[250px] block text-center"
                >
                  Start Trading
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <motion.footer
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative bg-black border-t border-white/10"
      >
        <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-16">
          <div className="grid md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img
                    src="/trustpeer-logo.png"
                    alt="TrustPeer"
                    className="h-10 w-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-full blur-xl opacity-20"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                  TrustPeer
                </span>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed font-light">
                Decentralized protection for P2P crypto traders.
              </p>

              <div className="flex space-x-4 mt-8">
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#e53825] to-[#f5762c] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.096.119.111.225.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.174.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                    </svg>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                    </svg>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight">
                Product
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/search-trader"
                    className="text-gray-300 hover:text-[#f5762c] transition-colors duration-200 text-base font-light"
                  >
                    Verify Trader
                  </Link>
                </li>
                <li>
                  <Link
                    to="/start-trade"
                    className="text-gray-300 hover:text-[#f5762c] transition-colors duration-200 text-base font-light"
                  >
                    Start Trade
                  </Link>
                </li>
                <li>
                  <Link
                    to={walletState.isConnected ? "/dashboard" : "/login"}
                    className="text-gray-300 hover:text-[#f5762c] transition-colors duration-200 text-base font-light"
                  >
                    {walletState.isConnected ? "Dashboard" : "Connect Wallet"}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight">
                Community
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#e53825] transition-colors duration-200 text-base font-light"
                  >
                    Telegram
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#e53825] transition-colors duration-200 text-base font-light"
                  >
                    Discord
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#e53825] transition-colors duration-200 text-base font-light"
                  >
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-16 pt-8 text-center">
            <p className="text-gray-400 text-base font-light tracking-wide">
              &copy; 2025 TrustPeer.
              <span className="text-white"> Built on ICP.</span>
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
