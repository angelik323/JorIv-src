import { useBudgetDocumentTypesStoreV1 } from './budget-document-types-v1'

export const useBudgetDocumentTypesStore = (version: 'v1' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBudgetDocumentTypesStoreV1()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
