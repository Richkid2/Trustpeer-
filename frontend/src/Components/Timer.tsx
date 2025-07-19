import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'

interface TimerProps {
  endTime: Date
  onExpire?: () => void
  className?: string
  variant?: 'default' | 'warning' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const Timer = ({ 
  endTime, 
  onExpire, 
  className = '', 
  variant = 'default',
  size = 'md'
}: TimerProps) => {
  const calculateTimeLeft = useCallback(() => {
    const now = new Date().getTime()
    const end = endTime.getTime()
    const difference = end - now

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((difference % (1000 * 60)) / 1000)
    }
  }, [endTime])

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      const total = newTimeLeft.days + newTimeLeft.hours + newTimeLeft.minutes + newTimeLeft.seconds
      if (total === 0 && !isExpired) {
        setIsExpired(true)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [endTime, isExpired, onExpire, calculateTimeLeft])

  const getVariantStyles = () => {
    switch (variant) {
      case 'warning':
        return 'text-yellow-300 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30 shadow-lg shadow-yellow-500/20'
      case 'danger':
        return 'text-red-300 bg-gradient-to-r from-red-500/10 to-pink-500/10 border-red-500/30 shadow-lg shadow-red-500/20'
      default:
        return 'text-cyan-300 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/20'
    }
  }

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-sm px-3 py-2'
      case 'lg':
        return 'text-lg px-6 py-4'
      default:
        return 'text-base px-4 py-3'
    }
  }

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0')
  }

  if (isExpired) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`inline-flex items-center gap-3 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-slate-800/80 to-slate-900/80 border ${getVariantStyles()} ${getSizeStyles()} ${className}`}
      >
        <motion.svg 
          className="w-5 h-5 text-red-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </motion.svg>
        <span className="font-kansas-bold text-red-300">Expired</span>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`inline-flex items-center gap-3 rounded-2xl backdrop-blur-lg bg-gradient-to-r from-slate-800/80 to-slate-900/80 border ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      <motion.svg 
        className="w-5 h-5" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </motion.svg>
      
      <div className="flex items-center gap-2 font-mono font-kansas-medium">
        {timeLeft.days > 0 && (
          <motion.div 
            className="flex items-center gap-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-white">{formatTime(timeLeft.days)}</span>
            <span className="text-slate-400 text-sm">d</span>
          </motion.div>
        )}
        
        {(timeLeft.days > 0 || timeLeft.hours > 0) && (
          <motion.div 
            className="flex items-center gap-1"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
          >
            <span className="text-white">{formatTime(timeLeft.hours)}</span>
            <span className="text-slate-400 text-sm">h</span>
          </motion.div>
        )}
        
        <motion.div 
          className="flex items-center gap-1"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
        >
          <span className="text-white">{formatTime(timeLeft.minutes)}</span>
          <span className="text-slate-400 text-sm">m</span>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-1"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <span className="text-cyan-300">{formatTime(timeLeft.seconds)}</span>
          <span className="text-slate-400 text-sm">s</span>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default Timer
