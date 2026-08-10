import './Sidebar.css'
import {
  BoltIcon,
  DashboardIcon,
  ChartIcon,
  ClockIcon,
  LayersIcon,
  HelpIcon,
  SunIcon,
  DatabaseIcon,
  SettingsIcon
} from '../ui/Icons'

const navSections = [
  {
    label: 'Overview',
    items: [
      { id: 'dashboard', icon: DashboardIcon, label: 'Dashboard' },
      { id: 'forecasts', icon: ChartIcon, label: 'Forecasts' },
      { id: 'historical', icon: ClockIcon, label: 'Historical Data' }
    ]
  },
  {
    label: 'Analysis',
    items: [
      { id: 'models', icon: LayersIcon, label: 'Model Comparison' },
      { id: 'xai', icon: HelpIcon, label: 'Explainable AI' },
      { id: 'weather', icon: SunIcon, label: 'Weather Impact' }
    ]
  },
  {
    label: 'Settings',
    items: [
      { id: 'data', icon: DatabaseIcon, label: 'Data Sources' },
      { id: 'config', icon: SettingsIcon, label: 'Configuration' }
    ]
  }
]

export function Sidebar({ activeNav, onNavChange }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <BoltIcon />
          </div>
          <div className="logo-text">
            GridSense <span>AI</span>
          </div>
        </div>
      </div>

      <nav className="nav">
        {navSections.map(section => (
          <div key={section.label} className="nav-section">
            <div className="nav-label">{section.label}</div>
            {section.items.map(item => (
              <button
                key={item.id}
                className={`nav-item ${activeNav === item.id ? 'active' : ''}`}
                onClick={() => onNavChange(item.id)}
              >
                <item.icon />
                {item.label}
              </button>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-dot" />
          <span>All systems operational</span>
        </div>
      </div>
    </aside>
  )
}
