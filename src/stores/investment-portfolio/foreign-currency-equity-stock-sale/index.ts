import { useForeignCurrencyEquityStockSaleStoreV1 } from './foreign-currency-equity-stock-sale-v1'

export const useForeignCurrencyEquityStockSaleStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useForeignCurrencyEquityStockSaleStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
