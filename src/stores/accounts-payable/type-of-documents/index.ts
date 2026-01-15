// Stores
import { useTypeOfDocumentsStoreV1 } from './type-of-documents-v1'

export const useTypeOfDocumentsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useTypeOfDocumentsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}

