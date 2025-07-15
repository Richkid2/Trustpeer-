import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Welcome to TrustPeer
        </h1>
        
        <div className="space-y-4">
          <Link
            to="/login"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 block text-center"
          >
            Login
          </Link>
          
          <Link
            to="/search-trader"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 block text-center"
          >
            Search Trader
          </Link>
          
          <Link
            to="/start-trade"
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 block text-center"
          >
            Start Trade
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
