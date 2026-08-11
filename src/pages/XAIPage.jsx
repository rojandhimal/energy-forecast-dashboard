import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { FeatureImportance } from '../components/dashboard'
import { features } from '../services/api'
import './Pages.css'

export function XAIPage() {
  return (
    <div className="content">
      <div className="page-header">
        <h2 className="page-title">Explainable AI</h2>
        <p className="page-desc">Understand what factors drive our energy demand predictions.</p>
      </div>

      <div className="grid grid-main" style={{ marginBottom: 16 }}>
        <FeatureImportance />
        <Card>
          <CardHeader title="Why Explainability Matters" />
          <CardBody>
            <div className="xai-explanation">
              <p>Our LSTM model uses {features.explainability.fullName} ({features.explainability.method}) values to provide transparent insights into prediction drivers.</p>
              <ul>
                {features.explainability.benefits.map(benefit => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader title="Feature Analysis Details" />
        <CardBody>
          <table className="data-table full-width">
            <thead>
              <tr>
                <th>Feature</th>
                <th>Importance</th>
                <th>Category</th>
                <th>Direction</th>
                <th>Interpretation</th>
              </tr>
            </thead>
            <tbody>
              {features.features.map(f => (
                <tr key={f.id}>
                  <td><strong>{f.name}</strong></td>
                  <td className="mono">{f.importance.toFixed(2)}</td>
                  <td>{f.category}</td>
                  <td>
                    <span className={`direction-badge ${f.direction}`}>
                      {f.direction.charAt(0).toUpperCase() + f.direction.slice(1)}
                    </span>
                  </td>
                  <td className="desc-cell">{f.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <CardHeader title="SHAP Summary Plot" />
        <CardBody>
          <div className="shap-visualization">
            {features.features.map(f => (
              <div key={f.id} className="shap-row">
                <span className="shap-label">{f.name.split(' ')[0]}</span>
                <div className="shap-bar-container">
                  <div
                    className={`shap-bar ${f.importance >= 0.7 ? 'high' : f.importance >= 0.5 ? 'medium' : 'low'}`}
                    style={{ width: `${f.importance * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
