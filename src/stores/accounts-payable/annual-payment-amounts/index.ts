import { useAnnualPaymentAmountsStoreV1 } from './annual-payment-amounts-v1'

export const useAnnualPaymentAmountsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useAnnualPaymentAmountsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
