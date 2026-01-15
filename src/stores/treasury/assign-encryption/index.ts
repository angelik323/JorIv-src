import { useAssignEncryptDocumentsStoreV1 } from './assign-encryption-v1'

export const useAssignEncryptStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useAssignEncryptDocumentsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
