type Color = 'cyan' | 'orange' | 'purple' | 'green'

interface MetricCardProps {
  label: string
  value: string
  sub: string
  percent: number
  color: Color
  unavailable?: boolean
}

// Tailwind's JIT scanner requires complete class strings — no dynamic assembly.
// These objects map each color to its full Tailwind class names.
const colorClasses: Record<Color, { value: string; bar: string }> = {
  cyan:   { value: 'text-cyan-400',   bar: 'bg-cyan-400' },
  orange: { value: 'text-orange-400', bar: 'bg-orange-400' },
  purple: { value: 'text-purple-400', bar: 'bg-purple-400' },
  green:  { value: 'text-green-400',  bar: 'bg-green-400' }
}

export default function MetricCard({
  label,
  value,
  sub,
  percent,
  color,
  unavailable = false
}: MetricCardProps) {
  const { value: valueClass, bar: barClass } = colorClasses[color]

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 flex flex-col gap-2">
      {/* Metric label */}
      <span className="text-gray-400 text-xs font-medium uppercase tracking-widest">
        {label}
      </span>

      {/* Main value — greyed out when the sensor is unavailable */}
      <span
        className={`text-2xl font-bold tabular-nums ${
          unavailable ? 'text-gray-600' : valueClass
        }`}
      >
        {value}
      </span>

      {/* Usage bar — hidden when unavailable */}
      <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
        {!unavailable && (
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${barClass}`}
            style={{ width: `${Math.min(percent, 100)}%` }}
          />
        )}
      </div>

      {/* Sub-label (clock speed, GB used, GPU name, etc.) */}
      <span className="text-gray-500 text-xs truncate" title={sub}>
        {sub}
      </span>
    </div>
  )
}
