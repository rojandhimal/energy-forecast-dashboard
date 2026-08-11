import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { WeatherImpact } from '../components/dashboard'
import { weather } from '../services/api'
import './Pages.css'

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
              {weather.correlations.map(c => (
                <div key={c.factor} className={`insight-item ${c.direction}`}>
                  <span className="insight-label">{c.factor}</span>
                  <span className="insight-value">{c.impact}</span>
                </div>
              ))}
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
              {weather.forecast.map(day => (
                <tr key={day.day}>
                  <td><strong>{day.day}</strong></td>
                  <td className="mono">{day.tempDisplay}</td>
                  <td className="mono">{day.humidityDisplay}</td>
                  <td className="mono">{day.windDisplay}</td>
                  <td className={`mono ${day.demandImpact > 5 ? 'text-danger' : 'text-warn'}`}>
                    {day.impactDisplay}
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
              <div className="renewable-value">{weather.renewables.solar.display}</div>
              <div className="renewable-label">Expected Solar</div>
              <div className="renewable-change">{weather.renewables.solar.changeText}</div>
            </div>
            <div className="renewable-card wind">
              <div className="renewable-icon">💨</div>
              <div className="renewable-value">{weather.renewables.wind.display}</div>
              <div className="renewable-label">Expected Wind</div>
              <div className="renewable-change">{weather.renewables.wind.changeText}</div>
            </div>
            <div className="renewable-card total">
              <div className="renewable-icon">⚡</div>
              <div className="renewable-value">{weather.renewables.total.display}</div>
              <div className="renewable-label">Total Renewable</div>
              <div className="renewable-change">{weather.renewables.total.percentText}</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
