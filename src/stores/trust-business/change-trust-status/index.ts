import { useChangeTrustStatusStoreV1 } from './change-trust-status-v1'

export const useChangeTrustStatusStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useChangeTrustStatusStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
