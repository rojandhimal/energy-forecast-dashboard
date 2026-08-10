import './Button.css'

export function Button({
  children,
  variant = 'default',
  onClick,
  className = ''
}) {
  return (
    <button
      className={`btn ${variant === 'primary' ? 'btn-primary' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export function TimeRangeSelector({ options, active, onChange }) {
  return (
    <div className="time-range">
      {options.map(option => (
        <button
          key={option}
          className={`time-btn ${active === option ? 'active' : ''}`}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}
