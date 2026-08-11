import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { ForecastChart } from '../components/dashboard'
import { forecasts } from '../services/api'
import './Pages.css'

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
                {forecasts.summary.map(row => (
                  <tr key={row.period}>
                    <td>{row.period}</td>
                    <td className="mono">{row.peakDisplay}</td>
                    <td className="mono">{row.minDisplay}</td>
                    <td className="mono">{row.confidence}%</td>
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
            {forecasts.methodology.map(item => (
              <div key={item.title} className="methodology-item">
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
