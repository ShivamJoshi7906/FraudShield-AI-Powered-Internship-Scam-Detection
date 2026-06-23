import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', role: 'user' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password, role: form.role })
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Login failed. Please check your credentials.')
        setLoading(false)
        return
      }

      // Login success — save user and redirect
      localStorage.setItem('fraudshield_user', JSON.stringify(data.user))
      setLoading(false)

      if (data.user.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }

    } catch (err) {
      setLoading(false)
      setError('Cannot connect to the server. Make sure the backend is running.')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-violet-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl shadow-elevated mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your FraudShield account</p>
        </div>

        {/* Card */}
        <div className="card shadow-elevated">
          {/* Role Toggle */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
            {['user', 'admin'].map(role => (
              <button
                key={role}
                onClick={() => setForm(f => ({ ...f, role }))}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  form.role === role
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {role === 'admin' ? '🛡️ Admin' : '👤 User'}
              </button>
            ))}
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <input
                id="login-email"
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                autoComplete="email"
              />
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-11"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="flex justify-end mt-1.5">
                <button type="button" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </button>
              </div>
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-2"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</>
              ) : (
                `Sign In as ${form.role === 'admin' ? 'Admin' : 'User'}`
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                id="goto-register"
                onClick={() => navigate('/register')}
                className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
              >
                Create one free
              </button>
            </p>
          </div>
        </div>

        {/* Info hint */}
        <div className="mt-4 bg-primary-50 border border-primary-100 rounded-xl p-4 text-xs text-primary-700">
          <p className="font-semibold mb-1">🔐 Getting Started</p>
          <p className="mb-1">👤 <strong>New here?</strong> Click "Create one free" to register your account.</p>
          <p>🛡️ <strong>Admin?</strong> Ask your admin to register you with the admin role.</p>
        </div>

        <p className="text-center mt-6 text-xs text-gray-400">
          © 2025 FraudShield · <a href="/" className="hover:text-primary-600">Back to Home</a>
        </p>
      </div>
    </div>
  )
}
