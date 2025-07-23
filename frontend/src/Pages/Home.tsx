import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Shield, Lock, Zap, Star, Users, ArrowRight, CheckCircle } from "lucide-react";

const Home = () => {
  const [displayText, setDisplayText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = "Trade Crypto Safely";

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

  return (
    <div className="min-h-screen bg-[#080909] relative overflow-hidden">
      {/* Animated background elements with brand colors */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-96 h-96 bg-[#ee5f0a]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#ee5f0a]/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(238,95,10,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 border-b border-gray-800/50 backdrop-blur-2xl bg-[#0f1011]/80"
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
                <div className="absolute inset-0 bg-gradient-to-r from-[#ee5f0a]/30 to-[#d54f08]/30 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150"></div>
              </div>
              <motion.span 
                className="text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-[#ee5f0a] bg-clip-text text-transparent"
                whileHover={{ scale: 1.05 }}
              >
                TrustPeer
              </motion.span>
            </motion.div>
            
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="hidden md:flex items-center gap-4"
            >
              <Link to="/login">
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 8px 20px -8px rgba(238, 95, 10, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-transparent border-2 border-[#ee5f0a] hover:bg-[#ee5f0a] text-[#ee5f0a] hover:text-white font-bold py-3 px-6 rounded-xl transition-all duration-300"
                >
                  Login
                </motion.button>
              </Link>
              
              <Link to="/register">
                <motion.button
                  whileHover={{ 
                    scale: 1.02, 
                    boxShadow: "0 8px 20px -8px rgba(238, 95, 10, 0.3)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] hover:from-[#d54f08] hover:to-[#ee5f0a] text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 border border-[#ee5f0a]/20"
                >
                  Sign Up
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-32">
        {/* Floating animation elements with brand colors */}
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
          className="absolute top-20 left-20 w-4 h-4 bg-[#ee5f0a] rounded-full blur-sm"
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
          className="absolute top-40 right-32 w-6 h-6 bg-[#d54f08] rounded-full blur-sm"
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

        <div className="relative z-10 w-full px-4 md:px-6 lg:px-16 xl:px-24">
          <div className="text-center max-w-6xl mx-auto">
            <motion.h1
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold mb-6 sm:mb-8 leading-tight"
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
                  className="bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] bg-clip-text text-transparent"
                >
                  with TrustPeer
                </motion.span>
              )}
            </motion.h1>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0"
            >
              The most secure peer-to-peer crypto trading platform. Join thousands of traders who trust our escrow system to protect their transactions.
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-12 sm:mb-20 px-4 sm:px-0"
            >
              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 10px 25px -8px rgba(238, 95, 10, 0.3)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/register"
                  className="relative block bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] hover:from-[#d54f08] hover:to-[#ee5f0a] text-white font-bold py-4 sm:py-6 px-8 sm:px-12 rounded-2xl text-lg sm:text-xl transition-all duration-300 shadow-lg border border-[#ee5f0a]/20 min-w-[250px] sm:min-w-[280px] text-center"
                >
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 4 }}
                    >
                      <ArrowRight size={20} className="text-white sm:w-6 sm:h-6" />
                    </motion.div>
                    Start Trading
                  </div>
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ 
                  scale: 1.02, 
                  boxShadow: "0 8px 20px -8px rgba(148, 163, 184, 0.2)",
                }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/login"
                  className="relative block bg-transparent border-2 border-gray-600 hover:border-gray-400 text-white font-bold py-4 sm:py-6 px-8 sm:px-12 rounded-2xl text-lg sm:text-xl transition-all duration-300 shadow-sm min-w-[250px] sm:min-w-[280px] text-center backdrop-blur-sm"
                >
                  <div className="flex items-center justify-center gap-3">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Shield size={20} className="text-white sm:w-6 sm:h-6" />
                    </motion.div>
                    Already a Member?
                  </div>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="relative max-w-6xl mx-auto px-4 sm:px-0"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ee5f0a]/5 via-[#d54f08]/5 to-[#ee5f0a]/5 rounded-3xl blur-3xl"></div>

              <div className="relative bg-gradient-to-r from-[#0f1011]/80 to-[#0f1011]/60 backdrop-blur-sm border border-gray-800/50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
                  {[
                    {
                      value: "99.9%",
                      label: "Uptime",
                      icon: Zap,
                      color: "from-green-400 to-green-600",
                      bgColor: "bg-green-500/10",
                      borderColor: "border-green-500/20",
                    },
                    {
                      value: "100%",
                      label: "Security Rate",
                      icon: Shield,
                      color: "from-[#ee5f0a] to-[#d54f08]",
                      bgColor: "bg-[#ee5f0a]/10",
                      borderColor: "border-[#ee5f0a]/20",
                    },
                    {
                      value: "0",
                      label: "Funds Lost",
                      icon: Lock,
                      color: "from-red-400 to-red-600",
                      bgColor: "bg-red-500/10",
                      borderColor: "border-red-500/20",
                    },
                    {
                      value: "24/7",
                      label: "Support",
                      icon: Users,
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
                      whileHover={{ scale: 1.03 }}
                      className={`relative group ${stat.bgColor} ${stat.borderColor} border rounded-xl sm:rounded-2xl p-3 sm:p-6 text-center transition-all duration-300 hover:shadow-lg`}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.4 + index * 0.1, duration: 0.5 }}
                        className="text-2xl sm:text-3xl mb-2 sm:mb-3 flex justify-center"
                      >
                        <stat.icon size={24} className="text-white sm:w-8 sm:h-8" />
                      </motion.div>

                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.6 + index * 0.1, duration: 0.5 }}
                        className={`text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-1 sm:mb-2`}
                      >
                        {stat.value}
                      </motion.div>

                      <div className="text-xs sm:text-sm text-gray-300 font-medium">
                        {stat.label}
                      </div>

                      <div
                        className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-0 group-hover:opacity-5 rounded-xl sm:rounded-2xl transition-opacity duration-300`}
                      ></div>
                    </motion.div>
                  ))}
                </div>

                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 sm:w-32 h-1 bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] rounded-full"></div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#080909] via-[#0f1011] to-[#080909]"></div>

        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 xl:px-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-center mb-20"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-[#ee5f0a]/10 to-[#d54f08]/10 border border-[#ee5f0a]/20 backdrop-blur-sm mb-6"
            >
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-3 h-3 bg-[#ee5f0a] rounded-full mr-3"
              />
              <span className="text-sm font-medium text-[#ee5f0a]">
                Why Choose TrustPeer
              </span>
            </motion.div>

            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 tracking-tight"
            >
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Secure & Trusted
              </span>
              <br />
              <span className="bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] bg-clip-text text-transparent">
                Trading Platform
              </span>
            </motion.h2>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
            >
              Three core features that make crypto trading safe and reliable
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-6xl mx-auto px-4 sm:px-0">
            {[
              {
                title: "Smart Escrow",
                description: "Automated escrow system protects both buyers and sellers during every transaction",
                delay: 0.1,
                icon: Lock,
                gradient: "from-[#ee5f0a] to-[#d54f08]",
                iconBg: "bg-[#ee5f0a]/10",
                iconColor: "text-[#ee5f0a]"
              },
              {
                title: "Trader Verification",
                description: "Comprehensive verification system ensures you trade with trusted, verified users",
                delay: 0.2,
                icon: Shield,
                gradient: "from-green-400 to-green-600",
                iconBg: "bg-green-500/10",
                iconColor: "text-green-400"
              },
              {
                title: "Real-Time Monitoring",
                description: "24/7 monitoring and instant dispute resolution to keep your trades secure",
                delay: 0.3,
                icon: Zap,
                gradient: "from-blue-400 to-blue-600",
                iconBg: "bg-blue-500/10",
                iconColor: "text-blue-400"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ 
                  duration: 0.5, 
                  delay: feature.delay, 
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -3, 
                  scale: 1.01,
                  transition: { duration: 0.2 }
                }}
                className="bg-[#0f1011] border border-gray-800/50 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center hover:border-gray-700/50 transition-all duration-300"
              >
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  whileInView={{ scale: 1, rotate: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: feature.delay + 0.2, 
                    type: "spring",
                    stiffness: 200
                  }}
                  className="flex justify-center mb-4 sm:mb-6"
                >
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${feature.gradient} rounded-xl sm:rounded-2xl flex items-center justify-center relative group`}>
                    <feature.icon size={24} className="text-white sm:w-8 sm:h-8 relative z-10" />
                    <div className="absolute inset-0 bg-white/20 rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: feature.delay + 0.4 }}
                  className="text-xl sm:text-2xl font-bold text-white mb-3 sm:mb-4"
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: feature.delay + 0.5 }}
                  className="text-gray-300 text-base sm:text-lg leading-relaxed"
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#ee5f0a] via-[#d54f08] to-[#ee5f0a]"></div>
        <div className="absolute inset-0 bg-[#080909]/20"></div>

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
                Join the Community
              </span>
            </motion.div>

            <motion.h2
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6"
            >
              Start Trading in
              <motion.span
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
              >
                Minutes
              </motion.span>
            </motion.h2>

            <motion.p
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0"
            >
              Join thousands of traders who trust TrustPeer for secure P2P crypto transactions
            </motion.p>

            <motion.div
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/register"
                  className="bg-white hover:bg-gray-100 text-[#ee5f0a] font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl sm:rounded-2xl text-lg sm:text-xl transition-all duration-300 shadow-lg hover:shadow-xl min-w-[200px] sm:min-w-[250px] block text-center"
                >
                  Create Account
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto"
              >
                <Link
                  to="/login"
                  className="bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-bold py-3 sm:py-4 px-8 sm:px-12 rounded-xl sm:rounded-2xl text-lg sm:text-xl transition-all duration-300 shadow-sm hover:shadow-lg min-w-[200px] sm:min-w-[250px] block text-center backdrop-blur-sm"
                >
                  Sign In
                </Link>
              </motion.div>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 sm:mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-white/90"
            >
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <CheckCircle size={20} className="text-green-400 sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg font-medium">Verified Traders</span>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <Shield size={20} className="text-[#ee5f0a] sm:w-6 sm:h-6" />
                <span className="text-base sm:text-lg font-medium">Secure Escrow</span>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.1, duration: 0.4 }}
                className="flex items-center gap-3"
              >
                <Star size={20} className="text-yellow-400 sm:w-6 sm:h-6 fill-current" />
                <span className="text-base sm:text-lg font-medium">4.9/5 Rating</span>
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
        className="relative bg-[#080909] border-t border-gray-800/50"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] rounded-full blur-xl opacity-20"></div>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent tracking-tight">
                  TrustPeer
                </span>
              </div>
              <p className="text-gray-300 text-lg mb-6 leading-relaxed font-light">
                The most secure peer-to-peer crypto trading platform. Join thousands of verified traders.
              </p>

              <div className="flex space-x-4 mt-8">
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-[#d54f08] to-[#ee5f0a] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                  <div className="w-12 h-12 bg-gradient-to-r from-[#ee5f0a] to-[#d54f08] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
                Platform
              </h3>
              <ul className="space-y-4">
                <li>
                  <Link
                    to="/register"
                    className="text-gray-300 hover:text-[#ee5f0a] transition-colors duration-200 text-base font-light"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    to="/login"
                    className="text-gray-300 hover:text-[#ee5f0a] transition-colors duration-200 text-base font-light"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <a
                    href="#features"
                    className="text-gray-300 hover:text-[#ee5f0a] transition-colors duration-200 text-base font-light"
                  >
                    Features
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight">
                Support
              </h3>
              <ul className="space-y-4">
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#d54f08] transition-colors duration-200 text-base font-light"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#d54f08] transition-colors duration-200 text-base font-light"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-[#d54f08] transition-colors duration-200 text-base font-light"
                  >
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800/50 mt-16 pt-8 text-center">
            <p className="text-gray-400 text-base font-light tracking-wide">
              &copy; 2025 TrustPeer.
              <span className="text-white"> Secure P2P Trading Platform.</span>
            </p>
          </div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Home;
