import { Card, CardHeader, CardBody } from '../ui/Card'
import {
  SunIcon,
  WindIcon,
  CloudIcon,
  BarChartIcon,
  DollarIcon,
  CalendarIcon
} from '../ui/Icons'
import './WeatherImpact.css'

const weatherData = [
  { icon: SunIcon, value: '32°C', label: 'Temperature', impact: '+8.2% demand', negative: true },
  { icon: WindIcon, value: '18 km/h', label: 'Wind Speed', impact: '+4.1% wind gen', negative: false },
  { icon: CloudIcon, value: '15%', label: 'Cloud Cover', impact: '+12% solar gen', negative: false },
  { icon: BarChartIcon, value: '65%', label: 'Humidity', impact: '+2.4% demand', negative: true },
  { icon: DollarIcon, value: '$68', label: 'Spot Price', impact: '-3.1% vs avg', negative: false },
  { icon: CalendarIcon, value: 'Weekday', label: 'Day Type', impact: '+15% baseline', negative: true }
]

export function WeatherImpact() {
  return (
    <Card>
      <CardHeader title="Weather Impact Analysis" action="7-day outlook" />
      <CardBody>
        <div className="weather-grid">
          {weatherData.map(item => (
            <div key={item.label} className="weather-item">
              <div className="weather-icon">
                <item.icon />
              </div>
              <div className="weather-value">{item.value}</div>
              <div className="weather-label">{item.label}</div>
              <div className={`weather-impact ${item.negative ? 'negative' : ''}`}>
                {item.impact}
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
