import { useRegisterSharePurchaseLocalCurrencyStoreV1 } from './register-share-purchase-local-currency-v1'

export const useRegisterSharePurchaseLocalCurrencyStore = (
  version: 'v1' | 'v2'
) => {
  switch (version) {
    case 'v1':
      return useRegisterSharePurchaseLocalCurrencyStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
