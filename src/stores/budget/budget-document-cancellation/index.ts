import { useBudgetDocumentCancellationStoreV1 } from './budget-document-cancellation-v1'

export const useBudgetDocumentCancellationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBudgetDocumentCancellationStoreV1()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
