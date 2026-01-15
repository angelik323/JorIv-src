import { useAuthorizationFiduciaryCommissionsStoreV1 } from './authorization-fiduciary-commissions-v1'

export const useAuthorizationFiduciaryCommissionsStore = (
  version: 'v1' | 'v2',
) => {
  switch (version) {
    case 'v1':
      return useAuthorizationFiduciaryCommissionsStoreV1()
    default:
      throw new Error(`Versión de store no disponible: ${version}`)
  }
}
