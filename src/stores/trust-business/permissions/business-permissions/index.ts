import { useBusinessPermissionsStoreV1 } from './business-permissions-v1'

export const useBusinessPermissionsStore = (version: 'v1' | 'v2') => {
  switch (version) {
    case 'v1':
      return useBusinessPermissionsStoreV1()
    case 'v2':
      throw new Error(`Versión de store no disponible: ${version}`)
    default:
      throw new Error(`Versión de store no reconocida: ${version}`)
  }
}
