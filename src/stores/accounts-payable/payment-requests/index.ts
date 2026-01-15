import { usePaymentRequestsStoreV1 } from './payment-requests-v1'

export const usePaymentRequestsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return usePaymentRequestsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
