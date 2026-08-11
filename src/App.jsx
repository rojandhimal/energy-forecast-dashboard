import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Sidebar, Header } from './components/layout'
import {
  DashboardPage,
  ForecastsPage,
  HistoricalPage,
  ModelsPage,
  XAIPage,
  WeatherPage,
  DataSourcesPage,
  ConfigurationPage
} from './pages'

export default function App() {
  const [timeRange, setTimeRange] = useState('7D')

  const handleRunForecast = () => {
    console.log('Running forecast...')
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Sidebar />

        <main className="main">
          <Header
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            onRunForecast={handleRunForecast}
          />

          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/forecasts" element={<ForecastsPage />} />
            <Route path="/historical" element={<HistoricalPage />} />
            <Route path="/models" element={<ModelsPage />} />
            <Route path="/xai" element={<XAIPage />} />
            <Route path="/weather" element={<WeatherPage />} />
            <Route path="/data-sources" element={<DataSourcesPage />} />
            <Route path="/configuration" element={<ConfigurationPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
