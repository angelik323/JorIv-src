import { useScheduleResourcesV1 } from './schedule-resources-v1'

export const useScheduleResourceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useScheduleResourcesV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
