# Smart Grid Energy Forecast Dashboard — Project Prompt

Use this prompt to continue development or recreate similar projects.

## Project Brief

This is a **Smart Grid Energy Demand Forecasting System** that predicts/forecasts energy consumption for the future. The dashboard is designed for energy sector professionals and data analysts.

## Key Features

1. **Real-time Demand Forecasting** — Predict peak demand with confidence intervals
2. **Multi-Model Comparison** — Compare LSTM, Random Forest, SARIMA, and ARIMA models
3. **Explainable AI (XAI)** — Feature importance analysis for transparent predictions
4. **Weather Impact Analysis** — Correlate weather variables with demand patterns
5. **Operational Alerts** — Proactive warnings for peak demand and system events

## Models Implemented

| Model | Type | Use Case |
|-------|------|----------|
| LSTM | Deep Learning | Primary forecasting model for temporal dependencies |
| Random Forest | Machine Learning | Ensemble method for robust predictions |
| SARIMA | Statistical | Seasonal trend analysis |
| ARIMA | Statistical | Baseline autoregressive model |

## Performance Metrics

- **MAE** (Mean Absolute Error)
- **RMSE** (Root Mean Square Error)
- **MAPE** (Mean Absolute Percentage Error)

## Key Features Analyzed (XAI)

1. Temperature (highest impact)
2. Hour of Day
3. Day of Week
4. Solar Radiation
5. Wind Speed
6. Humidity

## Design System

- **Direction**: Tech-utility (Datadog/GitHub style)
- **Primary Accent**: Green (`oklch(58% 0.16 145)`) — energy/sustainability theme
- **Typography**: System sans-serif, monospace for data values
- **Layout**: Dense utility dashboard with sidebar navigation + grid panels

## Tech Stack

- React 18.3.1 with Vite 5.4
- Component-based architecture
- CSS Custom Properties for theming
- SVG-based data visualizations

## Project Structure

```
src/
├── components/
│   ├── ui/           # Card, Button, MetricCard, Icons
│   ├── layout/       # Sidebar, Header
│   └── dashboard/    # ForecastChart, ModelComparison, FeatureImportance, WeatherImpact, Alerts
├── styles/           # Global CSS with design tokens
├── App.jsx           # Main app with state management
└── main.jsx          # Entry point
```

## Running the Project

```bash
# Install dependencies
npm install --include=dev

# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Sample Prompt for AI Continuation

> "I have a Smart Grid Energy Forecasting Dashboard built with React and Vite. It displays energy demand predictions using LSTM, Random Forest, SARIMA, and ARIMA models. The dashboard includes:
> - Metric cards showing predicted peak demand, current load, model accuracy, and renewable share
> - A 7-day forecast chart with confidence intervals
> - Model comparison panel with MAE/RMSE metrics
> - Explainable AI panel showing feature importance
> - Weather impact analysis grid
> - Operational alerts section
> 
> The design uses a tech-utility aesthetic with green accent colors for the energy sector. Please [describe what you want to add/change]."

## Team (Original Capstone Project)

- Rojan Dhimal — Project Lead, Systems Architecture
- Sher Bahadur Baral — Statistical Models, Documentation
- Yuvrajsinh Vaghela — Data Preprocessing, Feature Engineering
- Altaf Ali — Machine Learning Implementation
- Vineet Bhatia — Project Management
- Mohammed Ibrahim Fawaz — Model Validation

## Reference Documents

- `Assignment-1-MDA692.docx` — Original project specification
- `README.md` — Setup and project overview
- `CHANGELOG.md` — Version history

---

*Part of MDA692 Data Analytics Capstone Project*
