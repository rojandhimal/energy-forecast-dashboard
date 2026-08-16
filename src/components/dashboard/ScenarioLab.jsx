import { useMemo, useState } from 'react'
import { Card, CardHeader, CardBody } from '../ui/Card'
import './ScenarioLab.css'

const modelAdjustments = {
  LSTM: 1,
  'Random Forest': 0.86,
  SARIMA: 0.72,
  ARIMA: 0.64
}

export function ScenarioLab() {
  const [temperatureUplift, setTemperatureUplift] = useState(3)
  const [solarAvailability, setSolarAvailability] = useState(82)
  const [demandFlex, setDemandFlex] = useState(6)
  const [model, setModel] = useState('LSTM')
  const [reserveMargin, setReserveMargin] = useState(12)

  const scenario = useMemo(() => {
    const weatherDelta = temperatureUplift * 38
    const solarRelief = (solarAvailability - 70) * 3.2
    const flexibilityRelief = demandFlex * 11
    const modelFactor = modelAdjustments[model]
    const peakDelta = Math.round((weatherDelta - solarRelief - flexibilityRelief) * modelFactor)
    const dispatchShift = Math.max(0, Math.round(peakDelta * 0.56))
    const reserveRisk = peakDelta > reserveMargin * 18 ? 'High' : peakDelta > reserveMargin * 9 ? 'Watch' : 'Normal'

    return {
      peakDelta,
      dispatchShift,
      reserveRisk,
      recommendation: dispatchShift > 0 ? `Shift ${dispatchShift} MW` : 'No shift'
    }
  }, [temperatureUplift, solarAvailability, demandFlex, model, reserveMargin])

  return (
    <Card className="scenario-lab" data-od-id="scenario-lab-card">
      <CardHeader title="Scenario Lab" action="Stress test" />
      <CardBody>
        <div className="scenario-intro" data-od-id="scenario-lab-intro">
          Test weather, renewable availability, and demand controls before running the next forecast cycle.
        </div>

        <div className="scenario-controls" data-od-id="scenario-controls">
          <label className="scenario-field" htmlFor="scenario-temperature" data-od-id="scenario-temperature-field">
            <span>Temperature uplift <strong>{temperatureUplift >= 0 ? '+' : ''}{temperatureUplift}°C</strong></span>
            <input
              id="scenario-temperature"
              type="range"
              min="-5"
              max="8"
              value={temperatureUplift}
              onChange={event => setTemperatureUplift(Number(event.target.value))}
            />
          </label>

          <label className="scenario-field" htmlFor="scenario-solar" data-od-id="scenario-solar-field">
            <span>Solar availability <strong>{solarAvailability}%</strong></span>
            <input
              id="scenario-solar"
              type="range"
              min="30"
              max="100"
              value={solarAvailability}
              onChange={event => setSolarAvailability(Number(event.target.value))}
            />
          </label>

          <label className="scenario-field" htmlFor="scenario-flex" data-od-id="scenario-demand-field">
            <span>Controllable demand <strong>{demandFlex}%</strong></span>
            <input
              id="scenario-flex"
              type="range"
              min="0"
              max="14"
              value={demandFlex}
              onChange={event => setDemandFlex(Number(event.target.value))}
            />
          </label>

          <div className="scenario-select-row">
            <label className="scenario-select" htmlFor="scenario-model" data-od-id="scenario-model-field">
              <span>Model</span>
              <select id="scenario-model" value={model} onChange={event => setModel(event.target.value)}>
                <option>LSTM</option>
                <option>Random Forest</option>
                <option>SARIMA</option>
                <option>ARIMA</option>
              </select>
            </label>

            <label className="scenario-select" htmlFor="scenario-reserve" data-od-id="scenario-reserve-field">
              <span>Reserve margin</span>
              <select
                id="scenario-reserve"
                value={reserveMargin}
                onChange={event => setReserveMargin(Number(event.target.value))}
              >
                <option value={12}>12%</option>
                <option value={10}>10%</option>
                <option value={8}>8%</option>
                <option value={6}>6%</option>
              </select>
            </label>
          </div>
        </div>

        <div className="scenario-results" data-od-id="scenario-results">
          <div className="scenario-result" data-od-id="scenario-peak-delta">
            <span>Peak delta</span>
            <strong>{scenario.peakDelta >= 0 ? '+' : ''}{scenario.peakDelta} MW</strong>
          </div>
          <div className="scenario-result" data-od-id="scenario-dispatch-note">
            <span>Dispatch note</span>
            <strong>{scenario.recommendation}</strong>
          </div>
          <div className={`scenario-result risk-${scenario.reserveRisk.toLowerCase()}`} data-od-id="scenario-reserve-risk">
            <span>Reserve risk</span>
            <strong>{scenario.reserveRisk}</strong>
          </div>
        </div>
      </CardBody>
    </Card>
  )
}
