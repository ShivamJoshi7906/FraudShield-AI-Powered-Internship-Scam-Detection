import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Shield, LayoutDashboard, Scan, Building2, Bell, History,
  User, Users, ListChecks, AlertTriangle, BarChart3,
  Settings, LogOut, Menu, X, ChevronRight
} from 'lucide-react'

const userMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'scan', label: 'Scan Internship', icon: Scan, path: '/dashboard/scan' },
  { id: 'company', label: 'Company Check', icon: Building2, path: '/dashboard/company' },
  { id: 'alerts', label: 'Community Alerts', icon: Bell, path: '/dashboard/alerts' },
  { id: 'profile', label: 'Profile', icon: User, path: '/dashboard/profile' },
]

const adminMenuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { id: 'users', label: 'Users', icon: Users, path: '/admin/users' },
  { id: 'scans', label: 'Scan History', icon: History, path: '/admin/scans' },
  { id: 'blacklist', label: 'Blacklist Manager', icon: ListChecks, path: '/admin/blacklist' },
  { id: 'alerts', label: 'Community Alerts', icon: AlertTriangle, path: '/admin/alerts' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
]

export default function Sidebar({ role = 'user' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = JSON.parse(localStorage.getItem('fraudshield_user') || '{}')
  const items = role === 'admin' ? adminMenuItems : userMenuItems

  const handleLogout = () => {
    localStorage.removeItem('fraudshield_user')
    navigate('/login')
  }

  const isActive = (path) => {
    if (path === '/dashboard' || path === '/admin') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm shrink-0">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="font-extrabold text-gray-900 text-lg leading-none">Fraud<span className="text-primary-600">Shield</span></span>
          <p className="text-xs text-gray-400 leading-none mt-0.5 capitalize">{role} Portal</p>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-2 mb-3">Navigation</p>
        {items.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => { navigate(item.path); setMobileOpen(false) }}
              className={`sidebar-item w-full text-left ${active ? 'sidebar-item-active' : 'sidebar-item-inactive'}`}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight className="w-4 h-4 opacity-70" />}
            </button>
          )
        })}
      </nav>

      {/* User Info & Logout */}
      <div className="px-3 py-4 border-t border-gray-100 space-y-2">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center font-bold text-primary-700 text-sm shrink-0">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate">{user.email || ''}</p>
          </div>
        </div>
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="sidebar-item w-full text-left text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Hamburger */}
      <button
        id="sidebar-toggle"
        className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 bg-white rounded-xl shadow-card border border-gray-200 flex items-center justify-center"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={`lg:hidden fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-100 z-50 transform transition-transform duration-300 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0 shrink-0">
        <SidebarContent />
      </aside>
    </>
  )
}
