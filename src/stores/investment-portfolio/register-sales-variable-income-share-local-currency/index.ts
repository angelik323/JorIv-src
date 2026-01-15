import { useRegisterShareSaleLocalCurrencyStoreV1 } from './register-sales-variable-income-share-local-currency-v1'

export const useRegisterShareSaleLocalCurrencyStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterShareSaleLocalCurrencyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
