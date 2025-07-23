import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { LoadingProvider } from './Components/LoadingProvider'
import { useLoading } from './Components/hooks'
import AppLoader from './Components/AppLoader'
import ScrollToTop from './Components/ScrollToTop'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import EmailConfirmation from './Pages/EmailConfirmation'
import TelegramSetup from './Pages/TelegramSetup'
import Dashboard from './Pages/Dashboard'
import Browse from './Pages/Browse'
import StartTrade from './Pages/StartTrade'
import EscrowProgress from './Pages/EscrowProgress'
import ConfirmRelease from './Pages/ConfirmRelease'
import RateTrader from './Pages/RateTrader'
import Transactions from './Pages/Transactions'
import Disputes from './Pages/Disputes'
import Profile from './Pages/Profile'

// Main App Router Component
const AppRouter = () => {
  const { isAppLoading, hideAppLoader } = useLoading()

  useEffect(() => {
    // Simulate app initialization
    const initializeApp = async () => {
      // Reduced loading time for better UX (you can replace this with actual initialization)
      await new Promise(resolve => setTimeout(resolve, 3000)) // Changed from 3000 to 2000
      hideAppLoader()
    }

    initializeApp()
  }, [hideAppLoader])

  if (isAppLoading) {
    return <AppLoader />
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/email-confirmation" element={<EmailConfirmation />} />
        <Route path="/telegram-setup" element={<TelegramSetup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/start-trade" element={<StartTrade />} />
        <Route path="/escrow-progress" element={<EscrowProgress />} />
        <Route path="/confirm-release" element={<ConfirmRelease />} />
        <Route path="/rate-trader" element={<RateTrader />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/disputes" element={<Disputes />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  )
}

const App = () => {
  return (
    <LoadingProvider>
      <AppRouter />
    </LoadingProvider>
  )
}

export default App