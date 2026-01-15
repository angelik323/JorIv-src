import { useLocalSellExchangeTradedFundStoreV1 } from './etf-local-sell-v1'

export const useLocalSellExchangeTradedFundStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useLocalSellExchangeTradedFundStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
