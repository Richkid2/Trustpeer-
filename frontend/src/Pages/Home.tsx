import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="glass-effect border-b border-white/10">
        <div className="w-full px-4 md:px-6 lg:px-16 xl:px-24">
          <div className="flex justify-between items-center py-3 md:py-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/src/assets/images/trustpeer-logo.png" 
                  alt="TrustPeer" 
                  className="h-8 md:h-10 w-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-600 rounded-full blur-xl opacity-30"></div>
              </div>
              <span className="text-lg md:text-2xl font-bold text-gradient-primary">
                TrustPeer
              </span>
            </div>
            <Link
              to="/login"
              className="hidden md:flex bg-gradient-primary hover:bg-gradient-secondary text-white font-medium py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                <span>Connect Wallet</span>
              </span>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-red-600/20"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-red-600 rounded-full animate-pulse delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-white rounded-full animate-pulse delay-700"></div>
        
        <div className="relative z-10 w-full px-4 md:px-6 lg:px-16 xl:px-24 py-12 md:py-20">
          <div className="text-center max-w-6xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full glass-effect border border-orange-500/20 mb-6 md:mb-8">
              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-white/90">Built on Internet Computer Protocol</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold mb-6 md:mb-8 leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
                Safe P2P Crypto Trading
              </span>
            </h1>
            
            <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-8 md:mb-12 text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              End chargeback fraud and trade with confidence. Our 
              <span className="text-orange-500 font-semibold"> decentralized escrow system </span>
              protects your USDT/NGN trades
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center items-center">
              <Link
                to="/search-trader"
                className="bg-gradient-primary hover:bg-gradient-secondary text-white font-semibold py-4 px-8 md:px-10 rounded-2xl text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl w-full sm:w-auto min-w-[200px]"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <span>Verify Trader</span>
                </span>
              </Link>
              
              <Link
                to="/start-trade"
                className="glass-effect hover:bg-white/20 border border-white/20 hover:border-white/30 text-white font-semibold py-4 px-8 md:px-10 rounded-2xl text-base md:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto min-w-[200px]"
              >
                <span className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm2 6a2 2 0 011.732-1.943A2 2 0 018 6h4a2 2 0 01.268 1.057A2 2 0 0114 10a2 2 0 01-1.732 1.943A2 2 0 0112 14H8a2 2 0 01-.268-1.057A2 2 0 016 10z" clipRule="evenodd" />
                  </svg>
                  <span>Start Trade</span>
                </span>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-12 md:mt-20 max-w-4xl mx-auto">
              <div className="glass-effect border border-white/10 rounded-2xl p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">10K+</div>
                <div className="text-xs md:text-sm text-gray-400">Active Traders</div>
              </div>
              <div className="glass-effect border border-white/10 rounded-2xl p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">$2M+</div>
                <div className="text-xs md:text-sm text-gray-400">Volume Secured</div>
              </div>
              <div className="glass-effect border border-white/10 rounded-2xl p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-orange-500 mb-2">99.9%</div>
                <div className="text-xs md:text-sm text-gray-400">Success Rate</div>
              </div>
              <div className="glass-effect border border-white/10 rounded-2xl p-4 md:p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-red-600 mb-2">24/7</div>
                <div className="text-xs md:text-sm text-gray-400">Protection</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="relative py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-red-500/10 to-red-600/10 border border-red-500/20 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-red-400">Critical Issues</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                The Problem We're
              </span>
              <span className="block bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
                Solving
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Nigerian crypto traders face constant threats from chargeback fraud and unregulated trading environments
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
            <div className="group relative backdrop-blur-sm bg-white/5 border border-white/10 hover:border-[#f5762c]/50 rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5762c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f5762c] to-[#e53825] rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">Chargeback Fraud</h3>
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  Buyers complete fiat payments, then contact banks to reverse transactions, leaving sellers defrauded of both crypto and fiat.
                </p>
              </div>
            </div>

            <div className="group relative backdrop-blur-sm bg-white/5 border border-white/10 hover:border-[#e53825]/50 rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-br from-[#e53825]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#e53825] to-[#f5762c] rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">Government Ban</h3>
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  Nigeria's ban on direct crypto-to-naira transactions forces traders into unregulated Telegram and WhatsApp groups.
                </p>
              </div>
            </div>

            <div className="group relative backdrop-blur-sm bg-white/5 border border-white/10 hover:border-[#f5762c]/50 rounded-3xl p-8 lg:p-10 transition-all duration-300 hover:transform hover:scale-105 md:col-span-2 lg:col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5762c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-gradient-to-br from-[#f5762c] to-[#e53825] rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 tracking-tight">Identity Fraud</h3>
                <p className="text-gray-300 text-lg leading-relaxed font-light">
                  Impersonation and untraceable theft run rampant in informal trading spaces with no verification systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#f5762c]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-[#e53825]/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 xl:px-24">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-green-400">DAO-Based Solution</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Our Revolutionary
              </span>
              <span className="block bg-gradient-to-r from-[#f5762c] to-[#e53825] bg-clip-text text-transparent">
                Web3 Solution
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
              Built on Internet Computer Protocol (ICP) for decentralized, community-driven protection
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center max-w-7xl mx-auto">
            <div className="space-y-10 lg:space-y-12">
              <div className="group flex items-start space-x-6 lg:space-x-8">
                <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#f5762c] to-[#e53825] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#f5762c] transition-colors duration-300 tracking-tight">
                    Smart Contract Escrow
                  </h3>
                  <p className="text-gray-300 text-lg lg:text-xl leading-relaxed font-light">
                    Funds held in immutable smart contracts until payment is verified and irreversible, completely eliminating chargeback fraud.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-6 lg:space-x-8">
                <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#e53825] to-[#f5762c] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#e53825] transition-colors duration-300 tracking-tight">
                    Telegram/WhatsApp Integration
                  </h3>
                  <p className="text-gray-300 text-lg lg:text-xl leading-relaxed font-light">
                    Seamless bot integration for real-time reputation checks and identity verification in your existing trading groups.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-6 lg:space-x-8">
                <div className="flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-[#f5762c] to-[#e53825] rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#f5762c] transition-colors duration-300 tracking-tight">
                    Community Trust System
                  </h3>
                  <p className="text-gray-300 text-lg lg:text-xl leading-relaxed font-light">
                    Decentralized DAO governance with community-managed blacklists and algorithmic trust scoring for maximum security.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f5762c]/20 to-[#e53825]/20 rounded-3xl blur-xl"></div>
              <div className="relative backdrop-blur-sm bg-gradient-to-br from-[#f5762c]/10 to-[#e53825]/10 border border-white/20 rounded-3xl p-10 lg:p-12">
                <div className="text-center mb-8">
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 tracking-tight">
                    Protecting Where Others Fail
                  </h3>
                  <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed font-light">
                    Traditional P2P platforms like Bybit and Binance don't protect off-platform transactions where most scams occur. 
                    <span className="text-[#f5762c] font-semibold"> TrustPeer fills this gap.</span>
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg lg:text-xl text-white">Decentralized & Trustless</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg lg:text-xl text-white">Built on ICP Protocol</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg lg:text-xl text-white">Community Governed</span>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-lg lg:text-xl text-white">Zero Chargeback Risk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f5762c] via-[#e53825] to-[#f5762c]"></div>
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Animated Background Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 w-full px-4 sm:px-6 lg:px-16 xl:px-24 text-center">
          <div className="max-w-5xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
              <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
              <span className="text-sm font-medium text-white">Join The Revolution</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight">
              Ready to Trade
              <span className="block text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
                Safely?
              </span>
            </h2>
            
            <p className="text-xl md:text-2xl lg:text-3xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
              Join thousands of Nigerian traders protecting their crypto transactions with 
              <span className="font-bold"> TrustPeer</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/login"
                className="group relative overflow-hidden bg-white hover:bg-gray-100 text-[#f5762c] font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-3xl min-w-[250px] tracking-wide"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Connect Your Wallet</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#f5762c]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                to="/search-trader"
                className="group relative overflow-hidden backdrop-blur-sm bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-bold py-4 px-12 rounded-2xl text-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl min-w-[250px] tracking-wide"
              >
                <span className="relative z-10 flex items-center justify-center space-x-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <span>Verify a Trader</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black border-t border-white/10">
        <div className="w-full px-4 sm:px-6 lg:px-16 xl:px-24 py-16">
          <div className="grid md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="col-span-2">
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative">
                  <img 
                    src="/src/assets/images/trustpeer-logo.png" 
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
                Decentralized protection for P2P crypto traders. Built by the community, for the community.
              </p>
              <p className="text-gray-400 text-base font-light">
                Starting in Nigeria, expanding across Africa and beyond.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-4 mt-8">
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#e53825] to-[#f5762c] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </a>
                <a href="#" className="group">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#f5762c] to-[#e53825] rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Product</h3>
              <ul className="space-y-4">
                <li>
                  <Link to="/search-trader" className="text-gray-300 hover:text-[#f5762c] transition-colors duration-200 text-base font-light">
                    Verify Trader
                  </Link>
                </li>
                <li>
                  <Link to="/start-trade" className="text-gray-300 hover:text-[#f5762c] transition-colors duration-200 text-base font-light">
                    Start Trade
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-[#f5762c] transition-colors duration-200 text-base font-light">
                    Connect Wallet
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-6 tracking-tight">Community</h3>
              <ul className="space-y-4">
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#e53825] transition-colors duration-200 text-base font-light">
                    Telegram
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#e53825] transition-colors duration-200 text-base font-light">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-[#e53825] transition-colors duration-200 text-base font-light">
                    Twitter
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-16 pt-8 text-center">
            <p className="text-gray-400 text-base font-light tracking-wide">
              &copy; 2025 TrustPeer. 
              <span className="text-[#f5762c]"> Decentralized.</span>
              <span className="text-[#e53825]"> Community-Owned.</span>
              <span className="text-white"> Built on ICP.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
