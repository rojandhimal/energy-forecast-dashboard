#!/usr/bin/env python3
"""
Initialize database with sample historical data for development.

This script:
1. Creates database tables
2. Generates 30 days of synthetic historical data
3. Trains initial ML models
4. Creates sample alerts

Usage:
    python scripts/init_data.py
"""
import asyncio
import sys
from pathlib import Path
from datetime import datetime, timedelta

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from loguru import logger
from sqlalchemy import select

from app.models import init_db, async_session, EnergyDemand, Alert
from app.services import get_aemo_fetcher, get_ml_service


async def init_historical_data():
    """Generate and store historical energy data."""
    logger.info("Initializing historical data...")

    fetcher = get_aemo_fetcher()

    # Generate 30 days of historical data
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)

    df = await fetcher.fetch_historical_data(start_date, end_date, region="NSW1")

    # Store in database
    async with async_session() as session:
        # Check if data already exists
        result = await session.execute(
            select(EnergyDemand).limit(1)
        )
        if result.scalar_one_or_none():
            logger.info("Historical data already exists, skipping...")
            return

        # Insert records
        for _, row in df.iterrows():
            demand = EnergyDemand(
                timestamp=row["timestamp"],
                region=row["region"],
                demand_mw=row["demand_mw"],
                price_aud_mwh=row["price_aud_mwh"],
                temperature=row.get("temperature"),
                humidity=row.get("humidity"),
                wind_speed=row.get("wind_speed"),
                solar_radiation=row.get("solar_radiation"),
                source="SAMPLE"
            )
            session.add(demand)

        await session.commit()
        logger.info(f"Inserted {len(df)} historical records")


async def init_alerts():
    """Create sample alerts."""
    logger.info("Creating sample alerts...")

    async with async_session() as session:
        # Check if alerts exist
        result = await session.execute(select(Alert).limit(1))
        if result.scalar_one_or_none():
            logger.info("Alerts already exist, skipping...")
            return

        alerts = [
            Alert(
                alert_type="warning",
                severity="medium",
                title="Peak Demand Warning",
                description="Expected peak of 4,872 MW on Friday 14:00-16:00. Consider load shifting.",
                region="NSW1"
            ),
            Alert(
                alert_type="info",
                severity="low",
                title="Model Retrained",
                description="LSTM model updated with latest 30-day data. Accuracy improved 0.8%.",
                region="ALL",
                acknowledged=True
            ),
            Alert(
                alert_type="success",
                severity="low",
                title="Renewable Integration",
                description="Solar generation exceeded forecast by 12%. Grid stability maintained.",
                region="NSW1",
                acknowledged=True
            )
        ]

        for alert in alerts:
            session.add(alert)

        await session.commit()
        logger.info(f"Created {len(alerts)} sample alerts")


async def train_initial_models():
    """Train ML models with historical data."""
    logger.info("Training initial ML models...")

    fetcher = get_aemo_fetcher()
    ml_service = get_ml_service()

    # Get historical data
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=30)
    df = await fetcher.fetch_historical_data(start_date, end_date)

    # Train models
    metrics = await ml_service.retrain_models(df)
    logger.info(f"Model training complete: {metrics}")


async def main():
    """Main initialization routine."""
    logger.info("=" * 60)
    logger.info("Energy Forecast API - Data Initialization")
    logger.info("=" * 60)

    # Initialize database
    logger.info("Creating database tables...")
    await init_db()

    # Initialize historical data
    await init_historical_data()

    # Create sample alerts
    await init_alerts()

    # Train models
    await train_initial_models()

    logger.info("=" * 60)
    logger.info("Initialization complete!")
    logger.info("=" * 60)
    logger.info("")
    logger.info("To start the API server, run:")
    logger.info("  uvicorn app.main:app --reload")
    logger.info("")
    logger.info("API documentation will be available at:")
    logger.info("  http://localhost:8000/docs")
    logger.info("")


if __name__ == "__main__":
    asyncio.run(main())
