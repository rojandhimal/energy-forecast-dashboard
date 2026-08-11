/**
 * API Service Layer
 *
 * This service abstracts data fetching. Currently uses local JSON files,
 * but can be easily converted to real API calls by changing the fetch functions.
 *
 * To convert to real API:
 * 1. Replace JSON imports with fetch() calls
 * 2. Update BASE_URL to your API endpoint
 * 3. Add authentication headers if needed
 */

// Configuration - change this when connecting to real API
const config = {
  useApi: false, // Set to true when backend is ready
  baseUrl: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  }
}

// Import local JSON data (used when useApi is false)
import metricsJson from '../data/metrics.json'
import forecastsJson from '../data/forecasts.json'
import modelsJson from '../data/models.json'
import historicalJson from '../data/historical.json'
import featuresJson from '../data/features.json'
import weatherJson from '../data/weather.json'
import dataSourcesJson from '../data/dataSources.json'
import alertsJson from '../data/alerts.json'

// Simulate API delay for development
const simulateDelay = (data, delay = 0) => {
  return new Promise(resolve => setTimeout(() => resolve(data), delay))
}

// Generic fetch wrapper for when using real API
async function apiFetch(endpoint) {
  if (!config.useApi) {
    throw new Error('API mode not enabled')
  }

  const response = await fetch(`${config.baseUrl}${endpoint}`, {
    headers: config.headers
  })

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }

  return response.json()
}

// API Functions - these can be called from components

export async function getMetrics() {
  if (config.useApi) {
    return apiFetch('/metrics')
  }
  return simulateDelay(metricsJson)
}

export async function getForecasts() {
  if (config.useApi) {
    return apiFetch('/forecasts')
  }
  return simulateDelay(forecastsJson)
}

export async function getForecastSummary() {
  const data = await getForecasts()
  return data.summary
}

export async function getForecastChart() {
  const data = await getForecasts()
  return data.chartData
}

export async function getModels() {
  if (config.useApi) {
    return apiFetch('/models')
  }
  return simulateDelay(modelsJson)
}

export async function getModelById(id) {
  const data = await getModels()
  return data.models.find(m => m.id === id)
}

export async function getHistorical() {
  if (config.useApi) {
    return apiFetch('/historical')
  }
  return simulateDelay(historicalJson)
}

export async function getHistoricalStats() {
  const data = await getHistorical()
  return data.stats
}

export async function getRecentHistory() {
  const data = await getHistorical()
  return data.recentHistory
}

export async function getFeatures() {
  if (config.useApi) {
    return apiFetch('/features')
  }
  return simulateDelay(featuresJson)
}

export async function getWeather() {
  if (config.useApi) {
    return apiFetch('/weather')
  }
  return simulateDelay(weatherJson)
}

export async function getWeatherForecast() {
  const data = await getWeather()
  return data.forecast
}

export async function getRenewables() {
  const data = await getWeather()
  return data.renewables
}

export async function getDataSources() {
  if (config.useApi) {
    return apiFetch('/data-sources')
  }
  return simulateDelay(dataSourcesJson)
}

export async function getPipelineStatus() {
  const data = await getDataSources()
  return data.pipeline
}

export async function getDataQuality() {
  const data = await getDataSources()
  return data.quality
}

export async function getAlerts() {
  if (config.useApi) {
    return apiFetch('/alerts')
  }
  return simulateDelay(alertsJson)
}

// Sync versions for components that don't need async
// These directly return the imported JSON data

export const metrics = metricsJson
export const forecasts = forecastsJson
export const models = modelsJson
export const historical = historicalJson
export const features = featuresJson
export const weather = weatherJson
export const dataSources = dataSourcesJson
export const alerts = alertsJson

// Export config for testing/debugging
export { config }
