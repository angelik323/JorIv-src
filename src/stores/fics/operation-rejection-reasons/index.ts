import { useOperationRejectionReasonsStoreV1 } from './operation-rejection-reasons-v1'

export const useOperationRejectionReasonsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useOperationRejectionReasonsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
