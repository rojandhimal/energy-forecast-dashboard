import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { CheckCircleIcon, ClockIcon } from '../components/ui/Icons'
import { dataSources } from '../services/api'
import './Pages.css'

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
            {dataSources.sources.map(source => (
              <div key={source.id} className="source-card">
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
                    <span className="stat-value">{source.recordsDisplay}</span>
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
              {dataSources.pipeline.stages.map(stage => (
                <div key={stage.name} className="pipeline-item">
                  {stage.status === 'healthy' ? <CheckCircleIcon /> : <ClockIcon />}
                  <span>{stage.name}</span>
                  <span className={`pipeline-value ${stage.status === 'healthy' ? 'success' : 'pending'}`}>
                    {stage.statusText}
                  </span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Data Quality Metrics" />
          <CardBody>
            <div className="quality-metrics">
              {dataSources.quality.metrics.map(metric => (
                <div key={metric.name} className="quality-item">
                  <span className="quality-label">{metric.name}</span>
                  <div className="quality-bar">
                    <div className="quality-fill" style={{ width: `${metric.value}%` }}></div>
                  </div>
                  <span className="quality-value">{metric.display}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
