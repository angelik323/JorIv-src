import { useTrustBusinessDocumentStructureStoreV1 } from './trust-business-document-structure-v1'

export const useTrustBusinessDocumentStructureStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useTrustBusinessDocumentStructureStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
