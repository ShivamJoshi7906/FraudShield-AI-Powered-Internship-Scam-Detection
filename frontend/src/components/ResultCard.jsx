import { CheckCircle, XCircle, AlertTriangle, Shield } from 'lucide-react'

const riskConfig = {
  HIGH: { color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', barColor: 'bg-red-500', icon: XCircle },
  MEDIUM: { color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200', barColor: 'bg-amber-500', icon: AlertTriangle },
  LOW: { color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200', barColor: 'bg-emerald-500', icon: CheckCircle },
}

function ProgressBar({ value, color, label }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="font-bold text-gray-800">{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  )
}

export default function ResultCard({ result }) {
  if (!result) return null
  const isFraud = result.prediction === 'FRAUD'
  const cfg = riskConfig[result.riskLevel] || riskConfig.LOW
  const Icon = cfg.icon

  return (
    <div className={`card border ${cfg.border} animate-slide-up`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-4 ${cfg.bg} rounded-xl mb-5 -mx-1`}>
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isFraud ? 'bg-red-100' : 'bg-emerald-100'}`}>
            {isFraud ? <XCircle className="w-6 h-6 text-red-600" /> : <Shield className="w-6 h-6 text-emerald-600" />}
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Prediction Result</p>
            <p className={`text-xl font-extrabold ${isFraud ? 'text-red-600' : 'text-emerald-600'}`}>
              {isFraud ? '🚨 FRAUD DETECTED' : '✅ SAFE INTERNSHIP'}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1.5 rounded-lg ${cfg.bg} border ${cfg.border}`}>
          <span className={`text-xs font-bold ${cfg.color}`}>{result.riskLevel} RISK</span>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: 'Prediction', value: result.prediction, color: isFraud ? 'text-red-600' : 'text-emerald-600' },
          { label: 'Confidence Score', value: `${(result.confidence * 100).toFixed(1)}%`, color: 'text-gray-900' },
          { label: 'Risk Level', value: result.riskLevel, color: cfg.color },
          { label: 'Scam Probability', value: `${(result.scamProbability * 100).toFixed(1)}%`, color: isFraud ? 'text-red-600' : 'text-gray-600' },
        ].map(item => (
          <div key={item.label} className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs text-gray-500 mb-1">{item.label}</p>
            <p className={`font-extrabold text-sm ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="space-y-3 mb-5">
        <ProgressBar value={result.scamProbability} color="bg-red-500" label="Scam Probability" />
        <ProgressBar value={result.safeProbability} color="bg-emerald-500" label="Safe Probability" />
        <ProgressBar value={result.confidence} color={cfg.barColor} label="Model Confidence" />
      </div>

      {/* Reasons */}
      <div>
        <p className="text-sm font-bold text-gray-800 mb-3">Detected Indicators</p>
        <div className="space-y-2">
          {result.reasons.map((r) => (
            <div key={r.label} className={`flex items-center gap-3 p-3 rounded-xl border ${r.detected ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'}`}>
              {r.detected ? (
                <XCircle className="w-4 h-4 text-red-500 shrink-0" />
              ) : (
                <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
              )}
              <span className={`text-sm font-medium ${r.detected ? 'text-red-700' : 'text-gray-600'}`}>{r.label}</span>
              <span className={`ml-auto text-xs font-semibold ${r.detected ? 'text-red-600' : 'text-gray-400'}`}>
                {r.detected ? 'DETECTED' : 'CLEAR'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
