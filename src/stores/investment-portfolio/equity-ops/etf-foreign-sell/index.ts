import { useForeignSellExchangeTradedFundStoreV1 } from './etf-foreign-sell-v1'

export const useForeignSellExchangeTradedFundStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useForeignSellExchangeTradedFundStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
