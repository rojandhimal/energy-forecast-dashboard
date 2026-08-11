# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [2.4.0] - 2026-08-12

### Added

- **Time Range Filter Functionality** — 24H, 7D, 30D, 90D buttons now change dashboard data
- `TimeRangeContext` for global state management of selected time period
- Dynamic metrics that update based on selected time range
- Time-period specific forecast summaries and chart data
- Context provider pattern for sharing filter state across components

### Changed

- Metrics data structure now includes time-segmented values
- ForecastChart component dynamically renders based on selected period
- API service supports time range parameter for data filtering

---

## [2.3.0] - 2026-08-11

### Added

- **JSON Data Layer** for backend integration preparation
- 8 JSON data files: metrics, forecasts, models, historical, features, weather, dataSources, alerts
- **API Service** (`src/services/api.js`) with sync and async data fetching
- Architecture ready for easy conversion to real API endpoints

### Changed

- All page components now consume centralized data via API service
- Removed hardcoded data from individual components

---

## [2.2.0] - 2026-08-11

### Added

- **Multi-page Navigation** with React Router v7
- **8 dedicated pages** for each menu item:
  - `DashboardPage` — Overview with metrics, chart, and panels
  - `ForecastsPage` — Detailed forecasting with methodology
  - `HistoricalPage` — Historical data analysis and trends
  - `ModelsPage` — Model comparison with specifications
  - `XAIPage` — Explainable AI with SHAP visualization
  - `WeatherPage` — Weather impact and renewable forecast
  - `DataSourcesPage` — Data pipeline management
  - `ConfigurationPage` — System settings with forms
- Client-side routing with NavLink active states
- Comprehensive page styles (`Pages.css`)

### Changed

- Sidebar now uses `NavLink` instead of button elements
- Navigation highlights current page automatically
- Logo links to dashboard home

---

## [2.1.0] - 2026-08-11

### Added

- `PROJECT_PROMPT.md` — Reusable prompt for AI continuation and project recreation
- Production build verified (`dist/` output)
- `node_modules/` properly configured with dev dependencies

### Documentation

- Project brief and design system documentation
- Sample prompts for future AI sessions
- Team credits and reference documents listing

---

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
