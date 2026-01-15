import { useFirstAuthorizationTaxSettlementStoreV1 } from './first-authorization-tax-settlement-v1'

export const useFirstAuthorizationTaxSettlementStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useFirstAuthorizationTaxSettlementStoreV1()
    case 'v2':
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}