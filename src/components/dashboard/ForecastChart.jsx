import { Card, CardHeader, CardBody } from '../ui/Card'
import { useTimeRange } from '../../context'
import { getForecastsSync } from '../../services/api'
import './ForecastChart.css'

const chartConfigs = {
  '24H': {
    title: '24-Hour Demand Forecast',
    labels: ['Now', '+6H', '+12H', '+18H', '+24H'],
    xPositions: [90, 166, 242, 318, 394],
    todayPosition: 90,
    todayLabel: 'NOW'
  },
  '7D': {
    title: '7-Day Demand Forecast',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    xPositions: [90, 166, 242, 318, 394, 470, 546],
    todayPosition: 318,
    todayLabel: 'TODAY'
  },
  '30D': {
    title: '30-Day Demand Forecast',
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    xPositions: [90, 242, 394, 546],
    todayPosition: 90,
    todayLabel: 'CURRENT'
  },
  '90D': {
    title: '90-Day Demand Forecast',
    labels: ['Month 1', 'Month 2', 'Month 3'],
    xPositions: [90, 318, 546],
    todayPosition: 90,
    todayLabel: 'CURRENT'
  }
}

export function ForecastChart() {
  const { timeRange } = useTimeRange()
  const config = chartConfigs[timeRange]
  const forecasts = getForecastsSync(timeRange)
  const chartData = forecasts.chartData

  // Generate path for actual data points
  const actualPath = chartData.actual
    .map((point, i) => `${i === 0 ? 'M' : 'L'}${point.x} ${point.y}`)
    .join(' ')

  // Generate path for LSTM predictions
  const lstmPath = chartData.lstm
    .map((point, i) => `${i === 0 ? 'M' : 'L'}${point.x} ${point.y}`)
    .join(' ')

  return (
    <Card>
      <CardHeader title={config.title} action="View full analysis" />
      <CardBody>
        <div className="chart-container">
          <svg className="chart-svg" viewBox="0 0 600 240" preserveAspectRatio="xMidYMid meet">
            {/* Grid lines */}
            <g stroke="oklch(92% 0.005 240)" strokeWidth="1">
              <line x1="50" y1="20" x2="580" y2="20"/>
              <line x1="50" y1="65" x2="580" y2="65"/>
              <line x1="50" y1="110" x2="580" y2="110"/>
              <line x1="50" y1="155" x2="580" y2="155"/>
              <line x1="50" y1="200" x2="580" y2="200"/>
            </g>

            {/* Y-axis labels */}
            <g fill="oklch(50% 0.018 240)" fontFamily="var(--font-mono)" fontSize="10">
              <text x="45" y="24" textAnchor="end">5000</text>
              <text x="45" y="69" textAnchor="end">4500</text>
              <text x="45" y="114" textAnchor="end">4000</text>
              <text x="45" y="159" textAnchor="end">3500</text>
              <text x="45" y="204" textAnchor="end">3000</text>
            </g>

            {/* X-axis labels - dynamic based on time range */}
            <g fill="oklch(50% 0.018 240)" fontFamily="var(--font-body)" fontSize="10">
              {config.labels.map((label, i) => (
                <text key={label} x={config.xPositions[i]} y="220" textAnchor="middle">
                  {label}
                </text>
              ))}
            </g>

            {/* Confidence interval */}
            <path
              d="M90 85 L166 95 L242 80 L318 70 L394 60 L470 75 L546 65 L546 105 L470 115 L394 100 L318 110 L242 120 L166 135 L90 125 Z"
              fill="oklch(90% 0.04 145)"
              opacity="0.5"
            />

            {/* Actual demand line */}
            <path
              d={actualPath}
              fill="none"
              stroke="oklch(22% 0.02 240)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Actual demand points */}
            {chartData.actual.map((point, i) => (
              <circle key={`actual-${i}`} cx={point.x} cy={point.y} r="4" fill="oklch(22% 0.02 240)"/>
            ))}

            {/* LSTM prediction line */}
            <path
              d={lstmPath}
              fill="none"
              stroke="oklch(58% 0.16 145)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 4"
            />
            {/* LSTM prediction points */}
            {chartData.lstm.slice(1).map((point, i) => (
              <circle key={`lstm-${i}`} cx={point.x} cy={point.y} r="4" fill="oklch(58% 0.16 145)"/>
            ))}

            {/* Today/Current marker */}
            <line
              x1={config.todayPosition}
              y1="20"
              x2={config.todayPosition}
              y2="200"
              stroke="oklch(58% 0.16 145)"
              strokeWidth="1"
              strokeDasharray="4 2"
            />
            <text
              x={config.todayPosition}
              y="12"
              fill="oklch(58% 0.16 145)"
              fontSize="9"
              textAnchor="middle"
              fontWeight="600"
            >
              {config.todayLabel}
            </text>
          </svg>
        </div>
      </CardBody>
      <div className="chart-legend">
        <div className="legend-item"><span className="legend-dot actual" /> Actual Demand</div>
        <div className="legend-item"><span className="legend-dot lstm" /> LSTM Forecast</div>
        <div className="legend-item"><span className="legend-dot confidence" /> 95% Confidence</div>
      </div>
    </Card>
  )
}
