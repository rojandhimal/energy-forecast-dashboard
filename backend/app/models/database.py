"""
Database Models and Connection
"""
from sqlalchemy import Column, Integer, Float, String, DateTime, Boolean, Index
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

from app.core import settings

# Create async engine
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    future=True
)

# Session factory
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

# Base class for models
Base = declarative_base()


class EnergyDemand(Base):
    """Energy demand readings from the grid."""
    __tablename__ = "energy_demand"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    region = Column(String(50), nullable=False, index=True)

    # Demand metrics
    demand_mw = Column(Float, nullable=False)
    price_aud_mwh = Column(Float)
    scheduled_generation = Column(Float)
    semi_scheduled_generation = Column(Float)

    # Weather data (if available)
    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    solar_radiation = Column(Float)

    # Metadata
    source = Column(String(50), default="AEMO")
    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_timestamp_region', 'timestamp', 'region'),
    )


class WeatherData(Base):
    """Weather observations for correlation analysis."""
    __tablename__ = "weather_data"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    location = Column(String(100), nullable=False)

    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    wind_direction = Column(Float)
    solar_radiation = Column(Float)
    cloud_cover = Column(Float)
    precipitation = Column(Float)

    source = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)


class Forecast(Base):
    """Model predictions stored for analysis."""
    __tablename__ = "forecasts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    forecast_timestamp = Column(DateTime, nullable=False)  # When forecast was made
    target_timestamp = Column(DateTime, nullable=False)     # What time is being predicted
    region = Column(String(50), nullable=False)

    # Predictions from different models
    lstm_prediction = Column(Float)
    rf_prediction = Column(Float)
    sarima_prediction = Column(Float)
    ensemble_prediction = Column(Float)

    # Actual value (filled in later)
    actual_demand = Column(Float)

    # Confidence intervals
    lower_bound_95 = Column(Float)
    upper_bound_95 = Column(Float)

    created_at = Column(DateTime, default=datetime.utcnow)

    __table_args__ = (
        Index('idx_forecast_target', 'forecast_timestamp', 'target_timestamp'),
    )


class ModelMetrics(Base):
    """Track model performance over time."""
    __tablename__ = "model_metrics"

    id = Column(Integer, primary_key=True, autoincrement=True)
    model_name = Column(String(50), nullable=False)
    trained_at = Column(DateTime, nullable=False)
    region = Column(String(50))

    # Performance metrics
    mae = Column(Float)
    rmse = Column(Float)
    mape = Column(Float)
    r2_score = Column(Float)

    # Training info
    training_samples = Column(Integer)
    feature_count = Column(Integer)
    model_path = Column(String(255))

    is_active = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Alert(Base):
    """System and operational alerts."""
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    alert_type = Column(String(50), nullable=False)  # warning, info, success, error
    severity = Column(String(20), nullable=False)    # low, medium, high, critical
    title = Column(String(200), nullable=False)
    description = Column(String(1000))
    region = Column(String(50))

    acknowledged = Column(Boolean, default=False)
    acknowledged_at = Column(DateTime)
    acknowledged_by = Column(String(100))

    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime)


async def init_db():
    """Initialize database tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def get_db() -> AsyncSession:
    """Dependency for getting database session."""
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()
