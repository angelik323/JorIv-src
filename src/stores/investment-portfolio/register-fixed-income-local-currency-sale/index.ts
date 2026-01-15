import { useRegisterFixedIncomeLocalCurrencySaleStoreV1 } from './register-fixed-income-local-currency-sale-v1'

export const useRegisterFixedIncomeLocalCurrencySaleStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterFixedIncomeLocalCurrencySaleStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
