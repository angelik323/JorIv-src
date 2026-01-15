import { useRegisterFixedIncomeForeignCurrencyStoreV1 } from './register-fixed-income-foreign-currency-v1'

export const useRegisterFixedIncomeForeignCurrencyStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterFixedIncomeForeignCurrencyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
