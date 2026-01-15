import { useAttachedDocumentsStoreV1 } from './attached-documents-v1'

export const useAttachedDocumentsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAttachedDocumentsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no soportada: ${version}`)
  }
}
