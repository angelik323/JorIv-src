import { useCashFlowStructuresV1 } from './cash-flow-structures-v1'

export const useCashFlowStructuresStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useCashFlowStructuresV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
