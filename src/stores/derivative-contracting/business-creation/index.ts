import { useBusinessCreationStoreV1 } from './business-creation-v1'

export const useBusinessCreationStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBusinessCreationStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
