import { useCalculationDeteriorationStoreV1 } from './calculation-deterioration-v1'

export const useCalculationDeteriorationStore = (
  version: 'v1' | 'v2' = 'v1'
) => {
  switch (version) {
    case 'v1':
      return useCalculationDeteriorationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
