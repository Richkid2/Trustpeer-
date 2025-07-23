import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  AlertTriangle, 
  Search, 
  Filter,
  ChevronDown,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  FileText
} from 'lucide-react'
import DashboardLayout from '../Components/Layout/DashboardLayout'

interface Dispute {
  id: string
  tradeId: string
  opponent: string
  type: string
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  priority: 'High' | 'Medium' | 'Low'
  amount: number
  currency: string
  createdDate: string
  lastUpdate: string
  description: string
  evidence: string[]
  assignedModerator?: string
  timeline: Array<{
    date: string
    action: string
    user: string
  }>
}

const Disputes = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null)

  // Mock disputes data
  const mockDisputes: Dispute[] = [
    {
      id: 'DSP001',
      tradeId: 'TXN65921',
      opponent: 'David Michael',
      type: 'Payment Not Received',
      status: 'Open',
      priority: 'High',
      amount: 50.25,
      currency: 'USDT',
      createdDate: '2025-07-20',
      lastUpdate: '2025-07-21',
      description: 'Payment was not received within the agreed time frame. Seller is not responding to messages.',
      evidence: ['Screenshot 1', 'Transaction Receipt'],
      assignedModerator: 'Support Team',
      timeline: [
        { date: '2025-07-20', action: 'Dispute Created', user: 'You' },
        { date: '2025-07-20', action: 'Evidence Submitted', user: 'You' },
        { date: '2025-07-21', action: 'Under Review', user: 'Support Team' }
      ]
    },
    {
      id: 'DSP002',
      tradeId: 'TXN5754',
      opponent: 'Sarah Johnson',
      type: 'Wrong Payment Amount',
      status: 'Resolved',
      priority: 'Medium',
      amount: 75.30,
      currency: 'USDT',
      createdDate: '2025-07-15',
      lastUpdate: '2025-07-18',
      description: 'Received incorrect payment amount. Expected $75.30 but received $70.00.',
      evidence: ['Bank Statement', 'Chat History'],
      assignedModerator: 'John Admin',
      timeline: [
        { date: '2025-07-15', action: 'Dispute Created', user: 'You' },
        { date: '2025-07-16', action: 'Counter Evidence Submitted', user: 'Sarah Johnson' },
        { date: '2025-07-17', action: 'Moderator Assigned', user: 'John Admin' },
        { date: '2025-07-18', action: 'Resolved - Refund Issued', user: 'John Admin' }
      ]
    },
    {
      id: 'DSP003',
      tradeId: 'TXN22931',
      opponent: 'Mike Wilson',
      type: 'Account Details Issue',
      status: 'In Progress',
      priority: 'Low',
      amount: 25.10,
      currency: 'USDT',
      createdDate: '2025-07-10',
      lastUpdate: '2025-07-19',
      description: 'Provided incorrect account details for payment transfer.',
      evidence: ['Account Details', 'Email Correspondence'],
      assignedModerator: 'Sarah Admin',
      timeline: [
        { date: '2025-07-10', action: 'Dispute Created', user: 'Mike Wilson' },
        { date: '2025-07-11', action: 'Response Submitted', user: 'You' },
        { date: '2025-07-12', action: 'Additional Evidence Requested', user: 'Sarah Admin' },
        { date: '2025-07-19', action: 'Under Investigation', user: 'Sarah Admin' }
      ]
    }
  ]

  // Filter and sort disputes
  const filteredDisputes = mockDisputes
    .filter(dispute => {
      const matchesSearch = !searchQuery || 
        dispute.opponent.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dispute.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || 
        dispute.status.toLowerCase() === filterStatus.toLowerCase()
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
        case 'amount':
          return b.amount - a.amount
        case 'status':
          return a.status.localeCompare(b.status)
        case 'priority':
          const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        default:
          return 0
      }
    })

  // Calculate dispute stats
  const totalDisputes = mockDisputes.length
  const openDisputes = mockDisputes.filter(d => d.status === 'Open').length
  const inProgressDisputes = mockDisputes.filter(d => d.status === 'In Progress').length
  const resolvedDisputes = mockDisputes.filter(d => d.status === 'Resolved').length

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'open':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'in progress':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'resolved':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      case 'closed':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'bg-red-500/10 text-red-400 border-red-500/20'
      case 'medium':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
      case 'low':
        return 'bg-green-500/10 text-green-400 border-green-500/20'
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20'
    }
  }

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute)
  }

  return (
    <DashboardLayout 
      pageTitle="Disputes" 
      pageDescription="Manage your trade disputes and resolutions"
    >
      <div className="p-4 lg:p-8 space-y-6">
        {/* Dispute Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-800"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Total Disputes</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{totalDisputes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-800"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-red-500/10 rounded-xl flex items-center justify-center">
                <XCircle className="w-5 h-5 lg:w-6 lg:h-6 text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Open</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{openDisputes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-800"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{inProgressDisputes}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#0f1011] rounded-xl p-4 lg:p-6 border border-gray-800"
          >
            <div className="flex items-center gap-3 lg:gap-4">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500/10 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-white text-xl lg:text-2xl font-bold">{resolvedDisputes}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Disputes List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#0f1011] rounded-xl border border-gray-800"
        >
          <div className="p-4 lg:p-6 border-b border-gray-800">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg lg:text-xl font-semibold text-white">All Disputes</h2>
              <button className="px-4 py-2 bg-[#ee5f0a] hover:bg-[#d54f08] text-white rounded-lg transition-colors text-sm font-medium w-full sm:w-auto">
                Create New Dispute
              </button>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 lg:gap-4">
              <div className="relative w-full sm:flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search disputes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-[#ee5f0a] transition-colors"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <div className="relative">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 text-gray-400 hover:text-white focus:text-white transition-colors text-sm pr-8 focus:outline-none focus:border-[#ee5f0a]"
                  >
                    <option value="all">All Status</option>
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                  <Filter className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-800 border border-gray-700 rounded-lg px-3 lg:px-4 py-2 text-gray-400 hover:text-white focus:text-white transition-colors text-sm pr-8 focus:outline-none focus:border-[#ee5f0a]"
                  >
                    <option value="date">Sort by Date</option>
                    <option value="amount">Sort by Amount</option>
                    <option value="status">Sort by Status</option>
                    <option value="priority">Sort by Priority</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Disputes Table - Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/30">
                <tr className="text-left">
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Dispute ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Trade ID</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Opponent</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Type</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Amount</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Priority</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Status</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Created</th>
                  <th className="px-6 py-4 text-sm font-medium text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredDisputes.length > 0 ? filteredDisputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-gray-800/20 transition-colors">
                    <td className="px-6 py-4 text-white font-medium text-sm">{dispute.id}</td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{dispute.tradeId}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-medium">
                            {dispute.opponent.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <span className="text-white font-medium text-sm">{dispute.opponent}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-300 text-sm">{dispute.type}</td>
                    <td className="px-6 py-4 text-white text-sm font-medium">
                      {dispute.amount} {dispute.currency}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(dispute.priority)}`}>
                        {dispute.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(dispute.status)}`}>
                        {dispute.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(dispute.createdDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewDispute(dispute)}
                          className="text-gray-400 hover:text-white transition-colors p-1"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-white transition-colors p-1"
                          title="Open Chat"
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-6 py-12 text-center">
                      <div className="text-gray-400">
                        <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-medium mb-2">No disputes found</p>
                        <p className="text-sm">No disputes match your current search criteria</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Disputes Cards - Mobile/Tablet */}
          <div className="lg:hidden p-4 space-y-4">
            {filteredDisputes.length > 0 ? filteredDisputes.map((dispute) => (
              <motion.div
                key={dispute.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-800/30 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm">{dispute.id}</h3>
                    <p className="text-gray-400 text-xs">Trade: {dispute.tradeId}</p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(dispute.priority)}`}>
                      {dispute.priority}
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-medium">
                      {dispute.opponent.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium text-sm">{dispute.opponent}</p>
                    <p className="text-gray-400 text-xs">{dispute.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium text-sm">{dispute.amount} {dispute.currency}</p>
                    <p className="text-gray-400 text-xs">{new Date(dispute.createdDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                  <p className="text-gray-400 text-xs">{dispute.description.substring(0, 60)}...</p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleViewDispute(dispute)}
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      className="text-gray-400 hover:text-white transition-colors p-1"
                      title="Open Chat"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
                <p className="text-gray-400 text-lg font-medium mb-2">No disputes found</p>
                <p className="text-gray-500 text-sm">No disputes match your current search criteria</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Dispute Detail Modal */}
        {selectedDispute && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedDispute(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#0f1011] rounded-xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-white">Dispute Details</h2>
                  <button
                    onClick={() => setSelectedDispute(null)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(selectedDispute.priority)}`}>
                    {selectedDispute.priority} Priority
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(selectedDispute.status)}`}>
                    {selectedDispute.status}
                  </span>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Dispute ID</label>
                    <p className="text-white font-medium">{selectedDispute.id}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Trade ID</label>
                    <p className="text-white font-medium">{selectedDispute.tradeId}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Opponent</label>
                    <p className="text-white font-medium">{selectedDispute.opponent}</p>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Amount</label>
                    <p className="text-white font-medium">{selectedDispute.amount} {selectedDispute.currency}</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <p className="text-white bg-gray-800/30 rounded-lg p-3 text-sm">{selectedDispute.description}</p>
                </div>

                {/* Evidence */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Evidence</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedDispute.evidence.map((evidence, index) => (
                      <span key={index} className="inline-flex items-center gap-2 px-3 py-2 bg-gray-800/30 rounded-lg text-sm text-white">
                        <FileText className="w-4 h-4" />
                        {evidence}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <label className="block text-gray-400 text-sm mb-3">Timeline</label>
                  <div className="space-y-3">
                    {selectedDispute.timeline.map((event, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 h-2 bg-[#ee5f0a] rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{event.action}</p>
                          <p className="text-gray-400 text-xs">by {event.user} on {event.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-800">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ee5f0a] hover:bg-[#d54f08] text-white rounded-lg transition-colors font-medium">
                    <MessageSquare className="w-4 h-4" />
                    Open Chat
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium">
                    <FileText className="w-4 h-4" />
                    Add Evidence
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default Disputes
