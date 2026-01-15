import { useConfigCalendarV1 } from './config-calendar-v1'

export const useConfigCalendarStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useConfigCalendarV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
