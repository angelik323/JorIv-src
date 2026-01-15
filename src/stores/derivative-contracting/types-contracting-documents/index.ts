import { useTypesContractingDocumentsStoreV1 } from './types-contracting-documents-v1'

export const useTypesContractingDocumentsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTypesContractingDocumentsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
