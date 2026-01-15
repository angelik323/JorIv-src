import { useSettlementConceptsStoreV1 } from './settlement-concepts-v1'

export const useSettlementConceptsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useSettlementConceptsStoreV1()
    case 'v2':
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}

