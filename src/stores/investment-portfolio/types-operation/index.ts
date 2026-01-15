import { useTypesOperationCollectionStoreV1 } from './types-operation-v1'

export const useTypesOperationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTypesOperationCollectionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
