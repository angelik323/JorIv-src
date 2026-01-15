import { useGenericInvestmentPlansStoreV1 } from './generic-investment-plans-v1'

export const useGenericInvestmentPlansStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useGenericInvestmentPlansStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no válida: ${version}`)
  }
}
