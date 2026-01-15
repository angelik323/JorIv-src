import { useDividendPaymentForeignCurrencyStoreV1 } from './dividend-payment-foreign-currency-v1'

export const useDividendPaymentForeignCurrencyStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useDividendPaymentForeignCurrencyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
