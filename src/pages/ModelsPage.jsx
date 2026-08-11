import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { ModelComparison } from '../components/dashboard'
import './Pages.css'

const modelDetails = [
  {
    name: 'LSTM',
    type: 'Deep Learning',
    accuracy: '96.4%',
    mae: '142 MW',
    rmse: '186 MW',
    mape: '3.6%',
    training: '24 hours',
    features: 'Temperature, Hour, Day, Season, Solar, Wind, Humidity, Lag-24h, Lag-7d',
    status: 'Active'
  },
  {
    name: 'Random Forest',
    type: 'Machine Learning',
    accuracy: '92.1%',
    mae: '198 MW',
    rmse: '245 MW',
    mape: '7.9%',
    training: '2 hours',
    features: 'Temperature, Hour, Day, Season, Solar, Wind',
    status: 'Standby'
  },
  {
    name: 'SARIMA',
    type: 'Statistical',
    accuracy: '89.3%',
    mae: '234 MW',
    rmse: '289 MW',
    mape: '10.7%',
    training: '30 minutes',
    features: 'Lag-24h, Lag-7d, Seasonal components',
    status: 'Standby'
  },
  {
    name: 'ARIMA',
    type: 'Statistical',
    accuracy: '85.7%',
    mae: '278 MW',
    rmse: '342 MW',
    mape: '14.3%',
    training: '15 minutes',
    features: 'Lag-24h, Trend',
    status: 'Baseline'
  }
]

export function ModelsPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Model Comparison</h2>
        <p className="page-desc">Compare performance metrics across all forecasting models.</p>
      </div>

      <div className="grid grid-main" style={{ marginBottom: 16 }}>
        <ModelComparison />
        <Card>
          <CardHeader title="Model Selection Guide" />
          <CardBody>
            <div className="guide-list">
              <div className="guide-item">
                <strong>Use LSTM</strong> for production forecasts requiring highest accuracy
              </div>
              <div className="guide-item">
                <strong>Use Random Forest</strong> when interpretability is more important
              </div>
              <div className="guide-item">
                <strong>Use SARIMA</strong> for quick seasonal pattern analysis
              </div>
              <div className="guide-item">
                <strong>Use ARIMA</strong> as baseline comparison only
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Detailed Model Specifications" />
        <CardBody>
          <table className="data-table full-width">
            <thead>
              <tr>
                <th>Model</th>
                <th>Type</th>
                <th>MAE</th>
                <th>RMSE</th>
                <th>MAPE</th>
                <th>Training Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {modelDetails.map(model => (
                <tr key={model.name}>
                  <td><strong>{model.name}</strong></td>
                  <td>{model.type}</td>
                  <td className="mono">{model.mae}</td>
                  <td className="mono">{model.rmse}</td>
                  <td className="mono">{model.mape}</td>
                  <td>{model.training}</td>
                  <td>
                    <span className={`status-badge ${model.status.toLowerCase()}`}>
                      {model.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}
