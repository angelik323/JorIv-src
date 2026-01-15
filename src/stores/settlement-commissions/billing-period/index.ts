import { useBillingPeriodStoreV2 } from './billing-period-v2'

export const useBillingPeriodStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      throw new Error(`Versión de store no disponible: ${version}`)
    case 'v2':
      return useBillingPeriodStoreV2()
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
