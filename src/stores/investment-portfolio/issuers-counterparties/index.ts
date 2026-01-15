import { useIssuersCounterpartiesStoreV1 } from './issuers-counterparties-v1'

export const useIssuersCounterpartiesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useIssuersCounterpartiesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
