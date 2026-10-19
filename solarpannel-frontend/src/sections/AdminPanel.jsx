import React, { useState, useEffect } from 'react'
import { 
  ShieldCheck, 
  ArrowLeft, 
  RefreshCw, 
  Search, 
  Trash2, 
  Users, 
  Clock, 
  CheckCircle2, 
  Database,
  Calendar,
  AlertCircle,
  Edit2,
  X,
  Save,
  Check,
  BarChart3,
  PieChart,
  TrendingUp,
  Layers,
  Zap,
  ChevronDown,
  ChevronUp,
  Activity,
  LogOut,
  User as UserIcon
} from 'lucide-react'
import { 
  fetchConsultations, 
  updateConsultationStatus, 
  updateConsultation,
  deleteConsultation, 
  checkBackendHealth 
} from '../services/api'
import '../styles/AdminPanel.css'

export default function AdminPanel({ onBack, currentUser, onLogout }) {
  const [consultations, setConsultations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dbStatus, setDbStatus] = useState('Connecting...')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [showCharts, setShowCharts] = useState(true)

  // Edit Lead Modal State
  const [editingLead, setEditingLead] = useState(null)
  const [editFormData, setEditFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyType: 'Residential Rooftop',
    monthlyBill: '$200 - $500',
    status: 'pending',
    notes: ''
  })
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [editSuccessMsg, setEditSuccessMsg] = useState('')

  // Load leads from MongoDB backend
  const loadLeads = async () => {
    setIsRefreshing(true)
    setError(null)

    try {
      // 1. Check health
      const health = await checkBackendHealth()
      if (health && health.database) {
        setDbStatus(health.database)
      } else {
        setDbStatus('Local Backend Active')
      }

      // 2. Fetch all consultation quotes
      const res = await fetchConsultations()
      if (res && res.data) {
        setConsultations(res.data)
      } else {
        setConsultations([])
      }
    } catch (err) {
      setError('Could not connect to backend server. Make sure port 5000 is running.')
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    loadLeads()
  }, [])

  // Handle changing status inline in table
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await updateConsultationStatus(id, newStatus)
      if (res && res.success) {
        setConsultations((prev) =>
          prev.map((c) => (c._id === id || c.ticketNumber === id ? { ...c, status: newStatus } : c))
        )
      }
    } catch (err) {
      alert('Failed to update status')
    }
  }

  // Open Edit Modal with selected lead data
  const handleStartEdit = (lead) => {
    setEditingLead(lead)
    setEditFormData({
      fullName: lead.fullName || '',
      phone: lead.phone || '',
      email: lead.email || '',
      propertyType: lead.propertyType || 'Residential Rooftop',
      monthlyBill: lead.monthlyBill || '$200 - $500',
      status: lead.status || 'pending',
      notes: lead.notes || ''
    })
    setEditSuccessMsg('')
  }

  const handleEditChange = (e) => {
    const { name, value } = e.target
    setEditFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Save changes to MongoDB Atlas
  const handleSaveEdit = async (e) => {
    e.preventDefault()
    setIsSavingEdit(true)

    const id = editingLead._id || editingLead.ticketNumber
    const res = await updateConsultation(id, editFormData)
    setIsSavingEdit(false)

    if (res && res.success && res.data) {
      // Update in local state
      setConsultations((prev) =>
        prev.map((c) => (c._id === id || c.ticketNumber === id ? res.data : c))
      )
      setEditSuccessMsg('Lead details updated successfully!')
      setTimeout(() => {
        setEditingLead(null)
      }, 700)
    } else {
      alert(res?.message || 'Failed to update lead')
    }
  }

  // Handle deleting a lead
  const handleDelete = async (id, ticketNumber) => {
    if (!window.confirm(`Are you sure you want to delete lead ${ticketNumber}?`)) {
      return
    }

    try {
      const res = await deleteConsultation(id)
      if (res && res.success) {
        setConsultations((prev) => prev.filter((c) => c._id !== id && c.ticketNumber !== id))
      }
    } catch (err) {
      alert('Failed to delete lead')
    }
  }

  // Filter calculations
  const filteredLeads = consultations.filter((item) => {
    const matchesSearch =
      (item.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').includes(searchTerm) ||
      (item.ticketNumber || '').toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // KPI metrics
  const totalCount = consultations.length
  const pendingCount = consultations.filter((c) => (c.status || 'pending') === 'pending').length
  const approvedCount = consultations.filter((c) => c.status === 'approved' || c.status === 'completed').length
  const rejectedCount = consultations.filter((c) => c.status === 'rejected' || c.status === 'cancelled').length
  const contactedCount = consultations.filter((c) => c.status === 'contacted' || c.status === 'scheduled').length

  // =========================================================================
  // ANALYTICS & GRAPH COMPUTATIONS
  // =========================================================================
  const totalForCalc = totalCount > 0 ? totalCount : 1
  const approvalRate = Math.round((approvedCount / totalForCalc) * 100)

  // 1. Line Chart Data (Weekly Flow Trend)
  const days = [
    { label: 'Mon', dayNum: 1 },
    { label: 'Tue', dayNum: 2 },
    { label: 'Wed', dayNum: 3 },
    { label: 'Thu', dayNum: 4 },
    { label: 'Fri', dayNum: 5 },
    { label: 'Sat', dayNum: 6 },
    { label: 'Sun', dayNum: 0 }
  ]
  const timelineData = days.map((d) => {
    const count = consultations.filter((c) => {
      if (!c.createdAt) return false
      const date = new Date(c.createdAt)
      return date.getDay() === d.dayNum
    }).length
    return { label: d.label, count }
  })

  const maxTrend = Math.max(4, ...timelineData.map((d) => d.count))
  const lineMarginLeft = 40
  const linePlotW = 400
  const linePlotH = 100
  const lineBaseY = 140

  const linePoints = timelineData.map((d, i) => {
    const x = lineMarginLeft + i * (linePlotW / 6)
    const y = lineBaseY - (d.count / maxTrend) * linePlotH
    return { x, y, count: d.count, label: d.label }
  })

  const linePathD = linePoints.map((pt, i) => (i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`)).join(' ')
  const areaPathD = `${linePathD} L ${linePoints[linePoints.length - 1].x} ${lineBaseY} L ${linePoints[0].x} ${lineBaseY} Z`

  // 2. Vertical Bar Chart Data (Sector Column Distribution)
  const sectorBarData = [
    { 
      label: 'Residential', 
      short: 'Res Rooftop', 
      count: consultations.filter(c => (c.propertyType || '').toLowerCase().includes('residential')).length,
      gradId: 'barGradGreen'
    },
    { 
      label: 'Commercial', 
      short: 'Commercial', 
      count: consultations.filter(c => (c.propertyType || '').toLowerCase().includes('commercial')).length,
      gradId: 'barGradBlue'
    },
    { 
      label: 'Industrial', 
      short: 'Industrial', 
      count: consultations.filter(c => (c.propertyType || '').toLowerCase().includes('industrial')).length,
      gradId: 'barGradPurple'
    },
    { 
      label: 'Battery Storage', 
      short: 'Storage', 
      count: consultations.filter(c => (c.propertyType || '').toLowerCase().includes('battery') || (c.propertyType || '').toLowerCase().includes('storage')).length,
      gradId: 'barGradAmber'
    },
    { 
      label: 'Maintenance', 
      short: 'Maintenance', 
      count: consultations.filter(c => (c.propertyType || '').toLowerCase().includes('maintenance') || (c.propertyType || '').toLowerCase().includes('audit')).length,
      gradId: 'barGradCyan'
    }
  ]
  const maxSector = Math.max(4, ...sectorBarData.map(s => s.count))

  // 3. Donut SVG circumference for radius = 45 (2 * PI * 45 ≈ 282.74)
  const C = 282.74
  const strokeApproved = (approvedCount / totalForCalc) * C
  const strokePending = (pendingCount / totalForCalc) * C
  const strokeContacted = (contactedCount / totalForCalc) * C
  const strokeRejected = (rejectedCount / totalForCalc) * C

  const offsetApproved = 0
  const offsetPending = -strokeApproved
  const offsetContacted = -(strokeApproved + strokePending)
  const offsetRejected = -(strokeApproved + strokePending + strokeContacted)

  // 4. Bill Pipeline Ranges
  const billRangesList = [
    { range: '$3,000+', label: 'Commercial Scale', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.15)' },
    { range: '$1,200 - $3,000', label: 'Large Facility', color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.15)' },
    { range: '$500 - $1,200', label: 'Medium Rooftop / Villa', color: '#c084fc', bg: 'rgba(192, 132, 252, 0.15)' },
    { range: '$200 - $500', label: 'Average Residential', color: '#facc15', bg: 'rgba(250, 204, 21, 0.15)' },
    { range: 'Under $200', label: 'Entry Residential', color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)' }
  ]

  const billStats = billRangesList.map((br) => {
    const count = consultations.filter((c) => {
      const b = c.monthlyBill || ''
      if (br.range === '$3,000+') return b.includes('3,000+')
      if (br.range === '$1,200 - $3,000') return b.includes('1,200')
      if (br.range === '$500 - $1,200') return b.includes('500')
      if (br.range === '$200 - $500') return b.includes('200') && !b.includes('Under')
      if (br.range === 'Under $200') return b.includes('Under')
      return false
    }).length
    const pct = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0
    return { ...br, count, pct }
  })

  return (
    <div className="admin-dashboard">
      <div className="container">
        {/* Top Header */}
        <header className="admin-header">
          <div className="admin-brand-lockup">
            <div className="admin-badge-icon">
              <ShieldCheck size={24} />
            </div>
            <div className="admin-title-group">
              <h1>
                SolarPro Engineering Admin
                <span className="admin-db-pill">
                  <Database size={12} /> {dbStatus}
                </span>
              </h1>
              <p className="admin-subtitle">Live consultation leads fetched from MongoDB Atlas</p>
            </div>
          </div>

          <div className="admin-header-actions">
            <button 
              type="button" 
              className="admin-btn admin-btn-refresh" 
              onClick={loadLeads}
              disabled={isRefreshing}
            >
              <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Leads'}
            </button>

            {currentUser && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ 
                  background: 'rgba(34, 197, 94, 0.12)', 
                  border: '1px solid rgba(74, 222, 128, 0.3)', 
                  color: '#4ade80', 
                  padding: '0.45rem 0.75rem', 
                  borderRadius: '8px', 
                  fontSize: '0.825rem', 
                  fontWeight: 600,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <UserIcon size={14} /> {currentUser.role === 'customer' ? 'Client' : 'SolarPro Admin'}
                </span>
                {onLogout && (
                  <button 
                    type="button" 
                    className="admin-btn"
                    style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}
                    onClick={onLogout}
                    title="Sign Out"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                )}
              </div>
            )}

            <button type="button" className="admin-btn admin-btn-back" onClick={onBack}>
              <ArrowLeft size={16} /> Back to Website
            </button>
          </div>
        </header>

        {/* KPI Metrics Grid */}
        <section className="admin-stats-grid">
          <div className="admin-stat-card">
            <div className="stat-label">Total Leads Received</div>
            <div className="stat-value">{totalCount}</div>
            <div className="stat-desc">Consultation requests in MongoDB</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label">Pending Engineering Review</div>
            <div className="stat-value" style={{ color: '#facc15' }}>{pendingCount}</div>
            <div className="stat-desc">Awaiting first follow-up call</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label">Approved Proposals</div>
            <div className="stat-value" style={{ color: '#4ade80' }}>{approvedCount}</div>
            <div className="stat-desc">Approved site feasibility deals</div>
          </div>

          <div className="admin-stat-card">
            <div className="stat-label">Rejected / Declined</div>
            <div className="stat-value" style={{ color: '#f87171' }}>{rejectedCount}</div>
            <div className="stat-desc">Unviable roof or cancelled</div>
          </div>
        </section>

        {/* Toolbar & Filter Bar */}
        <div className="admin-toolbar">
          <div className="admin-search-box">
            <Search size={16} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by name, email, phone, or ticket..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-search-input"
            />
          </div>

          <div className="admin-filter-box">
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="admin-filter-select"
            >
              <option value="all">All Statuses ({totalCount})</option>
              <option value="pending">Pending ({pendingCount})</option>
              <option value="approved">Approved ({approvedCount})</option>
              <option value="rejected">Rejected ({rejectedCount})</option>
              <option value="contacted">In Contact</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Leads Table */}
        <div className="admin-table-card">
          {loading ? (
            <div className="admin-empty-state">
              <RefreshCw size={36} className="animate-spin admin-empty-icon" />
              <h3>Loading leads from MongoDB Atlas...</h3>
            </div>
          ) : error ? (
            <div className="admin-empty-state">
              <AlertCircle size={40} color="#ef4444" className="admin-empty-icon" />
              <h3>Failed to load database leads</h3>
              <p>{error}</p>
              <button type="button" className="admin-btn admin-btn-refresh" onClick={loadLeads} style={{ marginTop: '1rem' }}>
                Retry Connection
              </button>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="admin-empty-state">
              <Users size={40} className="admin-empty-icon" />
              <h3>No consultation leads found</h3>
              <p>When visitors submit the quote form on the website, they will appear here in real-time.</p>
            </div>
          ) : (
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Ticket ID</th>
                    <th>Customer Name & Contact</th>
                    <th>Property Type</th>
                    <th>Monthly Bill</th>
                    <th>Date Received</th>
                    <th>Workflow Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((item) => (
                    <tr key={item._id || item.ticketNumber}>
                      <td>
                        <span className="ticket-tag">{item.ticketNumber || 'N/A'}</span>
                      </td>

                      <td>
                        <span className="customer-name">{item.fullName}</span>
                        <a href={`mailto:${item.email}`} className="customer-email">
                          {item.email}
                        </a>
                        <a href={`tel:${item.phone}`} className="customer-phone">
                          {item.phone}
                        </a>
                        {item.notes && (
                          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem', fontStyle: 'italic' }}>
                            "{item.notes}"
                          </div>
                        )}
                      </td>

                      <td>
                        <span style={{ fontSize: '0.85rem' }}>{item.propertyType || 'Residential Rooftop'}</span>
                      </td>

                      <td>
                        <span style={{ fontWeight: 600, color: '#f1f5f9' }}>{item.monthlyBill || 'N/A'}</span>
                      </td>

                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Calendar size={13} />
                          {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </td>

                      <td>
                        <select
                          value={item.status || 'pending'}
                          onChange={(e) => handleStatusUpdate(item._id || item.ticketNumber, e.target.value)}
                          className={`status-pill-select status-${item.status || 'pending'}`}
                        >
                          <option value="pending">🟡 Pending</option>
                          <option value="approved">🟢 Approved</option>
                          <option value="rejected">🔴 Rejected</option>
                          <option value="contacted">🔵 Contacted</option>
                          <option value="scheduled">🟣 Scheduled</option>
                          <option value="completed">✅ Completed</option>
                        </select>
                      </td>

                      <td style={{ textAlign: 'center' }}>
                        <div className="table-action-group">
                          {/* Quick Approve Button */}
                          <button
                            type="button"
                            className="btn-approve-lead"
                            title="Approve Lead (Quick Action)"
                            onClick={() => handleStatusUpdate(item._id || item.ticketNumber, 'approved')}
                          >
                            <Check size={16} />
                          </button>

                          {/* Quick Reject Button */}
                          <button
                            type="button"
                            className="btn-reject-lead"
                            title="Reject Lead (Quick Action)"
                            onClick={() => handleStatusUpdate(item._id || item.ticketNumber, 'rejected')}
                          >
                            <X size={16} />
                          </button>

                          {/* Edit Button */}
                          <button
                            type="button"
                            className="btn-edit-lead"
                            title="Edit Lead Details"
                            onClick={() => handleStartEdit(item)}
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Delete Button */}
                          <button
                            type="button"
                            className="btn-delete-lead"
                            title="Delete Lead"
                            onClick={() => handleDelete(item._id || item.ticketNumber, item.ticketNumber)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* ====================================================================
            ANALYTICS: LINE GRAPH & BAR GRAPH SECTION (BELOW TABLE)
            ==================================================================== */}
        <section className="admin-charts-section" style={{ marginTop: '2.5rem' }}>
          <div className="charts-section-header">
            <h2 className="charts-section-title">
              <Activity size={20} color="#4ade80" /> Visual Line & Bar Analytics (MongoDB Real-Time)
            </h2>
            <button 
              type="button" 
              className="charts-toggle-btn"
              onClick={() => setShowCharts(!showCharts)}
            >
              {showCharts ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
              {showCharts ? 'Hide Visual Graphs' : 'Show Visual Graphs'}
            </button>
          </div>

          {showCharts && (
            <div className="admin-charts-grid">
              {/* GRAPH 1: SVG LINE GRAPH (Weekly Inquiries Flow) */}
              <div className="admin-chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">
                    <TrendingUp size={18} color="#22c55e" /> Weekly Inquiry Flow (Line Graph)
                  </h3>
                  <span className="chart-badge">7-Day Trend</span>
                </div>

                <div className="chart-svg-container">
                  <svg viewBox="0 0 460 170">
                    <defs>
                      <linearGradient id="lineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#22c55e" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="30" y1="40" x2="445" y2="40" className="chart-grid-line" />
                    <line x1="30" y1="90" x2="445" y2="90" className="chart-grid-line" />
                    <line x1="30" y1="140" x2="445" y2="140" stroke="rgba(255,255,255,0.18)" />

                    {/* Y-Axis Value Labels */}
                    <text x="18" y="44" className="chart-axis-text">{maxTrend}</text>
                    <text x="18" y="94" className="chart-axis-text">{Math.round(maxTrend / 2)}</text>
                    <text x="18" y="144" className="chart-axis-text">0</text>

                    {/* Glowing Area Fill Under Curve */}
                    <path d={areaPathD} fill="url(#lineAreaGrad)" />

                    {/* Neon Stroke Line Path */}
                    <path d={linePathD} className="chart-line-path" />

                    {/* Glowing Circular Points */}
                    {linePoints.map((pt) => (
                      <g key={pt.label}>
                        <circle cx={pt.x} cy={pt.y} r="5" className="chart-dot" />
                        <text x={pt.x} y={pt.y - 10} className="chart-bar-val">
                          {pt.count}
                        </text>
                        <text x={pt.x} y="160" textAnchor="middle" className="chart-axis-text">
                          {pt.label}
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              </div>

              {/* GRAPH 2: VERTICAL BAR GRAPH (Sector Volume Distribution) */}
              <div className="admin-chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">
                    <BarChart3 size={18} color="#38bdf8" /> Sector Demand (Vertical Bar Graph)
                  </h3>
                  <span className="chart-badge">Category Columns</span>
                </div>

                <div className="chart-svg-container">
                  <svg viewBox="0 0 460 170">
                    <defs>
                      <linearGradient id="barGradGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4ade80" />
                        <stop offset="100%" stopColor="#16a34a" />
                      </linearGradient>
                      <linearGradient id="barGradBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#38bdf8" />
                        <stop offset="100%" stopColor="#0284c7" />
                      </linearGradient>
                      <linearGradient id="barGradPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#c084fc" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                      <linearGradient id="barGradAmber" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                      <linearGradient id="barGradCyan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2dd4bf" />
                        <stop offset="100%" stopColor="#0d9488" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Grid lines */}
                    <line x1="30" y1="40" x2="445" y2="40" className="chart-grid-line" />
                    <line x1="30" y1="90" x2="445" y2="90" className="chart-grid-line" />
                    <line x1="30" y1="140" x2="445" y2="140" stroke="rgba(255,255,255,0.18)" />

                    {/* Y-Axis Value Labels */}
                    <text x="18" y="44" className="chart-axis-text">{maxSector}</text>
                    <text x="18" y="94" className="chart-axis-text">{Math.round(maxSector / 2)}</text>
                    <text x="18" y="144" className="chart-axis-text">0</text>

                    {/* Vertical Column Bars */}
                    {sectorBarData.map((item, idx) => {
                      const barW = 38
                      const barX = 45 + idx * 80
                      const barH = Math.max(item.count > 0 ? (item.count / maxSector) * 105 : 3, 3)
                      const barY = 140 - barH

                      return (
                        <g key={item.label}>
                          <rect
                            x={barX}
                            y={barY}
                            width={barW}
                            height={barH}
                            rx="6"
                            ry="6"
                            fill={`url(#${item.gradId})`}
                            className="chart-bar-rect"
                          />
                          <text x={barX + barW / 2} y={barY - 6} className="chart-bar-val">
                            {item.count}
                          </text>
                          <text x={barX + barW / 2} y="160" textAnchor="middle" className="chart-axis-text">
                            {item.short}
                          </text>
                        </g>
                      )
                    })}
                  </svg>
                </div>
              </div>

              {/* GRAPH 3: DONUT CHART (Approval & Status Funnel) */}
              <div className="admin-chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">
                    <PieChart size={18} color="#c084fc" /> Status Funnel (Donut)
                  </h3>
                  <span className="chart-badge">{totalCount} Leads</span>
                </div>

                <div className="donut-chart-container">
                  <div className="donut-svg-wrapper">
                    <svg width="160" height="160" viewBox="0 0 120 120">
                      <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="transparent"
                        stroke="rgba(255, 255, 255, 0.08)"
                        strokeWidth="14"
                      />

                      {totalCount > 0 && (
                        <>
                          {approvedCount > 0 && (
                            <circle
                              cx="60"
                              cy="60"
                              r="45"
                              fill="transparent"
                              stroke="#22c55e"
                              strokeWidth="14"
                              strokeDasharray={`${strokeApproved} ${C}`}
                              strokeDashoffset={offsetApproved}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                              style={{ transition: 'all 0.6s ease' }}
                            />
                          )}

                          {pendingCount > 0 && (
                            <circle
                              cx="60"
                              cy="60"
                              r="45"
                              fill="transparent"
                              stroke="#eab308"
                              strokeWidth="14"
                              strokeDasharray={`${strokePending} ${C}`}
                              strokeDashoffset={offsetPending}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                              style={{ transition: 'all 0.6s ease' }}
                            />
                          )}

                          {contactedCount > 0 && (
                            <circle
                              cx="60"
                              cy="60"
                              r="45"
                              fill="transparent"
                              stroke="#38bdf8"
                              strokeWidth="14"
                              strokeDasharray={`${strokeContacted} ${C}`}
                              strokeDashoffset={offsetContacted}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                              style={{ transition: 'all 0.6s ease' }}
                            />
                          )}

                          {rejectedCount > 0 && (
                            <circle
                              cx="60"
                              cy="60"
                              r="45"
                              fill="transparent"
                              stroke="#ef4444"
                              strokeWidth="14"
                              strokeDasharray={`${strokeRejected} ${C}`}
                              strokeDashoffset={offsetRejected}
                              strokeLinecap="round"
                              transform="rotate(-90 60 60)"
                              style={{ transition: 'all 0.6s ease' }}
                            />
                          )}
                        </>
                      )}
                    </svg>

                    <div className="donut-center-text">
                      <div className="donut-center-val">{approvalRate}%</div>
                      <div className="donut-center-sub">Approved</div>
                    </div>
                  </div>

                  <div className="donut-legend-grid">
                    <div className="donut-legend-item">
                      <div className="donut-legend-left">
                        <span className="donut-legend-dot" style={{ background: '#22c55e' }}></span>
                        <span>Approved</span>
                      </div>
                      <span className="donut-legend-count">{approvedCount}</span>
                    </div>

                    <div className="donut-legend-item">
                      <div className="donut-legend-left">
                        <span className="donut-legend-dot" style={{ background: '#eab308' }}></span>
                        <span>Pending</span>
                      </div>
                      <span className="donut-legend-count">{pendingCount}</span>
                    </div>

                    <div className="donut-legend-item">
                      <div className="donut-legend-left">
                        <span className="donut-legend-dot" style={{ background: '#38bdf8' }}></span>
                        <span>In Contact</span>
                      </div>
                      <span className="donut-legend-count">{contactedCount}</span>
                    </div>

                    <div className="donut-legend-item">
                      <div className="donut-legend-left">
                        <span className="donut-legend-dot" style={{ background: '#ef4444' }}></span>
                        <span>Rejected</span>
                      </div>
                      <span className="donut-legend-count">{rejectedCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* GRAPH 4: BILL VALUE PIPELINE */}
              <div className="admin-chart-card">
                <div className="chart-header">
                  <h3 className="chart-title">
                    <Zap size={18} color="#facc15" /> Power Bill Value Pipeline
                  </h3>
                  <span className="chart-badge">Deal Capacity</span>
                </div>

                <div className="bill-pipeline-grid">
                  {billStats.map((item) => (
                    <div key={item.range} className="bill-pipeline-card">
                      <div className="bill-left">
                        <div className="bill-icon-badge" style={{ background: item.bg, color: item.color }}>
                          $
                        </div>
                        <div>
                          <div className="bill-range-title">{item.range}</div>
                          <div className="bill-lead-count">{item.label}</div>
                        </div>
                      </div>
                      <div className="bill-right">
                        <div className="bill-est-val">{item.count} Leads</div>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{item.pct}% of total</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* ====================================================================
          EDIT LEAD MODAL
          ==================================================================== */}
      {editingLead && (
        <div className="admin-modal-overlay" onClick={() => setEditingLead(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <Edit2 size={18} color="#4ade80" /> Edit Lead
                <span className="modal-ticket-badge">{editingLead.ticketNumber}</span>
              </h3>
              <button 
                type="button" 
                className="modal-close-btn"
                onClick={() => setEditingLead(null)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                {editSuccessMsg && (
                  <div className="modal-success-banner">
                    <Check size={16} /> {editSuccessMsg}
                  </div>
                )}

                <div className="modal-form-grid">
                  <div className="modal-field">
                    <label className="modal-label">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={editFormData.fullName}
                      onChange={handleEditChange}
                      className="modal-input"
                    />
                  </div>

                  <div className="modal-field">
                    <label className="modal-label">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="modal-input"
                    />
                  </div>
                </div>

                <div className="modal-field">
                  <label className="modal-label">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={editFormData.email}
                    onChange={handleEditChange}
                    className="modal-input"
                  />
                </div>

                <div className="modal-form-grid">
                  <div className="modal-field">
                    <label className="modal-label">Property Type</label>
                    <select
                      name="propertyType"
                      value={editFormData.propertyType}
                      onChange={handleEditChange}
                      className="modal-select"
                    >
                      <option value="Residential Rooftop">Residential Rooftop</option>
                      <option value="Commercial Enterprise">Commercial Enterprise</option>
                      <option value="Industrial / Ground-Mount">Industrial / Ground-Mount</option>
                      <option value="Battery Storage Expansion">Battery Storage Expansion</option>
                      <option value="Solar Maintenance & Audit">Solar Maintenance & Audit</option>
                    </select>
                  </div>

                  <div className="modal-field">
                    <label className="modal-label">Average Monthly Bill</label>
                    <select
                      name="monthlyBill"
                      value={editFormData.monthlyBill}
                      onChange={handleEditChange}
                      className="modal-select"
                    >
                      <option value="Under $200">Under $200 / month</option>
                      <option value="$200 - $500">$200 – $500 / month</option>
                      <option value="$500 - $1,200">$500 – $1,200 / month</option>
                      <option value="$1,200 - $3,000">$1,200 – $3,000 / month</option>
                      <option value="$3,000+">$3,000+ / Commercial Scale</option>
                    </select>
                  </div>
                </div>

                <div className="modal-field">
                  <label className="modal-label">Workflow Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditChange}
                    className="modal-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="contacted">Contacted</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="modal-field">
                  <label className="modal-label">Notes & Remarks</label>
                  <textarea
                    name="notes"
                    rows={3}
                    placeholder="Engineering notes, customer preferences..."
                    value={editFormData.notes}
                    onChange={handleEditChange}
                    className="modal-textarea"
                  ></textarea>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="modal-btn-cancel"
                  onClick={() => setEditingLead(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingEdit}
                  className="modal-btn-save"
                >
                  <Save size={16} />
                  {isSavingEdit ? 'Saving to Database...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
