import { useAmortizationTitleTableCollectionStoreV1 } from './amortization-title-table-v1'

export const useAmortizationTableStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAmortizationTitleTableCollectionStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
