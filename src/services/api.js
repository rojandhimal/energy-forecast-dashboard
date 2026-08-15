/**
 * API Service Layer
 *
 * Connects to the FastAPI backend for real-time energy data.
 * Falls back to local JSON files when backend is unavailable.
 */

// Configuration
const config = {
  useApi: true,  // Enable API mode
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Import local JSON data as fallback
import metricsJson from '../data/metrics.json'
import forecastsJson from '../data/forecasts.json'
import modelsJson from '../data/models.json'
import historicalJson from '../data/historical.json'
import featuresJson from '../data/features.json'
import weatherJson from '../data/weather.json'
import dataSourcesJson from '../data/dataSources.json'
import alertsJson from '../data/alerts.json'

/**
 * Fetch with timeout and error handling
 */
async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.timeout)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { ...config.headers, ...options.headers }
    })

    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  } catch (error) {
    clearTimeout(timeoutId)
    if (error.name === 'AbortError') {
      throw new Error('Request timeout')
    }
    throw error
  }
}

/**
 * API fetch with automatic fallback to local data
 */
async function apiFetch(endpoint, fallbackData = null) {
  if (!config.useApi) {
    return fallbackData
  }

  try {
    const data = await fetchWithTimeout(`${config.baseUrl}${endpoint}`)
    return data
  } catch (error) {
    console.warn(`API fetch failed for ${endpoint}:`, error.message)
    console.info('Falling back to local data')
    return fallbackData
  }
}

// Helper to get data by time range from local JSON
function getByTimeRange(data, timeRange = '7D') {
  if (data[timeRange]) {
    return data[timeRange]
  }
  return data
}

// ============================================
// API Functions - Dashboard Data
// ============================================

export async function getMetrics(timeRange = '7D') {
  const fallback = getByTimeRange(metricsJson, timeRange)
  return apiFetch(`/metrics?range=${timeRange}`, fallback)
}

export async function getForecasts(timeRange = '7D') {
  const fallback = getByTimeRange(forecastsJson, timeRange)
  return apiFetch(`/forecasts?range=${timeRange}`, fallback)
}

export async function getModels() {
  return apiFetch('/models', modelsJson)
}

export async function getHistorical(days = 7) {
  return apiFetch(`/historical?days=${days}`, historicalJson)
}

export async function getFeatures() {
  return apiFetch('/features', featuresJson)
}

export async function getWeather() {
  return apiFetch('/weather', weatherJson)
}

export async function getDataSources() {
  return apiFetch('/data-sources', dataSourcesJson)
}

export async function getAlerts() {
  return apiFetch('/alerts', alertsJson)
}

export async function getHealth() {
  return apiFetch('/health', { status: 'unknown' })
}

// ============================================
// Scheduler Control Endpoints
// ============================================

export async function getSchedulerStatus() {
  return apiFetch('/scheduler/status', { isRunning: false, jobs: [] })
}

export async function startScheduler() {
  return fetchWithTimeout(`${config.baseUrl}/scheduler/start`, { method: 'POST' })
}

export async function stopScheduler() {
  return fetchWithTimeout(`${config.baseUrl}/scheduler/stop`, { method: 'POST' })
}

export async function runJob(jobId) {
  return fetchWithTimeout(`${config.baseUrl}/scheduler/run/${jobId}`, { method: 'POST' })
}

export async function retrainModels() {
  return fetchWithTimeout(`${config.baseUrl}/models/retrain`, { method: 'POST' })
}

// ============================================
// Sync versions for SSR/initial render
// ============================================

export function getMetricsSync(timeRange = '7D') {
  return getByTimeRange(metricsJson, timeRange)
}

export function getForecastsSync(timeRange = '7D') {
  return getByTimeRange(forecastsJson, timeRange)
}

export function getMethodology() {
  return forecastsJson.methodology
}

// Static exports for fallback
export const models = modelsJson
export const historical = historicalJson
export const features = featuresJson
export const weather = weatherJson
export const dataSources = dataSourcesJson
export const alerts = alertsJson

// Export config
export { config }

// ============================================
// API Status Check
// ============================================

let _apiAvailable = null

export async function checkApiStatus() {
  if (_apiAvailable !== null) return _apiAvailable

  try {
    await fetchWithTimeout(`${config.baseUrl}/health`)
    _apiAvailable = true
    console.info('Backend API connected:', config.baseUrl)
  } catch {
    _apiAvailable = false
    console.warn('Backend API unavailable, using local data')
  }

  return _apiAvailable
}

export function isApiAvailable() {
  return _apiAvailable
}
