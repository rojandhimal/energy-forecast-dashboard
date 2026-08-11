import { useState } from 'react'
import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import './Pages.css'

export function ConfigurationPage() {
  const [forecastHorizon, setForecastHorizon] = useState('7')
  const [confidenceLevel, setConfidenceLevel] = useState('95')
  const [alertThreshold, setAlertThreshold] = useState('4500')
  const [autoRetrain, setAutoRetrain] = useState(true)

  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Configuration</h2>
        <p className="page-desc">Customize forecast parameters and system settings.</p>
      </div>

      <div className="grid grid-main">
        <Card>
          <CardHeader title="Forecast Settings" />
          <CardBody>
            <div className="form-group">
              <label className="form-label">Forecast Horizon (days)</label>
              <select
                className="form-select"
                value={forecastHorizon}
                onChange={e => setForecastHorizon(e.target.value)}
              >
                <option value="1">1 Day</option>
                <option value="7">7 Days</option>
                <option value="30">30 Days</option>
                <option value="90">90 Days</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Confidence Interval (%)</label>
              <select
                className="form-select"
                value={confidenceLevel}
                onChange={e => setConfidenceLevel(e.target.value)}
              >
                <option value="90">90%</option>
                <option value="95">95%</option>
                <option value="99">99%</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Model</label>
              <select className="form-select" defaultValue="lstm">
                <option value="lstm">LSTM (Recommended)</option>
                <option value="rf">Random Forest</option>
                <option value="sarima">SARIMA</option>
                <option value="arima">ARIMA</option>
                <option value="ensemble">Ensemble</option>
              </select>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Alert Settings" />
          <CardBody>
            <div className="form-group">
              <label className="form-label">Peak Demand Alert Threshold (MW)</label>
              <input
                type="number"
                className="form-input"
                value={alertThreshold}
                onChange={e => setAlertThreshold(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Alert Recipients</label>
              <input
                type="text"
                className="form-input"
                defaultValue="ops@gridsense.ai, alerts@gridsense.ai"
              />
            </div>

            <div className="form-group">
              <label className="form-check">
                <input type="checkbox" defaultChecked />
                <span>Email notifications</span>
              </label>
              <label className="form-check">
                <input type="checkbox" defaultChecked />
                <span>SMS for critical alerts</span>
              </label>
              <label className="form-check">
                <input type="checkbox" />
                <span>Slack integration</span>
              </label>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-main" style={{ marginTop: 16 }}>
        <Card>
          <CardHeader title="Model Training" />
          <CardBody>
            <div className="form-group">
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={autoRetrain}
                  onChange={e => setAutoRetrain(e.target.checked)}
                />
                <span>Enable automatic model retraining</span>
              </label>
            </div>

            <div className="form-group">
              <label className="form-label">Retraining Schedule</label>
              <select className="form-select" defaultValue="daily">
                <option value="hourly">Every Hour</option>
                <option value="daily">Daily at 02:00</option>
                <option value="weekly">Weekly (Sunday)</option>
                <option value="manual">Manual Only</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Training Data Window</label>
              <select className="form-select" defaultValue="365">
                <option value="30">Last 30 Days</option>
                <option value="90">Last 90 Days</option>
                <option value="365">Last 365 Days</option>
                <option value="730">Last 2 Years</option>
              </select>
            </div>

            <Button variant="default" style={{ marginTop: 8 }}>
              Trigger Manual Retrain
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="System Information" />
          <CardBody>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Version</span>
                <span className="info-value">GridSense AI v2.1.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">Last Model Update</span>
                <span className="info-value">2026-08-11 02:00 UTC</span>
              </div>
              <div className="info-item">
                <span className="info-label">API Endpoint</span>
                <span className="info-value mono">api.gridsense.ai/v2</span>
              </div>
              <div className="info-item">
                <span className="info-label">Database</span>
                <span className="info-value">PostgreSQL + TimescaleDB</span>
              </div>
              <div className="info-item">
                <span className="info-label">Model Serving</span>
                <span className="info-value">TensorFlow Serving</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <div className="action-bar" style={{ marginTop: 24 }}>
        <Button variant="primary">Save Configuration</Button>
        <Button variant="default">Reset to Defaults</Button>
      </div>
    </div>
  )
}
