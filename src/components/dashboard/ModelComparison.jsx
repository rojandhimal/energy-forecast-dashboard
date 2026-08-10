import { Card, CardHeader, CardBody } from '../ui/Card'
import './ModelComparison.css'

const models = [
  { name: 'LSTM', type: 'Deep Learning', accuracy: 96.4, mae: 142, rmse: 186, best: true },
  { name: 'Random Forest', type: 'Machine Learning', accuracy: 92.1, mae: 198, rmse: 245 },
  { name: 'SARIMA', type: 'Statistical', accuracy: 89.3, mae: 234, rmse: 289 },
  { name: 'ARIMA', type: 'Statistical', accuracy: 85.7, mae: 278, rmse: 342 }
]

function getBarClass(accuracy) {
  if (accuracy >= 95) return 'best'
  if (accuracy >= 88) return 'good'
  return 'fair'
}

export function ModelComparison() {
  return (
    <Card>
      <CardHeader title="Model Performance" action="Details" />
      <CardBody>
        <div className="model-list">
          {models.map(model => (
            <div key={model.name} className="model-item">
              <div className="model-name">
                {model.name}
                <span>{model.type}</span>
                {model.best && <span className="best-badge">Best</span>}
              </div>
              <div className="model-bar">
                <div
                  className={`model-bar-fill ${getBarClass(model.accuracy)}`}
                  style={{ width: `${model.accuracy}%` }}
                />
              </div>
              <div className="model-metrics">
                <div className="model-metric">
                  <div className="model-metric-label">MAE</div>
                  <div className="model-metric-value">{model.mae}</div>
                </div>
                <div className="model-metric">
                  <div className="model-metric-label">RMSE</div>
                  <div className="model-metric-value">{model.rmse}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
