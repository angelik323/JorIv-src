import { useCheckBalanceCostCenterStoreV1 } from './check-balance-cost-center-v1'
export const useCheckBalanceCenterStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCheckBalanceCostCenterStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
