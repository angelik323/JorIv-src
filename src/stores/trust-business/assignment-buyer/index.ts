import { useAssignmentBuyerStoreV1 } from './assignment-buyer-v1'

export const useAssignmentBuyerStore = (version: 'v1' | 'v2' = 'v1') => {
  switch (version) {
    case 'v1':
      return useAssignmentBuyerStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
