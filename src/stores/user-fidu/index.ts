import { useUserStoreV1 } from './user-v1'

export const useUserModuleStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useUserStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
