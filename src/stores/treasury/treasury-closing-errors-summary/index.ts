import { useTreasuryClosingErrorsSummaryStoreV1 } from './treasury-closing-errors-summary-v1'

export const useTreasuryClosingErrorsSummaryStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTreasuryClosingErrorsSummaryStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
