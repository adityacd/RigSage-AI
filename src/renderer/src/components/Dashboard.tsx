import MetricCard from './MetricCard'

interface DashboardProps {
  metrics: HardwareMetrics
}

export default function Dashboard({ metrics }: DashboardProps) {
  const ramPct = Math.round((metrics.ram.used / metrics.ram.total) * 100)
  const tempPct =
    metrics.cpu.temp !== null
      ? Math.min(Math.round((metrics.cpu.temp / 95) * 100), 100)
      : 0

  return (
    <div>
      <div className="flex items-baseline justify-between mb-[0.9rem]">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-dim)' }}>
          Live system metrics
        </span>
        <span className="font-mono text-[11px]" style={{ color: 'var(--text-dimmer)' }}>
          updated 2s ago
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-[10px]">
        <MetricCard
          label="CPU Load"
          icon="⚙️"
          value={metrics.cpu.usage}
          unit="%"
          sub={`${metrics.cpu.speed} GHz`}
          percent={metrics.cpu.usage}
          color="default"
        />
        <MetricCard
          label="CPU Temp"
          icon="🌡️"
          value={metrics.cpu.temp ?? 0}
          unit="°C"
          sub={metrics.cpu.temp !== null ? 'Fan: active' : 'No sensor data'}
          percent={tempPct}
          color="amber"
          unavailable={metrics.cpu.temp === null}
        />
        <MetricCard
          label="GPU Load"
          icon="🖥️"
          value={metrics.gpu?.load ?? 0}
          unit="%"
          sub={metrics.gpu?.name ?? 'No GPU detected'}
          percent={metrics.gpu?.load ?? 0}
          color="sage"
          unavailable={!metrics.gpu || metrics.gpu.load === null}
        />
        <MetricCard
          label="RAM"
          icon="💾"
          value={metrics.ram.used}
          unit={`/${metrics.ram.total.toFixed(0)} GB`}
          sub={`${ramPct}% utilised`}
          percent={ramPct}
          color="default"
        />
      </div>
    </div>
  )
}
