import { useForeignEquityPurchaseStoreV1 } from '@/stores/investment-portfolio/foreign-equity-purchase/foreign-equity-purchase-v1'

export const useForeignEquityPurchaseStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useForeignEquityPurchaseStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
