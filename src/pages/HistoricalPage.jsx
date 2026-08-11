import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { historical } from '../services/api'
import './Pages.css'

export function HistoricalPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Historical Data</h2>
        <p className="page-desc">Explore past energy consumption patterns and trends.</p>
      </div>

      <div className="grid grid-metrics" style={{ marginBottom: 16 }}>
        {historical.stats.map(stat => (
          <Card key={stat.id}>
            <CardBody>
              <div className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.displayValue}</div>
                <div className="stat-desc">{stat.description}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Recent History (Last 7 Days)" action="Export CSV" />
        <CardBody>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Average Load</th>
                <th>Peak Demand</th>
                <th>Renewable %</th>
              </tr>
            </thead>
            <tbody>
              {historical.recentHistory.map(row => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td className="mono">{row.avgDisplay}</td>
                  <td className="mono">{row.peakDisplay}</td>
                  <td className="mono">{row.renewablePercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <CardHeader title="Historical Consumption Chart" />
        <CardBody>
          <div className="chart-placeholder">
            <svg viewBox="0 0 800 200" className="history-chart">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.3"/>
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path d="M0 150 Q100 120 200 130 T400 100 T600 110 T800 90 V200 H0 Z" fill="url(#areaGrad)"/>
              <path d="M0 150 Q100 120 200 130 T400 100 T600 110 T800 90" fill="none" stroke="var(--accent)" strokeWidth="2"/>
              <text x="400" y="180" textAnchor="middle" fill="var(--muted)" fontSize="12">30-Day Historical Trend</text>
            </svg>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
