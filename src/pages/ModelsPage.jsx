import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { ModelComparison } from '../components/dashboard'
import { models } from '../services/api'
import './Pages.css'

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
              {models.models.map(model => (
                <div key={model.id} className="guide-item">
                  <strong>Use {model.name}</strong> {model.useCase.replace(`Use ${model.name} `, '')}
                </div>
              ))}
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
              {models.models.map(model => (
                <tr key={model.id}>
                  <td><strong>{model.name}</strong></td>
                  <td>{model.type}</td>
                  <td className="mono">{model.maeDisplay}</td>
                  <td className="mono">{model.rmseDisplay}</td>
                  <td className="mono">{model.mapeDisplay}</td>
                  <td>{model.trainingTime}</td>
                  <td>
                    <span className={`status-badge ${model.status}`}>
                      {model.status.charAt(0).toUpperCase() + model.status.slice(1)}
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
