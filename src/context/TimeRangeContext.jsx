import { createContext, useContext, useState } from 'react'

const TimeRangeContext = createContext()

export function TimeRangeProvider({ children }) {
  const [timeRange, setTimeRange] = useState('7D')

  return (
    <TimeRangeContext.Provider value={{ timeRange, setTimeRange }}>
      {children}
    </TimeRangeContext.Provider>
  )
}

export function useTimeRange() {
  const context = useContext(TimeRangeContext)
  if (!context) {
    throw new Error('useTimeRange must be used within a TimeRangeProvider')
  }
  return context
}
