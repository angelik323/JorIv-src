import { useRangesForDeferredStoreV1 } from './ranges-for-deferred-v1'

export const useRangesForDeferredStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useRangesForDeferredStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
