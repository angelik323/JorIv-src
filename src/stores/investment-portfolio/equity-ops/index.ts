import { useExchangedTradedFundsStoreV1 } from './equity-ops-v1'

export const useExchangedTradedFundsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useExchangedTradedFundsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
