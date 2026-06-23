import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, Zap, FileText, Image, Building2, Users, BarChart3,
  ChevronRight, CheckCircle, ArrowRight, Github, Lock,
  AlertTriangle, TrendingUp, Star, Menu, X
} from 'lucide-react'

const stats = [
  { label: 'Internships Scanned', value: '124,890', icon: Zap, color: 'text-primary-600', bg: 'bg-primary-50' },
  { label: 'Fraud Cases Detected', value: '18,432', icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-50' },
  { label: 'Companies Blacklisted', value: '3,214', icon: Building2, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const features = [
  {
    icon: Zap,
    title: 'AI Scam Detection',
    desc: 'Advanced NLP and machine learning models analyze internship postings to detect suspicious patterns instantly.',
    color: 'text-primary-600', bg: 'bg-primary-50'
  },
  {
    icon: FileText,
    title: 'PDF Analysis',
    desc: 'Upload offer letters or job documents and our AI will scan every line for red flags and inconsistencies.',
    color: 'text-blue-600', bg: 'bg-blue-50'
  },
  {
    icon: Image,
    title: 'Image Analysis',
    desc: 'Detect fraudulent screenshots of job offers using computer vision and OCR technology.',
    color: 'text-emerald-600', bg: 'bg-emerald-50'
  },
  {
    icon: Building2,
    title: 'Company Verification',
    desc: 'Instantly cross-reference companies against our live blacklist database of known scam organizations.',
    color: 'text-amber-600', bg: 'bg-amber-50'
  },
  {
    icon: Users,
    title: 'Community Warnings',
    desc: 'Community-driven alerts from thousands of students sharing real-time scam experiences.',
    color: 'text-rose-600', bg: 'bg-rose-50'
  },
  {
    icon: BarChart3,
    title: 'Admin Monitoring',
    desc: 'Enterprise-grade admin dashboard for monitoring fraud trends and managing the platform.',
    color: 'text-violet-600', bg: 'bg-violet-50'
  },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'CS Student, IIT Delhi', text: 'FraudShield saved me from a fake internship that was asking for registration fees. Absolutely essential!', stars: 5 },
  { name: 'Arjun Mehta', role: 'MBA Student, IIMA', text: 'The PDF analysis caught a fake offer letter within seconds. Incredible technology.', stars: 5 },
  { name: 'Sneha Rao', role: 'Engineering Student', text: 'I recommend this to every student applying for internships. The community alerts are a lifesaver.', stars: 5 },
]

export default function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Fraud<span className="text-primary-600">Shield</span></span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <a href="#features" className="btn-ghost text-sm">Features</a>
              <a href="#stats" className="btn-ghost text-sm">Stats</a>
              <button onClick={() => navigate('/login')} className="btn-outline text-sm py-2 px-4">Login</button>
              <button onClick={() => navigate('/register')} className="btn-primary text-sm py-2 px-4">Get Started</button>
            </div>
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden bg-white border-t border-gray-100 py-4 flex flex-col gap-2 px-4">
              <a href="#features" className="btn-ghost text-sm text-left" onClick={() => setMenuOpen(false)}>Features</a>
              <a href="#stats" className="btn-ghost text-sm text-left" onClick={() => setMenuOpen(false)}>Stats</a>
              <button onClick={() => navigate('/login')} className="btn-outline text-sm w-full">Login</button>
              <button onClick={() => navigate('/register')} className="btn-primary text-sm w-full">Get Started</button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background gradient blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -left-40 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-40" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 rounded-full px-4 py-1.5 text-sm font-medium text-primary-700 mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            AI-Powered Protection · Trusted by 50,000+ Students
          </div>

          {/* Logo mark */}
          <div className="flex justify-center mb-6 animate-slide-up">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-elevated">
              <Shield className="w-11 h-11 text-white" />
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight mb-6 animate-slide-up">
            Detect Internship<br />
            <span className="bg-gradient-to-r from-primary-600 to-violet-600 bg-clip-text text-transparent">
              Scams Instantly
            </span>
          </h1>

          <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in">
            FraudShield uses advanced AI to analyze internship postings, offer letters, and company profiles — protecting students from fraudulent opportunities before it's too late.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
            <button
              onClick={() => navigate('/register')}
              className="btn-primary flex items-center gap-2 text-base px-8 py-3.5 rounded-xl"
            >
              Start Scanning Free <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-outline flex items-center gap-2 text-base px-8 py-3.5 rounded-xl"
            >
              Login to Dashboard
            </button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-gray-500">
            {['No credit card required', 'Free for students', '99.2% accuracy'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> {t}
              </span>
            ))}
          </div>

          {/* Hero card preview */}
          <div className="mt-16 max-w-4xl mx-auto bg-white rounded-3xl shadow-elevated border border-gray-100 p-6 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-auto flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-3 py-1.5">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span className="text-sm font-semibold text-red-700">Scam Detected — 94% Confidence</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              {[
                { label: 'Prediction', value: '🚨 FRAUD', color: 'text-red-600' },
                { label: 'Confidence', value: '94.2%', color: 'text-gray-900' },
                { label: 'Risk Level', value: '🔴 HIGH', color: 'text-red-600' },
                { label: 'Scam Score', value: '0.942', color: 'text-red-600' },
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                  <p className={`font-bold text-sm ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-16 bg-primary-50 border-y border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl sm:text-5xl font-extrabold text-primary-600 mb-2">{s.value}</p>
                <p className="text-gray-600 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Platform Features</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">Everything You Need to Stay Safe</h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">Comprehensive protection powered by cutting-edge AI, real-time data, and community intelligence.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card hover:shadow-elevated transition-shadow duration-300 group">
                <div className={`w-12 h-12 ${f.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <f.icon className={`w-6 h-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                <div className={`flex items-center gap-1 mt-4 text-sm font-medium ${f.color}`}>
                  Learn more <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary-600 uppercase tracking-wider">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-gray-900 mt-2 mb-4">Trusted by Students Nationwide</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="card hover:shadow-elevated transition-shadow duration-300">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700 text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{t.name}</p>
                    <p className="text-xs text-gray-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary-50 to-violet-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-elevated">
            <Shield className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Start Protecting Yourself Today</h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xl mx-auto">Join thousands of students who trust FraudShield to keep them safe from internship scams. It's free.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="btn-primary text-base px-8 py-3.5 rounded-xl flex items-center gap-2 justify-center">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/login')} className="btn-outline text-base px-8 py-3.5 rounded-xl">
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-primary-600 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-gray-900 font-bold text-lg">Fraud<span className="text-primary-600">Shield</span></span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-gray-500">
              <a href="#" className="hover:text-primary-600 transition-colors">About</a>
              <a href="#" className="hover:text-primary-600 transition-colors">Contact</a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <Github className="w-4 h-4" /> GitHub
              </a>
              <a href="#" className="hover:text-primary-600 transition-colors flex items-center gap-1">
                <Lock className="w-4 h-4" /> Privacy Policy
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2025 FraudShield. All rights reserved. Built to protect students from scams.
          </div>
        </div>
      </footer>
    </div>
  )
}
