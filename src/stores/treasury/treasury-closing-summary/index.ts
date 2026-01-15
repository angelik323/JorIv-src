import { useTreasuryClosingSummaryStoreV1 } from './treasury-closing-summary-v1'

export const useTreasuryClosingSummaryStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTreasuryClosingSummaryStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
