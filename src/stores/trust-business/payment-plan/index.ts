import { usePaymentPlanStoreV1 } from './payment-plan-v1'

export const usePaymentPlanStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return usePaymentPlanStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
