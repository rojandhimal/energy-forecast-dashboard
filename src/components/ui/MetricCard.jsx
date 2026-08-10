import './MetricCard.css'
import { TrendUpIcon, TrendDownIcon } from './Icons'

export function MetricCard({ icon, label, value, unit, change, trend }) {
  const isPositive = trend === 'up'

  return (
    <div className="card metric-card">
      <div className="metric-label">
        {icon}
        {label}
      </div>
      <div className="metric-value">
        {value}
        <span className="metric-unit">{unit}</span>
      </div>
      {change && (
        <div className={`metric-change ${isPositive ? 'up' : 'down'}`}>
          {isPositive ? <TrendUpIcon /> : <TrendDownIcon />}
          {change}
        </div>
      )}
    </div>
  )
}
