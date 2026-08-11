import { Card, CardHeader, CardBody } from '../components/ui/Card'
import { FeatureImportance } from '../components/dashboard'
import './Pages.css'

const featureDetails = [
  { name: 'Temperature', importance: 0.92, type: 'Weather', direction: 'Positive', desc: 'Higher temps increase cooling demand' },
  { name: 'Hour of Day', importance: 0.84, type: 'Temporal', direction: 'Cyclical', desc: 'Peak hours 14:00-18:00' },
  { name: 'Day of Week', importance: 0.71, type: 'Temporal', direction: 'Cyclical', desc: 'Weekdays higher than weekends' },
  { name: 'Solar Radiation', importance: 0.65, type: 'Weather', direction: 'Negative', desc: 'Reduces net demand via solar generation' },
  { name: 'Wind Speed', importance: 0.48, type: 'Weather', direction: 'Negative', desc: 'Wind generation offsets demand' },
  { name: 'Humidity', importance: 0.35, type: 'Weather', direction: 'Positive', desc: 'Higher humidity increases AC usage' }
]

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
              <p>Our LSTM model uses SHAP (SHapley Additive exPlanations) values to provide transparent insights into prediction drivers.</p>
              <ul>
                <li>Builds trust with stakeholders</li>
                <li>Identifies data quality issues</li>
                <li>Validates domain knowledge</li>
                <li>Supports regulatory compliance</li>
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
              {featureDetails.map(f => (
                <tr key={f.name}>
                  <td><strong>{f.name}</strong></td>
                  <td className="mono">{f.importance.toFixed(2)}</td>
                  <td>{f.type}</td>
                  <td>
                    <span className={`direction-badge ${f.direction.toLowerCase()}`}>
                      {f.direction}
                    </span>
                  </td>
                  <td className="desc-cell">{f.desc}</td>
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
            <div className="shap-row">
              <span className="shap-label">Temperature</span>
              <div className="shap-bar-container">
                <div className="shap-bar high" style={{ width: '92%' }}></div>
              </div>
            </div>
            <div className="shap-row">
              <span className="shap-label">Hour</span>
              <div className="shap-bar-container">
                <div className="shap-bar high" style={{ width: '84%' }}></div>
              </div>
            </div>
            <div className="shap-row">
              <span className="shap-label">Day</span>
              <div className="shap-bar-container">
                <div className="shap-bar medium" style={{ width: '71%' }}></div>
              </div>
            </div>
            <div className="shap-row">
              <span className="shap-label">Solar</span>
              <div className="shap-bar-container">
                <div className="shap-bar medium" style={{ width: '65%' }}></div>
              </div>
            </div>
            <div className="shap-row">
              <span className="shap-label">Wind</span>
              <div className="shap-bar-container">
                <div className="shap-bar low" style={{ width: '48%' }}></div>
              </div>
            </div>
            <div className="shap-row">
              <span className="shap-label">Humidity</span>
              <div className="shap-bar-container">
                <div className="shap-bar low" style={{ width: '35%' }}></div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
