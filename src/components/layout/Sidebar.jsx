import { NavLink } from 'react-router-dom'
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
      { path: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
      { path: '/forecasts', icon: ChartIcon, label: 'Forecasts' },
      { path: '/historical', icon: ClockIcon, label: 'Historical Data' }
    ]
  },
  {
    label: 'Analysis',
    items: [
      { path: '/models', icon: LayersIcon, label: 'Model Comparison' },
      { path: '/xai', icon: HelpIcon, label: 'Explainable AI' },
      { path: '/weather', icon: SunIcon, label: 'Weather Impact' }
    ]
  },
  {
    label: 'Settings',
    items: [
      { path: '/data-sources', icon: DatabaseIcon, label: 'Data Sources' },
      { path: '/configuration', icon: SettingsIcon, label: 'Configuration' }
    ]
  }
]

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/" className="logo">
          <div className="logo-icon">
            <BoltIcon />
          </div>
          <div className="logo-text">
            GridSense <span>AI</span>
          </div>
        </NavLink>
      </div>

      <nav className="nav">
        {navSections.map(section => (
          <div key={section.label} className="nav-section">
            <div className="nav-label">{section.label}</div>
            {section.items.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? 'active' : ''}`
                }
              >
                <item.icon />
                {item.label}
              </NavLink>
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
