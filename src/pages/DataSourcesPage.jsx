import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { CheckCircleIcon, ClockIcon } from '../components/ui/Icons'
import './Pages.css'

const dataSources = [
  {
    name: 'Grid SCADA System',
    type: 'Real-time',
    frequency: 'Every 5 min',
    lastSync: '2 min ago',
    status: 'active',
    records: '2.6M'
  },
  {
    name: 'Weather API (OpenWeather)',
    type: 'External API',
    frequency: 'Every 15 min',
    lastSync: '8 min ago',
    status: 'active',
    records: '156K'
  },
  {
    name: 'Solar Farm Telemetry',
    type: 'Real-time',
    frequency: 'Every 1 min',
    lastSync: '45 sec ago',
    status: 'active',
    records: '892K'
  },
  {
    name: 'Wind Farm Telemetry',
    type: 'Real-time',
    frequency: 'Every 1 min',
    lastSync: '32 sec ago',
    status: 'active',
    records: '654K'
  },
  {
    name: 'Historical Archive',
    type: 'Batch',
    frequency: 'Daily',
    lastSync: '6 hours ago',
    status: 'active',
    records: '45M'
  },
  {
    name: 'Holiday Calendar',
    type: 'Static',
    frequency: 'Yearly',
    lastSync: '30 days ago',
    status: 'active',
    records: '365'
  }
]

export function DataSourcesPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Data Sources</h2>
        <p className="page-desc">Manage and monitor data feeds powering the forecasting system.</p>
      </div>

      <Card>
        <CardHeader title="Connected Data Sources" action="Add Source" />
        <CardBody>
          <div className="sources-grid">
            {dataSources.map(source => (
              <div key={source.name} className="source-card">
                <div className="source-header">
                  <div className="source-status">
                    <span className={`status-dot ${source.status}`}></span>
                    <span className="source-name">{source.name}</span>
                  </div>
                  <span className="source-type">{source.type}</span>
                </div>
                <div className="source-details">
                  <div className="source-stat">
                    <span className="stat-label">Frequency</span>
                    <span className="stat-value">{source.frequency}</span>
                  </div>
                  <div className="source-stat">
                    <span className="stat-label">Last Sync</span>
                    <span className="stat-value">{source.lastSync}</span>
                  </div>
                  <div className="source-stat">
                    <span className="stat-label">Records</span>
                    <span className="stat-value">{source.records}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-main" style={{ marginTop: 16 }}>
        <Card>
          <CardHeader title="Data Pipeline Health" />
          <CardBody>
            <div className="pipeline-status">
              <div className="pipeline-item">
                <CheckCircleIcon />
                <span>Ingestion Pipeline</span>
                <span className="pipeline-value success">Healthy</span>
              </div>
              <div className="pipeline-item">
                <CheckCircleIcon />
                <span>Data Validation</span>
                <span className="pipeline-value success">Passing</span>
              </div>
              <div className="pipeline-item">
                <CheckCircleIcon />
                <span>Feature Engineering</span>
                <span className="pipeline-value success">Running</span>
              </div>
              <div className="pipeline-item">
                <ClockIcon />
                <span>Model Retraining</span>
                <span className="pipeline-value pending">Scheduled 02:00</span>
              </div>
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Data Quality Metrics" />
          <CardBody>
            <div className="quality-metrics">
              <div className="quality-item">
                <span className="quality-label">Completeness</span>
                <div className="quality-bar">
                  <div className="quality-fill" style={{ width: '99.2%' }}></div>
                </div>
                <span className="quality-value">99.2%</span>
              </div>
              <div className="quality-item">
                <span className="quality-label">Accuracy</span>
                <div className="quality-bar">
                  <div className="quality-fill" style={{ width: '98.7%' }}></div>
                </div>
                <span className="quality-value">98.7%</span>
              </div>
              <div className="quality-item">
                <span className="quality-label">Timeliness</span>
                <div className="quality-bar">
                  <div className="quality-fill" style={{ width: '99.8%' }}></div>
                </div>
                <span className="quality-value">99.8%</span>
              </div>
              <div className="quality-item">
                <span className="quality-label">Consistency</span>
                <div className="quality-bar">
                  <div className="quality-fill" style={{ width: '97.4%' }}></div>
                </div>
                <span className="quality-value">97.4%</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
