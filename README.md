# Smart Grid Energy Forecast System

A time series forecasting system for predicting future electricity demand using AI/ML models.

## Overview

This project implements an Energy Demand Forecasting Dashboard that helps electricity providers predict future demand using historical consumption data and environmental variables.

## Features

- **Real-time Demand Forecasting** — Predict peak demand with confidence intervals
- **Multi-Model Comparison** — Compare LSTM, Random Forest, SARIMA, and ARIMA models
- **Explainable AI (XAI)** — Feature importance analysis for transparent predictions
- **Weather Impact Analysis** — Correlate weather variables with demand patterns
- **Operational Alerts** — Proactive warnings for peak demand and system events

## Models Implemented

| Model | Type | Description |
|-------|------|-------------|
| LSTM | Deep Learning | Long Short-Term Memory networks for temporal dependencies |
| Random Forest | Machine Learning | Ensemble method for robust predictions |
| SARIMA | Statistical | Seasonal ARIMA for trend and seasonality |
| ARIMA | Statistical | Baseline autoregressive model |

## Performance Metrics

- **MAE** (Mean Absolute Error)
- **RMSE** (Root Mean Square Error)
- **MAPE** (Mean Absolute Percentage Error)

## Key Features Analyzed

1. Temperature
2. Hour of Day
3. Day of Week
4. Solar Radiation
5. Wind Speed
6. Humidity

## Tech Stack

- **React 18** with Vite
- **Component Architecture** — Modular, reusable components
- **CSS Custom Properties** — Theming with design tokens
- **SVG Charts** — Native SVG for data visualization
- **Responsive Design** — Desktop, tablet, mobile

## Documentation

- **[DATA_DOCUMENTATION.md](DATA_DOCUMENTATION.md)** — Complete data requirements, input variables, JSON schemas, and API specifications
- **[PROJECT_PROMPT.md](PROJECT_PROMPT.md)** — AI prompt for project continuation
- **[CHANGELOG.md](CHANGELOG.md)** — Version history and changes

## Project Structure

```
.
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   ├── layout/          # Layout components (Sidebar, Header)
│   │   └── dashboard/       # Dashboard panels
│   ├── pages/               # Page components (8 pages)
│   ├── data/                # JSON data files
│   │   ├── metrics.json     # KPI metrics by time range
│   │   ├── forecasts.json   # Forecast data and charts
│   │   ├── models.json      # ML model specifications
│   │   ├── historical.json  # Historical consumption
│   │   ├── features.json    # XAI feature importance
│   │   ├── weather.json     # Weather and renewables
│   │   ├── dataSources.json # Data pipeline status
│   │   └── alerts.json      # System alerts
│   ├── services/
│   │   └── api.js           # API service layer
│   ├── context/
│   │   └── TimeRangeContext.jsx  # Time filter state
│   ├── styles/
│   │   └── index.css        # Global styles & tokens
│   ├── App.jsx              # Main app with routing
│   └── main.jsx             # Entry point
├── DATA_DOCUMENTATION.md    # Data requirements & API specs
├── PROJECT_PROMPT.md        # AI continuation prompt
├── CHANGELOG.md             # Version history
├── energy-forecast-dashboard.html   # Static HTML version
├── package.json
├── vite.config.js
└── README.md
```

## Getting Started

### React Version (Recommended)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Run Backend & Scheduler (local)

The backend lives in the `backend/` folder. The data pipeline scheduler is started automatically when the backend app boots (see `app/main.py`), but you can also control it via the scheduler API endpoints.

```bash
# Change to backend and create an isolated environment
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Initialize the database and sample data (optional but recommended for first run)
python scripts/init_data.py

# Start the backend server (this will also start the scheduler automatically)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend API base: http://localhost:8000

Optional scheduler control (useful for manual testing):

```bash
# Start scheduler via API (if you prefer manual control)
curl -X POST http://localhost:8000/api/v1/scheduler/start

# Stop scheduler
curl -X POST http://localhost:8000/api/v1/scheduler/stop

# Trigger a job immediately (example)
curl -X POST http://localhost:8000/api/v1/scheduler/run/fetch_energy_data
```

See `backend/README.md` for full backend and scheduler documentation.

### Static HTML Version

Open `energy-forecast-dashboard.html` directly in a browser — no build required.

## Team

- Rojan Dhimal — Project Lead, Systems Architecture
- Sher Bahadur Baral — Statistical Models, Documentation
- Yuvrajsinh Vaghela — Data Preprocessing, Feature Engineering
- Altaf Ali — Machine Learning Implementation
- Vineet Bhatia — Project Management
- Mohammed Ibrahim Fawaz — Model Validation

## License

MIT License

---

*Part of MDA692 Data Analytics Capstone Project*
