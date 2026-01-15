import { useInterestRatesStoreV1 } from './interest-rates-v1'

export const useInterestRatesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useInterestRatesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
