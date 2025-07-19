import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { LoadingProvider } from './Components/LoadingProvider'
import { useLoading } from './Components/hooks'
import AppLoader from './Components/AppLoader'
import ScrollToTop from './Components/ScrollToTop'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Dashboard from './Pages/Dashboard'
import SearchTrader from './Pages/SearchTrader'
import StartTrade from './Pages/StartTrade'
import EscrowProgress from './Pages/EscrowProgress'
import ConfirmRelease from './Pages/ConfirmRelease'
import RateTrader from './Pages/RateTrader'

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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/search-trader" element={<SearchTrader />} />
        <Route path="/start-trade" element={<StartTrade />} />
        <Route path="/escrow-progress" element={<EscrowProgress />} />
        <Route path="/confirm-release" element={<ConfirmRelease />} />
        <Route path="/rate-trader" element={<RateTrader />} />
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