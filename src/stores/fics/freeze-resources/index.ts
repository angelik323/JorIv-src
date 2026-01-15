import { useFreezeResourcesStoreV1 } from './freeze-resources-store-v1'

export const useFreezeResourcesStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useFreezeResourcesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
