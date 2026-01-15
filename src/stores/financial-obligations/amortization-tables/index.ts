import { useAmortizationTablesStoreV1 } from './amortization-tables-v1'

export const useAmortizationTablesStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useAmortizationTablesStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}