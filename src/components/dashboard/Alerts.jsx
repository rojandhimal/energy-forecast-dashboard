import { Card, CardHeader, CardBody } from '../ui/Card'
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon } from '../ui/Icons'
import './Alerts.css'

const alerts = [
  {
    type: 'warning',
    icon: AlertTriangleIcon,
    title: 'Peak Demand Warning',
    desc: 'Expected peak of 4,872 MW on Friday 14:00-16:00. Consider load shifting.',
    time: '2h ago'
  },
  {
    type: 'info',
    icon: InfoIcon,
    title: 'Model Retrained',
    desc: 'LSTM model updated with latest 30-day data. Accuracy improved 0.8%.',
    time: '5h ago'
  },
  {
    type: 'success',
    icon: CheckCircleIcon,
    title: 'Renewable Integration',
    desc: 'Solar generation exceeded forecast by 12%. Grid stability maintained.',
    time: '1d ago'
  }
]

export function Alerts() {
  return (
    <Card>
      <CardHeader title="Operational Alerts" action="View all" />
      <CardBody>
        <div className="alert-list">
          {alerts.map((alert, i) => (
            <div key={i} className={`alert-item ${alert.type}`}>
              <div className="alert-icon">
                <alert.icon />
              </div>
              <div className="alert-content">
                <div className="alert-title">{alert.title}</div>
                <div className="alert-desc">{alert.desc}</div>
              </div>
              <span className="alert-time">{alert.time}</span>
            </div>
          ))}
        </div>
      </CardBody>
    </Card>
  )
}
