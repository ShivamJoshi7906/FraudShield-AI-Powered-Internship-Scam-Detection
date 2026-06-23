import { AlertTriangle, Bell, Clock } from 'lucide-react'

const severityConfig = {
  high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'badge-fraud', dot: 'bg-red-500' },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'badge-medium', dot: 'bg-amber-500' },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', badge: 'text-blue-700 bg-blue-100 rounded-full px-2.5 py-0.5 text-xs font-semibold', dot: 'bg-blue-500' },
}

export default function AlertCard({ alert }) {
  const cfg = severityConfig[alert.severity] || severityConfig.medium

  return (
    <div className={`rounded-2xl border p-4 ${cfg.bg} ${cfg.border} hover:shadow-sm transition-shadow duration-200`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
          alert.severity === 'high' ? 'bg-red-100' : alert.severity === 'low' ? 'bg-blue-100' : 'bg-amber-100'
        }`}>
          {alert.severity === 'high'
            ? <AlertTriangle className="w-4 h-4 text-red-600" />
            : <Bell className="w-4 h-4 text-amber-600" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <p className="text-sm font-bold text-gray-900">{alert.title}</p>
            <span className={cfg.badge}>{alert.severity?.toUpperCase()}</span>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed mb-2">{alert.message}</p>
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>{alert.date}</span>
            {alert.author && <><span>·</span><span>by {alert.author}</span></>}
          </div>
        </div>
        <div className={`w-2 h-2 rounded-full shrink-0 mt-2 ${cfg.dot}`} />
      </div>
    </div>
  )
}
