"""
Pydantic schemas for API responses.
"""
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime


class MetricResponse(BaseModel):
    """Single metric for dashboard."""
    id: str
    label: str
    value: float
    displayValue: str
    unit: str
    change: float
    changeText: str
    trend: str
    icon: str


class MetricsResponse(BaseModel):
    """Dashboard metrics response."""
    metrics: List[MetricResponse]
    lastUpdated: datetime


class ForecastSummary(BaseModel):
    """Forecast summary for a period."""
    period: str
    peakDemand: float
    peakDisplay: str
    minDemand: float
    minDisplay: str
    confidence: float


class ChartDataPoint(BaseModel):
    """Single point on forecast chart."""
    label: str
    value: float
    x: float
    y: float


class ChartData(BaseModel):
    """Chart data for visualizations."""
    labels: List[str]
    actual: List[ChartDataPoint]
    lstm: List[ChartDataPoint]
    arima: Optional[List[ChartDataPoint]] = None


class ForecastResponse(BaseModel):
    """Forecasts API response."""
    summary: List[ForecastSummary]
    chartData: ChartData
    lastUpdated: datetime


class ModelInfo(BaseModel):
    """ML model information."""
    id: str
    name: str
    type: str
    accuracy: float
    mae: float
    maeDisplay: str
    rmse: float
    rmseDisplay: str
    mape: float
    mapeDisplay: str
    trainingTime: str
    features: List[str]
    status: str
    isBest: bool


class ModelsResponse(BaseModel):
    """Models API response."""
    models: List[ModelInfo]
    lastUpdated: datetime


class HistoricalStat(BaseModel):
    """Historical statistics."""
    id: str
    label: str
    value: float
    displayValue: str
    description: str


class HistoricalRecord(BaseModel):
    """Single historical record."""
    date: str
    averageLoad: float
    avgDisplay: str
    peakDemand: float
    peakDisplay: str
    renewablePercent: float


class HistoricalResponse(BaseModel):
    """Historical data response."""
    stats: List[HistoricalStat]
    recentHistory: List[HistoricalRecord]
    lastUpdated: datetime


class FeatureInfo(BaseModel):
    """Feature importance information."""
    id: str
    name: str
    importance: float
    category: str
    direction: str
    description: str
    correlation: str


class FeaturesResponse(BaseModel):
    """XAI features response."""
    features: List[FeatureInfo]
    explainability: Dict[str, Any]
    lastUpdated: datetime


class WeatherCurrent(BaseModel):
    """Current weather conditions."""
    temperature: float
    temperatureDisplay: str
    humidity: float
    windSpeed: float
    conditions: str


class WeatherForecast(BaseModel):
    """Weather forecast entry."""
    day: str
    temperature: float
    tempDisplay: str
    humidity: float
    humidityDisplay: str
    windSpeed: float
    windDisplay: str
    demandImpact: float
    impactDisplay: str


class RenewableInfo(BaseModel):
    """Renewable energy info."""
    expected: float
    display: str
    change: float
    changeText: str


class RenewablesResponse(BaseModel):
    """Renewables section."""
    solar: RenewableInfo
    wind: RenewableInfo
    total: RenewableInfo


class WeatherResponse(BaseModel):
    """Weather API response."""
    current: WeatherCurrent
    forecast: List[WeatherForecast]
    renewables: RenewablesResponse
    lastUpdated: datetime


class DataSourceInfo(BaseModel):
    """Data source information."""
    id: str
    name: str
    type: str
    frequency: str
    lastSync: str
    status: str
    recordCount: int
    recordsDisplay: str


class PipelineStage(BaseModel):
    """Pipeline stage status."""
    name: str
    status: str
    statusText: str


class QualityMetric(BaseModel):
    """Data quality metric."""
    name: str
    value: float
    display: str


class DataSourcesResponse(BaseModel):
    """Data sources API response."""
    sources: List[DataSourceInfo]
    pipeline: Dict[str, List[PipelineStage]]
    quality: Dict[str, List[QualityMetric]]
    lastUpdated: datetime


class AlertInfo(BaseModel):
    """Alert information."""
    id: str
    type: str
    severity: str
    title: str
    description: str
    timestamp: datetime
    timeAgo: str
    acknowledged: bool


class AlertsResponse(BaseModel):
    """Alerts API response."""
    alerts: List[AlertInfo]
    summary: Dict[str, Any]
    lastUpdated: datetime


class SchedulerJobInfo(BaseModel):
    """Scheduler job information."""
    id: str
    name: str
    nextRun: Optional[str]
    trigger: str


class SchedulerStatusResponse(BaseModel):
    """Scheduler status response."""
    isRunning: bool
    jobCount: int
    jobs: List[SchedulerJobInfo]


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    version: str
    database: str
    scheduler: str
    modelsLoaded: Dict[str, bool]
