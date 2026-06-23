import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import ScanCard from '../components/ScanCard'
import ResultCard from '../components/ResultCard'
import AlertCard from '../components/AlertCard'
import {
  Scan, TrendingUp, Shield, AlertTriangle, CheckCircle, XCircle,
  Building2, Search, User, Bell, Clock, ChevronRight, Zap
} from 'lucide-react'



const defaultHistory = [
  { id: 1, company: 'TechSoft Solutions', prediction: 'FRAUD', confidence: '94.2%', date: '2025-06-18', risk: 'HIGH' },
  { id: 2, company: 'Infosys Internship', prediction: 'SAFE', confidence: '97.8%', date: '2025-06-17', risk: 'LOW' },
  { id: 3, company: 'DataVision Corp', prediction: 'FRAUD', confidence: '88.5%', date: '2025-06-15', risk: 'HIGH' },
  { id: 4, company: 'Wipro Digital', prediction: 'SAFE', confidence: '95.1%', date: '2025-06-14', risk: 'LOW' },
  { id: 5, company: 'StartupXYZ Ventures', prediction: 'FRAUD', confidence: '76.3%', date: '2025-06-12', risk: 'MEDIUM' },
]

function DashboardHome({ user, scanResult, handleScanResult, history, alerts }) {
  const stats = [
    { label: 'Total Scans', value: history.length, icon: Scan, color: 'text-primary-600', bg: 'bg-primary-50' },
    { label: 'Fraud Detected', value: history.filter(h => h.prediction === 'FRAUD').length, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
    { label: 'Safe Found', value: history.filter(h => h.prediction === 'SAFE').length, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Accuracy Rate', value: '96.4%', icon: TrendingUp, color: 'text-violet-600', bg: 'bg-violet-50' },
  ]

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 relative overflow-hidden shadow-card">
        <div className="absolute right-0 top-0 w-48 h-48 bg-primary-50/50 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative">
          <p className="text-primary-600 text-sm font-semibold mb-1">Welcome back 👋</p>
          <h2 className="text-2xl font-extrabold text-gray-900 mb-1">{user?.name || 'User'}</h2>
          <p className="text-gray-500 text-sm">Stay protected · Scan any internship posting in seconds</p>
          <div className="flex gap-3 mt-4">
            <div className="bg-primary-50 text-primary-700 rounded-xl px-3 py-2 text-sm font-medium border border-primary-100">
              <span className="font-bold">{history.length}</span> scans done
            </div>
            <div className="bg-red-50 text-red-700 rounded-xl px-3 py-2 text-sm font-medium border border-red-100">
              <span className="font-bold">{history.filter(h => h.prediction === 'FRAUD').length}</span> frauds caught
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
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

      {/* Scanner + Result */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScanCard onResult={handleScanResult} />
        {scanResult ? (
          <ResultCard result={scanResult} />
        ) : (
          <div className="card flex flex-col items-center justify-center text-center min-h-[300px] border-dashed border-2">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-gray-300" />
            </div>
            <p className="font-semibold text-gray-500 mb-1">Analysis Results</p>
            <p className="text-sm text-gray-400">Scan an internship to see detailed results here</p>
          </div>
        )}
      </div>

      {/* Community Alerts */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="section-title">Community Alerts</h3>
            <p className="section-subtitle !mb-0">Latest scam warnings from our community</p>
          </div>
          <span className="badge-fraud">{alerts.filter(a => a.severity === 'high').length} High Risk</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {alerts.slice(0, 4).map(alert => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </div>
      </div>

      {/* Recent Scans */}
      <div>
        <h3 className="section-title">Recent Scan History</h3>
        <p className="section-subtitle">Your last {history.length} analyses</p>
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="table-header">Company</th>
                  <th className="table-header">Prediction</th>
                  <th className="table-header">Confidence</th>
                  <th className="table-header">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.slice(0, 5).map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="table-cell font-medium text-gray-900">{row.company}</td>
                    <td className="table-cell">
                      <span className={row.prediction === 'FRAUD' ? 'badge-fraud' : 'badge-safe'}>
                        {row.prediction === 'FRAUD' ? '🚨 FRAUD' : '✅ SAFE'}
                      </span>
                    </td>
                    <td className="table-cell text-gray-700">{row.confidence}</td>
                    <td className="table-cell text-gray-500">{row.date}</td>
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

function ScanPage({ onScan }) {
  const [result, setResult] = useState(null)
  const handleResult = (res) => {
    setResult(res)
    if (res) {
      onScan(res)
    }
  }
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="section-title text-2xl">Scan Internship</h2>
        <p className="section-subtitle">Paste text, upload a PDF, or image to analyze</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ScanCard onResult={handleResult} />
        {result ? <ResultCard result={result} /> : (
          <div className="card flex flex-col items-center justify-center text-center min-h-[320px] border-2 border-dashed">
            <Zap className="w-12 h-12 text-gray-200 mb-4" />
            <p className="font-semibold text-gray-400">Results will appear here</p>
            <p className="text-sm text-gray-400 mt-1">Try pasting an internship description</p>
          </div>
        )}
      </div>
    </div>
  )
}

function CompanyCheckPage({ blacklist }) {
  const [query, setQuery] = useState('')
  const filtered = blacklist.filter(c => 
    (c.name || c.company || '').toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="section-title text-2xl">Company Check</h2>
        <p className="section-subtitle">Search our database for blacklisted companies</p>
      </div>
      <div className="card">
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search company name..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            id="company-search"
          />
        </div>
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-2" />
              <p className="text-gray-500 font-medium">No blacklisted companies found</p>
              <p className="text-gray-400 text-sm mt-1">This company appears to be clean</p>
            </div>
          ) : filtered.map((c, i) => (
            <div key={i} className={`flex items-center justify-between p-4 rounded-xl border ${c.risk === 'HIGH' ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.risk === 'HIGH' ? 'bg-red-100' : 'bg-amber-100'}`}>
                  <Building2 className={`w-5 h-5 ${c.risk === 'HIGH' ? 'text-red-600' : 'text-amber-600'}`} />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{c.name || c.company}</p>
                  <p className="text-xs text-gray-500">{c.reason}</p>
                </div>
              </div>
              <span className={c.risk === 'HIGH' ? 'badge-fraud' : 'badge-medium'}>{c.status || 'Blacklisted'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function AlertsPage({ alerts }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="section-title text-2xl">Community Alerts</h2>
        <p className="section-subtitle">Real-time warnings from the FraudShield community</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {alerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
      </div>
    </div>
  )
}

function HistoryPage({ history }) {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="section-title text-2xl">Scan History</h2>
        <p className="section-subtitle">All your previous internship analyses</p>
      </div>
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="table-header">#</th>
                <th className="table-header">Company</th>
                <th className="table-header">Prediction</th>
                <th className="table-header">Confidence</th>
                <th className="table-header">Risk</th>
                <th className="table-header">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.map((row, index) => (
                <tr key={row.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="table-cell text-gray-400">{history.length - index}</td>
                  <td className="table-cell font-medium text-gray-900">{row.company}</td>
                  <td className="table-cell">
                    <span className={row.prediction === 'FRAUD' ? 'badge-fraud' : 'badge-safe'}>
                      {row.prediction === 'FRAUD' ? '🚨 FRAUD' : '✅ SAFE'}
                    </span>
                  </td>
                  <td className="table-cell">{row.confidence}</td>
                  <td className="table-cell">
                    <span className={row.risk === 'HIGH' ? 'badge-fraud' : row.risk === 'MEDIUM' ? 'badge-medium' : 'badge-safe'}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="table-cell text-gray-500">{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function ProfilePage({ history }) {
  const user = JSON.parse(localStorage.getItem('fraudshield_user') || '{}')
  return (
    <div className="animate-fade-in max-w-2xl space-y-6">
      <div>
        <h2 className="section-title text-2xl">My Profile</h2>
        <p className="section-subtitle">Manage your account details</p>
      </div>
      <div className="card">
        <div className="flex items-center gap-5 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-700 rounded-2xl flex items-center justify-center text-white text-2xl font-extrabold shadow-elevated">
            {(user.name || 'U').charAt(0)}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{user.name}</h3>
            <p className="text-gray-500 text-sm">{user.email}</p>
            <span className="badge-safe mt-1 inline-flex">✓ Verified Student</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Member Since', value: user.joinedDate || '2025-01-15' },
            { label: 'Account Role', value: 'Student User' },
            { label: 'Total Scans', value: history.length },
            { label: 'Frauds Caught', value: history.filter(h => h.prediction === 'FRAUD').length },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-1">{item.label}</p>
              <p className="font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem('fraudshield_user') || '{}')
  const [scanResult, setScanResult] = useState(null)
  const [history, setHistory] = useState(defaultHistory)
  const [alerts, setAlerts] = useState([])
  const [blacklist, setBlacklist] = useState([])

  // Fetch alerts and blacklist from MongoDB on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, blacklistRes] = await Promise.all([
          fetch('http://localhost:5000/alerts'),
          fetch('http://localhost:5000/blacklist')
        ])
        if (alertsRes.ok) setAlerts(await alertsRes.json())
        if (blacklistRes.ok) setBlacklist(await blacklistRes.json())
      } catch (err) {
        console.error('Failed to fetch data:', err)
      }
    }
    fetchData()
  }, [])

  const handleScanResult = (result) => {
    setScanResult(result)
    if (result) {
      const newRecord = {
        id: Date.now(),
        company: result.company || 'Unknown Company',
        prediction: result.prediction,
        confidence: (result.confidence * 100).toFixed(1) + '%',
        date: result.date || new Date().toLocaleDateString(),
        risk: result.riskLevel
      }
      setHistory(prev => [newRecord, ...prev])
    }
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">
      <Sidebar role="user" />
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
          <Routes>
            <Route index element={<DashboardHome user={user} scanResult={scanResult} handleScanResult={handleScanResult} history={history} alerts={alerts} />} />
            <Route path="scan" element={<ScanPage onScan={handleScanResult} />} />
            <Route path="company" element={<CompanyCheckPage blacklist={blacklist} />} />
            <Route path="alerts" element={<AlertsPage alerts={alerts} />} />
            <Route path="history" element={<HistoryPage history={history} />} />
            <Route path="profile" element={<ProfilePage history={history} />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
