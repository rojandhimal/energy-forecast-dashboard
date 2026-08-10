import { Card, CardHeader, CardBody } from '../ui/Card'
import './ForecastChart.css'

export function ForecastChart() {
  return (
    <Card>
      <CardHeader title="7-Day Demand Forecast" action="View full analysis" />
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

            {/* X-axis labels */}
            <g fill="oklch(50% 0.018 240)" fontFamily="var(--font-body)" fontSize="10">
              <text x="90" y="220" textAnchor="middle">Mon</text>
              <text x="166" y="220" textAnchor="middle">Tue</text>
              <text x="242" y="220" textAnchor="middle">Wed</text>
              <text x="318" y="220" textAnchor="middle">Thu</text>
              <text x="394" y="220" textAnchor="middle">Fri</text>
              <text x="470" y="220" textAnchor="middle">Sat</text>
              <text x="546" y="220" textAnchor="middle">Sun</text>
            </g>

            {/* Confidence interval */}
            <path
              d="M90 85 L166 95 L242 80 L318 70 L394 60 L470 75 L546 65 L546 105 L470 115 L394 100 L318 110 L242 120 L166 135 L90 125 Z"
              fill="oklch(90% 0.04 145)"
              opacity="0.5"
            />

            {/* Actual demand */}
            <path
              d="M90 105 L166 115 L242 95 L318 88"
              fill="none"
              stroke="oklch(22% 0.02 240)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="90" cy="105" r="4" fill="oklch(22% 0.02 240)"/>
            <circle cx="166" cy="115" r="4" fill="oklch(22% 0.02 240)"/>
            <circle cx="242" cy="95" r="4" fill="oklch(22% 0.02 240)"/>
            <circle cx="318" cy="88" r="4" fill="oklch(22% 0.02 240)"/>

            {/* LSTM prediction */}
            <path
              d="M318 88 L394 78 L470 92 L546 82"
              fill="none"
              stroke="oklch(58% 0.16 145)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="8 4"
            />
            <circle cx="394" cy="78" r="4" fill="oklch(58% 0.16 145)"/>
            <circle cx="470" cy="92" r="4" fill="oklch(58% 0.16 145)"/>
            <circle cx="546" cy="82" r="4" fill="oklch(58% 0.16 145)"/>

            {/* ARIMA prediction */}
            <path
              d="M318 88 L394 85 L470 98 L546 90"
              fill="none"
              stroke="oklch(65% 0.15 250)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="4 4"
              opacity="0.7"
            />

            {/* Today marker */}
            <line x1="318" y1="20" x2="318" y2="200" stroke="oklch(58% 0.16 145)" strokeWidth="1" strokeDasharray="4 2"/>
            <text x="318" y="12" fill="oklch(58% 0.16 145)" fontSize="9" textAnchor="middle" fontWeight="600">TODAY</text>
          </svg>
        </div>
      </CardBody>
      <div className="chart-legend">
        <div className="legend-item"><span className="legend-dot actual" /> Actual Demand</div>
        <div className="legend-item"><span className="legend-dot lstm" /> LSTM Forecast</div>
        <div className="legend-item"><span className="legend-dot arima" /> ARIMA Forecast</div>
        <div className="legend-item"><span className="legend-dot confidence" /> 95% Confidence</div>
      </div>
    </Card>
  )
}
