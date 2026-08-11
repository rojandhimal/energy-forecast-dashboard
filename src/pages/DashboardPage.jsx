import { MetricCard } from '../components/ui/MetricCard'
import {
  ForecastChart,
  ModelComparison,
  FeatureImportance,
  WeatherImpact,
  Alerts
} from '../components/dashboard'
import { BoltIcon, ClockIcon, CheckCircleIcon, SunIcon } from '../components/ui/Icons'

const metrics = [
  {
    icon: <BoltIcon />,
    label: 'Predicted Peak Demand',
    value: '4,872',
    unit: 'MW',
    change: '+3.2% from last week',
    trend: 'up'
  },
  {
    icon: <ClockIcon />,
    label: 'Current Load',
    value: '3,641',
    unit: 'MW',
    change: '-1.8% from yesterday',
    trend: 'down'
  },
  {
    icon: <CheckCircleIcon />,
    label: 'Model Accuracy (MAPE)',
    value: '96.4',
    unit: '%',
    change: '+0.8% improvement',
    trend: 'up'
  },
  {
    icon: <SunIcon />,
    label: 'Renewable Share',
    value: '34.7',
    unit: '%',
    change: '+5.1% from last month',
    trend: 'up'
  }
]

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
