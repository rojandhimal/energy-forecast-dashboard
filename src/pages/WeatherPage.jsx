import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { WeatherImpact } from '../components/dashboard'
import './Pages.css'

const weeklyForecast = [
  { day: 'Monday', temp: '32°C', humidity: '65%', wind: '18 km/h', impact: '+8.2%' },
  { day: 'Tuesday', temp: '34°C', humidity: '58%', wind: '12 km/h', impact: '+11.5%' },
  { day: 'Wednesday', temp: '31°C', humidity: '62%', wind: '22 km/h', impact: '+6.8%' },
  { day: 'Thursday', temp: '29°C', humidity: '70%', wind: '15 km/h', impact: '+4.2%' },
  { day: 'Friday', temp: '33°C', humidity: '55%', wind: '8 km/h', impact: '+9.7%' },
  { day: 'Saturday', temp: '28°C', humidity: '68%', wind: '20 km/h', impact: '+2.1%' },
  { day: 'Sunday', temp: '27°C', humidity: '72%', wind: '25 km/h', impact: '+0.8%' }
]

export function WeatherPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Weather Impact Analysis</h2>
        <p className="page-desc">Analyze how weather conditions affect energy demand patterns.</p>
      </div>

      <div className="grid grid-main" style={{ marginBottom: 16 }}>
        <WeatherImpact />
        <Card>
          <CardHeader title="Weather Correlation Insights" />
          <CardBody>
            <div className="insight-list">
              <div className="insight-item positive">
                <span className="insight-label">Temperature</span>
                <span className="insight-value">+2.5% per °C above 25°C</span>
              </div>
              <div className="insight-item negative">
                <span className="insight-label">Solar Generation</span>
                <span className="insight-value">-0.8% net demand per 100 W/m²</span>
              </div>
              <div className="insight-item negative">
                <span className="insight-label">Wind Generation</span>
                <span className="insight-value">-0.3% net demand per 5 km/h</span>
              </div>
              <div className="insight-item positive">
                <span className="insight-label">Humidity</span>
                <span className="insight-value">+0.4% per 10% increase</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="7-Day Weather & Demand Forecast" />
        <CardBody>
          <table className="data-table full-width">
            <thead>
              <tr>
                <th>Day</th>
                <th>Temperature</th>
                <th>Humidity</th>
                <th>Wind Speed</th>
                <th>Demand Impact</th>
              </tr>
            </thead>
            <tbody>
              {weeklyForecast.map(day => (
                <tr key={day.day}>
                  <td><strong>{day.day}</strong></td>
                  <td className="mono">{day.temp}</td>
                  <td className="mono">{day.humidity}</td>
                  <td className="mono">{day.wind}</td>
                  <td className={`mono ${parseFloat(day.impact) > 5 ? 'text-danger' : 'text-warn'}`}>
                    {day.impact}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <CardHeader title="Renewable Generation Forecast" />
        <CardBody>
          <div className="renewable-grid">
            <div className="renewable-card solar">
              <div className="renewable-icon">☀️</div>
              <div className="renewable-value">1,245 MW</div>
              <div className="renewable-label">Expected Solar</div>
              <div className="renewable-change">+12% vs yesterday</div>
            </div>
            <div className="renewable-card wind">
              <div className="renewable-icon">💨</div>
              <div className="renewable-value">892 MW</div>
              <div className="renewable-label">Expected Wind</div>
              <div className="renewable-change">+4% vs yesterday</div>
            </div>
            <div className="renewable-card total">
              <div className="renewable-icon">⚡</div>
              <div className="renewable-value">2,137 MW</div>
              <div className="renewable-label">Total Renewable</div>
              <div className="renewable-change">34.7% of demand</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
