import { useState, useRef } from 'react'
import { FileText, Image, Type, Upload, Loader2, X, AlertCircle } from 'lucide-react'

const TABS = [
  { id: 'text', label: 'Paste Text', icon: Type },
  { id: 'pdf', label: 'Upload PDF', icon: FileText },
  { id: 'image', label: 'Upload Image', icon: Image },
]

export default function ScanCard({ onResult }) {
  const [tab, setTab] = useState('text')
  const [text, setText] = useState('')
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()

  const handleFile = (f) => {
    if (!f) return
    const isImg = f.type.startsWith('image/')
    const isPdf = f.type === 'application/pdf'
    if ((tab === 'pdf' && !isPdf) || (tab === 'image' && !isImg)) {
      alert(`Please upload a valid ${tab === 'pdf' ? 'PDF' : 'image'} file.`)
      return
    }
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleAnalyze = async () => {
    if (tab === 'text' && !text.trim()) return
    if ((tab === 'pdf' || tab === 'image') && !file) return

    setLoading(true)
    await new Promise(r => setTimeout(r, 2000))
    setLoading(false)

    // Mock result
    const rand = Math.random()
    const isFraud = rand > 0.4
    const confidence = 0.72 + Math.random() * 0.26
    const result = {
      prediction: isFraud ? 'FRAUD' : 'SAFE',
      confidence: confidence,
      riskLevel: isFraud ? (confidence > 0.85 ? 'HIGH' : 'MEDIUM') : 'LOW',
      scamProbability: isFraud ? confidence : 1 - confidence,
      safeProbability: isFraud ? 1 - confidence : confidence,
      reasons: isFraud ? [
        { label: 'Registration Fee Detected', detected: Math.random() > 0.3 },
        { label: 'Suspicious Contact Info', detected: Math.random() > 0.4 },
        { label: 'No Company Website Found', detected: Math.random() > 0.5 },
        { label: 'Unrealistic Salary Offer', detected: Math.random() > 0.5 },
      ] : [
        { label: 'Registration Fee Detected', detected: false },
        { label: 'Suspicious Contact Info', detected: false },
        { label: 'No Company Website Found', detected: false },
        { label: 'Unrealistic Salary Offer', detected: false },
      ],
      company: text.split(' ').slice(0, 2).join(' ') || (file?.name?.split('.')[0]) || 'Unknown Company',
      date: new Date().toLocaleDateString(),
    }
    onResult && onResult(result)
  }

  const handleClear = () => {
    setText('')
    setFile(null)
    if (fileRef.current) fileRef.current.value = ''
    onResult && onResult(null)
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
          <AlertCircle className="w-4 h-4 text-primary-600" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900">Internship Scanner</h2>
          <p className="text-xs text-gray-500">Analyze any internship for scam indicators</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-5">
        {TABS.map(t => (
          <button
            key={t.id}
            id={`scan-tab-${t.id}`}
            onClick={() => { setTab(t.id); setFile(null); if (fileRef.current) fileRef.current.value = '' }}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              tab === t.id ? 'bg-white text-primary-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content area */}
      {tab === 'text' && (
        <textarea
          id="scan-text-input"
          className="input-field min-h-[140px] resize-none leading-relaxed text-sm mb-4"
          placeholder="Paste the internship description, offer letter text, or job posting here..."
          value={text}
          onChange={e => setText(e.target.value)}
        />
      )}

      {(tab === 'pdf' || tab === 'image') && (
        <div
          className={`border-2 border-dashed rounded-xl p-8 mb-4 text-center transition-colors duration-200 cursor-pointer ${
            dragOver ? 'border-primary-400 bg-primary-50' : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
          }`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            className="hidden"
            accept={tab === 'pdf' ? '.pdf' : 'image/*'}
            onChange={e => handleFile(e.target.files[0])}
            id={`file-input-${tab}`}
          />
          {file ? (
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                {tab === 'pdf' ? <FileText className="w-5 h-5 text-primary-600" /> : <Image className="w-5 h-5 text-primary-600" />}
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button onClick={e => { e.stopPropagation(); setFile(null); if (fileRef.current) fileRef.current.value = '' }} className="ml-2 text-gray-400 hover:text-red-500">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700 mb-1">
                Drop your {tab === 'pdf' ? 'PDF file' : 'image'} here
              </p>
              <p className="text-xs text-gray-400">or click to browse · Max 10MB</p>
            </>
          )}
        </div>
      )}

      <div className="flex gap-3">
        <button
          id="analyze-btn"
          onClick={handleAnalyze}
          disabled={loading || (tab === 'text' ? !text.trim() : !file)}
          className="btn-primary flex items-center gap-2 flex-1 justify-center"
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</>
          ) : (
            'Analyze Internship'
          )}
        </button>
        <button
          id="clear-btn"
          onClick={handleClear}
          className="btn-ghost border border-gray-200 px-4"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
