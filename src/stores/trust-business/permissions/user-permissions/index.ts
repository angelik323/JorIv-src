import { useUserPermissionsStoreV1 } from './user-permissions-v1'

export const useUserPermissionsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useUserPermissionsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
