import { usePriceProviderFileStoreV1 } from './price-provider-file-v1'

export const usePriceProviderFileStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return usePriceProviderFileStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
