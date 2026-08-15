"""
Energy Forecast API - Main Application

FastAPI application for the Smart Grid Energy Demand Forecasting Dashboard.

Features:
- REST API endpoints for dashboard data
- Scheduled data pipeline for AEMO data
- ML model training and inference
- Real-time alerts and monitoring
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger
import sys

from app.core import settings
from app.api import router
from app.models import init_db
from app.services import get_scheduler


# Configure logging
logger.remove()
logger.add(
    sys.stdout,
    format="<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
    level="DEBUG" if settings.DEBUG else "INFO"
)
logger.add(
    "logs/api_{time:YYYY-MM-DD}.log",
    rotation="1 day",
    retention="30 days",
    level="INFO"
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager."""
    # Startup
    logger.info("Starting Energy Forecast API...")

    # Initialize database
    await init_db()
    logger.info("Database initialized")

    # Start scheduler
    scheduler = get_scheduler()
    scheduler.start()
    logger.info("Data pipeline scheduler started")

    yield

    # Shutdown
    logger.info("Shutting down...")
    scheduler.stop()
    logger.info("Scheduler stopped")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="""
    ## Energy Demand Forecasting API

    Backend service for the Smart Grid Energy Forecast Dashboard.

    ### Features
    - **Real-time Data**: Fetches energy demand data from AEMO
    - **ML Forecasting**: LSTM, Random Forest, and SARIMA models
    - **Scheduled Pipeline**: Automated data collection and model updates
    - **RESTful API**: Endpoints for dashboard integration

    ### Data Sources
    - AEMO (Australian Energy Market Operator)
    - OpenWeatherMap (Weather data)
    - Sample data for development

    ### Models
    - **LSTM**: Deep learning for temporal dependencies
    - **Random Forest**: Ensemble machine learning
    - **SARIMA**: Statistical time series forecasting
    """,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(router, prefix=settings.API_V1_PREFIX)


@app.get("/")
async def root():
    """Root endpoint with API information."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "docs": "/docs",
        "api_prefix": settings.API_V1_PREFIX,
        "endpoints": {
            "metrics": f"{settings.API_V1_PREFIX}/metrics",
            "forecasts": f"{settings.API_V1_PREFIX}/forecasts",
            "models": f"{settings.API_V1_PREFIX}/models",
            "historical": f"{settings.API_V1_PREFIX}/historical",
            "features": f"{settings.API_V1_PREFIX}/features",
            "weather": f"{settings.API_V1_PREFIX}/weather",
            "alerts": f"{settings.API_V1_PREFIX}/alerts",
            "data_sources": f"{settings.API_V1_PREFIX}/data-sources",
            "health": f"{settings.API_V1_PREFIX}/health"
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.DEBUG
    )
