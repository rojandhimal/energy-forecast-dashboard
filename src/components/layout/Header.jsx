import './Header.css'
import { Button, TimeRangeSelector } from '../ui/Button'
import { CheckCircleIcon, DownloadIcon, PlayIcon } from '../ui/Icons'

export function Header({ timeRange, onTimeRangeChange, onRunForecast }) {
  const timeOptions = ['24H', '7D', '30D', '90D']

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="header-title">Energy Demand Forecast</h1>
        <span className="header-badge">
          <CheckCircleIcon />
          LSTM Model Active
        </span>
      </div>
      <div className="header-right">
        <TimeRangeSelector
          options={timeOptions}
          active={timeRange}
          onChange={onTimeRangeChange}
        />
        <Button>
          <DownloadIcon />
          Export
        </Button>
        <Button variant="primary" onClick={onRunForecast}>
          <PlayIcon />
          Run Forecast
        </Button>
      </div>
    </header>
  )
}
