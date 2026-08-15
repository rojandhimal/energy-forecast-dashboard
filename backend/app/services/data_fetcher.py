"""
Data Fetcher Service for Energy Data

Fetches energy demand data from various public sources:
- AEMO (Australian Energy Market Operator)
- OpenWeatherMap (Weather data)
- Backup: Generated sample data for development

Data is fetched periodically and stored in the database.
"""
import httpx
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from loguru import logger
import asyncio
import json
from pathlib import Path

from app.core import settings


class AEMODataFetcher:
    """
    Fetches energy market data from AEMO (Australian Energy Market Operator).

    AEMO provides public data including:
    - Price and demand data (5-minute intervals)
    - Generation by fuel type
    - Regional reference prices
    """

    # AEMO regions
    REGIONS = ["NSW1", "QLD1", "SA1", "TAS1", "VIC1"]

    # Public data endpoints
    ENDPOINTS = {
        "price_demand": "https://visualisations.aemo.com.au/aemo/apps/api/report/5MIN",
        "dispatch": "https://visualisations.aemo.com.au/aemo/apps/api/report/DISPATCH_SCADA",
    }

    def __init__(self):
        self.client = httpx.AsyncClient(timeout=30.0)
        self.data_dir = Path("data/raw")
        self.data_dir.mkdir(parents=True, exist_ok=True)

    async def fetch_current_demand(self) -> List[Dict[str, Any]]:
        """
        Fetch current demand data from AEMO public API.

        Returns list of demand readings for all regions.
        """
        try:
            # Try AEMO public visualization API
            response = await self.client.get(
                self.ENDPOINTS["price_demand"],
                headers={"Accept": "application/json"}
            )

            if response.status_code == 200:
                data = response.json()
                return self._parse_aemo_response(data)
            else:
                logger.warning(f"AEMO API returned {response.status_code}, using sample data")
                return await self._generate_sample_data()

        except Exception as e:
            logger.error(f"Error fetching AEMO data: {e}")
            return await self._generate_sample_data()

    def _parse_aemo_response(self, data: Dict) -> List[Dict[str, Any]]:
        """Parse AEMO API response into standardized format."""
        records = []

        try:
            # AEMO data structure varies by endpoint
            if isinstance(data, list):
                items = data
            elif "5MIN" in data:
                items = data["5MIN"]
            else:
                items = data.get("data", [])

            for item in items:
                record = {
                    "timestamp": datetime.fromisoformat(
                        item.get("SETTLEMENTDATE", item.get("timestamp", datetime.utcnow().isoformat()))
                    ),
                    "region": item.get("REGIONID", item.get("region", "NSW1")),
                    "demand_mw": float(item.get("TOTALDEMAND", item.get("demand", 0))),
                    "price_aud_mwh": float(item.get("RRP", item.get("price", 0))),
                    "scheduled_generation": float(item.get("SCHEDULEDGENERATION", 0)),
                    "semi_scheduled_generation": float(item.get("SEMISCHEDULEDGENERATION", 0)),
                    "source": "AEMO"
                }
                records.append(record)

        except Exception as e:
            logger.error(f"Error parsing AEMO response: {e}")

        return records

    async def _generate_sample_data(self) -> List[Dict[str, Any]]:
        """
        Generate realistic sample energy data for development/testing.

        Uses patterns typical of Australian energy market:
        - Morning and evening peaks
        - Weekend dips
        - Seasonal variations
        - Random noise
        """
        records = []
        now = datetime.utcnow()

        for region in self.REGIONS:
            # Base demand varies by region
            base_demand = {
                "NSW1": 8000,  # New South Wales - largest
                "VIC1": 5500,  # Victoria
                "QLD1": 6500,  # Queensland
                "SA1": 1500,   # South Australia
                "TAS1": 1000   # Tasmania - smallest
            }

            base = base_demand.get(region, 5000)

            # Time-of-day factor (peak at 18:00, low at 03:00)
            hour = now.hour
            time_factor = 1.0 + 0.3 * np.sin((hour - 6) * np.pi / 12)

            # Day-of-week factor (lower on weekends)
            dow_factor = 0.9 if now.weekday() >= 5 else 1.0

            # Season factor (higher in summer/winter for cooling/heating)
            month = now.month
            season_factor = 1.0 + 0.15 * abs(np.sin((month - 3) * np.pi / 6))

            # Random variation
            noise = np.random.normal(0, 0.05)

            demand = base * time_factor * dow_factor * season_factor * (1 + noise)

            # Price correlates with demand (simplified model)
            price_base = 50  # AUD/MWh
            price = price_base * (demand / base) + np.random.normal(0, 10)
            price = max(0, min(price, 500))  # Cap at reasonable bounds

            records.append({
                "timestamp": now,
                "region": region,
                "demand_mw": round(demand, 2),
                "price_aud_mwh": round(price, 2),
                "scheduled_generation": round(demand * 0.85, 2),
                "semi_scheduled_generation": round(demand * 0.15, 2),
                "source": "SAMPLE"
            })

        return records

    async def fetch_historical_data(
        self,
        start_date: datetime,
        end_date: datetime,
        region: str = "NSW1"
    ) -> pd.DataFrame:
        """
        Fetch or generate historical data for model training.

        For development, generates realistic synthetic data.
        In production, would fetch from AEMO historical archives.
        """
        logger.info(f"Generating historical data from {start_date} to {end_date}")

        dates = pd.date_range(start=start_date, end=end_date, freq="H")
        records = []

        base_demand = 8000  # NSW baseline

        for dt in dates:
            # Time factors
            hour_factor = 1.0 + 0.3 * np.sin((dt.hour - 6) * np.pi / 12)
            dow_factor = 0.9 if dt.weekday() >= 5 else 1.0
            month_factor = 1.0 + 0.15 * abs(np.sin((dt.month - 3) * np.pi / 6))

            # Weather simulation
            temp_base = 20 + 10 * np.sin((dt.month - 1) * np.pi / 6)  # Seasonal temp
            temperature = temp_base + np.random.normal(0, 5)
            humidity = 50 + np.random.normal(0, 15)
            humidity = max(20, min(humidity, 95))
            wind_speed = abs(np.random.normal(15, 8))
            solar = max(0, 800 * np.sin((dt.hour - 6) * np.pi / 12)) if 6 <= dt.hour <= 18 else 0

            # Temperature impact on demand
            temp_factor = 1.0
            if temperature > 30:
                temp_factor = 1.0 + (temperature - 30) * 0.02  # AC load
            elif temperature < 15:
                temp_factor = 1.0 + (15 - temperature) * 0.015  # Heating load

            # Calculate demand
            demand = base_demand * hour_factor * dow_factor * month_factor * temp_factor
            demand *= (1 + np.random.normal(0, 0.03))  # Small noise

            # Price
            price = 50 * (demand / base_demand) + np.random.normal(0, 8)
            price = max(-50, min(price, 300))

            records.append({
                "timestamp": dt,
                "region": region,
                "demand_mw": round(demand, 2),
                "price_aud_mwh": round(price, 2),
                "temperature": round(temperature, 1),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1),
                "solar_radiation": round(solar, 1),
                "hour": dt.hour,
                "day_of_week": dt.weekday(),
                "month": dt.month,
                "is_weekend": int(dt.weekday() >= 5)
            })

        df = pd.DataFrame(records)
        logger.info(f"Generated {len(df)} historical records")
        return df

    async def save_to_csv(self, data: List[Dict], filename: str) -> Path:
        """Save fetched data to CSV file."""
        df = pd.DataFrame(data)
        filepath = self.data_dir / filename
        df.to_csv(filepath, index=False)
        logger.info(f"Saved {len(df)} records to {filepath}")
        return filepath

    async def close(self):
        """Close HTTP client."""
        await self.client.aclose()


class WeatherDataFetcher:
    """
    Fetches weather data for correlation with energy demand.

    Uses OpenWeatherMap or similar free APIs.
    """

    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key
        self.client = httpx.AsyncClient(timeout=30.0)

        # Major Australian city coordinates
        self.locations = {
            "Sydney": (-33.87, 151.21),
            "Melbourne": (-37.81, 144.96),
            "Brisbane": (-27.47, 153.03),
            "Adelaide": (-34.93, 138.60),
            "Hobart": (-42.88, 147.33)
        }

    async def fetch_current_weather(self, location: str = "Sydney") -> Dict[str, Any]:
        """Fetch current weather for a location."""
        if not self.api_key:
            return self._generate_sample_weather(location)

        try:
            lat, lon = self.locations.get(location, self.locations["Sydney"])
            response = await self.client.get(
                f"https://api.openweathermap.org/data/2.5/weather",
                params={
                    "lat": lat,
                    "lon": lon,
                    "appid": self.api_key,
                    "units": "metric"
                }
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    "timestamp": datetime.utcnow(),
                    "location": location,
                    "temperature": data["main"]["temp"],
                    "humidity": data["main"]["humidity"],
                    "wind_speed": data["wind"]["speed"] * 3.6,  # m/s to km/h
                    "cloud_cover": data["clouds"]["all"],
                    "source": "OpenWeatherMap"
                }
        except Exception as e:
            logger.error(f"Weather API error: {e}")

        return self._generate_sample_weather(location)

    def _generate_sample_weather(self, location: str) -> Dict[str, Any]:
        """Generate sample weather data."""
        now = datetime.utcnow()
        month = now.month

        # Seasonal temperature
        base_temp = 22 + 8 * np.sin((month - 1) * np.pi / 6)

        return {
            "timestamp": now,
            "location": location,
            "temperature": round(base_temp + np.random.normal(0, 3), 1),
            "humidity": round(50 + np.random.normal(0, 15), 1),
            "wind_speed": round(abs(np.random.normal(15, 8)), 1),
            "cloud_cover": round(np.random.uniform(0, 100), 1),
            "solar_radiation": round(max(0, 600 * np.sin((now.hour - 6) * np.pi / 12)), 1),
            "source": "SAMPLE"
        }

    async def close(self):
        await self.client.aclose()


# Singleton instances
_aemo_fetcher: Optional[AEMODataFetcher] = None
_weather_fetcher: Optional[WeatherDataFetcher] = None


def get_aemo_fetcher() -> AEMODataFetcher:
    global _aemo_fetcher
    if _aemo_fetcher is None:
        _aemo_fetcher = AEMODataFetcher()
    return _aemo_fetcher


def get_weather_fetcher() -> WeatherDataFetcher:
    global _weather_fetcher
    if _weather_fetcher is None:
        _weather_fetcher = WeatherDataFetcher()
    return _weather_fetcher
