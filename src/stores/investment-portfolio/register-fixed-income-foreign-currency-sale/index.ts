import { useRegisterFixedIncomeForeignCurrencySaleStoreV1 } from './register-fixed-income-foreign-currency-sale-v1'

export const useRegisterFixedIncomeForeignCurrencySaleStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterFixedIncomeForeignCurrencySaleStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
