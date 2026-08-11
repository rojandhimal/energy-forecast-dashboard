import { MetricCard } from '../components/ui/MetricCard'
import {
  ForecastChart,
  ModelComparison,
  FeatureImportance,
  WeatherImpact,
  Alerts
} from '../components/dashboard'
import { BoltIcon, ClockIcon, CheckCircleIcon, SunIcon } from '../components/ui/Icons'
import { metrics as metricsData } from '../services/api'

const iconMap = {
  bolt: <BoltIcon />,
  clock: <ClockIcon />,
  check: <CheckCircleIcon />,
  sun: <SunIcon />
}

const metrics = metricsData.metrics.map(m => ({
  icon: iconMap[m.icon],
  label: m.label,
  value: m.displayValue,
  unit: m.unit,
  change: m.changeText,
  trend: m.trend
}))

export function DashboardPage() {
  return (
    <div className="content">
      {/* Key Metrics */}
      <div className="grid grid-metrics" style={{ marginBottom: 16 }}>
        {metrics.map(metric => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </div>

      {/* Main Chart & Model Comparison */}
      <div className="grid grid-main" style={{ marginBottom: 16 }}>
        <ForecastChart />
        <ModelComparison />
      </div>

      {/* Bottom Row: XAI, Weather, Alerts */}
      <div className="grid grid-bottom">
        <FeatureImportance />
        <WeatherImpact />
        <Alerts />
      </div>
    </div>
  )
}
