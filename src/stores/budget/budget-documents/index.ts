import { useBudgetDocumentsStoreV1 } from './budget-documents-v1'

export const useBudgetDocumentsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetDocumentsStoreV1()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
