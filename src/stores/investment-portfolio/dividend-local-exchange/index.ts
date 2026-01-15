import { useDividendLocalStoreV1 } from './dividend-local-v1'

export const useDividendLocalStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useDividendLocalStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
