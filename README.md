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

- HTML5 / CSS3
- JavaScript (Vanilla)
- SVG Charts
- Responsive Design

## Project Structure

```
.
├── energy-forecast-dashboard.html   # Main dashboard interface
├── README.md                        # Project documentation
├── CHANGELOG.md                     # Version history
└── Assignment-1-MDA692.docx         # Project specification
```

## Getting Started

1. Clone the repository
2. Open `energy-forecast-dashboard.html` in a browser
3. No build step required — static HTML

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
