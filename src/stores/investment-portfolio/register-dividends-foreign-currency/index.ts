import { useRegisterDividendsForeignCurrencyStoreV1 } from './register-dividends-foreign-currency-v1'

export const useRegisterDividendsForeignCurrencyStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterDividendsForeignCurrencyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
