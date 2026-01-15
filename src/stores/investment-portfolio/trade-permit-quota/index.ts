import { useTradePermitQuotaCollectionStoreV1 } from './trade-permit-quota-v1'

export const useTradePermitQuotaStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTradePermitQuotaCollectionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
