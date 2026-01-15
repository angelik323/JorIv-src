import { useSupportingDocumentsStoreV1 } from './supporting-documents-v1'

export const useSupportingDocumentsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useSupportingDocumentsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
