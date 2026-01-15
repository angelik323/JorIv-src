import { useCurrencyStoreV1 } from './currency-v1'

export const useCurrencyStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCurrencyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
