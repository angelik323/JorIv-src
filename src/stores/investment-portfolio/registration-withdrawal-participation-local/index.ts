import { useLocalCurrencyWithdrawalStoreV1 } from './local-currency-withdrawal-v1'

export const useLocalCurrencyWithdrawalStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useLocalCurrencyWithdrawalStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
