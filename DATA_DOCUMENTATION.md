# Data Requirements & Input Variables

This document describes the data structure, input variables, and API requirements for the Smart Grid Energy Demand Forecasting Dashboard.

---

## Table of Contents

1. [Overview](#overview)
2. [Input Variables for ML Models](#input-variables-for-ml-models)
3. [Data Files Structure](#data-files-structure)
4. [API Endpoints](#api-endpoints)
5. [Time Range Filtering](#time-range-filtering)

---

## Overview

The dashboard consumes JSON data that can be served from static files (development) or REST API endpoints (production). All data is organized by functional domain and supports time-range filtering (24H, 7D, 30D, 90D).

### Data Flow

```
[Data Sources] → [Feature Engineering] → [ML Models] → [API/JSON] → [Dashboard]
     ↓                    ↓                   ↓
  SCADA System      Temperature          LSTM Model
  Weather API       Hour of Day          Random Forest
  Solar Telemetry   Day of Week          SARIMA
  Wind Telemetry    Lag Features         ARIMA
```

---

## Input Variables for ML Models

### Primary Features

| Variable | Type | Unit | Range | Description |
|----------|------|------|-------|-------------|
| `temperature` | float | °C | -10 to 45 | Ambient air temperature |
| `hour_of_day` | int | hour | 0-23 | Hour when measurement was taken |
| `day_of_week` | int | day | 0-6 | Day of week (0=Monday, 6=Sunday) |
| `month` | int | month | 1-12 | Month of year |
| `season` | categorical | - | spring/summer/fall/winter | Seasonal indicator |
| `solar_radiation` | float | W/m² | 0-1200 | Solar irradiance level |
| `wind_speed` | float | km/h | 0-120 | Wind speed at hub height |
| `humidity` | float | % | 0-100 | Relative humidity |
| `is_holiday` | boolean | - | true/false | Public holiday indicator |
| `is_weekend` | boolean | - | true/false | Weekend indicator |

### Lag Features (Time Series)

| Variable | Type | Unit | Description |
|----------|------|------|-------------|
| `demand_lag_1h` | float | MW | Demand 1 hour ago |
| `demand_lag_24h` | float | MW | Demand 24 hours ago |
| `demand_lag_7d` | float | MW | Demand 7 days ago |
| `demand_rolling_mean_24h` | float | MW | Rolling 24-hour average demand |
| `demand_rolling_std_24h` | float | MW | Rolling 24-hour standard deviation |

### Target Variable

| Variable | Type | Unit | Description |
|----------|------|------|-------------|
| `energy_demand` | float | MW | Actual/predicted energy demand |

### Feature Importance (SHAP Values)

Based on LSTM model analysis:

| Feature | Importance | Direction | Impact |
|---------|------------|-----------|--------|
| Temperature | 0.92 | Positive | +2.5% per °C above 25°C |
| Hour of Day | 0.84 | Cyclical | Peak at 14:00-18:00 |
| Day of Week | 0.71 | Cyclical | Weekdays > Weekends |
| Solar Radiation | 0.65 | Negative | -0.8% per 100 W/m² |
| Wind Speed | 0.48 | Negative | -0.3% per 5 km/h |
| Humidity | 0.35 | Positive | +0.4% per 10% increase |

---

## Data Files Structure

All data files are located in `src/data/` directory.

### 1. Metrics (`metrics.json`)

Dashboard KPI metrics, segmented by time range.

```json
{
  "24H": {
    "metrics": [
      {
        "id": "peak_demand",
        "label": "Predicted Peak Demand",
        "value": 4215,
        "displayValue": "4,215",
        "unit": "MW",
        "change": 1.8,
        "changeText": "+1.8% from yesterday",
        "trend": "up",
        "icon": "bolt"
      }
    ],
    "lastUpdated": "2026-08-11T10:30:00Z"
  },
  "7D": { ... },
  "30D": { ... },
  "90D": { ... }
}
```

**Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique identifier |
| `label` | string | Yes | Display label |
| `value` | number | Yes | Raw numeric value |
| `displayValue` | string | Yes | Formatted display string |
| `unit` | string | Yes | Unit of measurement |
| `change` | number | Yes | Percentage change |
| `changeText` | string | Yes | Human-readable change description |
| `trend` | string | Yes | "up" or "down" |
| `icon` | string | Yes | Icon identifier (bolt/clock/check/sun) |

---

### 2. Forecasts (`forecasts.json`)

Demand predictions and chart data, segmented by time range.

```json
{
  "7D": {
    "summary": [
      {
        "period": "Next 24 Hours",
        "peakDemand": 4215,
        "peakDisplay": "4,215 MW",
        "minDemand": 2890,
        "minDisplay": "2,890 MW",
        "confidence": 98
      }
    ],
    "chartData": {
      "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      "actual": [
        { "day": "Mon", "value": 3800, "x": 90, "y": 105 }
      ],
      "lstm": [
        { "day": "Fri", "value": 4100, "x": 394, "y": 78 }
      ]
    }
  },
  "methodology": [
    {
      "title": "LSTM Neural Network",
      "description": "Primary model for temporal dependencies"
    }
  ]
}
```

**Summary Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `period` | string | Yes | Time period label |
| `peakDemand` | number | Yes | Maximum demand value |
| `peakDisplay` | string | Yes | Formatted peak string |
| `minDemand` | number | Yes | Minimum demand value |
| `minDisplay` | string | Yes | Formatted minimum string |
| `confidence` | number | Yes | Confidence level (0-100%) |

---

### 3. Models (`models.json`)

ML model specifications and performance metrics.

```json
{
  "models": [
    {
      "id": "lstm",
      "name": "LSTM",
      "type": "Deep Learning",
      "accuracy": 96.4,
      "mae": 142,
      "maeDisplay": "142 MW",
      "rmse": 186,
      "rmseDisplay": "186 MW",
      "mape": 3.6,
      "mapeDisplay": "3.6%",
      "trainingTime": "24 hours",
      "features": ["Temperature", "Hour", "Day", "Season", "Solar", "Wind", "Humidity", "Lag-24h", "Lag-7d"],
      "status": "active",
      "isBest": true
    }
  ]
}
```

**Model Fields:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique model identifier |
| `name` | string | Yes | Display name |
| `type` | string | Yes | Model category |
| `accuracy` | number | Yes | Accuracy percentage |
| `mae` | number | Yes | Mean Absolute Error |
| `rmse` | number | Yes | Root Mean Square Error |
| `mape` | number | Yes | Mean Absolute Percentage Error |
| `trainingTime` | string | Yes | Training duration |
| `features` | array | Yes | Input features used |
| `status` | string | Yes | active/standby/baseline |
| `isBest` | boolean | Yes | Best performing model flag |

---

### 4. Historical (`historical.json`)

Historical consumption records and statistics.

```json
{
  "stats": [
    {
      "id": "total_records",
      "label": "Total Records",
      "value": 2628000,
      "displayValue": "2,628,000",
      "description": "Hourly readings since 2021"
    }
  ],
  "recentHistory": [
    {
      "date": "2026-08-10",
      "averageLoad": 3641,
      "avgDisplay": "3,641 MW",
      "peakDemand": 4215,
      "peakDisplay": "4,215 MW",
      "renewablePercent": 34.7
    }
  ]
}
```

---

### 5. Features (`features.json`)

Explainable AI (XAI) feature importance data.

```json
{
  "features": [
    {
      "id": "temperature",
      "name": "Temperature",
      "importance": 0.92,
      "category": "Weather",
      "direction": "positive",
      "description": "Higher temps increase cooling demand",
      "correlation": "+2.5% per °C above 25°C"
    }
  ],
  "explainability": {
    "method": "SHAP",
    "fullName": "SHapley Additive exPlanations",
    "benefits": [
      "Builds trust with stakeholders",
      "Identifies data quality issues"
    ]
  }
}
```

---

### 6. Weather (`weather.json`)

Weather conditions and renewable generation forecasts.

```json
{
  "current": {
    "temperature": 32,
    "temperatureDisplay": "32°C",
    "humidity": 65,
    "windSpeed": 18,
    "conditions": "Partly Cloudy"
  },
  "forecast": [
    {
      "day": "Monday",
      "temperature": 32,
      "tempDisplay": "32°C",
      "humidity": 65,
      "humidityDisplay": "65%",
      "windSpeed": 18,
      "windDisplay": "18 km/h",
      "demandImpact": 8.2,
      "impactDisplay": "+8.2%"
    }
  ],
  "renewables": {
    "solar": {
      "expected": 1245,
      "display": "1,245 MW",
      "change": 12,
      "changeText": "+12% vs yesterday"
    },
    "wind": { ... },
    "total": { ... }
  }
}
```

---

### 7. Data Sources (`dataSources.json`)

Connected data feeds and pipeline status.

```json
{
  "sources": [
    {
      "id": "grid_scada",
      "name": "Grid SCADA System",
      "type": "Real-time",
      "frequency": "Every 5 min",
      "lastSync": "2 min ago",
      "lastSyncTimestamp": "2026-08-11T10:28:00Z",
      "status": "active",
      "recordCount": 2600000,
      "recordsDisplay": "2.6M"
    }
  ],
  "pipeline": {
    "stages": [
      { "name": "Ingestion Pipeline", "status": "healthy" },
      { "name": "Data Validation", "status": "healthy" },
      { "name": "Feature Engineering", "status": "healthy" },
      { "name": "Model Retraining", "status": "pending" }
    ]
  },
  "quality": {
    "metrics": [
      { "name": "Completeness", "value": 99.2 },
      { "name": "Accuracy", "value": 98.7 },
      { "name": "Timeliness", "value": 99.8 }
    ]
  }
}
```

---

### 8. Alerts (`alerts.json`)

System alerts and notifications.

```json
{
  "alerts": [
    {
      "id": "alert_001",
      "type": "warning",
      "severity": "medium",
      "icon": "triangle",
      "title": "Peak Demand Warning",
      "description": "Expected peak of 4,872 MW on Friday",
      "timestamp": "2026-08-11T08:30:00Z",
      "timeAgo": "2h ago",
      "acknowledged": false
    }
  ]
}
```

---

## API Endpoints

When converting to a real backend, implement these endpoints:

| Endpoint | Method | Parameters | Description |
|----------|--------|------------|-------------|
| `/api/v1/metrics` | GET | `range` (24H/7D/30D/90D) | Dashboard metrics |
| `/api/v1/forecasts` | GET | `range` | Demand forecasts |
| `/api/v1/models` | GET | - | Model specifications |
| `/api/v1/historical` | GET | `days` | Historical data |
| `/api/v1/features` | GET | - | XAI feature importance |
| `/api/v1/weather` | GET | - | Weather data |
| `/api/v1/data-sources` | GET | - | Data source status |
| `/api/v1/alerts` | GET | - | System alerts |

### Example API Response

```http
GET /api/v1/metrics?range=7D

{
  "success": true,
  "data": {
    "metrics": [...],
    "lastUpdated": "2026-08-11T10:30:00Z"
  }
}
```

---

## Time Range Filtering

The dashboard supports four time ranges that affect data granularity:

| Range | Period | Use Case |
|-------|--------|----------|
| **24H** | Last 24 hours | Real-time monitoring, hourly patterns |
| **7D** | Last 7 days | Weekly trends, daily patterns |
| **30D** | Last 30 days | Monthly analysis, weekly patterns |
| **90D** | Last 90 days | Quarterly trends, seasonal patterns |

### Implementation

```javascript
// Frontend usage
import { useTimeRange } from './context'
import { getMetricsSync } from './services/api'

function Dashboard() {
  const { timeRange } = useTimeRange()  // "24H", "7D", "30D", or "90D"
  const metrics = getMetricsSync(timeRange)
  // ...
}
```

---

## Data Validation Rules

### Required Fields

All data files must include:
- `lastUpdated`: ISO 8601 timestamp
- Unique `id` for each record
- Both raw values and display-formatted strings

### Value Constraints

| Field | Constraint |
|-------|------------|
| `demand` | 0 < value < 10,000 MW |
| `confidence` | 0 ≤ value ≤ 100 |
| `accuracy` | 0 ≤ value ≤ 100 |
| `importance` | 0 ≤ value ≤ 1 |
| `temperature` | -50 < value < 60 °C |

---

## Integration Checklist

- [ ] All JSON files valid and complete
- [ ] Time-range segmented data available
- [ ] API endpoints return proper JSON structure
- [ ] Error handling for missing/invalid data
- [ ] Timestamps in ISO 8601 format
- [ ] Numeric values as numbers, not strings
- [ ] Display values pre-formatted with units

---

*Last updated: 2026-08-12*
