import { MetricCard } from '../components/ui/MetricCard'
import {
  ForecastChart,
  ScenarioLab,
  ModelComparison,
  FeatureImportance,
  WeatherImpact,
  Alerts
} from '../components/dashboard'
import { BoltIcon, ClockIcon, CheckCircleIcon, SunIcon } from '../components/ui/Icons'
import { useTimeRange } from '../context'
import { getMetricsSync } from '../services/api'

const iconMap = {
  bolt: <BoltIcon />,
  clock: <ClockIcon />,
  check: <CheckCircleIcon />,
  sun: <SunIcon />
}

export function DashboardPage() {
  const { timeRange } = useTimeRange()
  const metricsData = getMetricsSync(timeRange)

  const metrics = metricsData.metrics.map(m => ({
    icon: iconMap[m.icon],
    label: m.label,
    value: m.displayValue,
    unit: m.unit,
    change: m.changeText,
    trend: m.trend
  }))

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
        <div className="dashboard-side-stack" data-od-id="dashboard-side-stack">
          <ScenarioLab />
          <ModelComparison />
        </div>
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
