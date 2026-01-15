import { useConsolidationTreeV1 } from './consolidation-tree-v1'

export const useConsolidationTreeStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useConsolidationTreeV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
