import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { ForecastChart } from '../components/dashboard'
import './Pages.css'

const forecastData = [
  { period: 'Next 24 Hours', peak: '4,215 MW', low: '2,890 MW', confidence: '98%' },
  { period: 'Next 7 Days', peak: '4,872 MW', low: '2,654 MW', confidence: '95%' },
  { period: 'Next 30 Days', peak: '5,124 MW', low: '2,412 MW', confidence: '89%' },
  { period: 'Next 90 Days', peak: '5,456 MW', low: '2,198 MW', confidence: '82%' }
]

export function ForecastsPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Energy Demand Forecasts</h2>
        <p className="page-desc">View detailed predictions across multiple time horizons using our LSTM model.</p>
      </div>

      <div className="grid grid-main" style={{ marginBottom: 16 }}>
        <ForecastChart />
        <Card>
          <CardHeader title="Forecast Summary" />
          <CardBody>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Peak Demand</th>
                  <th>Min Demand</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {forecastData.map(row => (
                  <tr key={row.period}>
                    <td>{row.period}</td>
                    <td className="mono">{row.peak}</td>
                    <td className="mono">{row.low}</td>
                    <td className="mono">{row.confidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Forecast Methodology" />
        <CardBody>
          <div className="methodology-grid">
            <div className="methodology-item">
              <h4>LSTM Neural Network</h4>
              <p>Primary model for capturing long-term temporal dependencies in energy consumption patterns.</p>
            </div>
            <div className="methodology-item">
              <h4>Ensemble Approach</h4>
              <p>Combines predictions from LSTM, Random Forest, and SARIMA for improved accuracy.</p>
            </div>
            <div className="methodology-item">
              <h4>Weather Integration</h4>
              <p>Real-time weather data feeds adjust predictions based on temperature and conditions.</p>
            </div>
            <div className="methodology-item">
              <h4>Confidence Intervals</h4>
              <p>95% confidence bands calculated using bootstrap resampling of historical errors.</p>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
