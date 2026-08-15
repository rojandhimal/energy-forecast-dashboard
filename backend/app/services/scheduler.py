"""
Data Pipeline Scheduler

Manages scheduled tasks for:
1. Fetching new energy data at regular intervals
2. Updating weather data
3. Retraining ML models periodically
4. Generating forecasts
5. Cleaning up old data
"""
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.interval import IntervalTrigger
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime, timedelta
from loguru import logger
from sqlalchemy import select, delete
from sqlalchemy.ext.asyncio import AsyncSession
import asyncio

from app.core import settings
from app.models import EnergyDemand, WeatherData, Forecast, Alert, async_session
from app.services.data_fetcher import get_aemo_fetcher, get_weather_fetcher


class DataPipelineScheduler:
    """
    Orchestrates the data pipeline with scheduled jobs.

    Jobs:
    - fetch_energy_data: Every 30 minutes (configurable)
    - fetch_weather_data: Every 15 minutes
    - generate_forecasts: Every hour
    - retrain_models: Daily at 2 AM
    - cleanup_old_data: Weekly
    - check_alerts: Every 5 minutes
    """

    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.is_running = False

    def start(self):
        """Start the scheduler with all jobs."""
        if self.is_running:
            logger.warning("Scheduler already running")
            return

        # Job 1: Fetch energy data
        self.scheduler.add_job(
            self._fetch_energy_data_job,
            IntervalTrigger(minutes=settings.FETCH_INTERVAL_MINUTES),
            id="fetch_energy_data",
            name="Fetch Energy Data from AEMO",
            replace_existing=True,
            next_run_time=datetime.now()  # Run immediately on start
        )

        # Job 2: Fetch weather data
        self.scheduler.add_job(
            self._fetch_weather_data_job,
            IntervalTrigger(minutes=15),
            id="fetch_weather_data",
            name="Fetch Weather Data",
            replace_existing=True
        )

        # Job 3: Generate forecasts
        self.scheduler.add_job(
            self._generate_forecasts_job,
            IntervalTrigger(hours=1),
            id="generate_forecasts",
            name="Generate Demand Forecasts",
            replace_existing=True
        )

        # Job 4: Retrain models daily at 2 AM
        self.scheduler.add_job(
            self._retrain_models_job,
            CronTrigger(hour=2, minute=0),
            id="retrain_models",
            name="Retrain ML Models",
            replace_existing=True
        )

        # Job 5: Check and generate alerts
        self.scheduler.add_job(
            self._check_alerts_job,
            IntervalTrigger(minutes=5),
            id="check_alerts",
            name="Check System Alerts",
            replace_existing=True
        )

        # Job 6: Cleanup old data weekly
        self.scheduler.add_job(
            self._cleanup_old_data_job,
            CronTrigger(day_of_week="sun", hour=3, minute=0),
            id="cleanup_old_data",
            name="Cleanup Old Data",
            replace_existing=True
        )

        self.scheduler.start()
        self.is_running = True
        logger.info("Data pipeline scheduler started")
        self._log_scheduled_jobs()

    def stop(self):
        """Stop the scheduler."""
        if self.is_running:
            self.scheduler.shutdown()
            self.is_running = False
            logger.info("Data pipeline scheduler stopped")

    def _log_scheduled_jobs(self):
        """Log all scheduled jobs."""
        jobs = self.scheduler.get_jobs()
        logger.info(f"Scheduled {len(jobs)} jobs:")
        for job in jobs:
            logger.info(f"  - {job.name}: {job.trigger}")

    async def _fetch_energy_data_job(self):
        """Fetch energy data and store in database."""
        logger.info("Starting energy data fetch job")

        try:
            fetcher = get_aemo_fetcher()
            data = await fetcher.fetch_current_demand()

            if not data:
                logger.warning("No data fetched from AEMO")
                return

            async with async_session() as session:
                for record in data:
                    demand = EnergyDemand(
                        timestamp=record["timestamp"],
                        region=record["region"],
                        demand_mw=record["demand_mw"],
                        price_aud_mwh=record.get("price_aud_mwh"),
                        scheduled_generation=record.get("scheduled_generation"),
                        semi_scheduled_generation=record.get("semi_scheduled_generation"),
                        source=record.get("source", "AEMO")
                    )
                    session.add(demand)

                await session.commit()
                logger.info(f"Stored {len(data)} energy demand records")

        except Exception as e:
            logger.error(f"Energy data fetch job failed: {e}")

    async def _fetch_weather_data_job(self):
        """Fetch weather data for key locations."""
        logger.info("Starting weather data fetch job")

        try:
            fetcher = get_weather_fetcher()
            locations = ["Sydney", "Melbourne", "Brisbane", "Adelaide", "Hobart"]

            async with async_session() as session:
                for location in locations:
                    data = await fetcher.fetch_current_weather(location)

                    weather = WeatherData(
                        timestamp=data["timestamp"],
                        location=location,
                        temperature=data.get("temperature"),
                        humidity=data.get("humidity"),
                        wind_speed=data.get("wind_speed"),
                        cloud_cover=data.get("cloud_cover"),
                        solar_radiation=data.get("solar_radiation"),
                        source=data.get("source", "SAMPLE")
                    )
                    session.add(weather)

                await session.commit()
                logger.info(f"Stored weather data for {len(locations)} locations")

        except Exception as e:
            logger.error(f"Weather data fetch job failed: {e}")

    async def _generate_forecasts_job(self):
        """Generate demand forecasts using trained models."""
        logger.info("Starting forecast generation job")

        try:
            # Import here to avoid circular imports
            from app.services.ml_service import get_ml_service

            ml_service = get_ml_service()

            async with async_session() as session:
                # Get latest data for forecasting
                result = await session.execute(
                    select(EnergyDemand)
                    .where(EnergyDemand.region == "NSW1")
                    .order_by(EnergyDemand.timestamp.desc())
                    .limit(168)  # Last 7 days hourly
                )
                recent_data = result.scalars().all()

                if len(recent_data) < 24:
                    logger.warning("Not enough data for forecasting")
                    return

                # Generate forecasts
                forecasts = await ml_service.generate_forecast(recent_data)

                for fc in forecasts:
                    forecast = Forecast(
                        forecast_timestamp=datetime.utcnow(),
                        target_timestamp=fc["target_timestamp"],
                        region="NSW1",
                        lstm_prediction=fc.get("lstm"),
                        rf_prediction=fc.get("random_forest"),
                        sarima_prediction=fc.get("sarima"),
                        ensemble_prediction=fc.get("ensemble"),
                        lower_bound_95=fc.get("lower_bound"),
                        upper_bound_95=fc.get("upper_bound")
                    )
                    session.add(forecast)

                await session.commit()
                logger.info(f"Generated {len(forecasts)} forecast records")

        except Exception as e:
            logger.error(f"Forecast generation job failed: {e}")

    async def _retrain_models_job(self):
        """Retrain ML models with recent data."""
        logger.info("Starting model retraining job")

        try:
            from app.services.ml_service import get_ml_service

            ml_service = get_ml_service()
            metrics = await ml_service.retrain_models()

            logger.info(f"Model retraining completed: {metrics}")

            # Create alert for retraining
            async with async_session() as session:
                alert = Alert(
                    alert_type="info",
                    severity="low",
                    title="Models Retrained",
                    description=f"ML models retrained with latest data. LSTM accuracy: {metrics.get('lstm_mape', 'N/A')}%",
                    region="ALL"
                )
                session.add(alert)
                await session.commit()

        except Exception as e:
            logger.error(f"Model retraining job failed: {e}")

    async def _check_alerts_job(self):
        """Check conditions and generate alerts."""
        logger.info("Checking alert conditions")

        try:
            async with async_session() as session:
                # Get latest demand data
                result = await session.execute(
                    select(EnergyDemand)
                    .where(EnergyDemand.region == "NSW1")
                    .order_by(EnergyDemand.timestamp.desc())
                    .limit(1)
                )
                latest = result.scalar_one_or_none()

                if not latest:
                    return

                # Check for high demand alert
                if latest.demand_mw > 10000:  # Threshold for NSW
                    existing = await session.execute(
                        select(Alert)
                        .where(Alert.title.like("%High Demand%"))
                        .where(Alert.created_at > datetime.utcnow() - timedelta(hours=1))
                    )
                    if not existing.scalar_one_or_none():
                        alert = Alert(
                            alert_type="warning",
                            severity="high",
                            title="High Demand Warning",
                            description=f"Current demand at {latest.demand_mw:.0f} MW exceeds threshold",
                            region=latest.region
                        )
                        session.add(alert)
                        await session.commit()
                        logger.warning(f"High demand alert created: {latest.demand_mw} MW")

        except Exception as e:
            logger.error(f"Alert check job failed: {e}")

    async def _cleanup_old_data_job(self):
        """Clean up old data to manage database size."""
        logger.info("Starting data cleanup job")

        try:
            cutoff_date = datetime.utcnow() - timedelta(days=90)

            async with async_session() as session:
                # Delete old energy demand records
                result = await session.execute(
                    delete(EnergyDemand).where(EnergyDemand.timestamp < cutoff_date)
                )
                demand_deleted = result.rowcount

                # Delete old weather records
                result = await session.execute(
                    delete(WeatherData).where(WeatherData.timestamp < cutoff_date)
                )
                weather_deleted = result.rowcount

                # Delete old forecasts
                result = await session.execute(
                    delete(Forecast).where(Forecast.forecast_timestamp < cutoff_date)
                )
                forecast_deleted = result.rowcount

                # Delete acknowledged alerts older than 30 days
                alert_cutoff = datetime.utcnow() - timedelta(days=30)
                result = await session.execute(
                    delete(Alert)
                    .where(Alert.acknowledged == True)
                    .where(Alert.created_at < alert_cutoff)
                )
                alerts_deleted = result.rowcount

                await session.commit()

                logger.info(
                    f"Cleanup completed: {demand_deleted} demand, "
                    f"{weather_deleted} weather, {forecast_deleted} forecasts, "
                    f"{alerts_deleted} alerts deleted"
                )

        except Exception as e:
            logger.error(f"Data cleanup job failed: {e}")

    def get_job_status(self) -> dict:
        """Get status of all scheduled jobs."""
        jobs = self.scheduler.get_jobs()
        return {
            "is_running": self.is_running,
            "job_count": len(jobs),
            "jobs": [
                {
                    "id": job.id,
                    "name": job.name,
                    "next_run": job.next_run_time.isoformat() if job.next_run_time else None,
                    "trigger": str(job.trigger)
                }
                for job in jobs
            ]
        }

    async def run_job_now(self, job_id: str):
        """Manually trigger a job."""
        job = self.scheduler.get_job(job_id)
        if job:
            logger.info(f"Manually triggering job: {job_id}")
            await job.func()
        else:
            raise ValueError(f"Job not found: {job_id}")


# Singleton instance
_scheduler: DataPipelineScheduler | None = None


def get_scheduler() -> DataPipelineScheduler:
    """Get or create the scheduler instance."""
    global _scheduler
    if _scheduler is None:
        _scheduler = DataPipelineScheduler()
    return _scheduler
