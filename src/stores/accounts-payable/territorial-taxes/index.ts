// territorial-taxes/index.ts
import { useTerritorialTaxesStoreV1 } from './territorial-taxes-v1'

export const useTerritorialTaxesStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useTerritorialTaxesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
