"""
Application Configuration
"""
from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Application
    APP_NAME: str = "Energy Forecast API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # API Settings
    API_V1_PREFIX: str = "/api/v1"

    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./data/energy_forecast.db"

    # AEMO Data Source
    AEMO_BASE_URL: str = "https://aemo.com.au/aemo/data/nem/priceanddemand"
    AEMO_API_URL: str = "https://visualisations.aemo.com.au/aemo/apps/api/report/5MIN"

    # Alternative public energy data sources
    EIA_API_KEY: str = ""  # US Energy Information Administration
    ENTSOE_API_KEY: str = ""  # European grid data

    # Scheduler Settings
    FETCH_INTERVAL_MINUTES: int = 30  # Fetch new data every 30 minutes
    MODEL_RETRAIN_HOURS: int = 24  # Retrain models daily

    # ML Settings
    MODEL_PATH: Path = Path("data/models")
    LOOKBACK_HOURS: int = 168  # 7 days of hourly data for training
    FORECAST_HORIZON_HOURS: int = 24  # Predict next 24 hours

    # CORS
    CORS_ORIGINS: list = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


settings = get_settings()
