import MetricCard from './MetricCard'

interface DashboardProps {
  metrics: HardwareMetrics
}

export default function Dashboard({ metrics }: DashboardProps) {
  const ramPct = Math.round((metrics.ram.used / metrics.ram.total) * 100)

  // Map temperature onto a 0–100% bar: treat 95°C as full scale (throttle point)
  const tempPct =
    metrics.cpu.temp !== null
      ? Math.min(Math.round((metrics.cpu.temp / 95) * 100), 100)
      : 0

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* CPU Usage */}
      <MetricCard
        label="CPU Usage"
        value={`${metrics.cpu.usage}%`}
        sub={`${metrics.cpu.speed} GHz`}
        percent={metrics.cpu.usage}
        color="cyan"
      />

      {/* CPU Temperature
          Decision point: most Windows systems expose this via ACPI/WMI without
          admin rights, but it's hardware-dependent. We show N/A gracefully. */}
      <MetricCard
        label="CPU Temp"
        value={metrics.cpu.temp !== null ? `${metrics.cpu.temp}°C` : 'N/A'}
        sub={metrics.cpu.temp !== null ? 'Sensor active' : 'No sensor data'}
        percent={tempPct}
        color="orange"
        unavailable={metrics.cpu.temp === null}
      />

      {/* RAM */}
      <MetricCard
        label="RAM Usage"
        value={`${ramPct}%`}
        sub={`${metrics.ram.used.toFixed(1)} / ${metrics.ram.total.toFixed(0)} GB`}
        percent={ramPct}
        color="purple"
      />

      {/* GPU Load
          Decision point: utilizationGpu requires driver support.
          NVIDIA works reliably; AMD/Intel varies. We show N/A if unavailable. */}
      <MetricCard
        label="GPU Load"
        value={
          metrics.gpu?.load !== null && metrics.gpu?.load !== undefined
            ? `${metrics.gpu.load}%`
            : 'N/A'
        }
        sub={metrics.gpu?.name ?? 'No GPU detected'}
        percent={metrics.gpu?.load ?? 0}
        color="green"
        unavailable={!metrics.gpu || metrics.gpu.load === null}
      />
    </div>
  )
}
