import { useBudgetSourcesDestinationsStoreV1 } from './budget-sources-destinations-v1'

export const useBudgetSourcesDestinationsStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useBudgetSourcesDestinationsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
