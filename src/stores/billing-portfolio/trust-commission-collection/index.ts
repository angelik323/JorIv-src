import { useTrustCommissionCollectionStoreV1 } from './trust-commission-collection-v1'

export const useTrustCommissionCollectionStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTrustCommissionCollectionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
