import { useRegisterFixedIncomeLocalCurrencyStoreV1 } from './register-fixed-income-local-currency-v1'

export const useRegisterFixedIncomeLocalCurrencyStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterFixedIncomeLocalCurrencyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
