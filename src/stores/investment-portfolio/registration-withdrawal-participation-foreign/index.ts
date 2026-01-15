import { useForeignCurrencyWithdrawalStoreV1 } from './foreign-currency-withdrawal-v1'

export const useForeignCurrencyWithdrawalStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useForeignCurrencyWithdrawalStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
