# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.0.0] - 2026-08-10

### Changed

- **Full React Conversion** — Migrated from vanilla HTML/JS to React 18 + Vite
- Component-based architecture with modular, reusable components
- Separated concerns: UI components, layout components, dashboard panels

### Added

- **React Components**:
  - `ui/` — Card, Button, MetricCard, Icons (reusable primitives)
  - `layout/` — Sidebar, Header (app shell)
  - `dashboard/` — ForecastChart, ModelComparison, FeatureImportance, WeatherImpact, Alerts
- State management with React hooks (`useState`)
- Vite build system for fast development and optimized production builds
- Hot Module Replacement (HMR) for instant dev feedback
- Component-scoped CSS files

### Technical

- React 18.3.1 with StrictMode
- Vite 5.4.2 build tooling
- CSS modules pattern (component.css per component)
- Preserved all original functionality and design tokens

---

## [1.0.0] - 2026-08-10

### Added

- Initial dashboard release with complete UI
- **Metrics Panel**: Predicted peak demand, current load, model accuracy (MAPE), renewable share
- **Forecast Chart**: 7-day time series visualization with actual vs predicted demand
- **Model Comparison**: Side-by-side performance view of LSTM, Random Forest, SARIMA, ARIMA
- **Explainable AI Panel**: Feature importance bars (Temperature, Hour, Day, Solar, Wind, Humidity)
- **Weather Impact**: Real-time weather correlation with demand/generation effects
- **Operational Alerts**: Peak warnings, model updates, renewable integration status
- **Sidebar Navigation**: Dashboard, Forecasts, Historical Data, Models, XAI, Weather, Settings
- Responsive design for desktop and tablet viewports
- Interactive time range selector (24H, 7D, 30D, 90D)

### Technical

- Tech-utility design system with green accent (energy/sustainability theme)
- SVG-based charts with confidence intervals
- Monospace typography for data values
- CSS custom properties for theming
- Accessible focus states and contrast ratios
