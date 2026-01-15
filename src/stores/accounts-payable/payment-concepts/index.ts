import { usePaymentConceptsStoreV1 } from './payment-concepts-v1'

export const usePaymentConceptsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return usePaymentConceptsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
