import { useTaxSettlementStoreV1 } from './tax-settlement-v1'

export const useTaxSettlementStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useTaxSettlementStoreV1()
    case 'v2':
      throw new Error(`Versión de store no reconocida: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
