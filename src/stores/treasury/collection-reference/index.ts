import { useCollectionReferenceStoreV1 } from './collection-reference-v1'

export const useCollectionReferenceStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCollectionReferenceStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
