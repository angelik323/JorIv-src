import { useQualificationsMaintenanceStoreV1 } from './qualifications-maintenance-v1'

export const useQualificationsMaintenanceStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useQualificationsMaintenanceStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
