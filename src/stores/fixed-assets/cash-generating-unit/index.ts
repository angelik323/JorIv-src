import { useCashGeneratingUnitStoreV1 } from './cash-generating-unit-v1'

export const useCashGeneratingUnitStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useCashGeneratingUnitStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
