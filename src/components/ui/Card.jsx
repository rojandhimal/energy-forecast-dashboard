import './Card.css'

export function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>
}

export function CardHeader({ title, action, onAction }) {
  return (
    <div className="card-header">
      <span className="card-title">{title}</span>
      {action && (
        <button className="card-action" onClick={onAction}>
          {action}
        </button>
      )}
    </div>
  )
}

export function CardBody({ children }) {
  return <div className="card-body">{children}</div>
}
