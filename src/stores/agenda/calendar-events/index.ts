import { useCalendarEventsStoreV1 } from './calendar-events-v1'
import { useCalendarEventsStoreV2 } from './calendar-events-v2'

export const useCalendarEventsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCalendarEventsStoreV1()
    case 'v2':
      return useCalendarEventsStoreV2()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
