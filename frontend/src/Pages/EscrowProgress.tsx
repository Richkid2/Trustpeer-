import { Link } from 'react-router-dom'

const EscrowProgress = () => {
  const steps = [
    { name: 'Trade Created', completed: true },
    { name: 'Funds Deposited', completed: true },
    { name: 'Awaiting Confirmation', completed: false },
    { name: 'Trade Complete', completed: false }
  ]

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-8 text-gray-800">Escrow Progress</h2>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Trade Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Trade ID</p>
                <p className="font-medium">#TR001</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-medium">0.5 ETH</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Trading Partner</p>
                <p className="font-medium">0x1234...5678</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium text-yellow-600">In Progress</p>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Progress</h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex items-center">
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    step.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}></div>
                  <span className={step.completed ? 'text-green-600' : 'text-gray-500'}>
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-3">
            <Link 
              to="/confirm-release"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200 block text-center"
            >
              Confirm Release
            </Link>
            
            <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-md transition duration-200">
              Cancel Trade
            </button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-500 hover:text-blue-600">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default EscrowProgress
