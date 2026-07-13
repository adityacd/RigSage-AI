import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'

export default function App() {
  const [metrics, setMetrics] = useState<HardwareMetrics | null>(null)

  useEffect(() => {
    const unsubscribe = window.api.onMetricsUpdate(setMetrics)
    return unsubscribe
  }, [])

  return (
    <div className="h-screen flex flex-col overflow-hidden select-none" style={{ background: 'var(--bg-app)', color: 'var(--text)' }}>

      {/* App header */}
      <div
        className="flex items-center justify-between shrink-0 border-b"
        style={{ padding: '1.5rem 1.75rem 1.25rem', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center gap-[11px]">
          <div
            className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center shrink-0"
            style={{
              background: 'linear-gradient(135deg, #5eead4 0%, #2dd4bf 100%)',
              boxShadow: '0 0 20px var(--sage-glow)'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L4 6V12C4 16.5 7.5 20.7 12 22C16.5 20.7 20 16.5 20 12V6L12 2Z" fill="#0a0b0d" fillOpacity="0.85" />
              <path d="M9 12L11 14L15.5 9.5" stroke="#5eead4" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="text-[16px] font-bold tracking-[-0.01em]">
              Rig<span style={{ color: 'var(--sage)' }}>Sage</span>
            </div>
            <div className="text-[10px] uppercase tracking-[0.14em] mt-[1px]" style={{ color: 'var(--text-dim)' }}>
              AI Hardware Advisor
            </div>
          </div>
        </div>

        <div
          className="flex items-center gap-[7px] text-[11px] border rounded-full px-3 py-[6px]"
          style={{ color: 'var(--text-dim)', background: 'var(--bg-card)', borderColor: 'var(--border)' }}
        >
          <span
            className={`w-[6px] h-[6px] rounded-full ${metrics ? 'animate-pulse' : ''}`}
            style={{
              background: metrics ? 'var(--sage)' : 'var(--text-dimmer)',
              boxShadow: metrics ? '0 0 8px var(--sage)' : 'none'
            }}
          />
          <span className="mono">Monitoring active</span>
        </div>
      </div>

      {/* Body */}
      <main className="flex-1 overflow-auto" style={{ padding: '1.5rem 1.75rem 1.75rem' }}>
        {metrics ? (
          <Dashboard metrics={metrics} />
        ) : (
          <div className="flex items-center justify-center h-full text-sm" style={{ color: 'var(--text-dim)' }}>
            Collecting metrics…
          </div>
        )}
      </main>

    </div>
  )
}
