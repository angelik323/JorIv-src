import { useMarketabilityTypesCollectionStoreV1 } from './marketability-types-v1'

export const useMarketabilityTypesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useMarketabilityTypesCollectionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
