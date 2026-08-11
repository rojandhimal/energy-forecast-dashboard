import { Card, CardHeader, CardBody } from '../components/ui/Card'
import './Pages.css'

const historicalStats = [
  { label: 'Total Records', value: '2,628,000', desc: 'Hourly readings since 2021' },
  { label: 'Peak Demand Ever', value: '5,892 MW', desc: 'August 14, 2025 at 14:00' },
  { label: 'Lowest Demand', value: '1,847 MW', desc: 'January 1, 2024 at 04:00' },
  { label: 'Average Daily', value: '3,456 MW', desc: 'Rolling 365-day average' }
]

const recentHistory = [
  { date: '2026-08-10', avg: '3,641 MW', peak: '4,215 MW', renewable: '34.7%' },
  { date: '2026-08-09', avg: '3,712 MW', peak: '4,356 MW', renewable: '32.1%' },
  { date: '2026-08-08', avg: '3,589 MW', peak: '4,128 MW', renewable: '35.8%' },
  { date: '2026-08-07', avg: '3,678 MW', peak: '4,289 MW', renewable: '31.4%' },
  { date: '2026-08-06', avg: '3,534 MW', peak: '4,067 MW', renewable: '36.2%' },
  { date: '2026-08-05', avg: '3,601 MW', peak: '4,198 MW', renewable: '33.9%' },
  { date: '2026-08-04', avg: '3,445 MW', peak: '3,987 MW', renewable: '38.1%' }
]

export function HistoricalPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Historical Data</h2>
        <p className="page-desc">Explore past energy consumption patterns and trends.</p>
      </div>

      <div className="grid grid-metrics" style={{ marginBottom: 16 }}>
        {historicalStats.map(stat => (
          <Card key={stat.label}>
            <CardBody>
              <div className="stat-card">
                <div className="stat-label">{stat.label}</div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-desc">{stat.desc}</div>
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
              {recentHistory.map(row => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td className="mono">{row.avg}</td>
                  <td className="mono">{row.peak}</td>
                  <td className="mono">{row.renewable}</td>
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
