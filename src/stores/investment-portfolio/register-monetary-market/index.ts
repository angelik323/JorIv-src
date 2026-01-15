import { useMonetaryMarketOperationsStoreV1 } from './register-monetary-market-v1'

export const useMonetaryMarketOperationsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useMonetaryMarketOperationsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
