import { useConfigureUserPermissionsFicsStoreV1 } from './configure-user-permissions-fics-v1'

export const useConfigureUserPermissionsFicsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useConfigureUserPermissionsFicsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)

    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
