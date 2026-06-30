import { useState, useEffect } from 'react'
import Dashboard from './components/Dashboard'

export default function App() {
  // null = waiting for the first metrics snapshot from the main process
  const [metrics, setMetrics] = useState<HardwareMetrics | null>(null)

  useEffect(() => {
    // window.api is the bridge exposed in src/preload/index.ts.
    // onMetricsUpdate returns a cleanup function that removes the IPC listener.
    const unsubscribe = window.api.onMetricsUpdate(setMetrics)
    return unsubscribe
  }, [])

  return (
    <div className="h-screen bg-gray-950 text-white flex flex-col overflow-hidden select-none">
      {/* ------------------------------------------------------------------ */}
      {/* Custom title bar (the window is frameless, so we draw our own)      */}
      {/* ------------------------------------------------------------------ */}
      <header className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-cyan-400 font-bold tracking-wide">RigSage</span>
          <span className="text-gray-500 text-xs">Hardware Monitor</span>
        </div>

        {/* Green pulsing dot = live data; grey dot = waiting */}
        <div
          className={`w-2 h-2 rounded-full transition-colors duration-500 ${
            metrics ? 'bg-green-400 animate-pulse' : 'bg-gray-700'
          }`}
          title={metrics ? 'Live' : 'Waiting for data…'}
        />
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Dashboard                                                           */}
      {/* ------------------------------------------------------------------ */}
      <main className="flex-1 p-4 overflow-auto">
        {metrics ? (
          <Dashboard metrics={metrics} />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">
            Collecting metrics…
          </div>
        )}
      </main>
    </div>
  )
}
