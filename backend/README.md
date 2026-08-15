# Energy Forecast API Backend

Backend service for the Smart Grid Energy Demand Forecasting Dashboard. Provides REST API endpoints, scheduled data pipeline, and ML model training.

## Architecture

```
backend/
├── app/
│   ├── api/              # FastAPI routes
│   │   └── routes.py     # API endpoints
│   ├── core/             # Configuration
│   │   └── config.py     # Settings
│   ├── models/           # Database models
│   │   └── database.py   # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   │   └── responses.py  # Response models
│   ├── services/         # Business logic
│   │   ├── data_fetcher.py   # AEMO data fetching
│   │   ├── scheduler.py      # Job scheduler
│   │   └── ml_service.py     # ML models
│   └── main.py           # FastAPI app
├── data/
│   ├── raw/              # Raw fetched data
│   ├── processed/        # Processed data
│   └── models/           # Saved ML models
├── scripts/
│   └── init_data.py      # Initialize database
└── requirements.txt
```

## Quick Start

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Initialize Database & Train Models

```bash
python scripts/init_data.py
```

### 4. Start the Server

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/metrics` | GET | Dashboard metrics |
| `/api/v1/forecasts` | GET | Demand forecasts |
| `/api/v1/models` | GET | ML model info |
| `/api/v1/historical` | GET | Historical data |
| `/api/v1/features` | GET | XAI feature importance |
| `/api/v1/weather` | GET | Weather data |
| `/api/v1/alerts` | GET | System alerts |
| `/api/v1/data-sources` | GET | Data source status |
| `/api/v1/health` | GET | Health check |

### Query Parameters

- `range`: Time range filter (`24H`, `7D`, `30D`, `90D`)
- `days`: Number of days for historical data

### Example Requests

```bash
# Get metrics for last 7 days
curl http://localhost:8000/api/v1/metrics?range=7D

# Get forecasts for 24 hours
curl http://localhost:8000/api/v1/forecasts?range=24H

# Get historical data for 30 days
curl http://localhost:8000/api/v1/historical?days=30
```

## Scheduler Jobs

The scheduler runs these jobs automatically:

| Job | Interval | Description |
|-----|----------|-------------|
| `fetch_energy_data` | 30 min | Fetch AEMO demand data |
| `fetch_weather_data` | 15 min | Fetch weather data |
| `generate_forecasts` | 1 hour | Generate new forecasts |
| `retrain_models` | Daily 2 AM | Retrain ML models |
| `check_alerts` | 5 min | Check alert conditions |
| `cleanup_old_data` | Weekly | Remove old records |

### Manual Job Control

```bash
# Start scheduler
curl -X POST http://localhost:8000/api/v1/scheduler/start

# Stop scheduler
curl -X POST http://localhost:8000/api/v1/scheduler/stop

# Trigger a job manually
curl -X POST http://localhost:8000/api/v1/scheduler/run/fetch_energy_data

# Retrain models
curl -X POST http://localhost:8000/api/v1/models/retrain
```

## ML Models

### LSTM (Primary)
- Deep learning model for temporal dependencies
- Uses 7 days of historical data
- Features: temperature, hour, day, weather variables, lag features

### Random Forest
- Ensemble machine learning model
- Feature importance for explainability
- Fast training and inference

### SARIMA
- Statistical time series model
- Captures seasonal patterns
- Baseline comparison model

## Data Sources

### AEMO (Australian Energy Market Operator)
- Price and demand data (5-minute intervals)
- Regional data for NSW, VIC, QLD, SA, TAS
- Public API with rate limiting

### Weather Data
- OpenWeatherMap API (requires API key)
- Temperature, humidity, wind speed, solar radiation
- Falls back to sample data if unavailable

## Configuration

Environment variables (`.env` file):

```env
# Application
DEBUG=true
DATABASE_URL=sqlite+aiosqlite:///./data/energy_forecast.db

# Data Sources
AEMO_BASE_URL=https://aemo.com.au
EIA_API_KEY=your_key_here

# Scheduler
FETCH_INTERVAL_MINUTES=30
MODEL_RETRAIN_HOURS=24

# CORS
CORS_ORIGINS=["http://localhost:5173","http://localhost:3000"]
```

## Development

### Run Tests

```bash
pytest tests/
```

### API Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Logs

Logs are stored in `logs/api_YYYY-MM-DD.log` with 30-day retention.

## Connecting to Frontend

Update the frontend API service (`src/services/api.js`):

```javascript
const config = {
  useApi: true,  // Set to true
  baseUrl: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
}
```

## Production Deployment

### Docker

```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment

- Set `DEBUG=false`
- Use PostgreSQL instead of SQLite
- Configure proper CORS origins
- Set up reverse proxy (nginx)
- Use process manager (gunicorn, systemd)

---

*Part of the Smart Grid Energy Forecast Dashboard*
