import { useScheduleDeferralStoreV1 } from './schedule-deferral-v1'

export const useScheduleDeferralStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useScheduleDeferralStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
