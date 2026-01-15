import { useTitlesMergingStoreV1 } from './titles-merging-v1'

export const useTitlesMergingStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTitlesMergingStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
