import { useAmortizationAdvanceCommissionStoreV1 } from './amortization-advance-commission-v1'

export const useAmortizationAdvanceCommissionStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAmortizationAdvanceCommissionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
