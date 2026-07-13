type Color = 'sage' | 'amber' | 'default'

interface MetricCardProps {
  label: string
  icon: string
  value: number
  unit: string
  sub: string
  percent: number
  color?: Color
  unavailable?: boolean
}

const valueColors: Record<Color, string> = {
  sage: 'var(--sage)',
  amber: 'var(--amber)',
  default: 'var(--text)',
}

const barColors: Record<Color, string> = {
  sage: 'var(--sage)',
  amber: 'var(--amber)',
  default: 'var(--sage)',
}

function formatValue(v: number): string {
  return Number.isInteger(v) ? String(v) : v.toFixed(1)
}

export default function MetricCard({
  label,
  icon,
  value,
  unit,
  sub,
  percent,
  color = 'default',
  unavailable = false,
}: MetricCardProps) {
  return (
    <div
      className="relative overflow-hidden rounded-lg border"
      style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', padding: '14px 16px' }}
    >
      {/* Bottom progress bar */}
      {!unavailable && (
        <div
          className="absolute bottom-0 left-0 h-[2px] transition-all duration-700"
          style={{
            width: `${Math.min(percent, 100)}%`,
            background: barColors[color],
            opacity: 0.7,
          }}
        />
      )}

      <div className="flex items-center justify-between mb-[10px]">
        <span className="text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: 'var(--text-dim)' }}>
          {label}
        </span>
        <span className="text-[13px]" style={{ opacity: 0.6 }}>{icon}</span>
      </div>

      <div
        className="font-mono text-[22px] font-semibold leading-none mb-1"
        style={{ color: unavailable ? 'var(--text-dimmer)' : valueColors[color] }}
      >
        {unavailable ? 'N/A' : (
          <>
            {formatValue(value)}
            <span className="text-xs font-normal ml-[2px]" style={{ color: 'var(--text-dim)' }}>{unit}</span>
          </>
        )}
      </div>

      <div className="font-mono text-[10px] truncate" style={{ color: 'var(--text-dimmer)' }}>{sub}</div>
    </div>
  )
}
