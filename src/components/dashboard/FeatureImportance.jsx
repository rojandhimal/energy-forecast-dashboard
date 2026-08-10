import { Card, CardHeader, CardBody } from '../ui/Card'
import './FeatureImportance.css'

const features = [
  { name: 'Temperature', value: 0.92 },
  { name: 'Hour of Day', value: 0.84 },
  { name: 'Day of Week', value: 0.71 },
  { name: 'Solar Radiation', value: 0.65 },
  { name: 'Wind Speed', value: 0.48 },
  { name: 'Humidity', value: 0.35 }
]

export function FeatureImportance() {
  return (
    <Card>
      <CardHeader title="Explainable AI — Feature Importance" action="Full report" />
      <CardBody>
        <div className="feature-list">
          {features.map(feature => (
            <div key={feature.name} className="feature-item">
              <span className="feature-name">{feature.name}</span>
              <div className="feature-bar">
                <div
                  className="feature-bar-fill"
                  style={{ width: `${feature.value * 100}%` }}
                />
              </div>
              <span className="feature-value">{feature.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
