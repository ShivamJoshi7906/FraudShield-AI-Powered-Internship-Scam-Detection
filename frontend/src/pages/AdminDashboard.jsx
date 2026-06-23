import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AlertCard from '../components/AlertCard'
import {
  Users, Scan, AlertTriangle, Building2, Search, Trash2, Eye,
  Plus, TrendingUp, Shield, BarChart3, Settings as SettingsIcon,
  CheckCircle, XCircle, Bell
} from 'lucide-react'
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts'

const API = 'http://localhost:5000'

// ─── Sub Pages ───
function AdminHome({ blacklist }) {
  const [stats, setStats] = useState({ total_users: 0, total_scans: 0, fraud_detected: 0, blacklisted: 0 })
  const [charts, setCharts] = useState({ fraud_vs_safe: [], monthly_scans: [] })

  useEffect(() => {
    fetch(`${API}/stats`).then(r => r.json()).then(setStats).catch(console.error)
    fetch(`${API}/analytics`).then(r => r.json()).then(setCharts).catch(console.error)
  }, [])

  const topStats = [
    { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Total Scans', value: stats.total_scans, icon: Scan, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Fraud Detected', value: stats.fraud_detected, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Blacklisted', value: stats.blacklisted, icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-card">
        <div className="absolute right-0 top-0 w-48 h-48 bg-primary-50/50 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-primary-600 text-sm font-semibold mb-1">Admin Portal</p>
          <h2 className="text-2xl font-extrabold text-gray-900">FraudShield Control Center</h2>
          <p className="text-gray-500 text-sm mt-1">Monitor, manage, and protect the platform</p>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topStats.map(s => (
          <div key={s.label} className="stat-card">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center shrink-0`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-extrabold text-gray-900">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Fraud vs Safe — Monthly</h3>
          {charts.fraud_vs_safe.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={charts.fraud_vs_safe}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Legend />
                <Bar dataKey="fraud" fill="#ef4444" radius={[4,4,0,0]} />
                <Bar dataKey="safe" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-16">No scan data yet. Run some predictions to see charts.</p>}
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Scans</h3>
          {charts.monthly_scans.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={charts.monthly_scans}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} />
                <Tooltip /><Line type="monotone" dataKey="scans" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-sm text-center py-16">No scan data yet.</p>}
        </div>
      </div>
    </div>
  )
}


function UsersPage() {
  const [users, setUsers] = useState([])
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [addLoading, setAddLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API}/users`)
      if (res.ok) setUsers(await res.json())
    } catch (err) { console.error('Failed to fetch users:', err) }
  }

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API}/admins`)
      if (res.ok) setAdmins(await res.json())
    } catch (err) { console.error('Failed to fetch admins:', err) }
  }

  useEffect(() => {
    fetchUsers()
    fetchAdmins()
  }, [])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setAddLoading(true)
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, role: 'admin' })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create admin.')
        setAddLoading(false)
        return
      }
      // Reload the full list from MongoDB to stay in sync
      await fetchAdmins()
      setForm({ name: '', email: '', password: '' })
      setSuccessMsg(`Admin "${data.user.name}" created successfully!`)
    } catch (err) {
      setError('Cannot connect to the server. Make sure the backend is running.')
    }
    setAddLoading(false)
  }

  const handleDeleteAdmin = (id) => {
    if (id === 'admin-default') {
      alert('Default admin cannot be deleted.')
      return
    }
    setAdmins(prev => prev.filter(a => a.id !== id))
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-500 text-sm">Manage student users and administrators</p>
      </div>

      {/* Admins Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900">Platform Administrators</h3>
          <div className="card overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="table-header">Name</th>
                    <th className="table-header">Email</th>
                    <th className="table-header">Joined</th>
                    <th className="table-header">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {admins.map(admin => (
                    <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="table-cell font-medium text-gray-900">{admin.name}</td>
                      <td className="table-cell">{admin.email}</td>
                      <td className="table-cell text-gray-500">{admin.joined}</td>
                      <td className="table-cell">
                        {admin.id !== 'admin-default' ? (
                          <button
                            onClick={() => handleDeleteAdmin(admin.id)}
                            className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400 font-medium">System Default</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Add Admin Form */}
        <div className="card h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary-600" /> Add New Admin
          </h3>
          {error && (
            <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 p-2.5 rounded-lg">
              {error}
            </div>
          )}
          {successMsg && (
            <div className="mb-4 text-xs text-emerald-700 bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg">
              {successMsg}
            </div>
          )}
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="label">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Rahul Kumar"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Email Address</label>
              <input
                type="email"
                className="input-field"
                placeholder="admin.email@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="Set secure password"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                required
              />
            </div>
            <button type="submit" disabled={addLoading} className="btn-primary w-full text-sm">
              {addLoading ? 'Creating...' : 'Create Admin Account'}
            </button>
          </form>
        </div>
      </div>

      {/* Regular Users List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900">Registered Student Users</h3>
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header">Name</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Role</th>
                  <th className="table-header">Joined</th>
                  <th className="table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell font-medium text-gray-900">{u.name}</td>
                    <td className="table-cell">{u.email}</td>
                    <td className="table-cell"><span className="badge-safe">{u.role}</span></td>
                    <td className="table-cell text-gray-500">{u.joined}</td>
                    <td className="table-cell">
                      <div className="flex gap-2">
                        <button className="p-1.5 rounded-lg hover:bg-primary-50 text-primary-600"><Eye className="w-4 h-4" /></button>
                        <button onClick={async () => { try { const res = await fetch(`${API}/users/${u.id}`, { method: 'DELETE' }); if (res.ok) fetchUsers() } catch(err) { console.error(err) } }} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScanHistoryPage() {
  const [q, setQ] = useState('')
  const [scans, setScans] = useState([])

  useEffect(() => {
    fetch(`${API}/history`).then(r => r.json()).then(setScans).catch(console.error)
  }, [])

  const filtered = scans.filter(s => 
    (s.text || '').toLowerCase().includes(q.toLowerCase()) ||
    (s.company_name || '').toLowerCase().includes(q.toLowerCase()) ||
    (s.user_name || '').toLowerCase().includes(q.toLowerCase())
  )
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Scan History</h2>
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input className="input-field pl-10" placeholder="Search by user, company, or text..." value={q} onChange={e => setQ(e.target.value)} />
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header">User</th>
                <th className="table-header">Company</th>
                <th className="table-header">Prediction</th>
                <th className="table-header">Confidence</th>
                <th className="table-header">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(s => {
                const isFraud = s.prediction === '1'
                return (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell font-medium text-gray-900">{s.user_name || 'Anonymous'}</td>
                    <td className="table-cell font-medium text-gray-700">{s.company_name || 'Unknown Company'}</td>
                    <td className="table-cell"><span className={isFraud ? 'badge-fraud' : 'badge-safe'}>{isFraud ? '🚨 FRAUD' : '✅ SAFE'}</span></td>
                    <td className="table-cell">{s.confidence != null ? s.confidence + '%' : 'N/A'}</td>
                    <td className="table-cell text-gray-500">{s.created_at ? s.created_at.split('T')[0] : ''}</td>
                  </tr>
                )
              })}
              {filtered.length === 0 && <tr><td colSpan={5} className="table-cell text-center text-gray-400 py-8">No scan records found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function BlacklistPage({ blacklist, onAdd, onDelete }) {
  const [form, setForm] = useState({ company: '', reason: '', risk: 'HIGH' })
  const addCompany = () => {
    if (!form.company || !form.reason) return
    const newItem = {
      id: Date.now(),
      name: form.company,
      company: form.company,
      risk: form.risk,
      status: form.risk === 'HIGH' ? 'Blacklisted' : 'Suspicious',
      reason: form.reason,
      date: new Date().toISOString().split('T')[0]
    }
    onAdd(newItem)
    setForm({ company: '', reason: '', risk: 'HIGH' })
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Blacklist Manager</h2>
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-primary-600" /> Add Company</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          <input className="input-field" placeholder="Company Name" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
          <input className="input-field" placeholder="Reason" value={form.reason} onChange={e => setForm(f => ({ ...f, reason: e.target.value }))} />
          <select className="input-field" value={form.risk} onChange={e => setForm(f => ({ ...f, risk: e.target.value }))}>
            <option value="HIGH">High Risk</option><option value="MEDIUM">Medium Risk</option><option value="LOW">Low Risk</option>
          </select>
        </div>
        <button onClick={addCompany} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4" /> Add To Blacklist</button>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header">Company</th>
                <th className="table-header">Risk</th>
                <th className="table-header">Reason</th>
                <th className="table-header">Date</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blacklist.map(b => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell font-medium text-gray-900">{b.name || b.company}</td>
                  <td className="table-cell"><span className={b.risk === 'HIGH' ? 'badge-fraud' : b.risk === 'MEDIUM' ? 'badge-medium' : 'badge-safe'}>{b.risk}</span></td>
                  <td className="table-cell">{b.reason}</td>
                  <td className="table-cell text-gray-500">{b.date}</td>
                  <td className="table-cell">
                    <button onClick={() => onDelete(b.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function AdminAlertsPage({ alerts, onPublish, onDelete }) {
  const [form, setForm] = useState({ title: '', message: '', severity: 'high' })
  const publish = () => {
    if (!form.title || !form.message) return
    const newAlert = {
      id: Date.now(),
      title: form.title,
      message: form.message,
      severity: form.severity,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin'
    }
    onPublish(newAlert)
    setForm({ title: '', message: '', severity: 'high' })
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Community Alerts</h2>
      <div className="card">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-primary-600" /> Publish Alert</h3>
        <div className="space-y-3 mb-4">
          <input className="input-field" placeholder="Alert Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          <textarea className="input-field min-h-[80px] resize-none" placeholder="Alert Message" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
          <select className="input-field" value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))}>
            <option value="high">🚨 High Severity</option>
            <option value="medium">⚠️ Medium Severity</option>
            <option value="low">ℹ️ Low Severity</option>
          </select>
        </div>
        <button onClick={publish} className="btn-primary flex items-center gap-2"><Bell className="w-4 h-4" /> Publish Alert</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map(a => (
          <div key={a.id} className="relative group">
            <AlertCard alert={a} />
            <button
              onClick={() => onDelete(a.id)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/80 hover:bg-red-50 text-red-500 border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Delete Alert"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

function AnalyticsPage() {
  const [data, setData] = useState({ fraud_vs_safe: [], monthly_scans: [], top_scam_companies: [], risk_distribution: [] })

  useEffect(() => {
    fetch(`${API}/analytics`).then(r => r.json()).then(setData).catch(console.error)
  }, [])

  const noData = <p className="text-gray-400 text-sm text-center py-16">No data available yet.</p>
  return (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Fraud vs Safe</h3>
          {data.fraud_vs_safe.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.fraud_vs_safe}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Legend />
                <Bar dataKey="fraud" fill="#ef4444" radius={[4,4,0,0]} /><Bar dataKey="safe" fill="#10b981" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : noData}
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Monthly Scans</h3>
          {data.monthly_scans.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={data.monthly_scans}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip />
                <Line type="monotone" dataKey="scans" stroke="#7c3aed" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : noData}
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Top Flagged Texts</h3>
          {data.top_scam_companies.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={data.top_scam_companies} layout="vertical"><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} /><YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={80} /><Tooltip />
                <Bar dataKey="reports" fill="#7c3aed" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : noData}
        </div>
        <div className="card">
          <h3 className="font-bold text-gray-900 mb-4">Risk Distribution</h3>
          {data.risk_distribution.some(d => d.value > 0) ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={data.risk_distribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {data.risk_distribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : noData}
        </div>
      </div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
      <div className="card space-y-5">
        {['Platform Name', 'Admin Email', 'AI Model Version'].map((label, i) => (
          <div key={label}>
            <label className="label">{label}</label>
            <input className="input-field" defaultValue={['FraudShield', 'admin@fraudshield.com', 'v2.4.1'][i]} />
          </div>
        ))}
        <button className="btn-primary">Save Settings</button>
      </div>
    </div>
  )
}

// ─── Main Layout ───
export default function AdminDashboard() {
  const [blacklist, setList] = useState([])
  const [alerts, setAlerts] = useState([])

  // Fetch from MongoDB on mount
  const fetchBlacklist = async () => {
    try {
      const res = await fetch(`${API}/blacklist`)
      if (res.ok) setList(await res.json())
    } catch (err) { console.error('Failed to fetch blacklist:', err) }
  }

  const fetchAlerts = async () => {
    try {
      const res = await fetch(`${API}/alerts`)
      if (res.ok) setAlerts(await res.json())
    } catch (err) { console.error('Failed to fetch alerts:', err) }
  }

  useEffect(() => {
    fetchBlacklist()
    fetchAlerts()
  }, [])

  const handleAddCompany = async (newCompany) => {
    try {
      const res = await fetch(`${API}/blacklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company: newCompany.company, reason: newCompany.reason, risk: newCompany.risk })
      })
      if (res.ok) await fetchBlacklist()
    } catch (err) { console.error('Failed to add to blacklist:', err) }
  }

  const handleDeleteCompany = async (id) => {
    try {
      const res = await fetch(`${API}/blacklist/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchBlacklist()
    } catch (err) { console.error('Failed to delete from blacklist:', err) }
  }

  const handlePublishAlert = async (newAlert) => {
    try {
      const res = await fetch(`${API}/alerts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newAlert.title, message: newAlert.message, severity: newAlert.severity })
      })
      if (res.ok) await fetchAlerts()
    } catch (err) { console.error('Failed to publish alert:', err) }
  }

  const handleDeleteAlert = async (id) => {
    try {
      const res = await fetch(`${API}/alerts/${id}`, { method: 'DELETE' })
      if (res.ok) await fetchAlerts()
    } catch (err) { console.error('Failed to delete alert:', err) }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar role="admin" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <Routes>
            <Route index element={<AdminHome blacklist={blacklist} />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="scans" element={<ScanHistoryPage />} />
            <Route path="blacklist" element={<BlacklistPage blacklist={blacklist} onAdd={handleAddCompany} onDelete={handleDeleteCompany} />} />
            <Route path="alerts" element={<AdminAlertsPage alerts={alerts} onPublish={handlePublishAlert} onDelete={handleDeleteAlert} />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
