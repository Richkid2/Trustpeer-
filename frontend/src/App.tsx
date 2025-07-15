

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SearchTrader from './Pages/SearchTrader'
import StartTrade from './Pages/StartTrade'
import EscrowProgress from './Pages/EscrowProgress'
import ConfirmRelease from './Pages/ConfirmRelease'
import RateTrader from './Pages/RateTrader'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/search-trader" element={<SearchTrader />} />
        <Route path="/start-trade" element={<StartTrade />} />
        <Route path="/escrow-progress" element={<EscrowProgress />} />
        <Route path="/confirm-release" element={<ConfirmRelease />} />
        <Route path="/rate-trader" element={<RateTrader />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App