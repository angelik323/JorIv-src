import { useConsolidatedInvestmentStoreV1 } from './consolidated-investment'

export const useConsolidatedInvestmentStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useConsolidatedInvestmentStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
