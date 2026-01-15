import { useLocalPurchaseExchangeTradedFundStoreV1 } from './etf-local-buy-v1'

export const useLocalPurchaseExchangeTradedFundStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useLocalPurchaseExchangeTradedFundStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
